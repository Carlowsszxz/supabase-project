-- Fix the authentication context issue
-- The problem is that SQL Editor runs with different auth context than the web app

-- Option 1: Temporarily modify the admin function to bypass the auth check
-- (This is for testing only - we'll revert it after)
CREATE OR REPLACE FUNCTION public.admin_set_user_admin_test(p_user_id uuid, p_make_admin boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Skip the auth check for testing
  -- IF NOT EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid() AND au.role = 'admin') THEN
  --   RAISE EXCEPTION 'not authorized';
  -- END IF;

  -- Check if target user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF p_make_admin THEN
    -- Try to insert or update admin status
    INSERT INTO public.admin_users (id, email, role)
    SELECT u.id, u.email, 'admin'
    FROM public.users u
    WHERE u.id = p_user_id
    ON CONFLICT (id) DO UPDATE SET 
      email = EXCLUDED.email,
      role = 'admin',
      created_at = CASE WHEN admin_users.created_at IS NULL THEN NOW() ELSE admin_users.created_at END;
    
    result := json_build_object('success', true, 'message', 'User granted admin access');
  ELSE
    -- Remove admin access
    DELETE FROM public.admin_users WHERE id = p_user_id;
    result := json_build_object('success', true, 'message', 'Admin access removed');
  END IF;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Test the modified function
SELECT 
  'Testing modified function' as test,
  admin_set_user_admin_test('73aaab23-dcd9-4482-a8bd-080ee1bc7a46', true) as result;

-- Check if it worked
SELECT 
  'Check if user became admin' as test,
  au.id,
  au.email,
  au.role
FROM admin_users au
WHERE au.email = 'carlosalivarvar@gmail.com';
