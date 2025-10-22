-- Fix the admin_set_user_admin function to handle RLS properly
-- This creates a more robust version that handles authentication better

-- Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS public.admin_set_user_admin(uuid, boolean);

CREATE OR REPLACE FUNCTION public.admin_set_user_admin(p_user_id uuid, p_make_admin boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  current_user_id uuid;
  is_current_user_admin boolean;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if current user is admin (multiple methods)
  is_current_user_admin := (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = current_user_id AND role = 'admin') OR
    EXISTS (SELECT 1 FROM public.users WHERE id = current_user_id AND is_admin = true) OR
    auth.email() IN ('admin@umak.edu.ph', 'adminlibrarian@umak.edu.ph')
  );
  
  IF NOT is_current_user_admin THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized: Current user is not an admin');
  END IF;

  -- Check if target user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  IF p_make_admin THEN
    -- Grant admin access
    BEGIN
      -- Update users table
      UPDATE public.users SET is_admin = true, updated_at = NOW() WHERE id = p_user_id;
      
      -- Insert into admin_users table
      INSERT INTO public.admin_users (id, email, role, created_at)
      SELECT u.id, u.email, 'admin', NOW()
      FROM public.users u
      WHERE u.id = p_user_id
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = 'admin';
      
      result := json_build_object('success', true, 'message', 'Admin access granted');
    EXCEPTION
      WHEN OTHERS THEN
        result := json_build_object('success', false, 'error', 'Failed to grant admin access: ' || SQLERRM);
    END;
  ELSE
    -- Remove admin access
    BEGIN
      -- Update users table
      UPDATE public.users SET is_admin = false, updated_at = NOW() WHERE id = p_user_id;
      
      -- Remove from admin_users table
      DELETE FROM public.admin_users WHERE id = p_user_id;
      
      result := json_build_object('success', true, 'message', 'Admin access removed');
    EXCEPTION
      WHEN OTHERS THEN
        result := json_build_object('success', false, 'error', 'Failed to remove admin access: ' || SQLERRM);
    END;
  END IF;

  RETURN result;
END;
$$;
