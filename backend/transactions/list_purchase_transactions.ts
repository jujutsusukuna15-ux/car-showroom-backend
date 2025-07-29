import { api, Query } from "encore.dev/api";
import { transactionsDB } from "./db";
import { ListTransactionsResponse, PurchaseTransaction } from "./types";

interface ListPurchaseTransactionsRequest {
  page?: Query<number>;
  limit?: Query<number>;
  start_date?: Query<string>;
  end_date?: Query<string>;
  customer_id?: Query<number>;
  cashier_id?: Query<number>;
}

// Retrieves all purchase transactions with optional filtering.
export const listPurchaseTransactions = api<ListPurchaseTransactionsRequest, ListTransactionsResponse<PurchaseTransaction>>(
  { expose: true, method: "GET", path: "/transactions/purchases" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.start_date) {
      whereClause += ` AND transaction_date >= $${paramIndex}`;
      params.push(req.start_date);
      paramIndex++;
    }

    if (req.end_date) {
      whereClause += ` AND transaction_date <= $${paramIndex}`;
      params.push(req.end_date);
      paramIndex++;
    }

    if (req.customer_id) {
      whereClause += ` AND customer_id = $${paramIndex}`;
      params.push(req.customer_id);
      paramIndex++;
    }

    if (req.cashier_id) {
      whereClause += ` AND cashier_id = $${paramIndex}`;
      params.push(req.cashier_id);
      paramIndex++;
    }

    const transactions = await transactionsDB.rawQueryAll<PurchaseTransaction>(
      `SELECT id, transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
              tax_amount, total_amount, payment_method, payment_reference, transaction_date,
              cashier_id, status, notes, created_at
       FROM purchase_transactions ${whereClause}
       ORDER BY transaction_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await transactionsDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM purchase_transactions ${whereClause}`,
      ...params
    );

    return {
      transactions,
      total: totalResult?.count || 0
    };
  }
);
