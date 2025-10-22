-- Reset to only admin@umak.edu.ph as admin
-- Run this in your Supabase SQL Editor

-- Remove ALL admin users except admin@umak.edu.ph
DELETE FROM admin_users WHERE email != 'admin@umak.edu.ph';

-- Set is_admin = false for all users except admin@umak.edu.ph
UPDATE users 
SET is_admin = false
WHERE email != 'admin@umak.edu.ph';

-- Ensure admin@umak.edu.ph is properly set up
INSERT INTO admin_users (id, email, role, created_at)
VALUES ('8b1843a7-f649-42e2-9b07-4ae168fe3fcb', 'admin@umak.edu.ph', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Set admin@umak.edu.ph as admin in users table
UPDATE users 
SET is_admin = true
WHERE email = 'admin@umak.edu.ph';

-- Show final result
SELECT 
  'FINAL ADMIN STATUS' as info,
  au.id,
  au.email,
  au.role,
  u.is_admin,
  CASE 
    WHEN au.id IS NOT NULL AND u.is_admin = true THEN '✅ ADMIN' 
    ELSE '❌ NOT ADMIN'
  END as status
FROM admin_users au
JOIN users u ON u.id = au.id
ORDER BY au.email;
