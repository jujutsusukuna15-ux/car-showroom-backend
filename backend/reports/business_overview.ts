import { api } from "encore.dev/api";
import { vehiclesDB, transactionsDB, repairsDB, sparePartsDB } from "./db";
import { BusinessOverview } from "./types";

// Provides a comprehensive business overview dashboard.
export const getBusinessOverview = api<void, BusinessOverview>(
  { expose: true, method: "GET", path: "/reports/business-overview" },
  async () => {
    // Total vehicles in stock (not sold)
    const vehiclesInStock = await vehiclesDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM vehicles 
      WHERE status IN ('purchased', 'in_repair', 'ready_to_sell', 'reserved')
    `;

    // Total vehicles sold
    const vehiclesSold = await vehiclesDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM vehicles 
      WHERE status = 'sold'
    `;

    // Total revenue from sales
    const totalRevenue = await transactionsDB.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM sales_transactions 
      WHERE status = 'completed'
    `;

    // Total profit from sold vehicles
    const totalProfit = await vehiclesDB.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(final_selling_price - purchase_price - total_repair_cost), 0) as total
      FROM vehicles
      WHERE status = 'sold' AND final_selling_price IS NOT NULL
    `;

    // Average profit margin
    const avgProfitMargin = await vehiclesDB.queryRow<{ avg: number }>`
      SELECT COALESCE(AVG(
        CASE 
          WHEN (purchase_price + total_repair_cost) > 0 
          THEN ((final_selling_price - purchase_price - total_repair_cost) / (purchase_price + total_repair_cost)) * 100
          ELSE 0
        END
      ), 0) as avg
      FROM vehicles
      WHERE status = 'sold' AND final_selling_price IS NOT NULL
    `;

    // Pending repairs
    const pendingRepairs = await repairsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM repairs 
      WHERE status IN ('pending', 'in_progress')
    `;

    // Low stock parts
    const lowStockParts = await sparePartsDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM spare_parts 
      WHERE is_active = true AND stock_quantity <= min_stock_level
    `;

    return {
      total_vehicles_in_stock: vehiclesInStock?.count || 0,
      total_vehicles_sold: vehiclesSold?.count || 0,
      total_revenue: totalRevenue?.total || 0,
      total_profit: totalProfit?.total || 0,
      average_profit_margin: avgProfitMargin?.avg || 0,
      pending_repairs: pendingRepairs?.count || 0,
      low_stock_parts: lowStockParts?.count || 0
    };
  }
);
