"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import FarmerGuard from '@/components/auth/FarmerGuard';
import { orderService, Order } from '@/services/orderService';
import { CheckCircle, XCircle, Wheat, MapPin, Calendar, User, Truck, RefreshCw, Clock, AlertCircle } from 'lucide-react';

function RequirementCard({ order, farmerId, onRespond }: { order: Order; farmerId: string; onRespond: () => void }) {
  const myResponse = order.farmerResponses ? order.farmerResponses[farmerId] : undefined;
  const [loading, setLoading] = useState(false);

  const respond = async (response: 'Accepted' | 'Declined') => {
    setLoading(true);
    try {
      await orderService.respondToOrder(order._id, response);
      onRespond();
    } catch (err) {
      console.error('Error responding to order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-card p-6 transition-all duration-300 ${myResponse === 'accepted' ? 'border-green-300' : myResponse === 'rejected' ? 'border-red-200 opacity-60' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shrink-0">
          <Wheat className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-xl font-black">{order.cropName}</h3>
            <span className="text-gray-500 font-bold">{order.quantity} {order.unit}</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">{order.id}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-3.5 h-3.5" />
            <span>Requested by: <span className="font-bold text-gray-700">{order.salesmanName}</span></span>
          </div>
        </div>
        {myResponse ? (
          <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${myResponse === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {myResponse === 'accepted' ? '✓ Accepted' : '✗ Declined'}
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> New Request
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivery Location</p>
          <p className="font-bold text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />{order.deliveryLocation}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Required By</p>
          <p className="font-bold text-sm flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />{order.requiredDate ? new Date(order.requiredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Date'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Status</p>
          <p className="font-bold text-sm">{order.status.toLowerCase() === 'in_progress' ? '🟢 In Progress' : '🟡 Awaiting Response'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Customer</p>
          <p className="font-bold text-sm">{order.customerName}</p>
        </div>
      </div>

      {order.expectedPrice && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-5">
          <p className="text-xs text-green-800 font-bold">💰 Expected Price: <span className="font-black">₹{order.expectedPrice} per {order.unit}</span></p>
        </div>
      )}

      {order.notes && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
          <p className="text-xs text-blue-600 font-black uppercase tracking-widest mb-1">Notes from Admin</p>
          <p className="text-sm text-blue-800">{order.notes}</p>
        </div>
      )}

      {!myResponse && (
        <div className="flex gap-3">
          <button
            onClick={() => respond('Declined')}
            disabled={loading}
            className="flex-1 py-3 border border-red-200 text-red-600 font-black rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Decline
          </button>
          <button
            onClick={() => respond('Accepted')}
            disabled={loading}
            className="flex-1 py-3 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Accept Requirement</>}
          </button>
        </div>
      )}

      {myResponse === 'accepted' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-black text-green-800 text-sm">You accepted this requirement!</p>
            <p className="text-xs text-green-600">Prepare your crop for delivery to {order.deliveryLocation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RequirementsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmerId, setFarmerId] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fid = localStorage.getItem('current_farmer_id') || 'farmer-demo';
      setFarmerId(fid);
      const fetchedOrders = await orderService.getFarmerOrders(fid);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching farmer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const newRequirements = orders.filter(o => !o.farmerResponses || !o.farmerResponses[farmerId] || o.farmerResponses[farmerId] === 'pending');
  const acceptedOrders = orders.filter(o => o.farmerResponses && o.farmerResponses[farmerId] === 'accepted');
  const declinedOrders = orders.filter(o => o.farmerResponses && o.farmerResponses[farmerId] === 'rejected');

  return (
    <FarmerGuard>
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted p-8 pt-10">
          <header className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black mb-1 text-gray-900">Crop Requirements</h1>
              <p className="text-gray-500">Admin-assigned crop demands waiting for your response</p>
            </div>
            <button onClick={fetchOrders} title="Refresh requirements" aria-label="Refresh requirements" className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </header>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'New Requests', value: newRequirements.length, color: 'text-orange-600 bg-orange-50 border-orange-100', icon: Clock },
              { label: 'Accepted', value: acceptedOrders.length, color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle },
              { label: 'Declined', value: declinedOrders.length, color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle },
            ].map(stat => (
              <div key={stat.label} className={`glass-card p-5 flex items-center gap-4 border ${stat.color}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-6 border border-green-100">
                <Truck className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-black mb-2">No Requirements Yet</h2>
              <p className="text-gray-500 max-w-sm">
                {"The admin hasn't assigned any crop demands to you yet. Check back later!"}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {newRequirements.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <h2 className="font-black text-sm uppercase tracking-widest text-orange-600">New Requests ({newRequirements.length})</h2>
                  </div>
                  <div className="space-y-4">
                    {newRequirements.map(order => (
                      <RequirementCard key={order.id} order={order} farmerId={farmerId} onRespond={fetchOrders} />
                    ))}
                  </div>
                </div>
              )}
              {acceptedOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <h2 className="font-black text-sm uppercase tracking-widest text-green-600">Accepted ({acceptedOrders.length})</h2>
                  </div>
                  <div className="space-y-4">
                    {acceptedOrders.map(order => (
                      <RequirementCard key={order.id} order={order} farmerId={farmerId} onRespond={fetchOrders} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </FarmerGuard>
  );
}
