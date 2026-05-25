"use client";

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
// Import useRouter
import { ArrowLeft, Handshake, CheckCircle2, XCircle, Building2, Clock, Banknote, Info } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import { useAuth } from '@/context/AuthContext';
// Import useAuth
export default function CollaborationPortal() {
  const { t } = useLanguage();
const { role } = useAuth();
// Get role from useAuth
const router = useRouter();
// Initialize useRouter 
useEffect(() => {
  // Redirect if the user is not a 'farmer' 
  if (role && role !== 'farmer') { router.push('/signin'); } 
}, [role, router]);
const [notif, setNotif] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
// Render nothing if the user is not a farmer or role is not yet loaded 
if (role && role !== 'farmer') return null;
const contracts = [ { id: 1, contractor: 'ITC e-Choupal', crop: t('data.wheat'), price: '₹2,450', duration: '4 Months', icon: <Building2 className="w-8 h-8 text-orange-500" /> }, { id: 2, contractor: 'PepsiCo India', crop: 'Potato (Processing Grade)', price: '₹1,800', duration: '3 Months', icon: <Building2 className="w-8 h-8 text-blue-500" /> }, { id: 3, contractor: 'Amul Dairy', crop: 'Green Fodder', price: '₹600', duration: '12 Months', icon: <Building2 className="w-8 h-8 text-primary" /> } ];
const handleAction = (type: 'accept' | 'reject') => { setNotif({ type: type === 'accept' ? 'success' : 'error', msg: type === 'accept' ? t('collaborationPortal.success') : t('collaborationPortal.rejected') }); setTimeout(() => setNotif(null), 3000); };
return ( <div className="min-h-screen bg-black text-gray-500 selection:bg-secondary/30"> {/* Notification Toast */} {notif && ( <div className={`fixed top-24 right-8 z-[100] px-6 py-4 rounded-2xl border flex items-center gap-3 animate-slide-in shadow-2xl ${ notif.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400' }`}> {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
<span className="font-bold">{notif.msg}
</span>
</div> )} {/* Navigation */}
<nav className="p-6 border-b border-gray-200 backdrop-blur-md sticky top-0 z-50">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-500 transition-colors">
<ArrowLeft className="w-5 h-5" />
<span>{t('mlDocs.back')}
</span>
</Link>
<div className="flex items-center gap-2 text-secondary font-bold">
<Handshake className="w-6 h-6" />
<span>{t('collaborationPortal.title')}
</span>
</div>
</div>
</nav>
<main className="max-w-5xl mx-auto px-6 py-16">
<header className="mb-12">
<h1 className="text-4xl font-bold mb-4">{t('collaborationPortal.title')}
</h1>
<p className="text-xl text-gray-500">{t('collaborationPortal.subtitle')}
</p>
</header>
<div className="grid gap-6"> {contracts.length > 0 ? ( contracts.map((contract) => ( <div key={contract.id} className="glass-card p-8 border-gray-200 hover:border-secondary/30 transition-all group relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all">
</div>
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
<div className="flex gap-6 items-center">
<div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"> {contract.icon}
</div>
<div>
<div className="text-xs text-secondary font-bold uppercase tracking-widest mb-1">{t('collaborationPortal.contractor')}
</div>
<h3 className="text-2xl font-bold">{contract.contractor}
</h3>
</div>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 md:ml-12 border-l border-gray-200 pl-12">
<div>
<div className="text-xs text-gray-500 mb-2 flex items-center gap-2 lowercase italic">
<Clock className="w-3 h-3" /> {t('collaborationPortal.duration')}
</div>
<div className="font-bold">{contract.duration}
</div>
</div>
<div>
<div className="text-xs text-gray-500 mb-2 flex items-center gap-2 lowercase italic">
<Banknote className="w-3 h-3" /> {t('collaborationPortal.price')}
</div>
<div className="font-bold">{contract.price}
<span className="text-xs text-gray-500 font-normal">{t('collaborationPortal.perQuintal')}
</span>
</div>
</div>
<div className="hidden md:block">
<div className="text-xs text-gray-500 mb-2 flex items-center gap-2 lowercase italic">
<Info className="w-3 h-3" /> {t('collaborationPortal.crop')}
</div>
<div className="font-bold">{contract.crop}
</div>
</div>
</div>
<div className="flex gap-3 w-full md:w-auto">
<button onClick={() => handleAction('accept')} className="flex-1 md:flex-none px-6 py-3 bg-secondary text-black font-bold rounded-xl hover:bg-secondary-light transition-all flex items-center justify-center gap-2" >
<CheckCircle2 className="w-4 h-4" /> {t('collaborationPortal.accept')}
</button>
<button onClick={() => handleAction('reject')} className="px-4 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-500 transition-all" aria-label={t('collaborationPortal.reject')} >
<XCircle className="w-5 h-5" />
</button>
</div>
</div>
</div> )) ) : ( <div className="text-center py-20 glass-card border-dashed border-gray-200 text-gray-500"> {t('collaborationPortal.noContracts')}
</div> )}
</div>
</main>
</div> ); } 