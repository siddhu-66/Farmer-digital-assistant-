'use client';

import React, { useState, useEffect, useCallback } from 'react';

import Sidebar from "@/components/layout/Sidebar";

import { Truck, XCircle, Clock, Search, User, ArrowUpRight, ShieldCheck, ChevronDown, Bot
} from 'lucide-react';

import { b2bService, B2BRequest, SALESMEN } from '@/services/b2bService';
export default function ProcurementDashboard() {
  const [requests, setRequests] = useState<B2BRequest[]>([]);
const [filter, setFilter] = useState<'All' | 'Pending' | 'Admin_Approved' | 'Salesman_Assigned'>('All');
const loadRequests = useCallback(() => {
  const all = b2bService.getAllRequests();
  if (filter === 'All') setRequests(all);
  else setRequests(all.filter((r) => r.status === filter));
}, [filter]);

useEffect(() => {
  loadRequests();
  window.addEventListener('b2b-request-updated', loadRequests);
  return () => window.removeEventListener('b2b-request-updated', loadRequests);
}, [loadRequests]);
const handleStatusUpdate = (id: string, status: B2BRequest['status']) => { b2bService.updateRequestStatus(id, status); };
const handleAssignSalesman = (requestId: string, salesmanId: string) => { b2bService.assignToSalesman(requestId, salesmanId); };
return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500">
<Sidebar forceRole="business" />
<main className="flex-1 main-content-shifted p-8 pt-10">
<header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
<div>
<h1 className="text-4xl font-bold mb-2">Procurement Management</h1>
<p className="text-gray-500">Review and approve incoming crop sale requests from registered farmers.</p>
</div>
<div className="flex gap-3">
<div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200"> {['All', 'Pending', 'Admin_Approved', 'Salesman_Assigned'].map((f) => ( <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-primary text-black' : 'text-gray-500 hover:text-gray-500'}`} > {f}
</button> ))}
</div>
</div>
</header>
<div className="grid gap-6"> {requests.length === 0 ? ( <div className="glass-card p-20 text-center">
<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
<Truck className="w-8 h-8 text-gray-500" />
</div>
<h3 className="text-xl font-bold">No Requests Found</h3>
<p className="text-gray-500 mt-1">Incoming procurement requests will appear here once farmers initiate sales.</p>
</div> ) : ( <div className="glass-card p-0 overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-200">
<th className="px-6 py-5">Request ID</th>
<th className="px-6 py-5">Farmer Details</th>
<th className="px-6 py-5">Commodity</th>
<th className="px-6 py-5">Quantity / Profit</th>
<th className="px-6 py-5">Status</th>
<th className="px-6 py-5 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-white/5">{requests.map((req) => ( <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
<td className="px-6 py-6 font-mono text-[10px] text-gray-500">#{req.id}
</td>
<td className="px-6 py-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
<User className="w-5 h-5 text-primary" />
</div>
<div>
<p className="font-bold text-sm">Farmer ID: {req.farmerId}
</p>
<p className="text-[10px] text-gray-500 uppercase font-black">Registered Region #42</p>
</div>
</div>
</td>
<td className="px-6 py-6">
<div className="p-2 bg-gray-50 rounded-lg inline-flex flex-col border border-gray-200 min-w-[100px]">
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Crop</p>
<p className="font-bold text-xs">{req.crop}
</p>
</div>
</td>
<td className="px-6 py-6">
<p className="font-bold text-sm">{req.weight} Qtl</p>
<div className="flex flex-col mt-1">
<span className="text-[10px] text-primary font-bold">Payout: ₹{req.expectedProfit.toLocaleString()}
</span>
<span className="text-[10px] text-gray-500 font-medium">@ ₹{req.pricePerQtl || 0}/Qtl</span>
</div>
</td>
<td className="px-6 py-6">
<div className="flex -space-x-2 overflow-hidden"> {req.images && req.images.map((img, idx) => ( <div key={idx} className="w-10 h-10 rounded-lg border-2 border-background overflow-hidden bg-gray-50 relative group cursor-pointer hover:z-10 transition-all hover:scale-110">
<img src={img} alt="Quality" className="w-full h-full object-cover" />
<div className="absolute inset-0 bg-gray-50 0 group-hover:100 transition-opacity flex items-center justify-center">
<Search className="w-3 h-3 text-gray-500" />
</div>
</div> ))} {(!req.images || req.images.length === 0) && ( <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
<XCircle className="w-4 h-4 text-red-500" />
</div> )}
</div>
<p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-tight"> {req.images?.length || 0} Quality Photos </p> {req.mlQualityTier && ( <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20 text-[10px] font-black uppercase text-indigo-400 whitespace-nowrap">
<Bot className="w-3 h-3" /> AI Verification: {req.mlQualityTier} ({((req.mlConfidence || 0) * 100).toFixed(0)}%) </div> )}
</td>
<td className="px-6 py-6">
<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : req.status === 'Admin_Approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : req.status === 'Salesman_Assigned' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-primary/10 text-primary border-primary/20' }`}> {req.status === 'Pending' && <Clock className="w-3 h-3" />} {req.status === 'Admin_Approved' && <ShieldCheck className="w-3 h-3" />} {req.status === 'Salesman_Assigned' && <User className="w-3 h-3" />} {req.status.replace('_', ' ')}
</div>
</td>
<td className="px-6 py-6 space-x-2 text-right"> {req.status === 'Pending' && ( <div className="flex items-center justify-end gap-2">
<button onClick={() => handleStatusUpdate(req.id, 'Rejected')} className="p-2.5 hover:bg-red-500/10 rounded-xl text-red-500 transition-all border border-transparent hover:border-red-500/20" title="Reject Quality" >
<XCircle className="w-5 h-5" />
</button>
<button onClick={() => handleStatusUpdate(req.id, 'Admin_Approved')} className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10" title="Verify Quality" >
<ShieldCheck className="w-4 h-4" /> Verify Quality </button>
</div> )} {req.status === 'Admin_Approved' && ( <div className="flex items-center justify-end gap-2">
<div className="relative group/select">
<button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold rounded-xl hover:bg-indigo-500/30 transition-all text-xs"> Assign Salesman <ChevronDown className="w-4 h-4" />
</button>
<div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-gray-200 rounded-xl shadow-2xl 0 invisible group-hover/select:100 group-hover/select:visible transition-all z-50 p-2"> {SALESMEN.map(s => ( <button key={s.id} onClick={() => handleAssignSalesman(req.id, s.id)} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-[11px] font-bold flex flex-col" >
<span>{s.name}
</span>
<span className="text-[9px] text-gray-500 uppercase tracking-tighter">{s.region} Region</span>
</button> ))}
</div>
</div>
</div> )} {req.status === 'Salesman_Assigned' && ( <div className="text-right">
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Assigned To</p>
<p className="text-xs font-bold text-primary">{req.assignedSalesmanName}
</p>
</div> )} {(req.status === 'Logistics_Scheduled' || req.status === 'Completed') && ( <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors" title="View Transaction Log">
<ArrowUpRight className="w-5 h-5" />
</button> )}
</td>
</tr> ))}
</tbody>
</table>
</div>
</div> )}
</div>
</main>
</div> );
}
