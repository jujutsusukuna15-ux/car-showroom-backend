import { api } from "encore.dev/api";
import { repairsDB } from "./db";
import { CreateRepairRequest, Repair } from "./types";

// Creates a new repair work order.
export const createRepair = api<CreateRepairRequest, Repair>(
  { expose: true, method: "POST", path: "/repairs" },
  async (req) => {
    // Generate repair number
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = Date.now().toString().slice(-4);
    const repairNumber = `REP-${today}-${timestamp}`;

    const repair = await repairsDB.queryRow<Repair>`
      INSERT INTO repairs (repair_number, vehicle_id, title, description, labor_cost)
      VALUES (${repairNumber}, ${req.vehicle_id}, ${req.title}, ${req.description}, ${req.labor_cost || 0})
      RETURNING id, repair_number, vehicle_id, title, description, labor_cost, total_parts_cost,
                total_cost, status, mechanic_id, started_at, completed_at, created_at, work_notes
    `;

    return repair!;
  }
);
