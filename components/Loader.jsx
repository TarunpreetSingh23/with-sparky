"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2s
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1117] z-[9999]">
      <div className="flex flex-col items-center relative">
        {/* Logo */}
        <Image
          src="/LOGO (2).jpg" // place your uploaded logo in public/ as sparky-logo.jpg
          alt="Sparky"
          width={200}
          height={80}
          priority
        />

        {/* Animated Line */}
        <div className="relative w-[160px] h-[4px] mt-2 bg-gray-700 rounded">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded animate-loaderLine"></div>
        </div>
      </div>
    </div>
  );
}
