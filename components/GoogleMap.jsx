"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GoogleMapComponent({ onLocationDetected }) {
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // 📍 Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(loc);
        onLocationDetected?.(loc); // send to parent
      },
      () => {
        alert("Location permission denied");
      }
    );
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;

  if (!location) return <p>Detecting location...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={15}
    >
      <Marker position={location} />
    </GoogleMap>
  );
}
