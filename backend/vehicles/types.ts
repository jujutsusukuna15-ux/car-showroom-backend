export interface Vehicle {
  id: number;
  vehicle_code: string;
  chassis_number: string;
  license_plate?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  color?: string;
  mileage?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  purchase_price?: number;
  total_repair_cost: number;
  suggested_selling_price?: number;
  approved_selling_price?: number;
  final_selling_price?: number;
  status: VehicleStatus;
  purchased_from_customer_id?: number;
  sold_to_customer_id?: number;
  purchased_by_cashier?: number;
  sold_by_cashier?: number;
  price_approved_by_admin?: number;
  purchased_at?: Date;
  sold_at?: Date;
  created_at: Date;
  updated_at: Date;
  purchase_notes?: string;
  condition_notes?: string;
}

export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";
export type TransmissionType = "manual" | "automatic" | "cvt";
export type VehicleStatus = "purchased" | "in_repair" | "ready_to_sell" | "reserved" | "sold";

export interface VehicleImage {
  id: number;
  vehicle_id: number;
  image_path: string;
  image_type: ImageType;
  description?: string;
  is_primary: boolean;
  uploaded_at: Date;
  uploaded_by: number;
}

export type ImageType = "front" | "back" | "left" | "right" | "interior" | "engine" | "dashboard" | "damage" | "other";

export interface CreateVehicleRequest {
  chassis_number: string;
  license_plate?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  color?: string;
  mileage?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  purchase_price?: number;
  purchased_from_customer_id?: number;
  purchase_notes?: string;
  condition_notes?: string;
}

export interface UpdateVehicleRequest {
  license_plate?: string;
  brand?: string;
  model?: string;
  variant?: string;
  year?: number;
  color?: string;
  mileage?: number;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  status?: VehicleStatus;
  suggested_selling_price?: number;
  approved_selling_price?: number;
  final_selling_price?: number;
  condition_notes?: string;
}

export interface VehicleWithImages {
  vehicle: Vehicle;
  images: VehicleImage[];
}

export interface ListVehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

export interface UploadImageRequest {
  vehicle_id: number;
  image_type: ImageType;
  description?: string;
  is_primary?: boolean;
}
