-- IoT Database Schema for Noise Monitoring and RFID Tracking
-- This schema prepares the system to receive IoT data from ESP32 devices

-- 1. IoT Devices Table - Store information about connected devices
CREATE TABLE IF NOT EXISTS iot_devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('noise_sensor', 'rfid_reader', 'combined')),
    location VARCHAR(100),
    room_id INTEGER,
    table_id INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Noise Level Readings Table - Store noise sensor data
CREATE TABLE IF NOT EXISTS noise_readings (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    noise_level DECIMAL(5,2) NOT NULL, -- dB level (e.g., 45.67)
    comfort_index DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00 (0 = very noisy, 1 = very quiet)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    room_id INTEGER,
    table_id INTEGER,
    reading_quality VARCHAR(20) DEFAULT 'good' CHECK (reading_quality IN ('good', 'poor', 'invalid')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES iot_devices(device_id) ON DELETE CASCADE
);

-- 3. RFID Events Table - Store RFID card readings
CREATE TABLE IF NOT EXISTS rfid_events (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    card_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(20),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('check_in', 'check_out', 'scan')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    room_id INTEGER,
    table_id INTEGER,
    session_duration INTEGER, -- in minutes, calculated for check_out events
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES iot_devices(device_id) ON DELETE CASCADE
);

-- 4. Room Environment Summary Table - Aggregated data per room/table
CREATE TABLE IF NOT EXISTS room_environment (
    id SERIAL PRIMARY KEY,
    room_id INTEGER,
    table_id INTEGER,
    current_noise_level DECIMAL(5,2),
    avg_noise_level DECIMAL(5,2),
    comfort_index DECIMAL(3,2),
    occupancy_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. IoT Alerts Table - Store system alerts and notifications
CREATE TABLE IF NOT EXISTS iot_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('noise_high', 'noise_low', 'device_offline', 'rfid_error', 'system_error')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    device_id VARCHAR(50),
    room_id INTEGER,
    table_id INTEGER,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES iot_devices(device_id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_noise_readings_timestamp ON noise_readings(timestamp);
CREATE INDEX IF NOT EXISTS idx_noise_readings_device_id ON noise_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_noise_readings_room_table ON noise_readings(room_id, table_id);

CREATE INDEX IF NOT EXISTS idx_rfid_events_timestamp ON rfid_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_rfid_events_device_id ON rfid_events(device_id);
CREATE INDEX IF NOT EXISTS idx_rfid_events_card_id ON rfid_events(card_id);
CREATE INDEX IF NOT EXISTS idx_rfid_events_room_table ON rfid_events(room_id, table_id);

CREATE INDEX IF NOT EXISTS idx_room_environment_room_table ON room_environment(room_id, table_id);
CREATE INDEX IF NOT EXISTS idx_room_environment_last_updated ON room_environment(last_updated);

CREATE INDEX IF NOT EXISTS idx_iot_alerts_created_at ON iot_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_iot_alerts_severity ON iot_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_iot_alerts_resolved ON iot_alerts(is_resolved);

-- Insert sample IoT devices (you can modify these based on your actual setup)
INSERT INTO iot_devices (device_id, device_name, device_type, location, room_id, table_id) VALUES
('NOISE_001', 'Noise Sensor - Table 1', 'noise_sensor', 'Library Floor 1 - Table 1', 1, 1),
('NOISE_002', 'Noise Sensor - Table 2', 'noise_sensor', 'Library Floor 1 - Table 2', 1, 2),
('RFID_001', 'RFID Reader - Table 1', 'rfid_reader', 'Library Floor 1 - Table 1', 1, 1),
('RFID_002', 'RFID Reader - Table 2', 'rfid_reader', 'Library Floor 1 - Table 2', 1, 2),
('COMBO_001', 'Combined Sensor - Table 3', 'combined', 'Library Floor 1 - Table 3', 1, 3)
ON CONFLICT (device_id) DO NOTHING;

-- Create a function to update room environment data
CREATE OR REPLACE FUNCTION update_room_environment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update room environment when new noise reading is inserted
    INSERT INTO room_environment (room_id, table_id, current_noise_level, avg_noise_level, comfort_index, last_updated)
    VALUES (
        NEW.room_id,
        NEW.table_id,
        NEW.noise_level,
        (SELECT AVG(noise_level) FROM noise_readings 
         WHERE room_id = NEW.room_id AND table_id = NEW.table_id 
         AND timestamp > NOW() - INTERVAL '1 hour'),
        NEW.comfort_index,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (room_id, table_id) 
    DO UPDATE SET
        current_noise_level = NEW.noise_level,
        avg_noise_level = (SELECT AVG(noise_level) FROM noise_readings 
                          WHERE room_id = NEW.room_id AND table_id = NEW.table_id 
                          AND timestamp > NOW() - INTERVAL '1 hour'),
        comfort_index = NEW.comfort_index,
        last_updated = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update room environment
CREATE TRIGGER trigger_update_room_environment
    AFTER INSERT ON noise_readings
    FOR EACH ROW
    EXECUTE FUNCTION update_room_environment();

-- Create a function to calculate comfort index from noise level
CREATE OR REPLACE FUNCTION calculate_comfort_index(noise_db DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    -- Comfort index calculation: 1.0 = very quiet, 0.0 = very noisy
    -- Based on typical library noise levels (30-70 dB)
    IF noise_db <= 30 THEN
        RETURN 1.0;
    ELSIF noise_db <= 40 THEN
        RETURN 0.9;
    ELSIF noise_db <= 50 THEN
        RETURN 0.7;
    ELSIF noise_db <= 60 THEN
        RETURN 0.4;
    ELSIF noise_db <= 70 THEN
        RETURN 0.1;
    ELSE
        RETURN 0.0;
    END IF;
END;
$$ LANGUAGE plpgsql;
