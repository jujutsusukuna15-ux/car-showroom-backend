export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = "admin" | "mechanic" | "cashier";

export interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  login_at: Date;
  logout_at?: Date;
  ip_address?: string;
  is_active: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session_token: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface ListUsersResponse {
  users: User[];
  total: number;
}
