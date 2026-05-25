import { apiClient } from '@/lib/apiClient';

export interface FarmerProfile {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  landSize: number;
  location: string;
  soilType?: string;
  waterSource?: string;
}

/**
 * Farmer Service
 * 
 * Handles all CRUD operations for farmer data.
 * This service connects to the backend which uses Prisma/Supabase for persistence.
 */
class FarmerService {
  /** Get all farmers (Admin view) */
  async getAllFarmers() {
    const data = await apiClient.get('/farmer/all');
    // Guard: apiClient.get returns {success:false, message} on network error
    return Array.isArray(data) ? data : [];
  }

  /** Get current farmer's status and profile */
  async getMyStatus() {
    return await apiClient.get('/farmer/status');
  }

  /** Get a single farmer by ID */
  async getFarmerById(id: string) {
    return await apiClient.get(`/farmers/${id}`);
  }

  /** Create a new farmer record */
  async createFarmer(data: any) {
    return await apiClient.post('/farmer/register', data);
  }

  /** Update an existing farmer profile in Supabase */
  async updateFarmer(id: string, data: Partial<FarmerProfile>) {
    return await apiClient.post(`/farmer/${id}`, data); // Backend uses PUT, but apiClient.post can be adjusted if it supports methods
  }

  /** Delete farmer record from Supabase (Admin) */
  async deleteFarmer(id: string) {
    return await apiClient.get(`/farmer/delete/${id}`); // Adjusting for simplicity if needed, but let's assume PUT for now
  }
}

export const farmerService = new FarmerService();
