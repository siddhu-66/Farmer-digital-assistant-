import { apiClient } from '../lib/apiClient';

export interface SalesmanApplication {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  hubId: string;
  region: string;
  vehicleNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

export const salesmanRegistrationService = {
  submitSalesmanRegistration: async (data: any): Promise<any> => {
    const response = await apiClient.post<{
      user?: Record<string, unknown>;
      message?: string;
    }>('/auth/register', {
      name: data.fullName,
      mobile: data.mobile,
      email: data.email,
      password: data.password,
      role: 'salesman'
    });

    if (response.user) {
      return response;
    }
    throw new Error(typeof response.message === 'string' ? response.message : 'Failed to register salesman');
  },

  getSalesmanStatus: async (): Promise<any> => {
    return await apiClient.get('/auth/status');
  },

  verifySalesman: async (userId: string, action: 'approve' | 'reject', reason?: string): Promise<boolean> => {
    const response = await apiClient.post('/admin/verify-user', {
      userId,
      action,
      rejectionReason: reason,
      roleType: 'salesman'
    });
    return !!response.message;
  }
};
