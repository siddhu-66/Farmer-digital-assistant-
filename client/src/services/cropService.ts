import { apiClient } from '@/lib/apiClient';

export interface Crop {
  _id: string;
  cropName: string;
  category: string;
  season: string;
  description: string;
  basePrice: number;
  unit: string;
  imageUrl: string;
  isActive: boolean;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export const cropService = {
  getAllCrops: async (filters?: { category?: string; season?: string; isActive?: boolean }): Promise<Crop[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.season) queryParams.append('season', filters.season);
      if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
      
      const url = `/crop-management${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ success: boolean; data: Crop[] } | { success: false }>(url);
      return (response && 'data' in response && Array.isArray(response.data)) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch crops:', error);
      return [];
    }
  },

  getCropById: async (id: string): Promise<Crop | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Crop } | { success: false }>(`/crop-management/${id}`);
      return (response && 'data' in response) ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch crop:', error);
      return null;
    }
  },

  createCrop: async (data: Partial<Crop>): Promise<Crop> => {
    const response = await apiClient.post<{ success: boolean; data: Crop } | { success: false }>('/crop-management', data);
    if (!(response && 'data' in response)) {
      throw new Error('Failed to create crop');
    }
    return response.data;
  },

  updateCrop: async (id: string, data: Partial<Crop>): Promise<Crop> => {
    const response = await apiClient.put<{ success: boolean; data: Crop } | { success: false }>(`/crop-management/${id}`, data);
    if (!(response && 'data' in response)) {
      throw new Error('Failed to update crop');
    }
    return response.data;
  },

  deleteCrop: async (id: string): Promise<void> => {
    const response = await apiClient.delete<{ success: boolean } | { success: false }>(`/crop-management/${id}`);
    if (!(response && 'success' in response && response.success)) {
      throw new Error('Failed to delete crop');
    }
  }
};
