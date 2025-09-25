import React from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

export function HospitalGoogleMap({ center, hospitals }: { center: { lat: number, lng: number }, hospitals: any[] }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDpmbq2Fo4ViDc2rb1uajAGJ-8YBzGsIW0" // Replace with your API key
  });

  const [selected, setSelected] = React.useState<any | null>(null);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      <Marker position={center} label="You" />
      {hospitals.map((h, idx) => (
        <Marker
          key={idx}
          position={{ lat: h.latitude, lng: h.longitude }}
          onClick={() => setSelected(h)}
        />
      ))}
      {selected && (
        <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <strong>{selected.name}</strong>
            <br />
            {selected.address}
            <br />
            {selected.distance_km} km away
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

// No changes needed in this file if you are only using <HospitalGoogleMap /> as a child component.
// The 31 errors are likely from another file (such as NearbyHospitals.tsx) having duplicate or misplaced code.
// Make sure you have only one export function per file and no duplicate JSX or components.
// This file is already correct and should not be causing errors if imported and used properly.
