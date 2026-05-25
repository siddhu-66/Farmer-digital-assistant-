import { apiClient } from '@/lib/apiClient';

export interface Partner {
  _id: string;
  name: string;
  type: 'Bio-Refinery' | 'Feed Processor' | 'Power Plant' | 'Other';
  location: string;
  distance: number;
  accepts: string[];
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export const partnerService = {
  getNearbyPartners: async (): Promise<Partner[]> => {
    const data = await apiClient.get<Partner[] | { success: false }>('/partners/nearby');
    return Array.isArray(data) ? data : [];
  },

  createPartner: async (data: Partner): Promise<Partner> => {
    return apiClient.post<Partner>('/partners', data);
  },
};
