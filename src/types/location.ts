export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  specialties?: string[];
  contact?: {
    phone: string;
    email?: string;
  };
  rating?: number;
  distance?: number;
}

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  specialty?: string;
}

export interface LocationResponse {
  locations: Location[];
  total: number;
  page: number;
  hasMore: boolean;
}
