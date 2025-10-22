-- Debug the authentication issue
-- Run this in your Supabase SQL Editor

-- Check what user is currently authenticated
SELECT 
  'Current authenticated user' as info,
  auth.uid() as current_user_id,
  auth.email() as current_email;

-- Check if the current user is in admin_users table
SELECT 
  'Admin check for current user' as info,
  au.id,
  au.email,
  au.role,
  CASE WHEN au.id IS NOT NULL THEN 'IS ADMIN' ELSE 'NOT ADMIN' END as status
FROM admin_users au
WHERE au.id = auth.uid();

-- Check if admin@umak.edu.ph is in admin_users with the right ID
SELECT 
  'admin@umak.edu.ph check' as info,
  au.id,
  au.email,
  au.role,
  'This should match the current_user_id above' as note
FROM admin_users au
WHERE au.email = 'admin@umak.edu.ph';

-- Check if there's a mismatch between auth.users and admin_users
SELECT 
  'ID mismatch check' as info,
  au.id as auth_id,
  admin_au.id as admin_id,
  au.email,
  CASE 
    WHEN au.id = admin_au.id THEN 'IDs MATCH' 
    ELSE 'IDs DO NOT MATCH - THIS IS THE PROBLEM!' 
  END as status
FROM auth.users au
LEFT JOIN admin_users admin_au ON admin_au.email = au.email
WHERE au.email = 'admin@umak.edu.ph';
