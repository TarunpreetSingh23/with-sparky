'use client';
import { useEffect, useState } from 'react';

export default function SaleScroller() {
  const sales = [
    '🏷️ Nike 30% OFF',
    '🔊 Boat 40% OFF',
    '💄 Cosmetics 80% OFF',
    '📱 Smartphones from ₹4999',
    '🖥️ Laptops up to 45% OFF',
    '🎧 Headphones Flat 60% OFF',
    '👜 Bags Buy 1 Get 1 Free',
    '👟 Adidas Shoes Min 50% OFF',
    '🎮 Gaming Gear Steal Deals',
    '🛍️ Flat ₹200 OFF on First Order!',
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sales.length);
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#20232a] text-white py-3 overflow-hidden text-center">
      <div
        key={sales[current]}
        className="text-lg font-semibold animate-fade-in duration-500"
      >
        {sales[current]}
      </div>
    </div>
  );
}
