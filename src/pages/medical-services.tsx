import React from "react";
import { NearbyHospitals } from "../components/NearbyHospitals";
import { DoctorSearch } from "../components/DoctorSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function MedicalServices() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Medical Services</h1>
      
      <Tabs defaultValue="doctors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
          <TabsTrigger value="hospitals">Find Hospitals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="doctors" className="py-4">
          <DoctorSearch />
        </TabsContent>
        
        <TabsContent value="hospitals" className="py-4">
          <NearbyHospitals />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MedicalServices;
