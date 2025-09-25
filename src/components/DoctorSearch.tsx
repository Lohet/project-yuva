import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  location: string;
  rating: number;
  distance: number;
}

// Mock doctor data - replace with API call in production
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    languages: ["English", "Hindi", "Tamil"],
    location: "Apollo Hospital, Chennai",
    rating: 4.8,
    distance: 3.2
  },
  {
    id: "2",
    name: "Dr. Ramesh Kumar",
    specialty: "Pediatrics",
    languages: ["English", "Tamil", "Telugu"],
    location: "Rainbow Children's Hospital, Chennai",
    rating: 4.7,
    distance: 5.1
  },
  {
    id: "3",
    name: "Dr. Anita Gupta",
    specialty: "Dermatology",
    languages: ["English", "Hindi"],
    location: "VIT Health Center",
    rating: 4.5,
    distance: 0.5
  },
  {
    id: "4", 
    name: "Dr. John Mathew",
    specialty: "Orthopedics",
    languages: ["English", "Malayalam", "Tamil"],
    location: "CMC Vellore",
    rating: 4.9,
    distance: 8.2
  }
];

const specialties = [
  "Any Specialty", "Cardiology", "Dermatology", "Pediatrics", 
  "Orthopedics", "Neurology", "Gynecology"
];

const languages = [
  "Any Language", "English", "Hindi", "Tamil", 
  "Telugu", "Malayalam", "Kannada"
];

export function DoctorSearch() {
  const [specialty, setSpecialty] = useState<string>("Any Specialty");
  const [language, setLanguage] = useState<string>("Any Language");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<Doctor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    setHasSearched(true);
    // Filter the mock data based on search criteria
    const filtered = mockDoctors.filter(doctor => {
      const matchesSpecialty = specialty === "Any Specialty" || doctor.specialty === specialty;
      const matchesLanguage = language === "Any Language" || doctor.languages.includes(language);
      const matchesQuery = searchQuery === "" || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesSpecialty && matchesLanguage && matchesQuery;
    });
    
    setResults(filtered);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Find Specialist Doctors</h2>
        <p className="text-muted-foreground">
          Search for qualified healthcare providers based on your needs and preferred language
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm mb-2 block">Specialty</label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm mb-2 block">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm mb-2 block">Name or Location</label>
          <Input 
            placeholder="Search by name or location" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Button onClick={handleSearch} className="w-full">Search Doctors</Button>
      
      {hasSearched && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {results.length} {results.length === 1 ? 'Doctor' : 'Doctors'} Found
          </h3>
          
          {results.length === 0 ? (
            <p>No doctors match your search criteria. Please try different filters.</p>
          ) : (
            results.map(doctor => (
              <Card key={doctor.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold">{doctor.name}</h4>
                      <p className="text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-sm mt-1">{doctor.location} • {doctor.distance} km away</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {doctor.languages.map(lang => (
                          <span key={lang} className="bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-primary/10 text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center">
                        {doctor.rating}
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">Contact</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
