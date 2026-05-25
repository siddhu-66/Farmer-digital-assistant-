const express = require('express');
const router = express.Router();
const https = require('https');

// Fallback sample market data
const sampleMarketData = [
  {
    cropName: 'Wheat',
    market: 'Azadpur Mandi',
    district: 'Delhi',
    state: 'Delhi',
    minPrice: 2150,
    maxPrice: 2350,
    modalPrice: 2250,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Rice (Basmati)',
    market: 'Karnal Mandi',
    district: 'Karnal',
    state: 'Haryana',
    minPrice: 3200,
    maxPrice: 3600,
    modalPrice: 3400,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Cotton',
    market: 'Rajkot Mandi',
    district: 'Rajkot',
    state: 'Gujarat',
    minPrice: 6800,
    maxPrice: 7200,
    modalPrice: 7000,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Maize',
    market: 'Nashik Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 1800,
    maxPrice: 2100,
    modalPrice: 1950,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Tomato',
    market: 'Kolar Mandi',
    district: 'Kolar',
    state: 'Karnataka',
    minPrice: 1200,
    maxPrice: 1500,
    modalPrice: 1350,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Onion',
    market: 'Lasalgaon Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 800,
    maxPrice: 1200,
    modalPrice: 1000,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Potato',
    market: 'Agra Mandi',
    district: 'Agra',
    state: 'Uttar Pradesh',
    minPrice: 600,
    maxPrice: 900,
    modalPrice: 750,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  },
  {
    cropName: 'Sugarcane',
    market: 'Muzaffarnagar Mandi',
    district: 'Muzaffarnagar',
    state: 'Uttar Pradesh',
    minPrice: 280,
    maxPrice: 320,
    modalPrice: 300,
    priceUnit: 'Quintal',
    date: new Date().toISOString().split('T')[0]
  }
];

// Fetch data from data.gov.in API
const fetchFromDataGovIn = async () => {
  return new Promise((resolve) => {
    const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    const apiKey = '579b464a6682c4c5987687b3f05b4d5c'; // Public API key for data.gov.in
    
    const url = new URL(apiUrl);
    url.searchParams.append('api-key', apiKey);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '100');
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.records && Array.isArray(jsonData.records)) {
            const formattedData = jsonData.records.map(record => ({
              cropName: record.Commodity || record.commodity || 'Unknown',
              market: record.Market || record.market || 'Unknown',
              district: record.District || record.district || 'Unknown',
              state: record.State || record.state || 'Unknown',
              minPrice: parseFloat(record.Min_Price || record.min_price || 0),
              maxPrice: parseFloat(record.Max_Price || record.max_price || 0),
              modalPrice: parseFloat(record.Modal_Price || record.modal_price || 0),
              priceUnit: record.Price_Unit || record.price_unit || 'Quintal',
              date: record.Arrival_Date || record.arrival_date || new Date().toISOString().split('T')[0]
            }));
            resolve(formattedData);
          } else {
            resolve(sampleMarketData);
          }
        } catch (error) {
          console.error('[Market API] Error parsing API response:', error);
          resolve(sampleMarketData);
        }
      });
    }).on('error', (error) => {
      console.error('[Market API] Error fetching from data.gov.in:', error);
      resolve(sampleMarketData);
    });
  });
};

// GET /api/market-prices - Get all market prices with optional filters
router.get('/', async (req, res) => {
  try {
    const { crop, state, district, market } = req.query;
    
    // Fetch from data.gov.in API with fallback
    let marketData = await fetchFromDataGovIn();
    
    // Apply filters
    if (crop) {
      marketData = marketData.filter(item => 
        item.cropName.toLowerCase().includes(crop.toLowerCase())
      );
    }
    
    if (state) {
      marketData = marketData.filter(item => 
        item.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    
    if (district) {
      marketData = marketData.filter(item => 
        item.district.toLowerCase().includes(district.toLowerCase())
      );
    }
    
    if (market) {
      marketData = marketData.filter(item => 
        item.market.toLowerCase().includes(market.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: marketData,
      source: marketData === sampleMarketData ? 'fallback' : 'api'
    });
  } catch (error) {
    console.error('[Market API] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices',
      error: error.message
    });
  }
});

module.exports = router;
