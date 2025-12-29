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
} from "lucide-react";

/* ================= LOADER ================= */

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/wLogo.png"
          alt="Logo"
          width={140}
          height={40}
          className="opacity-80"
        />
        <div className="w-48 h-1 bg-blue-50 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-full w-full bg-blue-600"
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
        const found = list.find((s) =>
          normalize(s.title).includes(normalize(decoded))
        );
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
        const res = await fetch(
          `/api/workers?category=${encodeURIComponent(selected.category)}`,
          { cache: "no-store" }
        );
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceName]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
    router.push("/checkout");
  };

  if (loading) return <PageLoader />;

  if (!selected) {
    return (
      <div className="min-h-screen bg-[#edf4ff] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={64} className="text-blue-200 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-tight mb-2">Service not found</h1>
        <button onClick={() => router.push("/")} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#111827] pb-44 font-sans selection:bg-blue-100">
      
      {/* 📍 Floating Back Header */}
      <header className="fixed top-0 inset-x-0 z-[50] px-4 pt-4 pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border border-white active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
      </header>

      {/* 🖼️ Hero Media Container */}
      <div className="relative h-[48vh] w-full overflow-hidden">
        <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }} className="w-full h-full">
          <Image src={selected.image} alt={selected.title} fill className="object-cover" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fbff] via-transparent to-black/5" />
      </div>

      <main className="max-w-3xl mx-auto px-4 -mt-20 relative z-10 space-y-6">
        
        {/* 💳 Primary Detail Card */}
        <section className="bg-white rounded-[3rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-blue-50/50">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge icon={<ShieldCheck size={12} />} text="Professional" />
              <Badge text="Sanitized" green />
            </div>

            <h1 className="text-4xl font-black tracking-tighter leading-[0.85] text-gray-900 uppercase italic">
              {selected.title}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 items-center gap-1">
                <Star size={12} className="fill-yellow-500 text-yellow-500" />
                <span className="text-[11px] font-black text-yellow-700">4.9</span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                • {selected.reviews?.length || "1.2k"} Reviews
              </span>
            </div>

            <div className="h-px bg-gray-50 w-full" />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <StatCard icon={<Clock size={16} />} label="Duration" val="45-60 min" />
              <StatCard icon={<Zap size={16} />} label="Response" val="Instant" />
            </div>
          </div>
        </section>

        {/* 📝 Description */}
        <section className="px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3">Service Details</h3>
           <p className="text-gray-500 leading-relaxed font-medium text-base">
              {selected.description || "Indulge in our premium care experience. Our certified professionals use clinical-grade equipment to ensure 100% satisfaction in the comfort of your home."}
           </p>
        </section>

        {/* 👥 Specialist List */}
        <section className="space-y-4">
          <h2 className="text-lg font-black tracking-tighter uppercase italic px-2">Top Specialists</h2>
          {workersLoading ? (
            <Skeleton />
          ) : (
            <div className="space-y-3">
              {workers.slice(0, 3).map((w, i) => (
                <motion.div key={i} whileTap={{ scale: 0.98 }} className="bg-white border border-blue-50 rounded-[2rem] p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                    {w.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm uppercase tracking-tight">{w.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Verified • {w.experience || 3}+ Yrs</p>
                  </div>
                  <button className="bg-blue-50 text-blue-600 p-2.5 rounded-xl active:scale-90"><UserCheck size={18} /></button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 💎 Recommended Grid */}
        <section className="space-y-4">
           <h2 className="text-lg font-black tracking-tighter uppercase italic px-2">Others like this</h2>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {services.slice(0, 6).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="min-w-[140px] bg-white rounded-[2rem] p-3 border border-blue-50 shadow-sm active:scale-95 transition-all">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-3">
                    <Image src={s.image} alt="Service" fill className="object-cover" />
                  </div>
                  <p className="text-[10px] font-black uppercase truncate mb-1">{s.title}</p>
                  <p className="text-blue-600 font-black text-xs">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* 🚀 Blinkit-style Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-[60] px-4 pb-8 pointer-events-none">
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="max-w-md mx-auto bg-[#030712] rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center pointer-events-auto"
        >
          <div className="flex-1 px-6">
             <p className="text-white text-2xl font-black tracking-tighter italic leading-none">₹{selected.price}</p>
             <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">Total Payable</p>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="h-16 px-10 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
          >
            Reserve <ShoppingCart size={18} strokeWidth={3} />
          </button>
        </motion.div>
      </div>

      {/* 📱 Full-Screen Bottom Sheet */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030712]/60 backdrop-blur-sm" 
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-[3.5rem] p-8 max-w-2xl mx-auto shadow-2xl relative z-10 border-t border-blue-50"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
              <div className="flex gap-6 mb-10 items-center">
                <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border border-blue-50 shadow-inner">
                  <Image src={selected.image} alt="Cart" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">{selected.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival in 45m</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-[2rem] p-6 mb-10 border border-blue-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Amount Due</span>
                <span className="text-3xl font-black tracking-tighter text-[#030712]">₹{selected.price}</span>
              </div>

              <button
                onClick={() => addToCart(selected)}
                className="w-full h-18 py-6 bg-[#030712] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[13px] hover:bg-gray-800 transition-all active:scale-95 shadow-2xl"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

function Badge({ text, icon, green }) {
  return (
    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
      green ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
    }`}>
      {icon} {text}
    </span>
  );
}

function StatCard({ icon, label, val }) {
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-3 flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">{label}</p>
        <p className="text-xs font-black tracking-tight">{val}</p>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 px-2">
      {[1, 2].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-[1.5rem] animate-pulse" />
      ))}
    </div>
  );
}