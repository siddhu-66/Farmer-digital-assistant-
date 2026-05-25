"use client";

import { useEffect, useState, useCallback } from "react";
import { locationService } from "@/services/locationservice";

type LocationData = {
  pincode: string;
  officeName?: string;
  district?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
};

type WeatherData = {
  temperature?: number;
  humidity?: number;
  feelsLike?: number;
  condition?: string;
  description?: string;
  windSpeed?: number;
};

type MarketItem = {
  market: string;
  commodity: string;
  variety: string;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  arrivalDate: string;
};

const labels = {
  en: {
    title: "Location Dashboard",
    pincode: "Pincode",
    commodity: "Commodity",
    search: "Search",
    location: "Location",
    weather: "Weather",
    market: "Market Prices",
    office: "Office",
    district: "District",
    state: "State",
    temp: "Temperature",
    humidity: "Humidity",
    feelsLike: "Feels Like",
    condition: "Condition",
    wind: "Wind Speed",
    noLocation: "No location data",
    noWeather: "No weather data",
    noMarket: "No market data",
    detecting: "Detecting location...",
    useMyLocation: "Use My Location",
  },
  hi: {
    title: "लोकेशन डैशबोर्ड",
    pincode: "पिनकोड",
    commodity: "फसल",
    search: "खोजें",
    location: "स्थान",
    weather: "मौसम",
    market: "मंडी भाव",
    office: "ऑफिस",
    district: "जिला",
    state: "राज्य",
    temp: "तापमान",
    humidity: "नमी",
    feelsLike: "अनुभव तापमान",
    condition: "स्थिति",
    wind: "हवा की गति",
    noLocation: "लोकेशन डेटा नहीं मिला",
    noWeather: "मौसम डेटा नहीं मिला",
    noMarket: "मार्केट डेटा नहीं मिला",
    detecting: "लोकेशन पता की जा रही है...",
    useMyLocation: "मेरी लोकेशन उपयोग करें",
  },
  gu: {
    title: "લોકેશન ડેશબોર્ડ",
    pincode: "પિનકોડ",
    commodity: "પાક",
    search: "શોધો",
    location: "સ્થાન",
    weather: "હવામાન",
    market: "બજાર ભાવ",
    office: "ઓફિસ",
    district: "જિલ્લો",
    state: "રાજ્ય",
    temp: "તાપમાન",
    humidity: "ભેજ",
    feelsLike: "અનુભવાતું તાપમાન",
    condition: "પરિસ્થિતિ",
    wind: "પવન ગતિ",
    noLocation: "લોકેશન ડેટા મળ્યો નથી",
    noWeather: "હવામાન ડેટા મળ્યો નથી",
    noMarket: "બજાર ડેટા મળ્યો નથી",
    detecting: "લોકેશન શોધાઈ રહી છે...",
    useMyLocation: "મારી લોકેશન વાપરો",
  },
};

