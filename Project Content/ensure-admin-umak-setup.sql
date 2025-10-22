-- Ensure admin@umak.edu.ph is properly set up as admin
-- Run this in your Supabase SQL Editor

-- Step 1: Check current state
SELECT 'Current state check' as step, 
  u.id::text, 
  u.email, 
  u.is_admin::text,
  au.role,
  u.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@umak.edu.ph';

-- Step 2: Ensure admin@umak.edu.ph is in users table with is_admin = true
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

-- Step 3: Ensure admin@umak.edu.ph is in admin_users table
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

-- Step 4: Final verification
SELECT 'Final verification' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  u.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@umak.edu.ph';
