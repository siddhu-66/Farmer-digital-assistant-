"""
train_model.py — AgriSmart ML Model Trainer
============================================
Trains two models:
  1. RandomForestClassifier → predicts quality (Low / Medium / High)
  2. RandomForestRegressor  → predicts selling price (in ₹/qtl)

Run:
    python train_model.py

Output files:
    models/quality_model.pkl
    models/price_model.pkl
    models/label_encoder.pkl
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib

# ── 1. Load Dataset ──────────────────────────────────────────────────────────
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'crop_quality_dataset.csv')

print("📂 Loading dataset...")
df = pd.read_csv(CSV_PATH)
print(f"   ✅ Loaded {len(df)} records")
print(df.head())

# ── 2. Encode Categorical Columns ────────────────────────────────────────────
# We encode: cropName, size, marketDemand (input features) + quality (target)

crop_encoder    = LabelEncoder()
size_encoder    = LabelEncoder()
demand_encoder  = LabelEncoder()
quality_encoder = LabelEncoder()

df['cropName_enc']     = crop_encoder.fit_transform(df['cropName'])
df['size_enc']         = size_encoder.fit_transform(df['size'])
df['marketDemand_enc'] = demand_encoder.fit_transform(df['marketDemand'])
df['quality_enc']      = quality_encoder.fit_transform(df['quality'])

print("\n🏷  Quality label mapping:", dict(zip(quality_encoder.classes_, quality_encoder.transform(quality_encoder.classes_))))
print("🌾 Crop label mapping:", dict(zip(crop_encoder.classes_, crop_encoder.transform(crop_encoder.classes_))))

# ── 3. Define Features & Targets ─────────────────────────────────────────────
FEATURE_COLS = ['cropName_enc', 'moisture', 'size_enc', 'colorScore',
                'freshnessDays', 'damagePercent', 'marketDemand_enc']

X = df[FEATURE_COLS]
y_quality = df['quality_enc']   # Classification target
y_price   = df['price']         # Regression target

# ── 4. Split Data ─────────────────────────────────────────────────────────────
X_train, X_test, yq_train, yq_test, yp_train, yp_test = train_test_split(
    X, y_quality, y_price, test_size=0.2, random_state=42
)

print(f"\n📊 Train size: {len(X_train)}, Test size: {len(X_test)}")

# ── 5. Train Quality Classifier ───────────────────────────────────────────────
print("\n🌲 Training Quality Classifier (RandomForestClassifier)...")
quality_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=8,
    random_state=42,
    class_weight='balanced'
)
quality_model.fit(X_train, yq_train)
q_pred = quality_model.predict(X_test)
q_acc  = accuracy_score(yq_test, q_pred)
print(f"   ✅ Quality Model Accuracy: {q_acc * 100:.1f}%")

# ── 6. Train Price Regressor ──────────────────────────────────────────────────
print("\n💰 Training Price Regressor (RandomForestRegressor)...")
price_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=8,
    random_state=42
)
price_model.fit(X_train, yp_train)
p_pred = price_model.predict(X_test)
p_mae  = mean_absolute_error(yp_test, p_pred)
print(f"   ✅ Price Model MAE: ₹{p_mae:.0f}")

# ── 7. Save Models & Encoders ─────────────────────────────────────────────────
os.makedirs('models', exist_ok=True)

# Save individual encoders along with their class mappings for the API
encoders = {
    'crop':    crop_encoder,
    'size':    size_encoder,
    'demand':  demand_encoder,
    'quality': quality_encoder,
}

joblib.dump(quality_model, 'models/quality_model.pkl')
joblib.dump(price_model,   'models/price_model.pkl')
joblib.dump(encoders,      'models/encoders.pkl')

print("\n✅ Models saved to models/ folder:")
print("   → models/quality_model.pkl")
print("   → models/price_model.pkl")
print("   → models/encoders.pkl")

# ── 8. Quick Sanity Test ──────────────────────────────────────────────────────
print("\n🧪 Quick sanity test — predicting for a sample Wheat crop:")
sample = pd.DataFrame([{
    'cropName_enc':     crop_encoder.transform(['Wheat'])[0],
    'moisture':         12,
    'size_enc':         size_encoder.transform(['Large'])[0],
    'colorScore':       9,
    'freshnessDays':    2,
    'damagePercent':    1,
    'marketDemand_enc': demand_encoder.transform(['High'])[0],
}])
q_encoded = quality_model.predict(sample)[0]
q_label   = quality_encoder.inverse_transform([q_encoded])[0]
p_est     = price_model.predict(sample)[0]
print(f"   Quality: {q_label}")
print(f"   Price:   ₹{p_est:.0f}")
print("\n🎉 Training complete!")
