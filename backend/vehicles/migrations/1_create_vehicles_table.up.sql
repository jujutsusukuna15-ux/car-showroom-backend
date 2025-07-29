CREATE TABLE vehicles (
  id BIGSERIAL PRIMARY KEY,
  vehicle_code VARCHAR(20) UNIQUE NOT NULL,
  chassis_number VARCHAR(50) UNIQUE NOT NULL,
  license_plate VARCHAR(20),
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  variant VARCHAR(50),
  year INTEGER NOT NULL,
  color VARCHAR(30),
  mileage INTEGER,
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
  transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic', 'cvt')),
  purchase_price DECIMAL(15,2),
  total_repair_cost DECIMAL(15,2) DEFAULT 0,
  suggested_selling_price DECIMAL(15,2),
  approved_selling_price DECIMAL(15,2),
  final_selling_price DECIMAL(15,2),
  status VARCHAR(20) NOT NULL DEFAULT 'purchased' CHECK (status IN ('purchased', 'in_repair', 'ready_to_sell', 'reserved', 'sold')),
  purchased_from_customer_id BIGINT,
  sold_to_customer_id BIGINT,
  purchased_by_cashier BIGINT,
  sold_by_cashier BIGINT,
  price_approved_by_admin BIGINT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  purchase_notes TEXT,
  condition_notes TEXT
);

CREATE TABLE vehicle_images (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT NOT NULL REFERENCES vehicles(id),
  image_path VARCHAR(255) NOT NULL,
  image_type VARCHAR(20) NOT NULL CHECK (image_type IN ('front', 'back', 'left', 'right', 'interior', 'engine', 'dashboard', 'damage', 'other')),
  description TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  uploaded_by BIGINT NOT NULL
);

CREATE INDEX idx_vehicles_code ON vehicles(vehicle_code);
CREATE INDEX idx_vehicles_chassis ON vehicles(chassis_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_brand_model ON vehicles(brand, model);
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
