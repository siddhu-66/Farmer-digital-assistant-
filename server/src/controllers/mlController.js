// ML Integration Placeholder Controller
// This controller provides placeholder APIs for ML predictions
// Real ML models can be integrated later by connecting to Python ML service

exports.predictQuality = async (req, res) => {
  try {
    const { cropName, quantity, location, season, imageUrl, marketPrice } = req.body;

    // Validate required fields
    if (!cropName || !quantity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cropName, quantity, location'
      });
    }

    // Placeholder ML prediction logic
    // In production, this would call a Python ML service
    const qualityScore = Math.floor(Math.random() * 30) + 70; // Random score 70-100
    const confidence = (Math.random() * 0.3 + 0.7).toFixed(2); // 0.70-1.00
    
    const factors = [
      'Color consistency',
      'Size uniformity',
      'Freshness indicators',
      'Pest damage assessment',
      'Moisture content'
    ];

    const grade = qualityScore >= 90 ? 'A+' : qualityScore >= 80 ? 'A' : qualityScore >= 70 ? 'B' : 'C';

    res.json({
      success: true,
      data: {
        cropName,
        qualityScore,
        grade,
        confidence: parseFloat(confidence),
        factors,
        predictedAt: new Date().toISOString(),
        notes: 'This is a placeholder prediction. Connect real ML model for production.'
      }
    });
  } catch (error) {
    console.error('ML Quality Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict crop quality'
    });
  }
};

exports.predictPrice = async (req, res) => {
  try {
    const { cropName, quantity, location, season, imageUrl, marketPrice, state, district, market, minPrice, maxPrice } = req.body;

    // Validate required fields
    if (!cropName || !quantity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cropName, quantity, location'
      });
    }

    // Call Python ML service for market price prediction
    try {
      const month = new Date().getMonth() + 1; // Current month (1-12)
      
      const mlRequestBody = {
        commodity: cropName,
        state: state || 'Unknown',
        district: district || 'Unknown',
        market: market || 'Unknown',
        min_price: minPrice || 0,
        max_price: maxPrice || 0,
        month: month
      };

      const response = await fetch('http://localhost:8000/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mlRequestBody)
      });

      if (!response.ok) {
        throw new Error(`ML service returned ${response.status}`);
      }

      const mlData = await response.json();

      if (mlData.error) {
        throw new Error(mlData.error);
      }

      return res.json({
        success: true,
        data: {
          cropName,
          quantity,
          predictedPrice: mlData.predictedPrice,
          location,
          season: season || 'unknown',
          predictedAt: new Date().toISOString(),
          source: 'ml_service'
        }
      });
    } catch (mlError) {
      console.error('ML Service Error:', mlError);
      
      // Fallback to placeholder if ML service is unavailable
      const basePrice = marketPrice || 25;
      const predictedPrice = basePrice + (Math.random() * 10 - 5);
      const confidence = (Math.random() * 0.2 + 0.75).toFixed(2);
      
      const trends = ['rising', 'stable', 'declining'];
      const marketTrend = trends[Math.floor(Math.random() * trends.length)];

      return res.json({
        success: true,
        data: {
          cropName,
          quantity,
          basePrice,
          predictedPrice: parseFloat(predictedPrice.toFixed(2)),
          confidence: parseFloat(confidence),
          marketTrend,
          location,
          season: season || 'unknown',
          predictedAt: new Date().toISOString(),
          source: 'fallback',
          notes: 'ML service unavailable, using fallback prediction'
        }
      });
    }
  } catch (error) {
    console.error('ML Price Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict crop price'
    });
  }
};

exports.getMLStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        mlServiceConnected: false,
        qualityModelAvailable: false,
        priceModelAvailable: false,
        lastModelUpdate: null,
        notes: 'ML models not connected. Using placeholder predictions.'
      }
    });
  } catch (error) {
    console.error('ML Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ML service status'
    });
  }
};
