-- Debug admin access for admin@umak.edu.ph
-- Run this in your Supabase SQL Editor to check admin status

-- Check if user exists in auth.users
SELECT 
  'auth.users' as table_name,
  id::text,
  email,
  email_confirmed_at::text,
  created_at::text
FROM auth.users 
WHERE email = 'admin@umak.edu.ph'

UNION ALL

-- Check if user exists in users table
SELECT 
  'users' as table_name,
  id::text,
  email,
  is_admin::text,
  created_at::text
FROM users 
WHERE email = 'admin@umak.edu.ph'

UNION ALL

-- Check if user is in admin_users table
SELECT 
  'admin_users' as table_name,
  id::text,
  email,
  role,
  created_at::text
FROM admin_users 
WHERE email = 'admin@umak.edu.ph';

-- Test the is_admin function
SELECT 
  'is_admin function test' as test,
  is_admin((SELECT id FROM auth.users WHERE email = 'admin@umak.edu.ph')) as result;

-- Check RLS policies on admin_users table
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
WHERE tablename = 'admin_users';
