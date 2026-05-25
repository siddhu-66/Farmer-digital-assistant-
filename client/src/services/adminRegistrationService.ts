import { apiClient } from '../lib/apiClient';

export interface AdminApplication {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  organization?: string;
  location: string;
  username: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  applied_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

export const adminRegistrationService = {
  submitAdminRegistration: async (data: any): Promise<any> => {
    // Admin registration is just a user registration with role 'admin'
    const response = await apiClient.post<{
      user?: Record<string, unknown>;
      message?: string;
    }>('/auth/register', {
      name: data.fullName,
      mobile: data.mobile,
      email: data.email,
      password: data.password,
      role: 'admin'
    });

    if (response.user) {
      return response;
    }
    throw new Error(typeof response.message === 'string' ? response.message : 'Failed to register admin');
  },

  getAdminStatus: async (): Promise<any> => {
    // In a real system, we'd have a specific profile or status endpoint
    return await apiClient.get('/auth/status'); 
  },

  getAllApplications: async (): Promise<AdminApplication[]> => {
    const raw = await apiClient.get('/admin/pending-verifications');
    const data = Array.isArray(raw) ? raw : [];
    return data
      .filter((item) => (item as Record<string, unknown>).role === 'admin')
      .map((item) => {
        const u = item as Record<string, unknown>;
        return {
          id: String(u._id ?? ''),
          fullName: String(u.name ?? ''),
          email: String(u.email ?? ''),
          mobile: String(u.mobile ?? ''),
          username: 'admin',
          location: 'N/A',
          status: (u.status === 'pending'
            ? 'Pending Approval'
            : u.status === 'approved'
              ? 'Approved'
              : 'Rejected') as AdminApplication['status'],
          applied_at: String(u.createdAt ?? ''),
        };
      });
  },

  verifyAdmin: async (userId: string, action: 'approve' | 'reject', reason?: string): Promise<boolean> => {
    const response = await apiClient.post('/admin/verify-user', {
      userId,
      action,
      rejectionReason: reason,
      roleType: 'admin'
    });
    return !!response.message;
  }
};
