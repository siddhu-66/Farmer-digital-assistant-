"""
app.py — AgriSmart ML Flask API
================================
Endpoint:  POST /predict
Input  :   { cropName, moisture, size, colorScore,
             freshnessDays, damagePercent, marketDemand,
             marketPrice (optional, ₹) }
Output :   { quality: "High", predictedPrice: 2200, finalPrice: 2350 }

Run:
    python app.py
    (runs on http://localhost:5001)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd

app = Flask(__name__)
CORS(app)   # Allow requests from React frontend & Node.js backend

# ── Load Trained Models ───────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

try:
    quality_model = joblib.load(os.path.join(MODEL_DIR, 'quality_model.pkl'))
    price_model   = joblib.load(os.path.join(MODEL_DIR, 'price_model.pkl'))
    encoders      = joblib.load(os.path.join(MODEL_DIR, 'encoders.pkl'))
    print("✅ Models loaded successfully")
except FileNotFoundError:
    print("⚠️  Models not found. Run train_model.py first!")
    quality_model = price_model = encoders = None


def safe_encode(encoder, value, fallback=0):
    """Encode a categorical value; return fallback if unseen."""
    try:
        return int(encoder.transform([str(value)])[0])
    except ValueError:
        # Unknown category — use median class (fallback)
        return fallback


# ── Health Check ─────────────────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "ok",
        "service": "AgriSmart ML API",
        "models_loaded": quality_model is not None
    })


# ── Main Prediction Endpoint ──────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    if quality_model is None:
        return jsonify({"error": "Models not loaded. Run train_model.py first."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    # ── Validate Required Fields ──────────────────────────────────────────────
    required = ['cropName', 'moisture', 'size', 'colorScore',
                'freshnessDays', 'damagePercent', 'marketDemand']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        # ── Encode Input ──────────────────────────────────────────────────────
        crop_enc    = safe_encode(encoders['crop'],   data['cropName'])
        size_enc    = safe_encode(encoders['size'],   data['size'])
        demand_enc  = safe_encode(encoders['demand'], data['marketDemand'])

        features = pd.DataFrame([{
            'cropName_enc':     crop_enc,
            'moisture':         float(data['moisture']),
            'size_enc':         size_enc,
            'colorScore':       float(data['colorScore']),
            'freshnessDays':    float(data['freshnessDays']),
            'damagePercent':    float(data['damagePercent']),
            'marketDemand_enc': demand_enc,
        }])

        # ── Predict Quality ───────────────────────────────────────────────────
        quality_encoded  = quality_model.predict(features)[0]
        quality_label    = encoders['quality'].inverse_transform([quality_encoded])[0]

        # ── Predict Price ─────────────────────────────────────────────────────
        ml_price = round(float(price_model.predict(features)[0]), 2)

        # ── Combine with Market Price (if provided) ───────────────────────────
        # finalPrice = (ML price + market price) / 2
        market_price = data.get('marketPrice')
        if market_price is not None:
            try:
                final_price = round((ml_price + float(market_price)) / 2, 2)
            except (ValueError, TypeError):
                final_price = ml_price
        else:
            final_price = ml_price

        return jsonify({
            "quality":        quality_label,       # "Low" / "Medium" / "High"
            "predictedPrice": ml_price,             # ML-only price estimate (₹/qtl)
            "finalPrice":     final_price,          # Combined finalPrice
            "marketPrice":    market_price,         # Echo back for transparency
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5001))
    debug = os.environ.get('ML_DEBUG', 'False').lower() == 'true'
    print(f"🚀 Starting AgriSmart ML API on http://localhost:{port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
