-- Clean up test data and verify admin@umak.edu.ph
-- Run this in your Supabase SQL Editor

-- Remove any test admin entries (keep only real admins)
DELETE FROM admin_users WHERE email = 'carlosalivarvar@gmail.com';

-- Show current admin users
SELECT 
  'Current admin users' as info,
  au.id,
  au.email,
  au.role,
  au.created_at
FROM admin_users au
ORDER BY au.created_at;

-- Ensure admin@umak.edu.ph is the primary admin
INSERT INTO admin_users (id, email, role, created_at)
VALUES ('8b1843a7-f649-42e2-9b07-4ae168fe3fcb', 'admin@umak.edu.ph', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Final verification
SELECT 
  'FINAL VERIFICATION - admin@umak.edu.ph' as info,
  au.id,
  au.email,
  au.role,
  u.is_admin,
  'Should show ✅ FULLY ADMIN' as expected_result
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';
