import { api, APIError } from "encore.dev/api";
import { repairsDB } from "./db";
import { RepairWithParts, Repair, RepairPart } from "./types";

interface GetRepairRequest {
  id: number;
}

// Retrieves a specific repair with its parts.
export const getRepair = api<GetRepairRequest, RepairWithParts>(
  { expose: true, method: "GET", path: "/repairs/:id" },
  async (req) => {
    const repair = await repairsDB.queryRow<Repair>`
      SELECT id, repair_number, vehicle_id, title, description, labor_cost, total_parts_cost,
             total_cost, status, mechanic_id, started_at, completed_at, created_at, work_notes
      FROM repairs 
      WHERE id = ${req.id}
    `;

    if (!repair) {
      throw APIError.notFound("Repair not found");
    }

    const parts = await repairsDB.queryAll<RepairPart & { part_name: string; part_code: string }>`
      SELECT rp.id, rp.repair_id, rp.spare_part_id, rp.quantity_used, rp.unit_cost, 
             rp.total_cost, rp.used_at, rp.notes, sp.name as part_name, sp.part_code
      FROM repair_parts rp
      JOIN spare_parts sp ON rp.spare_part_id = sp.id
      WHERE rp.repair_id = ${req.id}
      ORDER BY rp.used_at ASC
    `;

    return {
      repair,
      parts
    };
  }
);
