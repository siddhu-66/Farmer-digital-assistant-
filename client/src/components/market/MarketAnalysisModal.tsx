'use client';

import React from 'react';

import { X, TrendingUp, BarChart3, Target, AlertCircle, Zap, ArrowRight
} from 'lucide-react'; interface MarketAnalysisModalProps { onClose: () => void;
}
export function MarketAnalysisModal({ onClose }: MarketAnalysisModalProps) {
  return ( <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}>
</div>
<div className="glass-card w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"> {/* Decorative Header */}
<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-primary to-accent">
</div>
<div className="p-8 overflow-y-auto">
<div className="flex justify-between items-start mb-8">
<div>
<div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] mb-1">
<BarChart3 className="w-3 h-3" /> Market Intelligence Report </div>
<h3 className="text-3xl font-black italic tracking-tighter">B2B BULK PREMIUM <span className="text-blue-500">ANALYSIS</span>
</h3>
<p className="text-sm text-gray-500 mt-1">Real-time comparison between Mandi rates and Corporate procurement.</p>
</div>
<button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500 hover:text-gray-500 border border-gray-200" aria-label="Close" >
<X className="w-5 h-5" />
</button>
</div>
<div className="space-y-8"> {/* Price Comparison Visual */}
<div className="space-y-4">
<h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
<Target className="w-3 h-3 text-primary" /> Price Comparison (Per Quintal) </h4>
<div className="space-y-6 bg-gray-50 p-6 rounded-[24px] border border-gray-200"> {/* Mandi Bar */}
<div className="space-y-2">
<div className="flex justify-between text-sm font-bold">
<span className="text-gray-500">Local Mandi (Avg)</span>
<span>₹2,240</span>
</div>
<div className="h-3 bg-gray-50 rounded-full overflow-hidden">
<div className="h-full bg-gray-50 w-[65%] rounded-full">
</div>
</div>
</div> {/* B2B Bar */}
<div className="space-y-2">
<div className="flex justify-between text-sm font-bold">
<span className="text-blue-400 flex items-center gap-1.5"> Corporate Buyers <Zap className="w-3 h-3 fill-current" />
</span>
<span className="text-blue-400">₹2,485 (+11%)</span>
</div>
<div className="h-4 bg-blue-600/20 rounded-full overflow-hidden border border-blue-500/20">
<div className="h-full bg-blue-500 w-[92%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]">
</div>
</div>
</div>
</div>
</div> {/* Strategic Insights */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
<div className="p-2 bg-green-500/10 rounded-lg w-fit">
<TrendingUp className="w-5 h-5 text-green-400" />
</div>
<h5 className="font-bold text-sm">Demand Outlook</h5>
<p className="text-xs text-gray-500 leading-relaxed"> Wheat demand is projected to rise by 4.2% next week due to regional milling shortages. Sell now to lock in high premiums. </p>
</div>
<div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
<div className="p-2 bg-blue-500/10 rounded-lg w-fit">
<AlertCircle className="w-5 h-5 text-blue-400" />
</div>
<h5 className="font-bold text-sm">Logistics Benefit</h5>
<p className="text-xs text-gray-500 leading-relaxed"> Corporate buyers provide farm-gate pickup for loads &gt; 50 Qtl, saving you an average of ₹120 per Qtl in transport costs. </p>
</div>
</div> {/* CTA/Footer */}
<div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse">
</div>
<span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Analysis Updated 12m ago</span>
</div>
<button onClick={onClose} className="w-full md:w-auto px-8 py-3 bg-blue-600 text-gray-500 font-black rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group" > Acknowledge & Sync <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
</button>
</div>
</div>
</div>
</div>
</div> );
}
