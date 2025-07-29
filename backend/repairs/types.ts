export interface Repair {
  id: number;
  repair_number: string;
  vehicle_id: number;
  title: string;
  description?: string;
  labor_cost: number;
  total_parts_cost: number;
  total_cost: number;
  status: RepairStatus;
  mechanic_id?: number;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  work_notes?: string;
}

export type RepairStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface RepairPart {
  id: number;
  repair_id: number;
  spare_part_id: number;
  quantity_used: number;
  unit_cost: number;
  total_cost: number;
  used_at: Date;
  notes?: string;
}

export interface CreateRepairRequest {
  vehicle_id: number;
  title: string;
  description?: string;
  labor_cost?: number;
}

export interface UpdateRepairRequest {
  title?: string;
  description?: string;
  labor_cost?: number;
  status?: RepairStatus;
  mechanic_id?: number;
  work_notes?: string;
}

export interface AddRepairPartRequest {
  repair_id: number;
  spare_part_id: number;
  quantity_used: number;
  notes?: string;
}

export interface RepairWithParts {
  repair: Repair;
  parts: (RepairPart & { part_name: string; part_code: string })[];
}

export interface ListRepairsResponse {
  repairs: Repair[];
  total: number;
}
