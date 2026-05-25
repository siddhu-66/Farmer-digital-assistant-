'use client';

import { apiClient } from '@/lib/apiClient';

export interface B2BRequest {
  id: string;
  farmerId: string;
  farmerName?: string;
  farmerPhone?: string;
  companyId: string;
  companyName: string;
  crop: string;
  weight: number;
  pricePerQtl: number;
  expectedProfit: number;
  status: 'Pending' | 'Admin_Approved' | 'Salesman_Assigned' | 'Logistics_Scheduled' | 'Completed' | 'Rejected';
  createdAt: string;
  updatedAt: string;
  images: string[];
  mlQualityTier?: string;
  mlPriceMultiplier?: number;
  mlConfidence?: number;
  assignedSalesmanId?: string;
  assignedSalesmanName?: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  type: 'Recycle' | 'Bio-feed' | 'Processing';
  status: 'Online' | 'Busy' | 'Maintenance';
  load: string;
}

export const SALESMEN = [
  { id: 'sales-1', name: 'Arjun Mehta', region: 'North', company: 'One-to-One' },
  { id: 'sales-2', name: 'Siddharth Singh', region: 'South', company: 'One-to-One' },
  { id: 'sales-3', name: 'Vikram Rao', region: 'West', company: 'One-to-One' },
];

const STORAGE_KEY = 'farmer_assistant_b2b_requests';

export const b2bService = {
  createRequest: (data: Omit<B2BRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): B2BRequest => {
    const requests = b2bService.getAllRequests();
    const newRequest: B2BRequest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return newRequest;
  },

  getAllRequests: (): B2BRequest[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getFarmerRequests: (farmerId: string): B2BRequest[] => {
    return b2bService.getAllRequests().filter(r => r.farmerId === farmerId);
  },

  getRequestsBySalesman: (salesmanId: string): B2BRequest[] => {
    return b2bService.getAllRequests().filter(r => r.assignedSalesmanId === salesmanId);
  },

  updateRequestStatus: (id: string, status: B2BRequest['status']) => {
    const requests = b2bService.getAllRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      requests[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      window.dispatchEvent(new Event('b2b-request-updated'));
    }
  },

  assignToSalesman: (requestId: string, salesmanId: string) => {
    const requests = b2bService.getAllRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      const salesman = SALESMEN.find(s => s.id === salesmanId);
      requests[index].assignedSalesmanId = salesmanId;
      requests[index].assignedSalesmanName = salesman?.name || 'Assigned';
      requests[index].status = 'Salesman_Assigned';
      requests[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      window.dispatchEvent(new Event('b2b-request-updated'));
    }
  },

  /**
   * Real-time Industry Partners Subscription
   */
  getLiveIndustries: async (): Promise<IndustryPartner[]> => {
    // Simulated API call
    return [
      { id: 'ind-1', name: 'Green-Recycle Plant. A', type: 'Recycle', status: 'Online', load: '15%' },
      { id: 'ind-2', name: 'BioFeed Nutrition Co.', type: 'Bio-feed', status: 'Busy', load: '85%' },
      { id: 'ind-3', name: 'Mandi Logistics Hub', type: 'Processing', status: 'Online', load: '40%' },
    ];
  },

  subscribeToIndustryLive: (callback: (data: any) => void) => {
    return apiClient.subscribe('system_update', callback);
  }
};
