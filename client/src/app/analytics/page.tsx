"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import RecommendationForm from "@/components/analytics/RecommendationForm";
import DashboardCard from "@/components/shared/DashboardCard";
import { useLanguage } from "@/context/LanguageContext";
import { weatherService } from "@/services/weatherService";
import { BrainCircuit, TrendingUp, Zap, Target, Bug, Construction, Loader2, CheckCircle2, AlertCircle, CloudSun, Droplets } from 'lucide-react';

export default function AnalyticsPortal() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pestResult, setPestResult] = useState<null | { name: string, confidence: number, treatment: string, status: 'warning' | 'safe' }>(null);
  
  // Real-time Weather State
  const [liveWeather, setLiveWeather] = useState({ temp: '28', humidity: '65', lastUpdate: 'Live' });

  useEffect(() => {
    // Subscribe to real-time weather telemetry
    const unsubscribe = weatherService.subscribeToLiveUpdates((data) => {
      const update = data as { temp?: string | number; humidity?: string | number };
      setLiveWeather((prev) => ({
        temp: String(update.temp ?? prev.temp),
        humidity: String(update.humidity ?? prev.humidity),
        lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }));
    });
    return () => unsubscribe();
  }, []);

  const handlePestScan = () => { fileInputRef.current?.click(); };
  
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { 
      setIsScanning(true); 
      setPestResult(null); 
      setTimeout(() => {
        const results = [ 
          { name: 'Aphids Detected', confidence: 92.4, treatment: 'Use organic neem oil spray in late evening.', status: 'warning' as const }, 
          { name: 'Healthy Crop', confidence: 98.2, treatment: 'No pests detected. Maintain regular hydration.', status: 'safe' as const } 
        ]; 
        setPestResult(results[Math.floor(Math.random() * results.length)]); 
        setIsScanning(false); 
      }, 3000); 
    } 
  };

  return ( 
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" title="Upload crop image" />
      
      <div className="flex-1 main-content-shifted p-8 pt-10">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-tight">{t('analytics.title')}</h1>
          </div>
          <p className="text-gray-500 max-w-2xl">{t('analytics.subtitle')}</p>
        </header>

        {/* Live Telemetry Bar */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="glass-card p-4 flex items-center gap-4 border-primary/20 bg-primary/5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Live Temp</p>
              <p className="text-xl font-black text-gray-900">{liveWeather.temp}°C</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4 border-blue-500/20 bg-blue-500/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Humidity</p>
              <p className="text-xl font-black text-gray-900">{liveWeather.humidity}%</p>
            </div>
          </div>
          <div className="lg:col-span-2 glass-card p-4 flex items-center justify-between border-gray-200">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">ML Node Connected: RuralSync-A12</span>
             </div>
             <span className="text-[10px] font-mono text-gray-400">Last Telemetry: {liveWeather.lastUpdate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <DashboardCard title={t('analytics.stats.accuracy')} value="94.2%" icon={<Target className="w-6 h-6" />} trend={`${t('analytics.stats.activeModels')}: 4`} trendUp={true} />
          <DashboardCard title={t('analytics.stats.roi')} value="+22%" icon={<TrendingUp className="w-6 h-6" />} trend={t('analytics.stats.basedOn')} trendUp={true} />
          <DashboardCard title={t('analytics.stats.usage')} value="12/30" icon={<Zap className="w-6 h-6" />} trend={t('analytics.stats.credits')} trendUp={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecommendationForm />
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <Construction className="w-10 h-10 text-primary mb-4" />
                <p className="font-bold text-xl">{t('analytics.comingSoon')}</p>
                <p className="text-sm text-gray-500">{t('analytics.training')}</p>
              </div>
              <h2 className="text-2xl font-bold mb-6">{t('analytics.historyTitle')}</h2>
              <div className="h-48 w-full bg-gray-50 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-6 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> {t('analytics.coreModules')}
              </h3>
              <div className="space-y-4">
                {[
                  { name: t('analytics.cropRec'), status: t('analytics.optimalSelection'), color: 'text-green-400' },
                  { name: t('analytics.yieldPred'), status: t('analytics.betaPhase'), color: 'text-yellow-400' },
                  { name: t('analytics.pestDet'), status: isScanning ? 'Active' : (pestResult ? 'Success' : t('analytics.trainingModel')), color: isScanning ? 'text-blue-400' : (pestResult ? 'text-green-400' : 'text-gray-500') },
                ].map((mod, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                    <span className="font-medium text-sm">{mod.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${mod.color}`}>{mod.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div onClick={handlePestScan} className={`glass-card p-6 border-gray-200 hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden ${isScanning ? 'pointer-events-none' : ''}`}>
              {isScanning && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Analyzing Crop Health...</p>
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <Bug className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider">{t('analytics.pestDet')}</h4>
                  <p className="text-xs text-gray-500">{t('analytics.uploadDesc')}</p>
                </div>
              </div>
              {!pestResult ? (
                <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{t('analytics.dragDrop')}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {pestResult.status === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    <span className={`font-bold text-sm ${pestResult.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>{pestResult.name}</span>
                    <span className="text-[10px] text-gray-500 ml-auto">{pestResult.confidence}% match</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">{pestResult.treatment}</p>
                  <button onClick={(e) => { e.stopPropagation(); setPestResult(null); }} className="mt-3 text-[10px] text-primary uppercase font-bold hover:underline">Scan Another</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}