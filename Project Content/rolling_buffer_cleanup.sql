-- Rolling Buffer Cleanup for Sound Data
-- This SQL script creates functions to maintain a rolling buffer of sound data

-- Function to clean up old noise readings for a specific table
CREATE OR REPLACE FUNCTION cleanup_old_noise_readings(
    p_table_id TEXT,
    p_max_records INTEGER DEFAULT 100
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    total_count INTEGER;
    recent_sounds_deleted INTEGER := 0;
BEGIN
    -- Get total count of records for this table in actlog_iot
    SELECT COUNT(*) INTO total_count 
    FROM actlog_iot a
    WHERE a.table_name = p_table_id;
    
    -- If we have more records than the limit, delete the oldest ones
    IF total_count > p_max_records THEN
        -- Delete oldest records from actlog_iot, keeping only the most recent ones
        WITH old_records AS (
            SELECT a.id 
            FROM actlog_iot a
            WHERE a.table_name = p_table_id 
            ORDER BY a.created_at ASC 
            LIMIT (total_count - p_max_records)
        )
        DELETE FROM actlog_iot 
        WHERE id IN (SELECT id FROM old_records);
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
        -- Also clean up recent_sounds if it exists as a table
        -- Check if recent_sounds is a table (not just a view)
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'recent_sounds' AND table_type = 'BASE TABLE') THEN
            -- Delete corresponding records from recent_sounds
            WITH old_recent_sounds AS (
                SELECT rs.id 
                FROM recent_sounds rs
                WHERE rs.table_name = p_table_id 
                ORDER BY rs.created_at ASC 
                LIMIT (total_count - p_max_records)
            )
            DELETE FROM recent_sounds 
            WHERE id IN (SELECT id FROM old_recent_sounds);
            
            GET DIAGNOSTICS recent_sounds_deleted = ROW_COUNT;
        END IF;
        
        RAISE NOTICE 'Cleaned up % old noise readings for table % (actlog_iot: %, recent_sounds: %)', 
                     deleted_count + recent_sounds_deleted, p_table_id, deleted_count, recent_sounds_deleted;
    END IF;
    
    RETURN deleted_count + recent_sounds_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up all tables at once
CREATE OR REPLACE FUNCTION cleanup_all_noise_readings(
    p_max_records INTEGER DEFAULT 100
)
RETURNS TABLE(table_name TEXT, deleted_count INTEGER) AS $$
DECLARE
    table_record RECORD;
    deleted_count INTEGER;
BEGIN
    -- Get all unique table names
    FOR table_record IN 
        SELECT DISTINCT a.table_name 
        FROM actlog_iot a
        WHERE a.table_name IS NOT NULL
    LOOP
        -- Clean up each table
        SELECT cleanup_old_noise_readings(table_record.table_name, p_max_records) INTO deleted_count;
        
        -- Return the result
        table_name := table_record.table_name;
        deleted_count := deleted_count;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Manual cleanup function that can be called from your application
CREATE OR REPLACE FUNCTION manual_cleanup_noise_data()
RETURNS JSON AS $$
DECLARE
    result JSON;
    cleanup_results RECORD;
    total_deleted INTEGER := 0;
    tables_cleaned INTEGER := 0;
BEGIN
    -- Run cleanup for all tables
    FOR cleanup_results IN 
        SELECT * FROM cleanup_all_noise_readings(100)
    LOOP
        total_deleted := total_deleted + cleanup_results.deleted_count;
        IF cleanup_results.deleted_count > 0 THEN
            tables_cleaned := tables_cleaned + 1;
        END IF;
    END LOOP;
    
    -- Return summary
    result := json_build_object(
        'success', true,
        'total_deleted', total_deleted,
        'tables_cleaned', tables_cleaned,
        'message', 'Noise data cleanup completed - cleaned both actlog_iot and recent_sounds tables'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_old_noise_readings(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_all_noise_readings(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION manual_cleanup_noise_data() TO authenticated;

-- Example usage:
-- SELECT cleanup_old_noise_readings('Table_1', 50);  -- Keep only 50 records for Table_1
-- SELECT cleanup_all_noise_readings(100);           -- Keep 100 records for all tables
-- SELECT manual_cleanup_noise_data();               -- Run cleanup and get JSON result
