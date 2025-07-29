import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import { LoginRequest, LoginResponse, User } from "./types";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

// Authenticates a user and creates a session.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Find user by username
    const user = await authDB.queryRow<User & { password_hash: string }>`
      SELECT id, username, email, password_hash, full_name, phone, role, is_active, created_at, updated_at
      FROM users 
      WHERE username = ${req.username} AND is_active = true
    `;

    if (!user) {
      throw APIError.unauthenticated("Invalid username or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(req.password, user.password_hash);
    if (!isValidPassword) {
      throw APIError.unauthenticated("Invalid username or password");
    }

    // Generate session token
    const sessionToken = randomBytes(32).toString("hex");

    // Create session
    await authDB.exec`
      INSERT INTO user_sessions (user_id, session_token)
      VALUES (${user.id}, ${sessionToken})
    `;

    // Remove password_hash from response
    const { password_hash, ...userResponse } = user;

    return {
      user: userResponse,
      session_token: sessionToken
    };
  }
);
