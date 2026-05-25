'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Cloud, Droplets, Wind, Thermometer, Eye, Loader2, AlertTriangle } from 'lucide-react';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  condition: string;
  description: string;
  icon: string;
  location: string;
  country: string;
  recordedAt: string;
  source: string;
}

interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  action: string;
}

interface WeatherCardProps {
  pincode: string;
  language?: string;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  pincode,
  language = 'en',
  className = ''
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather data
  const fetchWeatherData = useCallback(async () => {
    if (!pincode || pincode.length !== 6) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/weather/by-pincode/${pincode}?lang=${language}`);
      const data = await response.json();

      if (data.success) {
        setWeatherData(data.data.weather);
        setRecommendations(data.data.recommendations || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch weather data');
        setWeatherData(null);
        setRecommendations([]);
      }
    } catch (_err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, [pincode, language]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Get weather icon URL
  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">Weather Data Unavailable</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Cloud className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Enter a valid pincode to see weather information</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Weather Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{weatherData.location}</h3>
            <p className="text-blue-100">{weatherData.country} • {pincode}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {weatherData.icon && (
                <Image
                  src={getWeatherIconUrl(weatherData.icon)}
                  alt={weatherData.condition}
                  width={48}
                  height={48}
                  unoptimized
                />
              )}
              <div>
                <p className="text-3xl font-bold">{weatherData.temp}°C</p>
                <p className="text-blue-100 text-sm">{weatherData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-semibold">{weatherData.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p className="font-semibold">{weatherData.windSpeed} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Pressure</p>
              <p className="font-semibold">{weatherData.pressure} hPa</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="font-semibold">{weatherData.condition}</p>
            </div>
          </div>
        </div>

        {/* Agricultural Recommendations */}
        {recommendations.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Agricultural Recommendations</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rec.message}</p>
                      <p className="text-xs mt-1 opacity-75">{rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Source: {weatherData.source}</span>
            <span>Last updated: {new Date(weatherData.recordedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
