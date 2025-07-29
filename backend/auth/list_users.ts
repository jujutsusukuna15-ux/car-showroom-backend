import { api, Query } from "encore.dev/api";
import { authDB } from "./db";
import { ListUsersResponse, User } from "./types";

interface ListUsersRequest {
  page?: Query<number>;
  limit?: Query<number>;
  role?: Query<string>;
  is_active?: Query<boolean>;
}

// Retrieves all users with optional filtering.
export const listUsers = api<ListUsersRequest, ListUsersResponse>(
  { expose: true, method: "GET", path: "/auth/users" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.role) {
      whereClause += ` AND role = $${paramIndex}`;
      params.push(req.role);
      paramIndex++;
    }

    if (req.is_active !== undefined) {
      whereClause += ` AND is_active = $${paramIndex}`;
      params.push(req.is_active);
      paramIndex++;
    }

    const users = await authDB.rawQueryAll<User>(
      `SELECT id, username, email, full_name, phone, role, is_active, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await authDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM users ${whereClause}`,
      ...params
    );

    return {
      users,
      total: totalResult?.count || 0
    };
  }
);
