"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  // 🔒 If onboarding already completed, never show again
  useEffect(() => {
    const seen = localStorage.getItem("onboardingSeen");
    if (seen === "true") {
      router.replace("/");
    }
  }, [router]);

  const slides = [
    {
      image: "/images/wc.jpg",
      title: "Professional Home Services",
      description:
        "We provide top-tier home cleaning and maintenance at a very friendly price.",
      color: "bg-blue-100",
    },
    {
      image: "/images/wd.jpg",
      title: "Easy Booking & Scheduling",
      description:
        "Schedule your services in seconds with our easy-to-use calendar interface.",
      color: "bg-purple-100",
    },
    {
      image: "/images/mpm.jpg",
      title: "Beauty & Grooming",
      description:
        "Get beauty parlor services and personal grooming needs delivered to your doorstep.",
      color: "bg-pink-100",
    },
  ];

  // ✅ Finish onboarding (used by Skip + last button)
  const finishOnboarding = () => {
    localStorage.setItem("onboardingSeen", "true");
    router.replace("/");
  };

  // ✅ Next slide logic (FIXED)
  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    // 📱 MOBILE ONLY
    <div className="md:hidden relative min-h-screen bg-white overflow-hidden flex flex-col">
      
      {/* Background Shape */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[120%] h-[50%] rounded-b-[3rem]
        transition-colors duration-500 ${slides[index].color} -z-10`}
      />

      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-12">
        <span className="text-sm font-semibold text-gray-500">
          {index + 1}/{slides.length}
        </span>
        <button
          onClick={finishOnboarding}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            {/* Image */}
            <div className="relative w-[280px] h-[280px] mb-10 rounded-3xl overflow-hidden shadow-xl bg-white">
              <img
                src={slides[index].image}
                alt={slides[index].title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {slides[index].title}
            </h2>
            <p className="text-gray-500 px-4">
              {slides[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 pb-10">
        <div className="flex items-center justify-between">
          
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === index ? 32 : 8,
                  backgroundColor: i === index ? "#4F46E5" : "#E5E7EB",
                }}
                className="h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Next / Finish Button */}
          <button
            onClick={nextSlide}
            className="w-16 h-16 bg-indigo-600 text-white rounded-full
            flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            {index === slides.length - 1 ? (
              <Check className="w-8 h-8" strokeWidth={3} />
            ) : (
              <ChevronRight className="w-8 h-8 ml-1" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
