import { api, Header } from "encore.dev/api";
import { customersDB } from "./db";
import { CreateCustomerRequest, Customer } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedCreateCustomerRequest extends CreateCustomerRequest {
  authorization?: Header<"Authorization">;
}

// Creates a new customer record.
export const createCustomer = api<AuthenticatedCreateCustomerRequest, Customer>(
  { expose: true, method: "POST", path: "/customers" },
  async (req) => {
    // Require cashier or admin role
    const authContext = await requireRole(req.authorization, ["admin", "cashier"]);

    // Generate customer code
    const codePrefix = req.type === "individual" ? "IND" : "COR";
    const timestamp = Date.now().toString().slice(-6);
    const customerCode = `${codePrefix}${timestamp}`;

    const customer = await customersDB.queryRow<Customer>`
      INSERT INTO customers (customer_code, name, phone, email, address, id_card_number, type, created_by)
      VALUES (${customerCode}, ${req.name}, ${req.phone}, ${req.email}, ${req.address}, ${req.id_card_number}, ${req.type}, ${authContext.user.id})
      RETURNING id, customer_code, name, phone, email, address, id_card_number, type, created_at, updated_at, created_by, is_active
    `;

    // Audit log
    await auditLog(
      authContext.user.id,
      "create",
      "customer",
      customer!.id,
      { customer_code: customerCode, name: req.name, type: req.type }
    );

    return customer!;
  }
);
