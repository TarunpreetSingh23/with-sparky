"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";

const FloatingOrderTracker = ({ activeOrder }) => {
  const router = useRouter();

  if (!activeOrder) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={() => router.push(`/track/${activeOrder.orderId}`)}
        className="fixed bottom-19 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 cursor-pointer"
      >
        <div className="bg-gray-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-lg">
          
          <div className="flex items-center gap-4">
            {/* Animated Pulsing Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75" />
              <div className="relative bg-blue-600 p-2 rounded-full">
                <Package size={20} className="text-white" />
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Ongoing Order
              </p>
              <h4 className="text-sm font-semibold capitalize">
                {activeOrder.status === 'pending' ? 'Preparing your service...' : 'Provider is on the way'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 py-2 px-4 rounded-2xl">
            <span className="text-xs font-bold">Track</span>
            <ChevronRight size={16} className="text-emerald-400" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingOrderTracker;
