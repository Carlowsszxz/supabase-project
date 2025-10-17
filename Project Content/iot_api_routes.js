// HTTP API Routes for IoT Devices
// These routes will be called by ESP32 devices via HTTP POST requests

// Import the IoT functions
const {
    receiveNoiseData,
    receiveRFIDData,
    receiveCombinedData,
    updateDeviceStatus
} = require('./iot_api_endpoints.js');

/**
 * API Route Handlers for IoT Data Reception
 * These functions handle HTTP requests from ESP32 devices
 */

// 1. Noise Data Endpoint
// POST /api/iot/noise
async function handleNoiseData(req, res) {
    try {
        const { device_id, noise_level, room_id, table_id } = req.body;

        // Validate required fields
        if (!device_id || noise_level === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: device_id, noise_level'
            });
        }

        // Validate noise level
        if (isNaN(noise_level) || noise_level < 0 || noise_level > 120) {
            return res.status(400).json({
                success: false,
                error: 'Invalid noise level. Must be between 0 and 120 dB'
            });
        }

        // Process the noise data
        const result = await receiveNoiseData(device_id, noise_level, room_id, table_id);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Noise data received successfully',
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in handleNoiseData:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// 2. RFID Data Endpoint
// POST /api/iot/rfid
async function handleRFIDData(req, res) {
    try {
        const { device_id, card_id, event_type, student_id, room_id, table_id } = req.body;

        // Validate required fields
        if (!device_id || !card_id || !event_type) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: device_id, card_id, event_type'
            });
        }

        // Validate event type
        const validEventTypes = ['check_in', 'check_out', 'scan'];
        if (!validEventTypes.includes(event_type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid event_type. Must be one of: check_in, check_out, scan'
            });
        }

        // Process the RFID data
        const result = await receiveRFIDData(device_id, card_id, event_type, student_id, room_id, table_id);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'RFID data received successfully',
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in handleRFIDData:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// 3. Combined Data Endpoint (Noise + RFID)
// POST /api/iot/combined
async function handleCombinedData(req, res) {
    try {
        const {
            device_id,
            noise_level,
            card_id,
            event_type,
            student_id,
            room_id,
            table_id
        } = req.body;

        // Validate required fields
        if (!device_id || noise_level === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: device_id, noise_level'
            });
        }

        // Validate noise level
        if (isNaN(noise_level) || noise_level < 0 || noise_level > 120) {
            return res.status(400).json({
                success: false,
                error: 'Invalid noise level. Must be between 0 and 120 dB'
            });
        }

        // Process the combined data
        const result = await receiveCombinedData(
            device_id,
            noise_level,
            card_id,
            event_type,
            student_id,
            room_id,
            table_id
        );

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Combined data received successfully',
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in handleCombinedData:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// 4. Device Status/Heartbeat Endpoint
// POST /api/iot/status
async function handleDeviceStatus(req, res) {
    try {
        const { device_id, status } = req.body;

        // Validate required fields
        if (!device_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: device_id'
            });
        }

        // Validate status
        const validStatuses = ['active', 'inactive', 'maintenance'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: active, inactive, maintenance'
            });
        }

        // Process the status update
        const result = await updateDeviceStatus(device_id, status || 'active');

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Device status updated successfully',
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Error in handleDeviceStatus:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// 5. Bulk Data Endpoint (for multiple readings at once)
// POST /api/iot/bulk
async function handleBulkData(req, res) {
    try {
        const { readings } = req.body;

        if (!Array.isArray(readings) || readings.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing or invalid readings array'
            });
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        // Process each reading
        for (const reading of readings) {
            try {
                let result;

                if (reading.type === 'noise') {
                    result = await receiveNoiseData(
                        reading.device_id,
                        reading.noise_level,
                        reading.room_id,
                        reading.table_id
                    );
                } else if (reading.type === 'rfid') {
                    result = await receiveRFIDData(
                        reading.device_id,
                        reading.card_id,
                        reading.event_type,
                        reading.student_id,
                        reading.room_id,
                        reading.table_id
                    );
                } else if (reading.type === 'combined') {
                    result = await receiveCombinedData(
                        reading.device_id,
                        reading.noise_level,
                        reading.card_id,
                        reading.event_type,
                        reading.student_id,
                        reading.room_id,
                        reading.table_id
                    );
                } else {
                    result = { success: false, error: 'Invalid reading type' };
                }

                results.push({
                    index: results.length,
                    success: result.success,
                    error: result.error
                });

                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                }

            } catch (error) {
                results.push({
                    index: results.length,
                    success: false,
                    error: error.message
                });
                errorCount++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${readings.length} readings`,
            summary: {
                total: readings.length,
                successful: successCount,
                errors: errorCount
            },
            results: results
        });

    } catch (error) {
        console.error('Error in handleBulkData:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Example Express.js route setup (you'll need to adapt this to your framework)
/*
const express = require('express');
const router = express.Router();

// Register routes
router.post('/noise', handleNoiseData);
router.post('/rfid', handleRFIDData);
router.post('/combined', handleCombinedData);
router.post('/status', handleDeviceStatus);
router.post('/bulk', handleBulkData);

module.exports = router;
*/

// Export functions for use in your server
module.exports = {
    handleNoiseData,
    handleRFIDData,
    handleCombinedData,
    handleDeviceStatus,
    handleBulkData
};
