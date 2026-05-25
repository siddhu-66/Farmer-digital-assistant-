'use client';

import React from 'react';

import { Star, MapPin, ShieldCheck, TrendingUp, ArrowRight, Building2, Clock
} from 'lucide-react';

import { MarketAnalysisModal } from './MarketAnalysisModal'; interface Company { id: string; name: string; rating: number; reviews: number; distance: string; specialty: string[]; buyingPrice: number; isVerified: boolean; status: 'Buying Now' | 'Capacity Full' | 'Closing Soon'; logoColor: string;
}
const companies: Company[] = [ { id: '1', name: 'ITC e-Choupal', rating: 4.8, reviews: 1250, distance: '8.2 km', specialty: ['Wheat', 'Soybean', 'Pulses'], buyingPrice: 2480, isVerified: true, status: 'Buying Now', logoColor: 'bg-orange-500' }, { id: '2', name: 'PepsiCo India', rating: 4.9, reviews: 840, distance: '12.5 km', specialty: ['Potato', 'Maize', 'Vegetables'], buyingPrice: 1950, isVerified: true, status: 'Buying Now', logoColor: 'bg-blue-600' }, { id: '3', name: 'Adani Wilmar', rating: 4.6, reviews: 2100, distance: '15.0 km', specialty: ['Mustard', 'Sunflower', 'Oilseeds'], buyingPrice: 5650, isVerified: true, status: 'Closing Soon', logoColor: 'bg-yellow-500' }, { id: '4', name: 'Local Miller Assoc.', rating: 4.2, reviews: 156, distance: '3.1 km', specialty: ['Basmati', 'Wheat'], buyingPrice: 2420, isVerified: false, status: 'Buying Now', logoColor: 'bg-green-600' }
];
export default function B2BMarketplace({ onSell }: { onSell: (company: Company) => void }) {
  const [showAnalysisModal, setShowAnalysisModal] = React.useState(false);
return ( <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {companies.map((company) => ( <div key={company.id} className="glass-card group hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col"> {/* Top Section: Status & Image Placeholder */}
<div className="h-32 bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
<div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-gray-200">
<span className={`w-1.5 h-1.5 rounded-full ${company.status === 'Buying Now' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}>
</span> {company.status}
</div> {company.isVerified && ( <div className="absolute top-3 right-3 p-1.5 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-500/30 text-blue-400">
<ShieldCheck className="w-4 h-4" />
</div> )}
<div className="absolute inset-0 flex items-center justify-center 20 group-hover:scale-110 transition-transform duration-700">
<Building2 className="w-20 h-20 text-gray-500" />
</div>
</div> {/* Content Section */}
<div className="p-5 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-xl font-bold group-hover:text-primary transition-colors">{company.name}
</h3>
<div className="flex items-center gap-2 mt-1">
<div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500 text-black text-[10px] font-black rounded"> {company.rating}
<Star className="w-2.5 h-2.5 fill-black" />
</div>
<span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">({company.reviews} Reviews)</span>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Current Price</p>
<p className="text-lg font-black text-primary">₹{company.buyingPrice.toLocaleString()}
</p>
</div>
</div>
<div className="mt-4 flex flex-wrap gap-2 mb-6"> {company.specialty.map((s, i) => ( <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[10px] font-medium text-gray-500"> {s}
</span> ))}
</div>
<div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="flex items-center gap-1 text-[11px] text-gray-500">
<MapPin className="w-3 h-3 text-primary" /> {company.distance}
</div>
<div className="flex items-center gap-1 text-[11px] text-gray-500">
<Clock className="w-3 h-3 text-primary" /> Fast Payout </div>
</div>
<button onClick={() => onSell(company)} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-xs font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10 group/btn" > Sell Now <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
</button>
</div>
</div>
</div> ))}
</div> {/* Featured Insight Card */}
<div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-between gap-6 mt-8">
<div className="flex items-center gap-4">
<div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
<TrendingUp className="w-6 h-6" />
</div>
<div>
<h4 className="font-bold text-blue-400">B2B Bulk Premium</h4>
<p className="text-sm text-gray-500 mt-0.5">Commercial buyers are currently paying 8.5% above Mandi rates for PBW-343 Wheat variety.</p>
</div>
</div>
<button onClick={() => setShowAnalysisModal(true)} className="px-5 py-2.5 bg-blue-600 text-gray-500 font-bold rounded-xl text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap" > View Analysis </button>
</div> {showAnalysisModal && ( <MarketAnalysisModal onClose={() => setShowAnalysisModal(false)} /> )}
</div> );
}
