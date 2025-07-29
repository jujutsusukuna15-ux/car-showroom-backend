import { api, Query } from "encore.dev/api";
import { transactionsDB } from "./db";
import { DailyReport } from "./types";

interface DailyReportRequest {
  date?: Query<string>;
}

// Generates a daily transaction and profit report.
export const getDailyReport = api<DailyReportRequest, DailyReport>(
  { expose: true, method: "GET", path: "/reports/daily" },
  async (req) => {
    const reportDate = req.date || new Date().toISOString().split('T')[0];

    // Get purchase transactions for the day
    const purchases = await transactionsDB.queryRow<{ count: number; total: number }>`
      SELECT 
        COUNT(*)::int as count,
        COALESCE(SUM(total_amount), 0) as total
      FROM purchase_transactions 
      WHERE DATE(transaction_date) = ${reportDate} AND status = 'completed'
    `;

    // Get sales transactions for the day
    const sales = await transactionsDB.queryRow<{ count: number; total: number }>`
      SELECT 
        COUNT(*)::int as count,
        COALESCE(SUM(total_amount), 0) as total
      FROM sales_transactions 
      WHERE DATE(transaction_date) = ${reportDate} AND status = 'completed'
    `;

    // Calculate profit (simplified - sales revenue minus purchase costs)
    const profit = (sales?.total || 0) - (purchases?.total || 0);

    return {
      date: reportDate,
      total_purchases: purchases?.count || 0,
      total_sales: sales?.count || 0,
      total_purchase_amount: purchases?.total || 0,
      total_sales_amount: sales?.total || 0,
      profit,
      transaction_count: (purchases?.count || 0) + (sales?.count || 0)
    };
  }
);
