import { api } from "encore.dev/api";
import { customersDB } from "./db";
import { CreateCustomerRequest, Customer } from "./types";

// Creates a new customer record.
export const createCustomer = api<CreateCustomerRequest, Customer>(
  { expose: true, method: "POST", path: "/customers" },
  async (req) => {
    // Generate customer code
    const codePrefix = req.type === "individual" ? "IND" : "COR";
    const timestamp = Date.now().toString().slice(-6);
    const customerCode = `${codePrefix}${timestamp}`;

    // TODO: Get created_by from auth context
    const createdBy = 1; // Placeholder

    const customer = await customersDB.queryRow<Customer>`
      INSERT INTO customers (customer_code, name, phone, email, address, id_card_number, type, created_by)
      VALUES (${customerCode}, ${req.name}, ${req.phone}, ${req.email}, ${req.address}, ${req.id_card_number}, ${req.type}, ${createdBy})
      RETURNING id, customer_code, name, phone, email, address, id_card_number, type, created_at, updated_at, created_by, is_active
    `;

    return customer!;
  }
);
