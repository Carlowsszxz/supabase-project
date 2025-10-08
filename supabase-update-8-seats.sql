-- Supabase Database Update: 8 Seats Per Table
-- This script updates the database to support 8 seats per table instead of 5

-- 1. First, let's check the current table structure
-- (Run this to see current data before making changes)
SELECT table_id, seat_number, is_occupied, created_at 
FROM seat_occupancy 
ORDER BY table_id, seat_number;

-- 2. Add seats 6, 7, 8 for all existing tables
-- This will add the missing seats (6, 7, 8) for tables 1-5
INSERT INTO seat_occupancy (table_id, seat_number, is_occupied, created_at, updated_at)
SELECT 
    table_id,
    seat_num,
    false as is_occupied,
    NOW() as created_at,
    NOW() as updated_at
FROM (
    SELECT 'table-1' as table_id, 6 as seat_num
    UNION ALL SELECT 'table-1', 7
    UNION ALL SELECT 'table-1', 8
    UNION ALL SELECT 'table-2', 6
    UNION ALL SELECT 'table-2', 7
    UNION ALL SELECT 'table-2', 8
    UNION ALL SELECT 'table-3', 6
    UNION ALL SELECT 'table-3', 7
    UNION ALL SELECT 'table-3', 8
    UNION ALL SELECT 'table-4', 6
    UNION ALL SELECT 'table-4', 7
    UNION ALL SELECT 'table-4', 8
    UNION ALL SELECT 'table-5', 6
    UNION ALL SELECT 'table-5', 7
    UNION ALL SELECT 'table-5', 8
) AS new_seats
WHERE NOT EXISTS (
    SELECT 1 FROM seat_occupancy 
    WHERE seat_occupancy.table_id = new_seats.table_id 
    AND seat_occupancy.seat_number = new_seats.seat_num
);

-- 3. Update any existing constraints or triggers if needed
-- (This is optional - only run if you have specific constraints)

-- 4. Verify the update worked
-- Check that all tables now have seats 1-8
SELECT 
    table_id,
    COUNT(*) as total_seats,
    COUNT(CASE WHEN is_occupied = true THEN 1 END) as occupied_seats,
    COUNT(CASE WHEN is_occupied = false THEN 1 END) as available_seats
FROM seat_occupancy 
WHERE table_id IN ('table-1', 'table-2', 'table-3', 'table-4', 'table-5')
GROUP BY table_id
ORDER BY table_id;

-- 5. Check individual seat numbers for each table
SELECT table_id, seat_number, is_occupied
FROM seat_occupancy 
WHERE table_id IN ('table-1', 'table-2', 'table-3', 'table-4', 'table-5')
ORDER BY table_id, seat_number;

-- 6. Optional: Update any application-level constants
-- If you have stored procedures or functions that reference seat counts, update them here
-- Example (uncomment if you have such functions):
/*
CREATE OR REPLACE FUNCTION get_table_occupancy(p_table_id TEXT)
RETURNS TABLE(total_seats INTEGER, occupied_seats INTEGER, available_seats INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        8 as total_seats,
        COUNT(CASE WHEN is_occupied = true THEN 1 END)::INTEGER as occupied_seats,
        COUNT(CASE WHEN is_occupied = false THEN 1 END)::INTEGER as available_seats
    FROM seat_occupancy 
    WHERE table_id = p_table_id;
END;
$$ LANGUAGE plpgsql;
*/

-- 7. Optional: Add a check constraint to ensure seat numbers are 1-8
-- (Only run this if you want to enforce the 8-seat limit at database level)
/*
ALTER TABLE seat_occupancy 
ADD CONSTRAINT check_seat_number_range 
CHECK (seat_number >= 1 AND seat_number <= 8);
*/

-- 8. Final verification query
-- This should show 8 seats for each table, all initially unoccupied
SELECT 
    'Verification Complete' as status,
    COUNT(DISTINCT table_id) as tables_updated,
    COUNT(*) as total_seat_records,
    COUNT(CASE WHEN is_occupied = true THEN 1 END) as occupied_seats,
    COUNT(CASE WHEN is_occupied = false THEN 1 END) as available_seats
FROM seat_occupancy 
WHERE table_id IN ('table-1', 'table-2', 'table-3', 'table-4', 'table-5');
