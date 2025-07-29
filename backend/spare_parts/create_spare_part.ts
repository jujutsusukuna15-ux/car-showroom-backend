import { api } from "encore.dev/api";
import { sparePartsDB } from "./db";
import { CreateSparePartRequest, SparePart } from "./types";

// Creates a new spare part record.
export const createSparePart = api<CreateSparePartRequest, SparePart>(
  { expose: true, method: "POST", path: "/spare-parts" },
  async (req) => {
    // Generate part code
    const timestamp = Date.now().toString().slice(-6);
    const partCode = `SP${timestamp}`;

    const sparePart = await sparePartsDB.queryRow<SparePart>`
      INSERT INTO spare_parts (
        part_code, name, description, brand, cost_price, selling_price, 
        stock_quantity, min_stock_level, unit_measure
      )
      VALUES (
        ${partCode}, ${req.name}, ${req.description}, ${req.brand}, 
        ${req.cost_price}, ${req.selling_price}, ${req.stock_quantity || 0}, 
        ${req.min_stock_level || 0}, ${req.unit_measure || 'pcs'}
      )
      RETURNING id, part_code, name, description, brand, cost_price, selling_price,
                stock_quantity, min_stock_level, unit_measure, created_at, updated_at, is_active
    `;

    // Create initial stock movement if quantity > 0
    if (req.stock_quantity && req.stock_quantity > 0) {
      // TODO: Get processed_by from auth context
      const processedBy = 1; // Placeholder

      await sparePartsDB.exec`
        INSERT INTO stock_movements (
          spare_part_id, movement_type, reference_type, quantity_before, 
          quantity_moved, quantity_after, processed_by, notes
        )
        VALUES (
          ${sparePart!.id}, 'in', 'adjustment', 0, ${req.stock_quantity}, 
          ${req.stock_quantity}, ${processedBy}, 'Initial stock'
        )
      `;
    }

    return sparePart!;
  }
);
