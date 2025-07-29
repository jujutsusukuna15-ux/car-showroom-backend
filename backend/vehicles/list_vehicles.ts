import { api, Query } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { ListVehiclesResponse, Vehicle, VehicleStatus } from "./types";

interface ListVehiclesRequest {
  page?: Query<number>;
  limit?: Query<number>;
  status?: Query<VehicleStatus>;
  brand?: Query<string>;
  search?: Query<string>;
}

// Retrieves all vehicles with optional filtering and search.
export const listVehicles = api<ListVehiclesRequest, ListVehiclesResponse>(
  { expose: true, method: "GET", path: "/vehicles" },
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

    if (req.brand) {
      whereClause += ` AND brand ILIKE $${paramIndex}`;
      params.push(`%${req.brand}%`);
      paramIndex++;
    }

    if (req.search) {
      whereClause += ` AND (vehicle_code ILIKE $${paramIndex} OR chassis_number ILIKE $${paramIndex} OR license_plate ILIKE $${paramIndex} OR brand ILIKE $${paramIndex} OR model ILIKE $${paramIndex})`;
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    const vehicles = await vehiclesDB.rawQueryAll<Vehicle>(
      `SELECT id, vehicle_code, chassis_number, license_plate, brand, model, variant, year, color, mileage,
              fuel_type, transmission, purchase_price, total_repair_cost, suggested_selling_price,
              approved_selling_price, final_selling_price, status, purchased_from_customer_id,
              sold_to_customer_id, purchased_by_cashier, sold_by_cashier, price_approved_by_admin,
              purchased_at, sold_at, created_at, updated_at, purchase_notes, condition_notes
       FROM vehicles ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    const totalResult = await vehiclesDB.rawQueryRow<{ count: number }>(
      `SELECT COUNT(*) as count FROM vehicles ${whereClause}`,
      ...params
    );

    return {
      vehicles,
      total: totalResult?.count || 0
    };
  }
);
