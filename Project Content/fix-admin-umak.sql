-- Fix admin@umak.edu.ph account specifically
-- Run this in your Supabase SQL Editor

-- First, let's remove carlosalivarvar from admin_users (clean up the test)
DELETE FROM admin_users WHERE email = 'carlosalivarvar@gmail.com';

-- Ensure admin@umak.edu.ph is properly in admin_users table
INSERT INTO admin_users (id, email, role, created_at)
VALUES ('8b1843a7-f649-42e2-9b07-4ae168fe3fcb', 'admin@umak.edu.ph', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Ensure admin@umak.edu.ph has is_admin = true in users table
UPDATE users 
SET is_admin = true
WHERE id = '8b1843a7-f649-42e2-9b07-4ae168fe3fcb';

-- Verify admin@umak.edu.ph is properly set up
SELECT 
  'admin@umak.edu.ph status check' as info,
  au.id,
  au.email,
  au.role,
  u.is_admin,
  CASE 
    WHEN au.id IS NOT NULL AND u.is_admin = true THEN '✅ FULLY ADMIN - READY TO USE' 
    WHEN au.id IS NOT NULL AND u.is_admin = false THEN '⚠️ ADMIN_USERS ONLY - NEEDS is_admin=true'
    WHEN au.id IS NULL AND u.is_admin = true THEN '⚠️ USERS TABLE ONLY - NEEDS admin_users entry'
    ELSE '❌ NOT ADMIN - NEEDS BOTH'
  END as status
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';

-- Test if the original admin function works now
-- (This should work in the web app context, not SQL Editor)
SELECT 
  'Testing original function' as test,
  'This will fail in SQL Editor but should work in web app' as note;
