import { apiClient } from '@/lib/apiClient';

export type SellRequestStatus =
  | 'PENDING'
  | 'APPROVED_BY_ADMIN'
  | 'REJECTED_BY_ADMIN'
  | 'SENT_TO_BUSINESS'
  | 'ACCEPTED_BY_BUSINESS'
  | 'REJECTED_BY_BUSINESS'
  | 'COMPLETED';

export interface SellRequest {
  _id: string;
  farmerId: unknown;
  cropName: string;
  quantity: number;
  quantityUnit?: string;
  expectedPrice: number;
  currency?: string;
  location: string;
  country?: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  description?: string;
  image?: string;
  cropGrade?: string;
  qualityScore?: number;
  predictedPrice?: number;
  season?: string;
  status: SellRequestStatus;
  assignedBusinessId: unknown;
  adminRemarks?: string;
  businessRemarks?: string;
  statusHistory?: Array<{
    status: string;
    changedBy?: string;
    changedByRole?: string;
    remarks?: string;
    timestamp: string;
  }>;
  mlPredictions?: {
    quality?: {
      score?: number;
      confidence?: number;
      factors?: string[];
      predictedAt?: string;
    };
    price?: {
      predicted?: number;
      confidence?: number;
      marketTrend?: string;
      predictedAt?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface BusinessDirectoryItem {
  _id: string;
  orgName: string;
  businessType: string;
  gstNumber?: string;
  location?: string;
  user?: {
    _id?: string;
    name?: string;
    mobile?: string;
    email?: string;
    status?: string;
    verified?: boolean;
  };
}

type SellRequestCreateData = Omit<
  SellRequest,
  'farmerId' | '_id' | 'status' | 'assignedBusinessId' | 'adminRemarks' | 'businessRemarks' | 'createdAt' | 'updatedAt'
>;

function asSellRequest(res: SellRequest | { data?: SellRequest }): SellRequest {
  if (res && typeof res === 'object' && 'data' in res && (res as { data?: SellRequest }).data) {
    return (res as { data: SellRequest }).data;
  }
  return res as SellRequest;
}

function asSellRequestList(res: SellRequest[] | { data?: SellRequest[] } | { success?: false }): SellRequest[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as { data?: SellRequest[] }).data)) {
    return (res as { data: SellRequest[] }).data;
  }
  return [];
}

function asBusinessList(res: BusinessDirectoryItem[] | { data?: BusinessDirectoryItem[] } | { success?: false }): BusinessDirectoryItem[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as { data?: BusinessDirectoryItem[] }).data)) {
    return (res as { data: BusinessDirectoryItem[] }).data;
  }
  return [];
}

export const sellRequestService = {
  createSellRequest: async (data: SellRequestCreateData): Promise<SellRequest> => {
    const response = await apiClient.post<SellRequest | { data?: SellRequest }>('/sell-request', data);
    return asSellRequest(response);
  },

  getMySellRequests: async (status?: SellRequestStatus): Promise<SellRequest[]> => {
    const ep = status ? `/sell-request/my?status=${encodeURIComponent(status)}` : '/sell-request/my';
    const response = await apiClient.get<SellRequest[] | { data?: SellRequest[] }>(ep);
    return asSellRequestList(response);
  },

  getAllSellRequests: async (status?: SellRequestStatus): Promise<SellRequest[]> => {
    const ep = status
      ? `/admin/sell-requests?status=${encodeURIComponent(status)}`
      : '/admin/sell-requests';
    const response = await apiClient.get<SellRequest[] | { data?: SellRequest[] }>(ep);
    return asSellRequestList(response);
  },

  assignSellRequest: async (requestId: string, assignedBusinessId: string, adminRemarks?: string): Promise<SellRequest> => {
    const response = await apiClient.put<SellRequest | { data?: SellRequest }>(
      `/admin/sell-request/${requestId}/assign`,
      { assignedBusinessId, adminRemarks }
    );
    return asSellRequest(response);
  },

  rejectSellRequestByAdmin: async (requestId: string, adminRemarks?: string): Promise<SellRequest> => {
    const response = await apiClient.put<SellRequest | { data?: SellRequest }>(
      `/admin/sell-request/${requestId}/reject`,
      { adminRemarks }
    );
    return asSellRequest(response);
  },

  getAssignedSellRequestsForBusiness: async (status?: SellRequestStatus): Promise<SellRequest[]> => {
    const ep = status
      ? `/business/sell-requests?status=${encodeURIComponent(status)}`
      : '/business/sell-requests';
    const response = await apiClient.get<SellRequest[] | { data?: SellRequest[] }>(ep);
    return asSellRequestList(response);
  },

  acceptSellRequestByBusiness: async (requestId: string, businessRemarks?: string): Promise<SellRequest> => {
    const response = await apiClient.put<SellRequest | { data?: SellRequest }>(
      `/business/sell-request/${requestId}/accept`,
      { businessRemarks }
    );
    return asSellRequest(response);
  },

  rejectSellRequestByBusiness: async (requestId: string, businessRemarks?: string): Promise<SellRequest> => {
    const response = await apiClient.put<SellRequest | { data?: SellRequest }>(
      `/business/sell-request/${requestId}/reject`,
      { businessRemarks }
    );
    return asSellRequest(response);
  },

  getAllBusinessesForAdmin: async (): Promise<BusinessDirectoryItem[]> => {
    const response = await apiClient.get<BusinessDirectoryItem[] | { data?: BusinessDirectoryItem[] }>('/business/all');
    return asBusinessList(response);
  },
};
