"use client";

import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Languages, Clock, Package, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';

interface GlobalSettings {
  country: string;
  currency: string;
  language: string;
  timezone: string;
  cropUnit: string;
}

const countries = [
  { code: 'IN', name: 'India', currency: 'INR', timezone: 'Asia/Kolkata', cropUnit: 'quintal' },
  { code: 'US', name: 'United States', currency: 'USD', timezone: 'America/New_York', cropUnit: 'bushel' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London', cropUnit: 'ton' },
  { code: 'CA', name: 'Canada', currency: 'CAD', timezone: 'America/Toronto', cropUnit: 'ton' },
  { code: 'AU', name: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney', cropUnit: 'ton' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', timezone: 'America/Sao_Paulo', cropUnit: 'bag' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', timezone: 'America/Mexico_City', cropUnit: 'ton' },
  { code: 'AR', name: 'Argentina', currency: 'ARS', timezone: 'America/Buenos_Aires', cropUnit: 'ton' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', timezone: 'Africa/Johannesburg', cropUnit: 'ton' },
  { code: 'KE', name: 'Kenya', currency: 'KES', timezone: 'Africa/Nairobi', cropUnit: 'bag' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', timezone: 'Africa/Lagos', cropUnit: 'bag' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', timezone: 'Asia/Manila', cropUnit: 'bag' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', timezone: 'Asia/Kuala_Lumpur', cropUnit: 'ton' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', timezone: 'Asia/Singapore', cropUnit: 'ton' },
  { code: 'TH', name: 'Thailand', currency: 'THB', timezone: 'Asia/Bangkok', cropUnit: 'ton' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', cropUnit: 'ton' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', timezone: 'Asia/Jakarta', cropUnit: 'ton' },
  { code: 'CN', name: 'China', currency: 'CNY', timezone: 'Asia/Shanghai', cropUnit: 'ton' },
  { code: 'JP', name: 'Japan', currency: 'JPY', timezone: 'Asia/Tokyo', cropUnit: 'ton' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', timezone: 'Asia/Seoul', cropUnit: 'ton' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'sw', name: 'Kiswahili (Swahili)' },
];

const timezones = [
  { value: 'Asia/Kolkata', label: 'India Time (IST)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'Africa/Johannesburg', label: 'South Africa Time (SAT)' },
  { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT)' },
  { value: 'America/Mexico_City', label: 'Central Standard Time (CST)' },
];

const cropUnits = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'quintal', label: 'Quintal (100 kg)' },
  { value: 'ton', label: 'Metric Ton (1000 kg)' },
  { value: 'bushel', label: 'Bushel' },
  { value: 'pound', label: 'Pound (lb)' },
  { value: 'bag', label: 'Bag' },
  { value: 'crate', label: 'Crate' },
  { value: 'box', label: 'Box' },
];

export default function GlobalSettings() {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<GlobalSettings>({
    country: 'IN',
    currency: 'INR',
    language: 'en',
    timezone: 'Asia/Kolkata',
    cropUnit: 'quintal'
  });

  useEffect(() => {
    if (user) {
      setSettings({
        country: user.country || 'IN',
        currency: user.currency || 'INR',
        language: user.language || 'en',
        timezone: user.timezone || 'Asia/Kolkata',
        cropUnit: user.cropUnit || 'quintal'
      });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSettings({
        ...settings,
        country: country.code,
        currency: country.currency,
        timezone: country.timezone,
        cropUnit: country.cropUnit
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.put('/auth/profile', settings);
      
      if (response && 'data' in response && response.data) {
        updateUser(response.data);
        setSuccess('Global settings updated successfully!');
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (_err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all"
        title="Global Settings"
      >
        <Globe className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Global Settings</h2>
                    <p className="text-sm text-gray-500">Configure your regional preferences</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Country Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Globe className="w-4 h-4" />
                  Country
                </label>
                <select
                  value={settings.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {countries.map(country => (
                    <option key={country.currency} value={country.currency}>
                      {country.currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Languages className="w-4 h-4" />
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Unit */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Package className="w-4 h-4" />
                  Crop Unit
                </label>
                <select
                  value={settings.cropUnit}
                  onChange={(e) => setSettings({ ...settings, cropUnit: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {cropUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-light transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
