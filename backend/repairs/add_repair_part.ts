import { api, APIError } from "encore.dev/api";
import { repairsDB } from "./db";
import { AddRepairPartRequest, RepairPart } from "./types";

// Adds a spare part to a repair work order.
export const addRepairPart = api<AddRepairPartRequest, RepairPart>(
  { expose: true, method: "POST", path: "/repairs/parts" },
  async (req) => {
    // Check if repair exists
    const repair = await repairsDB.queryRow`
      SELECT id FROM repairs WHERE id = ${req.repair_id}
    `;

    if (!repair) {
      throw APIError.notFound("Repair not found");
    }

    // Get spare part details and check stock
    const sparePart = await repairsDB.queryRow<{ id: number; selling_price: number; stock_quantity: number }>`
      SELECT id, selling_price, stock_quantity 
      FROM spare_parts 
      WHERE id = ${req.spare_part_id} AND is_active = true
    `;

    if (!sparePart) {
      throw APIError.notFound("Spare part not found");
    }

    if (sparePart.stock_quantity < req.quantity_used) {
      throw APIError.failedPrecondition("Insufficient stock quantity");
    }

    const totalCost = sparePart.selling_price * req.quantity_used;

    // Start transaction
    await repairsDB.exec`BEGIN`;

    try {
      // Add repair part
      const repairPart = await repairsDB.queryRow<RepairPart>`
        INSERT INTO repair_parts (repair_id, spare_part_id, quantity_used, unit_cost, total_cost, notes)
        VALUES (${req.repair_id}, ${req.spare_part_id}, ${req.quantity_used}, ${sparePart.selling_price}, ${totalCost}, ${req.notes})
        RETURNING id, repair_id, spare_part_id, quantity_used, unit_cost, total_cost, used_at, notes
      `;

      // Update spare part stock
      await repairsDB.exec`
        UPDATE spare_parts 
        SET stock_quantity = stock_quantity - ${req.quantity_used}, updated_at = NOW()
        WHERE id = ${req.spare_part_id}
      `;

      // Update repair total parts cost
      await repairsDB.exec`
        UPDATE repairs 
        SET total_parts_cost = (
          SELECT COALESCE(SUM(total_cost), 0) 
          FROM repair_parts 
          WHERE repair_id = ${req.repair_id}
        ),
        total_cost = labor_cost + (
          SELECT COALESCE(SUM(total_cost), 0) 
          FROM repair_parts 
          WHERE repair_id = ${req.repair_id}
        )
        WHERE id = ${req.repair_id}
      `;

      // Record stock movement
      // TODO: Get processed_by from auth context
      const processedBy = 1; // Placeholder

      await repairsDB.exec`
        INSERT INTO stock_movements (
          spare_part_id, movement_type, reference_type, reference_id, 
          quantity_before, quantity_moved, quantity_after, processed_by, notes
        )
        VALUES (
          ${req.spare_part_id}, 'out', 'repair', ${req.repair_id}, 
          ${sparePart.stock_quantity}, ${req.quantity_used}, 
          ${sparePart.stock_quantity - req.quantity_used}, ${processedBy}, 
          'Used in repair'
        )
      `;

      await repairsDB.exec`COMMIT`;

      return repairPart!;
    } catch (error) {
      await repairsDB.exec`ROLLBACK`;
      throw error;
    }
  }
);
