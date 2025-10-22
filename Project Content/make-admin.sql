-- Make admin@umak.edu.ph an admin
-- Run this in your Supabase SQL Editor

-- First, check if the user exists in auth.users
-- If not, you'll need to create the user account first through the Supabase Auth dashboard

-- Add admin@umak.edu.ph to admin_users table
INSERT INTO admin_users (id, email, role)
SELECT 
  au.id,
  au.email,
  'admin'
FROM auth.users au
WHERE au.email = 'admin@umak.edu.ph'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'admin';

-- Also set is_admin = true in users table
UPDATE users 
SET is_admin = true
WHERE email = 'admin@umak.edu.ph';

-- Check if the admin was added successfully
SELECT 
  au.id,
  au.email,
  au.role,
  u.is_admin
FROM admin_users au
JOIN users u ON u.id = au.id
WHERE au.email = 'admin@umak.edu.ph';
