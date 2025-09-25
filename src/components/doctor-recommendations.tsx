import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, MapPin, Phone, Calendar, Clock, Search, Stethoscope, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  phone: string;
  availability: string;
  languages: string[];
  education: string;
  experience: number;
  image?: string;
}

interface Hospital {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  specialty: string;
}

// All available hospitals with coordinates
const allHospitals: Hospital[] = [
  { id: 1, name: 'Apollo Hospital', position: { lat: 13.0827, lng: 80.2707 }, specialty: 'Multi-Specialty' },
  { id: 2, name: 'Fortis Hospital', position: { lat: 13.0569, lng: 80.2425 }, specialty: 'Cardiology' },
  { id: 3, name: 'MIOT International', position: { lat: 13.0212, lng: 80.1819 }, specialty: 'Orthopedics' },
  { id: 4, name: 'Sankara Nethralaya', position: { lat: 13.0569, lng: 80.2508 }, specialty: 'Ophthalmology' },
  { id: 5, name: 'Madras Medical Mission', position: { lat: 13.1067, lng: 80.2756 }, specialty: 'Cardiology' },
  { id: 6, name: 'Kauvery Hospital', position: { lat: 13.0418, lng: 80.2341 }, specialty: 'Neurology' }
];

// Helper to calculate distance between two coordinates (Haversine formula)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function DoctorRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const specialties = [
    'Cardiology', 'Neurology', 'Pulmonology', 'Gastroenterology', 
    'Orthopedics', 'Dermatology', 'Ophthalmology', 'Psychiatry',
    'Pediatrics', 'Emergency Medicine', 'Internal Medicine', 'Family Medicine'
  ];

  const locations = [
    'Downtown Medical Center', 'Westside Hospital', 'North Valley Clinic',
    'Southside Medical Plaza', 'East End Healthcare', 'Central Hospital'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'Chinese', 'Arabic', 'Hindi', 'Portuguese', 'Russian'
  ];

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Maria Rodriguez',
      specialty: 'Cardiology',
      rating: 4.8,
      reviews: 124,
      location: 'Downtown Medical Center',
      distance: '2.3 km',
      phone: '+1 (555) 123-4567',
      availability: 'Available today',
      languages: ['English', 'Spanish'],
      education: 'Harvard Medical School',
      experience: 15,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Dr. Ahmed Hassan',
      specialty: 'Neurology',
      rating: 4.9,
      reviews: 89,
      location: 'Westside Hospital',
      distance: '4.1 km',
      phone: '+1 (555) 234-5678',
      availability: 'Next available: Tomorrow 2 PM',
      languages: ['English', 'Arabic'],
      education: 'Johns Hopkins University',
      experience: 12,
    },
    {
      id: '3',
      name: 'Dr. Li Wei Chen',
      specialty: 'Internal Medicine',
      rating: 4.7,
      reviews: 156,
      location: 'North Valley Clinic',
      distance: '3.8 km',
      phone: '+1 (555) 345-6789',
      availability: 'Available today',
      languages: ['English', 'Chinese'],
      education: 'Stanford University',
      experience: 18,
    },
    {
      id: '4',
      name: 'Dr. Sarah Johnson',
      specialty: 'Emergency Medicine',
      rating: 4.6,
      reviews: 203,
      location: 'Central Hospital',
      distance: '1.9 km',
      phone: '+1 (555) 456-7890',
      availability: 'Available now',
      languages: ['English', 'French'],
      education: 'Yale Medical School',
      experience: 10,
    },
    {
      id: '5',
      name: 'Dr. Priya Patel',
      specialty: 'Pediatrics',
      rating: 4.9,
      reviews: 98,
      location: 'Southside Medical Plaza',
      distance: '5.2 km',
      phone: '+1 (555) 567-8901',
      availability: 'Next available: Today 4 PM',
      languages: ['English', 'Hindi'],
      education: 'UCLA Medical School',
      experience: 8,
    }
  ];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || selectedLocation === 'all' || doctor.location === selectedLocation;
    const matchesLanguage = !selectedLanguage || selectedLanguage === 'all' || doctor.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesLanguage;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowMap(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setShowMap(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setShowMap(true);
    }
  };

  // Filter and sort hospitals by distance to user location (within 20km)
  const filteredHospitals = React.useMemo(() => {
    if (!userLocation) return [];
    return allHospitals
      .map(hospital => ({
        ...hospital,
        distance: getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          hospital.position.lat,
          hospital.position.lng
        ),
      }))
      .filter(hospital => hospital.distance <= 20)
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [userLocation, selectedSpecialty]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Find Specialist Doctors
          </CardTitle>
          <p className="text-muted-foreground">
            Search for qualified healthcare providers based on your needs and preferred language
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Hospital Map Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nearby Specialist Hospitals
                </CardTitle>
                <Button 
                  onClick={getUserLocation} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Find Hospitals Near Me
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showMap ? (
                <div className="space-y-4">
                  <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">Interactive Map View</p>
                      <p className="text-sm text-gray-500">
                        Google Maps integration would appear here
                      </p>
                      {userLocation && (
                        <p className="text-xs text-green-600 mt-2">
                          Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Hospital Cards */}
                  {filteredHospitals.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <div>No hospitals found within 20km of your location.</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredHospitals.map((hospital, idx) => (
                        <Card
                          key={hospital.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedHospital === hospital.id ? 'ring-2 ring-blue-500' : ''
                          } ${idx === 0 && userLocation ? 'border-2 border-green-500' : ''}`}
                          onClick={() => setSelectedHospital(hospital.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {hospital.name}
                                  {idx === 0 && userLocation && (
                                    <span className="ml-2 text-xs text-green-600 font-semibold">
                                      (Nearest)
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground">{hospital.specialty}</p>
                                {userLocation && (
                                  <p className="text-xs text-muted-foreground">
                                    Distance: {hospital.distance!.toFixed(2)} km
                                  </p>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 w-full"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    if (userLocation) {
                                      window.open(
                                        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.position.lat},${hospital.position.lng}&travelmode=driving`,
                                        '_blank'
                                      );
                                    }
                                  }}
                                >
                                  Get Directions
                                </Button>
                              </div>
                              <MapPin className="h-5 w-5 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Click to view nearby hospitals</p>
                  <Button onClick={getUserLocation} variant="outline">
                    <Navigation className="h-4 w-4 mr-2" />
                    Show Hospital Locations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Doctor name or specialty"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredDoctors.length} doctors matching your criteria
            </p>
            <Button variant="outline" size="sm">
              Sort by rating
            </Button>
          </div>
          
          {/* Doctor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      {doctor.image ? (
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                      ) : (
                        <AvatarFallback>
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(doctor.rating)}
                        </div>
                        <span className="text-sm">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({doctor.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{doctor.location} • {doctor.distance}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className={doctor.availability.includes('Available') ? 'text-green-600' : ''}>
                            {doctor.availability}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((language) => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {doctor.education} • {doctor.experience} years experience
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2">No doctors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find more doctors
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}