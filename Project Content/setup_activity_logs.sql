-- Create activity_logs table for Frame 7
-- This table stores all system activities, user interactions, and events

-- Drop table if exists (for clean setup)
-- DROP TABLE IF EXISTS public.activity_logs CASCADE;

-- Create activity_logs table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON public.activity_logs(severity);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to read activity logs
CREATE POLICY "Allow authenticated users to read activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert activity logs
CREATE POLICY "Allow authenticated users to insert activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- For update/delete, we'll use a simpler approach to avoid recursion
-- Only allow updates/deletes for system records (no user_id) or own records
CREATE POLICY "Allow users to update own activity logs"
ON public.activity_logs
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow users to delete own activity logs"
ON public.activity_logs
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Insert sample data for testing
INSERT INTO public.activity_logs (user_name, type, title, description, severity, details)
VALUES
  ('Carlos Ryan', 'login', 'User Login', 'Carlos Ryan logged into the system', 'info', '{"ip": "192.168.1.100", "device": "Chrome on Windows"}'),
  ('System', 'noise', 'Noise Level Alert', 'High noise level detected at Table 1', 'warning', '{"table": "Table_1", "decibel": 85.5}'),
  ('John Doe', 'login', 'User Login', 'John Doe logged into the system', 'info', '{"ip": "192.168.1.101", "device": "Firefox on Mac"}'),
  ('System', 'occupancy', 'Seat Occupied', 'Table 2, Seat 3 was occupied', 'success', '{"table_id": "Table_2", "seat_number": 3}'),
  ('Admin', 'system', 'System Backup', 'Database backup completed successfully', 'success', '{"backup_size": "1.2GB", "duration": "5 minutes"}'),
  ('System', 'noise', 'Noise Level Critical', 'Critical noise level at Table 3', 'critical', '{"table": "Table_3", "decibel": 95.2}'),
  ('Jane Smith', 'logout', 'User Logout', 'Jane Smith logged out of the system', 'info', '{"session_duration": "2 hours"}'),
  ('System', 'report', 'Noise Report', 'Anonymous noise report submitted for Table 1', 'warning', '{"urgency": "high", "location": "Table_1"}'),
  ('Admin', 'system', 'User Account Created', 'New user account created for testing', 'info', '{"email": "test@umak.edu.ph"}'),
  ('System', 'occupancy', 'Seat Freed', 'Table 1, Seat 2 is now available', 'success', '{"table_id": "Table_1", "seat_number": 2}'),
  ('Carlos Ryan', 'rfid', 'RFID Tap', 'Carlos Ryan tapped RFID at Table 1', 'info', '{"uid": "CR001", "table": "Table_1"}'),
  ('System', 'noise', 'Noise Level Normal', 'Noise level returned to normal at Table 3', 'success', '{"table": "Table_3", "decibel": 45.0}'),
  ('Admin', 'system', 'System Maintenance', 'Scheduled system maintenance started', 'warning', '{"duration": "30 minutes", "type": "database optimization"}'),
  ('System', 'report', 'Noise Report Resolved', 'Noise report for Table 1 has been resolved', 'success', '{"report_id": 234, "location": "Table_1"}'),
  ('Maria Garcia', 'login', 'User Login', 'Maria Garcia logged into the system', 'info', '{"ip": "192.168.1.102", "device": "Safari on iPhone"}');

-- Create a function to auto-log login events (optional)
CREATE OR REPLACE FUNCTION public.log_user_login()
RETURNS TRIGGER AS $$
BEGIN
  -- This could be triggered on auth events if needed
  -- For now, we'll handle logging manually in the app
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a comment to the table
COMMENT ON TABLE public.activity_logs IS 'Stores all system activities, user interactions, and events for auditing and monitoring';

-- Grant permissions
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT SELECT ON public.activity_logs TO anon;

-- Success message
SELECT 'activity_logs table setup complete!' AS status;

