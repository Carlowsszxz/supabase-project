-- Check the exact is_admin status for all users
-- This will show the real database values

SELECT 
  'User Admin Status Check' as step,
  id::text,
  email,
  is_admin::text,
  first_name,
  last_name,
  created_at::text
FROM users 
ORDER BY email;

-- Specifically check adminlibrarian@umak.edu.ph
SELECT 
  'adminlibrarian@umak.edu.ph Status' as step,
  id::text,
  email,
  is_admin::text,
  first_name,
  last_name
FROM users 
WHERE email = 'adminlibrarian@umak.edu.ph';
