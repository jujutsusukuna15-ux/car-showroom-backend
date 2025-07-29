CREATE TABLE spare_parts (
  id BIGSERIAL PRIMARY KEY,
  part_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  brand VARCHAR(50),
  cost_price DECIMAL(15,2) NOT NULL,
  selling_price DECIMAL(15,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  unit_measure VARCHAR(20) NOT NULL DEFAULT 'pcs',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE stock_movements (
  id BIGSERIAL PRIMARY KEY,
  spare_part_id BIGINT NOT NULL REFERENCES spare_parts(id),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  reference_type VARCHAR(20) NOT NULL CHECK (reference_type IN ('repair', 'purchase', 'sales', 'adjustment')),
  reference_id BIGINT,
  quantity_before INTEGER NOT NULL,
  quantity_moved INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  movement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_by BIGINT NOT NULL,
  notes TEXT
);

CREATE INDEX idx_spare_parts_code ON spare_parts(part_code);
CREATE INDEX idx_spare_parts_name ON spare_parts(name);
CREATE INDEX idx_spare_parts_brand ON spare_parts(brand);
CREATE INDEX idx_stock_movements_part_id ON stock_movements(spare_part_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_stock_movements_date ON stock_movements(movement_date);
