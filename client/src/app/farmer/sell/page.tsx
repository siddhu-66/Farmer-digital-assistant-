"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { sellRequestService } from '@/services/sellRequestService';

export default function SellCropFormPage() {
  const router = useRouter();
  const { role } = useAuth();

  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [expectedPrice, setExpectedPrice] = useState<string>('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG/PNG images are allowed');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const q = Number(quantity);
    const p = Number(expectedPrice);
    if (!cropName.trim() || !Number.isFinite(q) || q <= 0 || !Number.isFinite(p) || p < 0 || !location.trim()) {
      setError('Please fill crop name, quantity, expected price, and location.');
      return;
    }

    setSubmitting(true);
    try {
      await sellRequestService.createSellRequest({
        cropName: cropName.trim(),
        quantity: q,
        expectedPrice: p,
        location: location.trim(),
        description: description.trim() || undefined,
        image: image || undefined,
      });

      router.push('/farmer/requests');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit sell request');
    } finally {
      setSubmitting(false);
    }
  };

  if (role && role !== 'farmer') return null;

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-black mb-2">Sell Crop Request</h1>
          <p className="text-gray-500">Submit your expected price and details for admin verification.</p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-3xl glass-card p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm font-bold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Crop Name</span>
              <input
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                placeholder="e.g., Wheat (PBW 343)"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                placeholder="e.g., Ludhiana, Punjab"
              />
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Quantity (Qtl)</span>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                placeholder="e.g., 25"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Expected Price (₹)</span>
              <input
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                placeholder="e.g., 2800"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Quality / Details</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20 min-h-[120px]"
              placeholder="Add any details that help admin verify your request (quality grade, storage, etc.)"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="p-4 rounded-2xl border border-gray-200 bg-white/60">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Optional Image</p>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold transition-all">
                  <ImageIcon className="w-4 h-4" />
                  Upload JPG/PNG
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
                {image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-[12px] text-gray-500 mt-3">
                Tip: Send a small image if your request fails due to upload size limits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">What happens next?</p>
                  <ul className="mt-2 text-gray-600 text-sm space-y-1">
                    <li>Admin will review and verify your request.</li>
                    <li>On approval, it will be forwarded to a business.</li>
                    <li>Business can accept or reject it.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting...' : 'Submit Request'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </main>
    </div>
  );
}

