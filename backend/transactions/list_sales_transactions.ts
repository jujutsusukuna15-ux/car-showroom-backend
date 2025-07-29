import { api, Query } from "encore.dev/api";
import { transactionsDB } from "./db";
import { ListTransactionsResponse, SalesTransaction } from "./types";

interface ListSalesTransactionsRequest {
  page?: Query<number>;
  limit?: Query<number>;
  start_date?: Query<string>;
  end_date?: Query<string>;
  customer_id?: Query<number>;
  cashier_id?: Query<number>;
}

// Retrieves all sales transactions with optional filtering.
export const listSalesTransactions = api<ListSalesTransactionsRequest, ListTransactionsResponse<SalesTransaction>>(
  { expose: true, method: "GET", path: "/transactions/sales" },
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

    const transactions = await transactionsDB.rawQueryAll<SalesTransaction>(
      `SELECT id, transaction_number, invoice_number, vehicle_id, customer_id, vehicle_price,
              tax_amount, discount_amount, total_amount, payment_method, payment_reference, 
              transaction_date, cashier_id, status, notes, created_at
       FROM sales_transactions ${whereClause}
       ORDER BY transaction_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await transactionsDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM sales_transactions ${whereClause}`,
      ...params
    );

    return {
      transactions,
      total: totalResult?.count || 0
    };
  }
);
