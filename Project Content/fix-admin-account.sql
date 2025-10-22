-- Fix admin@umak.edu.ph admin account
-- Run this in your Supabase SQL Editor

-- First, let's check the current status of admin@umak.edu.ph
SELECT 
  'Current status of admin@umak.edu.ph' as info,
  au.id,
  au.email,
  au.role,
  u.is_admin,
  u.first_name,
  u.last_name
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';

-- Test the modified function with admin@umak.edu.ph
-- (This will test if the function works without auth check)
SELECT 
  'Testing function with admin@umak.edu.ph' as test,
  admin_set_user_admin_test('8b1843a7-f649-42e2-9b07-4ae168fe3fcb', true) as result;

-- Check if admin@umak.edu.ph is properly set up
SELECT 
  'Final check - admin@umak.edu.ph status' as info,
  au.id,
  au.email,
  au.role,
  u.is_admin,
  CASE 
    WHEN au.id IS NOT NULL AND u.is_admin = true THEN 'FULLY ADMIN' 
    WHEN au.id IS NOT NULL AND u.is_admin = false THEN 'ADMIN_USERS ONLY'
    WHEN au.id IS NULL AND u.is_admin = true THEN 'USERS TABLE ONLY'
    ELSE 'NOT ADMIN'
  END as admin_status
FROM admin_users au
FULL OUTER JOIN users u ON u.id = au.id
WHERE u.email = 'admin@umak.edu.ph' OR au.email = 'admin@umak.edu.ph';
