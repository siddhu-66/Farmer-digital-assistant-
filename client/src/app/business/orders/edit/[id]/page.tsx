"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { orderService, Order, CROP_LIST, OrderUnit } from '@/services/orderService';
import { Edit, CheckCircle, ArrowLeft, ChevronDown, MapPin, Calendar, Weight, IndianRupee, Wheat, FileText, User } from 'lucide-react';
import Link from 'next/link';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
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

  useEffect(() => {
    const fetchOrder = async () => {
      const allOrders = await orderService.getOrders();
      const found = allOrders.find(o => o.id === orderId);
      if (found) {
        setOrder(found);
        setForm({
          customerName: found.customerName || '',
          cropName: found.cropName || '',
          quantity: String(found.quantity || ''),
          unit: found.unit || 'quintal',
          expectedPrice: String(found.expectedPrice || ''),
          deliveryLocation: found.deliveryLocation || '',
          requiredDate: found.requiredDate || '',
          notes: found.notes || '',
        });
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !orderId) return;
    setLoading(true);
    setTimeout(() => {
      orderService.resubmitOrder(orderId, {
        ...form,
        quantity: Number(form.quantity) || 0,
        expectedPrice: form.expectedPrice ? Number(form.expectedPrice) : undefined,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/business/orders'), 2000);
    }, 800);
  };

  if (!order) {
    return (
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted flex items-center justify-center">
          <p className="text-gray-500">Order not found.</p>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted flex items-center justify-center p-8">
          <div className="text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-200">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black mb-2">Order Resubmitted!</h2>
            <p className="text-gray-500">Your updated order is awaiting admin approval ⏳</p>
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

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <p className="text-sm font-bold text-red-700 mb-1">Previous Rejection Reason</p>
            <p className="text-sm text-red-600">{order.rejectionReason}</p>
          </div>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Edit & Resubmit</h1>
                <p className="text-gray-500 text-sm">{order.id} — Update your order and resubmit for admin approval</p>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Customer Details
              </h2>
              <div>
                <label htmlFor="customerName" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Customer Name *</label>
                <input id="customerName" type="text" value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="e.g. Ramesh Traders" className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all ${errors.customerName ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
            </div>

            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Wheat className="w-5 h-5 text-green-500" /> Crop & Quantity
              </h2>
              <div>
                <label htmlFor="cropName" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Crop Name *</label>
                <div className="relative">
                  <select id="cropName" title="Crop Name" value={form.cropName} onChange={e => set('cropName', e.target.value)} className={`w-full bg-gray-50 border rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer ${errors.cropName ? 'border-red-400' : 'border-gray-200'}`}>
                    <option value="">Select a crop...</option>
                    {CROP_LIST.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="quantity" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Quantity *</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="quantity" type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 500" className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.quantity ? 'border-red-400' : 'border-gray-200'}`} />
                  </div>
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                <div className="w-36">
                  <label htmlFor="unit" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Unit</label>
                  <div className="relative">
                    <select id="unit" title="Unit" value={form.unit} onChange={e => set('unit', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer">
                      <option value="kg">kg</option>
                      <option value="quintal">Quintal</option>
                      <option value="ton">Ton</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="expectedPrice" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Expected Price (₹) <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="expectedPrice" type="number" min="0" value={form.expectedPrice} onChange={e => set('expectedPrice', e.target.value)} placeholder="e.g. 2500" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-5">
              <h2 className="font-black text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> Delivery & Timeline
              </h2>
              <div>
                <label htmlFor="deliveryLocation" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Delivery Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="deliveryLocation" type="text" value={form.deliveryLocation} onChange={e => set('deliveryLocation', e.target.value)} placeholder="e.g. Nagpur Cold Storage" className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.deliveryLocation ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                {errors.deliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.deliveryLocation}</p>}
              </div>
              <div>
                <label htmlFor="requiredDate" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Required By Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="requiredDate" type="date" value={form.requiredDate} min={new Date().toISOString().split('T')[0]} onChange={e => set('requiredDate', e.target.value)} className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.requiredDate ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                {errors.requiredDate && <p className="text-red-500 text-xs mt-1">{errors.requiredDate}</p>}
              </div>
              <div>
                <label htmlFor="notes" className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">Notes <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea id="notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Updated requirements..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 text-lg">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Edit className="w-5 h-5" />}
              {loading ? 'Resubmitting...' : 'Resubmit for Approval'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
