"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { ClipboardList, RefreshCw, AlertCircle, Clock, ShieldCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { sellRequestService, SellRequest, SellRequestStatus } from '@/services/sellRequestService';

function StatusBadge({ status }: { status: SellRequestStatus }) {
  const cfg: Record<SellRequestStatus, { bg: string; color: string; icon: React.ReactNode }> = {
    PENDING: { bg: 'bg-yellow-500/10', color: 'text-yellow-500', icon: <Clock className="w-3.5 h-3.5" /> },
    APPROVED_BY_ADMIN: { bg: 'bg-green-500/10', color: 'text-green-500', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    REJECTED_BY_ADMIN: { bg: 'bg-red-500/10', color: 'text-red-500', icon: <XCircle className="w-3.5 h-3.5" /> },
    SENT_TO_BUSINESS: { bg: 'bg-blue-500/10', color: 'text-blue-400', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    ACCEPTED_BY_BUSINESS: { bg: 'bg-primary/10', color: 'text-primary', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    REJECTED_BY_BUSINESS: { bg: 'bg-red-500/10', color: 'text-red-500', icon: <XCircle className="w-3.5 h-3.5" /> },
    COMPLETED: { bg: 'bg-emerald-500/10', color: 'text-emerald-500', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  };
  const c = cfg[status] ?? cfg.PENDING;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border ${c.bg} ${c.color}`}>
      {c.icon} {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function FarmerRequestsPage() {
  const { role } = useAuth();

  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sellRequestService.getMySellRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role && role !== 'farmer') return;
    void load();
  }, [role]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (role && role !== 'farmer') return null;

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-4xl font-black mb-2">My Requests</h1>
            <p className="text-gray-500">Track your sell request from Pending → Forwarded → Final decision.</p>
          </div>
          <button
            onClick={() => load()}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm font-bold flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No sell requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r._id} className="glass-card p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-5 hover:shadow-md transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 shrink-0">
                      <Truck className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-lg truncate">{r.cropName}</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Location: <span className="font-black">{r.location}</span>
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        Quantity: <span className="font-black">{r.quantity}</span> Qtl
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        Expected: <span className="font-black">₹{r.expectedPrice.toLocaleString()}</span>
                      </p>
                      {r.description && <p className="text-sm text-gray-500 mt-2">{r.description}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                  <StatusBadge status={r.status} />
                  {r.adminRemarks && (
                    <p className="text-xs text-gray-500 max-w-md text-right">
                      Admin: {r.adminRemarks}
                    </p>
                  )}
                  {r.businessRemarks && (
                    <p className="text-xs text-gray-500 max-w-md text-right">
                      Business: {r.businessRemarks}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Created {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

