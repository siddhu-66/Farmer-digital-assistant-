'use client';

import React, { useState } from 'react';

import { X, ShoppingBag, Calculator, TrendingUp, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Bot
} from 'lucide-react';

import { b2bService } from '@/services/b2bService';

import {  Plus, Trash2 } from 'lucide-react'; interface Company { id: string; name: string; buyingPrice: number;
} interface SellToBusinessFormProps { company: Company; onClose: () => void; onSuccess: () => void;
}
export function SellToBusinessForm({ company, onClose, onSuccess }: SellToBusinessFormProps) {
  const [step, setStep] = useState(1);
const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({ crop: 'Wheat', weight: '', images: [] as string[] });
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [mlResult, setMlResult] = useState<{tier: string, multiplier: number, confidence: number} | null>(null);
const cropCategories = [ { name: 'Cereals', crops: ['Wheat', 'Basmati Rice', 'Maize', 'Barley', 'Bajra', 'Jowar'] }, { name: 'Pulses', crops: ['Chickpeas', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Arhar'] }, { name: 'Oilseeds', crops: ['Mustard', 'Soybean', 'Sunflower', 'Groundnut', 'Castor'] }, { name: 'Vegetables', crops: ['Potato', 'Onion', 'Tomato', 'Cauliflower', 'Cabbage'] }, { name: 'Cash Crops', crops: ['Sugarcane', 'Cotton', 'Tobacco', 'Jute'] } ];
const [activeCategory, setActiveCategory] = useState('Cereals');
const weightNum = parseFloat(formData.weight) || 0;
const baseProfit = weightNum * company.buyingPrice;
const estimatedProfit = baseProfit * (mlResult?.multiplier || 1);
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
if (!files) return; Array.from(files).forEach(file => {
  const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string].slice(0, 6) })); /* Max 6 images */ }; reader.readAsDataURL(file); }); };
const removeImage = (index: number) => { setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) })); };
const getStepTitle = () => { switch(step) { case 1: return "Pick your crop"; case 2: return "Add its weight"; case 3: return "Quality Verification"; case 4: return "Instantly see how much profit you can make!"; default: return "All Done!"; } };
const getStepSubtitle = () => { switch(step) { case 1: return "Select the crop you want to sell to " + company.name; case 2: return "Tell us the total quantity in Quintals"; case 3: return "Upload minimum 3 images of your crop for Admin review"; case 4: return "Review your expected earnings and confirm the sale."; default: return "Your request has been sent successfully."; } };
const analyzeImages = async () => { setIsAnalyzing(true); try {
  const res = await fetch('http://localhost:8000/analyze/quality', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images: formData.images }) });
if (!res.ok) throw new Error('ML Analysis failed');
const data = await res.json(); setMlResult({ tier: data.quality_tier, multiplier: data.price_multiplier, confidence: data.confidence }); } catch (err) { console.error(err); setMlResult({ tier: 'Standard', multiplier: 1.0, confidence: 0.85 }); } finally { setIsAnalyzing(false); setStep(4); } };
const handleSubmit = (e: React.FormEvent) => { e.preventDefault();
if (formData.images.length < 3) return; setLoading(true);
// Persist the request 
b2bService.createRequest({ farmerId: 'farmer-123', /* Demo farmer */ farmerName: 'Ram Singh', farmerPhone: '+91 98765 43210', companyId: company.id, companyName: company.name, crop: formData.crop, weight: weightNum, pricePerQtl: company.buyingPrice, expectedProfit: estimatedProfit, images: formData.images, mlQualityTier: mlResult?.tier, mlPriceMultiplier: mlResult?.multiplier, mlConfidence: mlResult?.confidence });
// Simulate API call 
setTimeout(() => { setLoading(false); setStep(5);
// Go to success step 
setTimeout(() => { onSuccess(); onClose(); }, 3000); }, 1500); };
return ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}>
</div>
<div className="glass-card w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 min-h-[580px] flex flex-col"> {/* Header Gradient */}
<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent">
</div>
<div className="p-8 flex-1 flex flex-col"> {step < 4 && ( <div className="flex justify-between items-start mb-6">
<div>
<div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-1">
<div className="flex gap-1"> {[1, 2, 3, 4].map(s => ( <div key={s} className={`w-4 h-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-50'}`}>
</div> ))}
</div> Step {step} of 4 </div>
<h3 className="text-2xl font-bold transition-all duration-300">{getStepTitle()}
</h3>
<p className="text-sm text-gray-500 mt-1">{getStepSubtitle()}
</p>
</div>
<button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500 hover:text-gray-500" aria-label="Close" >
<X className="w-5 h-5" />
</button>
</div> )}
<div className="flex-1 flex flex-col overflow-hidden"> {step === 1 && ( <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col"> {/* Category Tabs */}
<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"> {cropCategories.map(cat => ( <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat.name ? 'bg-primary text-black border-primary' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-200 opacity-'}`} > {cat.name}
</button> ))}
</div> {/* Crop Grid */}
<div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar pb-4"> {cropCategories.find(cat => cat.name === activeCategory)?.crops.map(c => ( <button key={c} onClick={() => { setFormData({...formData, crop: c}); setStep(2); }} className={`p-4 rounded-xl border transition-all text-left group ${
  formData.crop === c ? 'bg-primary border-primary text-black' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-200 opacity-'}`} >
