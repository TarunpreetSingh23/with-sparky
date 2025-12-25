"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Clock,
  Star,
  Zap,
  X,
  ChevronRight,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

// --- Components ---

function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#030712] z-[100]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col items-center">
        <Image src="/LOGO.jpg" alt="Logo" width={180} height={60} className="mb-10 rounded-2xl shadow-2xl" />
        <div className="w-56 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

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

 const getWorkerPrefix = (category = "") => {
  const c = category.toLowerCase().trim();

  if (c.includes("woman") || c.includes("makeup")) return "MU";
  if (c.includes("event")) return "ED";
  if (c.includes("clean")) return "CL";

  return null;
};

  console.log(getWorkerPrefix);
  // Fetch Services
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

  // Fetch Workers
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
    } catch (err) {
      console.error(err);
      setWorkers([]);
    } finally {
      setWorkersLoading(false);
    }
  };

  fetchWorkers();
}, [selected]);


  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceName]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success("Added to your schedule", {
      style: { background: "#111827", color: "#fff", borderRadius: "16px" },
    });
    router.push("/checkout");
  };

  if (loading) return <PageLoader />;
  if (!selected) return (
    <div className="h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert size={48} className="text-gray-600 mb-4" />
      <h1 className="text-xl font-bold">Service Not Found</h1>
      <button onClick={() => router.push('/')} className="mt-4 text-blue-500 font-bold underline">Return Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 pb-40 font-sans selection:bg-blue-500/30">
      
      {/* --- Sticky Header --- */}
      <nav className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/")} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 truncate px-4">
            Service Details
          </p>
          <div className="w-10" />
        </div>
      </nav>

      {/* --- Hero Image --- */}
      <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <Image
          src={selected.image || "/images/default.jpg"}
          alt={selected.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
      </div>

      <main className="max-w-5xl mx-auto px-5 -mt-24 relative z-10">
        
        {/* --- Main Details Card --- */}
        <section className="bg-[#111827]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Pro Verified
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  Top Rated
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                {selected.title}
              </h1>
              <div className="flex items-center gap-2 text-yellow-500">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-gray-400 ml-2">
                  (4.9 • {selected.reviews?.length || "1.2k"} Reviews)
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-4 rounded-3xl shadow-xl shadow-blue-900/20">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">Price</p>
              <p className="text-3xl font-black text-white">₹{selected.price}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Clock size={18} />, label: "Timing", val: "45 mins" },
              { icon: <ShieldCheck size={18} />, label: "Security", val: "Insured" },
              { icon: <Zap size={18} />, label: "Speed", val: "Express" },
              { icon: <Sparkles size={18} />, label: "Rank", val: "Elite" },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                <div className="text-blue-500 mb-2">{f.icon}</div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">{f.label}</p>
                <p className="text-xs font-bold text-gray-100">{f.val}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Description</h3>
            <p className="text-gray-400 leading-relaxed text-base md:text-lg font-medium">
              {selected.description}
            </p>
          </div>
        </section>

        {/* --- Professionals Section --- */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-widest">Available Pros</h2>
          </div>

          {workersLoading ? (
            <div className="flex gap-4 overflow-hidden">
               {[1, 2].map(i => <div key={i} className="h-24 w-full bg-white/5 animate-pulse rounded-3xl" />)}
            </div>
          ) : workers.length === 0 ? (
            <div className="bg-white/5 rounded-3xl p-10 text-center border border-dashed border-white/10">
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No specific pros found for this region</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workers.map((w, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white/[0.03] border border-white/10 rounded-[32px] p-5 flex items-center gap-5 hover:bg-white/[0.06] hover:border-blue-500/40 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-xl font-black shadow-lg">
                    {w.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-lg group-hover:text-blue-400 transition-colors">{w.name}</h3>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1 font-bold">
                     <span className="flex items-center gap-1 text-yellow-500">
  <Star size={12} fill="currentColor" />
  {w.rating?.average?.toFixed(1) ?? "4.8"}
  <span className="text-gray-400 text-[10px] ml-1">
    ({w.rating?.count ?? 0})
  </span>
</span>

                      <span>{w.experience || 2}+ Yrs Exp</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success(`${w.name} preferred for your booking!`)}
                    className="p-3 bg-white/5 hover:bg-blue-600 hover:text-white rounded-2xl transition-all active:scale-95"
                  >
                    <UserCheck size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* --- Recommendations --- */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black uppercase tracking-widest">Similar Services</h2>
            <button className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">View All <ChevronRight size={14}/></button>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6">
            {services.filter(s => s.title !== selected.title).slice(0, 6).map((s, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)}
                className="min-w-[180px] bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 cursor-pointer hover:bg-white/[0.05] transition-all"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <h4 className="text-[11px] font-black uppercase line-clamp-1 mb-1 tracking-tight">{s.title}</h4>
                <p className="text-blue-400 font-black text-sm">₹{s.price}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* --- Global Action Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/80 backdrop-blur-3xl border-t border-white/10 p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Price Estimate</p>
            <p className="text-3xl font-black">₹{selected.price}</p>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
          >
            <ShoppingCart size={18} /> Instant Reserve
          </button>
        </div>
      </div>

      {/* --- Checkout Bottom Sheet --- */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[60] flex items-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
              onClick={() => setShowDrawer(false)} 
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full bg-[#0f172a] rounded-t-[50px] p-8 md:p-12 border-t border-white/10 shadow-3xl max-w-4xl mx-auto"
            >
              <div className="w-16 h-1.5 bg-gray-800 rounded-full mx-auto mb-10" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 text-center md:text-left">
                <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl">
                  <Image src={selected.image} alt={selected.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Confirm Order</span>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">{selected.title}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-500">
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                       <Clock size={14}/> 45 Mins Arrival
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 mb-10 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Service Subtotal</span>
                  <span className="text-xl font-black">₹{selected.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Platform Fee</span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Free</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(selected)}
                className="w-full py-6 bg-white text-black hover:bg-gray-100 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[14px] transition-all active:scale-95"
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