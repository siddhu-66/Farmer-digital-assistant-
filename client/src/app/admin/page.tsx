"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
   Users, Tractor, 
  TrendingUp, RefreshCw, CheckCircle, XCircle, AlertTriangle, Loader2,
  FilePlus, Trash2, IndianRupee, User as UserIcon, Gavel
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import PortalBackground from '@/components/backgrounds/PortalBackground';
import { adminService, AdminAnalytics, PendingUser } from '@/services/adminService';
import { listingService, Listing } from '@/services/listingService';

type AdminTab = 'verifications' | 'listings' | 'transactions' | 'schemes' | 'analytics';

export default function AdminDashboard() {
  const router = useRouter();
  const { role } = useAuth();
  
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('verifications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  // Tab-specific data
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<{bids: any[], orders: any[]}>({bids: [], orders: []});
  const [schemeForm, setSchemeForm] = useState({ title: '', description: '', eligibility: '', category: 'subsidy', state: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await adminService.getAnalytics();
      // Guard: stats may be null in simulation/offline mode
      setAnalytics(stats ?? null);

      if (activeTab === 'verifications') {
        const users = await adminService.getPendingUsers();
        setPendingUsers(Array.isArray(users) ? users : []);
      } else if (activeTab === 'listings') {
        const list = await listingService.getAllListings();
        setAllListings(Array.isArray(list) ? list : []);
      } else if (activeTab === 'transactions') {
        const txs = await adminService.getAllTransactions();
        // Guard: API may return null or a partial object
        setTransactions({
          bids: Array.isArray(txs?.bids) ? txs.bids : [],
          orders: Array.isArray(txs?.orders) ? txs.orders : [],
        });
      }
    } catch (err) {
      console.error('[AdminDashboard] Data sync failed:', err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/signin');
      return;
    }
    loadData();
  }, [role, router, loadData]);

  const handleVerify = async (userId: string, action: 'approve' | 'reject', roleType: string) => {
    setActionLoadingId(userId);
    setError(null);
    setSuccess(null);
    try {
      await adminService.verifyUser(userId, action, '', roleType);
      setSuccess(`User successfully ${action}d!`);
      await loadData();
      
      // Show success for 3 seconds then clear
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(`[Frontend] Verify error:`, err);
      setError('Verification action failed');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleModerate = async (listingId: string, action: 'delete') => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await adminService.moderateListing(listingId, action);
      loadData();
    } catch (_err) {
      alert('Moderation failed');
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createScheme(schemeForm);
      alert('Government scheme published successfully!');
      setSchemeForm({ title: '', description: '', eligibility: '', category: 'subsidy', state: '' });
      setActiveTab('analytics');
    } catch (_err) {
      alert('Failed to publish scheme');
    }
  };

  if (role !== 'admin') return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PortalBackground type="admin" />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main main-content-shifted p-8 pt-10 relative z-10">
        <div className="app-card mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">System overview and management</p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="app-button-primary flex items-center gap-2"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        
        {/* Success Banner */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-3">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        {/* Global Stats */}
        <div className="app-grid mb-8">
          <div className="app-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="app-badge app-badge-success">Verified</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.users?.farmers ?? 0}</p>
            <p className="text-sm text-gray-600 mt-1">Farmers</p>
          </div>
          <div className="app-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <span className="app-badge app-badge-info">Salesmen</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.users?.salesmen ?? 0}</p>
            <p className="text-sm text-gray-600 mt-1">Salesmen</p>
          </div>
          <div className="app-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="app-badge app-badge-success">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.listings?.active ?? 0}</p>
            <p className="text-sm text-gray-600 mt-1">Active Listings</p>
          </div>
          <div className="app-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Gavel className="w-5 h-5 text-purple-600" />
              </div>
              <span className="app-badge app-badge-warning">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.users?.pendingKYCs ?? 0}</p>
            <p className="text-sm text-gray-600 mt-1">Pending KYCs</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-8">
          <div className="flex gap-1">
            {(['verifications', 'listings', 'transactions', 'schemes', 'analytics'] as AdminTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 animate-pulse">Syncing Secure Channels</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'verifications' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">KYC Verification Queue</h3>
                  </div>
                  <div className="p-6">
                    {pendingUsers.length > 0 ? (
                      <div className="space-y-4">
                        {pendingUsers.map(user => (
                          <div key={user._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.role} • {user.mobile || user.phone}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                disabled={actionLoadingId === user._id} 
                                onClick={() => handleVerify(user._id, 'reject', user.role)} 
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                              >
                                {actionLoadingId === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              </button>
                              <button 
                                disabled={actionLoadingId === user._id} 
                                onClick={() => handleVerify(user._id, 'approve', user.role)} 
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                              >
                                {actionLoadingId === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No pending verifications</p>
                        <p className="text-sm text-gray-400 mt-1">All systems are clear</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'listings' && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-black mb-8 italic">Market Moderation</h3>
                  <div className="grid gap-4">
                    {allListings.map(listing => (
                      <div key={listing._id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group transition-all hover:bg-white/[0.08]">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center"><Tractor /></div>
                          <div>
                            <p className="font-bold">{listing.crop}</p>
                            <p className="text-[10px] uppercase font-black text-gray-400 italic">Expected: ₹{listing.pricePerUnit} • Quantity: {listing.quantity}</p>
                          </div>
                        </div>
                        <button title="Moderate" onClick={() => handleModerate(listing._id, 'delete')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-black mb-8 italic">Audit Trail: Live Market Deals</h3>
                  <div className="space-y-4">
                    {transactions.bids.length > 0 ? transactions.bids.map((bid, i) => (
                      <div key={i} className="p-5 border border-white/5 rounded-2xl flex justify-between items-center bg-white/[0.02]">
                        <div className="flex gap-4 items-center" title="Bid Details">
                          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><IndianRupee size={20} /></div>
                          <div>
                            <p className="text-sm font-bold">{bid?.salesman?.name || 'Unknown'} bid on {bid?.listing?.crop || 'Crop'}</p>
                            <p className="text-[10px] text-gray-500 font-black">VALUE: ₹{((bid?.offeredPrice || 0) * (bid?.quantity || 0)).toLocaleString()} • STATUS: {(bid?.status || 'unknown').toUpperCase()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-500">{bid?.createdAt ? new Date(bid.createdAt).toLocaleDateString() : '—'}</span>
                      </div>
                    )) : (
                      <div className="text-center py-16 text-gray-500 italic">No transaction records found.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'schemes' && (
                <div className="glass-card p-8 bg-blue-500/5 border-blue-500/20">
                  <h3 className="text-xl font-black mb-8 italic flex items-center gap-3"><FilePlus className="text-blue-500" /> Scheme Factory</h3>
                  <form onSubmit={handleAddScheme} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <input 
                        className="glass-input" 
                        placeholder="Scheme Title (e.g. PM-KISAN v2)" 
                        value={schemeForm.title} onChange={e => setSchemeForm({...schemeForm, title: e.target.value})} 
                        required 
                      />
                      <select 
                        title="Category"
                        className="glass-input" 
                        value={schemeForm.category} onChange={e => setSchemeForm({...schemeForm, category: e.target.value})}
                      >
                        <option value="subsidy">Subsidy</option>
                        <option value="insurance">Insurance</option>
                        <option value="loan">Crop Loan</option>
                      </select>
                      <input 
                        className="glass-input" 
                        placeholder="Target State (Optional)" 
                        value={schemeForm.state} onChange={e => setSchemeForm({...schemeForm, state: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-4">
                      <textarea 
                        className="glass-input h-[100px] resize-none" 
                        placeholder="Detailed Description" 
                        value={schemeForm.description} onChange={e => setSchemeForm({...schemeForm, description: e.target.value})} 
                        required 
                      />
                      <input 
                        className="glass-input" 
                        placeholder="Eligibility Criteria" 
                        value={schemeForm.eligibility} onChange={e => setSchemeForm({...schemeForm, eligibility: e.target.value})} 
                        required 
                      />
                    </div>
                    <button type="submit" className="md:col-span-2 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all uppercase tracking-widest text-xs">
                      Publish Government Scheme
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-black mb-6 italic">System Core Integrity</h3>
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span className="text-gray-400">Database Sync</span><span className="text-green-500">99.9%</span></div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[99.9%]" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-2"><span className="text-gray-400">System Uptime</span><span className="text-blue-500">99.9%</span></div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[99%]" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-8 border-red-500/20 bg-red-500/5">
                    <h3 className="text-xl font-black mb-6 italic text-red-500 flex items-center gap-3"><AlertTriangle /> Threat Analysis</h3>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-xs font-bold text-gray-300">Active Vulnerabilities: <span className="text-green-500">0</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
