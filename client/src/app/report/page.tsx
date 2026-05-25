"use client";

import { CheckCircle2, FlaskConical, Cpu, Zap, Activity } from 'lucide-react';
export default function Report() {
  return ( <div className="flex flex-col gap-16 pb-20 max-w-5xl mx-auto px-6 pt-10">
<header className="text-center space-y-4">
<h1 className="text-5xl font-bold text-gradient">Project Data & Report</h1>
<p className="text-xl text-gray-500">Comprehensive technical overview of the One-to-One platform.</p>
</header> {/* Intro Section */}
<section className="glass-card p-10">
<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
<span className="w-2 h-8 bg-primary rounded-full">
</span> Executive Summary </h2>
<p className="text-lg text-gray-500 leading-relaxed mb-6"> One-to-One is more than just an app; it is a digital ecosystem designed to bridge the gap between smallholder farmers and global markets through data-driven collaboration and sustainable practices. </p>
<div className="grid md:grid-cols-2 gap-8">
<div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
<h3 className="font-bold text-primary mb-3">Core Objectives</h3>
<ul className="space-y-3 text-sm text-gray-500">
<li className="flex gap-2">
<CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Streamline farmer verification.</li>
<li className="flex gap-2">
<CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Facilitate FPO-based corporate partnerships.</li>
<li className="flex gap-2">
<CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> High-fidelity weather & soil analytics.</li>
</ul>
</div>
<div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
<h3 className="font-bold text-secondary mb-3">Key Technologies</h3>
<ul className="space-y-3 text-sm text-gray-500">
<li>Next.js 16 (React 19)</li>
<li>Tailwind CSS 4</li>
<li>Lucide Icons</li>
<li>Glassmorphism UI Engine</li>
</ul>
</div>
</div>
</section> {/* Human Modification Section */}
<section className="glass-card p-10 border-accent/20 bg-accent/5">
<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
<Cpu className="w-8 h-8 text-accent" /> The Future: Human Modification </h2>
<p className="text-lg text-gray-500 leading-relaxed mb-8"> This project explores the boundary of &quot;Human Modification&quot; in agriculture. We aim to extend the physical and cognitive limits of the farmer through seamless technology integration. </p>
<div className="grid md:grid-cols-2 gap-6"> {[ { icon: Zap, title: 'Cognitive Extension', desc: 'Neural-linked analytics providing instant knowledge of soil patterns.' }, { icon: Activity, title: 'Physical Augmentation', desc: 'Wearable exoskeletons for high-efficiency manual labor.' }, { icon: FlaskConical, title: 'Biological Optimization', desc: 'Precise biological interventions at a cellular level.' }, { icon: Cpu, title: 'Sensory Enhancement', desc: 'AR interfaces overlaying growth predictions onto the field.' } ].map((item, i) => ( <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
<item.icon className="w-10 h-10 text-accent shrink-0" />
<div>
<h4 className="font-bold mb-1">{item.title}
</h4>
<p className="text-xs text-gray-500">{item.desc}
</p>
</div>
</div> ))}
</div>
</section> {/* Feature Section */}
<section className="grid md:grid-cols-3 gap-6"> {[ { title: 'ML Insights', value: '85%', detail: 'Prediction Accuracy' }, { title: 'Data Sources', value: '12+', detail: 'Weather/Soil APIs' }, { title: 'Response Time', value: '<200ms', detail: 'Edge-rendered UI' } ].map((item, i) => ( <div key={i} className="glass-card p-8 text-center">
<p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{item.title}
</p>
<p className="text-3xl font-bold text-primary mb-1">{item.value}
</p>
<p className="text-xs text-secondary">{item.detail}
</p>
</div> ))}
</section>
<footer className="text-center">
<p className="text-gray-500 text-sm italic"> Generated automatically by the Project Report Engine. </p>
</footer>
</div> ); } 