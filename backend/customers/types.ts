export interface Customer {
  id: number;
  customer_code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  id_card_number?: string;
  type: CustomerType;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  is_active: boolean;
}

export type CustomerType = "individual" | "corporate";

export interface CreateCustomerRequest {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  id_card_number?: string;
  type: CustomerType;
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  id_card_number?: string;
  type?: CustomerType;
  is_active?: boolean;
}

export interface ListCustomersResponse {
  customers: Customer[];
  total: number;
}

export interface CustomerSearchRequest {
  query?: string;
  type?: CustomerType;
  page?: number;
  limit?: number;
}
