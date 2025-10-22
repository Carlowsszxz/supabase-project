-- =====================================================
-- Admin Delete User Function
-- =====================================================
-- This function securely deletes a user from both the 
-- users table and auth.users using SECURITY DEFINER
-- to run with elevated privileges.
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS admin_delete_user_completely(uuid);

-- Create the function with SECURITY DEFINER to run with elevated privileges
CREATE OR REPLACE FUNCTION admin_delete_user_completely(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_current_user_id uuid;
  v_is_admin boolean;
  v_target_email text;
BEGIN
  -- Get current user ID
  v_current_user_id := auth.uid();
  
  -- Check if current user is admin
  SELECT is_admin INTO v_is_admin
  FROM public.users
  WHERE id = v_current_user_id;
  
  -- Also check if user is admin@umak.edu.ph (email-based admin)
  IF NOT v_is_admin THEN
    SELECT email INTO v_target_email
    FROM public.users
    WHERE id = v_current_user_id;
    
    IF v_target_email = 'admin@umak.edu.ph' THEN
      v_is_admin := true;
    END IF;
  END IF;
  
  -- Verify admin status
  IF NOT v_is_admin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only admins can delete users'
    );
  END IF;
  
  -- Get target user email to prevent deletion of primary admin
  SELECT email INTO v_target_email
  FROM public.users
  WHERE id = p_user_id;
  
  -- Protect primary admin account
  IF v_target_email = 'admin@umak.edu.ph' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cannot delete primary admin account'
    );
  END IF;
  
  -- Step 1: Delete from admin_users table if exists (uses email as key)
  DELETE FROM public.admin_users WHERE email = v_target_email;
  
  -- Step 2: Delete from auth.identities first (cleanup, foreign key dependency)
  DELETE FROM auth.identities WHERE user_id = p_user_id;
  
  -- Step 3: Delete from auth.users (this requires SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = p_user_id;
  
  -- Step 4: Delete from users table last
  DELETE FROM public.users WHERE id = p_user_id;
  
  -- Return success
  RETURN json_build_object(
    'success', true,
    'message', 'User deleted from entire system (database + auth)'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_delete_user_completely(uuid) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION admin_delete_user_completely(uuid) IS 
'Admin-only function to completely delete a user from both the users table and Supabase Auth. Runs with SECURITY DEFINER to bypass RLS.';

-- Test the function (optional - comment out after testing)
-- SELECT admin_delete_user_completely('USER_ID_HERE');

