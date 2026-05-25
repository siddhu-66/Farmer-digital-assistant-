from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import random
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    soil_data: list
    weather_data: list

class ImageAnalysisRequest(BaseModel):
    images: list

@app.get("/")
async def root():
    return {"message": "Farmer Assistant ML Server v1.0.0"}

@app.post("/predict/yield")
async def predict_yield(request: PredictionRequest):
    try:
        # Simulation of Model Inference
        # model = torch.load("model.pth")
        # prediction = model(torch.tensor(request.soil_data))
        
        mock_yield = np.mean(request.soil_data) * 0.85 
        return {
            "predicted_yield": round(mock_yield, 2),
            "unit": "tonnes/acre",
            "confidence": 0.94
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/crops")
async def recommend_crops(request: PredictionRequest):
    # Logic for multi-factor crop recommendation
    return {
        "recommendations": [
            {"crop": "Wheat", "probability": 0.89},
            {"crop": "Mustard", "probability": 0.11}
        ]
    }

@app.post("/analyze/quality")
async def analyze_quality(request: ImageAnalysisRequest):
    if not request.images:
        raise HTTPException(status_code=400, detail="No images provided")
        
    # Simulate processing time for the ML computer vision model
    await asyncio.sleep(1.5)
    
    # Simulated model output weighted towards high quality
    tiers = [
        {"tier": "Premium", "multiplier": 1.15, "confidence": round(random.uniform(0.9, 0.99), 2)},
        {"tier": "Standard", "multiplier": 1.0, "confidence": round(random.uniform(0.8, 0.9), 2)},
        {"tier": "Subpar", "multiplier": 0.85, "confidence": round(random.uniform(0.7, 0.85), 2)}
    ]
    
    selection = random.choices(tiers, weights=[70, 20, 10])[0]
    
    return {
        "status": "success",
        "quality_tier": selection["tier"],
        "price_multiplier": selection["multiplier"],
        "confidence": selection["confidence"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
