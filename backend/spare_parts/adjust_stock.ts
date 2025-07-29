import { api, APIError } from "encore.dev/api";
import { sparePartsDB } from "./db";
import { StockAdjustmentRequest, SparePart } from "./types";

// Adjusts the stock quantity of a spare part.
export const adjustStock = api<StockAdjustmentRequest, SparePart>(
  { expose: true, method: "POST", path: "/spare-parts/adjust-stock" },
  async (req) => {
    if (req.new_quantity < 0) {
      throw APIError.invalidArgument("Stock quantity cannot be negative");
    }

    // Get current stock
    const currentPart = await sparePartsDB.queryRow<SparePart>`
      SELECT id, part_code, name, description, brand, cost_price, selling_price,
             stock_quantity, min_stock_level, unit_measure, created_at, updated_at, is_active
      FROM spare_parts 
      WHERE id = ${req.spare_part_id} AND is_active = true
    `;

    if (!currentPart) {
      throw APIError.notFound("Spare part not found");
    }

    const quantityDiff = req.new_quantity - currentPart.stock_quantity;
    const movementType = quantityDiff > 0 ? "in" : quantityDiff < 0 ? "out" : "adjustment";

    // TODO: Get processed_by from auth context
    const processedBy = 1; // Placeholder

    // Start transaction
    await sparePartsDB.exec`BEGIN`;

    try {
      // Update stock quantity
      const updatedPart = await sparePartsDB.queryRow<SparePart>`
        UPDATE spare_parts 
        SET stock_quantity = ${req.new_quantity}, updated_at = NOW()
        WHERE id = ${req.spare_part_id}
        RETURNING id, part_code, name, description, brand, cost_price, selling_price,
                  stock_quantity, min_stock_level, unit_measure, created_at, updated_at, is_active
      `;

      // Record stock movement
      await sparePartsDB.exec`
        INSERT INTO stock_movements (
          spare_part_id, movement_type, reference_type, quantity_before, 
          quantity_moved, quantity_after, processed_by, notes
        )
        VALUES (
          ${req.spare_part_id}, ${movementType}, 'adjustment', ${currentPart.stock_quantity}, 
          ${Math.abs(quantityDiff)}, ${req.new_quantity}, ${processedBy}, ${req.notes}
        )
      `;

      await sparePartsDB.exec`COMMIT`;

      return updatedPart!;
    } catch (error) {
      await sparePartsDB.exec`ROLLBACK`;
      throw error;
    }
  }
);
