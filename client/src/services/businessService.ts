import { apiClient } from '@/lib/apiClient';

export interface BusinessStats {
  committedQty: string;
  onboardedCustomers: number;
  disbursedAmount: string;
}

export interface BusinessOffer {
  crop: string;
  region: string;
  price: string;
  status: string;
}

export interface ProcurementOp {
  id: string;
  customer: string;
  location: string;
  crop: string;
  qty: string;
  status: string;
}

export interface SourcingProjections {
  trend: string;
  activeCustomers: number;
  targetMet: string;
}

export interface ChatListEntry {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  unread: boolean;
}

export interface ChatHistoryItem {
  sender: 'user' | 'me';
  text: string;
  time: string;
}

export interface ContractResponse {
  success: boolean;
  id: string;
}

// Fallback data when backend has no data yet
const FALLBACK_STATS: BusinessStats = { committedQty: '2,450 MT', onboardedCustomers: 158, disbursedAmount: '₹85L' };
const FALLBACK_OFFERS: BusinessOffer[] = [
  { crop: 'Wheat (LOK-1)', region: 'Punjab, Haryana', price: '₹2,550/q', status: '85% Fulfilled' },
  { crop: 'Basmati Rice', region: 'Uttar Pradesh', price: '₹3,800/q', status: '20% Fulfilled' },
  { crop: 'Maize (Yellow)', region: 'Bihar', price: '₹2,100/q', status: '60% Fulfilled' },
  { crop: 'Cotton (Long Staple)', region: 'Gujarat', price: '₹7,500/q', status: '45% Fulfilled' },
  { crop: 'Mustard (Black)', region: 'Rajasthan', price: '₹5,800/q', status: '10% Fulfilled' },
];
const FALLBACK_CHAT: ChatListEntry[] = [
  { id: 0, name: 'Ram Singh', lastMsg: 'I have 10MT of wheat ready.', time: '2h ago', unread: true },
  { id: 1, name: 'Sita Devi', lastMsg: 'When will the pickup arrive?', time: '5h ago', unread: false },
  { id: 2, name: 'Market Support', lastMsg: 'Your procurement post is live.', time: '1d ago', unread: false },
];
const FALLBACK_PROCUREMENT: ProcurementOp[] = [
  { id: 'PROC-001', customer: 'Ram Singh', location: 'Ludhiana', crop: 'Wheat', qty: '15 MT', status: 'In Transit' },
  { id: 'PROC-002', customer: 'Sita Devi', location: 'Moga', crop: 'Maize', qty: '8 MT', status: 'Pending Pickup' },
  { id: 'PROC-003', customer: 'Harpreet S.', location: 'Pathankot', crop: 'Rice', qty: '22 MT', status: 'Quality Check' },
];

export const businessService = {
  getDashboardStats: async (): Promise<BusinessStats> => {
    const data = await apiClient.get<BusinessStats>('/business/stats');
    return (data && 'committedQty' in data) ? data : FALLBACK_STATS;
  },

  getRecentOffers: async (): Promise<BusinessOffer[]> => {
    const data = await apiClient.get<BusinessOffer[] | { success: false }>('/business/offers');
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_OFFERS;
  },

  getSourcingProjections: async (): Promise<SourcingProjections> => {
    const data = await apiClient.get<SourcingProjections>('/business/projections');
    return (data && 'trend' in data) ? data : { trend: '+15%', activeCustomers: 1240, targetMet: '65%' };
  },

  getChatList: async (): Promise<ChatListEntry[]> => {
    const data = await apiClient.get<ChatListEntry[] | { success: false }>('/business/messages');
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_CHAT;
  },

  getProcurementOperations: async (): Promise<ProcurementOp[]> => {
    const data = await apiClient.get<ProcurementOp[] | { success: false }>('/business/procurement');
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROCUREMENT;
  },

  getChatHistory: async (chatId: number): Promise<ChatHistoryItem[]> => {
    const data = await apiClient.get<ChatHistoryItem[] | { success: false }>(`/business/messages/${chatId}`);
    return Array.isArray(data) ? data : [
      { sender: 'user', text: 'Hello! I saw your recent procurement post.', time: 'Yesterday' },
      { sender: 'me', text: 'Yes, we are looking for high-quality LOK-1 wheat.', time: 'Yesterday' },
      { sender: 'user', text: 'I have 10MT of wheat ready.', time: '2h ago' },
    ];
  },

  postContract: async (data: Record<string, string | number | boolean>): Promise<ContractResponse> => {
    const result = await apiClient.post<ContractResponse>('/business/post-contract', data);
    return (result && 'id' in result) ? result : { success: true, id: `CON-${Math.floor(Math.random() * 9000) + 1000}` };
  },
};
