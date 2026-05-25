const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');

// Get location details by pincode
router.get('/pincode/:pincode', async (req, res) => {
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

    // Find pincode details
    const pincodeData = await Pincode.findByPincodeWithDetails(pincode);
    
    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found',
        error: 'PINCODE_NOT_FOUND'
      });
    }

    // Get primary language or requested language
    const primaryLang = pincodeData.languages?.find(l => l.isPrimary)?.code || 'en';
    const selectedLang = lang || primaryLang;

    // Prepare response with localized content
    const response = {
      success: true,
      data: {
        pincode: pincodeData.pincode,
        location: {
          state: pincodeData.postOffice[0]?.state || '',
          district: pincodeData.postOffice[0]?.district || '',
          postOffices: pincodeData.postOffice.map(office => ({
            name: office.name,
            branchType: office.branchType,
            deliveryStatus: office.deliveryStatus,
            description: office.description
          }))
        },
        coordinates: pincodeData.coordinates,
        agricultural: pincodeData.agricultural,
        markets: pincodeData.markets || [],
        languages: pincodeData.languages || [],
        primaryLanguage: primaryLang,
        selectedLanguage: selectedLang
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Location API] Error fetching pincode:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get nearby pincodes by coordinates
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 50 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        error: 'MISSING_COORDINATES'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates',
        error: 'INVALID_COORDINATES'
      });
    }

    const nearbyPincodes = await Pincode.findNearby(latitude, longitude, parseFloat(radius));

    const response = {
      success: true,
      data: {
        center: { lat: latitude, lon: longitude },
        radius: parseFloat(radius),
        pincodes: nearbyPincodes.map(pin => ({
          pincode: pin.pincode,
          location: {
            state: pin.postOffice[0]?.state || '',
            district: pin.postOffice[0]?.district || '',
            mainPostOffice: pin.postOffice[0]?.name || ''
          },
          coordinates: pin.coordinates,
          distance: calculateDistance(latitude, longitude, pin.coordinates?.lat, pin.coordinates?.lon)
        })).sort((a, b) => a.distance - b.distance)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Location API] Error finding nearby pincodes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Search pincodes by state and district
router.get('/search', async (req, res) => {
  try {
    const { state, district, limit = 20, page = 1 } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required',
        error: 'MISSING_STATE'
      });
    }

    const query = { 
      'postOffice.state': new RegExp(state, 'i'),
      isActive: true 
    };

    if (district) {
      query['postOffice.district'] = new RegExp(district, 'i');
    }

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const pincodes = await Pincode.find(query)
      .select('pincode postOffice.state postOffice.district postOffice.name coordinates')
      .skip(skip)
      .limit(limitNum)
      .sort({ pincode: 1 })
      .lean();

    const total = await Pincode.countDocuments(query);

    const response = {
      success: true,
      data: {
        pincodes: pincodes.map(pin => ({
          pincode: pin.pincode,
          state: pin.postOffice[0]?.state || '',
          district: pin.postOffice[0]?.district || '',
          mainPostOffice: pin.postOffice[0]?.name || '',
          coordinates: pin.coordinates
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Location API] Error searching pincodes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get states list
router.get('/states', async (req, res) => {
  try {
    const states = await Pincode.distinct('postOffice.state', { isActive: true });
    
    const response = {
      success: true,
      data: {
        states: states.sort().map(state => ({
          name: state,
          code: state.toLowerCase().replace(/\s+/g, '_')
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Location API] Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Get districts by state
router.get('/districts/:state', async (req, res) => {
  try {
    const { state } = req.params;
    
    const districts = await Pincode.distinct('postOffice.district', {
      'postOffice.state': new RegExp(state, 'i'),
      isActive: true
    });

    const response = {
      success: true,
      data: {
        state,
        districts: districts.sort().map(district => ({
          name: district,
          code: district.toLowerCase().replace(/\s+/g, '_')
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('[Location API] Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

module.exports = router;
