import { apiClient } from '@/lib/apiClient';

export interface Scheme {
  _id: string;
  title: string;
  description: string;
  eligibility?: string;
  benefits?: string;
  applyLink?: string;
  category: 'subsidy' | 'insurance' | 'loan' | 'training' | 'other';
  state?: string;
  createdAt: string;
}

export const schemeService = {
  getSchemes: async (params?: { category?: string; state?: string }): Promise<Scheme[]> => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const data = await apiClient.get<Scheme[] | { success: false }>(`/schemes${query ? `?${query}` : ''}`);
    return Array.isArray(data) ? data : [];
  },

  createScheme: async (data: Partial<Scheme>): Promise<Scheme> => {
    return apiClient.post<Scheme>('/schemes', data);
  },
};
