import { api, Header } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { CreateVehicleRequest, Vehicle } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedCreateVehicleRequest extends CreateVehicleRequest {
  authorization?: Header<"Authorization">;
}

// Creates a new vehicle record.
export const createVehicle = api<AuthenticatedCreateVehicleRequest, Vehicle>(
  { expose: true, method: "POST", path: "/vehicles" },
  async (req) => {
    const authContext = await requireRole(req.authorization, ["admin", "cashier"]);

    // Generate vehicle code
    const timestamp = Date.now().toString().slice(-6);
    const vehicleCode = `VEH${timestamp}`;

    const purchasedByCashier = authContext.user.id;

    const vehicle = await vehiclesDB.queryRow<Vehicle>`
      INSERT INTO vehicles (
        vehicle_code, chassis_number, license_plate, brand, model, variant, year, color, mileage,
        fuel_type, transmission, purchase_price, purchased_from_customer_id, purchased_by_cashier,
        purchased_at, purchase_notes, condition_notes
      )
      VALUES (
        ${vehicleCode}, ${req.chassis_number}, ${req.license_plate}, ${req.brand}, ${req.model}, 
        ${req.variant}, ${req.year}, ${req.color}, ${req.mileage}, ${req.fuel_type}, 
        ${req.transmission}, ${req.purchase_price}, ${req.purchased_from_customer_id}, 
        ${purchasedByCashier}, NOW(), ${req.purchase_notes}, ${req.condition_notes}
      )
      RETURNING id, vehicle_code, chassis_number, license_plate, brand, model, variant, year, color, mileage,
                fuel_type, transmission, purchase_price, total_repair_cost, suggested_selling_price,
                approved_selling_price, final_selling_price, status, purchased_from_customer_id,
                sold_to_customer_id, purchased_by_cashier, sold_by_cashier, price_approved_by_admin,
                purchased_at, sold_at, created_at, updated_at, purchase_notes, condition_notes
    `;

    if (!vehicle) {
      throw new Error("Failed to create vehicle");
    }

    await auditLog(
      authContext.user.id,
      "create",
      "vehicle",
      vehicle.id,
      { vehicle_code: vehicleCode, brand: req.brand, model: req.model }
    );

    return vehicle;
  }
);
