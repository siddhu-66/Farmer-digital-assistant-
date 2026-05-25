"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listingService, Listing } from '@/services/listingService';

export function useListings() {
  const { role, userId, authReady } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    if (!authReady || !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = role === 'farmer' 
        ? await listingService.getMyListings()
        : await listingService.getAllListings();
      
      setListings(result);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch listings';
      setError(errorMessage);
      console.error('[useListings] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [authReady, userId, role]);

  useEffect(() => {
    if (authReady && userId) {
      fetchListings();
    }
  }, [authReady, userId, fetchListings]);

  const refetch = () => fetchListings();

  return {
    listings,
    loading,
    error,
    refetch,
    isAuthenticated: !!userId,
    role,
  };
}
