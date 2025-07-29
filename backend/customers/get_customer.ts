import { api, APIError } from "encore.dev/api";
import { customersDB } from "./db";
import { Customer } from "./types";

interface GetCustomerRequest {
  id: number;
}

// Retrieves a specific customer by ID.
export const getCustomer = api<GetCustomerRequest, Customer>(
  { expose: true, method: "GET", path: "/customers/:id" },
  async (req) => {
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
