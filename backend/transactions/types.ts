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

// Invoice types for detailed invoice display
export interface InvoiceCustomer {
  id: number;
  customer_code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  id_card_number?: string;
  type: "individual" | "corporate";
}

export interface InvoiceVehicle {
  id: number;
  vehicle_code: string;
  chassis_number: string;
  license_plate?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  color?: string;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
}

export interface InvoiceCashier {
  id: number;
  full_name: string;
  username: string;
}

export interface InvoiceDetails {
  invoice_number: string;
  transaction_date: Date;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
}

export interface SalesInvoiceDetails extends InvoiceDetails {
  discount_amount: number;
}

export interface PurchaseInvoice {
  transaction: PurchaseTransaction;
  customer: InvoiceCustomer;
  vehicle: InvoiceVehicle;
  cashier: InvoiceCashier;
  invoice_details: InvoiceDetails;
}

export interface SalesInvoice {
  transaction: SalesTransaction;
  customer: InvoiceCustomer;
  vehicle: InvoiceVehicle;
  cashier: InvoiceCashier;
  invoice_details: SalesInvoiceDetails;
}
