"use client";

import React, { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { ArrowLeft, PlusCircle, Send, Loader2, CheckCircle } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import { businessService } from '@/services/businessService';
import { businessRegistrationService, BusinessApplication } from "@/services/businessRegistrationService";
import { Lock } from 'lucide-react';

export default function PostContract() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ category: 'grains', qty: '', requirements: '' });
  const [businessApp, setBusinessApp] = useState<BusinessApplication | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      const app = await businessRegistrationService.getBusinessStatus();
      setBusinessApp(app);
      setIsVerifying(false);
    };
    checkStatus();
  }, []);

  const handleSubmit = async () => {
    if (!formData.qty) return alert("Please specify target quantity");
    setLoading(true);
    try {
      const res = await businessService.postContract(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push('/business'), 2000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (businessApp?.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <div className="glass-card p-12 text-center max-w-md border-yellow-500/20 bg-yellow-500/5">
          <Lock className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4 text-yellow-900 italic">Feature Locked 🔒</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            You cannot post procurement contracts until your business account is verified by our compliance team.
          </p>
          <Link href="/business" className="inline-flex items-center gap-2 px-8 py-4 bg-white/50 text-gray-700 font-bold rounded-2xl border border-yellow-100">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
  return ( <div className="min-h-screen flex items-center justify-center p-6">
<div className="glass-card p-12 text-center max-w-md animate-slide-in">
<CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
<h2 className="text-2xl font-bold mb-2">Contract Posted!</h2>
<p className="text-gray-500 mb-8">Your procurement request has been broadcasted to all eligible customers in the region.</p>
<p className="text-xs font-bold uppercase text-primary tracking-widest">Redirecting to Dashboard...</p>
</div>
</div> ); }
return ( <div className="max-w-4xl mx-auto px-6 py-12">
<Link href="/business" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-500 transition-colors mb-8">
<ArrowLeft className="w-4 h-4" /> Back to Salesman Dashboard </Link>
<header className="mb-12">
<h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
<PlusCircle className="w-10 h-10 text-blue-400" /> {t('businessDashboard.actions.post')}
</h1>
<p className="text-xl text-gray-500">{t('businessDashboard.actions.desc')}
</p>
</header>
<div className="glass-card p-8 space-y-8 animate-slide-in">
<div className="grid md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-sm font-medium text-gray-500">Crop Category</label>
<select value={
  formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} title="Select Crop Category" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all" >
<option value="grains">Grains & Cereals</option>
<option value="fruits">Fruits & Vegetables</option>
<option value="oilseeds">Oilseeds</option>
</select>
</div>
<div className="space-y-2">
<label className="text-sm font-medium text-gray-500">Target Quantity (MT)</label>
<input type="number" value={
  formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all" placeholder="e.g., 500" />
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-medium text-gray-500">Minimum Quality Requirements</label>
<textarea value={
  formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all h-32" placeholder="Describe moisture levels, grade, etc." >
</textarea>
</div>
<button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-blue-500 text-gray-500 font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:50" > {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Post Procurement Contract </button>
</div>
</div> ); } 