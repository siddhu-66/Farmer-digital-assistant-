"use client";

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { businessRegistrationService, BusinessApplication } from '@/services/businessRegistrationService';

import Sidebar from '@/components/layout/Sidebar';

import {  XCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BusinessApplication | null | 'loading'>('loading');
const router = useRouter(); useEffect(() => {
// Check local storage / mock backend for business status
const checkAuth = async () => {
  const data = await businessRegistrationService.getBusinessStatus();
if (!data) {
  // Not registered as a business yet
router.push('/register/business'); } else { setStatus(data); } }; checkAuth(); }, [router]);
if (status === 'loading') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted flex justify-center items-center">
<div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
</main>
</div> ); }
if (status && status.status === 'pending') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 flex items-center justify-center">
<div className="max-w-xl w-full glass-card p-12 text-center animate-in zoom-in duration-500">
<div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
<Clock className="w-12 h-12 text-yellow-500" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-yellow-500">Under Verification ⏳</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your business account <strong>{status.orgName}
</strong> is currently under review by our compliance team. Normal trading operations and listing features are temporarily disabled until GST checks are finalized. </p>
<div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center">
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Application ID</p>
<p className="font-mono text-lg text-gray-500">#B2B-{status.id}
</p>
</div>
</div>
</main>
</div> ); }
if (status && status.status === 'rejected') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 flex items-center justify-center">
<div className="max-w-xl w-full glass-card border-red-500/30 p-12 text-center animate-in zoom-in duration-500">
<div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
<XCircle className="w-12 h-12 text-red-500" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-red-500">Application Rejected ❌</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your KYC submission failed our integrity checks. Please review the unverified grounds identified below. </p>
<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center mb-8">
<p className="text-[10px] text-red-400 uppercase font-black tracking-widest mb-1">Rejection Reason</p>
<p className="font-bold text-red-400 text-lg">{status.rejection_reason || "Invalid documentation provided."}
</p>
</div>
<Link href="/register/business">
<button className="px-8 py-4 bg-gray-50 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-xl transition-all shadow-lg w-full flex items-center justify-center gap-2"> 👉 Re-submit Application <RefreshCw className="w-4 h-4" />
</button>
</Link>
</div>
</main>
</div> ); }
// Approved Status
return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted flex flex-col min-h-screen"> {/* Verification Success Banner */}
<div className="w-full bg-green-500/10 border-b border-green-500/20 px-8 py-3 flex items-center justify-between">
<div className="flex items-center gap-2 text-green-400">
<ShieldCheck className="w-5 h-5" />
<span className="font-bold text-sm tracking-wide">Your business is verified ✅</span>
</div>
<span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-md"> ✔ Verified Business </span>
</div> {/* Render children module (the actual business dashboard portal) */}
<div className="flex-1 p-8"> {children}
</div>
</main>
</div> );
}
