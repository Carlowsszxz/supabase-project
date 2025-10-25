-- Simple Activity Logs Setup (No RLS - For Testing Only)
-- This version disables RLS to avoid any policy conflicts
-- Use this if you just want to test the functionality quickly

-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'info',
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON public.activity_logs(severity);

-- DISABLE RLS for testing (WARNING: This makes the table accessible to all authenticated users)
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.activity_logs TO authenticated;
GRANT SELECT ON public.activity_logs TO anon;

-- Insert sample data
INSERT INTO public.activity_logs (user_name, type, title, description, severity, details)
VALUES
  ('Carlos Ryan', 'login', 'User Login', 'Carlos Ryan logged into the system', 'info', '{"ip": "192.168.1.100"}'),
  ('System', 'noise', 'Noise Level Alert', 'High noise level detected at Table 1', 'warning', '{"table": "Table_1", "decibel": 85.5}'),
  ('John Doe', 'login', 'User Login', 'John Doe logged into the system', 'info', '{"ip": "192.168.1.101"}'),
  ('System', 'occupancy', 'Seat Occupied', 'Table 2, Seat 3 was occupied', 'success', '{"table_id": "Table_2", "seat_number": 3}'),
  ('Admin', 'system', 'System Backup', 'Database backup completed successfully', 'success', '{"backup_size": "1.2GB"}'),
  ('System', 'noise', 'Noise Level Critical', 'Critical noise level at Table 3', 'critical', '{"table": "Table_3", "decibel": 95.2}'),
  ('Jane Smith', 'logout', 'User Logout', 'Jane Smith logged out', 'info', '{"session_duration": "2 hours"}'),
  ('System', 'report', 'Noise Report', 'Anonymous noise report for Table 1', 'warning', '{"urgency": "high"}'),
  ('Admin', 'system', 'User Created', 'New user account created', 'info', '{"email": "test@umak.edu.ph"}'),
  ('System', 'occupancy', 'Seat Freed', 'Table 1, Seat 2 is now available', 'success', '{"table_id": "Table_1"}'),
  ('Carlos Ryan', 'rfid', 'RFID Tap', 'Carlos Ryan tapped RFID at Table 1', 'info', '{"uid": "CR001"}'),
  ('System', 'noise', 'Noise Normal', 'Noise level normal at Table 3', 'success', '{"table": "Table_3", "decibel": 45.0}'),
  ('Admin', 'system', 'Maintenance', 'System maintenance started', 'warning', '{"duration": "30 minutes"}'),
  ('System', 'report', 'Report Resolved', 'Noise report resolved', 'success', '{"report_id": 234}'),
  ('Maria Garcia', 'login', 'User Login', 'Maria Garcia logged in', 'info', '{"ip": "192.168.1.102"}')
ON CONFLICT DO NOTHING;

SELECT 'Simple activity_logs table created! RLS is DISABLED for testing.' AS status,
       COUNT(*) AS sample_records FROM public.activity_logs;

