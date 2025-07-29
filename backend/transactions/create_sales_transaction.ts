import { api, APIError, Header } from "encore.dev/api";
import { transactionsDB } from "./db";
import { CreateSalesTransactionRequest, SalesTransaction } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedCreateSalesTransactionRequest extends CreateSalesTransactionRequest {
  authorization?: Header<"Authorization">;
}

// Creates a new sales transaction (selling vehicle to customer).
export const createSalesTransaction = api<AuthenticatedCreateSalesTransactionRequest, SalesTransaction>(
  { expose: true, method: "POST", path: "/transactions/sales" },
  async (req) => {
    // Require cashier or admin role
    const authContext = await requireRole(req.authorization, ["admin", "cashier"]);

    // Check if vehicle exists and is ready to sell
    const vehicle = await transactionsDB.queryRow<{ id: number; status: string; approved_selling_price?: number }>`
      SELECT id, status, approved_selling_price FROM vehicles WHERE id = ${req.vehicle_id}
    `;

    if (!vehicle) {
      throw APIError.notFound("Vehicle not found");
    }

    if (vehicle.status !== "ready_to_sell") {
      throw APIError.failedPrecondition("Vehicle is not ready for sale");
    }

    if (!vehicle.approved_selling_price) {
      throw APIError.failedPrecondition("Vehicle price not approved yet");
    }

    // Check if customer exists
    const customer = await transactionsDB.queryRow`
      SELECT id FROM customers WHERE id = ${req.customer_id} AND is_active = true
    `;

    if (!customer) {
      throw APIError.notFound("Customer not found");
    }

    // Generate transaction and invoice numbers
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = Date.now().toString().slice(-4);
    const transactionNumber = `SAL-${today}-${timestamp}`;
    const invoiceNumber = `INV-SAL-${today}-${timestamp}`;

    // Calculate amounts
    const taxRate = req.tax_rate || 0.1; // Default 10%
    const discountAmount = req.discount_amount || 0;
    const taxAmount = (req.vehicle_price - discountAmount) * taxRate;
    const totalAmount = req.vehicle_price + taxAmount - discountAmount;

    // Start transaction
    await transactionsDB.exec`BEGIN`;

    try {
      // Create sales transaction
      const transaction = await transactionsDB.queryRow<SalesTransaction>`
        INSERT INTO sales_transactions (
          transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
          tax_amount, discount_amount, total_amount, payment_method, payment_reference, 
          cashier_id, notes
        )
        VALUES (
          ${transactionNumber}, ${invoiceNumber}, ${req.vehicle_id}, ${req.customer_id}, 
          ${req.vehicle_price}, ${taxAmount}, ${discountAmount}, ${totalAmount}, 
          ${req.payment_method}, ${req.payment_reference}, ${authContext.user.id}, ${req.notes}
        )
        RETURNING id, transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
                  tax_amount, discount_amount, total_amount, payment_method, payment_reference, 
                  transaction_date, cashier_id, status, notes, created_at
      `;

      // Update vehicle with sales details
      await transactionsDB.exec`
        UPDATE vehicles 
        SET final_selling_price = ${req.vehicle_price},
            sold_to_customer_id = ${req.customer_id},
            sold_by_cashier = ${authContext.user.id},
            sold_at = NOW(),
            status = 'sold',
            updated_at = NOW()
        WHERE id = ${req.vehicle_id}
      `;

      await transactionsDB.exec`COMMIT`;

      // Audit log
      await auditLog(
        authContext.user.id,
        "create",
        "sales_transaction",
        transaction!.id,
        { 
          transaction_number: transactionNumber,
          vehicle_id: req.vehicle_id,
          customer_id: req.customer_id,
          amount: totalAmount
        }
      );

      return transaction!;
    } catch (error) {
      await transactionsDB.exec`ROLLBACK`;
      throw error;
    }
  }
);
