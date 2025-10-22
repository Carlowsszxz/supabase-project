-- Brute force remove admin status from adminlibrarian@umak.edu.ph
-- This bypasses all RLS and functions

-- Step 1: Check current state
SELECT 'Before removal' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 2: Force remove from admin_users table
DELETE FROM admin_users 
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 3: Force update users table
UPDATE users 
SET is_admin = false, updated_at = NOW()
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 4: Verify removal
SELECT 'After removal' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 5: Also remove any other admin users that shouldn't be admin
-- (Optional - uncomment if you want to clean up)
-- DELETE FROM admin_users WHERE email != 'admin@umak.edu.ph';
-- UPDATE users SET is_admin = false WHERE email != 'admin@umak.edu.ph';
