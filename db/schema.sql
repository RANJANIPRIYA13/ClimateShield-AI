-- ClimateShield AI - PostgreSQL + PostGIS Schema Definition
-- Supports 13 entities with spatial GIS geometry types (EPSG:4326)

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Entity
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('Citizen', 'Authority', 'Responder', 'Admin')),
    phone VARCHAR(32),
    zone_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Risk Zones Entity
CREATE TABLE IF NOT EXISTS risk_zones (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    city VARCHAR(64) NOT NULL DEFAULT 'Chennai',
    sector_code VARCHAR(32) NOT NULL,
    base_risk_level VARCHAR(32) NOT NULL CHECK (base_risk_level IN ('Critical', 'Warning', 'Advisory', 'Safe')),
    population INT NOT NULL DEFAULT 0,
    boundary_geometry GEOMETRY(Polygon, 4326),
    boundary_geojson JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hazards Entity
CREATE TABLE IF NOT EXISTS hazards (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('Flood', 'Heatwave', 'Hurricane', 'Wildfire', 'Storm Surge', 'Waterlogging')),
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('Critical', 'Warning', 'Advisory', 'Safe')),
    probability INT NOT NULL CHECK (probability BETWEEN 0 AND 100),
    impact_score NUMERIC(3, 1) NOT NULL CHECK (impact_score BETWEEN 0 AND 10),
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE SET NULL,
    location_name VARCHAR(256) NOT NULL,
    location_geometry GEOMETRY(Point, 4326),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    trend VARCHAR(32) NOT NULL CHECK (trend IN ('increasing', 'stable', 'decreasing')),
    affected_population INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Weather Observations Entity
CREATE TABLE IF NOT EXISTS weather_observations (
    id VARCHAR(64) PRIMARY KEY,
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE CASCADE,
    temperature_c NUMERIC(4, 1) NOT NULL,
    rainfall_mm_hr NUMERIC(5, 1) NOT NULL,
    humidity_pct INT NOT NULL,
    river_level_m NUMERIC(4, 2) NOT NULL,
    wind_speed_kmh NUMERIC(5, 1) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Citizen Reports Entity
CREATE TABLE IF NOT EXISTS citizen_reports (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    location_name VARCHAR(256) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('Pending', 'Triaged', 'Dispatched', 'Resolved')),
    urgency VARCHAR(32) NOT NULL CHECK (urgency IN ('Critical', 'Warning', 'Advisory')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Roads Entity
CREATE TABLE IF NOT EXISTS roads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL CHECK (status IN ('Open', 'Flooded', 'Blocked', 'Restricted')),
    water_depth_cm INT NOT NULL DEFAULT 0,
    passability VARCHAR(32) NOT NULL CHECK (passability IN ('All Vehicles', '4x4 Only', 'Boats Only', 'Impassable')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Shelters Entity
CREATE TABLE IF NOT EXISTS shelters (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    address VARCHAR(256) NOT NULL,
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE SET NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    location_geometry GEOMETRY(Point, 4326),
    status VARCHAR(32) NOT NULL CHECK (status IN ('Open', 'Full', 'Standby', 'Closed')),
    occupancy INT NOT NULL DEFAULT 0,
    capacity INT NOT NULL DEFAULT 1,
    contact_phone VARCHAR(32) NOT NULL,
    facilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Hospitals Entity
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    address VARCHAR(256) NOT NULL,
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE SET NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    total_beds INT NOT NULL DEFAULT 0,
    available_beds INT NOT NULL DEFAULT 0,
    icu_beds INT NOT NULL DEFAULT 0,
    power_backup BOOLEAN DEFAULT TRUE,
    contact_phone VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Resources Entity
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('Vehicles', 'Medical Supplies', 'Power Systems', 'Water & Food', 'Personnel')),
    status VARCHAR(32) NOT NULL CHECK (status IN ('Ready', 'Deployed', 'Maintenance', 'Depleted')),
    total_units INT NOT NULL DEFAULT 0,
    available_units INT NOT NULL DEFAULT 0,
    depot_location VARCHAR(256) NOT NULL,
    last_maintenance DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Rescue Incidents Entity
CREATE TABLE IF NOT EXISTS rescue_incidents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    type VARCHAR(64) NOT NULL CHECK (type IN ('Infrastructure', 'Medical', 'Evacuation', 'Environmental')),
    priority VARCHAR(32) NOT NULL CHECK (priority IN ('Critical', 'Warning', 'Advisory', 'Safe')),
    status VARCHAR(32) NOT NULL CHECK (status IN ('Unassigned', 'In Progress', 'Resolved', 'Dispatched')),
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE SET NULL,
    location VARCHAR(256) NOT NULL,
    assignee VARCHAR(128) DEFAULT 'Unassigned',
    description TEXT NOT NULL,
    units_dispatched INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Resource Assignments Entity
CREATE TABLE IF NOT EXISTS resource_assignments (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES rescue_incidents(id) ON DELETE CASCADE,
    resource_id VARCHAR(64) REFERENCES resources(id) ON DELETE CASCADE,
    units_assigned INT NOT NULL CHECK (units_assigned > 0),
    status VARCHAR(32) NOT NULL CHECK (status IN ('Active', 'Completed', 'Recalled')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Alerts Entity
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    headline VARCHAR(256) NOT NULL,
    level VARCHAR(32) NOT NULL CHECK (level IN ('Critical', 'Warning', 'Advisory', 'Safe')),
    issuer VARCHAR(128) NOT NULL,
    action_required TEXT NOT NULL,
    affected_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
    broadcast_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 13. Risk History Entity
CREATE TABLE IF NOT EXISTS risk_history (
    id VARCHAR(64) PRIMARY KEY,
    zone_id VARCHAR(64) REFERENCES risk_zones(id) ON DELETE CASCADE,
    risk_score NUMERIC(3, 1) NOT NULL,
    water_level_m NUMERIC(4, 2) NOT NULL,
    power_outage_pct INT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial and B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_hazards_zone ON hazards(zone_id);
CREATE INDEX IF NOT EXISTS idx_weather_zone ON weather_observations(zone_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON rescue_incidents(status);
CREATE INDEX IF NOT EXISTS idx_shelters_status ON shelters(status);
