// IoT Test Client - Simulates ESP32 devices sending data
// This script demonstrates how your ESP32 devices will send data to the API

const API_BASE_URL = 'http://localhost:3000/api/iot'; // Adjust to your server URL

// Simulate noise sensor data
async function sendNoiseData(deviceId, noiseLevel, roomId = null, tableId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/noise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: deviceId,
                noise_level: noiseLevel,
                room_id: roomId,
                table_id: tableId
            })
        });

        const result = await response.json();
        console.log('Noise data sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending noise data:', error);
        return { success: false, error: error.message };
    }
}

// Simulate RFID reader data
async function sendRFIDData(deviceId, cardId, eventType, studentId = null, roomId = null, tableId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/rfid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: deviceId,
                card_id: cardId,
                event_type: eventType,
                student_id: studentId,
                room_id: roomId,
                table_id: tableId
            })
        });

        const result = await response.json();
        console.log('RFID data sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending RFID data:', error);
        return { success: false, error: error.message };
    }
}

// Simulate combined sensor data
async function sendCombinedData(deviceId, noiseLevel, cardId, eventType, studentId = null, roomId = null, tableId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/combined`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: deviceId,
                noise_level: noiseLevel,
                card_id: cardId,
                event_type: eventType,
                student_id: studentId,
                room_id: roomId,
                table_id: tableId
            })
        });

        const result = await response.json();
        console.log('Combined data sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending combined data:', error);
        return { success: false, error: error.message };
    }
}

// Simulate device heartbeat
async function sendDeviceHeartbeat(deviceId, status = 'active') {
    try {
        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: deviceId,
                status: status
            })
        });

        const result = await response.json();
        console.log('Device heartbeat sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending device heartbeat:', error);
        return { success: false, error: error.message };
    }
}

// Simulate bulk data transmission
async function sendBulkData(readings) {
    try {
        const response = await fetch(`${API_BASE_URL}/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                readings: readings
            })
        });

        const result = await response.json();
        console.log('Bulk data sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending bulk data:', error);
        return { success: false, error: error.message };
    }
}

// Example usage functions
async function simulateLibraryScenario() {
    console.log('Simulating library IoT scenario...');

    // 1. Send device heartbeats
    await sendDeviceHeartbeat('NOISE_001', 'active');
    await sendDeviceHeartbeat('RFID_001', 'active');
    await sendDeviceHeartbeat('COMBO_001', 'active');

    // 2. Send noise readings
    await sendNoiseData('NOISE_001', 45.2, 1, 1);
    await sendNoiseData('NOISE_001', 48.7, 1, 1);
    await sendNoiseData('NOISE_001', 52.1, 1, 1);

    // 3. Send RFID events
    await sendRFIDData('RFID_001', 'CARD_12345', 'check_in', 'STU_001', 1, 1);
    await sendRFIDData('RFID_001', 'CARD_67890', 'check_in', 'STU_002', 1, 2);

    // 4. Send combined data
    await sendCombinedData('COMBO_001', 38.5, 'CARD_11111', 'check_in', 'STU_003', 1, 3);

    // 5. Simulate some time passing and send check-out
    setTimeout(async () => {
        await sendRFIDData('RFID_001', 'CARD_12345', 'check_out', 'STU_001', 1, 1);
        await sendCombinedData('COMBO_001', 42.3, 'CARD_11111', 'check_out', 'STU_003', 1, 3);
    }, 2000);

    // 6. Send bulk data
    const bulkReadings = [
        { type: 'noise', device_id: 'NOISE_001', noise_level: 44.8, room_id: 1, table_id: 1 },
        { type: 'noise', device_id: 'NOISE_001', noise_level: 46.2, room_id: 1, table_id: 1 },
        { type: 'rfid', device_id: 'RFID_001', card_id: 'CARD_22222', event_type: 'scan', room_id: 1, table_id: 1 }
    ];

    setTimeout(async () => {
        await sendBulkData(bulkReadings);
    }, 3000);
}

// Continuous simulation
async function startContinuousSimulation() {
    console.log('Starting continuous IoT simulation...');

    const devices = [
        { id: 'NOISE_001', room: 1, table: 1 },
        { id: 'NOISE_002', room: 1, table: 2 },
        { id: 'RFID_001', room: 1, table: 1 },
        { id: 'RFID_002', room: 1, table: 2 }
    ];

    const cards = ['CARD_001', 'CARD_002', 'CARD_003', 'CARD_004', 'CARD_005'];

    setInterval(async () => {
        // Random noise readings
        for (const device of devices.filter(d => d.id.startsWith('NOISE'))) {
            const noiseLevel = 30 + Math.random() * 40; // 30-70 dB
            await sendNoiseData(device.id, noiseLevel, device.room, device.table);
        }

        // Random RFID events
        if (Math.random() < 0.3) { // 30% chance
            const device = devices.filter(d => d.id.startsWith('RFID'))[0];
            const card = cards[Math.floor(Math.random() * cards.length)];
            const eventType = Math.random() < 0.5 ? 'check_in' : 'check_out';

            await sendRFIDData(device.id, card, eventType, `STU_${card}`, device.room, device.table);
        }

        // Device heartbeats
        for (const device of devices) {
            await sendDeviceHeartbeat(device.id, 'active');
        }

    }, 10000); // Every 10 seconds
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendNoiseData,
        sendRFIDData,
        sendCombinedData,
        sendDeviceHeartbeat,
        sendBulkData,
        simulateLibraryScenario,
        startContinuousSimulation
    };
}

// Run simulation if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    simulateLibraryScenario();
    // startContinuousSimulation(); // Uncomment to run continuous simulation
}
