"use client";
import dynamic from "next/dynamic";

const UserMap = dynamic(() => import("@/components/UserMap"), {
  ssr: false, // ⛔ disables server-side rendering
});

export default function MapPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select Your Location</h1>
      <UserMap setAddress={(addr) => console.log("Selected:", addr)} />
    </div>
  );
}
