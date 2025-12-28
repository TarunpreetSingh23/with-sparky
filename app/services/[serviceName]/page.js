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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#edf4ff]">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/wLogo.png"
          alt="Logo"
          width={160}
          height={48}
          className="rounded-xl"
        />
        <div className="w-56 h-1.5 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
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
      <div className="min-h-screen bg-[#edf4ff] flex flex-col items-center justify-center text-center">
        <ShieldAlert size={48} className="text-gray-400 mb-4" />
        <h1 className="text-xl font-bold mb-2">Service not found</h1>
        <button onClick={() => router.push("/")} className="text-blue-600 font-bold">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf4ff] text-[#111827] pb-40 font-sans selection:bg-blue-100">
      
      {/* Floating Back Button */}
      <header className="fixed top-0 inset-x-0 z-[50] px-5 pt-5 pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40 active:scale-90 transition-all"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>
      </header>

      {/* Hero Visual */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          <Image
            src={selected.image}
            alt={selected.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#edf4ff] via-[#edf4ff]/20 to-transparent" />
      </div>

      <main className="max-w-4xl mx-auto px-5 -mt-24 relative z-10">
        
        {/* Main Glass Card */}
        <section className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-10 border border-white/60">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="flex-1">
              <div className="flex gap-2 mb-4">
                <Badge icon={<ShieldCheck size={12} />} text="Verified Pro" />
                <Badge text="Top Rated" green />
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-[0.9]">
                {selected.title}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-black text-gray-400 ml-2">
                  4.9 • {selected.reviews?.length || "1,240"} REVIEWS
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-5 rounded-[32px] text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)]">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">Estimated Cost</p>
              <p className="text-4xl font-black tracking-tighter">₹{selected.price}</p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard icon={<Clock size={18} />} label="Duration" val="45 mins" />
            <StatCard icon={<ShieldCheck size={18} />} label="Safety" val="Insured" />
            <StatCard icon={<Zap size={18} />} label="Speed" val="Express" />
            <StatCard icon={<Sparkles size={18} />} label="Quality" val="Elite" />
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              {selected.description || "Experience the pinnacle of professional service with our top-tier experts. We ensure 100% satisfaction with clinical-grade equipment and premium products."}
            </p>
          </div>
        </section>

        {/* Professionals - Modern List */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-gray-400">
              Assigned Pros
            </h2>
            <div className="h-[2px] flex-1 bg-blue-100 mx-6 opacity-50" />
          </div>

          {workersLoading ? (
            <Skeleton />
          ) : workers.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-blue-200 rounded-3xl p-10 text-center">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Finding available experts...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {workers.map((w, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-blue-50 rounded-[32px] p-5 flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {w.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <p className="font-black text-lg tracking-tight">{w.name}</p>
                    <div className="flex items-center gap-2">
                      <Star size={10} fill="#EAB308" className="text-yellow-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase">{w.rating?.average || 4.8} • {w.experience || 3}+ YRS EXP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success(`${w.name} preferred`)}
                    className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-90"
                  >
                    <UserCheck size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Similar Services - Cards */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-gray-400">Recommended</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">View All</button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
            {services
              .filter((s) => s.title !== selected.title)
              .slice(0, 6)
              .map((s, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)}
                  className="min-w-[190px] bg-white border border-blue-50 rounded-[32px] p-4 cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4 shadow-inner">
                    <Image src={s.image} alt={s.title} fill className="object-cover" />
                  </div>
                  <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1 truncate">{s.title}</p>
                  <p className="text-xl font-black tracking-tighter">₹{s.price}</p>
                </motion.div>
              ))}
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-11 inset-x-0 z-[40] px-6 pb-8 pointer-events-none">
        <div className="max-w-lg mx-auto bg-gray-900/90 backdrop-blur-2xl rounded-[32px] p-4 flex gap-4 items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto">
          <div className="flex-1 pl-4">
             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Total Value</p>
             <p className="text-2xl font-black text-white tracking-tighter">₹{selected.price}</p>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="h-16 px-8 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-[0.15em] text-[13px] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
          >
            <ShoppingCart size={18} strokeWidth={3} /> Reserve
          </button>
        </div>
      </div>

      {/* Modern Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[60] flex items-end">
            <motion.div
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setShowDrawer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-[50px] p-8 max-w-2xl mx-auto shadow-2xl relative z-10 border-t border-white"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />

              <div className="flex gap-6 mb-10 items-center">
                <div className="relative w-24 h-24 rounded-[28px] overflow-hidden border border-blue-50 shadow-inner">
                  <Image src={selected.image} alt={selected.title} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none mb-2">{selected.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <Clock size={14} className="text-blue-500" /> 45 min arrival
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-[28px] p-6 mb-10 border border-blue-100">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                    <span className="text-3xl font-black tracking-tighter text-blue-600">₹{selected.price}</span>
                 </div>
              </div>

              <button
                onClick={() => addToCart(selected)}
                className="w-full h-18 py-6 bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200"
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

/* ================= HELPERS ================= */

function Badge({ text, icon, green }) {
  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
        green
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-blue-50 text-blue-600 border-blue-100"
      }`}
    >
      {icon} {text}
    </span>
  );
}

function StatCard({ icon, label, val }) {
  return (
    <div className="bg-white border border-blue-50 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-blue-600 mb-3 bg-blue-50 w-fit p-2 rounded-xl">{icon}</div>
      <p className="text-[9px] uppercase font-black text-gray-400 tracking-[0.1em] mb-1">{label}</p>
      <p className="text-sm font-black tracking-tight">{val}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="h-28 bg-white border border-blue-100 rounded-[32px] animate-pulse" />
      ))}
    </div>
  );
}