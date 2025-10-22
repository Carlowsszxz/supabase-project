-- Force refresh admin status and clear any caching issues
-- This ensures the frontend sees the correct admin status

-- Step 1: Double-check current state
SELECT 'Current database state' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 2: Force update the users table again (in case of caching)
UPDATE users 
SET is_admin = false, updated_at = NOW()
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 3: Ensure admin_users table is clean
DELETE FROM admin_users 
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 4: Force update the timestamp to trigger any cache invalidation
UPDATE users 
SET updated_at = NOW()
WHERE email = 'adminlibrarian@umak.edu.ph';

-- Step 5: Verify final state
SELECT 'Final verification' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role,
  au.created_at::text
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'adminlibrarian@umak.edu.ph';

-- Step 6: Check if there are any other admin users that shouldn't be admin
SELECT 'All admin users check' as step,
  u.id::text,
  u.email,
  u.is_admin::text,
  au.role
FROM users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.is_admin = true OR au.role = 'admin'
ORDER BY u.email;
