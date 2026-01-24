"use client";

import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";

export default function UserMap({ setAddress, setPincode }) {
  const [position, setPosition] = useState({ lat: 30.9, lng: 75.85 });
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Get current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPosition({ lat, lng });
      reverseGeocode(lat, lng);
    });
  };

  // Reverse geocode
  async function reverseGeocode(lat, lng) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();
    if (!data.results?.[0]) return;

    const result = data.results[0];
    setAddress(result.formatted_address);

    const pin = result.address_components.find((c) =>
      c.types.includes("postal_code")
    );
    if (pin && setPincode) setPincode(pin.long_name);
  }

  // When user selects search place
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setPosition({ lat, lng });
    setAddress(place.formatted_address);
  };

  // Click map
  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });
    reverseGeocode(lat, lng);
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl border border-gray-200">

      {/* Search Floating Card */}
      <div className="absolute top-3 left-3 right-3 z-10 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-lg flex items-center gap-2">
        <MapPin className="text-blue-600" size={18} />
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search your delivery location"
            className="w-full outline-none font-semibold text-sm bg-transparent"
          />
        </Autocomplete>
      </div>

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 z-10 bg-white p-3 rounded-full shadow-xl border hover:scale-105 transition"
      >
        <LocateFixed size={18} className="text-blue-600" />
      </button>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={position}
        zoom={15}
        onClick={onMapClick}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker position={position} />
      </GoogleMap>
    </div>
  );
}
