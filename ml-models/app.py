from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add the ml-models directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from crop_recommendation.predict import get_crop_recommendation
from price_prediction.predict import get_price_prediction
from disease_detection.predict import detect_disease

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Agricultural ML API',
        'version': '1.0.0'
    })

@app.route('/api/crop-recommendation', methods=['POST'])
def crop_recommendation():
    """Crop recommendation endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['soil_type', 'temperature', 'rainfall', 'ph_level']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        result = get_crop_recommendation(data)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/price-prediction', methods=['POST'])
def price_prediction():
    """Price prediction endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['crop', 'location', 'season', 'market_demand']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        result = get_price_prediction(data)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/disease-detection', methods=['POST'])
def disease_detection():
    """Disease detection endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        image_file = request.files['image']
        
        # Save image temporarily
        image_path = os.path.join('temp', image_file.filename)
        os.makedirs('temp', exist_ok=True)
        image_file.save(image_path)
        
        # Detect disease
        result = detect_disease(image_path)
        
        # Clean up temporary file
        os.remove(image_path)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/models/info', methods=['GET'])
def models_info():
    """Get information about available ML models"""
    return jsonify({
        'models': {
            'crop_recommendation': {
                'description': 'Recommends crops based on soil, weather, and environmental conditions',
                'input_fields': ['soil_type', 'temperature', 'rainfall', 'ph_level'],
                'output_format': 'crop recommendations with confidence scores'
            },
            'price_prediction': {
                'description': 'Predicts crop prices based on historical data and market trends',
                'input_fields': ['crop', 'location', 'season', 'market_demand'],
                'output_format': 'predicted price with confidence interval'
            },
            'disease_detection': {
                'description': 'Detects crop diseases from leaf images',
                'input_fields': ['image_file'],
                'output_format': 'disease classification with treatment recommendations'
            }
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5002))
    debug = os.environ.get('ML_DEBUG', 'False').lower() == 'true'
    
    print(f"🤖 Agricultural ML API starting on port {port}")
    print("📊 Available endpoints:")
    print("  POST /api/crop-recommendation")
    print("  POST /api/price-prediction")
    print("  POST /api/disease-detection")
    print("  GET  /api/models/info")
    print("  GET  /health")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
