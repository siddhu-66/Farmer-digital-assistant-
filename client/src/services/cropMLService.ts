import { apiClient } from '@/lib/apiClient';

export interface CropInput {
  cropName:      string;
  moisture:      number;
  size:          'Small' | 'Medium' | 'Large';
  colorScore:    number;
  freshnessDays: number;
  damagePercent: number;
  marketDemand:  'Low' | 'Medium' | 'High';
  marketPrice?:  number;
}

export interface CropPrediction extends CropInput {
  _id:            string;
  farmer:         string;
  quality:        'Low' | 'Medium' | 'High' | null;
  predictedPrice: number | null;
  finalPrice:     number | null;
  mlError:        string | null;
  status:         'pending' | 'approved' | 'rejected';
  createdAt:      string;
  updatedAt:      string;
}

export const cropMLService = {
  /** Farmer: submit crop details and get ML prediction */
  predict: async (data: CropInput): Promise<{ success: boolean; data: CropPrediction; mlError?: string }> => {
    return apiClient.post('/crops/predict', data);
  },

  /** Farmer: view their own submissions */
  getMyPredictions: async (): Promise<CropPrediction[]> => {
    const res = await apiClient.get<CropPrediction[] | { success: false }>('/crops/my');
    return Array.isArray(res) ? res : [];
  },

  /** Admin: view all submissions (optionally filter by status) */
  getAllPredictions: async (status?: 'pending' | 'approved' | 'rejected'): Promise<CropPrediction[]> => {
    const endpoint = status ? `/crops?status=${status}` : '/crops';
    const res = await apiClient.get<CropPrediction[] | { success: false }>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  /** Admin/Business: view only approved crops */
  getApprovedCrops: async (): Promise<CropPrediction[]> => {
    const res = await apiClient.get<CropPrediction[] | { success: false }>('/crops/approved');
    return Array.isArray(res) ? res : [];
  },

  /** Admin: approve or reject a submission */
  updateStatus: async (
    id: string,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ): Promise<{ success: boolean; data: CropPrediction }> => {
    return apiClient.patch(`/crops/${id}/status`, { status, adminNotes });
  },
};
