-- ================================================
-- SUGGESTED UID ASSIGNMENTS FOR USERS
-- ================================================
-- This SQL script helps you manually assign UIDs to users in the database.
-- UIDs should match the RFID card UIDs that will be tapped at tables.
--
-- INSTRUCTIONS:
-- 1. Replace 'user@example.com' with the actual user email
-- 2. Run the UPDATE statement for each user
-- 3. The UID format is flexible (e.g., CR001, ST001, etc.)
--
-- ================================================

-- SUGGESTED UID NAMING CONVENTIONS:
-- CR### - Carlos Ryan / Staff
-- ST### - Students
-- AD### - Admins
-- LIB### - Librarians
-- ================================================

-- Example: Update Carlos Ryan's UID
UPDATE public.users
SET uid = 'CR001'
WHERE email = 'carlosryanalivarvar@gmail.com';

-- Example: Update Student 1's UID
-- UPDATE public.users
-- SET uid = 'ST001'
-- WHERE email = 'student1@umak.edu.ph';

-- Example: Update Student 2's UID
-- UPDATE public.users
-- SET uid = 'ST002'
-- WHERE email = 'student2@umak.edu.ph';

-- Example: Update Student 3's UID
-- UPDATE public.users
-- SET uid = 'ST003'
-- WHERE email = 'student3@umak.edu.ph';

-- Example: Update Admin 1's UID
-- UPDATE public.users
-- SET uid = 'AD001'
-- WHERE email = 'admin1@umak.edu.ph';

-- Example: Update Librarian 1's UID
-- UPDATE public.users
-- SET uid = 'LIB001'
-- WHERE email = 'librarian1@umak.edu.ph';

-- ================================================
-- VERIFY YOUR CHANGES
-- ================================================
-- Run this to see all users with their assigned UIDs:
SELECT id, first_name, last_name, email, uid, is_admin
FROM public.users
ORDER BY email;

-- ================================================
-- TIPS:
-- ================================================
-- 1. Keep UIDs short and memorable (e.g., CR001, ST001)
-- 2. Use consistent prefixes for different user types
-- 3. UIDs should be unique across all users
-- 4. Match UIDs to actual RFID card numbers if available
-- 5. For testing, you can use any format (CR001, TEST123, etc.)
-- ================================================

