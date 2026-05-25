"use client";

import React from 'react';

import Link from 'next/link';

import { ArrowLeft, BrainCircuit, Database, LineChart, ShieldCheck, CloudRain, TrendingUp, MapPin } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
export default function MLDocs() {
  const { t } = useLanguage();
return ( <div className="min-h-screen bg-black text-gray-500 selection:bg-primary/30"> {/* Navigation */}
<nav className="p-6 border-b border-gray-200 backdrop-blur-md sticky top-0 z-50">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-500 transition-colors">
<ArrowLeft className="w-5 h-5" />
<span>{t('mlDocs.back')}
</span>
</Link>
<div className="flex items-center gap-2 text-primary font-bold">
<BrainCircuit className="w-6 h-6" />
<span>{t('mlDocs.version')}
</span>
</div>
</div>
</nav>
<main className="max-w-4xl mx-auto px-6 py-20"> {/* Header */}
<header className="mb-16">
<h1 className="text-4xl md:text-5xl font-bold mb-6">{t('mlDocs.title')}
</h1>
<p className="text-xl text-gray-500 leading-relaxed"> {t('mlDocs.subtitle')}
</p>
</header> {/* Key Features Grid */}
<section className="grid md:grid-cols-2 gap-8 mb-20">
<div className="glass-card p-8 border-primary/20">
<Database className="w-10 h-10 text-primary mb-6" />
<h3 className="text-xl font-bold mb-3">{t('mlDocs.feature1.title')}
</h3>
<p className="text-gray-500">{t('mlDocs.feature1.desc')}
</p>
</div>
<div className="glass-card p-8 border-primary/20">
<LineChart className="w-10 h-10 text-primary mb-6" />
<h3 className="text-xl font-bold mb-3">{t('mlDocs.feature2.title')}
</h3>
<p className="text-gray-500">{t('mlDocs.feature2.desc')}
</p>
</div>
</section> {/* Data Sources Architecture */}
<section className="mb-20">
<h2 className="text-3xl font-bold mb-8">{t('mlDocs.arch.title')}
</h2>
<div className="space-y-6">
<div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
<div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
<CloudRain className="text-blue-500" />
</div>
<div>
<h4 className="text-lg font-bold mb-2">{t('mlDocs.pipeline1.title')}
</h4>
<p className="text-gray-500">{t('mlDocs.pipeline1.desc')}
</p>
</div>
</div>
<div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
<div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
<TrendingUp className="text-orange-500" />
</div>
<div>
<h4 className="text-lg font-bold mb-2">{t('mlDocs.pipeline2.title')}
</h4>
<p className="text-gray-500">{t('mlDocs.pipeline2.desc')}
</p>
</div>
</div>
<div className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
<MapPin className="text-purple-500" />
</div>
<div>
<h4 className="text-lg font-bold mb-2">{t('mlDocs.pipeline3.title')}
</h4>
<p className="text-gray-500">{t('mlDocs.pipeline3.desc')}
</p>
</div>
</div>
</div>
</section> {/* Verification & Trust */}
<section className="glass-card p-10 bg-primary/5 border-primary/20">
<div className="flex items-center gap-4 mb-6">
<ShieldCheck className="w-10 h-10 text-primary" />
<h2 className="text-3xl font-bold uppercase tracking-tight">{t('mlDocs.verified.title')}
</h2>
</div>
<p className="text-lg text-gray-500 mb-8"> {t('mlDocs.verified.desc')}
</p>
<div className="grid grid-cols-3 gap-4 text-center">
<div>
<div className="text-2xl font-bold text-primary">92%</div>
<div className="text-xs text-gray-500 uppercase">{t('mlDocs.verified.accuracy')}
</div>
</div>
<div>
<div className="text-2xl font-bold text-primary">500+</div>
<div className="text-xs text-gray-500 uppercase">{t('mlDocs.verified.mandis')}
</div>
</div>
<div>
<div className="text-2xl font-bold text-primary">Real-Time</div>
<div className="text-xs text-gray-500 uppercase">{t('mlDocs.verified.updates')}
</div>
</div>
</div>
</section> {/* Footer Link */}
<footer className="mt-20 text-center">
<Link href="/" className="glass-button px-10 py-4 shadow-xl shadow-primary/20"> {t('mlDocs.footer')}
</Link>
</footer>
</main>
</div> ); } 