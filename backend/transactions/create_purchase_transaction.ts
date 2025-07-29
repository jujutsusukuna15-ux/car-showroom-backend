import { api, APIError, Header } from "encore.dev/api";
import { transactionsDB } from "./db";
import { CreatePurchaseTransactionRequest, PurchaseTransaction } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedCreatePurchaseTransactionRequest extends CreatePurchaseTransactionRequest {
  authorization?: Header<"Authorization">;
}

// Creates a new purchase transaction (buying vehicle from customer).
export const createPurchaseTransaction = api<AuthenticatedCreatePurchaseTransactionRequest, PurchaseTransaction>(
  { expose: true, method: "POST", path: "/transactions/purchases" },
  async (req) => {
    // Require cashier or admin role
    const authContext = await requireRole(req.authorization, ["admin", "cashier"]);

    // Check if vehicle exists and is not already purchased
    const vehicle = await transactionsDB.queryRow<{ id: number; status: string }>`
      SELECT id, status FROM vehicles WHERE id = ${req.vehicle_id}
    `;

    if (!vehicle) {
      throw APIError.notFound("Vehicle not found");
    }

    if (vehicle.status !== "purchased") {
      throw APIError.failedPrecondition("Vehicle is not available for purchase transaction");
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
    const transactionNumber = `PUR-${today}-${timestamp}`;
    const invoiceNumber = `INV-PUR-${today}-${timestamp}`;

    // Calculate amounts
    const taxRate = req.tax_rate || 0.1; // Default 10%
    const taxAmount = req.vehicle_price * taxRate;
    const totalAmount = req.vehicle_price + taxAmount;

    // Start transaction
    await transactionsDB.exec`BEGIN`;

    try {
      // Create purchase transaction
      const transaction = await transactionsDB.queryRow<PurchaseTransaction>`
        INSERT INTO purchase_transactions (
          transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
          tax_amount, total_amount, payment_method, payment_reference, cashier_id, notes
        )
        VALUES (
          ${transactionNumber}, ${invoiceNumber}, ${req.vehicle_id}, ${req.customer_id}, 
          ${req.vehicle_price}, ${taxAmount}, ${totalAmount}, ${req.payment_method}, 
          ${req.payment_reference}, ${authContext.user.id}, ${req.notes}
        )
        RETURNING id, transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
                  tax_amount, total_amount, payment_method, payment_reference, transaction_date,
                  cashier_id, status, notes, created_at
      `;

      // Update vehicle with purchase details
      await transactionsDB.exec`
        UPDATE vehicles 
        SET purchase_price = ${req.vehicle_price}, 
            purchased_from_customer_id = ${req.customer_id},
            purchased_by_cashier = ${authContext.user.id},
            purchased_at = NOW(),
            updated_at = NOW()
        WHERE id = ${req.vehicle_id}
      `;

      await transactionsDB.exec`COMMIT`;

      // Audit log
      await auditLog(
        authContext.user.id,
        "create",
        "purchase_transaction",
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
