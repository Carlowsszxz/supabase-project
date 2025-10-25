-- Correct admin_get_noise_logs function based on actual table structure
-- Drop existing function first
DROP FUNCTION IF EXISTS public.admin_get_noise_logs(INTEGER);

-- Create function with correct column types and names
CREATE OR REPLACE FUNCTION public.admin_get_noise_logs(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  id INTEGER,
  user_id UUID,
  table_id TEXT,
  noise_level NUMERIC,
  activity_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  reporter_email TEXT
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
    nl.created_at,
    nl.resolved_at,
    nl.canceled_at,
    nl.reporter_email
  FROM public.noise_logs nl
  ORDER BY nl.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT 'Correct admin_get_noise_logs function created!' AS status;
