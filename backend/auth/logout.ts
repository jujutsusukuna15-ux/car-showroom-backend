import { api, APIError, Header } from "encore.dev/api";
import { authDB } from "./db";

interface LogoutRequest {
  authorization: Header<"Authorization">;
}

// Logs out a user by invalidating their session.
export const logout = api<LogoutRequest, void>(
  { expose: true, method: "POST", path: "/auth/logout" },
  async (req) => {
    const token = req.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("Missing authorization token");
    }

    await authDB.exec`
      UPDATE user_sessions 
      SET logout_at = NOW(), is_active = false 
      WHERE session_token = ${token} AND is_active = true
    `;
  }
);
