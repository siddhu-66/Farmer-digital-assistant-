/**
 * Weather data for the UI.
 *
 * - Analytics / dashboard: Next.js proxy at `/api/weather` (OpenWeather via app route).
 * - Pincode widgets (WeatherCard): Express at `/api/weather/by-pincode/:pincode` (Next rewrite → backend).
 */
import { apiClient } from '@/lib/apiClient';

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  icon?: string;
  location?: string;
  forecast: Array<{ day: string; temp: number; condition: string; icon?: string }>;
}

const WEATHER_FALLBACK: WeatherData = {
  temp: 28,
  humidity: 65,
  condition: 'Sunny (Offline)',
  forecast: [
    { day: 'Mon', temp: 28, condition: 'Sunny' },
    { day: 'Tue', temp: 29, condition: 'Sunny' },
    { day: 'Wed', temp: 27, condition: 'Cloudy' },
    { day: 'Thu', temp: 26, condition: 'Rain' },
  ],
};

function mapForecastList(forecastData: { list?: Array<{ dt_txt?: string; main?: { temp?: number }; weather?: Array<{ main?: string; icon?: string }> }> }) {
  return Array.isArray(forecastData?.list)
    ? forecastData.list.map((f) => ({
        day: f?.dt_txt
          ? new Date(f.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })
          : '—',
        temp: f?.main?.temp ?? 0,
        condition: f?.weather?.[0]?.main ?? 'Unknown',
        icon: f?.weather?.[0]?.icon ?? '',
      }))
    : [];
}

export const weatherService = {
  /** Analytics page — Next.js OpenWeather proxy */
  getWeatherData: async (): Promise<WeatherData> => {
    return weatherService.getCurrentWeather('Ludhiana');
  },

  getCurrentWeather: async (city: string): Promise<WeatherData> => {
    try {
      const [current, forecastData] = await Promise.all([
        fetch('/api/weather?type=current').then((res) => res.json()),
        fetch('/api/weather?type=forecast').then((res) => res.json()),
      ]);

      if (current?.error) throw new Error(current.error);

      return {
        temp: current?.temp ?? 0,
        humidity: current?.humidity ?? 0,
        condition: current?.condition ?? 'Unknown',
        icon: current?.icon,
        location: current?.location ?? city,
        forecast: mapForecastList(forecastData),
      };
    } catch {
      return { ...WEATHER_FALLBACK, location: city };
    }
  },

  /** Pincode — Express backend via Next rewrite */
  getWeatherByPincode: async (pincode: string): Promise<WeatherData> => {
    try {
      const safePincode = encodeURIComponent(pincode.trim());
      const response = await fetch(`/api/weather/by-pincode/${safePincode}?type=current`);
      const payload = await response.json();

      if (!payload?.success || !payload?.data?.weather) {
        throw new Error(payload?.message || 'Failed to fetch pincode weather');
      }

      const w = payload.data.weather;
      return {
        temp: w.temp ?? 0,
        humidity: w.humidity ?? 0,
        condition: w.condition ?? 'Unknown',
        icon: w.icon,
        location: w.location ?? `Pincode ${pincode}`,
        forecast: [],
      };
    } catch {
      return { ...WEATHER_FALLBACK, location: `Pincode ${pincode}` };
    }
  },

  subscribeToLiveUpdates: (callback: (data: unknown) => void) => {
    return apiClient.subscribe('weather_update', callback);
  },
};
