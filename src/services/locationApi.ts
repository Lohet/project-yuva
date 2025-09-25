import { Location, LocationSearchParams, LocationResponse } from '../types/location';

// Mock data for development
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main St, City Center',
    latitude: 40.7128,
    longitude: -74.0060,
    type: 'hospital',
    specialties: ['Cardiology', 'Neurology', 'Emergency'],
    contact: { phone: '+1-555-0101' },
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Downtown Medical Clinic',
    address: '456 Oak Ave, Downtown',
    latitude: 40.7580,
    longitude: -73.9855,
    type: 'clinic',
    specialties: ['Family Medicine', 'Pediatrics'],
    contact: { phone: '+1-555-0102' },
    rating: 4.2,
  },
  {
    id: '3',
    name: '24/7 Pharmacy Plus',
    address: '789 Pine St, Midtown',
    latitude: 40.7489,
    longitude: -73.9857,
    type: 'pharmacy',
    contact: { phone: '+1-555-0103' },
    rating: 4.0,
  }
];

class LocationApiService {
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // Fallback to NYC coordinates if geolocation fails
          console.warn('Geolocation failed, using default location:', error.message);
          resolve({
            latitude: 40.7128,
            longitude: -74.0060,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  async searchNearbyLocations(params: LocationSearchParams): Promise<LocationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredLocations = mockLocations;
    
    // Filter by type if specified
    if (params.type) {
      filteredLocations = filteredLocations.filter(loc => loc.type === params.type);
    }
    
    // Filter by specialty if specified
    if (params.specialty) {
      filteredLocations = filteredLocations.filter(loc => 
        loc.specialties?.some(spec => 
          spec.toLowerCase().includes(params.specialty!.toLowerCase())
        )
      );
    }
    
    // Calculate distances and filter by radius
    const locationsWithDistance = filteredLocations.map(location => {
      const distance = this.calculateDistance(
        params.latitude,
        params.longitude,
        location.latitude,
        location.longitude
      );
      return { ...location, distance };
    }).filter(location => !params.radius || location.distance <= params.radius);
    
    // Sort by distance
    locationsWithDistance.sort((a, b) => a.distance - b.distance);
    
    return {
      locations: locationsWithDistance,
      total: locationsWithDistance.length,
      page: 1,
      hasMore: false,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  async getLocationById(id: string): Promise<Location> {
    const location = mockLocations.find(loc => loc.id === id);
    if (!location) {
      throw new Error('Location not found');
    }
    return location;
  }

  async getHospitals(params: LocationSearchParams): Promise<LocationResponse> {
    return this.searchNearbyLocations({ ...params, type: 'hospital' });
  }

  async getClinics(params: LocationSearchParams): Promise<LocationResponse> {
    return this.searchNearbyLocations({ ...params, type: 'clinic' });
  }

  async getPharmacies(params: LocationSearchParams): Promise<LocationResponse> {
    return this.searchNearbyLocations({ ...params, type: 'pharmacy' });
  }

  async getEmergencyServices(params: LocationSearchParams): Promise<LocationResponse> {
    return this.searchNearbyLocations({ ...params, type: 'emergency' });
  }
}

export const locationApi = new LocationApiService();
