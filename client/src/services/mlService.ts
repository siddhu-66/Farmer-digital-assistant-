import { apiClient } from '@/lib/apiClient';

export interface QualityPredictionRequest {
  cropName: string;
  quantity: number;
  location: string;
  season?: string;
  imageUrl?: string;
  marketPrice?: number;
}

export interface QualityPredictionResponse {
  success: boolean;
  data: {
    cropName: string;
    qualityScore: number;
    grade: string;
    confidence: number;
    factors: string[];
    predictedAt: string;
    notes: string;
  };
}

export interface PricePredictionRequest {
  cropName: string;
  quantity: number;
  location: string;
  season?: string;
  imageUrl?: string;
  marketPrice?: number;
}

export interface PricePredictionResponse {
  success: boolean;
  data: {
    cropName: string;
    quantity: number;
    basePrice: number;
    predictedPrice: number;
    confidence: number;
    marketTrend: string;
    location: string;
    season: string;
    predictedAt: string;
    notes: string;
  };
}

export const mlService = {
  predictQuality: async (data: QualityPredictionRequest): Promise<QualityPredictionResponse> => {
    const response = await apiClient.post<{ success: boolean; data: QualityPredictionResponse } | { success: false }>('/ml/predict-quality', data);
    return (response && 'data' in response) ? response.data : response as any;
  },

  predictPrice: async (data: PricePredictionRequest): Promise<PricePredictionResponse> => {
    const response = await apiClient.post<{ success: boolean; data: PricePredictionResponse } | { success: false }>('/ml/predict-price', data);
    return (response && 'data' in response) ? response.data : response as any;
  },

  getMLStatus: async (): Promise<any> => {
    const response = await apiClient.get<any>('/ml/status');
    return response;
  },
};
