"""
market_price_app.py — Market Price Prediction Flask API
========================================================
Endpoint:  POST /predict-price
Input  :   { commodity, state, district, market, min_price, max_price, month }
Output :   { predictedPrice: 2250 }

Run:
    python market_price_app.py
    (runs on http://localhost:8000)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd

app = Flask(__name__)
CORS(app)   # Allow requests from Node.js backend

# ── Load Trained Model ───────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

try:
    model = joblib.load(os.path.join(MODEL_DIR, 'market_price_model.pkl'))
    encoders = joblib.load(os.path.join(MODEL_DIR, 'market_price_encoders.pkl'))
    print("✅ Market Price Model loaded successfully")
except FileNotFoundError:
    print("⚠️  Market Price Model not found. Run train_market_price_model.py first!")
    model = encoders = None


def safe_encode(encoder, value, fallback=0):
    """Encode a categorical value; return fallback if unseen."""
    try:
        return int(encoder.transform([str(value)])[0])
    except ValueError:
        # Unknown category — use fallback
        return fallback


# ── Health Check ─────────────────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "ok",
        "service": "Market Price Prediction API",
        "model_loaded": model is not None
    })


# ── Market Price Prediction Endpoint ───────────────────────────────────────────
@app.route('/predict-price', methods=['POST'])
def predict_price():
    if model is None:
        return jsonify({"error": "Model not loaded. Run train_market_price_model.py first."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    # ── Validate Required Fields ──────────────────────────────────────────────
    required = ['commodity', 'state', 'district', 'market', 'min_price', 'max_price', 'month']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        # ── Encode Input ──────────────────────────────────────────────────────
        commodity_enc = safe_encode(encoders['commodity'], data['commodity'])
        state_enc = safe_encode(encoders['state'], data['state'])
        district_enc = safe_encode(encoders['district'], data['district'])
        market_enc = safe_encode(encoders['market'], data['market'])

        features = pd.DataFrame([{
            'commodity_enc': commodity_enc,
            'state_enc': state_enc,
            'district_enc': district_enc,
            'market_enc': market_enc,
            'min_price': float(data['min_price']),
            'max_price': float(data['max_price']),
            'month': int(data['month'])
        }])

        # ── Predict Modal Price ───────────────────────────────────────────────
        predicted_price = round(float(model.predict(features)[0]), 2)

        return jsonify({
            "predictedPrice": predicted_price
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('MARKET_PORT', 8000))
    debug = os.environ.get('MARKET_DEBUG', 'False').lower() == 'true'
    print(f"🚀 Starting Market Price Prediction API on http://localhost:{port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
