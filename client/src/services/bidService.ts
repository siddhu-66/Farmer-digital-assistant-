import { apiClient } from '@/lib/apiClient';

export interface Bid {
  _id: string;
  listing: string | { _id: string; crop: string; variety: string };
  salesman: string | { _id: string; name: string; mobile: string };
  offeredPrice: number;
  quantity: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
}

export const bidService = {
  placeBid: async (data: {
    listingId: string;
    offeredPrice: number;
    quantity: number;
    notes?: string;
  }): Promise<Bid> => {
    return apiClient.post<Bid>('/bids', data);
  },

  getBidsForListing: async (listingId: string): Promise<Bid[]> => {
    const data = await apiClient.get<Bid[] | { success: false; message: string }>(
      `/bids/listing/${listingId}`
    );
    return Array.isArray(data) ? data : [];
  },

  updateBidStatus: async (id: string, status: string): Promise<Bid> => {
    return apiClient.patch<Bid>(`/bids/${id}`, { status });
  },

  /** Salesman/Business — bids submitted by the current user */
  getMyBids: async (): Promise<Bid[]> => {
    const data = await apiClient.get<Bid[] | { success: false; message: string }>('/bids/my');
    return Array.isArray(data) ? data : [];
  },

  /** Farmer — bids on the farmer's own listings */
  getBidsForMyListings: async (): Promise<Bid[]> => {
    const data = await apiClient.get<Bid[] | { success: false; message: string }>(
      '/bids/listings/my'
    );
    return Array.isArray(data) ? data : [];
  },
};
