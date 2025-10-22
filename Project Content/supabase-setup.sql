-- Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  student_id TEXT,
  program TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own data
DROP POLICY IF EXISTS "Users can access own data" ON users;
CREATE POLICY "Users can access own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Create policy: Users can insert their own data
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy: Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, student_id, program)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'student_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'program', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    student_id = EXCLUDED.student_id,
    program = EXCLUDED.program,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a trigger for when users confirm their email
CREATE OR REPLACE FUNCTION public.handle_user_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user profile when email is confirmed
  UPDATE public.users 
  SET 
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    student_id = COALESCE(NEW.raw_user_meta_data->>'student_id', student_id),
    program = COALESCE(NEW.raw_user_meta_data->>'program', program),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  -- If user doesn't exist in users table, create them
  INSERT INTO public.users (id, email, first_name, last_name, student_id, program)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'student_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'program', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE OR REPLACE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_user_confirmed();

-- Disable email confirmation for development (optional)
-- This allows users to sign in immediately after registration
-- To enable email confirmation, comment out the following lines:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE OR REPLACE TRIGGER handle_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create occupancy table for real-time seat management
CREATE TABLE IF NOT EXISTS occupancy (
  id SERIAL PRIMARY KEY,
  table_id TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  occupied_by UUID REFERENCES auth.users(id),
  occupied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(table_id, seat_number)
);

-- Enable RLS for occupancy table
ALTER TABLE occupancy ENABLE ROW LEVEL SECURITY;

-- Create policies for occupancy table
DROP POLICY IF EXISTS "Anyone can read occupancy" ON occupancy;
CREATE POLICY "Anyone can read occupancy" ON occupancy
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can update occupancy" ON occupancy;
CREATE POLICY "Authenticated users can update occupancy" ON occupancy
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update occupancy updated_at
CREATE OR REPLACE FUNCTION public.handle_occupancy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for occupancy updated_at
CREATE OR REPLACE TRIGGER handle_occupancy_updated_at
  BEFORE UPDATE ON occupancy
  FOR EACH ROW EXECUTE FUNCTION public.handle_occupancy_updated_at();

-- Create noise_logs table for activity tracking
CREATE TABLE IF NOT EXISTS noise_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  table_id TEXT NOT NULL,
  noise_level DECIMAL(5,2),
  activity_type TEXT,
  notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for noise_logs table
ALTER TABLE noise_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for noise_logs table
DROP POLICY IF EXISTS "Users can read their own logs" ON noise_logs;
CREATE POLICY "Users can read their own logs" ON noise_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own logs" ON noise_logs;
CREATE POLICY "Users can insert their own logs" ON noise_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins to read all noise logs
DROP POLICY IF EXISTS "Admins can read all logs" ON noise_logs;
CREATE POLICY "Admins can read all logs" ON noise_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to mark reports resolved
DROP POLICY IF EXISTS "Admins can update logs" ON noise_logs;
CREATE POLICY "Admins can update logs" ON noise_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for alerts table
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for alerts table
DROP POLICY IF EXISTS "Users can read their own alerts" ON alerts;
CREATE POLICY "Users can read their own alerts" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
CREATE POLICY "Users can update their own alerts" ON alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their alerts
DROP POLICY IF EXISTS "Users can insert own alerts" ON alerts;
CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create admin_users table for admin management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin RPC to fetch all noise logs with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_get_noise_logs(limit_count integer DEFAULT 200)
RETURNS SETOF noise_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nl.*
  FROM public.noise_logs nl
  WHERE EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.role = 'admin'
  )
  ORDER BY nl.created_at DESC
  LIMIT limit_count;
$$;

-- Allow authenticated users to execute; function enforces admin check
GRANT EXECUTE ON FUNCTION public.admin_get_noise_logs(integer) TO authenticated;

-- Admin RPC to resolve a noise log
CREATE OR REPLACE FUNCTION public.admin_resolve_noise_log(p_log_id integer)
RETURNS noise_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.noise_logs nl
  SET resolved_at = NOW()
  WHERE nl.id = p_log_id
    AND EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.id = auth.uid() AND au.role = 'admin'
    )
  RETURNING nl.*;
$$;

GRANT EXECUTE ON FUNCTION public.admin_resolve_noise_log(integer) TO authenticated;

-- User RPC to fetch own noise logs
CREATE OR REPLACE FUNCTION public.user_get_noise_logs(limit_count integer DEFAULT 50)
RETURNS SETOF noise_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nl.*
  FROM public.noise_logs nl
  WHERE nl.user_id = auth.uid()
  ORDER BY nl.created_at DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.user_get_noise_logs(integer) TO authenticated;

-- User RPC to cancel own noise log (only if not resolved already)
CREATE OR REPLACE FUNCTION public.user_cancel_noise_log(p_log_id integer)
RETURNS noise_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.noise_logs nl
  SET canceled_at = NOW()
  WHERE nl.id = p_log_id
    AND nl.user_id = auth.uid()
    AND nl.resolved_at IS NULL
  RETURNING nl.*;
$$;

GRANT EXECUTE ON FUNCTION public.user_cancel_noise_log(integer) TO authenticated;

-- Admin RPC to delete a noise log (permanent removal)
CREATE OR REPLACE FUNCTION public.admin_delete_noise_log(p_log_id integer)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.role = 'admin'
  ) THEN
    DELETE FROM public.noise_logs WHERE id = p_log_id;
  ELSE
    RAISE EXCEPTION 'not authorized';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_noise_log(integer) TO authenticated;

-- Admin RPC to add an alert for a specific user
CREATE OR REPLACE FUNCTION public.admin_add_user_alert(p_user_id uuid, p_type text, p_message text)
RETURNS alerts
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.alerts (user_id, alert_type, message)
  SELECT p_user_id, p_type, p_message
  WHERE EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.role = 'admin'
  )
  RETURNING *;
$$;

GRANT EXECUTE ON FUNCTION public.admin_add_user_alert(uuid, text, text) TO authenticated;

-- Admin RPC: list users with admin flag
CREATE OR REPLACE FUNCTION public.admin_list_users(p_search text DEFAULT NULL, p_limit integer DEFAULT 200)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  student_id text,
  program text,
  created_at timestamptz,
  is_admin boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT u.id,
         u.email,
         u.first_name,
         u.last_name,
         u.student_id,
         u.program,
         u.created_at,
         (au.id IS NOT NULL) AS is_admin
  FROM public.users u
  LEFT JOIN public.admin_users au ON au.id = u.id
  WHERE EXISTS (
    SELECT 1 FROM public.admin_users x WHERE x.id = auth.uid() AND x.role = 'admin'
  )
  AND (
    p_search IS NULL OR p_search = '' OR
    u.email ILIKE '%'||p_search||'%' OR
    u.first_name ILIKE '%'||p_search||'%' OR
    u.last_name ILIKE '%'||p_search||'%' OR
    u.student_id ILIKE '%'||p_search||'%'
  )
  ORDER BY u.created_at DESC
  LIMIT COALESCE(p_limit, 200);
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users(text, integer) TO authenticated;

-- Admin RPC: set or unset admin role for a user
CREATE OR REPLACE FUNCTION public.admin_set_user_admin(p_user_id uuid, p_make_admin boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admin_users au WHERE au.id = auth.uid() AND au.role = 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

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

GRANT EXECUTE ON FUNCTION public.admin_set_user_admin(uuid, boolean) TO authenticated;

-- Create is_admin function for checking admin status
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM admin_users WHERE id = p_user_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;