-- TheCashX Laptop Buyback Platform: V1 Initial Schema
-- Supports PostgreSQL 15+

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'CUSTOMER', 'FIELD_AGENT', 'ADMIN'
    auth_provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL', -- 'LOCAL', 'PHONE', 'GOOGLE'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    alt_phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Field Agents Table
CREATE TABLE IF NOT EXISTS field_agents (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    hub VARCHAR(150) NOT NULL,
    specialization VARCHAR(150),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_pickups INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Active',
    joined_date DATE,
    avatar VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Buyback Requests Table
CREATE TABLE IF NOT EXISTS buyback_requests (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    assigned_agent_id VARCHAR(50) REFERENCES field_agents(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New Request',
    scheduled_date DATE,
    time_slot VARCHAR(100),
    dispatch_notes TEXT,
    request_date DATE NOT NULL,
    estimated_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    final_offer_price NUMERIC(12, 2) DEFAULT 0.00,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Request Devices Table
CREATE TABLE IF NOT EXISTS request_devices (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL UNIQUE REFERENCES buyback_requests(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150),
    processor VARCHAR(100),
    ram VARCHAR(50),
    storage VARCHAR(100),
    condition VARCHAR(50),
    age VARCHAR(50),
    accessories TEXT,
    expected_price NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Request Inspections Table
CREATE TABLE IF NOT EXISTS request_inspections (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL UNIQUE REFERENCES buyback_requests(id) ON DELETE CASCADE,
    inspected_by_agent_id VARCHAR(50) REFERENCES field_agents(id) ON DELETE SET NULL,
    screen_condition VARCHAR(100),
    body_condition VARCHAR(100),
    battery_health VARCHAR(100),
    keyboard_status VARCHAR(100),
    ports_status VARCHAR(100),
    wifi_bluetooth_status VARCHAR(100),
    sound_mic_status VARCHAR(100),
    verified_accessories TEXT,
    inspected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Status History Audit Trail
CREATE TABLE IF NOT EXISTS status_history (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL REFERENCES buyback_requests(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by_user_id VARCHAR(36),
    changed_by_name VARCHAR(150),
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. OTPs Table
CREATE TABLE IF NOT EXISTS otps (
    id VARCHAR(36) PRIMARY KEY,
    identifier VARCHAR(150) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL, -- 'LOGIN', 'RESET_PASSWORD'
    attempts INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Pricing Base Rates Table
CREATE TABLE IF NOT EXISTS pricing_base_rates (
    id VARCHAR(36) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150),
    base_price NUMERIC(12, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performant querying
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_field_agents_city ON field_agents(city);
CREATE INDEX IF NOT EXISTS idx_requests_customer ON buyback_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_requests_agent ON buyback_requests(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON buyback_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON buyback_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otps_identifier ON otps(identifier, expires_at);
