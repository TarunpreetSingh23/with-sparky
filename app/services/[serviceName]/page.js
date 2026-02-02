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
  Share2,
  Search,
  CheckCircle2,
} from "lucide-react";

/* ================= LOADER ================= */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Image 
          src="/images/wLogo.png" 
          alt="Logo" 
          width={120} 
          height={40} 
          className="mb-8 object-contain" 
        />
        
        {/* Progress Bar Container */}
        <div className="relative w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          {/* Moving Indicator */}
          <div className="loading-bar-element absolute h-full w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
        </div>
        
        {/* Text */}
        {/* <span className="mt-4 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">
          Refining Experience
        </span> */}
      </div>

      {/* Scoped CSS for the animation */}
      <style jsx>{`
        .loading-bar-element {
          animation: loading-slide 1.5s infinite ease-in-out;
        }

        @keyframes loading-slide {
          0% {
            left: -100%;
          }
          50% {
            left: 25%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
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
    // router.push("/checkout");
  };

  if (loading) return <PageLoader />;
  if (!selected) return <div className="p-10 text-center font-bold">Service not found</div>;

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] pb-32 font-sans selection:bg-green-100">
      
      {/* 📍 Header Overlay */}
      {/* <header className="fixed top-0 inset-x-0 z-[50] flex justify-between items-center px-4 py-4 pointer-events-none">
        <button onClick={() => router.back()} className="pointer-events-auto w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-100"><Share2 size={18} className="text-gray-800" /></button>
          <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-100"><Search size={18} className="text-gray-800" /></button>
        </div>
      </header> */}

      {/* 🖼️ Hero Visual */}
      <div className="relative w-full h-[400px] bg-white overflow-hidden flex items-center justify-center">
        <Image src={selected.image} alt={selected.title} fill className="object-cover" priority />
        <div className="absolute bottom-6 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 border border-gray-100">
           <Clock size={14} className="text-blue-600" />
           <span className="text-[11px] font-black tracking-tight text-gray-800 uppercase">Arriving in 40 mins</span>
        </div>
      </div>

      <main className="space-y-3 mt-[-20px] relative z-10">
        
        {/* Card 1: Core Title & Pricing */}
        <section className="bg-white rounded-t-[28px] p-5 shadow-sm border-b border-gray-100">
          <div className="space-y-1">
            <h1 className="text-[22px] font-black tracking-tight text-[#1a1a1a] leading-tight uppercase italic">
              {selected.title}
            </h1>
            <div className="flex items-center gap-2 py-1">
               <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Verified Service</p>
               <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  <Star size={10} className="fill-grey-600 text-grey-700" />
                  <span className="text-[10px] font-black text-grey-700">{selected.rating || "4.9"}</span>
               </div>
            </div>
            <p className="text-gray-500 text-sm font-medium pt-2 leading-relaxed">{selected.description}</p>
            
            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-50">
              <span className="text-2xl font-black text-[#1a1a1a]">₹{selected.price}</span>
              <span className="text-gray-400 text-sm line-through font-medium">MRP ₹{selected.price + 200}</span>
              {/* <span className="bg-grey-700 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase shadow-sm">24% OFF</span> */}
            </div>
          </div>
        </section>

        {/* ✨ NEW: SERVICE STEPS SECTION (Urban Company Style) */}
  {selected.steps && selected.steps.length > 0 && (
  <section className="bg-[#f8faff] py-10 px-5">
    {/* Section Header */}
    <div className="mb-8 text-center">
      <h2 className="text-[20px] font-black tracking-tight text-[#101a3c]">
        How it works
      </h2>
      <div className="flex items-center justify-center gap-1.5 mt-1">
        <Sparkles size={14} className="text-blue-500" />
        <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.1em]">
          The Sparky Protocol
        </span>
      </div>
    </div>

    {/* Steps Grid/List */}
    <div className="space-y-4">
      {selected.steps.map((step, idx) => {
        const [title, desc] = step.split(" — ");
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-blue-50/50 flex gap-4"
          >
            {/* Left Side: Numbering */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                <span className="text-sm font-black text-white">{idx + 1}</span>
              </div>
              {idx !== selected.steps.length - 1 && (
                <div className="w-[2px] h-full bg-blue-50 mt-4 rounded-full" />
              )}
            </div>

            {/* Right Side: Content */}
            <div className="pb-2">
              <h3 className="text-[15px] font-black text-[#101a3c] leading-none mb-2">
                {title}
              </h3>
              <p className="text-[13px] font-medium text-gray-500 leading-[1.6] tracking-tight">
                {desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Premium Trust Footer */}
    <div className="mt-8 bg-[#101a3c] rounded-[2rem] p-5 flex items-center gap-4 shadow-xl shadow-blue-900/20">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-white uppercase tracking-wider">
          Standardized Quality
        </p>
        <p className="text-[11px] font-medium text-blue-200/80 leading-tight mt-0.5">
          Every professional is trained to follow this specific {selected.steps.length}-step protocol.
        </p>
      </div>
    </div>
  </section>
)}

        {/* Card 2: Professional List */}
        {/* <section className="bg-white p-5 shadow-sm border-y border-gray-100">
          <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">Available Specialists</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {workers.map((w, i) => (
              <div key={i} className="min-w-[140px] bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xl mb-3 border border-blue-100">
                  {w.name?.charAt(0)}
                </div>
                <p className="text-[11px] font-black text-gray-800 uppercase line-clamp-1">{w.name}</p>
                <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">{w.experience}+ YRS EXP</p>
                <button className="mt-4 w-full py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100 active:scale-95 transition-all">
                  CHOOSE
                </button>
              </div>
            ))}
          </div>
        </section> */}

        {/* Card 3: Recommended Items */}
        <section className="bg-white p-5  shadow-sm border-t border-gray-100">
           <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-gray-400 mb-5">Customers also booked</h2>
           <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 6).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="bg-white border border-gray-200 h-[250px] rounded-2xl p-3 shadow-sm active:scale-[0.98] transition-all flex flex-col group">
                  <div className="relative aspect-square bg-[#F9FAFB] rounded-xl overflow-hidden mb-3 border border-gray-50">
                    <Image src={s.image} alt="Service" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button className="absolute bottom-2 right-2 bg-white text-grey-900 border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-black shadow-lg hover:bg-green-50 transition-colors uppercase">ADD</button>
                  </div>
                  <p className="text-[14px] font-bold text-gray-700 line-clamp-1 uppercase tracking-tight mb-1">{s.title}</p>
                  <p className="text-sm font-black text-blue-600 mt-auto tracking-tighter">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Trust Badge */}
        <div className="p-10 text-center pb-24 bg-white border-t border-gray-100">
           <div className="flex justify-center items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-gray-800" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Safe & Sanitized Experience</p>
           </div>
           <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter px-10 leading-relaxed">
             Our service professionals follow a strict 5-step safety check before entering your home.
           </p>
        </div>
      </main>

      {/* 🚀 Blinkit Style Checkout Bar */}
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-gray-100 p-4 pb-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 leading-none">
             <span className="text-[22px] font-black text-gray-900 tracking-tighter leading-none italic">₹{selected.price}</span>
             <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm">Net Value</span>
           </div>
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Pay after service completion</p>
        </div>
        
        <button
          onClick={() => addToCart(selected)}
          className="bg-[#030712] hover:bg-gray-900 text-white px-12 h-14 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Add to cart
        </button>
      </div>

      {/* 📱 Full-Screen Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="w-full bg-white rounded-t-[32px] p-8 max-w-2xl mx-auto shadow-2xl relative z-10">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              <div className="flex gap-6 mb-10 items-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                  <Image src={selected.image} alt="Cart" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-gray-900 leading-none uppercase italic">{selected.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-[#030712] animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirmed Booking Slot</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Total Payable</span>
                    <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none">₹{selected.price}</span>
                </div>
                <Zap size={24} className="text-blue-500 fill-blue-500" />
              </div>

              <button onClick={() => addToCart(selected)} className="w-full h-18 py-6 bg-[#0C831F] text-white rounded-2xl font-black uppercase text-[13px] tracking-[0.2em] active:scale-95 shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3">
                 Finalize Selection <ChevronRight size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}