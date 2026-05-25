"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { orderService, Order, STATUS_CONFIG } from '@/services/orderService';
import { farmerRegistrationService, FarmerApplication } from '@/services/farmerRegistrationService';
import { ClipboardList, CheckCircle, XCircle, Users, MapPin, Calendar, Wheat, Send, X, Star, RefreshCw } from 'lucide-react';

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<FarmerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'done'>('pending');

  // Dialog state
  const [selected, setSelected] = useState<Order | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allOrders, farmerApps] = await Promise.all([
        orderService.getOrders(),
        farmerRegistrationService.getAllApplications().then(apps => {
          if (typeof window === 'undefined') return apps;
          const raw = localStorage.getItem('farmer_assistant_farmer_apps');
          const localApps = raw ? JSON.parse(raw) as FarmerApplication[] : [];
          return [...apps, ...localApps];
        }),
      ]);
      setOrders([...allOrders].reverse());
      setFarmers(farmerApps);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending');
  const activeOrders = orders.filter(o => ['approved', 'assigned', 'in_progress'].includes(o.status.toLowerCase()));
  const doneOrders = orders.filter(o => ['completed', 'rejected'].includes(o.status.toLowerCase()));

  const handleApprove = async () => {
    if (!selected || selectedFarmers.length === 0) return;
    setActionLoading(true);
    try {
      await orderService.assignFarmers(selected._id, selectedFarmers);
      await orderService.updateStatus(selected._id, 'Assigned');
      setSelected(null);
      setSelectedFarmers([]);
      fetchAll();
    } catch (err) {
      console.error('Error approving order:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await orderService.updateStatus(selected._id, 'Rejected', rejectReason);
      setSelected(null);
      setRejecting(false);
      setRejectReason('');
      fetchAll();
    } catch (err) {
      console.error('Error rejecting order:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (orderId: string) => {
    try {
      await orderService.updateStatus(orderId, 'Completed');
      fetchAll();
    } catch (err) {
      console.error('Error completing order:', err);
    }
  };

  const toggleFarmer = (fid: string) =>
    setSelectedFarmers(prev =>
      prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]
    );

  const displayedOrders = activeTab === 'pending' ? pendingOrders : activeTab === 'active' ? activeOrders : doneOrders;

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-1">Order Management</h1>
            <p className="text-gray-500">Review, approve, and assign farmer orders</p>
          </div>
          <button onClick={fetchAll} title="Refresh orders" aria-label="Refresh orders" className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          {[
            { id: 'pending', label: 'Awaiting Approval', count: pendingOrders.length, color: 'text-yellow-600 border-yellow-500' },
            { id: 'active', label: 'Active Orders', count: activeOrders.length, color: 'text-blue-600 border-blue-500' },
            { id: 'done', label: 'Completed / Rejected', count: doneOrders.length, color: 'text-gray-600 border-gray-500' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-4 text-base font-black flex items-center gap-2 transition-all ${activeTab === tab.id ? `${tab.color} border-b-2` : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-black">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No orders in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map(order => (
              <div key={order.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 shrink-0">
                    <Wheat className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-black text-lg">{order.cropName}</h3>
                      <span className="text-gray-500 text-sm font-bold">{order.quantity} {order.unit}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">{order.id}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Customer: <span className="font-black">{order.customerName}</span></p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.deliveryLocation}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />By {order.requiredDate ? new Date(order.requiredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Date'}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />By: {order.salesmanName}</span>
                    </div>
                    {order.assignedFarmerIds && order.assignedFarmerIds.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {order.assignedFarmerIds.map(fid => (
                          <span key={fid} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.farmerResponses && order.farmerResponses[fid] === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : order.farmerResponses && order.farmerResponses[fid] === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            F#{fid} {order.farmerResponses && order.farmerResponses[fid] === 'accepted' ? '✓' : order.farmerResponses && order.farmerResponses[fid] === 'rejected' ? '✗' : '⏳'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  <OrderStatusBadge status={order.status} />
                  {order.status.toLowerCase() === 'pending' && (
                    <button onClick={() => { setSelected(order); setRejecting(false); }} className="px-5 py-2.5 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-700 transition-all text-sm">
                      Review & Assign
                    </button>
                  )}
                  {order.status.toLowerCase() === 'in_progress' && (
                    <button onClick={() => handleComplete(order._id)} className="px-5 py-2.5 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all text-sm flex items-center gap-2">
                      <Star className="w-4 h-4" /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review/Assign Dialog */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setSelected(null); setRejecting(false); setSelectedFarmers([]); }} />
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">Review Order</h2>
                  <p className="text-gray-500 text-sm">{selected.id} · {selected.cropName}</p>
                </div>
                <button onClick={() => { setSelected(null); setRejecting(false); setSelectedFarmers([]); }} title="Close dialog" aria-label="Close dialog" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Customer', value: selected.customerName },
                    { label: 'Crop', value: selected.cropName },
                    { label: 'Quantity', value: `${selected.quantity} ${selected.unit}` },
                    { label: 'Expected Price', value: selected.expectedPrice ? `₹${selected.expectedPrice}/${selected.unit}` : 'Not specified' },
                    { label: 'Delivery Location', value: selected.deliveryLocation },
                    { label: 'Required By', value: selected.requiredDate ? new Date(selected.requiredDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'No Date' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className="font-bold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
                {selected.notes && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-black text-blue-600 mb-1 uppercase tracking-widest">Notes</p>
                    <p className="text-sm text-blue-800">{selected.notes}</p>
                  </div>
                )}

                {!rejecting && (
                  <div>
                    <p className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Select Farmers to Assign
                    </p>
                    {farmers.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        No registered farmers found. Farmers must complete registration first.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {farmers.map(farmer => (
                          <label key={farmer.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFarmers.includes(farmer.id) ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                              type="checkbox"
                              checked={selectedFarmers.includes(farmer.id)}
                              onChange={() => toggleFarmer(farmer.id)}
                              className="w-4 h-4 accent-green-500"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-sm">{farmer.farmerName}</p>
                              <p className="text-xs text-gray-500">{farmer.location} · {farmer.landArea} acres · {farmer.primaryCrops.slice(0, 2).join(', ')}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${farmer.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {farmer.status}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {rejecting && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-red-500 mb-2 block">Rejection Reason *</label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. Invalid request / unrealistic quantity"
                      className="w-full border border-red-300 bg-red-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                {!rejecting ? (
                  <div className="flex gap-3">
                    <button onClick={() => setRejecting(true)} className="flex-1 py-3 border border-red-200 text-red-600 font-black rounded-xl hover:bg-red-50 transition-all">
                      <XCircle className="w-4 h-4 inline mr-2" />Reject
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={selectedFarmers.length === 0 || actionLoading}
                      className="flex-2 flex-1 py-3 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Approve & Assign ({selectedFarmers.length})</>}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setRejecting(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-black rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
                    <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading} className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Confirm Rejection</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
