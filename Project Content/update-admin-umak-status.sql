-- Update admin@umak.edu.ph to ensure it's properly configured as admin
-- This handles the case where the user already exists

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

-- Step 3: Ensure admin@umak.edu.ph is in admin_users table
INSERT INTO admin_users (id, email, role, created_at)
SELECT 
  u.id,
  u.email,
  'admin',
  NOW()
FROM users u
WHERE u.email = 'admin@umak.edu.ph'
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
