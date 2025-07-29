import { api, APIError } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { UpdateVehicleRequest, Vehicle } from "./types";

interface UpdateVehicleParams {
  id: number;
}

// Updates an existing vehicle record.
export const updateVehicle = api<UpdateVehicleParams & UpdateVehicleRequest, Vehicle>(
  { expose: true, method: "PUT", path: "/vehicles/:id" },
  async (req) => {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.license_plate !== undefined) {
      updates.push(`license_plate = $${paramIndex}`);
      params.push(req.license_plate);
      paramIndex++;
    }

    if (req.brand !== undefined) {
      updates.push(`brand = $${paramIndex}`);
      params.push(req.brand);
      paramIndex++;
    }

    if (req.model !== undefined) {
      updates.push(`model = $${paramIndex}`);
      params.push(req.model);
      paramIndex++;
    }

    if (req.variant !== undefined) {
      updates.push(`variant = $${paramIndex}`);
      params.push(req.variant);
      paramIndex++;
    }

    if (req.year !== undefined) {
      updates.push(`year = $${paramIndex}`);
      params.push(req.year);
      paramIndex++;
    }

    if (req.color !== undefined) {
      updates.push(`color = $${paramIndex}`);
      params.push(req.color);
      paramIndex++;
    }

    if (req.mileage !== undefined) {
      updates.push(`mileage = $${paramIndex}`);
      params.push(req.mileage);
      paramIndex++;
    }

    if (req.fuel_type !== undefined) {
      updates.push(`fuel_type = $${paramIndex}`);
      params.push(req.fuel_type);
      paramIndex++;
    }

    if (req.transmission !== undefined) {
      updates.push(`transmission = $${paramIndex}`);
      params.push(req.transmission);
      paramIndex++;
    }

    if (req.status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(req.status);
      paramIndex++;
    }

    if (req.suggested_selling_price !== undefined) {
      updates.push(`suggested_selling_price = $${paramIndex}`);
      params.push(req.suggested_selling_price);
      paramIndex++;
    }

    if (req.approved_selling_price !== undefined) {
      updates.push(`approved_selling_price = $${paramIndex}`);
      params.push(req.approved_selling_price);
      paramIndex++;
      // TODO: Set price_approved_by_admin from auth context
    }

    if (req.final_selling_price !== undefined) {
      updates.push(`final_selling_price = $${paramIndex}`);
      params.push(req.final_selling_price);
      paramIndex++;
    }

    if (req.condition_notes !== undefined) {
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

    return vehicle;
  }
);
