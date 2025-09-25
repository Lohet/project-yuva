import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Location, LocationSearchParams } from '../types/location';
import { locationApi } from '../services/locationApi';

interface LocationContextType {
  currentLocation: { latitude: number; longitude: number } | null;
  nearbyLocations: Location[];
  loading: boolean;
  error: string | null;
  searchLocations: (params: Omit<LocationSearchParams, 'latitude' | 'longitude'>) => Promise<void>;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await locationApi.getCurrentLocation();
      setCurrentLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const searchLocations = async (params: Omit<LocationSearchParams, 'latitude' | 'longitude'>) => {
    if (!currentLocation) {
      setError('Location not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await locationApi.searchNearbyLocations({
        ...params,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      setNearbyLocations(response.locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  const value: LocationContextType = {
    currentLocation,
    nearbyLocations,
    loading,
    error,
    searchLocations,
    refreshLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
