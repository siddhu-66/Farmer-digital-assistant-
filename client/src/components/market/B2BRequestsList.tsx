'use client';

import React from 'react';

import { Clock, CheckCircle2, Truck, AlertCircle, Building2, Calendar, ArrowRight, ShieldCheck, User
} from 'lucide-react';

import { B2BRequest } from '@/services/b2bService'; interface B2BRequestsListProps { requests: B2BRequest[];
}
export function B2BRequestsList({ requests }: B2BRequestsListProps) {
  const getStatusStyle = (status: B2BRequest['status']) => { switch (status) { case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'; case 'Admin_Approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'; case 'Salesman_Assigned': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'; case 'Logistics_Scheduled': return 'bg-secondary/10 text-secondary border-secondary/20'; case 'Completed': return 'bg-primary/10 text-primary border-primary/20'; case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'; default: return 'bg-gray-50 text-gray-500 border-gray-200 opacity-'; } };
const getStatusIcon = (status: B2BRequest['status']) => { switch (status) { case 'Pending': return <Clock className="w-3.5 h-3.5" />; case 'Admin_Approved': return <ShieldCheck className="w-3.5 h-3.5" />;
// Need to import ShieldCheck
case 'Salesman_Assigned': return <User className="w-3.5 h-3.5" />;
// Need to import User
case 'Logistics_Scheduled': return <Truck className="w-3.5 h-3.5" />; case 'Completed': return <CheckCircle2 className="w-3.5 h-3.5" />; case 'Rejected': return <AlertCircle className="w-3.5 h-3.5" />; default: return null; } };
if (requests.length === 0) {
  return ( <div className="glass-card p-12 text-center animate-in fade-in zoom-in duration-500">
<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
<Building2 className="w-8 h-8 text-gray-500" />
</div>
<h3 className="text-xl font-bold mb-2">No Sale Requests Yet</h3>
<p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed"> When you initiate a sale to a business through the B2B Marketplace, your requests will appear here for tracking. </p>
</div> ); }
return ( <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
<div className="flex justify-between items-center mb-2 px-2">
<h2 className="text-xl font-bold flex items-center gap-2">
<Clock className="w-5 h-5 text-primary" /> Active Requests </h2>
<span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{requests.length} Total</span>
</div>
<div className="grid gap-4"> {requests.map((request) => ( <div key={request.id} className="glass-card p-6 hover:bg-white/[0.07] transition-all group overflow-hidden relative" > {/* Status Background Glow */}
<div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[80px] 20 ${ request.status === 'Admin_Approved' || request.status === 'Salesman_Assigned' ? 'bg-green-500' : request.status === 'Pending' ? 'bg-yellow-500' : 'bg-primary' }`}>
</div>
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-primary/30 transition-colors">
<Building2 className="w-6 h-6 text-primary" />
</div>
<div>
<h4 className="font-bold text-lg group-hover:text-primary transition-colors">{request.companyName}
</h4>
<div className="flex items-center gap-2 mt-1">
<span className="px-2 py-0.5 bg-gray-50 rounded text-[10px] font-bold text-gray-500">{request.crop}
</span>
<span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">•</span>
<span className="text-gray-500 text-[10px] font-bold">{request.weight} Qtl</span>
</div> {/* Thumbnails for Farmer */} {request.images && request.images.length > 0 && ( <div className="flex gap-1.5 mt-3"> {request.images.slice(0, 3).map((img, idx) => ( <div key={idx} className="w-8 h-8 rounded-md border border-gray-200 overflow-hidden bg-gray-50">
<img src={img} alt="Crop" className="w-full h-full object-cover 60" />
</div> ))} {request.images.length > 3 && ( <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-500"> +{request.images.length - 3}
</div> )}
</div> )}
</div>
</div>
<div className="flex flex-wrap items-center gap-4 md:gap-8">
<div className="text-right">
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Expected Profit</p>
<p className="text-xl font-bold">₹{request.expectedProfit.toLocaleString()}
</p>
</div>
<div className="flex flex-col items-end gap-2">
<div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(request.status)}`}> {getStatusIcon(request.status)} {request.status}
</div>
<div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
<Calendar className="w-3 h-3" /> {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
</div>
</div>
<button className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-primary hover:text-black hover:border-primary transition-all group/btn" title="View Request Details">
<ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
</button>
</div>
</div>
</div> ))}
</div>
</div> );
}
