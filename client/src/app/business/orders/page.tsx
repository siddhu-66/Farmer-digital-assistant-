"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { orderService, Order, STATUS_CONFIG } from '@/services/orderService';
import { PackagePlus, Clock, CheckCircle, XCircle, Truck, Play, Star, MapPin, Calendar, Wheat, User, RefreshCw, Edit, Lock } from 'lucide-react';
import { businessRegistrationService, BusinessApplication } from "@/services/businessRegistrationService";

const STEPS = ['Pending', 'Approved', 'Assigned', 'In Progress', 'Completed'];

function StatusBadge({ status }: { status: Order['status'] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const s = status.toLowerCase();
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${cfg.bg} ${cfg.color}`}>
      {s === 'pending' && <Clock className="w-3 h-3" />}
      {s === 'approved' && <CheckCircle className="w-3 h-3" />}
      {s === 'assigned' && <Truck className="w-3 h-3" />}
      {s === 'in_progress' && <Play className="w-3 h-3" />}
      {s === 'completed' && <Star className="w-3 h-3" />}
      {s === 'rejected' && <XCircle className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

function ProgressBar({ status }: { status: Order['status'] }) {
  const s = status.toLowerCase();
  if (s === 'rejected') return null;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const step = cfg.step;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${i < step ? 'bg-blue-600 text-white' : i === step - 1 ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-bold whitespace-nowrap ${i < step ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded-full mb-4 transition-all ${i < step - 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function SalesmanOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessApp, setBusinessApp] = useState<BusinessApplication | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch business status first
      const app = await businessRegistrationService.getBusinessStatus();
      setBusinessApp(app);
  
      const sid = orderService.getCurrentSalesmanId();
      const fetchedOrders = await orderService.getSalesmanOrders(sid);
      setOrders([...fetchedOrders].reverse());
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-1">My Orders</h1>
            <p className="text-gray-500">Track all your customer demand orders in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} title="Refresh orders" aria-label="Refresh orders" className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/business/orders/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <PackagePlus className="w-5 h-5" /> Create Order
            </Link>
          </div>
        </header>

        {!loading && businessApp?.status !== 'approved' ? (
          <div className="glass-card p-16 text-center max-w-2xl mx-auto border-yellow-500/20 bg-yellow-500/5">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto border border-yellow-200">
              <Lock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-yellow-900 tracking-tighter italic">Orders Feature Locked 🔒</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              To create and manage customer demand orders, your business must be verified. 
              {businessApp?.status === 'rejected' 
                ? "Your application was rejected. Please re-submit with correct documents."
                : "Your application is currently under review by our compliance team."}
            </p>
            <Link href="/business" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">
              Return to Status Overview
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border border-blue-100">
              <PackagePlus className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-black mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Create your first order to get started</p>
            <Link href="/business/orders/create" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl">
              <PackagePlus className="w-4 h-4" /> Create First Order
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <div key={order.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                      <Wheat className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-xl font-black">{order.cropName}</h3>
                        <span className="text-gray-400 text-sm">·</span>
                        <span className="text-gray-600 font-bold text-sm">{order.quantity} {order.unit}</span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{order.customerName}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span className="truncate">{order.deliveryLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{order.requiredDate ? new Date(order.requiredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}</span>
                  </div>
                  {order.expectedPrice && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-green-500 font-bold">₹{order.expectedPrice}/{order.unit}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <ProgressBar status={order.status} />

                {/* Rejected state */}
                {order.status.toLowerCase() === 'rejected' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-bold text-red-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{order.rejectionReason}</p>
                    <Link
                      href={`/business/orders/edit/${order.id}`}
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit & Resubmit
                    </Link>
                  </div>
                )}

                {/* Assigned farmers */}
                {order.assignedFarmerIds && order.assignedFarmerIds.length > 0 && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                    <p className="text-xs font-black uppercase tracking-widest text-purple-600 mb-2">Assigned Farmers</p>
                    <div className="flex flex-wrap gap-2">
                      {order.assignedFarmerIds.map(fid => {
                        const resp = order.farmerResponses ? order.farmerResponses[fid] : 'notified';
                        return (
                          <span key={fid} className={`text-xs font-bold px-3 py-1 rounded-full border ${resp === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : resp === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            Farmer #{fid} {resp === 'accepted' ? '✓' : resp === 'rejected' ? '✗' : '⏳'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Created {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}</span>
                  {order.status.toLowerCase() === 'completed' && (
                    <span className="text-xs font-black text-green-600 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Order Fulfilled Successfully
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
