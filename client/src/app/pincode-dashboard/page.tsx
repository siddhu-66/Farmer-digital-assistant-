'use client';

import React, { useState } from 'react';
import { Sprout, Cloud, IndianRupee, MapPin, Globe } from 'lucide-react';
import PincodeInput from '@/components/PincodeInput';
import WeatherCard from '@/components/WeatherCard';
import MarketPriceList from '@/components/MarketPriceList';
import LanguageSwitch from '@/components/LanguageSwitch';

interface LocationData {
  pincode: string;
  state: string;
  district: string;
  postOffices: Array<{
    name: string;
    branchType: string;
    deliveryStatus: string;
  }>;
}

export default function PincodeDashboard() {
  const [selectedPincode, setSelectedPincode] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [language, setLanguage] = useState('en');

  const handlePincodeChange = (pincode: string, location?: LocationData) => {
    setSelectedPincode(pincode);
    setLocationData(location || null);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Sprout className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agriculture Portal</h1>
                <p className="text-sm text-gray-500">Pincode-based farming information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitch
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <a 
                href="/dashboard" 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pincode Input Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Enter Your Pincode
              </h2>
            </div>
            
            <PincodeInput
              onPincodeChange={handlePincodeChange}
              placeholder="Enter 6-digit Indian pincode"
            />
            
            {locationData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      {locationData.postOffices[0]?.name}, {locationData.district}
                    </p>
                    <p className="text-sm text-green-600">
                      {locationData.state} • {locationData.pincode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        {selectedPincode && selectedPincode.length === 6 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weather Card */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Weather Information</h3>
              </div>
              <WeatherCard
                pincode={selectedPincode}
                language={language}
              />
            </div>

            {/* Market Prices Card */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Market Prices</h3>
              </div>
              <MarketPriceList
                pincode={selectedPincode}
                language={language}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Agriculture Portal
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your pincode to get localized weather information and market prices for your area.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Cloud className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Weather</h4>
                  <p className="text-sm text-gray-600">
                    Real-time weather data and agricultural recommendations
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <IndianRupee className="h-8 w-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Market Prices</h4>
                  <p className="text-sm text-gray-600">
                    Latest crop prices from nearby mandis and markets
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Globe className="h-8 w-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Multi-language</h4>
                  <p className="text-sm text-gray-600">
                    Available in English, Hindi, and Gujarati
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Agriculture Portal. Weather data from OpenWeatherMap, Market prices from Agmarknet.</p>
            <p className="mt-1">
              Information provided is for reference only. Please verify with local authorities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
