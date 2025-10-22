-- Fix RLS policies for admin_users table to allow admin functions
-- Run this in your Supabase SQL Editor

-- Drop the problematic policies
DROP POLICY IF EXISTS "No direct insert" ON admin_users;
DROP POLICY IF EXISTS "No direct update" ON admin_users;
DROP POLICY IF EXISTS "No direct delete" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create new policies that allow admin functions to work
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow the admin_set_user_admin function to work by allowing inserts/updates for admins
CREATE POLICY "Allow admin function inserts" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin function updates" ON admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin function deletes" ON admin_users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test the policies
SELECT 'Policies updated successfully' as status;
