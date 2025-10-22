-- Check if admin@umak.edu.ph exists in your database
-- Run this first to see if the user exists

-- Check if user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'admin@umak.edu.ph';

-- Check if user exists in users table
SELECT 
  id,
  email,
  first_name,
  last_name,
  is_admin,
  created_at
FROM users 
WHERE email = 'admin@umak.edu.ph';

-- Check if user is already an admin
SELECT 
  au.id,
  au.email,
  au.role,
  au.created_at
FROM admin_users au
WHERE au.email = 'admin@umak.edu.ph';
