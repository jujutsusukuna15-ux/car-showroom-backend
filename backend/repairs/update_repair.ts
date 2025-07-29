import { api, APIError } from "encore.dev/api";
import { repairsDB } from "./db";
import { UpdateRepairRequest, Repair } from "./types";

interface UpdateRepairParams {
  id: number;
}

// Updates an existing repair work order.
export const updateRepair = api<UpdateRepairParams & UpdateRepairRequest, Repair>(
  { expose: true, method: "PUT", path: "/repairs/:id" },
  async (req) => {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(req.title);
      paramIndex++;
    }

    if (req.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(req.description);
      paramIndex++;
    }

    if (req.labor_cost !== undefined) {
      updates.push(`labor_cost = $${paramIndex}`);
      params.push(req.labor_cost);
      paramIndex++;
    }

    if (req.status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(req.status);
      paramIndex++;

      // Set timestamps based on status
      if (req.status === "in_progress") {
        updates.push(`started_at = NOW()`);
      } else if (req.status === "completed") {
        updates.push(`completed_at = NOW()`);
      }
    }

    if (req.mechanic_id !== undefined) {
      updates.push(`mechanic_id = $${paramIndex}`);
      params.push(req.mechanic_id);
      paramIndex++;
    }

    if (req.work_notes !== undefined) {
      updates.push(`work_notes = $${paramIndex}`);
      params.push(req.work_notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    // Recalculate total cost
    updates.push(`total_cost = labor_cost + total_parts_cost`);
    params.push(req.id);

    const repair = await repairsDB.rawQueryRow<Repair>(
      `UPDATE repairs 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, repair_number, vehicle_id, title, description, labor_cost, total_parts_cost,
                 total_cost, status, mechanic_id, started_at, completed_at, created_at, work_notes`,
      ...params
    );

    if (!repair) {
      throw APIError.notFound("Repair not found");
    }

    return repair;
  }
);
