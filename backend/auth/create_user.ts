import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import { CreateUserRequest, User } from "./types";
import * as bcrypt from "bcrypt";

// Creates a new user account.
export const createUser = api<CreateUserRequest, User>(
  { expose: true, method: "POST", path: "/auth/users" },
  async (req) => {
    // Check if username or email already exists
    const existingUser = await authDB.queryRow`
      SELECT id FROM users WHERE username = ${req.username} OR email = ${req.email}
    `;
    
    if (existingUser) {
      throw APIError.alreadyExists("Username or email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(req.password, 10);

    // Insert new user
    const user = await authDB.queryRow<User>`
      INSERT INTO users (username, email, password_hash, full_name, phone, role)
      VALUES (${req.username}, ${req.email}, ${passwordHash}, ${req.full_name}, ${req.phone}, ${req.role})
      RETURNING id, username, email, full_name, phone, role, is_active, created_at, updated_at
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

    return user;
  }
);
