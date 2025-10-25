-- QUICK FIX for activity_logs RLS infinite recursion error
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Allow authenticated users to read activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow admins to update activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow admins to delete activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow users to update own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow users to delete own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_select_policy" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_policy" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_update_policy" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_delete_policy" ON public.activity_logs;

-- Step 2: Create simple policies WITHOUT admin checks (no recursion possible)

-- Allow all authenticated users to read activity logs
CREATE POLICY "activity_logs_read_all"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (true);

-- Allow all authenticated users to insert new activity logs
CREATE POLICY "activity_logs_insert_all"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- (Optional) If you want users to update/delete their own records:
-- Uncomment these:

-- CREATE POLICY "activity_logs_update_own"
-- ON public.activity_logs
-- FOR UPDATE
-- TO authenticated
-- USING (user_id = auth.uid());

-- CREATE POLICY "activity_logs_delete_own"
-- ON public.activity_logs
-- FOR DELETE
-- TO authenticated
-- USING (user_id = auth.uid());

-- Step 3: Verify the table has RLS enabled
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Done! Check the status
SELECT 
  'activity_logs RLS fixed!' AS status,
  COUNT(*) AS total_records,
  COUNT(DISTINCT type) AS activity_types
FROM public.activity_logs;
