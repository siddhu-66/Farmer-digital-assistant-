"""
train_market_price_model.py — Market Price Prediction Model Trainer
=====================================================================
Trains a RandomForestRegressor to predict modal price based on:
  - commodity, state, district, market, min_price, max_price, month

Run:
    python train_market_price_model.py

Output file:
    models/market_price_model.pkl
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# ── 1. Create Sample Training Data ─────────────────────────────────────────────
# In production, this would be loaded from data.gov.in API or a CSV file
# For now, we'll create sample data based on market price structure

sample_data = [
    # Wheat
    {'commodity': 'Wheat', 'state': 'Delhi', 'district': 'Delhi', 'market': 'Azadpur Mandi', 'min_price': 2150, 'max_price': 2350, 'month': 1, 'modal_price': 2250},
    {'commodity': 'Wheat', 'state': 'Haryana', 'district': 'Karnal', 'market': 'Karnal Mandi', 'min_price': 2200, 'max_price': 2400, 'month': 2, 'modal_price': 2300},
    {'commodity': 'Wheat', 'state': 'Punjab', 'district': 'Ludhiana', 'market': 'Ludhiana Mandi', 'min_price': 2180, 'max_price': 2380, 'month': 3, 'modal_price': 2280},
    {'commodity': 'Wheat', 'state': 'Uttar Pradesh', 'district': 'Agra', 'market': 'Agra Mandi', 'min_price': 2100, 'max_price': 2300, 'month': 4, 'modal_price': 2200},
    {'commodity': 'Wheat', 'state': 'Maharashtra', 'district': 'Nagpur', 'market': 'Nagpur Mandi', 'min_price': 2250, 'max_price': 2450, 'month': 5, 'modal_price': 2350},
    
    # Rice (Basmati)
    {'commodity': 'Rice (Basmati)', 'state': 'Haryana', 'district': 'Karnal', 'market': 'Karnal Mandi', 'min_price': 3200, 'max_price': 3600, 'month': 1, 'modal_price': 3400},
    {'commodity': 'Rice (Basmati)', 'state': 'Punjab', 'district': 'Amritsar', 'market': 'Amritsar Mandi', 'min_price': 3300, 'max_price': 3700, 'month': 2, 'modal_price': 3500},
    {'commodity': 'Rice (Basmati)', 'state': 'Delhi', 'district': 'Delhi', 'market': 'Azadpur Mandi', 'min_price': 3250, 'max_price': 3650, 'month': 3, 'modal_price': 3450},
    {'commodity': 'Rice (Basmati)', 'state': 'Uttar Pradesh', 'district': 'Lucknow', 'market': 'Lucknow Mandi', 'min_price': 3150, 'max_price': 3550, 'month': 4, 'modal_price': 3350},
    {'commodity': 'Rice (Basmati)', 'state': 'Haryana', 'district': 'Panipat', 'market': 'Panipat Mandi', 'min_price': 3180, 'max_price': 3580, 'month': 5, 'modal_price': 3380},
    
    # Cotton
    {'commodity': 'Cotton', 'state': 'Gujarat', 'district': 'Rajkot', 'market': 'Rajkot Mandi', 'min_price': 6800, 'max_price': 7200, 'month': 1, 'modal_price': 7000},
    {'commodity': 'Cotton', 'state': 'Maharashtra', 'district': 'Nagpur', 'market': 'Nagpur Mandi', 'min_price': 6700, 'max_price': 7100, 'month': 2, 'modal_price': 6900},
    {'commodity': 'Cotton', 'state': 'Gujarat', 'district': 'Junagadh', 'market': 'Junagadh Mandi', 'min_price': 6750, 'max_price': 7150, 'month': 3, 'modal_price': 6950},
    {'commodity': 'Cotton', 'state': 'Madhya Pradesh', 'district': 'Indore', 'market': 'Indore Mandi', 'min_price': 6650, 'max_price': 7050, 'month': 4, 'modal_price': 6850},
    {'commodity': 'Cotton', 'state': 'Gujarat', 'district': 'Ahmedabad', 'market': 'Ahmedabad Mandi', 'min_price': 6850, 'max_price': 7250, 'month': 5, 'modal_price': 7050},
    
    # Maize
    {'commodity': 'Maize', 'state': 'Maharashtra', 'district': 'Nashik', 'market': 'Nashik Mandi', 'min_price': 1800, 'max_price': 2100, 'month': 1, 'modal_price': 1950},
    {'commodity': 'Maize', 'state': 'Karnataka', 'district': 'Belgaum', 'market': 'Belgaum Mandi', 'min_price': 1750, 'max_price': 2050, 'month': 2, 'modal_price': 1900},
    {'commodity': 'Maize', 'state': 'Uttar Pradesh', 'district': 'Kanpur', 'market': 'Kanpur Mandi', 'min_price': 1780, 'max_price': 2080, 'month': 3, 'modal_price': 1930},
    {'commodity': 'Maize', 'state': 'Bihar', 'district': 'Patna', 'market': 'Patna Mandi', 'min_price': 1720, 'max_price': 2020, 'month': 4, 'modal_price': 1870},
    {'commodity': 'Maize', 'state': 'Maharashtra', 'district': 'Pune', 'market': 'Pune Mandi', 'min_price': 1820, 'max_price': 2120, 'month': 5, 'modal_price': 1970},
    
    # Tomato
    {'commodity': 'Tomato', 'state': 'Karnataka', 'district': 'Kolar', 'market': 'Kolar Mandi', 'min_price': 1200, 'max_price': 1500, 'month': 1, 'modal_price': 1350},
    {'commodity': 'Tomato', 'state': 'Maharashtra', 'district': 'Nashik', 'market': 'Nashik Mandi', 'min_price': 1150, 'max_price': 1450, 'month': 2, 'modal_price': 1300},
    {'commodity': 'Tomato', 'state': 'Andhra Pradesh', 'district': 'Guntur', 'market': 'Guntur Mandi', 'min_price': 1250, 'max_price': 1550, 'month': 3, 'modal_price': 1400},
    {'commodity': 'Tomato', 'state': 'Tamil Nadu', 'district': 'Coimbatore', 'market': 'Coimbatore Mandi', 'min_price': 1180, 'max_price': 1480, 'month': 4, 'modal_price': 1330},
    {'commodity': 'Tomato', 'state': 'Karnataka', 'district': 'Bangalore', 'market': 'Bangalore Mandi', 'min_price': 1220, 'max_price': 1520, 'month': 5, 'modal_price': 1370},
    
    # Onion
    {'commodity': 'Onion', 'state': 'Maharashtra', 'district': 'Nashik', 'market': 'Lasalgaon Mandi', 'min_price': 800, 'max_price': 1200, 'month': 1, 'modal_price': 1000},
    {'commodity': 'Onion', 'state': 'Maharashtra', 'district': 'Pune', 'market': 'Pune Mandi', 'min_price': 850, 'max_price': 1250, 'month': 2, 'modal_price': 1050},
    {'commodity': 'Onion', 'state': 'Karnataka', 'district': 'Hubli', 'market': 'Hubli Mandi', 'min_price': 820, 'max_price': 1220, 'month': 3, 'modal_price': 1020},
    {'commodity': 'Onion', 'state': 'Madhya Pradesh', 'district': 'Indore', 'market': 'Indore Mandi', 'min_price': 780, 'max_price': 1180, 'month': 4, 'modal_price': 980},
    {'commodity': 'Onion', 'state': 'Maharashtra', 'district': 'Nagpur', 'market': 'Nagpur Mandi', 'min_price': 830, 'max_price': 1230, 'month': 5, 'modal_price': 1030},
    
    # Potato
    {'commodity': 'Potato', 'state': 'Uttar Pradesh', 'district': 'Agra', 'market': 'Agra Mandi', 'min_price': 600, 'max_price': 900, 'month': 1, 'modal_price': 750},
    {'commodity': 'Potato', 'state': 'Punjab', 'district': 'Jalandhar', 'market': 'Jalandhar Mandi', 'min_price': 620, 'max_price': 920, 'month': 2, 'modal_price': 770},
    {'commodity': 'Potato', 'state': 'West Bengal', 'district': 'Hooghly', 'market': 'Hooghly Mandi', 'min_price': 580, 'max_price': 880, 'month': 3, 'modal_price': 730},
    {'commodity': 'Potato', 'state': 'Uttar Pradesh', 'district': 'Farrukhabad', 'market': 'Farrukhabad Mandi', 'min_price': 610, 'max_price': 910, 'month': 4, 'modal_price': 760},
    {'commodity': 'Potato', 'state': 'Bihar', 'district': 'Patna', 'market': 'Patna Mandi', 'min_price': 590, 'max_price': 890, 'month': 5, 'modal_price': 740},
]

# Add more variations by perturbing the data
augmented_data = []
for item in sample_data:
    for i in range(5):  # Create 5 variations per item
        variation = item.copy()
        variation['min_price'] = int(item['min_price'] + np.random.randint(-50, 50))
        variation['max_price'] = int(item['max_price'] + np.random.randint(-50, 50))
        variation['modal_price'] = int(item['modal_price'] + np.random.randint(-30, 30))
        variation['month'] = (item['month'] + i) % 12 + 1
        augmented_data.append(variation)

df = pd.DataFrame(augmented_data)
print(f"📂 Created training dataset with {len(df)} records")
print(df.head())

# ── 2. Encode Categorical Columns ────────────────────────────────────────────
commodity_encoder = LabelEncoder()
state_encoder = LabelEncoder()
district_encoder = LabelEncoder()
market_encoder = LabelEncoder()

df['commodity_enc'] = commodity_encoder.fit_transform(df['commodity'])
df['state_enc'] = state_encoder.fit_transform(df['state'])
df['district_enc'] = district_encoder.fit_transform(df['district'])
df['market_enc'] = market_encoder.fit_transform(df['market'])

print("\n🏷  Commodity label mapping:", dict(zip(commodity_encoder.classes_, commodity_encoder.transform(commodity_encoder.classes_))))
print("🏷  State label mapping:", dict(zip(state_encoder.classes_, state_encoder.transform(state_encoder.classes_))))

# ── 3. Define Features & Target ───────────────────────────────────────────────
FEATURE_COLS = ['commodity_enc', 'state_enc', 'district_enc', 'market_enc', 'min_price', 'max_price', 'month']

X = df[FEATURE_COLS]
y = df['modal_price']

# ── 4. Split Data ─────────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\n📊 Train size: {len(X_train)}, Test size: {len(X_test)}")

# ── 5. Train Model ───────────────────────────────────────────────────────────
print("\n🌲 Training Market Price Model (RandomForestRegressor)...")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    min_samples_split=5
)
model.fit(X_train, y_train)

# ── 6. Evaluate Model ───────────────────────────────────────────────────────
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"   ✅ Mean Absolute Error: ₹{mae:.2f}")
print(f"   ✅ Mean Squared Error: ₹{mse:.2f}")
print(f"   ✅ R² Score: {r2:.4f}")

# ── 7. Save Model & Encoders ─────────────────────────────────────────────────
os.makedirs('models', exist_ok=True)

encoders = {
    'commodity': commodity_encoder,
    'state': state_encoder,
    'district': district_encoder,
    'market': market_encoder,
}

joblib.dump(model, 'models/market_price_model.pkl')
joblib.dump(encoders, 'models/market_price_encoders.pkl')

print("\n✅ Model saved to models/market_price_model.pkl")
print("✅ Encoders saved to models/market_price_encoders.pkl")

# ── 8. Quick Sanity Test ─────────────────────────────────────────────────────
print("\n🧪 Quick sanity test — predicting modal price for Wheat in Delhi:")
sample = pd.DataFrame([{
    'commodity_enc': commodity_encoder.transform(['Wheat'])[0],
    'state_enc': state_encoder.transform(['Delhi'])[0],
    'district_enc': district_encoder.transform(['Delhi'])[0],
    'market_enc': market_encoder.transform(['Azadpur Mandi'])[0],
    'min_price': 2150,
    'max_price': 2350,
    'month': 6
}])
prediction = model.predict(sample)[0]
print(f"   Predicted Modal Price: ₹{prediction:.2f}")
print("\n🎉 Training complete!")
