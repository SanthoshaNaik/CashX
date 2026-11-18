-- TheCashX Laptop Buyback Platform: V2 Seed Initial Data
-- Matches V1__initial_schema.sql column names exactly

-- =============================================
-- 1. Admin User
-- =============================================
INSERT INTO users (id, email, full_name, role, auth_provider, password_hash)
VALUES ('admin-uuid-001', 'admin@thecashx.com', 'Super Admin', 'ADMIN', 'LOCAL',
        '$2a$12$XAUN9k4kGEP6V6MgPgMa0u5wv4/gm5z5zYw/99Nl26C3g0NnxMShm');

-- =============================================
-- 2. Field Agent Users
-- =============================================
INSERT INTO users (id, email, phone, full_name, role, auth_provider, password_hash) VALUES
('agent-user-001', 'suresh.gowda@thecashx.com', '9876543001', 'Suresh Gowda', 'FIELD_AGENT', 'LOCAL',
 '$2a$12$87qbZzCWfou11n9XSipZ9.Oty9cun9OzEAJvyx16z82Q2AeaAxV2S'),
('agent-user-002', 'priya.sharma@thecashx.com', '9876543002', 'Priya Sharma', 'FIELD_AGENT', 'LOCAL',
 '$2a$12$87qbZzCWfou11n9XSipZ9.Oty9cun9OzEAJvyx16z82Q2AeaAxV2S'),
('agent-user-003', 'ravi.kumar@thecashx.com', '9876543003', 'Ravi Kumar', 'FIELD_AGENT', 'LOCAL',
 '$2a$12$87qbZzCWfou11n9XSipZ9.Oty9cun9OzEAJvyx16z82Q2AeaAxV2S'),
('agent-user-004', 'meena.patel@thecashx.com', '9876543004', 'Meena Patel', 'FIELD_AGENT', 'LOCAL',
 '$2a$12$87qbZzCWfou11n9XSipZ9.Oty9cun9OzEAJvyx16z82Q2AeaAxV2S');

-- =============================================
-- 3. Field Agents
-- =============================================
INSERT INTO field_agents (id, user_id, name, phone, email, city, hub, specialization, rating, completed_pickups, status, joined_date) VALUES
('agent-101', 'agent-user-001', 'Suresh Gowda', '9876543001', 'suresh.gowda@thecashx.com',
 'Bangalore', 'Koramangala Hub', 'Laptops & MacBooks', 4.85, 156, 'Active', '2024-03-15'),
('agent-102', 'agent-user-002', 'Priya Sharma', '9876543002', 'priya.sharma@thecashx.com',
 'Chennai', 'T.Nagar Hub', 'Desktops & Monitors', 4.92, 203, 'Active', '2024-01-10'),
('agent-103', 'agent-user-003', 'Ravi Kumar', '9876543003', 'ravi.kumar@thecashx.com',
 'Hyderabad', 'HITEC City Hub', 'All Categories', 4.78, 89, 'Active', '2024-06-20'),
('agent-104', 'agent-user-004', 'Meena Patel', '9876543004', 'meena.patel@thecashx.com',
 'Mumbai', 'Andheri Hub', 'Apple Products', 4.95, 312, 'Active', '2023-11-05');

-- =============================================
-- 4. Pricing Base Rates
-- =============================================
INSERT INTO pricing_base_rates (id, category, brand, model, base_price, active) VALUES
-- Laptop brands
('pbr-uuid-001', 'Laptop', 'Apple MacBook', NULL, 45000.00, TRUE),
('pbr-uuid-002', 'Laptop', 'Dell', NULL, 22000.00, TRUE),
('pbr-uuid-003', 'Laptop', 'HP', NULL, 20000.00, TRUE),
('pbr-uuid-004', 'Laptop', 'Lenovo', NULL, 19000.00, TRUE),
('pbr-uuid-005', 'Laptop', 'Asus', NULL, 21000.00, TRUE),
('pbr-uuid-006', 'Laptop', 'Acer', NULL, 17000.00, TRUE),
('pbr-uuid-007', 'Laptop', 'MSI', NULL, 28000.00, TRUE),
('pbr-uuid-008', 'Laptop', 'Microsoft Surface', NULL, 32000.00, TRUE),
('pbr-uuid-009', 'Laptop', 'Samsung', NULL, 18000.00, TRUE),
('pbr-uuid-010', 'Laptop', 'Toshiba', NULL, 11000.00, TRUE),
('pbr-uuid-011', 'Laptop', 'Sony Vaio', NULL, 12000.00, TRUE),
('pbr-uuid-012', 'Laptop', 'LG Gram', NULL, 25000.00, TRUE),
-- Desktop
('pbr-uuid-013', 'Desktop', 'Generic', NULL, 32000.00, TRUE),
-- Monitor
('pbr-uuid-014', 'Monitor', 'Generic', NULL, 12000.00, TRUE),
-- Mac Mini models
('pbr-uuid-015', 'MacMini', 'Apple', 'Mac Mini M4 Pro (2024)', 75000.00, TRUE),
('pbr-uuid-016', 'MacMini', 'Apple', 'Mac Mini M4 (2024)', 52000.00, TRUE),
('pbr-uuid-017', 'MacMini', 'Apple', 'Mac Mini M2 Pro (2023)', 62000.00, TRUE),
('pbr-uuid-018', 'MacMini', 'Apple', 'Mac Mini M2 (2023)', 42000.00, TRUE),
('pbr-uuid-019', 'MacMini', 'Apple', 'Mac Mini M1 (2020)', 32000.00, TRUE),
('pbr-uuid-020', 'MacMini', 'Apple', 'Mac Mini Intel Core i7', 18000.00, TRUE),
('pbr-uuid-021', 'MacMini', 'Apple', 'Mac Mini Intel Core i5', 14000.00, TRUE);

