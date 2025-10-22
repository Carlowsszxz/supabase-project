-- Simple test to check admin status and function
-- Run this in your Supabase SQL Editor

-- 1. Check if admin@umak.edu.ph exists and is admin
SELECT 
  'Current user check' as test,
  au.id,
  au.email,
  au.role,
  u.is_admin
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';

-- 2. Test the is_admin function
SELECT 
  'is_admin function test' as test,
  is_admin((SELECT id FROM auth.users WHERE email = 'admin@umak.edu.ph')) as result;

-- 3. Check if you can manually insert into admin_users (this will show if RLS is blocking)
-- This should work if you're properly authenticated as admin
SELECT 
  'RLS test' as test,
  'If you can see this, RLS is not blocking admin_users access' as message;

-- 4. Test the admin_set_user_admin function manually
-- Replace 'TARGET_USER_ID' with an actual user ID from your users table
SELECT 
  'Manual function test' as test,
  'Run this with a real user ID: SELECT admin_set_user_admin(''TARGET_USER_ID'', true);' as instruction;
