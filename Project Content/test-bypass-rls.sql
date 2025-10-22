-- Test bypassing RLS temporarily to see if that's the issue
-- Run this in your Supabase SQL Editor

-- Temporarily disable RLS on admin_users to test
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Now try the admin function
SELECT 
  'Testing admin function with RLS disabled' as test,
  admin_set_user_admin('73aaab23-dcd9-4482-a8bd-080ee1bc7a46', true) as result;

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Check if it worked
SELECT 
  'Check if user became admin' as test,
  au.id,
  au.email,
  au.role
FROM admin_users au
WHERE au.email = 'carlosalivarvar@gmail.com';
