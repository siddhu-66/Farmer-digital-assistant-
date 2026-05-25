import { apiClient } from "@/lib/apiClient";

const BASE_URL = '/api'; // assuming this is the base URL for your API

export const locationService = {
  getLocation: (pincode: string) =>
    apiClient.get(`/location/pincode/${pincode}`),

  getWeather: (pincode: string) =>
    apiClient.get(`/location/weather/${pincode}`),

  getMarket: (pincode: string, commodity: string) =>
    apiClient.get(`/location/market/${pincode}?commodity=${commodity}`),

  getCompleteLocationInfo: async (pincode: string, commodity: string = 'Tomato') => {
    try {
      const res = await fetch(
        `${BASE_URL}/location/complete/${pincode}?commodity=${commodity}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching complete location data:', error);
      throw error;
    }
  },

  getPincodeByCoordinates: async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/location/reverse?lat=${lat}&lon=${lon}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching pincode by coordinates:', error);
      throw error;
    }
  }
};