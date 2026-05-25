const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');

// Sample market data service (in production, this would connect to Agmarknet API)
class MarketService {
  async getMarketPrices(location) {
    try {
      // In production, this would call Agmarknet API
      // For now, return sample data based on location
      const sampleData = this.generateSampleMarketData(location);
      return {
        success: true,
        data: sampleData
      };
    } catch (error) {
      console.error('[MarketService] Error fetching market prices:', error);
      return {
        success: false,
        error: 'Failed to fetch market prices'
      };
    }
  }

  generateSampleMarketData(location) {
    const basePrices = {
      'Punjab': {
        wheat: { min: 2200, max: 2400, avg: 2300 },
        rice: { min: 3200, max: 3600, avg: 3400 },
        cotton: { min: 6800, max: 7200, avg: 7000 },
        maize: { min: 1800, max: 2100, avg: 1950 }
      },
      'Gujarat': {
        wheat: { min: 2100, max: 2300, avg: 2200 },
        rice: { min: 3000, max: 3400, avg: 3200 },
        cotton: { min: 7200, max: 7800, avg: 7500 },
        groundnut: { min: 4800, max: 5200, avg: 5000 }
      },
      'Maharashtra': {
        wheat: { min: 2000, max: 2200, avg: 2100 },
        rice: { min: 2900, max: 3300, avg: 3100 },
        cotton: { min: 7000, max: 7600, avg: 7300 },
        soybean: { min: 3800, max: 4200, avg: 4000 }
      }
    };

    const state = location.state || 'Punjab';
    const prices = basePrices[state] || basePrices['Punjab'];

    // Add some random variation
    const addVariation = (price) => {
      const variation = (Math.random() - 0.5) * 100; // ±50 variation
      return Math.round(price + variation);
    };

    const crops = Object.keys(prices).map(crop => ({
      name: crop.charAt(0).toUpperCase() + crop.slice(1),
      variety: 'Common',
      minPrice: addVariation(prices[crop].min),
      maxPrice: addVariation(prices[crop].max),
      avgPrice: addVariation(prices[crop].avg),
      unit: 'Quintal',
      date: new Date().toISOString().split('T')[0],
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.round((Math.random() - 0.5) * 200)
    }));

    return {
      location: {
        state: location.state,
        district: location.district,
        market: location.mainPostOffice || 'Local Mandi'
      },
      crops,
      lastUpdated: new Date().toISOString(),
      source: 'agmarknet_sample'
    };
  }
}

const marketService = new MarketService();

// Get market prices by pincode
router.get('/by-pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { lang = 'en', crop } = req.query;

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pincode format. Must be 6 digits.',
        error: 'INVALID_PINCODE'
      });
    }

    // Get pincode details
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found',
        error: 'PINCODE_NOT_FOUND'
      });
    }

    // Prepare location for market service
    const location = {
      state: pincodeData.postOffice[0]?.state || '',
      district: pincodeData.postOffice[0]?.district || '',
      mainPostOffice: pincodeData.postOffice[0]?.name || '',
      markets: pincodeData.markets || []
    };

    // Get market prices
    const marketData = await marketService.getMarketPrices(location);

    if (!marketData.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch market prices',
        error: 'MARKET_API_ERROR'
      });
    }

    // Filter by specific crop if requested
    let crops = marketData.data.crops;
    if (crop) {
      crops = crops.filter(c => 
        c.name.toLowerCase().includes(crop.toLowerCase())
      );
    }

    const response = {
      success: true,
      data: {
        pincode: pincode,
        location: location,
        crops: crops,
        markets: location.markets,
        lastUpdated: marketData.data.lastUpdated,
        source: marketData.data.source,
        language: lang || pincodeData.getPrimaryLanguage?.() || 'en'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Market API] Error fetching market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get market prices by state and district
router.get('/by-location', async (req, res) => {
  try {
    const { state, district, lang = 'en', crop } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required',
        error: 'MISSING_STATE'
      });
    }

    // Prepare location for market service
    const location = {
      state: state,
      district: district || '',
      mainPostOffice: district || 'State Market'
    };

    // Get market prices
    const marketData = await marketService.getMarketPrices(location);

    if (!marketData.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch market prices',
        error: 'MARKET_API_ERROR'
      });
    }

    // Filter by specific crop if requested
    let crops = marketData.data.crops;
    if (crop) {
      crops = crops.filter(c => 
        c.name.toLowerCase().includes(crop.toLowerCase())
      );
    }

    const response = {
      success: true,
      data: {
        location: location,
        crops: crops,
        lastUpdated: marketData.data.lastUpdated,
        source: marketData.data.source,
        language: lang || 'en'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Market API] Error fetching market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get crop-wise price trends
router.get('/trends/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    const { state, lang = 'en', days = 30 } = req.query;

    // Generate sample trend data
    const trendData = generateTrendData(crop, state, parseInt(days));

    const response = {
      success: true,
      data: {
        crop: crop,
        state: state || 'All India',
        trends: trendData,
        period: `${days} days`,
        language: lang || 'en'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Market API] Error fetching price trends:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get list of available crops
router.get('/crops', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;

    const crops = [
      { name: 'Wheat', varieties: ['HD-2967', 'PBW-343', 'DBW-17'] },
      { name: 'Rice', varieties: ['Basmati', 'IR-64', 'Sona Masoori'] },
      { name: 'Cotton', varieties: ['Bt Cotton', 'Desi Cotton'] },
      { name: 'Maize', varieties: ['Sweet Corn', 'Field Corn'] },
      { name: 'Groundnut', varieties: ['Bold', 'Java'] },
      { name: 'Soybean', varieties: ['JS-335', 'PK-472'] },
      { name: 'Sugarcane', varieties: ['Co-0238', 'Co-86032'] },
      { name: 'Pulses', varieties: ['Gram', 'Lentil', 'Pea'] }
    ];

    const response = {
      success: true,
      data: {
        crops: crops,
        language: lang || 'en'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Market API] Error fetching crops list:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Helper function to generate trend data
function generateTrendData(crop, state, days) {
  const trends = [];
  const basePrice = 2000 + Math.random() * 3000; // Base price between 2000-5000
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation and trend
    const variation = (Math.random() - 0.5) * 200;
    const trend = (days - i) * 2; // Slight upward trend
    const price = Math.round(basePrice + variation + trend);
    
    trends.push({
      date: date.toISOString().split('T')[0],
      price: price,
      minPrice: Math.round(price * 0.95),
      maxPrice: Math.round(price * 1.05)
    });
  }
  
  return trends;
}

module.exports = router;
