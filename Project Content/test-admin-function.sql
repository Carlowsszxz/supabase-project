-- Test the admin_set_user_admin function directly
-- This will help us see if the RPC function is working

-- Step 1: Check if the function exists
SELECT 
  'Function exists check' as step,
  proname,
  proargnames,
  proargtypes::regtype[]
FROM pg_proc 
WHERE proname = 'admin_set_user_admin';

-- Step 2: Check current admin status for adminlibrarian@umak.edu.ph
SELECT 
  'Current admin status' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 3: Test the function with a simple call
-- Replace 'USER_ID_HERE' with the actual user ID from step 2
-- SELECT admin_set_user_admin('USER_ID_HERE'::uuid, false);

-- Step 4: Check RLS policies that might be blocking the function
SELECT 
  'RLS policies on users table' as step,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users' AND cmd IN ('UPDATE', 'ALL');

-- Step 5: Check if the current user (admin@umak.edu.ph) is properly authenticated
SELECT 
  'Current auth context' as step,
  auth.uid()::text as current_user_id,
  auth.email() as current_user_email;