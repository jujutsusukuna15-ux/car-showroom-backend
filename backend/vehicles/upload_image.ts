import { api, APIError } from "encore.dev/api";
import { vehiclesDB } from "./db";
import { UploadImageRequest, VehicleImage } from "./types";

// Uploads an image for a vehicle.
export const uploadImage = api<UploadImageRequest, VehicleImage>(
  { expose: true, method: "POST", path: "/vehicles/images" },
  async (req) => {
    // Check if vehicle exists
    const vehicle = await vehiclesDB.queryRow`
      SELECT id FROM vehicles WHERE id = ${req.vehicle_id}
    `;

    if (!vehicle) {
      throw APIError.notFound("Vehicle not found");
    }

    // If setting as primary, unset other primary images
    if (req.is_primary) {
      await vehiclesDB.exec`
        UPDATE vehicle_images 
        SET is_primary = false 
        WHERE vehicle_id = ${req.vehicle_id}
      `;
    }

    // TODO: Get uploaded_by from auth context
    const uploadedBy = 1; // Placeholder

    // Generate image path (in real implementation, this would be handled by file upload)
    const imagePath = `/uploads/vehicles/${req.vehicle_id}/${Date.now()}.jpg`;

    const image = await vehiclesDB.queryRow<VehicleImage>`
      INSERT INTO vehicle_images (vehicle_id, image_path, image_type, description, is_primary, uploaded_by)
      VALUES (${req.vehicle_id}, ${imagePath}, ${req.image_type}, ${req.description}, ${req.is_primary || false}, ${uploadedBy})
      RETURNING id, vehicle_id, image_path, image_type, description, is_primary, uploaded_at, uploaded_by
    `;

    return image!;
  }
);
