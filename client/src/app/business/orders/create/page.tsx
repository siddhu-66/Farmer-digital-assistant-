"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { orderService, CROP_LIST, OrderUnit } from '@/services/orderService';
import { PackagePlus, ChevronDown, MapPin, Calendar, User, FileText, IndianRupee, Weight, Wheat, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    cropName: '',
    quantity: '',
    unit: 'quintal' as OrderUnit,
    expectedPrice: '',
    deliveryLocation: '',
    requiredDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    if (!form.cropName) e.cropName = 'Please select a crop';
    if (!form.quantity.trim()) e.quantity = 'Quantity is required';
    else if (isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) e.quantity = 'Quantity must be a positive number';
    if (!form.deliveryLocation.trim()) e.deliveryLocation = 'Delivery location is required';
    if (!form.requiredDate) e.requiredDate = 'Required date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : {};
      
      await orderService.createOrder({
        salesman: user._id || user.id,
        salesmanName: user.name || 'Salesman',
        ...form,
        quantity: Number(form.quantity) || 0,
        expectedPrice: form.expectedPrice ? Number(form.expectedPrice) : undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push('/business/orders'), 2000);
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted flex items-center justify-center p-8">
          <div className="text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-200">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black mb-3">Order Submitted!</h2>
            <p className="text-gray-500 text-lg mb-2">Waiting for admin verification ⏳</p>
            <p className="text-sm text-gray-400">Redirecting to your orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <div className="max-w-2xl mx-auto">
          <Link href="/business/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <PackagePlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Create New Order</h1>
                <p className="text-gray-500 text-sm">Fill in the customer demand details below</p>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Customer Details
              </h2>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Customer Name *</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={e => set('customerName', e.target.value)}
                  placeholder="e.g. Ramesh Traders Pvt. Ltd."
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.customerName ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
            </div>

            {/* Crop Details */}
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Wheat className="w-5 h-5 text-green-500" /> Crop & Quantity
              </h2>
              <div>
                <label htmlFor="cropName" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Crop Name *</label>
                <div className="relative">
                  <select
                    id="cropName"
                    title="Crop Name"
                    value={form.cropName}
                    onChange={e => set('cropName', e.target.value)}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all cursor-pointer ${errors.cropName ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <option value="">Select a crop...</option>
                    {CROP_LIST.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Quantity Required *</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={e => set('quantity', e.target.value)}
                      placeholder="e.g. 500"
                      className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.quantity ? 'border-red-400' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                <div className="w-36">
                  <label htmlFor="unit" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Unit</label>
                  <div className="relative">
                    <select
                      id="unit"
                      title="Unit"
                      value={form.unit}
                      onChange={e => set('unit', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Expected Price per Unit (₹) <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={form.expectedPrice}
                    onChange={e => set('expectedPrice', e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery & Timeline */}
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> Delivery & Timeline
              </h2>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Delivery Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.deliveryLocation}
                    onChange={e => set('deliveryLocation', e.target.value)}
                    placeholder="e.g. Nagpur Cold Storage, Maharashtra"
                    className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.deliveryLocation ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors.deliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.deliveryLocation}</p>}
              </div>
              <div>
                <label htmlFor="requiredDate" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Required By Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="requiredDate"
                    type="date"
                    title="Required By Date"
                    value={form.requiredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('requiredDate', e.target.value)}
                    className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${errors.requiredDate ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors.requiredDate && <p className="text-red-500 text-xs mt-1">{errors.requiredDate}</p>}
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Additional Notes <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    placeholder="Any special requirements, quality specs, packaging needs..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <PackagePlus className="w-5 h-5" />
              )}
              {loading ? 'Submitting...' : 'Submit Order for Approval'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
