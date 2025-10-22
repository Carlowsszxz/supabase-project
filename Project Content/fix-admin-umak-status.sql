-- Fix admin@umak.edu.ph admin status
-- This ensures admin@umak.edu.ph is properly set up as an admin

-- First, check if admin@umak.edu.ph exists in auth.users
SELECT 
  'auth.users check' as step,
  id::text,
  email,
  email_confirmed_at::text
FROM auth.users 
WHERE email = 'admin@umak.edu.ph';

-- Check if admin@umak.edu.ph exists in users table
SELECT 
  'users table check' as step,
  id::text,
  email,
  is_admin::text,
  created_at::text
FROM users 
WHERE email = 'admin@umak.edu.ph';

-- Check if admin@umak.edu.ph is in admin_users table
SELECT 
  'admin_users table check' as step,
  id::text,
  email,
  role,
  created_at::text
FROM admin_users 
WHERE email = 'admin@umak.edu.ph';

-- Ensure admin@umak.edu.ph is in users table with is_admin = true
INSERT INTO users (id, email, first_name, last_name, is_admin, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  'Admin',
  'User',
  true,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'admin@umak.edu.ph'
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  updated_at = NOW();

-- Ensure admin@umak.edu.ph is in admin_users table
INSERT INTO admin_users (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  'admin',
  NOW()
FROM auth.users au
WHERE au.email = 'admin@umak.edu.ph'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Verify the final state
SELECT 
  'Final verification' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  u.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@umak.edu.ph';
