import { apiClient } from '../lib/apiClient';

export interface FarmerApplication {
  id: string; // farmer_id
  farmerName: string;
  mobile: string;
  email?: string;
  gender?: string;
  experienceYears: string;
  primaryCrops: string[];
  location: string;
  gpsLocation: string;
  landArea: string;
  landType: string;
  irrigationType: string;
  aadhaarNumber: string;
  aadhaarDocument: string;
  landDocument?: string;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  applied_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

export const farmerRegistrationService = {
  submitFarmerProfile: async (data: any): Promise<{ farmer_id: string }> => {
    const response = await apiClient.post<{ farmer?: { _id: string }; message?: string }>('/farmer/register', {
      userId: localStorage.getItem('app_user_id'),
      registrationData: {
        farmerName: data.farmerName,
        mobile: data.mobile,
        email: data.email,
        experienceYears: data.experienceYears,
        primaryCrops: data.primaryCrops,
        location: {
           state: data.state,
           district: data.district,
           village: data.village,
           address: data.address,
           pinCode: data.pinCode
        },
        landArea: data.landArea,
        landType: data.landType,
        irrigationType: data.irrigationType,
        documents: {
           aadhaarNumber: data.aadhaarNumber,
           aadhaarUrl: data.aadhaarDocument // Assuming URL or base64
        }
      }
    });

    if (response.farmer) {
      return { farmer_id: response.farmer._id };
    }
    throw new Error(typeof response.message === 'string' ? response.message : 'Failed to submit profile');
  },

  getFarmerStatus: async (): Promise<any> => {
    return await apiClient.get('/farmer/status');
  },

  getAllApplications: async (): Promise<FarmerApplication[]> => {
    const raw = await apiClient.get('/farmer/all');
    const data = Array.isArray(raw) ? raw : [];
    return data.map((item) => {
      const f = item as Record<string, unknown>;
      return {
        id: String(f._id ?? ''),
        farmerName: (f.user as { name?: string } | undefined)?.name || 'Unknown',
        mobile: (f.user as { mobile?: string } | undefined)?.mobile || '',
        email: (f.user as { email?: string } | undefined)?.email || '',
        location: `${(f.location as { village?: string; district?: string } | undefined)?.village}, ${(f.location as { district?: string } | undefined)?.district}`,
        status: ((f.user as { status?: string } | undefined)?.status || 'pending') as FarmerApplication['status'],
        verified: Boolean((f.user as { verified?: boolean } | undefined)?.verified),
        applied_at: String(f.createdAt ?? ''),
        ...f,
      } as FarmerApplication;
    });
  },

  verifyFarmer: async (
    userId: string,
    action: 'approve' | 'reject',
    reason?: string
  ): Promise<boolean> => {
    const response = await apiClient.post('/admin/verify-user', {
      userId,
      action,
      rejectionReason: reason,
      roleType: 'farmer'
    });
    return !!response.message;
  }
};
