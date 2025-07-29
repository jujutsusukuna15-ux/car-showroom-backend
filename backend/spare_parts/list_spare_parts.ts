import { api, Query } from "encore.dev/api";
import { sparePartsDB } from "./db";
import { ListSparePartsResponse, SparePart } from "./types";

interface ListSparePartsRequest {
  page?: Query<number>;
  limit?: Query<number>;
  search?: Query<string>;
  brand?: Query<string>;
  low_stock?: Query<boolean>;
}

// Retrieves all spare parts with optional filtering.
export const listSpareParts = api<ListSparePartsRequest, ListSparePartsResponse>(
  { expose: true, method: "GET", path: "/spare-parts" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_active = true";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR part_code ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    if (req.brand) {
      whereClause += ` AND brand ILIKE $${paramIndex}`;
      params.push(`%${req.brand}%`);
      paramIndex++;
    }

    if (req.low_stock) {
      whereClause += ` AND stock_quantity <= min_stock_level`;
    }

    const spareParts = await sparePartsDB.rawQueryAll<SparePart>(
      `SELECT id, part_code, name, description, brand, cost_price, selling_price,
              stock_quantity, min_stock_level, unit_measure, created_at, updated_at, is_active
       FROM spare_parts ${whereClause}
       ORDER BY name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await sparePartsDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM spare_parts ${whereClause}`,
      ...params
    );

    return {
      spare_parts: spareParts,
      total: totalResult?.count || 0
    };
  }
);
