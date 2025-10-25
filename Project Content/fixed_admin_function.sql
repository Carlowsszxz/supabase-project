-- Fixed admin_get_noise_logs function using only existing columns
-- Drop any existing function first
DROP FUNCTION IF EXISTS public.admin_get_noise_logs(INTEGER);

-- Create function with only existing columns
CREATE OR REPLACE FUNCTION public.admin_get_noise_logs(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  table_id TEXT,
  noise_level DECIMAL,
  activity_type TEXT,
  notes TEXT,
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
SELECT 'Fixed admin_get_noise_logs function created!' AS status;
