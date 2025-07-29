CREATE TABLE purchase_transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_number VARCHAR(20) UNIQUE NOT NULL,
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id BIGINT NOT NULL,
  customer_id BIGINT NOT NULL,
  vehicle_price DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'check')),
  payment_reference VARCHAR(100),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  cashier_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE sales_transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_number VARCHAR(20) UNIQUE NOT NULL,
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id BIGINT NOT NULL,
  customer_id BIGINT NOT NULL,
  vehicle_price DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'check', 'credit')),
  payment_reference VARCHAR(100),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  cashier_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchase_transactions_number ON purchase_transactions(transaction_number);
CREATE INDEX idx_purchase_transactions_invoice ON purchase_transactions(invoice_number);
CREATE INDEX idx_purchase_transactions_vehicle ON purchase_transactions(vehicle_id);
CREATE INDEX idx_purchase_transactions_customer ON purchase_transactions(customer_id);
CREATE INDEX idx_purchase_transactions_date ON purchase_transactions(transaction_date);

CREATE INDEX idx_sales_transactions_number ON sales_transactions(transaction_number);
CREATE INDEX idx_sales_transactions_invoice ON sales_transactions(invoice_number);
CREATE INDEX idx_sales_transactions_vehicle ON sales_transactions(vehicle_id);
CREATE INDEX idx_sales_transactions_customer ON sales_transactions(customer_id);
CREATE INDEX idx_sales_transactions_date ON sales_transactions(transaction_date);
