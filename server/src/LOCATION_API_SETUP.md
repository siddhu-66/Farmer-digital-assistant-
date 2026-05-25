# Location APIs Setup Guide

This guide shows how to set up and use the pincode-based location APIs.

## Files Created/Modified

### 1. Pincode Model
**File**: `backend/src/models/Pincode.js`
- Comprehensive MongoDB schema for Indian pincodes
- Includes location data, agricultural info, market data, and coordinates
- Pre-built with indexes and helper methods

### 2. Import Script
**File**: `backend/scripts/importPincodes.js`
- Imports CSV data into MongoDB
- Creates sample data if no CSV found
- Batch processing for large datasets

### 3. Location Controller
**File**: `backend/controllers/locationController.js`
- 4 API endpoints with full functionality
- Weather integration (OpenWeatherMap)
- Market price data (mock implementation)
- Complete location info aggregation

### 4. Location Routes
**File**: `backend/routes/location.js`
- Updated routes for all new endpoints
- Clean REST API structure

## API Endpoints

### 1. Get Pincode Details
```
GET /api/location/pincode/:pincode
```
**Example**: `GET /api/location/pincode/110001`

**Response**:
```json
{
  "success": true,
  "data": {
    "pincode": "110001",
    "location": {
      "state": "Delhi",
      "district": "Central Delhi",
      "postOffice": "Delhi G.P.O.",
      "coordinates": { "lat": 28.6139, "lon": 77.2090 }
    },
    "markets": [
      {
        "name": "Azadpur Mandi",
        "type": "mandi",
        "distance": 5,
        "code": "DEL001"
      }
    ]
  }
}
```

### 2. Get Weather Data
```
GET /api/location/weather/:pincode
```
**Example**: `GET /api/location/weather/110001`

**Response**:
```json
{
  "success": true,
  "data": {
    "location": {
      "pincode": "110001",
      "city": "Delhi",
      "state": "Delhi"
    },
    "weather": {
      "temperature": 28.5,
      "feelsLike": 30.2,
      "humidity": 65,
      "pressure": 1012,
      "description": "clear sky",
      "windSpeed": 3.5,
      "visibility": 10,
      "timestamp": "2025-01-07T12:00:00.000Z"
    }
  }
}
```

### 3. Get Market Prices
```
GET /api/location/market/:pincode?commodity=Tomato
```
**Example**: `GET /api/location/market/110001?commodity=Tomato`

**Response**:
```json
{
  "success": true,
  "data": {
    "location": {
      "pincode": "110001",
      "state": "Delhi",
      "district": "Central Delhi"
    },
    "commodity": "Tomato",
    "markets": [
      {
        "marketName": "Azadpur Mandi",
        "marketType": "mandi",
        "distance": 5,
        "commodity": "Tomato",
        "price": 45,
        "unit": "Quintal",
        "date": "2025-01-07",
        "trend": "up",
        "change": "2.50"
      }
    ],
    "lastUpdated": "2025-01-07T12:00:00.000Z"
  }
}
```

### 4. Get Complete Location Info
```
GET /api/location/complete/:pincode?commodity=Tomato
```
**Example**: `GET /api/location/complete/110001?commodity=Tomato`

**Response**: Combined data from all above endpoints

## Setup Instructions

### 1. Import Pincode Data
```bash
cd backend
node scripts/importPincodes.js
```

This will:
- Connect to MongoDB
- Clear existing pincode data (optional)
- Import from CSV if available, or create sample data
- Show progress and completion message

### 2. Configure Environment Variables
Add to your `.env` file:
```env
# Weather API (get free key from https://openweathermap.org/api)
WEATHER_API_KEY=your_openweathermap_api_key_here
```

### 3. Start the Backend Server
```bash
cd backend
npm start
# or
npm run dev
```

### 4. Test the APIs
```bash
cd backend
node test/testLocationAPIs.js
```

## Data Flow

```
Pincode Input
    |
    v
MongoDB (Pincode Collection)
    |
    v
Get: State, District, Coordinates, Markets
    |
    v
External APIs:
- OpenWeatherMap (weather)
- Agmarknet (market prices)
    |
    v
Combined Response
```

## CSV Format (if you have your own data)

Expected CSV columns:
- `pincode` - 6-digit pincode
- `officename` - Post office name
- `districtname` - District name
- `statename` - State name
- `latitude` - Latitude (optional)
- `longitude` - Longitude (optional)
- `marketName` - Market name (optional)
- `marketCode` - Market code (optional)

## Sample Data Included

The import script creates 3 sample pincodes:
- 110001 - Delhi G.P.O. (Delhi)
- 400001 - Mumbai G.P.O. (Maharashtra) 
- 560001 - Bangalore G.P.O. (Karnataka)

## Next Steps

1. **Add your CSV file**: Place your pincode CSV in `backend/scripts/pincodes.csv`
2. **Get Weather API key**: Register at OpenWeatherMap for free API key
3. **Integrate real market data**: Replace mock market prices with Agmarknet API
4. **Add more pincodes**: Import complete dataset for full coverage

## Error Handling

- **404**: Pincode not found in database
- **400**: Coordinates not available for weather
- **500**: Server error or API failure
- **401**: Weather API key missing/invalid

All APIs return consistent JSON format with `success` boolean and appropriate error messages.
