-- Debug the admin function step by step
-- Run this in your Supabase SQL Editor

-- 1. Check if current user is in admin_users (this is what the function checks)
SELECT 
  'Step 1: Check if current user is admin' as step,
  au.id,
  au.email,
  au.role,
  CASE WHEN au.id IS NOT NULL THEN 'PASS' ELSE 'FAIL' END as result
FROM admin_users au 
WHERE au.id = auth.uid() AND au.role = 'admin';

-- 2. Test the exact condition from the function
SELECT 
  'Step 2: Test function condition' as step,
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id = auth.uid() AND au.role = 'admin'
  ) as condition_result;

-- 3. Check if we can manually insert into admin_users (test RLS)
SELECT 
  'Step 3: Test RLS on admin_users' as step,
  'If this fails, RLS is blocking' as note;

-- Try a simple select to see if RLS allows reading
SELECT 
  'Step 4: Test reading admin_users' as step,
  COUNT(*) as admin_count
FROM admin_users;

-- 5. Check if the target user exists (this is the second check in the function)
SELECT 
  'Step 5: Check target user exists' as step,
  u.id,
  u.email,
  CASE WHEN u.id IS NOT NULL THEN 'EXISTS' ELSE 'NOT FOUND' END as status
FROM users u
WHERE u.id = '73aaab23-dcd9-4482-a8bd-080ee1bc7a46'; -- carlosalivarvar@gmail.com

-- 6. Test if we can manually insert into admin_users
-- This will show if RLS is the problem
SELECT 
  'Step 6: Manual insert test' as step,
  'About to test manual insert...' as note;
