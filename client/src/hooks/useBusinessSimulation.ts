import { useState, useEffect } from 'react';
import { listingService, Listing } from '@/services/listingService';
import { bidService, Bid } from '@/services/bidService';
import { useAuth } from '@/context/AuthContext';

export function useBusinessSimulation() {
  const { userId, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [stats, setStats] = useState({
    activeBids: 0,
    acceptedOffers: 0,
    marketVolume: '₹12.4 Lakhs'
  });

  useEffect(() => {
    const loadRealData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [allListings, bids] = await Promise.all([
          listingService.getAllListings(),
          bidService.getMyBids()
        ]);

        setListings(allListings);
        setMyBids(bids);

        setStats({
          activeBids: bids.filter(b => b.status === 'pending').length,
          acceptedOffers: bids.filter(b => b.status === 'accepted').length,
          marketVolume: `₹${(allListings.reduce((acc, l) => acc + (l.pricePerUnit * l.quantity), 0) / 100000).toFixed(1)} Lakhs`
        });
      } catch (err) {
        console.error('Failed to fetch market data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, [userId, role]);

  return { stats, listings, myBids, loading };
}
