"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
   Loader2, CheckCircle, Search, ListFilter, Truck, Wallet, 
  MapPin, ShoppingCart, IndianRupee, Gavel, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import KYCStatusBanner from '@/components/shared/KYCStatusBanner';
import PortalBackground from '@/components/backgrounds/PortalBackground';
import { listingService, Listing } from '@/services/listingService';
import { bidService, Bid } from '@/services/bidService';
import { orderService } from '@/services/orderService';

type SalesmanTab = 'market' | 'bids' | 'deals' | 'payments';

export default function SalesmanDashboard() {
  const router = useRouter();
  const { role } = useAuth();
  
  const [activeTab, setActiveTab] = useState<SalesmanTab>('market');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [activeDeals, setActiveDeals] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeBids: 0, completedDeals: 0, totalProcured: 0 });

  // Filters
  const [filter, setFilter] = useState({ crop: '', minPrice: '', quality: '' });
  
  // Bidding Modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidPrice, setBidPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'market') {
        // Use verified farmer listings for business users
        const data = await listingService.getVerifiedFarmerListings();
        setListings(data);
      } else if (activeTab === 'bids') {
        const data = await bidService.getMyBids();
        setMyBids(data);
      } else if (activeTab === 'deals') {
        const data = await orderService.getOrders();
        setActiveDeals(Array.isArray(data) ? data : []);
      }
      
      // Load quick stats (Mocked for now or aggregate from data)
      setStats({
        activeBids: 4,
        completedDeals: 12,
        totalProcured: 850000
      });
    } catch (err) {
      console.error('[Business Dashboard] Failed to sync salesman data', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (role !== 'business' && role !== 'salesman') {
      router.push('/signin');
      return;
    }
    loadData();
  }, [role, router, loadData]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setIsSubmitting(true);
    try {
      await bidService.placeBid({
        listingId: selectedListing._id,
        offeredPrice: bidPrice,
        quantity: selectedListing.quantity
      });
      alert('Bid placed successfully!');
      setSelectedListing(null);
      setActiveTab('bids');
    } catch (_err) {
      alert('Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredListings = listings.filter(l => {
    return (!filter.crop || l.crop.toLowerCase().includes(filter.crop.toLowerCase())) &&
           (!filter.quality || l.qualityGrade === filter.quality);
  });

  if (role !== 'business' && role !== 'salesman') return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PortalBackground type="business" />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main main-content-shifted p-8 pt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Market procurement and logistics management</p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <KYCStatusBanner role={role === 'salesman' ? 'salesman' : 'business'} />

        {/* Salesman Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalProcured.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Procurement Capital</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeBids}</p>
            <p className="text-sm text-gray-600 mt-1">Market Exposure</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Queue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">2</p>
            <p className="text-sm text-gray-600 mt-1">Logistics Queue</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-8">
          <div className="flex gap-1">
            {(['market', 'bids', 'deals', 'payments'] as SalesmanTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab === 'market' ? 'Market Feed' : tab === 'bids' ? 'My Bids' : tab === 'deals' ? 'Logistics' : 'Payments'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="min-h-[600px]">
          {loading ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 animate-pulse">Syncing Market Channels</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'market' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left: Filters */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ListFilter size={16} className="text-gray-500" />
                        Market Filter
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Crop Type</label>
                          <input 
                            placeholder="e.g. Wheat"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            value={filter.crop} onChange={e => setFilter({...filter, crop: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Quality Grade</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                            value={filter.quality} onChange={e => setFilter({...filter, quality: e.target.value})}
                          >
                            <option value="">All Grades</option>
                            <option value="A+">Premium (A+)</option>
                            <option value="A">High (A)</option>
                            <option value="B">Standard (B)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Listing Feed */}
                  <div className="lg:col-span-3 space-y-4">
                    {filteredListings.length > 0 ? filteredListings.map(listing => (
                      <div key={listing._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-gray-900">{listing.crop}</h4>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{listing.qualityGrade}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {listing.location.district}, {listing.location.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingCart size={12} />
                                  {listing.quantity} {listing.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 font-medium mb-1">Price/Unit</p>
                              <p className="text-xl font-bold text-green-600">₹{listing.pricePerUnit}</p>
                            </div>
                            <button 
                              onClick={() => { setSelectedListing(listing); setBidPrice(listing.pricePerUnit); }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Place Bid
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No listings found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'bids' && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-black mb-8 italic flex items-center gap-3"><Gavel className="text-blue-500"/> My Active Bids</h3>
                  <div className="space-y-4">
                    {myBids.map(bid => (
                      <div key={bid._id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center font-bold">₹</div>
                          <div>
                            <p className="font-bold">{typeof bid.listing === 'object' ? bid.listing.crop : 'Crop'}</p>
                            <p className="text-[10px] font-black uppercase text-gray-500">Offer: ₹{bid.offeredPrice} • Status: {bid.status.toUpperCase()}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          bid.status === 'accepted' ? 'bg-green-500 text-black' : 
                          bid.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'deals' && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-black mb-8 italic flex items-center gap-3"><Truck className="text-orange-500"/> Active Logistics Tracking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeDeals.length > 0 ? activeDeals.map(deal => (
                      <div key={deal._id || Math.random()} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            {/* FIXED: deal._id can be undefined → safe slice */}
                            <p className="text-xs font-black uppercase text-gray-500 tracking-widest mb-1">Order #{(deal._id || '??????').slice(-6)}</p>
                            {/* FIXED: deal.listing optional chain */}
                            <h4 className="text-xl font-black uppercase">{deal.listing?.crop || deal.crop || 'Order'}</h4>
                          </div>
                          <span className="p-2 bg-orange-500/10 text-orange-500 rounded-lg animate-pulse"><Truck size={20}/></span>
                        </div>
                        
                        {/* Transport Timeline */}
                        <div className="relative pt-6">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                          <div className="space-y-8 relative">
                            <TimelineItem active label="Dispatched from Farm" sub="Verified by Farmer" />
                            <TimelineItem active={deal.status === 'in-transit' || deal.status === 'delivered'} label="In Transit" sub="En Route to Warehouse" />
                            <TimelineItem active={deal.status === 'delivered'} label="Arrived at Hub" sub="Final Inspection Pending" />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-16 text-gray-500 italic">No active logistics orders found.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="glass-card p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <Wallet className="w-16 h-16 text-green-500/30 mb-6" />
                  <h3 className="text-2xl font-black italic mb-2 tracking-tight">Escrow Ledger</h3>
                  <p className="text-gray-500 text-sm max-w-sm font-medium">Your secure procurement wallet and automated payout history will appear here once deals are finalized.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Place Bid Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 blur-none">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedListing(null)}></div>
          <form onSubmit={handlePlaceBid} className="glass-card p-10 max-w-lg w-full relative z-10 border-blue-500/30 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black italic tracking-tighter text-blue-400 mb-8 uppercase">Procurement Request</h3>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl mb-8 space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Asset Category</p>
              <div className="flex justify-between items-end">
                <h4 className="text-2xl font-black uppercase tracking-tight">{selectedListing.crop}</h4>
                <p className="text-sm font-bold text-blue-400">{selectedListing.quantity} {selectedListing.unit}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Offer Price per {selectedListing.unit}</label>
                <div className="relative">
                  <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={24}/>
                  <input 
                    type="number"
                    title="Bid Price"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-16 py-5 text-3xl font-black text-white focus:border-blue-500 focus:bg-blue-500/10 transition-all outline-none"
                    value={bidPrice}
                    onChange={e => setBidPrice(+e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">
                <span>Total Value</span>
                <span className="text-blue-400">₹{(bidPrice * selectedListing.quantity).toLocaleString()}</span>
              </div>

              <button 
                className="w-full py-5 bg-blue-500 text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-400 active:scale-95 transition-all mt-4"
              >
                {isSubmitting ? 'Authenticating Bid...' : 'Finalize Procurement Bid'}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}

function TimelineItem({ active, label, sub }: { active: boolean, label: string, sub: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-700 ${active ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/40' : 'bg-transparent border-white/10 text-gray-500'}`}>
        <CheckCircle size={16} />
      </div>
      <div>
        <p className={`text-sm font-black uppercase tracking-tight ${active ? 'text-white' : 'text-gray-500'}`}>{label}</p>
        <p className="text-[10px] font-bold text-gray-500 leading-tight">{sub}</p>
      </div>
    </div>
  );
}
