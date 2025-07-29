export interface SparePart {
  id: number;
  part_code: string;
  name: string;
  description?: string;
  brand?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit_measure: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface StockMovement {
  id: number;
  spare_part_id: number;
  movement_type: MovementType;
  reference_type: ReferenceType;
  reference_id?: number;
  quantity_before: number;
  quantity_moved: number;
  quantity_after: number;
  movement_date: Date;
  processed_by: number;
  notes?: string;
}

export type MovementType = "in" | "out" | "adjustment";
export type ReferenceType = "repair" | "purchase" | "sales" | "adjustment";

export interface CreateSparePartRequest {
  name: string;
  description?: string;
  brand?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity?: number;
  min_stock_level?: number;
  unit_measure?: string;
}

export interface UpdateSparePartRequest {
  name?: string;
  description?: string;
  brand?: string;
  cost_price?: number;
  selling_price?: number;
  min_stock_level?: number;
  unit_measure?: string;
  is_active?: boolean;
}

export interface StockAdjustmentRequest {
  spare_part_id: number;
  new_quantity: number;
  notes?: string;
}

export interface ListSparePartsResponse {
  spare_parts: SparePart[];
  total: number;
}

export interface LowStockAlert {
  spare_part: SparePart;
  current_stock: number;
  min_level: number;
}

export interface LowStockAlertsResponse {
  alerts: LowStockAlert[];
  total: number;
}
