"use client";

import {
  GoogleMap,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState, useCallback } from "react";
import { LocateFixed, Search, Loader2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
<<<<<<< HEAD
  borderRadius: "1.5rem", // matches rounded-3xl
=======
  borderRadius: "1.5rem",
>>>>>>> fd10377 (f)
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: "greedy", 
};

export default function UserMap({ setAddress, setPincode }) {
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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
          if(mapRef.current) {
            mapRef.current.panTo(pos);
          }
          setLoadingAddress(false);
        },
        () => {
          setLoadingAddress(false);
        }
      );
    }
  };

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

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onIdle = () => {
    if (!mapRef.current) return;
    setIsDragging(false);
    
    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    
    reverseGeocode(lat, lng);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;
    const location = place.geometry.location;
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
      
      {/* --- Top Search Bar --- */}
      <div className="absolute top-4 left-4 right-4 z-50">
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
              placeholder="Search location..."
              className="w-full py-3.5 px-3 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
          </Autocomplete>
        </div>
      </div>

      {/* --- CUSTOM CENTER MARKER --- */}
      {/* FIX: z-index set to 50 to appear above map tiles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center pb-[50px]">
        
        {/* Tooltip */}
        <div 
          className={`mb-3 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-2xl transition-all duration-200 transform
            ${isDragging ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
          `}
        >
          {loadingAddress ? "Locating..." : "Deliver Here"}
        </div>

        {/* CUSTOM IMAGE PIN */}
        {/* Replace '/pin.png' with your actual image path */}
        <div className={`relative transition-transform duration-200 ${isDragging ? "-translate-y-4 scale-110" : "translate-y-0 scale-100"}`}>
            {/* If you don't have an image yet, this SVG acts as a nice placeholder */}
             <img 
               src="https://cdn-icons-png.flaticon.com/512/927/927667.png" 
               alt="Location Marker" 
               className="w-12 h-12 drop-shadow-2xl"
             />
             {/* Pin Shadow */}
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-[2px]" />
        </div>
      </div>

      {/* --- Locate Me Button --- */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-6 right-6 z-50 bg-white text-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-50 active:scale-95 transition-all hover:bg-blue-50"
      >
        {loadingAddress && isDragging ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <LocateFixed size={22} />
        )}
      </button>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
        options={mapOptions}
        onLoad={onLoad}
        onDragStart={onDragStart}
        onIdle={onIdle}
      />
    </div>
  );
}