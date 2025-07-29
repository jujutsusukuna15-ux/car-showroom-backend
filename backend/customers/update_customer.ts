import { api, APIError, Header } from "encore.dev/api";
import { customersDB } from "./db";
import { UpdateCustomerRequest, Customer } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedUpdateCustomerRequest extends UpdateCustomerRequest {
  id: number;
  authorization?: Header<"Authorization">;
}

// Updates an existing customer record.
export const updateCustomer = api<AuthenticatedUpdateCustomerRequest, Customer>(
  { expose: true, method: "PUT", path: "/customers/:id" },
  async (req) => {
    // Require cashier or admin role
    const authContext = await requireRole(req.authorization, ["admin", "cashier"]);

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(req.name);
      paramIndex++;
    }

    if (req.phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      params.push(req.phone);
      paramIndex++;
    }

    if (req.email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      params.push(req.email);
      paramIndex++;
    }

    if (req.address !== undefined) {
      updates.push(`address = $${paramIndex}`);
      params.push(req.address);
      paramIndex++;
    }

    if (req.id_card_number !== undefined) {
      updates.push(`id_card_number = $${paramIndex}`);
      params.push(req.id_card_number);
      paramIndex++;
    }

    if (req.type !== undefined) {
      updates.push(`type = $${paramIndex}`);
      params.push(req.type);
      paramIndex++;
    }

    if (req.is_active !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(req.is_active);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.id);

    const customer = await customersDB.rawQueryRow<Customer>(
      `UPDATE customers 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, customer_code, name, phone, email, address, id_card_number, type, created_at, updated_at, created_by, is_active`,
      ...params
    );

    if (!customer) {
      throw APIError.notFound("Customer not found");
    }

    // Audit log
    await auditLog(
      authContext.user.id,
      "update",
      "customer",
      req.id,
      { updated_fields: Object.keys(req).filter(key => key !== "id" && key !== "authorization") }
    );

    return customer;
  }
);
