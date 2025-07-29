import { api, APIError, Header } from "encore.dev/api";
import { customersDB } from "./db";
import { Customer } from "./types";
import { requireRole } from "../auth/auth_middleware";

interface AuthenticatedGetCustomerRequest {
  id: number;
  authorization?: Header<"Authorization">;
}

// Retrieves a specific customer by ID.
export const getCustomer = api<AuthenticatedGetCustomerRequest, Customer>(
  { expose: true, method: "GET", path: "/customers/:id" },
  async (req) => {
    // Require cashier or admin role
    await requireRole(req.authorization, ["admin", "cashier"]);

    const customer = await customersDB.queryRow<Customer>`
      SELECT id, customer_code, name, phone, email, address, id_card_number, type, created_at, updated_at, created_by, is_active
      FROM customers 
      WHERE id = ${req.id} AND is_active = true
    `;

    if (!customer) {
      throw APIError.notFound("Customer not found");
    }

    return customer;
  }
);
