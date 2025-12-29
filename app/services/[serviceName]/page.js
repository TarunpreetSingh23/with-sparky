"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Clock,
  Star,
  Zap,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  ChevronLeft,
  Heart,
  Search,
  Share,
} from "lucide-react";

/* ================= LOADER ================= */
function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/wLogo.png" alt="Logo" width={140} height={40} className="opacity-80" />
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-full w-full bg-green-600"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(true);

  const normalize = (s) => s?.toLowerCase().replace(/[\s-]+/g, "") || "";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || [];
        setServices(list);
        const decoded = decodeURIComponent(serviceName || "");
        const found = list.find((s) => normalize(s.title).includes(normalize(decoded)));
        setSelected(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [serviceName]);

  useEffect(() => {
    if (!selected?.category) return;
    const fetchWorkers = async () => {
      try {
        setWorkersLoading(true);
        const res = await fetch(`/api/workers?category=${encodeURIComponent(selected.category)}`, { cache: "no-store" });
        const data = await res.json();
        setWorkers(Array.isArray(data) ? data : []);
      } catch {
        setWorkers([]);
      } finally {
        setWorkersLoading(false);
      }
    };
    fetchWorkers();
  }, [selected]);

  useEffect(() => { window.scrollTo(0, 0); }, [serviceName]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
    router.push("/checkout");
  };

  if (loading) return <PageLoader />;
  if (!selected) return <div className="p-10 text-center">Service not found</div>;

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] pb-32 font-sans selection:bg-green-100">
      
      {/* 📍 Header Overlay (Matches Screenshot) */}
      <header className="fixed top-0 inset-x-0 z-[50] flex justify-between items-center px-4 py-4 pointer-events-none">
        <button onClick={() => router.back()} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md">
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        {/* <div className="flex gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md"><Heart size={20} className="text-gray-700" /></button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md"><Search size={20} className="text-gray-700" /></button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md"><Share size={20} className="text-gray-700" /></button>
        </div> */}
      </header>

      {/* 🖼️ Hero Image (Matches Screenshot) */}
      <div className="relative w-full h-96 aspect-square bg-[#f3f4f6] overflow-hidden p-6 flex items-center justify-center">
        <Image src={selected.image} alt={selected.title} fill className="object-cover" priority />
        
        {/* Time Badge Overlay */}
        <div className="absolute bottom-6 left-4 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-gray-100">
           <Clock size={14} className="text-amber-500" />
           <span className="text-[11px] font-black tracking-tight text-gray-700 uppercase">22 Mins</span>
        </div>
      </div>

      <main className="p-5 space-y-6">
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-[#1a1a1a] leading-tight">
            {selected.title}
          </h1>
          <p className="text-orange-600 text-xs font-bold uppercase tracking-wide">
            Only {Math.floor(Math.random() * 5) + 2} left
          </p>
          <p className="text-gray-500 text-sm font-bold mt-1">
            (Standard Selection)
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-black text-[#1a1a1a]">₹{selected.price}</span>
            <span className="text-gray-400 text-sm line-through font-medium">MRP ₹{selected.price + 200}</span>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">24% OFF</span>
          </div>
        </div>

        {/* Action Link */}
        <button className="text-green-700 text-sm font-black flex items-center gap-1">
          View product details <ChevronRight size={16} className="rotate-90" />
        </button>

        <div className="h-px bg-gray-100 w-full" />

        {/* Specialist List (Clone structure) */}
        <section className="space-y-4">
          <h2 className="text-lg font-black tracking-tight">Top products in this category</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {workers.map((w, i) => (
              <div key={i} className="min-w-[160px] bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-green-600 font-black text-2xl mb-3">
                  {w.name?.charAt(0)}
                </div>
                <p className="text-xs font-black text-gray-800 text-center uppercase">{w.name}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{w.experience}+ YRS EXP</p>
                <button className="mt-3 w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                  ADD
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Grid (Cloned from bottom section of screenshot) */}
        <section className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 4).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm active:scale-95 transition-all flex flex-col">
                  <div className="relative aspect-square bg-[#f9f9f9] rounded-xl overflow-hidden mb-3 border border-gray-50">
                    <Image src={s.image} alt="Service" fill className="object-cover" />
                    <button className="absolute bottom-2 right-2 bg-white text-green-600 border border-gray-100 rounded-lg px-3 py-1 text-[10px] font-black shadow-lg">ADD</button>
                  </div>
                  <p className="text-[11px] font-black text-gray-800 line-clamp-2 uppercase leading-tight mb-1">{s.title}</p>
                  <p className="text-xs font-black text-gray-900 mt-auto">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* 🚀 Blinkit-style Sticky Action Bar (Matches Screenshot) */}
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-gray-100 p-4 pb-8 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
           <div className="flex items-center gap-1">
             <span className="text-lg font-black text-gray-900">₹{selected.price}</span>
             <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-sm">24% OFF</span>
           </div>
           <p className="text-[10px] font-bold text-gray-400">Inclusive of all taxes</p>
        </div>
        
        <button
          onClick={() => setShowDrawer(true)}
          className="bg-[#1e8d2b] text-white px-10 h-14 rounded-xl font-black text-sm tracking-tight flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Add to cart
        </button>
      </div>

      {/* 📱 Full-Screen Bottom Sheet (Clean Logic from your code) */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full bg-white rounded-t-[2.5rem] p-8 max-w-2xl mx-auto shadow-2xl relative z-10">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              <div className="flex gap-6 mb-10 items-center">
                <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
                  <Image src={selected.image} alt="Cart" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-gray-900 leading-none uppercase">{selected.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={14} className="text-green-600" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival in 45m</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50/50 rounded-[2rem] p-6 mb-10 border border-green-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-green-600">Amount Due</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{selected.price}</span>
              </div>
              <button onClick={() => addToCart(selected)} className="w-full h-16 py-6 bg-[#1e8d2b] text-white rounded-[1rem] font-black uppercase text-[12px] active:scale-95 shadow-2xl">
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}