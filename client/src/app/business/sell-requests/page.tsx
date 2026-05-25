"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { sellRequestService, SellRequest, SellRequestStatus } from '@/services/sellRequestService';
import { ClipboardList, RefreshCw, AlertCircle, Truck, XCircle, CheckCircle2 } from 'lucide-react';

function StatusBadge({ status }: { status: SellRequestStatus }) {
  const cfg: Record<SellRequestStatus, { bg: string; color: string }> = {
    PENDING: { bg: 'bg-yellow-500/10', color: 'text-yellow-500' },
    APPROVED_BY_ADMIN: { bg: 'bg-green-500/10', color: 'text-green-500' },
    REJECTED_BY_ADMIN: { bg: 'bg-red-500/10', color: 'text-red-500' },
    SENT_TO_BUSINESS: { bg: 'bg-blue-500/10', color: 'text-blue-400' },
    ACCEPTED_BY_BUSINESS: { bg: 'bg-primary/10', color: 'text-primary' },
    REJECTED_BY_BUSINESS: { bg: 'bg-red-500/10', color: 'text-red-500' },
    COMPLETED: { bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  };
  const c = cfg[status];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border ${c.bg} ${c.color}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function BusinessSellRequestsPage() {
  const { role } = useAuth();

  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [businessRemarksByRequestId, setBusinessRemarksByRequestId] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await sellRequestService.getAssignedSellRequestsForBusiness();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role && role !== 'business') return;
    void load();
  }, [role]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAccept = async (requestId: string) => {
    setActionLoadingId(requestId);
    setError(null);
    try {
      const businessRemarks = businessRemarksByRequestId[requestId] || undefined;
      await sellRequestService.acceptSellRequestByBusiness(requestId, businessRemarks);
      await load();
      setBusinessRemarksByRequestId((prev) => ({ ...prev, [requestId]: '' }));
      setSuccess('Request accepted successfully.');
    } catch (err) {
      console.error(`[Frontend] Business Accept Error:`, err);
      setError(err instanceof Error ? err.message : 'Failed to accept request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoadingId(requestId);
    setError(null);
    try {
      const businessRemarks = businessRemarksByRequestId[requestId] || undefined;
      await sellRequestService.rejectSellRequestByBusiness(requestId, businessRemarks);
      await load();
      setBusinessRemarksByRequestId((prev) => ({ ...prev, [requestId]: '' }));
      setSuccess('Request rejected successfully.');
    } catch (err) {
      console.error(`[Frontend] Business Reject Error:`, err);
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (role && role !== 'business') return null;

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-4xl font-black mb-2">Assigned Crop Requests</h1>
            <p className="text-gray-500">Accept or reject requests forwarded by admin.</p>
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm font-bold">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No assigned requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const businessRemarks = businessRemarksByRequestId[r._id] || '';
              const canAct = r.status === 'SENT_TO_BUSINESS';
              return (
                <div key={r._id} className="glass-card p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
                          <Truck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-black text-lg">{r.cropName}</h3>
                          <p className="text-sm text-gray-600 font-medium">
                            Location: <span className="font-black">{r.location}</span>
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            Quantity: <span className="font-black">{r.quantity}</span> Qtl
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            Expected: <span className="font-black">₹{Number(r.expectedPrice).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      {r.description && <p className="text-sm text-gray-500 mt-3">{r.description}</p>}

                      <div className="mt-3">
                        <StatusBadge status={r.status} />
                      </div>
                    </div>

                    <div className="w-full md:w-[420px] space-y-3">
                      {canAct ? (
                        <>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Business Remarks (optional)</span>
                            <input
                              value={businessRemarks}
                              onChange={(e) => setBusinessRemarksByRequestId((prev) => ({ ...prev, [r._id]: e.target.value }))}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                              placeholder="e.g., Accepted conditionally"
                            />
                          </label>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => handleAccept(r._id)}
                              disabled={actionLoadingId === r._id}
                              className="flex-1 px-4 py-3 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10 disabled:opacity-60"
                            >
                              <CheckCircle2 className="inline w-4 h-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(r._id)}
                              disabled={actionLoadingId === r._id}
                              className="flex-1 px-4 py-3 bg-red-500/10 text-red-500 font-black rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-60"
                            >
                              <XCircle className="inline w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          {r.businessRemarks && (
                            <p className="text-xs text-gray-500">
                              Business remarks: <span className="font-bold">{r.businessRemarks}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

