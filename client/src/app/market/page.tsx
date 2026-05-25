"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import FarmerGuard from '@/components/auth/FarmerGuard';
import { RefreshCw, ShoppingBag, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { marketService, MarketPrice } from '@/services/marketService';
import { SaleEntryForm } from '@/components/forms/SaleEntryForm';
import B2BMarketplace from '@/components/market/B2BMarketplace';
import { SellToBusinessForm } from '@/components/forms/SellToBusinessForm';
import { b2bService, B2BRequest } from '@/services/b2bService';
import { B2BRequestsList } from '@/components/market/B2BRequestsList';
import { FeedCard } from '@/components/ui/FeedCard';
import { FeedFilters } from '@/components/ui/FeedFilters';

export default function Market() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'mandi' | 'b2b' | 'requests'>('mandi');
  const [selectedB2BCompany, setSelectedB2BCompany] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<B2BRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ state: '' });

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await marketService.getMarketPrices({ state: filters.state });
      setPrices(data);
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.state]);

  const fetchRequests = () => {
    const data = b2bService.getFarmerRequests('farmer-123');
    setMyRequests(data);
  };

  useEffect(() => {
    fetchPrices();
    fetchRequests();

    // Subscribe to live price updates
    const unsubscribePrices = marketService.subscribeToLivePrices((update) => {
      setPrices(prev => prev.map(p => {
        if (p.id === update.cropId) {
          return { ...p, price: update.newPrice, trend: update.change.includes('-') ? 'DOWN' : 'UP' };
        }
        return p;
      }));
    });

    const handleUpdate = () => fetchRequests();
    window.addEventListener('b2b-request-updated', handleUpdate);
    
    return () => {
      unsubscribePrices();
      window.removeEventListener('b2b-request-updated', handleUpdate);
    };
  }, [fetchPrices]);

  const filteredPrices = prices.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const feedItems = filteredPrices.map(item => ({
    title: item.name,
    location: `${item.market}, ${item.district}`,
    price: `₹${item.price}/${item.unit}`,
    category: 'Commodity',
    status: item.trend === 'UP' ? 'Rising' : item.trend === 'DOWN' ? 'Falling' : 'Stable',
    badgeColor: item.trend === 'UP' ? 'bg-green-100 text-green-700' : item.trend === 'DOWN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700',
    date: item.date
  }));

  return (
    <FarmerGuard>
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted p-8 pt-10">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('market.title') || 'Market Prices'}</h1>
              <p className="text-gray-600">Real-time mandi prices and market trends</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setShowSaleModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                <ShoppingBag className="w-5 h-5" /> Record Sale
              </button>
              <button onClick={fetchPrices} className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all" title="Refresh Market Prices">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </header>

          <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl w-fit">
            <button onClick={() => setActiveTab('mandi')} className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'mandi' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'}`}>Mandi Prices</button>
            <button onClick={() => setActiveTab('b2b')} className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'b2b' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'}`}>Direct Buyers</button>
            <button onClick={() => setActiveTab('requests')} className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'requests' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'}`}>My Requests</button>
          </div>

          {activeTab === 'mandi' && (
            <>
              <FeedFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
                categoryOptions={[
                  { label: 'All States', value: '' },
                  { label: 'Gujarat', value: 'Gujarat' },
                  { label: 'Maharashtra', value: 'Maharashtra' },
                  { label: 'Delhi', value: 'Delhi' },
                  { label: 'Haryana', value: 'Haryana' }
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : feedItems.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No market prices found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  feedItems.map((item, index) => (
                    <FeedCard key={index} {...item} />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'b2b' && <B2BMarketplace onSell={(c) => setSelectedB2BCompany(c)} />}
          {activeTab === 'requests' && <B2BRequestsList requests={myRequests} />}
        </main>
      </div>
      {showSaleModal && <SaleEntryForm onClose={() => setShowSaleModal(false)} onSuccess={() => fetchPrices()} />}
      {selectedB2BCompany && <SellToBusinessForm company={selectedB2BCompany} onClose={() => setSelectedB2BCompany(null)} onSuccess={() => { fetchRequests(); setActiveTab('requests'); }} />}
    </FarmerGuard>
  );
}
