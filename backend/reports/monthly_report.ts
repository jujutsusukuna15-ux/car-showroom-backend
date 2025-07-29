import { api, Query } from "encore.dev/api";
import { transactionsDB, repairsDB } from "./db";
import { MonthlyReport } from "./types";

interface MonthlyReportRequest {
  year?: Query<number>;
  month?: Query<number>;
}

// Generates a comprehensive monthly business report.
export const getMonthlyReport = api<MonthlyReportRequest, MonthlyReport>(
  { expose: true, method: "GET", path: "/reports/monthly" },
  async (req) => {
    const year = req.year || new Date().getFullYear();
    const month = req.month || new Date().getMonth() + 1;

    // Get revenue (sales) for the month
    const revenue = await transactionsDB.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM sales_transactions 
      WHERE EXTRACT(YEAR FROM transaction_date) = ${year}
      AND EXTRACT(MONTH FROM transaction_date) = ${month}
      AND status = 'completed'
    `;

    // Get costs (purchases + repairs) for the month
    const purchaseCosts = await transactionsDB.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM purchase_transactions 
      WHERE EXTRACT(YEAR FROM transaction_date) = ${year}
      AND EXTRACT(MONTH FROM transaction_date) = ${month}
      AND status = 'completed'
    `;

    const repairCosts = await repairsDB.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(total_cost), 0) as total
      FROM repairs 
      WHERE EXTRACT(YEAR FROM completed_at) = ${year}
      AND EXTRACT(MONTH FROM completed_at) = ${month}
      AND status = 'completed'
    `;

    const totalCosts = (purchaseCosts?.total || 0) + (repairCosts?.total || 0);
    const profit = (revenue?.total || 0) - totalCosts;

    // Get vehicles sold count
    const vehiclesSold = await transactionsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM sales_transactions 
      WHERE EXTRACT(YEAR FROM transaction_date) = ${year}
      AND EXTRACT(MONTH FROM transaction_date) = ${month}
      AND status = 'completed'
    `;

    // Get new customers this month (using transactions DB to access customers)
    const newCustomers = await transactionsDB.queryRow<{ count: number }>`
      SELECT COUNT(DISTINCT customer_id)::int as count
      FROM purchase_transactions 
      WHERE EXTRACT(YEAR FROM transaction_date) = ${year}
      AND EXTRACT(MONTH FROM transaction_date) = ${month}
    `;

    // Calculate mechanic productivity (repairs completed)
    const mechanicProductivity = await repairsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM repairs 
      WHERE EXTRACT(YEAR FROM completed_at) = ${year}
      AND EXTRACT(MONTH FROM completed_at) = ${month}
      AND status = 'completed'
    `;

    return {
      month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      year,
      revenue: revenue?.total || 0,
      costs: totalCosts,
      profit,
      vehicles_sold: vehiclesSold?.count || 0,
      customer_acquisition: newCustomers?.count || 0,
      mechanic_productivity: mechanicProductivity?.count || 0
    };
  }
);
