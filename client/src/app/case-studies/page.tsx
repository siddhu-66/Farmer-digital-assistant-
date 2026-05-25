"use client";

import Sidebar from "@/components/layout/Sidebar";

import {  ArrowUpRight, Target, Users, CheckCircle2 } from 'lucide-react';
const caseStudies = [ { title: 'Amul: The White Revolution', tag: 'Cooperative Model', impact: 'Empowered 3.6M+ farmers', objective: 'To provide farmers with a direct link to health and dairy markets while eliminating middlemen.', lessons: ['Collective Bargaining', 'End-to-end Value Chain', 'Professional Management'], bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' }, { title: 'ITC e-Choupal: Digital Empowerment', tag: 'Technology Integration', impact: 'Serving 4M+ farmers across 35k villages', objective: 'To overcome the challenges of fragmented land holdings and information asymmetry using the internet.', lessons: ['Direct Knowledge Transfer', 'Transparency in Pricing', 'Village-level Infrastructure'], bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' }, { title: 'PepsiCo: Contract Farming Success', tag: 'Collaboration Model', impact: '24,000+ partner farmers in India', objective: 'To ensure a consistent supply of world-class processing-grade potatoes for Frito-Lay.', lessons: ['Guaranteed Buy-back', 'High-quality Input Supply', 'Technical Training'], bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' } ];
export default function CaseStudies() {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 pt-10">
<header className="mb-12">
<h1 className="text-4xl font-bold mb-2">Agricultural Case Studies</h1>
<p className="text-gray-500">Analyzing successful Indian collaboration models and their impact.</p>
</header>
<div className="grid grid-cols-1 gap-12 max-w-5xl"> {caseStudies.map((study, i) => ( <div key={i} className={`glass-card p-10 ${study.bg} ${study.border} relative group overflow-hidden`}>
<div className="absolute top-0 right-0 p-8">
<ArrowUpRight className="w-8 h-8 20 group-hover:100 transition-opacity" />
</div>
<div className="flex flex-col md:flex-row gap-10">
<div className="md:w-2/3">
<span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${study.text} bg-gray-50 border ${study.border} mb-6 inline-block`}> {study.tag}
</span>
<h2 className="text-3xl font-bold mb-4">{study.title}
</h2>
<p className="text-lg text-gray-500 mb-8 leading-relaxed"> {study.objective}
</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<h4 className="font-bold flex items-center gap-2 mb-4 text-gray-500 uppercase text-sm tracking-wider">
<Target className="w-4 h-4 text-primary" /> Key Lessons </h4>
<ul className="space-y-3"> {study.lessons.map((ls, j) => ( <li key={j} className="flex items-center gap-2 text-gray-500 text-sm">
<CheckCircle2 className="w-4 h-4 text-primary" /> {ls}
</li> ))}
</ul>
</div>
<div className="bg-black/20 p-6 rounded-2xl border border-gray-200">
<h4 className="font-bold flex items-center gap-2 mb-2 text-gray-500">
<Users className="w-4 h-4 text-primary" /> Social Impact </h4>
<p className="text-xl font-bold text-primary">{study.impact}
</p>
</div>
</div>
</div>
<div className="md:w-1/3 flex items-center justify-center">
<div className={`w-full aspect-square rounded-3xl flex items-center justify-center text-4xl font-bold ${study.text} border-4 border-dashed ${study.border} 40 group-hover:100 transition-opacity`}> {study.title.split(':')[0]}
</div>
</div>
</div>
</div> ))}
</div>
</main>
</div> ); } 