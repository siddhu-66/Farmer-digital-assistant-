"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { weatherService, WeatherData } from "@/services/weatherService";
import { CloudSun, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Clock, Navigation, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
export default function Weather() {
  const { t } = useLanguage();
  const [pincode, setPincode] = useState("141001");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const quickPincodes = useMemo(() => ["141001", "110001", "400001", "560001"], []);

  const fetchByPincode = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    const data = await weatherService.getWeatherByPincode(trimmed);
    setWeather(data);
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  };

  useEffect(() => {
    fetchByPincode("141001");
  }, []);

return ( <div className="flex bg-[var(--theme-bg)] min-h-screen">
<Sidebar />
<div className="flex-1 main-content-shifted p-8 pt-10">
<header className="mb-10">
<h1 className="text-4xl font-bold mb-2">{t('weatherDetails.title')}
</h1>
<p className="text-gray-500">{t('weatherDetails.subtitle')} - {weather?.location || 'Live Location'}
</p>
</header>
<div className="glass-card p-5 mb-6 border-primary/20">
  <div className="flex flex-col md:flex-row gap-3">
    <input
      value={pincode}
      onChange={(e) => setPincode(e.target.value)}
      placeholder="Enter pincode (e.g. 141001)"
      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
    />
    <button
      type="button"
      onClick={() => fetchByPincode(pincode)}
      className="px-5 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2"
    >
      <Search className="w-4 h-4" /> Show Weather Report
    </button>
  </div>
  <div className="flex flex-wrap gap-2 mt-3">
    {quickPincodes.map((pin) => (
      <button
        key={pin}
        type="button"
        onClick={() => {
          setPincode(pin);
          fetchByPincode(pin);
        }}
        className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200"
      >
        {pin}
      </button>
    ))}
  </div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> {/* Current Weather Highlighting */}
<div className="lg:col-span-3 space-y-8">
<div className="glass-card p-10 bg-primary/5 border-primary/20 relative overflow-hidden">
<div className="absolute top-0 right-0 p-10 20 transform translate-x-1/4 -translate-y-1/4">
<CloudSun className="w-64 h-64 text-primary" />
</div>
<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
<div>
<div className="flex items-center gap-4 mb-4">
<span className="px-4 py-1 bg-primary text-gray-500 text-sm font-bold rounded-full">{t('weatherDetails.live')}
</span>
<span className="text-gray-500 flex items-center gap-1">
<Navigation className="w-4 h-4" /> {weather?.location || t('data.location')}
</span>
</div>
<h2 className="text-7xl font-bold mb-2">{weather?.temp ?? '--'}°C</h2>
<p className="text-2xl text-gray-500">{weather?.condition || t('weatherDetails.mostlySunny')}
</p>
<p className="text-gray-500 mt-4 flex items-center gap-2">
<Clock className="w-4 h-4" /> {t('weatherDetails.lastUpdated')}: {loading ? 'Loading...' : (lastUpdated || '--')}
</p>
</div>
<div className="grid grid-cols-2 gap-4 w-full md:w-auto"> {[ { icon: Thermometer, label: t('dashboard.weather.temp'), val: `${weather?.temp ?? '--'}°C` }, { icon: Droplets, label: t('dashboard.weather.humidity'), val: `${weather?.humidity ?? '--'}%` }, { icon: Wind, label: t('dashboard.weather.wind'), val: '-- km/h' }, { icon: CloudRain, label: t('dashboard.weather.rain'), val: weather?.forecast?.[0]?.condition || '--' }, ].map((stat, i) => ( <div key={i} className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
<stat.icon className="w-6 h-6 text-primary" />
<div>
<p className="text-xs text-gray-500 uppercase font-bold">{stat.label}
</p>
<p className="font-bold">{stat.val}
</p>
</div>
</div> ))}
</div>
</div>
</div> {/* 7-Day Forecast */}
<div className="glass-card p-8">
<h3 className="text-2xl font-bold mb-8">{t('weatherDetails.forecast7Day')}
</h3>
<div className="space-y-4"> {(weather?.forecast?.length ? weather.forecast.slice(0, 5) : [ { day: t('weatherDetails.tomorrow'), temp: 27, condition: t('weatherDetails.mostlySunny') }, { day: t('weatherDetails.sunday'), temp: 28, condition: t('weatherDetails.sunny') }, { day: t('weatherDetails.monday'), temp: 22, condition: t('weatherDetails.lightShowers') }, { day: t('weatherDetails.tuesday'), temp: 21, condition: t('weatherDetails.rainy') }, { day: t('weatherDetails.wednesday'), temp: 25, condition: t('weatherDetails.partlyCloudy') }, ]).map((f: any, i: number) => ( <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-200 group">
<div className="flex items-center gap-6 w-1/4">
<span className="font-bold text-lg">{f.day || '--'}
</span>
<span className="text-gray-500 text-sm">{weather?.location || 'Local'}
</span>
</div>
<div className="flex items-center gap-3 w-1/4 text-primary">
{(f.condition || '').toLowerCase().includes('rain') ? <CloudRain className="w-6 h-6" /> : <CloudSun className="w-6 h-6" />}
<span className="text-sm font-medium text-gray-500">{f.condition}
</span>
</div>
<div className="flex items-center gap-8 w-1/4 justify-end">
<span className="font-bold">{Math.round(f.temp)}°
</span>
<span className="text-gray-500">--</span>
</div>
</div> ))}
</div>
</div>
</div> {/* Adjudication & Alerts */}
<div className="space-y-8">
<div className="glass-card p-6 border-red-500/20 bg-red-500/5">
<h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
<AlertTriangle className="w-5 h-5" /> {t('weatherDetails.alerts')}
</h3>
<p className="text-sm text-gray-500 leading-relaxed"> {t('weatherDetails.alertDesc')}
</p>
<button onClick={() => alert("Loading tailored prevention steps for Late Blight... (Pro version feature)")} className="w-full mt-6 py-3 bg-red-500 text-gray-500 font-bold rounded-xl hover:bg-red-600 transition-all font-inter" > {t('weatherDetails.viewPrevention')}
</button>
</div>
<div className="glass-card p-6 border-primary/20">
<h3 className="text-xl font-bold mb-4">{t('weatherDetails.advice')}
</h3>
<p className="text-sm text-gray-500 mb-6 font-medium"> {t('weatherDetails.adviceDesc')}
</p>
<div className="flex flex-col gap-3">
<div className="flex items-center gap-3 text-sm">
<div className="w-2 h-2 rounded-full bg-primary">
</div>
<span>{t('weatherDetails.optimalTemp')}
</span>
</div>
<div className="flex items-center gap-3 text-sm">
<div className="w-2 h-2 rounded-full bg-primary">
</div>
<span>{t('weatherDetails.nextIrrigation')}
</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div> ); } 