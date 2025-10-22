-- Nuclear option: Complete admin cleanup and force refresh
-- This will ensure adminlibrarian@umak.edu.ph is completely removed

-- Step 1: Show current state
SELECT 'BEFORE NUCLEAR CLEANUP' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 2: Nuclear cleanup - remove from ALL possible admin tables
DELETE FROM admin_users WHERE email = 'adminlibrarian@umak.edu.ph';
DELETE FROM admin_users WHERE id = (SELECT id FROM users WHERE email = 'adminlibrarian@umak.edu.ph');

-- Step 3: Force update users table with timestamp
UPDATE users 
SET 
  is_admin = false, 
  updated_at = NOW(),
  first_name = COALESCE(first_name, ''),
  last_name = COALESCE(last_name, '')
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 4: Force update the updated_at timestamp again to trigger cache invalidation
UPDATE users 
SET updated_at = NOW() + INTERVAL '1 second'
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 5: Verify complete removal
SELECT 'AFTER NUCLEAR CLEANUP' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 6: Show all remaining admin users
SELECT 'REMAINING ADMIN USERS' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.is_admin = true OR au.role = 'admin'
ORDER BY u.email;

-- Step 7: Force database cache invalidation
SELECT pg_notify('admin_update', 'adminlibrarian@umak.edu.ph_removed');
