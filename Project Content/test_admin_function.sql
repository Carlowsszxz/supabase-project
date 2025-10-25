-- Test script to verify admin_get_noise_logs function works
-- Run this in Supabase SQL Editor to test

-- First, check if the function exists
SELECT 
    routine_name, 
    routine_type, 
    data_type as return_type
FROM information_schema.routines 
WHERE routine_name = 'admin_get_noise_logs' 
AND routine_schema = 'public';

-- Test the function with a small limit
SELECT * FROM public.admin_get_noise_logs(5);

-- Check if noise_logs table has data
SELECT COUNT(*) as total_records FROM public.noise_logs;

-- Check if reporter_email column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'noise_logs' 
AND table_schema = 'public'
ORDER BY ordinal_position;
