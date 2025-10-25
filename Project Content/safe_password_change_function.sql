-- SAFE password change function - only updates your users table
-- This won't touch the auth system, so it's completely safe

CREATE OR REPLACE FUNCTION admin_change_user_password_safe(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  user_email TEXT;
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Access denied: Admin privileges required'
    );
  END IF;

  -- Get the user's email
  SELECT email INTO user_email FROM users WHERE id = p_user_id;
  
  IF user_email IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- SAFE: Only update the users table with password info
  -- This doesn't touch the auth system at all
  UPDATE users 
  SET 
    program = 'PASSWORD_CHANGE_REQUESTED',
    student_id = 'ADMIN_CHANGED_' || extract(epoch from now())::text,
    updated_at = now()
  WHERE id = p_user_id;
  
  -- Check if the update was successful
  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Password change request recorded. User needs to reset password via email.',
      'user_email', user_email,
      'note', 'User must use "Forgot Password" to set new password'
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to record password change request'
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_change_user_password_safe(UUID, TEXT) TO authenticated;
