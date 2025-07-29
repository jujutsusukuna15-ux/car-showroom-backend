import { api, APIError } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { VehicleWithImages, Vehicle, VehicleImage } from "./types";

interface GetVehicleRequest {
  id: number;
}

// Retrieves a specific vehicle with its images.
export const getVehicle = api<GetVehicleRequest, VehicleWithImages>(
  { expose: true, method: "GET", path: "/vehicles/:id" },
  async (req) => {
    const vehicle = await vehiclesDB.queryRow<Vehicle>`
      SELECT id, vehicle_code, chassis_number, license_plate, brand, model, variant, year, color, mileage,
             fuel_type, transmission, purchase_price, total_repair_cost, suggested_selling_price,
             approved_selling_price, final_selling_price, status, purchased_from_customer_id,
             sold_to_customer_id, purchased_by_cashier, sold_by_cashier, price_approved_by_admin,
             purchased_at, sold_at, created_at, updated_at, purchase_notes, condition_notes
      FROM vehicles 
      WHERE id = ${req.id}
    `;

    if (!vehicle) {
      throw APIError.notFound("Vehicle not found");
    }

    const images = await vehiclesDB.queryAll<VehicleImage>`
      SELECT id, vehicle_id, image_path, image_type, description, is_primary, uploaded_at, uploaded_by
      FROM vehicle_images
      WHERE vehicle_id = ${req.id}
      ORDER BY is_primary DESC, uploaded_at ASC
    `;

    return {
      vehicle,
      images
    };
  }
);
