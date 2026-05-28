"use client";

import React, { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/navigation";

import io from "socket.io-client";

import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import FarmerGuard from '@/components/auth/FarmerGuard';

import CropCard from "@/components/ui/CropCard";
import PortalBackground from "@/components/backgrounds/PortalBackground";

import { Sprout, Droplets, TrendingUp, CloudSun, Landmark, Users, X, Settings, Leaf, Activity, Thermometer, CreditCard, Gavel, XCircle, CheckCircle } from 'lucide-react';

import KYCStatusBanner from '@/components/shared/KYCStatusBanner';
import VoiceAssistant from '@/components/VoiceAssistant';
import GlobalSettings from '@/components/GlobalSettings';

import { useLanguage } from '@/context/LanguageContext';

import { useAuth } from '@/context/AuthContext';

import { useDashboardSimulation } from '@/hooks/useDashboardSimulation';
import type { WeatherData } from '@/services/weatherService';
import { listingService } from '@/services/listingService';
import { bidService } from '@/services/bidService';

type Language = 'en' | 'hi' | 'pa' | 'mr' | 'te';
let socket: any;
export default function Dashboard() {
  const router = useRouter();
const { role } = useAuth();
const { t, language, setLanguage } = useLanguage();
const [, setLiveSensors] = useState({ moisture: 42.5, temp: 24.8, npk: { n: 45, p: 30, k: 25 } });
const [, setIsLive] = useState(false);
const { weatherData, setWeatherData, moisture, activities, myListings, myBids } = useDashboardSimulation();

const socketInitializer = useCallback(async () => {
  try {
    await fetch("/api/socket");
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000");
    socket.on("connect", () => setIsLive(true));
    socket.on("sensor_update", (data: { moisture: number; temp: number; npk: { n: number; p: number; k: number } }) => {
      setLiveSensors(data);
    });
    socket.on("weather_update", (data: WeatherData) => {
      setWeatherData(data);
    });
  } catch (err) {
    console.warn("Socket connection failed, using local simulation", err);
  }
}, [setWeatherData]);

useEffect(() => {
  socketInitializer();
  return () => {
    if (socket) socket.disconnect();
  };
}, [socketInitializer]);

const languages: { code: Language; label: string }[] = [ { code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' }, { code: 'pa', label: 'ਪੰਜਾਬੀ' }, { code: 'mr', label: 'मराठी' }, { code: 'te', label: 'తెలుగు' }, ];
const [showListingModal, setShowListingModal] = useState(false);
const [isPosting, setIsPosting] = useState(false);
const [newListing, setNewListing] = useState({ crop: 'Wheat', quantity: 10, price: 2100 });
const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

const handlePostListing = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsPosting(true);
  try {
    await listingService.createListing({
      crop: newListing.crop,
      quantity: newListing.quantity,
      pricePerUnit: newListing.price,
      unit: 'qtl'
    });
    setShowListingModal(false);
    // Refresh page or state
    window.location.reload();
  } catch (err) {
    console.error('Failed to post listing', err);
  } finally {
    setIsPosting(false);
  }
};

useEffect(() => {
  if (role && role !== 'farmer') {
    if (role === 'admin') router.push('/admin');
    else if (role === 'business' || role === 'salesman') router.push('/business');
  } else if (!role && !sessionStorage.getItem('app_token')) {
    router.push('/signin');
  }
}, [role, router]);

if (role && role !== 'farmer') return null;

return (
  <FarmerGuard>
    <div className="relative min-h-screen overflow-hidden">
      <PortalBackground type="farmer" />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main main-content-shifted p-8 pt-10 relative z-10">
        <DashboardHeader>
          <div className="flex items-center gap-3">
            <GlobalSettings />
            <button 
              onClick={() => setShowListingModal(true)}
              className="app-button-primary flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" /> Post Crop for Sale
            </button>
          </div>
        </DashboardHeader>

        {/* Sell Crop Modal */}
        {showListingModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowListingModal(false)}></div>
            <form onSubmit={handlePostListing} className="app-card p-8 max-w-md w-full relative z-10 border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-700">Post Crop Listing</h3>
                <button type="button" onClick={() => setShowListingModal(false)} title="Close Modal" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Crop Type</label>
                  <select 
                    title="Select Crop Type"
                    className="app-input"
                    value={newListing.crop}
                    onChange={(e) => setNewListing({...newListing, crop: e.target.value})}
                  >
                    <option>Wheat</option>
                    <option>Basmati Rice</option>
                    <option>Maize</option>
                    <option>Mustard</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Quantity (Qtl)</label>
                    <input 
                      type="number" 
                      title="Enter Quantity in Quintals"
                      className="app-input"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({...newListing, quantity: +e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Target Price (per Qtl)</label>
                    <input 
                      type="number" 
                      title="Enter Target Price per Quintal"
                      className="app-input"
                      value={newListing.price}
                      onChange={(e) => setNewListing({...newListing, price: +e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isPosting}
                    className="w-full app-button-primary"
                  >
                    {isPosting ? 'Posting...' : 'Confirm Listing'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* KYC Status */}
        <KYCStatusBanner role="farmer" />

        {/* Quick Stats */}
        <div className="app-grid mb-10">
          <div className="app-card app-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Landmark className="w-6 h-6 text-green-600" />
              </div>
              <span className="app-badge app-badge-success">Active</span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Land Holding</h4>
            <p className="text-2xl font-bold text-gray-900">12.5 {t('data.acres')}</p>
          </div>
          
          <div className="app-card app-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <span className="app-badge app-badge-success">+12%</span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Current Crop</h4>
            <p className="text-2xl font-bold text-gray-900">{t('data.wheat')}</p>
            <p className="text-xs text-green-600 mt-1">{t('data.growth')}</p>
          </div>
          
          <div className="app-card app-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <span className="app-badge app-badge-warning">-2%</span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Soil Moisture</h4>
            <p className="text-2xl font-bold text-gray-900">{moisture.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('data.vsYesterday')}</p>
          </div>
          
          <div className="app-card app-card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="app-badge app-badge-info">Live</span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Crop Value</h4>
            <p className="text-2xl font-bold text-gray-900">
              {myListings.length > 0 ? `₹${(myListings[0].pricePerUnit * myListings[0].quantity / 100000).toFixed(2)} ${t('data.lakhs')}` : '₹0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {myListings.length > 0 ? `Active: ${myListings[0].crop}` : 'No active listings'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Telemetry */}
              <div className="app-card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                    <Activity className="w-5 h-5 text-green-600" /> Live Telemetry
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Soil Moisture</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{moisture.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Soil Temp</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">24.2°C</span>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div className="app-card">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                  <CreditCard className="w-5 h-5 text-green-600" /> Wallet
                </h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">Escrow Balance</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{myListings.filter(l => l.status === 'sold').length > 0 ? '1,50,000' : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Industrial Partners (New Section) */}
            <div className="app-card">
              <h2 className="app-page-title">
                <Users className="w-6 h-6 text-green-600" /> Industrial Partners (Residue Management)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all cursor-pointer">
                  <h4 className="font-bold text-gray-900">Punjab Bio-Refinery</h4>
                  <p className="text-xs text-gray-500">Distance: 4.2 km</p>
                  <div className="mt-2 flex gap-1">
                    <span className="app-badge app-badge-warning">PADDY STRAW</span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all cursor-pointer">
                  <h4 className="font-bold text-gray-900">Aggarwal Feed Mills</h4>
                  <p className="text-xs text-gray-500">Distance: 8.5 km</p>
                  <div className="mt-2 flex gap-1">
                    <span className="app-badge app-badge-warning">WHEAT HUSK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Card */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-primary" /> {t('dashboard.weather.title')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('dashboard.weather.temp'), value: `${weatherData?.temp}°C`, detail: weatherData?.condition },
                  { label: t('dashboard.weather.humidity'), value: `${weatherData?.humidity}%`, detail: 'Moderate' },
                  { label: t('dashboard.weather.wind'), value: '12km/h', detail: 'North' },
                  { label: t('dashboard.weather.rain'), value: '0%', detail: 'Next 3 Days' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{item.label}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-primary mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities Card */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">{t('dashboard.activities.title')}</h2>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="font-bold">{act.title}</p>
                      <p className="text-sm text-gray-500">{act.desc}</p>
                    </div>
                    <span className="text-xs text-gray-500">{act.time}</span>
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-400">No recent activities found</div>
                )}
              </div>
            </div>

            {/* Negotiations & Offers Section */}
            <div className="glass-card p-8 border-primary/20 bg-primary/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-primary" /> Incoming Market Offers
              </h2>
              <div className="space-y-4">
                {myBids.filter(b => b.status === 'pending').length > 0 ? myBids.filter(b => b.status === 'pending').map((bid) => (
                  <div key={bid._id} className="p-6 bg-white rounded-2xl border border-primary/10 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Users size={24}/></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black uppercase text-sm">Offer from {typeof bid.salesman === 'object' ? bid.salesman.name : 'Salesman'}</h4>
                          <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black">TOP BID</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Bidding for <span className="text-primary font-bold">{bid.quantity} qtl</span> of {typeof bid.listing === 'object' ? bid.listing.crop : 'Crop'}</p>
                        <p className="text-lg font-black text-primary">₹{bid.offeredPrice} / qtl</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                         title="Reject Offer"
                         onClick={async () => {
                           await bidService.updateBidStatus(bid._id, 'rejected');
                           window.location.reload();
                         }}
                         className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <XCircle />
                      </button>
                      <button 
                        title="Accept Deal"
                        onClick={async () => {
                          if (confirm('Accepting this bid will finalize the deal and start logistics. Proceed?')) {
                            await bidService.updateBidStatus(bid._id, 'accepted');
                            alert('Deal finalized! Logistics order created.');
                            window.location.reload();
                          }
                        }}
                        className="px-6 py-3 bg-primary text-black font-black rounded-xl hover:bg-primary/80 transition-all flex items-center gap-2 text-xs uppercase"
                      >
                        Accept Deal <CheckCircle size={16}/>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-400 italic font-medium">No pending offers currently. The market is quiet.</div>
                )}
              </div>
            </div>
          </div>

            {/* My Crops Section - Balanced Layout */}
            <div className="app-card">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" /> My Crops
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage and track your crop listings</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: '1',
                    name: 'Wheat',
                    category: 'Grains',
                    season: 'Rabi',
                    pricePerUnit: 2100,
                    unit: 'qtl',
                    location: 'Punjab',
                    quality: 'High' as const,
                    status: 'available' as const,
                    description: 'Premium quality wheat with high protein content',
                    farmer: 'Green Valley Farm',
                    harvestDate: '2024-03-15'
                  },
                  {
                    id: '2',
                    name: 'Basmati Rice',
                    category: 'Grains',
                    season: 'Kharif',
                    pricePerUnit: 4500,
                    unit: 'qtl',
                    location: 'Punjab',
                    quality: 'High' as const,
                    status: 'available' as const,
                    description: 'Aromatic basmati rice, aged for 12 months',
                    farmer: 'Golden Fields',
                    harvestDate: '2024-10-20'
                  },
                  {
                    id: '3',
                    name: 'Maize',
                    category: 'Grains',
                    season: 'Kharif',
                    pricePerUnit: 1800,
                    unit: 'qtl',
                    location: 'Punjab',
                    quality: 'Medium' as const,
                    status: 'pending' as const,
                    description: 'Yellow maize suitable for animal feed',
                    farmer: 'Sunny Acres',
                    harvestDate: '2024-09-10'
                  },
                  {
                    id: '4',
                    name: 'Mustard',
                    category: 'Oilseeds',
                    season: 'Rabi',
                    pricePerUnit: 3200,
                    unit: 'qtl',
                    location: 'Punjab',
                    quality: 'High' as const,
                    status: 'available' as const,
                    description: 'High oil content mustard seeds',
                    farmer: 'Heritage Farm',
                    harvestDate: '2024-02-28'
                  }
                ].map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    isSelected={selectedCrop === crop.id}
                    onSelect={(selectedCrop) => setSelectedCrop(selectedCrop.id)}
                    onSell={(crop) => {
                      setNewListing({
                        crop: crop.name,
                        quantity: 10,
                        price: crop.pricePerUnit
                      });
                      setShowListingModal(true);
                    }}
                    onPredictPrice={(_crop) => {
                      router.push('/crops');
                    }}
                    onViewMarket={(_crop) => {
                      router.push('/market');
                    }}
                  />
                ))}
              </div>
            </div>

          {/* Right Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Settings (Updated Section) */}
            <div className="glass-card p-6 border-primary/20">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> {t('profile.settings.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium">Notification Preferences</span>
                  <button className="text-[10px] font-bold text-primary uppercase">Manage</button>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">Language</p>
                  <select 
                    title="Select Preferred Language"
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Farm Profile Card */}
            <div className="glass-card p-6 border-accent/20">
              <h3 className="text-xl font-bold mb-4">{t('dashboard.farmProfile.title')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Irrigation Source</span>
                  <span className="text-green-500 font-bold">Borewell</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Harvest</span>
                  <span className="text-gray-900 font-bold">Oct 15, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Voice Assistant */}
      <VoiceAssistant />
      </div>
    </div>
  </FarmerGuard>
);
}