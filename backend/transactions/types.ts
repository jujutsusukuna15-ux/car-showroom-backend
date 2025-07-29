export interface PurchaseTransaction {
  id: number;
  transaction_number: string;
  invoice_number: string;
  vehicle_id: number;
  customer_id: number;
  vehicle_price: number;
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  transaction_date: Date;
  cashier_id: number;
  status: TransactionStatus;
  notes?: string;
  created_at: Date;
}

export interface SalesTransaction {
  id: number;
  transaction_number: string;
  invoice_number: string;
  vehicle_id: number;
  customer_id: number;
  vehicle_price: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  transaction_date: Date;
  cashier_id: number;
  status: TransactionStatus;
  notes?: string;
  created_at: Date;
}

export type PaymentMethod = "cash" | "transfer" | "check" | "credit";
export type TransactionStatus = "completed" | "cancelled";

export interface CreatePurchaseTransactionRequest {
  vehicle_id: number;
  customer_id: number;
  vehicle_price: number;
  tax_rate?: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  notes?: string;
}

export interface CreateSalesTransactionRequest {
  vehicle_id: number;
  customer_id: number;
  vehicle_price: number;
  tax_rate?: number;
  discount_amount?: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  notes?: string;
}

export interface ListTransactionsResponse<T> {
  transactions: T[];
  total: number;
}

export interface TransactionSummary {
  total_purchases: number;
  total_sales: number;
  total_purchase_amount: number;
  total_sales_amount: number;
  profit: number;
  transaction_count: number;
}
