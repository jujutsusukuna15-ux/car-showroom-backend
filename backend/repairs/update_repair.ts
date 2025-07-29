import { api, APIError, Header } from "encore.dev/api";
import { repairsDB } from "./db";
import { UpdateRepairRequest, Repair } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedUpdateRepairRequest extends UpdateRepairRequest {
  id: number;
  authorization?: Header<"Authorization">;
}

// Updates an existing repair work order.
export const updateRepair = api<AuthenticatedUpdateRepairRequest, Repair>(
  { expose: true, method: "PUT", path: "/repairs/:id" },
  async (req) => {
    // Require mechanic or admin role
    const authContext = await requireRole(req.authorization, ["admin", "mechanic"]);

    // If user is mechanic, check if they are assigned to this repair
    if (authContext.user.role === "mechanic") {
      const repair = await repairsDB.queryRow<{ mechanic_id?: number }>`
        SELECT mechanic_id FROM repairs WHERE id = ${req.id}
      `;

      if (!repair) {
        throw APIError.notFound("Repair not found");
      }

      if (repair.mechanic_id && repair.mechanic_id !== authContext.user.id) {
        throw APIError.permissionDenied("You can only update repairs assigned to you");
      }
    }

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
        if (authContext.user.role === "mechanic") {
          updates.push(`mechanic_id = $${paramIndex}`);
          params.push(authContext.user.id);
          paramIndex++;
        }
      } else if (req.status === "completed") {
        updates.push(`completed_at = NOW()`);
        
        // Update vehicle status to ready_to_sell when repair is completed
        await repairsDB.exec`
          UPDATE vehicles 
          SET status = 'ready_to_sell', updated_at = NOW()
          WHERE id = (SELECT vehicle_id FROM repairs WHERE id = ${req.id})
        `;
      }
    }

    if (req.mechanic_id !== undefined && authContext.user.role === "admin") {
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

    // Audit log for status changes
    if (req.status !== undefined) {
      await auditLog(
        authContext.user.id,
        "update",
        "repair",
        req.id,
        { 
          status_change: req.status,
          mechanic_id: authContext.user.role === "mechanic" ? authContext.user.id : req.mechanic_id
        }
      );
    }

    return repair;
  }
);
