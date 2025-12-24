"use client";

import Image from "next/image";
import { Star, Clock, Plus } from "lucide-react";

// Mock Data (Replace with your actual API data)
const MOST_BOOKED_SERVICES = [
  {
    id: 1,
    title: "Intense Sofa Cleaning",
    rating: 4.8,
    reviews: "12k",
    price: 699,
    originalPrice: 999,
    time: "45 mins",
    image: "/images/sofa.jpg", // Replace with real paths
    bestseller: true,
  },
  {
    id: 2,
    title: "Classic Haircut & Beard",
    rating: 4.9,
    reviews: "8.5k",
    price: 349,
    originalPrice: 499,
    time: "30 mins",
    image: "/images/haircut.jpg",
    bestseller: true,
  },
  {
    id: 3,
    title: "AC Deep Service",
    rating: 4.7,
    reviews: "22k",
    price: 599,
    originalPrice: 899,
    time: "60 mins",
    image: "/images/ac.jpg",
    bestseller: false,
  },
  {
    id: 4,
    title: "Full Home Deep Clean",
    rating: 4.9,
    reviews: "5k",
    price: 2499,
    originalPrice: 3500,
    time: "4 hrs",
    image: "/images/cleaning.jpg",
    bestseller: true,
  },
];

export default function MostBookedSection() {
  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Modern & Clean */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="text-left">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Most Booked <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Trusted by thousands of neighbors near you.
            </p>
          </div>
          {/* Optional: 'View All' link for desktop */}
          <button className="hidden md:block text-sm font-semibold text-blue-600 hover:underline">
            View all services →
          </button>
        </div>

        {/* Services Grid - Optimized for Mobile (2 columns) & Desktop (4 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {MOST_BOOKED_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Mobile View All Button (Bottom) */}
        <div className="mt-8 text-center md:hidden">
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm w-full active:bg-gray-50">
                View all services
            </button>
        </div>

      </div>
    </section>
  );
}

// --------------------------------------------------------
// THE COMPONENT: Looks like a real app card
// --------------------------------------------------------
function ServiceCard({ service }) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative">
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* Bestseller Tag */}
        {service.bestseller && (
          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-[4px] shadow-sm">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
              Bestseller
            </span>
          </div>
        )}
        
        {/* Image (Use next/image in real implementation) */}
        {/* Placeholder for demo purposes if image fails */}
        <img
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Rating Badge (Overlaid on image like Airbnb/Urban Company) */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-800">{service.rating}</span>
            <span className="text-[10px] text-gray-400">({service.reviews})</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* Title */}
        <h3 className="text-[13px] md:text-base font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
          {service.title}
        </h3>

        {/* Time / Meta */}
        <div className="flex items-center gap-1 text-gray-400 mb-3">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] md:text-xs">{service.time}</span>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 line-through decoration-gray-400">
                ₹{service.originalPrice}
             </span>
             <span className="text-sm md:text-lg font-bold text-gray-900">
                ₹{service.price}
             </span>
          </div>

          {/* Add Button - The "Real App" interaction */}
          <button className="relative overflow-hidden group/btn bg-white border border-blue-100 hover:border-blue-600 text-blue-600 rounded-lg px-3 py-1.5 md:px-4 md:py-2 transition-all duration-200 active:scale-95 flex items-center gap-1">
            <span className="text-xs font-bold">ADD</span>
            {/* Subtle background fill on hover */}
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}