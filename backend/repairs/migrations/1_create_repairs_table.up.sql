CREATE TABLE repairs (
  id BIGSERIAL PRIMARY KEY,
  repair_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  labor_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_parts_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  mechanic_id BIGINT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  work_notes TEXT
);

CREATE TABLE repair_parts (
  id BIGSERIAL PRIMARY KEY,
  repair_id BIGINT NOT NULL REFERENCES repairs(id),
  spare_part_id BIGINT NOT NULL,
  quantity_used INTEGER NOT NULL,
  unit_cost DECIMAL(15,2) NOT NULL,
  total_cost DECIMAL(15,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_repairs_number ON repairs(repair_number);
CREATE INDEX idx_repairs_vehicle_id ON repairs(vehicle_id);
CREATE INDEX idx_repairs_status ON repairs(status);
CREATE INDEX idx_repairs_mechanic_id ON repairs(mechanic_id);
CREATE INDEX idx_repair_parts_repair_id ON repair_parts(repair_id);
CREATE INDEX idx_repair_parts_spare_part_id ON repair_parts(spare_part_id);
