'use client';

import React, { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationData {
  pincode: string;
  state: string;
  district: string;
  postOffices: Array<{
    name: string;
    branchType: string;
    deliveryStatus: string;
    description?: string;
  }>;
}

interface PincodeInputProps {
  onPincodeChange: (pincode: string, locationData?: LocationData) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const PincodeInput: React.FC<PincodeInputProps> = ({
  onPincodeChange,
  className = '',
  placeholder = 'Enter 6-digit pincode',
  disabled = false
}) => {
  const [pincode, setPincode] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  // Validate pincode format
  const validatePincode = (value: string): boolean => {
    return /^\d{0,6}$/.test(value);
  };

  // Fetch location data for pincode
  const fetchLocationData = async (code: string) => {
    if (code.length !== 6) {
      setLocationData(null);
      onPincodeChange(code);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/location/pincode/${code}`);
      const data = await response.json();

      if (data.success) {
        setLocationData(data.data);
        setError('');
        onPincodeChange(code, data.data);
      } else {
        setError(data.message || 'Pincode not found');
        setLocationData(null);
        onPincodeChange(code);
      }
    } catch (_err) {
      setError('Failed to fetch location data');
      setLocationData(null);
      onPincodeChange(code);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (validatePincode(value)) {
      setPincode(value);
      setIsTouched(true);
      
      // Debounce API call
      const timeoutId = setTimeout(() => {
        fetchLocationData(value);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setIsTouched(true);
    if (pincode.length === 6) {
      fetchLocationData(pincode);
    }
  };

  // Handle search by current location (geolocation)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`/api/location/nearby?lat=${latitude}&lon=${longitude}&radius=5`);
          const data = await response.json();

          if (data.success && data.data.pincodes.length > 0) {
            const nearestPincode = data.data.pincodes[0];
            setPincode(nearestPincode.pincode);
            await fetchLocationData(nearestPincode.pincode);
          } else {
            setError('No pincodes found near your location');
          }
        } catch (_err) {
          setError('Failed to get location from coordinates');
        } finally {
          setIsLoading(false);
        }
      },
      (_error) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  // Display error for invalid pincode
  const getErrorMessage = () => {
    if (isTouched && pincode.length > 0 && pincode.length < 6) {
      return 'Pincode must be 6 digits';
    }
    if (error) {
      return error;
    }
    return '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={pincode}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          maxLength={6}
          className={`
            block w-full pl-10 pr-20 py-3 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${getErrorMessage() ? 'border-red-500' : 'border-gray-300'}
            ${pincode.length === 6 && !error ? 'border-green-500' : ''}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading ? (
            <div className="pr-3">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="flex">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={disabled || isLoading}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                title="Use current location"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {getErrorMessage() && (
        <p className="text-sm text-red-600">
          {getErrorMessage()}
        </p>
      )}

      {locationData && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                {locationData.postOffices[0]?.name}, {locationData.district}
              </p>
              <p className="text-sm text-green-600">
                {locationData.state} • {locationData.pincode}
              </p>
              {locationData.postOffices.length > 1 && (
                <p className="text-xs text-green-600 mt-1">
                  +{locationData.postOffices.length - 1} more post office(s)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {pincode.length === 6 && !isLoading && !locationData && !error && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Searching for pincode {pincode}...
          </p>
        </div>
      )}
    </div>
  );
};

export default PincodeInput;
