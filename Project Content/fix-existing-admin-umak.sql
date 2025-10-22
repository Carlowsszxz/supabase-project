-- Fix admin@umak.edu.ph status - handles all existing records
-- This script updates existing records instead of inserting new ones

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

-- Step 2: Update users table to set is_admin = true
UPDATE users 
SET 
  is_admin = true,
  updated_at = NOW()
WHERE email = 'admin@umak.edu.ph';

-- Step 3: Update admin_users table (handle existing record)
UPDATE admin_users 
SET 
  email = 'admin@umak.edu.ph',
  role = 'admin',
  created_at = CASE WHEN created_at IS NULL THEN NOW() ELSE created_at END
WHERE email = 'admin@umak.edu.ph';

-- Step 4: If no record exists in admin_users, insert it
INSERT INTO admin_users (id, email, role, created_at)
SELECT 
  u.id,
  u.email,
  'admin',
  NOW()
FROM users u
WHERE u.email = 'admin@umak.edu.ph'
AND NOT EXISTS (SELECT 1 FROM admin_users au WHERE au.email = 'admin@umak.edu.ph');

-- Step 5: Final verification
SELECT 'Final verification' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  u.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@umak.edu.ph';