export default function LocationDashboardPage() {
  const [pincode, setPincode] = useState("");
  const [commodity, setCommodity] = useState("Tomato");
  const [language, setLanguage] = useState<"en" | "hi" | "gu">("en");

  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [markets, setMarkets] = useState<MarketItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  const t = labels[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app_language") as "en" | "hi" | "gu" | null;
    const savedPincode = localStorage.getItem("app_pincode");

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedPincode) setPincode(savedPincode);
  }, []);

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  const fetchAllData = useCallback(async (pin: string) => {
    if (!pin || pin.length !== 6) {
      setError("Enter valid 6-digit pincode");
      return;
    }

    try {
      setLoading(true);
      setError("");

      localStorage.setItem("app_pincode", pin);

      const [locationRes, weatherRes, marketRes] = await Promise.all([
        locationService.getLocation(pin),
        locationService.getWeather(pin),
        locationService.getMarket(pin, commodity),
      ]);

      if (locationRes?.success === false) {
        setLocation(null);
        setWeather(null);
        setMarkets([]);
        setError(String(locationRes?.message || "Location not found"));
        return;
      }

      setLocation((locationRes as any).location || null);
      setWeather((weatherRes as any).weather || null);
      setMarkets((marketRes as any).markets || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data");
      setLocation(null);
      setWeather(null);
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }, [commodity]);

  const handleSearch = async () => {
    await fetchAllData(pincode);
  };

  // Live search when pincode length is 6
  useEffect(() => {
    if (pincode.length === 6) {
      const timer = setTimeout(() => {
        fetchAllData(pincode);
      }, 500); // Debounce 500ms

      return () => clearTimeout(timer);
    }
  }, [pincode, commodity, fetchAllData]);

  // Auto location detection with reverse geocoding
  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser");
      return;
    }

    try {
      setDetecting(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          

          try {
            // Use reverse geocoding API to get pincode from coordinates
            const response = await locationService.getPincodeByCoordinates(
              position.coords.latitude, 
              position.coords.longitude
            );
            
            if (response.success && response.data.pincode) {
              setPincode(response.data.pincode);
              // Auto-search when pincode is detected
              await fetchAllData(response.data.pincode);
            } else {
              setError("Could not detect pincode for your location");
            }
          } catch (reverseError) {
            console.error("Reverse geocoding error:", reverseError);
            setError("Failed to get pincode from coordinates");
          }
        },
        (geoError) => {
          console.error("Geolocation error:", geoError);
          setDetecting(false);
          setError("Could not detect current location");
        }
      );
    } catch (_err) {
      setDetecting(false);
      setError("Failed to detect location");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-green-700">{t.title}</h1>

          <div className="grid gap-4 md:grid-cols-5">
            <input
              type="text"
              placeholder={t.pincode}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              placeholder={t.commodity}
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
            />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "gu")}
              className="rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="gu">Gujarati</option>
            </select>

            <button
              onClick={handleSearch}
              className="rounded-xl bg-green-600 p-3 font-semibold text-white hover:bg-green-700"
            >
              {loading ? "Loading..." : t.search}
            </button>

            <button
              onClick={handleUseMyLocation}
              className="rounded-xl bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
            >
              {detecting ? t.detecting : t.useMyLocation}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-green-700">{t.location}</h2>
            {location ? (
              <div className="space-y-2">
                <p><strong>Pincode:</strong> {location.pincode}</p>
                <p><strong>{t.office}:</strong> {location.officeName || "-"}</p>
                <p><strong>{t.district}:</strong> {location.district || "-"}</p>
                <p><strong>{t.state}:</strong> {location.state || "-"}</p>
              </div>
            ) : (
              <p>{t.noLocation}</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-sky-700">{t.weather}</h2>
            {weather ? (
              <div className="space-y-2">
                <p><strong>{t.temp}:</strong> {weather.temperature ?? "-"} °C</p>
                <p><strong>{t.humidity}:</strong> {weather.humidity ?? "-"} %</p>
                <p><strong>{t.feelsLike}:</strong> {weather.feelsLike ?? "-"} °C</p>
                <p><strong>{t.condition}:</strong> {weather.condition || "-"}</p>
                <p><strong>Description:</strong> {weather.description || "-"}</p>
                <p><strong>{t.wind}:</strong> {weather.windSpeed ?? "-"} m/s</p>
              </div>
            ) : (
              <p>{t.noWeather}</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-orange-700">{t.market}</h2>
          {markets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-orange-100 text-left">
                    <th className="p-3">Market</th>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Variety</th>
                    <th className="p-3">Min Price</th>
                    <th className="p-3">Max Price</th>
                    <th className="p-3">Modal Price</th>
                    <th className="p-3">Arrival Date</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.market}</td>
                      <td className="p-3">{item.commodity}</td>
                      <td className="p-3">{item.variety}</td>
                      <td className="p-3">{item.minPrice}</td>
                      <td className="p-3">{item.maxPrice}</td>
                      <td className="p-3">{item.modalPrice}</td>
                      <td className="p-3">{item.arrivalDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{t.noMarket}</p>
          )}
        </div>
      </div>
    </div>
  );
}