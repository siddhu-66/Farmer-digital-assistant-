'use client';

import React, { useState } from 'react';

import { X, Plus, Tag } from 'lucide-react';

import { cropService } from '@/services/cropService'; interface AddCropFormProps { onClose: () => void; onSuccess: () => void;
}
export const AddCropForm: React.FC<AddCropFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ 
    cropName: '', 
    category: 'Other',
    season: 'All Season',
    description: '',
    basePrice: 0,
    unit: 'quintal',
    imageUrl: ''
  });
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsSubmitting(true); setError(null); try {
  await cropService.createCrop(formData);
  onSuccess(); onClose(); 
} catch (err: unknown) { setError('An error occurred while adding the crop.'); console.error(err); } finally { setIsSubmitting(false); } };
return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
<div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
<div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
<h2 className="text-xl font-bold text-slate-900 dark:text-gray-500 flex items-center gap-2">
<Plus className="w-6 h-6 text-emerald-600" /> Add New Crop </h2>
<button onClick={onClose} title="Close" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
<X className="w-5 h-5 text-slate-500" />
</button>
</div>
<form onSubmit={handleSubmit} className="p-6 space-y-4"> {error && ( <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"> {error}
</div> )}
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
<Tag className="w-4 h-4" /> Crop Name </label>
<input type="text" required placeholder="e.g. Wheat" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" value={
  formData.cropName} onChange={(e) => setFormData({ ...formData, cropName: e.target.value })} />
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
<select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
<option value="Cereals">Cereals</option>
<option value="Pulses">Pulses</option>
<option value="Oilseeds">Oilseeds</option>
<option value="Vegetables">Vegetables</option>
<option value="Fruits">Fruits</option>
<option value="Cash Crops">Cash Crops</option>
<option value="Spices">Spices</option>
<option value="Other">Other</option>
</select>
</div>
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Season</label>
<select value={formData.season} onChange={(e) => setFormData({ ...formData, season: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
<option value="Kharif">Kharif</option>
<option value="Rabi">Rabi</option>
<option value="Zaid">Zaid</option>
<option value="All Season">All Season</option>
</select>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Price (₹)</label>
<input type="number" required min="0" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
</div>
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Unit</label>
<select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
<option value="kg">kg</option>
<option value="quintal">quintal</option>
<option value="ton">ton</option>
<option value="bushel">bushel</option>
</select>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
<textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
</div>
<div className="pt-4 flex gap-3">
<button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" > Cancel </button>
<button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-gray-500 font-bold hover:bg-emerald-700 transition-all disabled:50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20" > {isSubmitting ? 'Adding...' : 'Add Crop'}
</button>
</div>
</form>
</div>
</div> );
};
