import React, { useEffect, useState } from "react";
import { HospitalGoogleMap } from "./HospitalGoogleMap";

const defaultLocation = { lat: 12.8399, lng: 80.1555 };

export function NearbyHospitals() {
    const [location, setLocation] = useState(defaultLocation);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch hospitals from backend
    useEffect(() => {
        fetch("http://localhost:5000/hospitals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: location.lat, longitude: location.lng }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched hospitals:", data); // Log the fetched data
                setHospitals(data);
                setError(null);
            })
            .catch((e) => {
                console.error("Error fetching hospitals:", e);
                setError(`Error fetching hospitals: ${e.message}`);
                setHospitals([]);
            });
    }, [location]);

    return (
        <div>
            <h2>Nearby Specialist Hospitals</h2>
            <button
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                            },
                            (err) => {
                                console.error("Geolocation error:", err);
                                setError(`Geolocation error: ${err.message}`);
                            }
                        );
                    } else {
                        setError("Geolocation is not supported by this browser.");
                    }
                }}
            >
                Find Hospitals Near Me
            </button>
            <div style={{ margin: "1em 0" }}>
                <b>Location:</b> {location.lat}, {location.lng}
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <HospitalGoogleMap center={location} hospitals={hospitals} />
            <h3>Recommended Hospitals within 20km</h3>
            {hospitals.length === 0 ? (
                <div>No hospitals found within 20km of your location.</div>
            ) : (
                <ul>
                    {hospitals.map((h, idx) => (
                        <li key={idx}>
                            <b>{h.name}</b> - {h.address} ({h.distance_km} km)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
