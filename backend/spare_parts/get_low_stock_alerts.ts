import { api } from "encore.dev/api";
import { sparePartsDB } from "./db";
import { LowStockAlertsResponse, LowStockAlert } from "./types";

// Retrieves spare parts with low stock levels.
export const getLowStockAlerts = api<void, LowStockAlertsResponse>(
  { expose: true, method: "GET", path: "/spare-parts/low-stock" },
  async () => {
    const alerts = await sparePartsDB.queryAll<LowStockAlert & { spare_part: any }>`
      SELECT 
        id, part_code, name, description, brand, cost_price, selling_price,
        stock_quantity as current_stock, min_stock_level as min_level,
        unit_measure, created_at, updated_at, is_active
      FROM spare_parts 
      WHERE is_active = true AND stock_quantity <= min_stock_level
      ORDER BY (stock_quantity - min_stock_level) ASC
    `;

    const formattedAlerts: LowStockAlert[] = alerts.map(alert => ({
      spare_part: {
        id: alert.id,
        part_code: alert.part_code,
        name: alert.name,
        description: alert.description,
        brand: alert.brand,
        cost_price: alert.cost_price,
        selling_price: alert.selling_price,
        stock_quantity: alert.current_stock,
        min_stock_level: alert.min_level,
        unit_measure: alert.unit_measure,
        created_at: alert.created_at,
        updated_at: alert.updated_at,
        is_active: alert.is_active
      },
      current_stock: alert.current_stock,
      min_level: alert.min_level
    }));

    return {
      alerts: formattedAlerts,
      total: formattedAlerts.length
    };
  }
);
