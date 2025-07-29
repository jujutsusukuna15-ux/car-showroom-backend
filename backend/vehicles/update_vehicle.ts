import { api, APIError, Header } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { UpdateVehicleRequest, Vehicle } from "./types";
import { requireAuth, auditLog, hasPermission } from "../auth/auth_middleware";

interface AuthenticatedUpdateVehicleRequest extends UpdateVehicleRequest {
  id: number;
  authorization?: Header<"Authorization">;
}

// Updates an existing vehicle record.
export const updateVehicle = api<AuthenticatedUpdateVehicleRequest, Vehicle>(
  { expose: true, method: "PUT", path: "/vehicles/:id" },
  async (req) => {
    const authContext = await requireAuth(req.authorization);

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Role-based field restrictions
    const userRole = authContext.user.role;

    if (req.license_plate !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`license_plate = $${paramIndex}`);
        params.push(req.license_plate);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update license plate");
      }
    }

    if (req.brand !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`brand = $${paramIndex}`);
        params.push(req.brand);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update brand");
      }
    }

    if (req.model !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`model = $${paramIndex}`);
        params.push(req.model);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update model");
      }
    }

    if (req.variant !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`variant = $${paramIndex}`);
        params.push(req.variant);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update variant");
      }
    }

    if (req.year !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`year = $${paramIndex}`);
        params.push(req.year);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update year");
      }
    }

    if (req.color !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`color = $${paramIndex}`);
        params.push(req.color);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update color");
      }
    }

    if (req.mileage !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`mileage = $${paramIndex}`);
        params.push(req.mileage);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update mileage");
      }
    }

    if (req.fuel_type !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`fuel_type = $${paramIndex}`);
        params.push(req.fuel_type);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update fuel type");
      }
    }

    if (req.transmission !== undefined) {
      if (hasPermission(userRole, "update", "vehicles")) {
        updates.push(`transmission = $${paramIndex}`);
        params.push(req.transmission);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Not authorized to update transmission");
      }
    }

    if (req.status !== undefined) {
      // Mechanics can only update status for repair-related changes
      if (userRole === "mechanic") {
        const allowedStatuses = ["in_repair", "ready_to_sell"];
        if (!allowedStatuses.includes(req.status)) {
          throw APIError.permissionDenied("Mechanics can only set status to 'in_repair' or 'ready_to_sell'");
        }
      }
      
      updates.push(`status = $${paramIndex}`);
      params.push(req.status);
      paramIndex++;
    }

    if (req.suggested_selling_price !== undefined) {
      if (userRole !== "mechanic") {
        updates.push(`suggested_selling_price = $${paramIndex}`);
        params.push(req.suggested_selling_price);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Mechanics cannot set selling prices");
      }
    }

    if (req.approved_selling_price !== undefined) {
      if (userRole === "admin") {
        updates.push(`approved_selling_price = $${paramIndex}`);
        params.push(req.approved_selling_price);
        paramIndex++;
        updates.push(`price_approved_by_admin = $${paramIndex}`);
        params.push(authContext.user.id);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Only admins can approve selling prices");
      }
    }

    if (req.final_selling_price !== undefined) {
      if (userRole !== "mechanic") {
        updates.push(`final_selling_price = $${paramIndex}`);
        params.push(req.final_selling_price);
        paramIndex++;
      } else {
        throw APIError.permissionDenied("Mechanics cannot set final selling prices");
      }
    }

    if (req.condition_notes !== undefined) {
      // All roles can update condition notes
      updates.push(`condition_notes = $${paramIndex}`);
      params.push(req.condition_notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.id);

    const vehicle = await vehiclesDB.rawQueryRow<Vehicle>(
      `UPDATE vehicles 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, vehicle_code, chassis_number, license_plate, brand, model, variant, year, color, mileage,
                 fuel_type, transmission, purchase_price, total_repair_cost, suggested_selling_price,
                 approved_selling_price, final_selling_price, status, purchased_from_customer_id,
                 sold_to_customer_id, purchased_by_cashier, sold_by_cashier, price_approved_by_admin,
                 purchased_at, sold_at, created_at, updated_at, purchase_notes, condition_notes`,
      ...params
    );

    if (!vehicle) {
      throw APIError.notFound("Vehicle not found");
    }

    // Audit log for important changes
    if (req.approved_selling_price !== undefined || req.status !== undefined) {
      await auditLog(
        authContext.user.id,
        "update",
        "vehicle",
        req.id,
        { 
          updated_fields: Object.keys(req).filter(key => key !== "id" && key !== "authorization"),
          approved_price: req.approved_selling_price,
          status_change: req.status
        }
      );
    }

    return vehicle;
  }
);
