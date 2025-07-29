-- Seed demo users
-- The password for all users is 'password'
-- The bcrypt hash was generated with 10 rounds.

INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES ('admin', 'admin@dealership.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'admin', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES ('cashier', 'cashier@dealership.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Cashier User', 'cashier', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES ('mechanic', 'mechanic@dealership.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mechanic User', 'mechanic', true)
ON CONFLICT (username) DO NOTHING;
