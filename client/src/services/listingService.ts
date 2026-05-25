import { apiClient } from '@/lib/apiClient';

export interface Listing {
  _id: string;
  farmer: string | { _id: string; name: string; phone: string; location?: { state: string; district: string } };
  crop: string;
  variety?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  qualityGrade: string;
  status: 'active' | 'sold' | 'expired' | 'removed';
  location: { state: string; district: string };
  createdAt: string;
}

export const listingService = {
  createListing: async (data: Partial<Listing>): Promise<Listing> => {
    return apiClient.post<Listing>('/listings', data);
  },

  getAllListings: async (): Promise<Listing[]> => {
    const data = await apiClient.get<Listing[] | { success: false; message: string }>('/listings');
    return Array.isArray(data) ? data : [];
  },

  getVerifiedFarmerListings: async (): Promise<Listing[]> => {
    const data = await apiClient.get<{ success: boolean; listings: Listing[]; count: number }>(
      '/business/verified-farmer-listings'
    );

    if (data && data.success && Array.isArray(data.listings)) {
      return data.listings;
    }
    return [];
  },

  getMyListings: async (): Promise<Listing[]> => {
    const data = await apiClient.get<Listing[] | { success: false; message: string }>('/listings/my');

    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && 'success' in data && !data.success) {
      throw new Error(data.message || 'Failed to fetch listings');
    }
    return [];
  },

  updateStatus: async (id: string, status: string): Promise<Listing> => {
    return apiClient.patch<Listing>(`/listings/${id}`, { status });
  },
};
