-- Create function to change user password (admin only)
-- This function allows admins to change any user's password

CREATE OR REPLACE FUNCTION admin_change_user_password(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
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

  -- Update the user's password in auth.users
  -- Note: This requires the service role key or proper RLS policies
  UPDATE auth.users 
  SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
  WHERE id = p_user_id;

  -- Check if the update was successful
  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Password updated successfully'
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to update password: ' || SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_change_user_password(UUID, TEXT) TO authenticated;
