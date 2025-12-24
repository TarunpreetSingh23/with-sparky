"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// ✅ Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Punjab bounds
const PUNJAB_BOUNDS = [
  [29.5, 73.5],
  [32.7, 76.0],
];

function LocationMarker({ setAddress }) {
  const [position, setPosition] = useState(null);

  // Detect location on load
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        await reverseGeocode(lat, lng);
      },
      () => console.warn("Geolocation denied")
    );
  }, []);

  // Handle map clicks
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      await reverseGeocode(lat, lng);
    },
  });

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  }

  return position ? <Marker position={position} /> : null;
}

export default function UserMap({ setAddress }) {
  return (
    <MapContainer
      bounds={PUNJAB_BOUNDS}
      zoom={7}
      className="h-[400px] w-full rounded-lg overflow-hidden"
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setAddress={setAddress} />
    </MapContainer>
  );
}
