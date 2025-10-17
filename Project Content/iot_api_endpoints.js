// IoT API Endpoints for receiving data from ESP32 devices
// This file contains the backend functions to handle incoming IoT data

// Import Supabase client (assuming you have supabase.js)
// const { createClient } = require('@supabase/supabase-js');

/**
 * IoT Data Receiver Functions
 * These functions will be called by your IoT devices via HTTP POST requests
 */

// 1. Receive Noise Level Data from ESP32 Sound Sensors
async function receiveNoiseData(deviceId, noiseLevel, roomId = null, tableId = null) {
    try {
        // Calculate comfort index from noise level
        const comfortIndex = calculateComfortIndex(noiseLevel);

        // Determine reading quality
        const readingQuality = determineReadingQuality(noiseLevel);

        // Insert noise reading into database
        const { data, error } = await supabase
            .from('noise_readings')
            .insert({
                device_id: deviceId,
                noise_level: parseFloat(noiseLevel),
                comfort_index: comfortIndex,
                room_id: roomId,
                table_id: tableId,
                reading_quality: readingQuality
            });

        if (error) {
            console.error('Error inserting noise reading:', error);
            return { success: false, error: error.message };
        }

        // Check for noise alerts
        await checkNoiseAlerts(deviceId, noiseLevel, roomId, tableId);

        return { success: true, data: data };

    } catch (error) {
        console.error('Error in receiveNoiseData:', error);
        return { success: false, error: error.message };
    }
}

// 2. Receive RFID Data from ESP32 RFID Readers
async function receiveRFIDData(deviceId, cardId, eventType, studentId = null, roomId = null, tableId = null) {
    try {
        let sessionDuration = null;

        // If it's a check_out event, calculate session duration
        if (eventType === 'check_out') {
            sessionDuration = await calculateSessionDuration(cardId, deviceId);
        }

        // Insert RFID event into database
        const { data, error } = await supabase
            .from('rfid_events')
            .insert({
                device_id: deviceId,
                card_id: cardId,
                student_id: studentId,
                event_type: eventType,
                room_id: roomId,
                table_id: tableId,
                session_duration: sessionDuration
            });

        if (error) {
            console.error('Error inserting RFID event:', error);
            return { success: false, error: error.message };
        }

        // Update occupancy count
        await updateOccupancyCount(roomId, tableId);

        return { success: true, data: data };

    } catch (error) {
        console.error('Error in receiveRFIDData:', error);
        return { success: false, error: error.message };
    }
}

// 3. Receive Combined Data (Noise + RFID from same device)
async function receiveCombinedData(deviceId, noiseLevel, cardId, eventType, studentId = null, roomId = null, tableId = null) {
    try {
        // Process noise data
        const noiseResult = await receiveNoiseData(deviceId, noiseLevel, roomId, tableId);

        // Process RFID data if cardId is provided
        let rfidResult = null;
        if (cardId && eventType) {
            rfidResult = await receiveRFIDData(deviceId, cardId, eventType, studentId, roomId, tableId);
        }

        return {
            success: true,
            noise: noiseResult,
            rfid: rfidResult
        };

    } catch (error) {
        console.error('Error in receiveCombinedData:', error);
        return { success: false, error: error.message };
    }
}

// 4. Device Status Update (Heartbeat from IoT devices)
async function updateDeviceStatus(deviceId, status = 'active') {
    try {
        const { data, error } = await supabase
            .from('iot_devices')
            .update({
                status: status,
                last_seen: new Date().toISOString()
            })
            .eq('device_id', deviceId);

        if (error) {
            console.error('Error updating device status:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data };

    } catch (error) {
        console.error('Error in updateDeviceStatus:', error);
        return { success: false, error: error.message };
    }
}

// Helper Functions

// Calculate comfort index from noise level (0-1 scale)
function calculateComfortIndex(noiseLevel) {
    const noise = parseFloat(noiseLevel);

    if (noise <= 30) return 1.0;
    if (noise <= 40) return 0.9;
    if (noise <= 50) return 0.7;
    if (noise <= 60) return 0.4;
    if (noise <= 70) return 0.1;
    return 0.0;
}

// Determine reading quality based on noise level
function determineReadingQuality(noiseLevel) {
    const noise = parseFloat(noiseLevel);

    if (noise < 0 || noise > 120) return 'invalid';
    if (noise < 10 || noise > 100) return 'poor';
    return 'good';
}

// Calculate session duration for RFID check-out events
async function calculateSessionDuration(cardId, deviceId) {
    try {
        const { data, error } = await supabase
            .from('rfid_events')
            .select('timestamp')
            .eq('card_id', cardId)
            .eq('device_id', deviceId)
            .eq('event_type', 'check_in')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return null;
        }

        const checkInTime = new Date(data[0].timestamp);
        const checkOutTime = new Date();
        const durationMs = checkOutTime - checkInTime;

        return Math.round(durationMs / (1000 * 60)); // Return duration in minutes

    } catch (error) {
        console.error('Error calculating session duration:', error);
        return null;
    }
}

// Update occupancy count for a room/table
async function updateOccupancyCount(roomId, tableId) {
    try {
        // Count active sessions (check_in without corresponding check_out)
        const { data, error } = await supabase
            .from('rfid_events')
            .select('card_id')
            .eq('room_id', roomId)
            .eq('table_id', tableId)
            .eq('event_type', 'check_in')
            .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

        if (error) {
            console.error('Error counting occupancy:', error);
            return;
        }

        const occupancyCount = data ? data.length : 0;

        // Update room environment with new occupancy count
        await supabase
            .from('room_environment')
            .upsert({
                room_id: roomId,
                table_id: tableId,
                occupancy_count: occupancyCount,
                last_updated: new Date().toISOString()
            });

    } catch (error) {
        console.error('Error updating occupancy count:', error);
    }
}

// Check for noise alerts and create them if needed
async function checkNoiseAlerts(deviceId, noiseLevel, roomId, tableId) {
    try {
        const noise = parseFloat(noiseLevel);
        let alertType = null;
        let severity = 'low';
        let message = '';

        // Define noise thresholds
        if (noise > 70) {
            alertType = 'noise_high';
            severity = 'high';
            message = `High noise level detected: ${noise}dB at Room ${roomId}, Table ${tableId}`;
        } else if (noise < 20) {
            alertType = 'noise_low';
            severity = 'low';
            message = `Unusually quiet: ${noise}dB at Room ${roomId}, Table ${tableId}`;
        }

        if (alertType) {
            await supabase
                .from('iot_alerts')
                .insert({
                    alert_type: alertType,
                    severity: severity,
                    device_id: deviceId,
                    room_id: roomId,
                    table_id: tableId,
                    message: message
                });
        }

    } catch (error) {
        console.error('Error checking noise alerts:', error);
    }
}

// Export functions for use in your API routes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        receiveNoiseData,
        receiveRFIDData,
        receiveCombinedData,
        updateDeviceStatus,
        calculateComfortIndex,
        determineReadingQuality
    };
}
