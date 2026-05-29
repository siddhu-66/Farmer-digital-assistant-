const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');
const weatherService = require('../services/weatherService');

/**
 * Pincode weather (Express) — proxied from Next.js as /api/weather/by-pincode/:pincode.
 * Analytics dashboard uses the Next.js route at /api/weather (OpenWeather proxy) instead.
 */

// Get weather by pincode
router.get('/by-pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { type = 'current', lang = 'en' } = req.query;

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pincode format. Must be 6 digits.',
        error: 'INVALID_PINCODE'
      });
    }

    // Get pincode details for location
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found',
        error: 'PINCODE_NOT_FOUND'
      });
    }

    // Prepare location for weather service
    const location = {
      pincode: pincode,
      country: 'IN'
    };

    // Add coordinates if available
    if (pincodeData.coordinates && pincodeData.coordinates.lat && pincodeData.coordinates.lon) {
      location.lat = pincodeData.coordinates.lat;
      location.lon = pincodeData.coordinates.lon;
    } else {
      // Use district/state as fallback
      location.city = `${pincodeData.postOffice[0]?.district}, ${pincodeData.postOffice[0]?.state}`;
    }

    let weatherData;
    
    if (type === 'current') {
      weatherData = await weatherService.getCurrentWeather(location);
    } else if (type === 'forecast') {
      weatherData = await weatherService.getWeatherForecast(location);
    } else if (type === 'alerts') {
      weatherData = await weatherService.getWeatherAlerts(location);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be current, forecast, or alerts',
        error: 'INVALID_TYPE'
      });
    }

    if (!weatherData.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch weather data',
        error: 'WEATHER_API_ERROR'
      });
    }

    // Get agricultural recommendations for current weather
    let recommendations = [];
    if (type === 'current' && weatherData.data) {
      recommendations = weatherService.getAgriculturalRecommendations(weatherData.data);
    }

    const response = {
      success: true,
      data: {
        pincode: pincode,
        location: {
          state: pincodeData.postOffice[0]?.state || '',
          district: pincodeData.postOffice[0]?.district || '',
          name: pincodeData.postOffice[0]?.name || '',
          coordinates: pincodeData.coordinates
        },
        weather: weatherData.data,
        recommendations: recommendations,
        language: lang || pincodeData.getPrimaryLanguage?.() || 'en',
        source: weatherData.data.source || 'openweathermap'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Weather API] Error fetching weather by pincode:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get weather alerts by pincode
router.get('/alerts/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { lang = 'en' } = req.query;

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

    // Prepare location for weather service
    const location = {
      pincode: pincode,
      country: 'IN'
    };

    if (pincodeData.coordinates && pincodeData.coordinates.lat && pincodeData.coordinates.lon) {
      location.lat = pincodeData.coordinates.lat;
      location.lon = pincodeData.coordinates.lon;
    }

    const alertsData = await weatherService.getWeatherAlerts(location);

    if (!alertsData.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch weather alerts',
        error: 'WEATHER_ALERTS_ERROR'
      });
    }

    const response = {
      success: true,
      data: {
        pincode: pincode,
        location: {
          state: pincodeData.postOffice[0]?.state || '',
          district: pincodeData.postOffice[0]?.district || '',
          name: pincodeData.postOffice[0]?.name || ''
        },
        alerts: alertsData.data.alerts || [],
        language: lang || pincodeData.getPrimaryLanguage?.() || 'en',
        source: alertsData.data.source || 'weather_analysis'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Weather API] Error fetching weather alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get agricultural recommendations by pincode
router.get('/recommendations/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { lang = 'en' } = req.query;

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

    // Get current weather
    const location = {
      pincode: pincode,
      country: 'IN'
    };

    if (pincodeData.coordinates && pincodeData.coordinates.lat && pincodeData.coordinates.lon) {
      location.lat = pincodeData.coordinates.lat;
      location.lon = pincodeData.coordinates.lon;
    }

    const currentWeather = await weatherService.getCurrentWeather(location);

    let recommendations = [];
    if (currentWeather.success && currentWeather.data) {
      recommendations = weatherService.getAgriculturalRecommendations(currentWeather.data);
    }

    // Add crop-specific recommendations if agricultural data is available
    if (pincodeData.agricultural && pincodeData.agricultural.mainCrops) {
      pincodeData.agricultural.mainCrops.forEach(crop => {
        recommendations.push({
          category: 'crop_specific',
          priority: 'medium',
          message: `${crop} is commonly grown in this region`,
          action: `Consider ${crop} for your farming activities`
        });
      });
    }

    const response = {
      success: true,
      data: {
        pincode: pincode,
        location: {
          state: pincodeData.postOffice[0]?.state || '',
          district: pincodeData.postOffice[0]?.district || '',
          name: pincodeData.postOffice[0]?.name || ''
        },
        currentWeather: currentWeather.success ? currentWeather.data : null,
        recommendations: recommendations,
        agriculturalInfo: pincodeData.agricultural || null,
        language: lang || pincodeData.getPrimaryLanguage?.() || 'en'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Weather API] Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
