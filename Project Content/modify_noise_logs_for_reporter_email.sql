-- Modify noise_logs table to include reporter_email for admin visibility
-- This allows admins to see who reported complaints while keeping student view anonymous

-- Add reporter_email column to noise_logs table
ALTER TABLE public.noise_logs 
ADD COLUMN IF NOT EXISTS reporter_email TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_noise_logs_reporter_email ON public.noise_logs(reporter_email);

-- Add comment to explain the column
COMMENT ON COLUMN public.noise_logs.reporter_email IS 'Email of the user who submitted the report (visible to admins only)';

-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.admin_get_noise_logs(INTEGER);

-- Update the admin_get_noise_logs function to include reporter_email
CREATE OR REPLACE FUNCTION public.admin_get_noise_logs(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  reporter_email TEXT,
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
    nl.reporter_email,
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

-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.user_get_noise_logs(INTEGER);

-- Update the user_get_noise_logs function to exclude reporter_email for privacy
CREATE OR REPLACE FUNCTION public.user_get_noise_logs(limit_count INTEGER DEFAULT 50)
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
  WHERE nl.user_id = auth.uid() OR nl.user_id IS NULL
  ORDER BY nl.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'noise_logs table modified for reporter email visibility!' AS status;
