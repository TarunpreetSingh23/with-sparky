"use client"; // This MUST be the very first line

import React, { useState } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Palette, 
  Wind, 
  Waves, 
  Zap, 
  Smile, 
  MessageCircle 
} from 'lucide-react';

const services = [
  { id: 1, name: 'Haircut', icon: Scissors },
  { id: 2, name: 'Nails', icon: Zap },
  { id: 3, name: 'Facial', icon: Sparkles },
  { id: 4, name: 'Coloring', icon: Palette },
  { id: 5, name: 'Spa', icon: Waves },
  { id: 6, name: 'Waxing', icon: Wind },
  { id: 7, name: 'Makeup', icon: Smile },
  { id: 8, name: 'Message', icon: MessageCircle },
];

export default function ServicePicker() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-md mx-auto p-6 bg-white min-h-screen">
      <h2 className="text-xl font-bold text-slate-800 mb-8">
        What do you want to do?
      </h2>

      <div className="grid grid-cols-4 gap-y-8 gap-x-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isActive = selected === service.id;

          return (
            <button
              key={service.id}
              onClick={() => setSelected(service.id)}
              className="flex flex-col items-center group outline-none"
            >
              {/* Icon Circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "bg-[#101a3c] text-white scale-110 shadow-lg" 
                  : "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100"
              }`}>
                <IconComponent size={32} strokeWidth={1.5} />
              </div>
              
              {/* Label */}
              <span className={`mt-2 text-[11px] font-bold tracking-tight transition-colors ${
                isActive ? "text-[#101a3c]" : "text-cyan-800"
              }`}>
                {service.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}