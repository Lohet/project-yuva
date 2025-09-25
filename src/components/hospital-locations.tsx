import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  Filter,
  Search,
  Loader2
} from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export function HospitalLocations() {
  const { currentLocation, nearbyLocations, loading, error, searchLocations, refreshLocation } = useLocation();
  const [searchRadius, setSearchRadius] = useState(10);
  const [locationType, setLocationType] = useState<string>('hospital');
  const [specialty, setSpecialty] = useState<string>('');

  useEffect(() => {
    if (currentLocation) {
      handleSearch();
    }
  }, [currentLocation]);

  const handleSearch = async () => {
    await searchLocations({
      radius: searchRadius,
      type: locationType,
      ...(specialty && { specialty }),
    });
  };

  const getDirections = (location: any) => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const callLocation = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (error && !nearbyLocations.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshLocation} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
            Retry Location Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={locationType} onValueChange={setLocationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                  <SelectItem value="pharmacy">Pharmacies</SelectItem>
                  <SelectItem value="emergency">Emergency Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Radius (km)</label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Specialty</label>
              <Input
                placeholder="e.g., Cardiology, Neurology"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {nearbyLocations.length > 0 ? `Found ${nearbyLocations.length} locations` : 'No locations found'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  {location.rating && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {location.rating}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="w-fit">
                  {location.type}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{location.address}</span>
                </div>
                
                {location.distance && (
                  <div className="text-sm text-muted-foreground">
                    Distance: {location.distance.toFixed(1)} km
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => getDirections(location)}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                  
                  {location.contact?.phone && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => callLocation(location.contact!.phone)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for locations...</p>
          </div>
        )}
      </div>
    </div>
  );
}