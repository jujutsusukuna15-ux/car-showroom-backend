import { api, Query } from "encore.dev/api";
import { repairsDB } from "./db";
import { ListRepairsResponse, Repair, RepairStatus } from "./types";

interface ListRepairsRequest {
  page?: Query<number>;
  limit?: Query<number>;
  status?: Query<RepairStatus>;
  vehicle_id?: Query<number>;
  mechanic_id?: Query<number>;
}

// Retrieves all repairs with optional filtering.
export const listRepairs = api<ListRepairsRequest, ListRepairsResponse>(
  { expose: true, method: "GET", path: "/repairs" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(req.status);
      paramIndex++;
    }

    if (req.vehicle_id) {
      whereClause += ` AND vehicle_id = $${paramIndex}`;
      params.push(req.vehicle_id);
      paramIndex++;
    }

    if (req.mechanic_id) {
      whereClause += ` AND mechanic_id = $${paramIndex}`;
      params.push(req.mechanic_id);
      paramIndex++;
    }

    const repairs = await repairsDB.rawQueryAll<Repair>(
      `SELECT id, repair_number, vehicle_id, title, description, labor_cost, total_parts_cost,
              total_cost, status, mechanic_id, started_at, completed_at, created_at, work_notes
       FROM repairs ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await repairsDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM repairs ${whereClause}`,
      ...params
    );

    return {
      repairs,
      total: totalResult?.count || 0
    };
  }
);
