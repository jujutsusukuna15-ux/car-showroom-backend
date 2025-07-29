import { api, Header } from "encore.dev/api";
import { repairsDB } from "./db";
import { CreateRepairRequest, Repair } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedCreateRepairRequest extends CreateRepairRequest {
  authorization?: Header<"Authorization">;
}

// Creates a new repair work order.
export const createRepair = api<AuthenticatedCreateRepairRequest, Repair>(
  { expose: true, method: "POST", path: "/repairs" },
  async (req) => {
    // Require mechanic or admin role
    const authContext = await requireRole(req.authorization, ["admin", "mechanic"]);

    // Generate repair number
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = Date.now().toString().slice(-4);
    const repairNumber = `REP-${today}-${timestamp}`;

    const repair = await repairsDB.queryRow<Repair>`
      INSERT INTO repairs (repair_number, vehicle_id, title, description, labor_cost, mechanic_id)
      VALUES (${repairNumber}, ${req.vehicle_id}, ${req.title}, ${req.description}, ${req.labor_cost || 0}, ${authContext.user.role === "mechanic" ? authContext.user.id : null})
      RETURNING id, repair_number, vehicle_id, title, description, labor_cost, total_parts_cost,
                total_cost, status, mechanic_id, started_at, completed_at, created_at, work_notes
    `;

    // Update vehicle status to in_repair
    await repairsDB.exec`
      UPDATE vehicles 
      SET status = 'in_repair', updated_at = NOW()
      WHERE id = ${req.vehicle_id}
    `;

    // Audit log
    await auditLog(
      authContext.user.id,
      "create",
      "repair",
      repair!.id,
      { 
        repair_number: repairNumber,
        vehicle_id: req.vehicle_id,
        title: req.title
      }
    );

    return repair!;
  }
);
