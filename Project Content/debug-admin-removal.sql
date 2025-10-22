-- Debug admin removal for adminlibrarian@umak.edu.ph
-- This will help us see what's happening when we try to remove admin status

-- Step 1: Check current state of adminlibrarian@umak.edu.ph
SELECT 'Current state' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 2: Test the admin_set_user_admin function directly
-- First, get the user ID
SELECT 'User ID for adminlibrarian@umak.edu.ph' as step,
  id::text,
  email
FROM users 
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 3: Manually test removing admin status
-- Replace 'USER_ID_HERE' with the actual user ID from step 2
-- SELECT admin_set_user_admin('USER_ID_HERE'::uuid, false);

-- Step 4: Check if the function exists and what it does
SELECT 
  'Function definition' as step,
  pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname = 'admin_set_user_admin';

-- Step 5: Check RLS policies on admin_users table
SELECT 
  'RLS policies on admin_users' as step,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'admin_users';
