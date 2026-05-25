const { sendServerError } = require('../utils/http');

// Rule-based responses for common farmer queries
const getRuleBasedResponse = (query) => {
  const lowerQuery = query.toLowerCase();

  // Market price queries
  if (lowerQuery.includes('price') || lowerQuery.includes('rate') || lowerQuery.includes('market') || lowerQuery.includes('mandi')) {
    return {
      category: 'market_price',
      response: 'Market prices are available in the Market section. You can check current prices for crops like Wheat, Rice, Cotton, Maize, Tomato, Onion, and Potato. Prices vary by location and market. Visit the Market page for detailed information.'
    };
  }

  // Crop selling queries
  if (lowerQuery.includes('sell') || lowerQuery.includes('selling') || lowerQuery.includes('sale') || lowerQuery.includes('bech')) {
    return {
      category: 'crop_selling',
      response: 'To sell your crops, go to the Sell Request section. Fill in the crop name, quantity, expected price, and location. Your request will be reviewed by admin and forwarded to businesses. You can track the status in My Requests.'
    };
  }

  // Order status queries
  if (lowerQuery.includes('order') || lowerQuery.includes('status') || lowerQuery.includes('request') || lowerQuery.includes('avastha')) {
    return {
      category: 'order_status',
      response: 'You can check your sell request status in the My Requests section. Status stages are: Pending, Approved by Admin, Sent to Business, Accepted by Business, Rejected, or Completed. Each status update will be shown with remarks from admin or business.'
    };
  }

  // Weather queries
  if (lowerQuery.includes('weather') || lowerQuery.includes('mausam') || lowerQuery.includes('rain') || lowerQuery.includes('baarish')) {
    return {
      category: 'weather',
      response: 'Weather information helps in planning crop activities. Currently, weather integration is being developed. For now, please check local weather forecasts for accurate information. We recommend monitoring weather before sowing and harvesting.'
    };
  }

  // Crop disease queries
  if (lowerQuery.includes('disease') || lowerQuery.includes('bimari') || lowerQuery.includes('pest') || lowerQuery.includes('keeda')) {
    return {
      category: 'crop_disease',
      response: 'For crop disease help, check the crop quality section. Common diseases include fungal infections, pest attacks, and nutrient deficiencies. Use proper pesticides, maintain crop rotation, and ensure proper irrigation. Consult local agricultural experts for specific disease treatment.'
    };
  }

  // Default response
  return {
    category: 'general',
    response: 'I can help you with market prices, crop selling, order status, weather information, and crop disease help. Please ask about any of these topics. For example: "What are wheat prices?" or "How do I sell my crops?"'
  };
};

exports.queryAssistant = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const result = getRuleBasedResponse(query);

    res.json({
      success: true,
      data: {
        query,
        ...result
      }
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};
