import { APIError, Header } from "encore.dev/api";
import { authDB } from "./db";
import { User, UserRole } from "./types";

interface AuthContext {
  user: User;
  sessionToken: string;
}

// Get authenticated user from session token
export async function getAuthenticatedUser(authHeader?: string): Promise<AuthContext | null> {
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return null;
  }

  // Get active session
  const session = await authDB.queryRow<{ user_id: number; is_active: boolean }>`
    SELECT user_id, is_active 
    FROM user_sessions 
    WHERE session_token = ${token} AND is_active = true AND logout_at IS NULL
  `;

  if (!session || !session.is_active) {
    return null;
  }

  // Get user details
  const user = await authDB.queryRow<User>`
    SELECT id, username, email, full_name, phone, role, is_active, created_at, updated_at
    FROM users 
    WHERE id = ${session.user_id} AND is_active = true
  `;

  if (!user) {
    return null;
  }

  return {
    user,
    sessionToken: token
  };
}

// Require authentication for endpoint
export async function requireAuth(authHeader?: string): Promise<AuthContext> {
  const authContext = await getAuthenticatedUser(authHeader);
  if (!authContext) {
    throw APIError.unauthenticated("Authentication required");
  }
  return authContext;
}

// Require specific role for endpoint
export async function requireRole(authHeader: string | undefined, allowedRoles: UserRole[]): Promise<AuthContext> {
  const authContext = await requireAuth(authHeader);
  
  if (!allowedRoles.includes(authContext.user.role)) {
    throw APIError.permissionDenied(`Access denied. Required roles: ${allowedRoles.join(", ")}`);
  }
  
  return authContext;
}

// Check if user has permission for specific action
export function hasPermission(userRole: UserRole, action: string, resource: string): boolean {
  const permissions: Record<UserRole, Record<string, string[]>> = {
    admin: {
      "*": ["*"] // Admin has access to everything
    },
    cashier: {
      customers: ["create", "read", "update"],
      vehicles: ["create", "read", "update"],
      transactions: ["create", "read"],
      reports: ["read_basic"],
      spare_parts: ["read"]
    },
    mechanic: {
      vehicles: ["read", "update_condition"],
      repairs: ["create", "read", "update"],
      spare_parts: ["read", "use"],
      vehicle_images: ["create", "read"]
    }
  };

  const userPermissions = permissions[userRole];
  if (!userPermissions) {
    return false;
  }

  // Admin has access to everything
  if (userPermissions["*"] && userPermissions["*"].includes("*")) {
    return true;
  }

  const resourcePermissions = userPermissions[resource];
  if (!resourcePermissions) {
    return false;
  }

  return resourcePermissions.includes(action) || resourcePermissions.includes("*");
}

// Audit log for sensitive operations
export async function auditLog(
  userId: number,
  action: string,
  resource: string,
  resourceId?: number,
  details?: any
): Promise<void> {
  await authDB.exec`
    INSERT INTO audit_logs (user_id, action, resource, resource_id, details, created_at)
    VALUES (${userId}, ${action}, ${resource}, ${resourceId}, ${JSON.stringify(details)}, NOW())
  `;
}
