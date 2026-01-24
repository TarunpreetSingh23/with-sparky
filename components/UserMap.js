"use client";

import {
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, LocateFixed, Search, Loader2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem", // matches rounded-3xl
};

// Clean map styles (removes default Google buttons/clutter)
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false, // Prevents clicking on restaurants/landmarks
  gestureHandling: "greedy", // Improves touch handling on mobile
};

export default function UserMap({ setAddress, setPincode }) {
  // Default: New Delhi (or your preferred default)
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // 1. Get Current Location on Mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingAddress(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          // If map is already loaded, pan to it
          if(mapRef.current) {
            mapRef.current.panTo(pos);
            // We don't need to call reverseGeocode here immediately, 
            // the onIdle event will trigger it.
          }
          setLoadingAddress(false);
        },
        () => {
          setLoadingAddress(false);
          // Handle error if needed
        }
      );
    }
  };

  // 2. Reverse Geocode (Get Address from Lat/Lng)
  const reverseGeocode = async (lat, lng) => {
    try {
      setLoadingAddress(true);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      
      if (data.results?.[0]) {
        const result = data.results[0];
        setAddress(result.formatted_address);

        const pin = result.address_components.find((c) =>
          c.types.includes("postal_code")
        );
        if (pin && setPincode) setPincode(pin.long_name);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // 3. Handle Map Load
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 4. Handle "Idle" (When map stops moving) - This is the Pro way
  const onIdle = () => {
    if (!mapRef.current) return;
    setIsDragging(false);
    
    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    
    // Only fetch address if we stopped dragging
    reverseGeocode(lat, lng);
  };

  // 5. Detect Dragging to animate pin
  const onDragStart = () => {
    setIsDragging(true);
  };

  // 6. Handle Search Selection
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const location = place.geometry.location;
    // Pan map to new location (this triggers onIdle, which fetches address)
    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(17);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-gray-400 font-medium">
        Loading Maps...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 bg-gray-50 group">
      
      {/* --- Top Search Bar (Floating) --- */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative bg-white shadow-xl shadow-black/5 rounded-2xl flex items-center p-1 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
          <div className="pl-3 text-gray-400">
            <Search size={20} />
          </div>
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
            className="flex-1"
          >
            <input
              type="text"
              placeholder="Search for your location..."
              className="w-full py-3.5 px-3 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
          </Autocomplete>
        </div>
      </div>

      {/* --- Center Fixed Pin (The "Uber/Blinkit" Style) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none flex flex-col items-center pb-[38px]">
        {/* The Location Tooltip */}
        <div 
          className={`mb-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl transition-all duration-200 transform
            ${isDragging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
          `}
        >
          {loadingAddress ? "Locating..." : "Order Here"}
        </div>

        {/* The Pin Icon */}
        <div className={`relative transition-transform duration-200 ${isDragging ? "-translate-y-3 scale-110" : "translate-y-0 scale-100"}`}>
           <MapPin 
             size={42} 
             className="text-red-500 drop-shadow-2xl fill-current" 
             fill="currentColor"
             stroke="white"
             strokeWidth={1.5}
           />
           {/* Pin Shadow on the ground */}
           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[2px]" />
        </div>
      </div>

      {/* --- Locate Me Button --- */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-6 right-6 z-10 bg-white text-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-50 active:scale-95 transition-all hover:bg-blue-50"
      >
        {loadingAddress && isDragging ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <LocateFixed size={22} />
        )}
      </button>

      {/* --- Google Map Component --- */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
        options={mapOptions}
        onLoad={onLoad}
        onDragStart={onDragStart}
        onIdle={onIdle} // This replaces onClick
      >
        {/* We removed the <Marker> because we are using the Fixed Center Pin method */}
      </GoogleMap>
    </div>
  );
}
