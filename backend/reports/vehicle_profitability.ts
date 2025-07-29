import { api, Query } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { VehicleProfitability } from "./types";

interface VehicleProfitabilityRequest {
  page?: Query<number>;
  limit?: Query<number>;
  sort_by?: Query<string>;
  order?: Query<string>;
}

interface VehicleProfitabilityResponse {
  vehicles: VehicleProfitability[];
  total: number;
}

// Analyzes profitability of sold vehicles.
export const getVehicleProfitability = api<VehicleProfitabilityRequest, VehicleProfitabilityResponse>(
  { expose: true, method: "GET", path: "/reports/vehicle-profitability" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;
    const sortBy = req.sort_by || "profit";
    const order = req.order || "DESC";

    // Validate sort column and create safe sort clause
    const validSortColumns = ["profit", "profit_margin_percentage", "days_to_sell", "sold_at", "total_cost"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "profit";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const vehicles = await vehiclesDB.rawQueryAll<VehicleProfitability>(
      `SELECT 
        id, vehicle_code, brand, model, year, purchase_price, total_repair_cost,
        final_selling_price, 
        (purchase_price + total_repair_cost) as total_cost,
        (final_selling_price - purchase_price - total_repair_cost) as profit,
        CASE 
          WHEN (purchase_price + total_repair_cost) > 0 
          THEN ((final_selling_price - purchase_price - total_repair_cost) / (purchase_price + total_repair_cost)) * 100
          ELSE 0
        END as profit_margin_percentage,
        purchased_at, sold_at,
        CASE 
          WHEN sold_at IS NOT NULL AND purchased_at IS NOT NULL
          THEN EXTRACT(DAYS FROM (sold_at - purchased_at))::int
          ELSE NULL
        END as days_to_sell
       FROM vehicles
       WHERE status = 'sold' AND final_selling_price IS NOT NULL
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT $1 OFFSET $2`,
      limit, offset
    );

    const totalResult = await vehiclesDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM vehicles
      WHERE status = 'sold' AND final_selling_price IS NOT NULL
    `;

    return {
      vehicles,
      total: totalResult?.count || 0
    };
  }
);
