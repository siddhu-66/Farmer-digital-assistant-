'use client';

import React, { useState, useEffect, useCallback } from 'react';

import Sidebar from "@/components/layout/Sidebar";

import { Truck, CheckCircle, Package, ShieldCheck, CheckCircle2, Phone, Bot
} from 'lucide-react';

import { b2bService, B2BRequest, SALESMEN } from '@/services/b2bService';
export default function SalesDispatchDashboard() {
  const [tasks, setTasks] = useState<B2BRequest[]>([]);
const currentSalesman = SALESMEN[0];
// Mocking login as Arjun Mehta (North)
const loadTasks = useCallback(() => {
  const assigned = b2bService.getRequestsBySalesman(currentSalesman.id);
  setTasks(assigned);
}, [currentSalesman.id]);

useEffect(() => {
  loadTasks();
  window.addEventListener('b2b-request-updated', loadTasks);
  return () => window.removeEventListener('b2b-request-updated', loadTasks);
}, [loadTasks]);
const handleStatusUpdate = (id: string, status: B2BRequest['status']) => { b2bService.updateRequestStatus(id, status); };
return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500">
<Sidebar forceRole="business" />
<main className="flex-1 main-content-shifted p-8 pt-10">
<header className="mb-10">
<div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
<ShieldCheck className="w-4 h-4" /> Admin Assigned Tasks </div>
<h1 className="text-4xl font-bold mb-2">Dispatch & Logistics</h1>
<p className="text-gray-500">Manage your assigned procurement tasks for {currentSalesman.region} Region.</p>
</header>
<div className="grid gap-6"> {tasks.length === 0 ? ( <div className="glass-card p-20 text-center">
<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
<Package className="w-8 h-8 text-gray-500" />
</div>
<h3 className="text-xl font-bold">No Active Tasks</h3>
<p className="text-gray-500 mt-1">Assignments from Admin will appear here for logistics handling.</p>
</div> ) : ( <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"> {tasks.map((task) => ( <div key={task.id} className="glass-card p-6 flex flex-col gap-6 group hover:border-primary/30 transition-all">
<div className="flex justify-between items-start">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden">
<img src={task.images?.[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=200'} alt="Crop" className="w-full h-full object-cover" />
</div>
<div>
<h3 className="font-bold text-lg">{task.crop}
</h3>
<p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">FID: {task.farmerId.slice(-6)} • {task.weight} Qtl</p>
</div>
</div>
<div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ task.status === 'Salesman_Assigned' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : task.status === 'Logistics_Scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-primary/10 text-primary border-primary/20' }`}> {task.status.replace('_', ' ')}
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
<div className="flex justify-between items-start mb-2">
<p className="text-[10px] text-gray-500 font-black uppercase tracking-tight">Quality Proof</p> {task.mlQualityTier && ( <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20 text-[8px] font-black uppercase text-indigo-400">
<Bot className="w-3 h-3" /> AI: {task.mlQualityTier}
</div> )}
</div>
<div className="flex gap-1.5"> {(task.images || []).slice(0, 4).map((img, i) => ( <div key={i} className="w-8 h-8 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
<img src={img} alt="Quality" className="w-full h-full object-cover 60" />
</div> ))}
</div>
</div>
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
<p className="text-[10px] text-gray-500 font-black uppercase tracking-tight mb-1">Company Goal</p>
<p className="text-xs font-bold text-gray-500">{task.companyName}
</p>
<p className="text-[10px] font-bold text-primary mt-1">₹{task.expectedProfit.toLocaleString()}
</p>
</div>
</div>
<div className="flex gap-3 mt-auto"> {(task.status === 'Salesman_Assigned' || task.status === 'Logistics_Scheduled') && ( <a href={`tel:${task.farmerPhone || '+910000000000'}`} title={`Call ${task.farmerName || 'Customer'}`} className="w-12 h-full flex items-center justify-center py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all shrink-0" >
<Phone className="w-4 h-4 text-gray-500" />
</a> )} {task.status === 'Salesman_Assigned' && ( <button onClick={() => handleStatusUpdate(task.id, 'Logistics_Scheduled')} className="flex-[1.5] flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all" >
<Truck className="w-4 h-4" /> Schedule Dispatch </button> )} {(task.status === 'Salesman_Assigned' || task.status === 'Logistics_Scheduled') && ( <button onClick={() => handleStatusUpdate(task.id, 'Completed')} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20" >
<CheckCircle2 className="w-4 h-4" /> Finalize Sale </button> )} {task.status === 'Completed' && ( <div className="w-full py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
<CheckCircle className="w-4 h-4" /> Transaction Settled </div> )}
</div>
</div> ))}
</div> )}
</div>
</main>
</div> );
}
