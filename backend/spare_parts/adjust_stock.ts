import { api, APIError, Header } from "encore.dev/api";
import { sparePartsDB } from "./db";
import { StockAdjustmentRequest, SparePart } from "./types";
import { requireRole, auditLog } from "../auth/auth_middleware";

interface AuthenticatedStockAdjustmentRequest extends StockAdjustmentRequest {
  authorization?: Header<"Authorization">;
}

// Adjusts the stock quantity of a spare part. Admin-only.
export const adjustStock = api<AuthenticatedStockAdjustmentRequest, SparePart>(
  { expose: true, method: "POST", path: "/spare-parts/adjust-stock" },
  async (req) => {
    const authContext = await requireRole(req.authorization, ["admin"]);

    if (req.new_quantity < 0) {
      throw APIError.invalidArgument("Stock quantity cannot be negative");
    }

    // Get current stock
    const currentPart = await sparePartsDB.queryRow<SparePart>`
      SELECT id, stock_quantity
      FROM spare_parts 
      WHERE id = ${req.spare_part_id} AND is_active = true
    `;

    if (!currentPart) {
      throw APIError.notFound("Spare part not found");
    }

    const quantityDiff = req.new_quantity - currentPart.stock_quantity;
    const movementType = quantityDiff > 0 ? "in" : quantityDiff < 0 ? "out" : "adjustment";
    const processedBy = authContext.user.id;

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

      if (!updatedPart) {
        throw APIError.notFound("Spare part not found during update");
      }

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

      await auditLog(
        authContext.user.id,
        "adjust_stock",
        "spare_part",
        updatedPart.id,
        { 
          from: currentPart.stock_quantity,
          to: req.new_quantity,
          notes: req.notes
        }
      );

      return updatedPart;
    } catch (error) {
      await sparePartsDB.exec`ROLLBACK`;
      throw error;
    }
  }
);
