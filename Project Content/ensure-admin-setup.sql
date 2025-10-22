-- Ensure admin@umak.edu.ph is properly set up as admin
-- Run this in your Supabase SQL Editor

-- Make sure admin@umak.edu.ph is in admin_users table
INSERT INTO admin_users (id, email, role)
SELECT 
  '8b1843a7-f649-42e2-9b07-4ae168fe3fcb',
  'admin@umak.edu.ph',
  'admin'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Make sure admin@umak.edu.ph has is_admin = true in users table
UPDATE users 
SET is_admin = true
WHERE id = '8b1843a7-f649-42e2-9b07-4ae168fe3fcb';

-- Verify the setup
SELECT 
  'Verification - admin@umak.edu.ph setup' as info,
  au.id,
  au.email as admin_email,
  au.role,
  u.email as user_email,
  u.is_admin,
  CASE 
    WHEN au.id IS NOT NULL AND u.is_admin = true THEN '✅ FULLY ADMIN' 
    WHEN au.id IS NOT NULL AND u.is_admin = false THEN '⚠️ ADMIN_USERS ONLY'
    WHEN au.id IS NULL AND u.is_admin = true THEN '⚠️ USERS TABLE ONLY'
    ELSE '❌ NOT ADMIN'
  END as status
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';