-- =============================================
-- 5. Sample Customer Users & Customers
-- =============================================
INSERT INTO users (id, email, phone, full_name, role, auth_provider) VALUES
('cust-user-001', 'rahul@example.com', '9988776655', 'Rahul Verma', 'CUSTOMER', 'LOCAL'),
('cust-user-002', 'anita@example.com', '9988776644', 'Anita Singh', 'CUSTOMER', 'LOCAL'),
('cust-user-003', 'kiran@example.com', '9988776633', 'Kiran Reddy', 'CUSTOMER', 'LOCAL');

INSERT INTO customers (id, user_id, full_name, phone, email, address, city, pincode) VALUES
('cust-uuid-001', 'cust-user-001', 'Rahul Verma', '9988776655', 'rahul@example.com',
 '123 MG Road, Indiranagar', 'Bangalore', '560038'),
('cust-uuid-002', 'cust-user-002', 'Anita Singh', '9988776644', 'anita@example.com',
 '45 Carter Road, Bandra West', 'Mumbai', '400050'),
('cust-uuid-003', 'cust-user-003', 'Kiran Reddy', '9988776633', 'kiran@example.com',
 '78 Jubilee Hills, Road No. 36', 'Hyderabad', '500033');

-- =============================================
-- 6. Sample Buyback Requests & Devices
-- =============================================
INSERT INTO buyback_requests (id, customer_id, assigned_agent_id, status, request_date, estimated_price, scheduled_date, time_slot, final_offer_price) VALUES
('LB-1001', 'cust-uuid-001', NULL, 'New Request', CURRENT_DATE, 28500.00, NULL, NULL, 0.00),
('LB-1002', 'cust-uuid-002', 'agent-104', 'Pickup Scheduled', CURRENT_DATE, 52000.00,
 CURRENT_DATE + INTERVAL '2 days', '10:00 AM - 12:00 PM', 0.00),
('LB-1003', 'cust-uuid-003', 'agent-103', 'Completed', CURRENT_DATE - INTERVAL '5 days', 18000.00,
 CURRENT_DATE - INTERVAL '3 days', '02:00 PM - 04:00 PM', 16500.00);

INSERT INTO request_devices (id, request_id, device_type, brand, model, processor, ram, storage, condition, age, accessories, expected_price) VALUES
('dev-uuid-001', 'LB-1001', 'Laptop', 'Dell', 'Inspiron 15', 'Intel Core i5-12th Gen', '8GB', '512GB SSD',
 'Good', '1-2 Years', 'Charger, Original Box', 28500.00),
('dev-uuid-002', 'LB-1002', 'Laptop', 'Apple MacBook', 'MacBook Pro 14"', 'M1 Pro', '16GB', '512GB SSD',
 'Excellent', '1-2 Years', 'Charger, Original Box, Invoice', 52000.00),
('dev-uuid-003', 'LB-1003', 'Desktop', 'HP', 'Pavilion Tower', 'Intel Core i7-10th Gen', '16GB', '1TB HDD',
 'Average', '2-4 Years', 'Charger', 18000.00);

-- =============================================
-- 7. Status History Audit Trail
-- =============================================
INSERT INTO status_history (id, request_id, from_status, to_status, changed_by_user_id, changed_by_name, reason) VALUES
-- LB-1001: New Request
('sh-uuid-001', 'LB-1001', NULL, 'New Request', 'cust-user-001', 'Rahul Verma', 'Customer submitted buyback request'),
-- LB-1002: New Request -> Pickup Scheduled
('sh-uuid-002', 'LB-1002', NULL, 'New Request', 'cust-user-002', 'Anita Singh', 'Customer submitted buyback request'),
('sh-uuid-003', 'LB-1002', 'New Request', 'Pickup Scheduled', 'admin-uuid-001', 'Super Admin', 'Agent Meena Patel assigned for doorstep pickup'),
-- LB-1003: Full lifecycle
('sh-uuid-004', 'LB-1003', NULL, 'New Request', 'cust-user-003', 'Kiran Reddy', 'Customer submitted buyback request'),
('sh-uuid-005', 'LB-1003', 'New Request', 'Pickup Scheduled', 'admin-uuid-001', 'Super Admin', 'Agent Ravi Kumar assigned for doorstep pickup'),
('sh-uuid-006', 'LB-1003', 'Pickup Scheduled', 'Inspection in Progress', 'agent-user-003', 'Ravi Kumar', 'Agent arrived at customer location'),
('sh-uuid-007', 'LB-1003', 'Inspection in Progress', 'Completed', 'agent-user-003', 'Ravi Kumar', 'Inspection complete, customer accepted offer of ₹16,500');

-- =============================================
-- 8. Inspection Record for Completed Request
-- =============================================
INSERT INTO request_inspections (id, request_id, inspected_by_agent_id, screen_condition, body_condition, battery_health, keyboard_status, ports_status, wifi_bluetooth_status, sound_mic_status, verified_accessories, inspected_at) VALUES
('insp-uuid-001', 'LB-1003', 'agent-103',
 'Minor Scratches', 'Average - Visible wear', 'Fair (70-79%)', 'Working', 'Working',
 'Working', 'Working', 'Charger',
 CURRENT_TIMESTAMP - INTERVAL '3 days');
