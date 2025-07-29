import { api, Query } from "encore.dev/api";
import { transactionsDB, vehiclesDB, repairsDB } from "./db";
import { WeeklyReport } from "./types";

interface WeeklyReportRequest {
  week_start?: Query<string>;
}

// Generates a weekly business summary report.
export const getWeeklyReport = api<WeeklyReportRequest, WeeklyReport>(
  { expose: true, method: "GET", path: "/reports/weekly" },
  async (req) => {
    const weekStart = req.week_start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get vehicles bought this week
    const vehiclesBought = await transactionsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM purchase_transactions 
      WHERE DATE(transaction_date) BETWEEN ${weekStart} AND ${weekEnd} 
      AND status = 'completed'
    `;

    // Get vehicles sold this week
    const vehiclesSold = await transactionsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM sales_transactions 
      WHERE DATE(transaction_date) BETWEEN ${weekStart} AND ${weekEnd} 
      AND status = 'completed'
    `;

    // Get total profit from sold vehicles this week
    const profitData = await vehiclesDB.queryRow<{ total_profit: number }>`
      SELECT COALESCE(SUM(final_selling_price - purchase_price - total_repair_cost), 0) as total_profit
      FROM vehicles
      WHERE DATE(sold_at) BETWEEN ${weekStart} AND ${weekEnd}
      AND status = 'sold' AND final_selling_price IS NOT NULL
    `;

    // Get best performing vehicle this week
    const bestVehicle = await vehiclesDB.queryRow<{ vehicle_info: string }>`
      SELECT CONCAT(brand, ' ', model, ' (', vehicle_code, ')') as vehicle_info
      FROM vehicles
      WHERE DATE(sold_at) BETWEEN ${weekStart} AND ${weekEnd}
      AND status = 'sold' AND final_selling_price IS NOT NULL
      ORDER BY (final_selling_price - purchase_price - total_repair_cost) DESC
      LIMIT 1
    `;

    // Get total repair costs this week
    const repairCosts = await repairsDB.queryRow<{ total_cost: number }>`
      SELECT COALESCE(SUM(total_cost), 0) as total_cost
      FROM repairs 
      WHERE DATE(completed_at) BETWEEN ${weekStart} AND ${weekEnd}
      AND status = 'completed'
    `;

    return {
      week_start: weekStart,
      week_end: weekEnd,
      vehicles_bought: vehiclesBought?.count || 0,
      vehicles_sold: vehiclesSold?.count || 0,
      total_profit: profitData?.total_profit || 0,
      best_performing_vehicle: bestVehicle?.vehicle_info || "No sales this week",
      total_repair_costs: repairCosts?.total_cost || 0
    };
  }
);
