const axios = require('axios');

let missingKeyWarningShown = false;

function warnMissingApiKeyOnce() {
  if (missingKeyWarningShown || process.env.NODE_ENV === 'test') return;
  missingKeyWarningShown = true;
  console.warn(
    '[WeatherService] OPENWEATHER_API_KEY is not set in server/.env — live weather will use fallback data.'
  );
}

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
  }

  isLiveWeatherConfigured() {
    return Boolean(this.apiKey);
  }

  async getCurrentWeather(location) {
    try {
      if (!this.apiKey) {
        warnMissingApiKeyOnce();
        return this.getFallbackWeather(location);
      }

      let url;
      if (location.lat && location.lon) {
        url = `${this.baseURL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=metric`;
      } else if (location.city) {
        url = `${this.baseURL}/weather?q=${encodeURIComponent(location.city)}&appid=${this.apiKey}&units=metric`;
      } else if (location.pincode) {
        url = `${this.baseURL}/weather?zip=${encodeURIComponent(location.pincode)},${location.country || 'IN'}&appid=${this.apiKey}&units=metric`;
      } else {
        throw new Error('Invalid location parameters');
      }

      const response = await axios.get(url, { timeout: 5000 });
      
      const data = response.data;
      return {
        success: true,
        data: {
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: data.wind?.speed || 0,
          pressure: data.main.pressure,
          condition: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          location: data.name || location.city || 'Unknown',
          country: data.sys?.country || location.country || 'IN',
          coordinates: {
            lat: data.coord?.lat || location.lat,
            lon: data.coord?.lon || location.lon
          },
          recordedAt: new Date().toISOString(),
          source: 'openweathermap'
        }
      };
    } catch (error) {
      console.error('[WeatherService] getCurrentWeather error:', error.message);
      return this.getFallbackWeather(location);
    }
  }

  async getWeatherForecast(location, days = 5) {
    try {
      if (!this.apiKey) {
        warnMissingApiKeyOnce();
        return this.getFallbackForecast(location, days);
      }

      let url;
      if (location.lat && location.lon) {
        url = `${this.baseURL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}&units=metric`;
      } else if (location.city) {
        url = `${this.baseURL}/forecast?q=${encodeURIComponent(location.city)}&appid=${this.apiKey}&units=metric`;
      } else if (location.pincode) {
        url = `${this.baseURL}/forecast?zip=${encodeURIComponent(location.pincode)},${location.country || 'IN'}&appid=${this.apiKey}&units=metric`;
      } else {
        throw new Error('Invalid location parameters');
      }

      const response = await axios.get(url, { timeout: 5000 });
      
      const data = response.data;
      
      // Filter for midday forecasts (around 12:00 PM) for cleaner data
      const dailyForecasts = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, days);

      const forecast = dailyForecasts.map(item => ({
        date: item.dt_txt,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind?.speed || 0,
        pressure: item.main.pressure
      }));

      return {
        success: true,
        data: {
          location: data.city?.name || location.city || 'Unknown',
          country: data.city?.country || location.country || 'IN',
          forecast,
          source: 'openweathermap'
        }
      };
    } catch (error) {
      console.error('[WeatherService] getWeatherForecast error:', error.message);
      return this.getFallbackForecast(location, days);
    }
  }

  async getWeatherAlerts(location) {
    try {
      if (!this.apiKey) {
        return { success: true, data: { alerts: [] } };
      }

      // OpenWeatherMap One Call API for alerts (requires subscription)
      // For now, return basic weather-based recommendations
      const current = await this.getCurrentWeather(location);
      
      if (!current.success) {
        return { success: true, data: { alerts: [] } };
      }

      const alerts = [];
      const weather = current.data;

      // Generate simple weather-based alerts
      if (weather.temp > 35) {
        alerts.push({
          type: 'heat',
          severity: 'moderate',
          message: 'High temperature detected. Ensure proper irrigation and crop protection.',
          recommendation: 'Increase irrigation frequency and provide shade if possible.'
        });
      }

      if (weather.humidity > 80) {
        alerts.push({
          type: 'humidity',
          severity: 'low',
          message: 'High humidity detected. Monitor for fungal diseases.',
          recommendation: 'Consider fungicide application and improve air circulation.'
        });
      }

      if (weather.windSpeed > 15) {
        alerts.push({
          type: 'wind',
          severity: 'moderate',
          message: 'Strong winds detected. Secure loose items and protect crops.',
          recommendation: 'Reinforce support structures and avoid spraying pesticides.'
        });
      }

      return {
        success: true,
        data: {
          alerts,
          source: 'weather_analysis'
        }
      };
    } catch (error) {
      console.error('[WeatherService] getWeatherAlerts error:', error.message);
      return { success: true, data: { alerts: [] } };
    }
  }

  getFallbackWeather(location) {
    console.log('[WeatherService] Using fallback weather data');
    return {
      success: true,
      data: {
        temp: 28,
        humidity: 65,
        windSpeed: 8,
        pressure: 1013,
        condition: 'Partly Cloudy',
        description: 'Partly cloudy conditions (Offline)',
        icon: '02d',
        location: location.city || location.pincode || 'Unknown',
        country: location.country || 'IN',
        coordinates: {
          lat: location.lat || 30.9010,
          lon: location.lon || 75.8573
        },
        recordedAt: new Date().toISOString(),
        source: 'fallback'
      }
    };
  }

  getFallbackForecast(location, days = 5) {
    console.log('[WeatherService] Using fallback forecast data');
    
    const forecast = [];
    const baseTemp = 28;
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(12, 0, 0, 0);
      
      const tempVariation = Math.random() * 6 - 3; // ±3 degrees variation
      
      forecast.push({
        date: date.toISOString(),
        temp: Math.round(baseTemp + tempVariation),
        humidity: 60 + Math.round(Math.random() * 20),
        condition: ['Clear', 'Clouds', 'Partly Cloudy', 'Rain'][Math.floor(Math.random() * 4)],
        description: 'Simulated weather (Offline)',
        icon: '01d',
        windSpeed: 5 + Math.random() * 10,
        pressure: 1010 + Math.random() * 10
      });
    }

    return {
      success: true,
      data: {
        location: location.city || location.pincode || 'Unknown',
        country: location.country || 'IN',
        forecast,
        source: 'fallback'
      }
    };
  }

  // Get agricultural recommendations based on weather
  getAgriculturalRecommendations(weatherData) {
    const recommendations = [];
    const { temp, humidity, condition, windSpeed } = weatherData;

    // Temperature-based recommendations
    if (temp > 35) {
      recommendations.push({
        category: 'irrigation',
        priority: 'high',
        message: 'Increase irrigation frequency due to high temperature',
        action: 'Water crops early morning or late evening'
      });
    } else if (temp < 15) {
      recommendations.push({
        category: 'protection',
        priority: 'medium',
        message: 'Low temperature may affect crop growth',
        action: 'Consider frost protection measures'
      });
    }

    // Humidity-based recommendations
    if (humidity > 80) {
      recommendations.push({
        category: 'disease',
        priority: 'medium',
        message: 'High humidity increases disease risk',
        action: 'Monitor for fungal diseases, consider fungicide'
      });
    }

    // Condition-based recommendations
    if (condition === 'Rain') {
      recommendations.push({
        category: 'fieldwork',
        priority: 'high',
        message: 'Rain detected - avoid field operations',
        action: 'Postpone spraying and fertilizing activities'
      });
    } else if (condition === 'Clear' && temp > 30) {
      recommendations.push({
        category: 'harvest',
        priority: 'medium',
        message: 'Clear sunny conditions suitable for harvesting',
        action: 'Good day for harvesting mature crops'
      });
    }

    // Wind-based recommendations
    if (windSpeed > 15) {
      recommendations.push({
        category: 'spraying',
        priority: 'high',
        message: 'High winds - avoid pesticide spraying',
        action: 'Postpone spraying to prevent drift'
      });
    }

    return recommendations;
  }
}

module.exports = new WeatherService();
