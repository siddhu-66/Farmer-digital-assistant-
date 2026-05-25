"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { ClipboardList, RefreshCw, AlertCircle, ShieldCheck, XCircle, Truck } from 'lucide-react';
import { sellRequestService, SellRequest, SellRequestStatus, BusinessDirectoryItem } from '@/services/sellRequestService';

type AdminStatusTab = 'PENDING' | 'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' | 'SENT_TO_BUSINESS' | 'ACCEPTED_BY_BUSINESS' | 'REJECTED_BY_BUSINESS' | 'COMPLETED' | 'ALL';

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

export default function AdminSellRequestsPage() {
  const { role } = useAuth();
  const [tab, setTab] = useState<AdminStatusTab>('PENDING');

  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [businesses, setBusinesses] = useState<BusinessDirectoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [adminRemarksByRequestId, setAdminRemarksByRequestId] = useState<Record<string, string>>({});
  const [selectedBusinessmanByRequestId, setSelectedBusinessmanByRequestId] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const visibleRequests = useMemo(() => {
    if (tab === 'ALL') return requests;
    return requests.filter((r) => r.status === tab);
  }, [requests, tab]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const [biz, reqs] = await Promise.all([
        sellRequestService.getAllBusinessesForAdmin(),
        sellRequestService.getAllSellRequests(tab === 'ALL' ? undefined : (tab as SellRequestStatus)),
      ]);

      setBusinesses(Array.isArray(biz) ? biz : []);
      setRequests(Array.isArray(reqs) ? reqs : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (role && role !== 'admin') return;
    void load();
  }, [load, role, tab]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAssign = async (requestId: string, assignedBusinessId: string) => {
    if (!assignedBusinessId) {
      setError('Please select a businessman.');
      return;
    }
    setActionLoadingId(requestId);
    setError(null);
    try {
      const adminRemarks = adminRemarksByRequestId[requestId] || undefined;
      await sellRequestService.assignSellRequest(requestId, assignedBusinessId, adminRemarks);
      await load();
      setAdminRemarksByRequestId((prev) => ({ ...prev, [requestId]: '' }));
      setSuccess('Request forwarded successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to forward request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoadingId(requestId);
    setError(null);
    try {
      const adminRemarks = adminRemarksByRequestId[requestId] || undefined;
      await sellRequestService.rejectSellRequestByAdmin(requestId, adminRemarks);
      await load();
      setAdminRemarksByRequestId((prev) => ({ ...prev, [requestId]: '' }));
      setSuccess('Request rejected successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (role && role !== 'admin') return null;

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-4xl font-black mb-2">All Farmer Requests</h1>
            <p className="text-gray-500">Verify the request, then forward it to a selected business.</p>
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

        <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          {(['PENDING', 'APPROVED_BY_ADMIN', 'SENT_TO_BUSINESS', 'ACCEPTED_BY_BUSINESS', 'REJECTED_BY_ADMIN', 'REJECTED_BY_BUSINESS', 'COMPLETED', 'ALL'] as AdminStatusTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-base font-black transition-all whitespace-nowrap ${
                tab === t ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleRequests.map((r) => {
              const selectedBusinessmanId = selectedBusinessmanByRequestId[r._id] || '';
              const adminRemarks = adminRemarksByRequestId[r._id] || '';
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
                      {r.status === 'PENDING' ? (
                        <>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Select Businessman</span>
                            <select
                              value={selectedBusinessmanId}
                              onChange={(e) => setSelectedBusinessmanByRequestId((prev) => ({ ...prev, [r._id]: e.target.value }))}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                            >
                              <option value="">-- Choose --</option>
                              {businesses.map((b) => (
                                <option key={b._id} value={b._id}>
                                  {b.orgName}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Admin Remarks (optional)</span>
                            <input
                              value={adminRemarks}
                              onChange={(e) => setAdminRemarksByRequestId((prev) => ({ ...prev, [r._id]: e.target.value }))}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
                              placeholder="e.g., Looks valid"
                            />
                          </label>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => handleAssign(r._id, selectedBusinessmanId)}
                              disabled={actionLoadingId === r._id}
                              className="flex-1 px-4 py-3 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10 disabled:opacity-60"
                              title="Verify and forward to selected business"
                            >
                              <ShieldCheck className="inline w-4 h-4 mr-2" />
                              Verify & Send
                            </button>
                            <button
                              onClick={() => handleReject(r._id)}
                              disabled={actionLoadingId === r._id}
                              className="flex-1 px-4 py-3 bg-red-500/10 text-red-500 font-black rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-60"
                              title="Reject this request"
                            >
                              <XCircle className="inline w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">
                            Admin remarks: <span className="font-bold">{r.adminRemarks || '-'}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Business remarks: <span className="font-bold">{r.businessRemarks || '-'}</span>
                          </p>
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

