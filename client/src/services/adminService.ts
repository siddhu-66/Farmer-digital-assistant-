import { apiClient } from '@/lib/apiClient';

export interface AdminAnalytics {
  users: {
    farmers: number;
    salesmen: number;
    pendingKYCs: number;
  };
  listings: {
    total: number;
    active: number;
  };
  bids: {
    total: number;
    accepted: number;
  };
  fraudAlerts: number;
}

export interface PendingUser {
  _id: string;
  name: string;
  role: string;
  status: 'pending' | 'verified' | 'approved' | 'rejected' | 'assigned';
  email?: string;
  phone?: string;
  mobile?: string;
  verified: boolean;
  createdAt: string;
}

export interface AdminUser extends PendingUser {
  isVerified: boolean;
  kycDoc?: string;
}

export const adminService = {
  getAnalytics: async (): Promise<AdminAnalytics> => {
    const data = await apiClient.get<AdminAnalytics>('/admin/analytics');
    return (data && 'users' in data) ? data : {
      users: { farmers: 0, salesmen: 0, pendingKYCs: 0 },
      listings: { total: 0, active: 0 },
      bids: { total: 0, accepted: 0 },
      fraudAlerts: 0,
    };
  },

  getPendingUsers: async (): Promise<PendingUser[]> => {
    const data = await apiClient.get<PendingUser[] | { success: false }>('/admin/pending-verifications');
    return Array.isArray(data) ? data : [];
  },

  getUsers: async (): Promise<AdminUser[]> => {
    const data = await apiClient.get<AdminUser[] | { success: false }>('/admin/users');
    return Array.isArray(data) ? data : [];
  },

  verifyUser: async (userId: string, action: 'approve' | 'reject', rejectionReason?: string, roleType?: string): Promise<{success: boolean; message: string; user?: any}> => {
    try {
      const response = await apiClient.post<{success: boolean; message: string; user?: any}>('/admin/verify-user', { userId, action, rejectionReason, roleType });
      return response;
    } catch (error: any) {
      console.error(`[adminService] verifyUser error:`, error);
      throw error;
    }
  },

  moderateListing: async (listingId: string, action: 'delete' | 'flag'): Promise<Record<string, unknown>> => {
    return apiClient.post('/admin/moderate-listing', { listingId, action });
  },

  getAllTransactions: async (): Promise<{ bids: unknown[]; orders: unknown[] }> => {
    const data = await apiClient.get<{ bids: unknown[]; orders: unknown[] }>('/admin/transactions');
    return {
      bids: Array.isArray((data as any)?.bids) ? (data as any).bids : [],
      orders: Array.isArray((data as any)?.orders) ? (data as any).orders : [],
    };
  },

  createScheme: async (schemeData: Record<string, unknown>): Promise<Record<string, unknown>> => {
    return apiClient.post('/schemes', schemeData);
  },
};
