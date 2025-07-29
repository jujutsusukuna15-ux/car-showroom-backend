import { api, Query } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { TopPerformingModel } from "./types";

interface TopPerformingModelsRequest {
  limit?: Query<number>;
}

interface TopPerformingModelsResponse {
  models: TopPerformingModel[];
}

// Identifies the best performing vehicle models by profit and sales.
export const getTopPerformingModels = api<TopPerformingModelsRequest, TopPerformingModelsResponse>(
  { expose: true, method: "GET", path: "/reports/top-performing-models" },
  async (req) => {
    const limit = req.limit || 10;

    const models = await vehiclesDB.rawQueryAll<TopPerformingModel>(
      `SELECT 
        brand,
        model,
        COUNT(*)::int as vehicles_sold,
        SUM(final_selling_price - purchase_price - total_repair_cost) as total_profit,
        AVG(final_selling_price - purchase_price - total_repair_cost) as average_profit,
        AVG(EXTRACT(DAYS FROM (sold_at - purchased_at))) as average_days_to_sell
       FROM vehicles
       WHERE status = 'sold' AND final_selling_price IS NOT NULL
       GROUP BY brand, model
       HAVING COUNT(*) > 0
       ORDER BY SUM(final_selling_price - purchase_price - total_repair_cost) DESC, COUNT(*) DESC
       LIMIT $1`,
      limit
    );

    return {
      models
    };
  }
);
