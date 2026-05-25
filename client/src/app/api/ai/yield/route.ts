// @ts-nocheck
import { NextResponse } from 'next/server';
import { getSatelliteInsights } from '@/lib/satellite';
/** * AI Yield Prediction Service */
export async function POST(request: Request) { try {
  const { cropName, landSize, lat, lon } = await request.json();
// Simulating yield prediction logic
const baseYield = cropName.toLowerCase().includes('wheat') ? 20 : 15;
const weatherImpact = 0.95;
// 5% reduction due to predicted humidity
const safeLandSize = parseFloat(landSize || 1);
const satellite = await getSatelliteInsights(Number(lat || 30.901), Number(lon || 75.8573), cropName);
const ndviBoost = 0.85 + satellite.ndvi * 0.3;
const predictedTotal = (baseYield * safeLandSize) * weatherImpact * ndviBoost;
return NextResponse.json({
  success: true,
  prediction: {
    totalYield: predictedTotal.toFixed(2),
    unit: 'Quintals',
    confidenceInterval: '88-95%',
    harvestWindow: 'April 15 - April 30, 2026',
    riskFactors: ['Late Blight Risk: Moderate', 'Heat Wave: Low'],
    satellite,
  }
}); } catch (error) { console.error('Yield Prediction Error:', error);
return NextResponse.json({ error: 'Failed to predict yield' }, { status: 500 }); }
}
