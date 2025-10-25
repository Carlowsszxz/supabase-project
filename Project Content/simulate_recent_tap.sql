-- Simulate Recent Tap for Testing
-- Based on user: Carlos Ryan Alivarvar (93b12cda)

-- Insert a simulated RFID tap into the actlog_iot table (which feeds the recent_taps view)
-- Note: Name will be automatically looked up from users table by UID
INSERT INTO actlog_iot (
    event,
    table_name,
    uid,
    created_at
) VALUES (
    -- Event type for RFID tap
    'tap',
    
    -- Simulate tapping at Table_1 (you can change this)
    'Table_1',
    
    -- UID from the user data (name will be auto-looked up)
    '93b12cda',
    
    -- Current timestamp
    NOW()
);

-- Alternative: If you want to insert multiple test taps with different timestamps
-- Uncomment the following to add more test data:

/*
-- Add a tap from 5 minutes ago (name auto-looked up)
INSERT INTO actlog_iot (event, table_name, uid, created_at) 
VALUES (
    'tap',
    'Table_2',
    '93b12cda',
    NOW() - INTERVAL '5 minutes'
);

-- Add a tap from 10 minutes ago (name auto-looked up)
INSERT INTO actlog_iot (event, table_name, uid, created_at) 
VALUES (
    'tap',
    'Table_1',
    '93b12cda',
    NOW() - INTERVAL '10 minutes'
);
*/

-- Verify the insertion
SELECT 
    id,
    uid,
    name,
    table_name,
    created_at
FROM recent_taps 
WHERE uid = '93b12cda'
ORDER BY created_at DESC
LIMIT 5;

-- Show total count of recent taps
SELECT COUNT(*) as total_recent_taps FROM recent_taps;
