# IoT Integration Guide for Library Noise Monitoring System

## Overview
This guide explains how to integrate ESP32-based IoT devices (noise sensors and RFID readers) with the library management system. The system is designed to receive real-time data from IoT devices and display it on the admin dashboard.

## 🏗️ System Architecture

### Database Schema
The system uses the following tables to store IoT data:

1. **`iot_devices`** - Stores information about connected devices
2. **`noise_readings`** - Stores noise level measurements
3. **`rfid_events`** - Stores RFID card scan events
4. **`room_environment`** - Aggregated data per room/table
5. **`iot_alerts`** - System alerts and notifications

### API Endpoints
The system provides REST API endpoints for IoT devices:

- `POST /api/iot/noise` - Receive noise level data
- `POST /api/iot/rfid` - Receive RFID events
- `POST /api/iot/combined` - Receive combined noise + RFID data
- `POST /api/iot/status` - Device heartbeat/status updates
- `POST /api/iot/bulk` - Bulk data transmission

## 📡 ESP32 Integration

### 1. Noise Sensor Integration

```cpp
// ESP32 Code Example for Noise Sensor
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://your-server.com/api/iot/noise";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
}

void loop() {
  // Read noise level from your sensor
  float noiseLevel = readNoiseSensor(); // Implement your sensor reading function
  
  // Send data to server
  sendNoiseData(noiseLevel);
  
  delay(5000); // Send data every 5 seconds
}

void sendNoiseData(float noiseLevel) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["device_id"] = "NOISE_001"; // Your device ID
    doc["noise_level"] = noiseLevel;
    doc["room_id"] = 1;
    doc["table_id"] = 1;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

float readNoiseSensor() {
  // Implement your noise sensor reading logic here
  // Return noise level in dB
  return 45.0 + random(-5, 5); // Example: random noise between 40-50 dB
}
```

### 2. RFID Reader Integration

```cpp
// ESP32 Code Example for RFID Reader
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <MFRC522.h> // RFID library

#define RST_PIN 22
#define SS_PIN 21

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
}

void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String cardId = getCardId();
    String eventType = "check_in"; // Determine based on your logic
    
    sendRFIDData(cardId, eventType);
    
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
  
  delay(100);
}

String getCardId() {
  String cardId = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    cardId += String(mfrc522.uid.uidByte[i], HEX);
  }
  return cardId;
}

void sendRFIDData(String cardId, String eventType) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://your-server.com/api/iot/rfid");
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument doc(1024);
    doc["device_id"] = "RFID_001";
    doc["card_id"] = cardId;
    doc["event_type"] = eventType;
    doc["student_id"] = "STU_" + cardId;
    doc["room_id"] = 1;
    doc["table_id"] = 1;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    Serial.println("RFID data sent: " + String(httpResponseCode));
    
    http.end();
  }
}
```

### 3. Combined Sensor Integration

```cpp
// ESP32 Code Example for Combined Noise + RFID Sensor
void loop() {
  // Read noise level
  float noiseLevel = readNoiseSensor();
  
  // Check for RFID card
  String cardId = "";
  String eventType = "";
  
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    cardId = getCardId();
    eventType = "check_in";
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
  
  // Send combined data
  sendCombinedData(noiseLevel, cardId, eventType);
  
  delay(5000);
}

void sendCombinedData(float noiseLevel, String cardId, String eventType) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://your-server.com/api/iot/combined");
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument doc(1024);
    doc["device_id"] = "COMBO_001";
    doc["noise_level"] = noiseLevel;
    
    if (cardId != "") {
      doc["card_id"] = cardId;
      doc["event_type"] = eventType;
      doc["student_id"] = "STU_" + cardId;
    }
    
    doc["room_id"] = 1;
    doc["table_id"] = 1;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    Serial.println("Combined data sent: " + String(httpResponseCode));
    
    http.end();
  }
}
```

## 🔧 Server Setup

### 1. Database Setup
Run the SQL schema to create the required tables:

```bash
# Execute the database schema
psql -d your_database -f iot_database_schema.sql
```

### 2. API Server Setup
Set up your server to handle the IoT endpoints:

```javascript
// Example Express.js server setup
const express = require('express');
const cors = require('cors');
const { handleNoiseData, handleRFIDData, handleCombinedData, handleDeviceStatus, handleBulkData } = require('./iot_api_routes');

const app = express();
app.use(cors());
app.use(express.json());

// IoT API routes
app.post('/api/iot/noise', handleNoiseData);
app.post('/api/iot/rfid', handleRFIDData);
app.post('/api/iot/combined', handleCombinedData);
app.post('/api/iot/status', handleDeviceStatus);
app.post('/api/iot/bulk', handleBulkData);

app.listen(3000, () => {
  console.log('IoT API server running on port 3000');
});
```

## 📊 Admin Dashboard Integration

### Real-time Monitoring
The admin dashboard (Frame 19) now includes:

1. **IoT Device Status** - Shows all connected devices and their status
2. **Real-time Noise Monitoring** - Displays current noise levels and comfort indices
3. **RFID Activity Log** - Shows recent RFID events and student activity
4. **Auto-refresh** - Automatically updates data every 5 seconds

### Features
- Device status monitoring with online/offline indicators
- Noise level visualization with comfort index calculation
- RFID event tracking with session duration calculation
- Alert system for high noise levels or device issues
- Historical data viewing and export capabilities

## 🚀 Testing

### 1. Test the API Endpoints
Use the provided test client to simulate IoT data:

```bash
node iot_test_client.js
```

### 2. Monitor the Dashboard
1. Open Frame 19 (Admin Dashboard)
2. Check the IoT Device Status section
3. Monitor real-time noise levels
4. View RFID activity logs

### 3. Verify Data Flow
1. Send test data using the test client
2. Check that data appears in the dashboard
3. Verify auto-refresh functionality
4. Test alert generation for high noise levels

## 🔒 Security Considerations

### API Security
- Implement API key authentication for IoT devices
- Use HTTPS for all communications
- Rate limiting to prevent spam
- Input validation for all data

### Device Security
- Secure WiFi credentials
- Device authentication
- Encrypted communication
- Regular firmware updates

## 📈 Performance Optimization

### Database Optimization
- Indexes on frequently queried columns
- Data archiving for old readings
- Connection pooling
- Query optimization

### Real-time Updates
- WebSocket connections for live updates
- Efficient data aggregation
- Caching for frequently accessed data
- Background processing for heavy operations

## 🛠️ Troubleshooting

### Common Issues
1. **Device not connecting** - Check WiFi credentials and server URL
2. **Data not appearing** - Verify API endpoints and database connection
3. **Slow updates** - Check network latency and server performance
4. **Missing data** - Verify device IDs and data format

### Debug Tools
- Use browser developer tools to monitor API calls
- Check server logs for errors
- Use the test client to verify API functionality
- Monitor database for data insertion

## 📝 Next Steps

1. **Deploy the database schema** to your production environment
2. **Set up the API server** with proper security measures
3. **Configure your ESP32 devices** with the provided code examples
4. **Test the integration** using the test client
5. **Monitor the dashboard** to ensure everything works correctly
6. **Scale up** by adding more devices and locations

## 📞 Support

For technical support or questions about the IoT integration:
- Check the server logs for error messages
- Verify device connectivity and data format
- Test API endpoints using the provided test client
- Monitor the admin dashboard for real-time data flow

The system is designed to be modular and easily extensible, so you can add more devices and features as needed.
