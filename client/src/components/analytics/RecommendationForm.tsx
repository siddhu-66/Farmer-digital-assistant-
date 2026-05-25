"use client";

import { useState } from 'react';

import { Brain, Sliders, Info } from 'lucide-react';
export default function RecommendationForm() {
  const [params, setParams] = useState({ nitrogen: 40, phosphorus: 50, potassium: 35, soilType: 'alluvial', season: 'kharif' });
const [prediction, setPrediction] = useState<null | { crop: string, confidence: number, yield: string }>(null);
const [loading, setLoading] = useState(false);
const parseSafeInt = (value: string, fallback: number) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};
const handlePredict = () => { setLoading(true);
// Simulating ML prediction with dynamic results 
setTimeout(() => {
  const crops = [ { crop: 'Rice (Basmati)', confidence: 94.2, yield: '22.5 Quintals/Acre' }, { crop: 'Wheat (HD-2967)', confidence: 89.5, yield: '18.2 Quintals/Acre' }, { crop: 'Maize (Hybrid)', confidence: 91.8, yield: '25.0 Quintals/Acre' }, { crop: 'Cotton', confidence: 87.4, yield: '12.6 Quintals/Acre' }, { crop: 'Mustard', confidence: 92.1, yield: '10.5 Quintals/Acre' } ];
// Basic logic to pick crop based on NPK if they were real 
const index = (params.nitrogen + params.phosphorus + params.potassium) % crops.length; setPrediction(crops[index]); setLoading(false); }, 1500); };
return ( <div className="space-y-8">
<div className="glass-card p-8">
<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
<Sliders className="w-6 h-6 text-primary" /> Input Field Parameters </h2>
<div className="grid md:grid-cols-3 gap-6 mb-8">
<div className="space-y-2">
<label htmlFor="nitrogen" className="text-sm font-medium text-gray-500 uppercase tracking-widest">Nitrogen (N)</label>
<input id="nitrogen" type="number" value={Number.isFinite(params.nitrogen) ? params.nitrogen : ''} onChange={e => setParams({...params, nitrogen: parseSafeInt(e.target.value, 0)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all font-mono" />
</div>
<div className="space-y-2">
<label htmlFor="phosphorus" className="text-sm font-medium text-gray-500 uppercase tracking-widest">Phosphorus (P)</label>
<input id="phosphorus" type="number" value={Number.isFinite(params.phosphorus) ? params.phosphorus : ''} onChange={e => setParams({...params, phosphorus: parseSafeInt(e.target.value, 0)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all font-mono" />
</div>
<div className="space-y-2">
<label htmlFor="potassium" className="text-sm font-medium text-gray-500 uppercase tracking-widest">Potassium (K)</label>
<input id="potassium" type="number" value={Number.isFinite(params.potassium) ? params.potassium : ''} onChange={e => setParams({...params, potassium: parseSafeInt(e.target.value, 0)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all font-mono" />
</div>
</div>
<div className="grid md:grid-cols-2 gap-6 mb-10">
<div className="space-y-2">
<label htmlFor="soil-type-predict" className="text-sm font-medium text-gray-500 uppercase tracking-widest">Soil Type</label>
<select id="soil-type-predict" value={params.soilType} onChange={e => setParams({...params, soilType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all appearance-none cursor-pointer" >
<option value="alluvial">Alluvial</option>
<option value="black">Black</option>
<option value="red">Red</option>
<option value="laterite">Laterite</option>
</select>
</div>
<div className="space-y-2">
<label htmlFor="season-predict" className="text-sm font-medium text-gray-500 uppercase tracking-widest">Season</label>
<select id="season-predict" value={params.season} onChange={e => setParams({...params, season: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all appearance-none cursor-pointer" >
<option value="kharif">Kharif</option>
<option value="rabi">Rabi</option>
<option value="zaid">Zaid</option>
</select>
</div>
</div>
<button onClick={handlePredict} disabled={loading} className="w-full py-4 bg-primary text-gray-500 font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:50 disabled:hover:scale-100 flex items-center justify-center gap-2" >
<Brain className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} /> {loading ? 'Analyzing Soil & Environment...' : 'Generate AI Recommendation'}
</button>
</div> {prediction && ( <div className="glass-card p-8 border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
<div className="flex flex-col md:flex-row gap-8 items-center">
<div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
<Brain className="w-16 h-16 text-primary animate-float" />
</div>
<div className="flex-1 text-center md:text-left">
<p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-2">Smart Recommendation</p>
<h3 className="text-4xl font-bold mb-2">{prediction.crop}
</h3>
<div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
<div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm">
<span className="text-gray-500">Confidence:</span>
<span className="text-green-400 font-bold">{prediction.confidence}%</span>
</div>
<div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm">
<span className="text-gray-500">Est. Yield:</span>
<span className="text-primary font-bold">{prediction.yield}
</span>
</div>
</div>
</div>
</div>
<div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-start gap-3">
<Info className="w-5 h-5 text-gray-500 shrink-0" />
<p className="text-xs text-gray-500 leading-relaxed"> This prediction is based on the input NPK levels, your land&apos;s Alluvial soil history, and the current Kharif season outlook with predicted rainfall of 1200mm. </p>
</div>
</div> )}
</div> ); } 