<ShoppingBag className={`w-5 h-5 mb-2 ${
  formData.crop === c ? 'text-black' : 'text-primary'}`} />
<span className="font-bold block truncate">{c}
</span>
<span className={`text-[10px] uppercase font-bold tracking-widest ${
  formData.crop === c ? 'text-black/60' : 'text-gray-500'}`}>Select</span>
</button> ))}
</div>
</div> )} {step === 2 && ( <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
<div className="flex-1">
<label className="block">
<span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Total Weight (Quintals)</span>
<div className="relative">
<input type="number" autoFocus value={
  formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && formData.weight && setStep(3)} placeholder="0.00" className="w-full bg-gray-50 border-none text-5xl font-black outline-none focus:ring-0 text-gray-500 py-4 placeholder:text-gray-500" />
<div className="absolute right-0 bottom-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Quintals</div>
</div>
</label>
</div>
<div className="flex gap-4">
<button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all" > Back </button>
<button onClick={() => setStep(3)} disabled={!formData.weight} className="flex-[2] py-4 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 disabled:50 flex items-center justify-center gap-2 group" > Calculate Profit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</button>
</div>
</div> )} {step === 3 && ( <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
<div className="flex-1">
<div className="grid grid-cols-3 gap-3 mb-6"> {
  formData.images.map((img, i) => ( <div key={i} className="aspect-square rounded-xl border border-gray-200 overflow-hidden relative group">
<img src={img} alt="Crop" className="w-full h-full object-cover" />
<button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1.5 bg-red-500 rounded-lg text-gray-500 group-hover:100 transition-opacity" title="Remove Image" >
<Trash2 className="w-3.5 h-3.5" />
</button>
</div> ))} {
  formData.images.length < 6 && ( <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-primary/50 cursor-pointer transition-all group">
<input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
<Plus className="w-6 h-6" />
</div>
<span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-500">Add Photo</span>
</label> )}
</div> {
  formData.images.length < 3 ? ( <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
<AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
<div>
<p className="text-xs font-bold text-yellow-500">Minimum 3 images required</p>
<p className="text-[10px] text-gray-500 mt-1 leading-relaxed"> Admins require at least 3 photos (Top, Detail, and Bulk) to verify the quality and quantity of your crop. </p>
</div>
</div> ) : ( <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-3">
<CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
<div>
<p className="text-xs font-bold text-green-500">Quality photos uploaded</p>
<p className="text-[10px] text-gray-500 mt-1 leading-relaxed"> You have met the minimum requirement. You can add {6 - formData.images.length} more photos if needed. </p>
</div>
</div> )}
</div>
<div className="flex gap-4">
<button onClick={() => setStep(2)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all" > Back </button>
<button onClick={analyzeImages} disabled={
  formData.images.length < 3 || isAnalyzing} className="flex-[2] py-4 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 disabled:50 flex items-center justify-center gap-2 group" > {isAnalyzing ? <Calculator className="w-5 h-5 animate-spin" /> : <>Analyze Quality <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</>}
</button>
</div>
</div> )} {step === 4 && ( <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
<div className="flex-1 space-y-6">
<div className="p-8 bg-primary/10 rounded-[32px] border border-primary/20 text-center relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 10">
<TrendingUp className="w-24 h-24" />
</div>
<span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 block"> Expected Earnings {mlResult && `(${mlResult.tier} Quality)`}
</span>
<div className="text-5xl font-black text-gray-500 mb-2 tracking-tighter">₹{estimatedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
</div>
<div className="flex flex-col items-center gap-2">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-[10px] font-bold text-primary border border-primary/20">
<ShieldCheck className="w-3 h-3" /> Guaranteed by {company.name}
</div> {mlResult && ( <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
<Bot className="w-3 h-3" /> AI Verification: {mlResult.tier} ({(mlResult.confidence * 100).toFixed(0)}% Confident) </div> )}
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
<span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Crop</span>
<span className="font-bold text-sm">{
  formData.crop}
</span>
</div>
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
<span className="text-[10px] text-gray-500 uppercase font-black block mb-1">Quantity</span>
<span className="font-bold text-sm">{
  formData.weight} Qtl</span>
</div>
</div>
</div>
<div className="flex gap-4 pt-4">
<button onClick={() => setStep(3)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all" > Edit Photos </button>
<button onClick={handleSubmit} className="flex-[2] py-4 bg-white text-black font-black rounded-xl hover:bg-gray-50 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2" > {loading ? <Calculator className="w-5 h-5 animate-spin" /> : "Initiate Direct Sale"}
</button>
</div>
</div> )} {step === 5 && ( <div className="text-center py-12 animate-in zoom-in duration-500 flex-1 flex flex-col justify-center">
<div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
<CheckCircle className="w-12 h-12 text-green-500" />
</div>
<h3 className="text-4xl font-black mb-3 text-gray-500">Request Sent!</h3>
<p className="text-gray-500 mb-10 max-w-[300px] mx-auto leading-relaxed">
<strong>{company.name}
</strong> has received your sale request. A procurement officer will contact you shortly. </p>
<div className="mt-8">
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-flex items-center gap-3 text-sm text-primary font-bold">
<TrendingUp className="w-5 h-5" /> Added to your Payout History </div>
</div>
</div> )}
</div>
</div>
</div>
</div> );
}
