-- COMPLETE FIX for infinite recursion in activity_logs and admin_users
-- This fixes the root cause of the recursion issue

-- ==================================================
-- STEP 1: Fix admin_users table (root cause)
-- ==================================================

-- Drop any problematic policies on admin_users that might cause recursion
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admin_users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.admin_users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.admin_users;

-- For admin_users, we'll use simple non-recursive policies
-- Option A: Allow all authenticated users to read (RECOMMENDED)
CREATE POLICY "admin_users_read_all"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Option B: Only allow users to see their own admin status
-- (Uncomment if you prefer this instead of Option A)
-- CREATE POLICY "admin_users_read_own"
-- ON public.admin_users
-- FOR SELECT
-- TO authenticated
-- USING (auth.uid() = user_id);

-- Keep RLS enabled on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- STEP 2: Fix activity_logs table
-- ==================================================

-- Drop all existing policies on activity_logs
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
DROP POLICY IF EXISTS "activity_logs_read_all" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_all" ON public.activity_logs;

-- Create simple, non-recursive policies for activity_logs
CREATE POLICY "activity_logs_select"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "activity_logs_insert"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep RLS enabled on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- STEP 3: Verify the fix
-- ==================================================

-- Check that policies are set correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('activity_logs', 'admin_users')
ORDER BY tablename, policyname;

-- Show sample data to confirm access
SELECT 
  'activity_logs' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT type) as activity_types,
  MAX(created_at) as latest_activity
FROM public.activity_logs;

SELECT 'Fix completed successfully! Both tables should now work without recursion.' AS status;

