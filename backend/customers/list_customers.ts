import { api, Query, Header } from "encore.dev/api";
import { customersDB } from "./db";
import { ListCustomersResponse, Customer, CustomerType } from "./types";
import { requireRole } from "../auth/auth_middleware";

interface AuthenticatedListCustomersRequest {
  page?: Query<number>;
  limit?: Query<number>;
  type?: Query<CustomerType>;
  search?: Query<string>;
  authorization?: Header<"Authorization">;
}

// Retrieves all customers with optional filtering and search.
export const listCustomers = api<AuthenticatedListCustomersRequest, ListCustomersResponse>(
  { expose: true, method: "GET", path: "/customers" },
  async (req) => {
    // Require cashier or admin role
    await requireRole(req.authorization, ["admin", "cashier"]);

    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_active = true";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.type) {
      whereClause += ` AND type = $${paramIndex}`;
      params.push(req.type);
      paramIndex++;
    }

    if (req.search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR customer_code ILIKE $${paramIndex})`;
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    const customers = await customersDB.rawQueryAll<Customer>(
      `SELECT id, customer_code, name, phone, email, address, id_card_number, type, created_at, updated_at, created_by, is_active
       FROM customers ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await customersDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM customers ${whereClause}`,
      ...params
    );

    return {
      customers,
      total: totalResult?.count || 0
    };
  }
);
