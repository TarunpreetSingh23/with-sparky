// "use client";

// import { useState } from "react";
// import GoogleMapComponent from "@/components/GoogleMap";

// export default function LocationPage() {
//   const [userLocation, setUserLocation] = useState(null);

//   const handleLocationDetected = (loc) => {
//     setUserLocation(loc);

//     // 💾 store in localStorage
//     localStorage.setItem("userLocation", JSON.stringify(loc));
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Your Location</h1>

//       <GoogleMapComponent onLocationDetected={handleLocationDetected} />

//       {userLocation && (
//         <div className="bg-gray-100 p-4 rounded">
//           <p><b>Latitude:</b> {userLocation.lat}</p>
//           <p><b>Longitude:</b> {userLocation.lng}</p>
//         </div>
//       )}
//     </div>
//   );
// }
