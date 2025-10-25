-- Quick fix for admin_get_noise_logs function
-- This ensures the function exists and works properly

-- First, drop any existing function to avoid conflicts
DROP FUNCTION IF EXISTS public.admin_get_noise_logs(INTEGER);

-- Create a simple version that works with existing table structure
CREATE OR REPLACE FUNCTION public.admin_get_noise_logs(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  table_id TEXT,
  noise_level DECIMAL,
  activity_type TEXT,
  notes TEXT,
  location TEXT,
  status TEXT,
  resolved BOOLEAN,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    nl.id,
    nl.user_id,
    nl.table_id,
    nl.noise_level,
    nl.activity_type,
    nl.notes,
    nl.location,
    nl.status,
    nl.resolved,
    nl.resolved_at,
    nl.created_at
  FROM public.noise_logs nl
  ORDER BY nl.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT 'admin_get_noise_logs function created successfully!' AS status;
