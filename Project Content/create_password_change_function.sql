-- Create a function to actually change user passwords
-- This function will be called by admins to change any user's password

CREATE OR REPLACE FUNCTION admin_change_user_password_secure(
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

  -- Update the password in auth.users using a direct SQL approach
  -- This requires the function to run with elevated privileges
  UPDATE auth.users 
  SET 
    encrypted_password = crypt(p_new_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = p_user_id;

  -- Check if the update was successful
  IF FOUND THEN
    -- Also update the users table to track the change
    UPDATE users 
    SET 
      program = 'PASSWORD_CHANGED_BY_ADMIN',
      updated_at = now()
    WHERE id = p_user_id;
    
    RETURN json_build_object(
      'success', true,
      'message', 'Password updated successfully',
      'user_email', user_email
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to update password'
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
GRANT EXECUTE ON FUNCTION admin_change_user_password_secure(UUID, TEXT) TO authenticated;
