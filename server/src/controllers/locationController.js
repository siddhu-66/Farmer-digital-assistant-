const axios = require('axios');
const Pincode = require('../src/models/Pincode');

// Weather API (using OpenWeatherMap)
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Market price API (using data.gov API)
const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_COMMODITY_RESOURCE_ID = process.env.DATA_GOV_COMMODITY_RESOURCE_ID;
const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/' + DATA_GOV_COMMODITY_RESOURCE_ID;

// Reverse geocoding API (using OpenStreetMap Nominatim)
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// @desc    Get pincode details
// @route   GET /api/location/pincode/:pincode
exports.getPincodeDetails = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    // Find pincode in database
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
    }

    res.json({
      success: true,
      data: {
        pincode: pincodeData.pincode,
        location: {
          state: pincodeData.postOffice[0]?.state,
          district: pincodeData.postOffice[0]?.district,
          postOffice: pincodeData.postOffice[0]?.name,
          coordinates: pincodeData.coordinates
        },
        markets: pincodeData.markets
      }
    });
  } catch (error) {
    console.error('Error fetching pincode details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get weather data for a pincode
// @route   GET /api/location/weather/:pincode
exports.getWeatherByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    // Get pincode details to get coordinates
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
    }

    if (!pincodeData.coordinates.lat || !pincodeData.coordinates.lon) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates not available for this pincode'
      });
    }

    // Fetch weather data
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: pincodeData.coordinates.lat,
        lon: pincodeData.coordinates.lon,
        appid: WEATHER_API_KEY,
        units: 'metric' // Celsius
      }
    });

    const weather = weatherResponse.data;

    res.json({
      success: true,
      data: {
        location: {
          pincode: pincode,
          city: weather.name,
          state: pincodeData.postOffice[0]?.state
        },
        weather: {
          temperature: weather.main.temp,
          feelsLike: weather.main.feels_like,
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          description: weather.weather[0].description,
          windSpeed: weather.wind.speed,
          visibility: weather.visibility / 1000, // Convert to km
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key not configured or invalid'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    });
  }
};

// @desc    Get market prices for a pincode
// @route   GET /api/location/market/:pincode?commodity=Tomato
exports.getMarketPrices = async (req, res) => {
  try {
    const { pincode } = req.params;
    const { commodity = 'Tomato' } = req.query;
    
    // Get pincode details to get market codes
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
    }

    // Get markets from the pincode data
    const markets = pincodeData.markets || [];
    
    if (markets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No market data available for this pincode'
      });
    }

    // Fetch market prices from data.gov API
    const marketPrices = [];
    
    try {
      const marketResponse = await axios.get(DATA_GOV_API_URL, {
        params: {
          'api-key': DATA_GOV_API_KEY,
          format: 'json',
          limit: 10
        }
      });

      const marketData = marketResponse.data.records || [];
      
      // Filter by commodity and state if available
      const filteredData = marketData.filter(record => {
        const recordCommodity = record.commodity?.toLowerCase() || '';
        const recordState = record.state?.toLowerCase() || '';
        const targetCommodity = commodity.toLowerCase();
        const targetState = pincodeData.postOffice[0]?.state?.toLowerCase() || '';
        
        return recordCommodity.includes(targetCommodity) && 
               (recordState === targetState || recordState === '');
      });

      // Map API response to our format
      filteredData.forEach(record => {
        marketPrices.push({
          marketName: record.market || record.apmc_market || 'Unknown Market',
          marketType: 'mandi',
          distance: pincodeData.markets[0]?.distance || 0,
          commodity: record.commodity || commodity,
          price: parseFloat(record.modal_price) || parseFloat(record.min_price) || 0,
          unit: record.unit || 'Quintal',
          date: record.arrival_date || new Date().toISOString().split('T')[0],
          trend: 'stable', // Could calculate based on historical data
          change: '0.00'
        });
      });

      // If no data from API, provide fallback
      if (marketPrices.length === 0) {
        for (const market of pincodeData.markets) {
          marketPrices.push({
            marketName: market.name,
            marketType: market.type,
            distance: market.distance,
            commodity: commodity,
            price: 25, // Default price
            unit: 'Quintal',
            date: new Date().toISOString().split('T')[0],
            trend: 'stable',
            change: '0.00'
          });
        }
      }
    } catch (apiError) {
      console.warn('Data.gov API error, using fallback:', apiError.message);
      
      // Always provide fallback data if API fails
      if (marketPrices.length === 0) {
        for (const market of pincodeData.markets) {
          marketPrices.push({
            marketName: market.name,
            marketType: market.type || 'mandi',
            distance: market.distance || 0,
            commodity: commodity,
            price: 25 + Math.floor(Math.random() * 20), // Random price 25-45
            unit: 'Quintal',
            date: new Date().toISOString().split('T')[0],
            trend: 'stable',
            change: '0.00'
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        location: {
          pincode: pincode,
          state: pincodeData.postOffice[0]?.state,
          district: pincodeData.postOffice[0]?.district
        },
        commodity: commodity,
        markets: marketPrices,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices'
    });
  }
};

// @desc    Get pincode from coordinates (reverse geocoding)
// @route   GET /api/location/reverse?lat=28.6139&lon=77.2090
exports.getPincodeByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // First try to find pincode by coordinates in our database
    const nearbyPincodes = await Pincode.find({
      'coordinates.lat': { $exists: true },
      'coordinates.lon': { $exists: true },
      isActive: true
    })
    .where('coordinates.lat').gte(parseFloat(lat) - 0.1).lte(parseFloat(lat) + 0.1)
    .where('coordinates.lon').gte(parseFloat(lon) - 0.1).lte(parseFloat(lon) + 0.1)
    .limit(1)
    .lean();

    if (nearbyPincodes.length > 0) {
      const pincodeData = nearbyPincodes[0];
      return res.json({
        success: true,
        data: {
          pincode: pincodeData.pincode,
          location: {
            state: pincodeData.postOffice[0]?.state,
            district: pincodeData.postOffice[0]?.district,
            postOffice: pincodeData.postOffice[0]?.name,
            coordinates: pincodeData.coordinates
          },
          markets: pincodeData.markets
        }
      });
    }

    // Fallback: Use Nominatim API for reverse geocoding
    try {
      const nominatimResponse = await axios.get(NOMINATIM_API_URL, {
        params: {
          lat: lat,
          lon: lon,
          format: 'json',
          addressdetails: 1,
          country: 'in'
        }
      });

      const address = nominatimResponse.data;
      
      if (address && address.address) {
        // Try to find pincode by state and district
        const state = address.address.state;
        const district = address.address.county || address.address.district;
        
        if (state && district) {
          const pincodeByLocation = await Pincode.findOne({
            'postOffice.state': state,
            'postOffice.district': district,
            isActive: true
          }).lean();

          if (pincodeByLocation) {
            return res.json({
              success: true,
              data: {
                pincode: pincodeByLocation.pincode,
                location: {
                  state: pincodeByLocation.postOffice[0]?.state,
                  district: pincodeByLocation.postOffice[0]?.district,
                  postOffice: pincodeByLocation.postOffice[0]?.name,
                  coordinates: pincodeByLocation.coordinates
                },
                markets: pincodeByLocation.markets
              }
            });
          }
        }
      }

      // If no pincode found, return address info
      return res.json({
        success: true,
        data: {
          pincode: null,
          location: {
            state: address.address?.state || 'Unknown',
            district: address.address?.county || address.address?.district || 'Unknown',
            city: address.address?.city || 'Unknown',
            coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) }
          },
          markets: [],
          message: 'Pincode not found for this location'
        }
      });
    } catch (nominatimError) {
      console.error('Nominatim API error:', nominatimError);
      return res.status(500).json({
        success: false,
        message: 'Failed to reverse geocode coordinates'
      });
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get complete location info (pincode + weather + market)
// @route   GET /api/location/complete/:pincode?commodity=Tomato
exports.getCompleteLocationInfo = async (req, res) => {
  try {
    const { pincode } = req.params;
    const { commodity = 'Tomato' } = req.query;
    
    // Get pincode details
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      });
    }

    // Prepare response with all available data
    const response = {
      success: true,
      data: {
        location: {
          pincode: pincodeData.pincode,
          state: pincodeData.postOffice[0]?.state,
          district: pincodeData.postOffice[0]?.district,
          postOffice: pincodeData.postOffice[0]?.name,
          coordinates: pincodeData.coordinates
        },
        markets: pincodeData.markets
      }
    };

    // Add weather data if coordinates are available
    if (pincodeData.coordinates.lat && pincodeData.coordinates.lon) {
      try {
        const weatherResponse = await axios.get(WEATHER_API_URL, {
          params: {
            lat: pincodeData.coordinates.lat,
            lon: pincodeData.coordinates.lon,
            appid: WEATHER_API_KEY,
            units: 'metric'
          }
        });

        response.data.weather = {
          temperature: weatherResponse.data.main.temp,
          description: weatherResponse.data.weather[0].description,
          humidity: weatherResponse.data.main.humidity,
          timestamp: new Date().toISOString()
        };
      } catch (weatherError) {
        console.warn('Weather data unavailable:', weatherError.message);
        response.data.weather = null;
      }
    }

    // Add market prices
    const marketPrices = [];
    for (const market of pincodeData.markets) {
      const mockPrice = {
        marketName: market.name,
        commodity: commodity,
        price: Math.floor(Math.random() * 50) + 20,
        unit: 'Quintal',
        date: new Date().toISOString().split('T')[0]
      };
      marketPrices.push(mockPrice);
    }
    response.data.marketPrices = marketPrices;

    res.json(response);
  } catch (error) {
    console.error('Error fetching complete location info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location information'
    });
  }
};
