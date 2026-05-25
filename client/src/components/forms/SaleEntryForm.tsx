'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Landmark, Scale, IndianRupee } from 'lucide-react';
import { sellRequestService } from '@/services/sellRequestService';

interface SaleEntryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const SaleEntryForm: React.FC<SaleEntryFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantityKg: '',
    pricePerQtl: '',
    mandiName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    

    try {
      await sellRequestService.createSellRequest({
        cropName: formData.cropName,
        quantity: Number(formData.quantityKg),
        expectedPrice: Number(formData.pricePerQtl),
        location: formData.mandiName,
        description: 'New standard market sale entry',
      });
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(`[Frontend] Sale Submit Error:`, err);
      setError('Failed to record sale. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/20">
          <h2 className="text-xl font-bold text-slate-900 dark:text-gray-500 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" /> Record New Sale
          </h2>
          <button onClick={onClose} title="Close" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Crop Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wheat"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Quantity (in Kilograms)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 5000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.quantityKg}
              onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" /> Price per Quintal (INR)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 2125"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.pricePerQtl}
              onChange={(e) => setFormData({ ...formData, pricePerQtl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Landmark className="w-4 h-4" /> Mandi / Market Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Khanna Mandi"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.mandiName}
              onChange={(e) => setFormData({ ...formData, mandiName: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? 'Recording...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
