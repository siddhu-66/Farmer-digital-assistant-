'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, Loader2, AlertTriangle, IndianRupee } from 'lucide-react';

interface CropPrice {
  name: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface MarketData {
  pincode: string;
  location: {
    state: string;
    district: string;
    market: string;
  };
  crops: CropPrice[];
  markets: Array<{
    name: string;
    type: string;
    distance?: number;
    code?: string;
  }>;
  lastUpdated: string;
  source: string;
}

interface MarketPriceListProps {
  pincode: string;
  language?: string;
  className?: string;
}

const MarketPriceList: React.FC<MarketPriceListProps> = ({
  pincode,
  language = 'en',
  className = ''
}) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    if (!pincode || pincode.length !== 6) return;

    setIsLoading(true);
    setError('');

    try {
      const url = selectedCrop 
        ? `/api/market/by-pincode/${pincode}?lang=${language}&crop=${encodeURIComponent(selectedCrop)}`
        : `/api/market/by-pincode/${pincode}?lang=${language}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setMarketData(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch market prices');
        setMarketData(null);
      }
    } catch (_err) {
      setError('Failed to fetch market prices');
      setMarketData(null);
    } finally {
      setIsLoading(false);
    }
  }, [pincode, language, selectedCrop]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get trend color
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">Market Data Unavailable</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <IndianRupee className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Enter a valid pincode to see market prices</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Market Prices</h3>
            <p className="text-green-100">
              {marketData.location.market}, {marketData.location.district}
            </p>
            <p className="text-green-100 text-sm">
              {marketData.location.state} • {pincode}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100">Last Updated</p>
            <p className="font-medium">
              {new Date(marketData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter by Crop */}
      {marketData.crops.length > 0 && (
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCrop('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedCrop 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Crops
            </button>
            {Array.from(new Set(marketData.crops.map(crop => crop.name))).map(cropName => (
              <button
                key={cropName}
                onClick={() => setSelectedCrop(cropName)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCrop === cropName 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cropName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price List */}
      <div className="p-6">
        {marketData.crops.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No market data available for this location</p>
          </div>
        ) : (
          <div className="space-y-4">
            {marketData.crops.map((crop, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">{crop.name}</h4>
                    <p className="text-sm text-gray-600">{crop.variety}</p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getTrendColor(crop.trend)}`}>
                    {getTrendIcon(crop.trend)}
                    <span className="text-sm font-medium">
                      {crop.trend === 'up' ? '+' : crop.trend === 'down' ? '' : ''}
                      {crop.change}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Min Price</p>
                    <p className="font-semibold text-lg text-gray-800">
                      <IndianRupee className="inline h-4 w-4" />
                      {crop.minPrice}
                    </p>
                    <p className="text-xs text-gray-500">per {crop.unit}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Avg Price</p>
                    <p className="font-semibold text-lg text-green-700">
                      <IndianRupee className="inline h-4 w-4" />
                      {crop.avgPrice}
                    </p>
                    <p className="text-xs text-gray-500">per {crop.unit}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Max Price</p>
                    <p className="font-semibold text-lg text-gray-800">
                      <IndianRupee className="inline h-4 w-4" />
                      {crop.maxPrice}
                    </p>
                    <p className="text-xs text-gray-500">per {crop.unit}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Date: {new Date(crop.date).toLocaleDateString()}</span>
                  <span>Unit: {crop.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Markets Info */}
      {marketData.markets.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">Nearby Markets</h4>
          <div className="flex flex-wrap gap-2">
            {marketData.markets.map((market, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                <span className="font-medium">{market.name}</span>
                {market.distance && (
                  <span className="text-gray-400">({market.distance} km)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Source: {marketData.source}</span>
          <span>Prices are indicative and may vary</span>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceList;
