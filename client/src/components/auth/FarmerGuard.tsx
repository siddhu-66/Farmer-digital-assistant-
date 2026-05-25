"use client";

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { farmerRegistrationService, FarmerApplication } from '@/services/farmerRegistrationService';

import Sidebar from '@/components/layout/Sidebar';

import {  XCircle, Clock, RefreshCw, Tractor } from 'lucide-react';
export default function FarmerGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<FarmerApplication | null | 'loading'>('loading');
const router = useRouter(); useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await farmerRegistrationService.getFarmerStatus();

        if (!data || data.success === false) {
           const httpStatus = (data as { httpStatus?: number })?.httpStatus;
           if (httpStatus === 401 || data?.message?.toLowerCase().includes('auth')) {
              router.push('/signin');
           } else {
              router.push('/register/farmer');
           }
        } else {
          setStatus(data);
        }
      } catch (error) {
        const httpStatus =
          error && typeof error === 'object' && 'httpStatus' in error
            ? (error as { httpStatus?: number }).httpStatus
            : undefined;
        if (httpStatus === 401) {
          router.push('/signin');
        } else {
          router.push('/register/farmer');
        }
      }
    }; 
    checkAuth(); 
  }, [router]);
if (status === 'loading') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted flex justify-center items-center">
<div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
</main>
</div> ); }
if (status && status.status === 'pending') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 flex items-center justify-center">
<div className="max-w-xl w-full glass-card p-12 text-center animate-in zoom-in duration-500 border-green-500/10">
<div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
<Clock className="w-12 h-12 text-yellow-500" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-yellow-500">Verification in progress ⏳</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your farmer profile (<strong>{status.farmerName}
</strong>) is under evaluation. Government compliance and acreage records must be audited before releasing institutional modules like direct B2B trading. </p>
<div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center">
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Temporary ID assigned</p>
<p className="font-mono text-lg text-gray-500">#FRM-{status.id}
</p>
</div>
</div>
</main>
</div> ); }
if (status && status.status === 'rejected') {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 flex items-center justify-center">
<div className="max-w-xl w-full glass-card border-red-500/30 p-12 text-center animate-in zoom-in duration-500 bg-red-500/5">
<div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
<XCircle className="w-12 h-12 text-red-500" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-red-500">Application rejected ❌</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your identity dossier was deemed inadequate by our compliance team. The following specific reason was provided: </p>
<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center mb-8">
<p className="text-[10px] text-red-400 uppercase font-black tracking-widest mb-1">Audit Failure Clause</p>
<p className="font-bold text-red-400 text-lg uppercase">{status.rejection_reason || "Critical KYC Discrepancy."}
</p>
</div>
<Link href="/register/farmer">
<button className="px-8 py-4 bg-gray-50 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-xl transition-all shadow-lg w-full flex items-center justify-center gap-2"> 👉 Re-submit Application <RefreshCw className="w-4 h-4" />
</button>
</Link>
</div>
</main>
</div> ); }
// Approved Status: Render children since they already have Sidebars, but inject a top banner.
return ( <div className="w-full relative"> {/* Absolute Verify Badge floating above everything */}
<div className="absolute top-0 left-0 w-full bg-green-500/10 border-b border-green-500/20 px-8 py-1 flex items-center justify-center gap-4 z-50 backdrop-blur-md">
<div className="flex items-center gap-2 text-green-400">
<Tractor className="w-4 h-4" />
<span className="font-bold text-xs tracking-wide">You are a verified farmer ✅</span>
</div>
</div> {children}
</div> );
}
