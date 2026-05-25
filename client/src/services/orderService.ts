import { apiClient } from '@/lib/apiClient';

export type OrderStatus = 'Pending' | 'Approved' | 'Assigned' | 'In Progress' | 'Completed' | 'Rejected';
export type OrderUnit = 'kg' | 'quintal' | 'ton';

export const CROP_LIST = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Potato', 'Onion', 'Tomato', 'Soybean', 'Mustard'];

export const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; step: number }> = {
  'Pending':    { label: 'Awaiting Review',      bg: 'bg-yellow-50',  color: 'text-yellow-600 border-yellow-200', step: 1 },
  'Approved':   { label: 'Admin Approved',        bg: 'bg-green-50',   color: 'text-green-600 border-green-200',   step: 2 },
  'Assigned':   { label: 'Farmers Notified',      bg: 'bg-blue-50',    color: 'text-blue-600 border-blue-200',     step: 3 },
  'In Progress':{ label: 'Collection Started',    bg: 'bg-orange-50',  color: 'text-orange-600 border-orange-200', step: 4 },
  'Completed':  { label: 'Order Fulfilled',       bg: 'bg-indigo-50',  color: 'text-indigo-600 border-indigo-200', step: 5 },
  'Rejected':   { label: 'Needs Revision',        bg: 'bg-red-50',     color: 'text-red-600 border-red-200',       step: 0 },
  // Lowercase aliases for legacy pages
  'pending':    { label: 'Awaiting Review',      bg: 'bg-yellow-50',  color: 'text-yellow-600 border-yellow-200', step: 1 },
  'approved':   { label: 'Admin Approved',        bg: 'bg-green-50',   color: 'text-green-600 border-green-200',   step: 2 },
  'assigned':   { label: 'Farmers Notified',      bg: 'bg-blue-50',    color: 'text-blue-600 border-blue-200',     step: 3 },
  'in_progress':{ label: 'Collection Started',    bg: 'bg-orange-50',  color: 'text-orange-600 border-orange-200', step: 4 },
  'completed':  { label: 'Order Fulfilled',       bg: 'bg-indigo-50',  color: 'text-indigo-600 border-indigo-200', step: 5 },
  'rejected':   { label: 'Needs Revision',        bg: 'bg-red-50',     color: 'text-red-600 border-red-200',       step: 0 },
};

export interface Order {
  _id: string;
  id?: string;
  salesman: string | { _id: string; name: string };
  customerName: string;
  crop: string;
  cropName?: string;
  quantity: number;
  unit: OrderUnit;
  pricePerQtl?: number;
  expectedPrice?: number;
  deliveryLocation?: string;
  deliveryDate?: string;
  requiredDate?: string;
  status: OrderStatus;
  rejectionReason?: string;
  adminNotes?: string;
  notes?: string;
  assignedFarmers: {
    farmer: string | { _id: string; name: string };
    status: 'Notified' | 'Accepted' | 'Declined';
  }[];
  assignedFarmerIds?: string[];
  farmerResponses?: Record<string, string>;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  salesmanName?: string;
}

function addLegacyFields(o: Order): Order {
  return {
    ...o,
    id: o._id,
    cropName: o.crop,
    requiredDate: o.deliveryDate || '',
    expectedPrice: o.pricePerQtl,
    created_at: o.createdAt,
    notes: o.adminNotes,
    salesmanName: typeof o.salesman === 'object' ? o.salesman.name : 'Salesman',
    assignedFarmerIds: (o.assignedFarmers || []).map((af) =>
      typeof af.farmer === 'object' ? af.farmer._id : af.farmer
    ),
    farmerResponses: (o.assignedFarmers || []).reduce(
      (acc, af) => {
        const fid = typeof af.farmer === 'object' ? af.farmer._id : af.farmer;
        acc[fid] = af.status.toLowerCase();
        return acc;
      },
      {} as Record<string, string>
    ),
  };
}

export const orderService = {
  createOrder: async (data: Partial<Order>): Promise<Order> => {
    return apiClient.post<Order>('/order/create', data);
  },

  getOrders: async (): Promise<Order[]> => {
    const raw = await apiClient.get<Order[] | { success: false; message: string }>('/order/list');
    const orders: Order[] = Array.isArray(raw) ? raw : [];
    return orders.map(addLegacyFields);
  },

  getAllOrders: function () {
    return this.getOrders();
  },

  getSalesmanOrders: async function (sid: string) {
    const all = await this.getOrders();
    return all.filter((o) => {
      const oid = typeof o.salesman === 'object' ? o.salesman._id : o.salesman;
      return oid === sid;
    });
  },

  getFarmerOrders: async function (fid: string) {
    const all = await this.getOrders();
    return all.filter((o) =>
      o.assignedFarmers.some((af) =>
        (typeof af.farmer === 'object' ? af.farmer._id : af.farmer) === fid
      )
    );
  },

  getCurrentSalesmanId: (): string => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user._id || user.id || '';
        } catch {
          return '';
        }
      }
    }
    return '';
  },

  updateStatus: async (orderId: string, status: OrderStatus, notes?: string): Promise<Order> => {
    return apiClient.post<Order>('/order/update-status', { orderId, status, adminNotes: notes });
  },

  resubmitOrder: async function (orderId: string, data: Partial<Order>) {
    return this.createOrder({ ...data, orderId, isResubmission: true } as any);
  },

  respondToOrder: async (orderId: string, status: 'Accepted' | 'Declined'): Promise<Order> => {
    return apiClient.post<Order>('/order/respond', { orderId, status });
  },

  assignFarmers: async (orderId: string, farmerIds: string[]): Promise<Order> => {
    return apiClient.post<Order>('/order/assign-farmers', { orderId, farmerIds });
  },
};
