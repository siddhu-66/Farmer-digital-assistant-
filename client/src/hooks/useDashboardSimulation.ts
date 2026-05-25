// @ts-nocheck
import { useState, useEffect } from 'react';
import { weatherService, WeatherData } from '@/services/weatherService';
import { marketService, MarketPrice } from '@/services/marketService';
import { listingService, Listing } from '@/services/listingService';
import { bidService, Bid } from '@/services/bidService';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export interface Activity {
  title?: string;
  action?: string;
  desc: string;
  time: string;
  type?: 'listing' | 'bid' | 'insight';
}

export function useDashboardSimulation() {
  const { t } = useLanguage();
  const { userId, role } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Real-Time Data State
  const [moisture, setMoisture] = useState(34);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [cropValue] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  useEffect(() => {
    const loadRealData = async () => {
      setLoadingServices(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('app_token') : null;

        const [weather, prices] = await Promise.all([
          weatherService.getCurrentWeather('Ludhiana'),
          marketService.getLatestPrices(),
        ]);

        setWeatherData(weather);
        setMarketPrices(prices);

        // Protected endpoints should only be called with a token.
        if (!token || !userId) {
          setMyListings([]);
          setMyBids([]);
          setActivities([]);
          return;
        }

        const [listingsResult, bidsResult] = await Promise.allSettled([
          role === 'farmer' ? listingService.getMyListings() : listingService.getAllListings(),
          role === 'farmer' ? bidService.getBidsForMyListings() : bidService.getMyBids(),
        ]);

        const listings = listingsResult.status === 'fulfilled' ? listingsResult.value : [];
        const bids = bidsResult.status === 'fulfilled' ? bidsResult.value : [];

        setMyListings(Array.isArray(listings) ? listings : []);
        setMyBids(Array.isArray(bids) ? bids : []);
        
        // Convert activities from real data
        const realActivities: Activity[] = [];
        listings.slice(0, 3).forEach((l: Listing) => {
          realActivities.push({
            title: `Listing: ${l.crop || 'Unknown Crop'}`,
            // FIXED: l.status can be undefined in mock/offline mode
            desc: `Current Status: ${(l.status || 'unknown').toUpperCase()}`,
            time: 'Active',
            type: 'listing'
          });
        });

        setActivities(realActivities);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoadingServices(false);
      }
    };

    loadRealData();

    // Real-time Data Simulation Interval
    const interval = setInterval(() => {
      setMoisture(prev => {
        const diff = (Math.random() - 0.5) * 1.5;
        return Math.min(Math.max(32, prev + diff), 36);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [userId, role, t]);

  return { weatherData, setWeatherData, loadingServices, moisture, cropValue, activities, marketPrices, myListings, myBids };
}
