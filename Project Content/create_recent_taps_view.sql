-- Create/Replace recent_taps view with automatic name lookup
-- This view automatically joins with users table to get names by UID

-- Drop the existing view if it exists
DROP VIEW IF EXISTS recent_taps;

-- Create the new recent_taps view with automatic name lookup
CREATE VIEW recent_taps AS
SELECT 
    a.id,
    a.uid,
    -- Automatically get name from users table, fallback to stored name or 'Unknown'
    COALESCE(
        CONCAT(u.first_name, ' ', u.last_name),
        a.name,
        'Unknown'
    ) as name,
    a.table_name,
    a.created_at
FROM actlog_iot a
LEFT JOIN users u ON a.uid = u.uid
WHERE a.event = 'tap'
ORDER BY a.created_at DESC;

-- Grant permissions for the view
GRANT SELECT ON recent_taps TO authenticated;
GRANT SELECT ON recent_taps TO anon;

-- Test the view
SELECT 
    'recent_taps view created successfully' as status,
    COUNT(*) as total_taps 
FROM recent_taps;
