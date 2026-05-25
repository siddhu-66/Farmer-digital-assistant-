"use client";

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { ArrowLeft, BarChart3, TrendingUp, Users, Target, Loader2 } from 'lucide-react';


import { businessService } from '@/services/businessService';
export default function ProjectionsPage() {
  const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true); useEffect(() => {
  const fetchData = async () => { setLoading(true); try {
  const res = await businessService.getSourcingProjections(); setData(res); } catch (error) { console.error('Failed to fetch projections:', error); } finally { setLoading(false); } }; fetchData(); }, []);
return ( <div className="max-w-6xl mx-auto px-6 py-12">
<Link href="/business" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-500 transition-colors mb-8">
<ArrowLeft className="w-4 h-4" /> Back to Salesman Dashboard </Link>
<header className="mb-12">
<h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
<BarChart3 className="w-10 h-10 text-blue-400" /> Sourcing Projections </h1>
<p className="text-xl text-gray-500">Analyze future crop availability and pricing trends.</p>
</header>
<div className="grid md:grid-cols-3 gap-6 mb-12"> {loading ? ( Array(3).fill(0).map((_, i) => ( <div key={i} className="glass-card p-6 border-gray-200 animate-pulse bg-gray-50 h-32 flex items-center justify-center">
<Loader2 className="w-6 h-6 animate-spin text-gray-500" />
</div> )) ) : data && ( <>
<div className="glass-card p-6 border-blue-500/10 animate-slide-in">
<div className="flex items-center gap-3 text-blue-400 mb-4 font-bold uppercase text-xs">
<TrendingUp className="w-4 h-4" /> Market Trend </div>
<div className="text-3xl font-bold">{data.trend}
</div>
<div className="text-sm text-gray-500">Projected Wheat Surplus</div>
</div>
<div className="glass-card p-6 border-blue-500/10 animate-slide-in delay-100">
<div className="flex items-center gap-3 text-blue-400 mb-4 font-bold uppercase text-xs">
<Users className="w-4 h-4" /> Active Customers </div>
<div className="text-3xl font-bold">{data.activeCustomers.toLocaleString()}
</div>
<div className="text-sm text-gray-500">Ready for procurement</div>
</div>
<div className="glass-card p-6 border-blue-500/10 animate-slide-in delay-200">
<div className="flex items-center gap-3 text-blue-400 mb-4 font-bold uppercase text-xs">
<Target className="w-4 h-4" /> Target Met </div>
<div className="text-3xl font-bold">{data.targetMet}
</div>
<div className="text-sm text-gray-500">Seasonal procurement goal</div>
</div>
</> )}
</div>
<div className="glass-card p-8 h-[400px] flex items-center justify-center border-dashed border-gray-200">
<div className="text-center">
<BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
<p className="text-gray-500">Projection charts and heatmaps will appear here after API integration.</p>
</div>
</div>
</div> ); } 