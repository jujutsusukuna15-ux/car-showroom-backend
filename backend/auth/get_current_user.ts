import { api, Header } from "encore.dev/api";
import { requireAuth } from "./auth_middleware";
import { User } from "./types";

interface GetCurrentUserRequest {
  authorization?: Header<"Authorization">;
}

// Gets the current authenticated user's information.
export const getCurrentUser = api<GetCurrentUserRequest, User>(
  { expose: true, method: "GET", path: "/auth/me" },
  async (req) => {
    const authContext = await requireAuth(req.authorization);
    return authContext.user;
  }
);
