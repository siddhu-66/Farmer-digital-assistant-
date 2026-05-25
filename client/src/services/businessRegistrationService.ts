import { apiClient } from '../lib/apiClient';

export interface BusinessApplication {
  id: string;
  orgName: string;
  businessType: string;
  ownerName: string;
  location: string;
  gpsLocation: string;
  shopFrontImage: string;
  gstNumber: string;
  gstCertificate: string;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  applied_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

export const businessRegistrationService = {
  submitBusinessProfile: async (data: any): Promise<{ business_id: string }> => {
    const response = await apiClient.post<{ business?: { _id: string }; message?: string }>('/business/register', {
      userId: localStorage.getItem('app_user_id'),
      businessData: {
        orgName: data.orgName,
        businessType: data.businessType,
        ownerName: data.ownerName,
        gstNumber: data.gstNumber,
        location: `${data.city || ''}, ${data.state || ''} - ${data.pinCode || ''}`,
        gpsLocation: data.gpsLocation || '',
        documents: {
          gstCertificateUrl: data.gstCertificate,
          shopPhotos: [data.shopFrontImage]
        }
      }
    });

    if (response.business) {
      return { business_id: response.business._id };
    }
    throw new Error(typeof response.message === 'string' ? response.message : 'Failed to submit business profile');
  },

  getBusinessStatus: async (): Promise<any> => {
    return await apiClient.get('/business/status');
  },

  getAllApplications: async (): Promise<BusinessApplication[]> => {
    const raw = await apiClient.get('/business/all');
    const data = Array.isArray(raw) ? raw : [];
    return data.map((item) => {
      const b = item as Record<string, unknown>;
      return {
        id: String(b._id ?? ''),
        orgName: String(b.orgName ?? ''),
        businessType: String(b.businessType ?? ''),
        ownerName: String(b.ownerName ?? ''),
        location: String(b.location ?? ''),
        gpsLocation: String(b.gpsLocation ?? ''),
        shopFrontImage: String(b.shopFrontImage ?? ''),
        gstNumber: String(b.gstNumber ?? ''),
        gstCertificate: String(b.gstCertificate ?? ''),
        status: ((b.user as { status?: string } | undefined)?.status || 'pending') as BusinessApplication['status'],
        verified: Boolean((b.user as { verified?: boolean } | undefined)?.verified),
        applied_at: String(b.createdAt ?? ''),
        ...b,
      } as BusinessApplication;
    });
  },

  verifyBusiness: async (
    userId: string,
    action: 'approve' | 'reject',
    reason?: string
  ): Promise<boolean> => {
    const response = await apiClient.post('/admin/verify-user', {
      userId,
      action,
      rejectionReason: reason,
      roleType: 'business'
    });
    return !!response.message;
  }
};
