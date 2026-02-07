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
  ChevronLeft,
  Share2,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [minCartError, setMinCartError] = useState("");

  const MIN_CART_VALUE = 300;
  
  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_MAROON = "#a61d33";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_BG = "#fbfcfa";

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

  useEffect(() => { window.scrollTo(0, 0); }, [serviceName]);

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...item, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    const total = getCartTotal();
    if (total < MIN_CART_VALUE) {
      setMinCartError(`Add ₹${MIN_CART_VALUE - total} more to proceed`);
      return;
    }

    setMinCartError("");
    toast.success("Added to  Bag");
    router.push("/checkout");
  };

  if (loading) return <PageLoader />;
  if (!selected) return <div className="p-10 text-center font-black text-[#a61d33]">Service not found</div>;

  return (
    <div className={`min-h-screen bg-[#fbfcfa] text-[#1A2421] pb-32 z-50 font-sans selection:bg-[#f2f4ed]`}>
      
      {/* 📍 Header Overlay */}
      <header className="fixed top-0 inset-x-0 z-[50] flex justify-between items-center px-4 py-4">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all">
          <ChevronLeft size={22} className="text-[#3A4D39]" />
        </button>
        <div className="flex gap-2">
 <button className="p-2 relative w-10 h-10 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all" onClick={() => router.push("/cart")}>
             <ShoppingCart size={22} color={SAGA_GREEN} />
             {/* {cart.length > 0 && <span className="absolute top-0 right-0 bg-[#a61d33] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">{cart.length}</span>} */}
          </button>        </div>
      </header>

      {/* 🖼️ Hero Visual with Arch Style */}
      <div className="relative w-full h-[420px] bg-white overflow-hidden flex items-center justify-center rounded-b-[3.5rem] shadow-xl">
        <Image src={selected.image} alt={selected.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-white/20">
           <Clock size={16} className="text-[#a61d33]" />
           <span className="text-[12px] font-[1000] tracking-tight text-[#3A4D39] uppercase italic">Arriving in 40 mins</span>
        </div>
      </div>

      <main className="space-y-4 px-4 mt-[-40px] relative z-10">
        
        {/* Card 1: Core Title & Pricing */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(58,77,57,0.08)] border border-[#f1f3eb]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-[#a61d33] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">Premium Services</span>
               <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star size={12} fill="#f7b614" className="text-[#f7b614]" />
                  <span className="text-[11px] font-[1000] text-[#3A4D39]">{selected.rating || "4.9"}</span>
               </div>
            </div>
            
            <h1 className="text-[26px] font-[1000] tracking-tight text-[#1A2421] leading-tight italic uppercase">
              {selected.title}
            </h1>
            
            <p className="text-[#4F6F52] text-[15px] font-bold leading-relaxed pt-2 opacity-80">{selected.description}</p>
            
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#f1f3eb]">
              <span className="text-3xl font-[1000] text-[#3A4D39] tracking-tighter">₹{selected.price}</span>
              <span className="text-gray-300 text-md line-through font-bold">₹{selected.price + 200}</span>
              <span className="ml-auto bg-[#3A4D39] text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase italic tracking-widest">Best Value</span>
            </div>
          </div>
        </section>

        {/* Min Cart Toast */}
        {minCartError && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-white border-2 border-[#E0E5D2] shadow-2xl rounded-[2rem] p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#a61d33] flex items-center justify-center text-white font-[1000] text-xl italic shadow-lg">₹</div>
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-[#1A2421] uppercase tracking-widest">Almost there!</h4>
              <p className="text-[12px] font-bold text-[#4F6F52]">{minCartError}</p>
            </div>
            <button onClick={() => setMinCartError("")}><X size={18} className="text-gray-300"/></button>
          </motion.div>
        )}

        {/* ✨ SERVICE STEPS: Saga Style */}
        {selected.steps && selected.steps.length > 0 && (
          <section className="bg-white rounded-[2.5rem] py-12 px-8 border border-[#f1f3eb] shadow-sm">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-[2px] w-8 bg-[#a61d33] rounded-full" />
                <span className="text-[10px] font-black text-[#a61d33] uppercase tracking-[0.3em]">Protocol</span>
              </div>
              <h2 className="text-3xl font-[1000] text-[#1A2421] tracking-tight italic">Service <span className="text-[#4F6F52]">Journey</span></h2>
            </div>

            <div className="space-y-6">
              {selected.steps.map((step, idx) => {
                const [stepLabel, rest] = step.split(" – ");
                const [title, desc] = rest ? rest.split(": ") : [rest, ""];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    className="group relative bg-[#fbfcfa] p-6 rounded-[2rem] border border-[#f1f3eb] hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-[#4F6F52] uppercase tracking-[0.2em]">{stepLabel}</span>
                      <span className="text-3xl font-[1000] text-[#E0E5D2] group-hover:text-[#4F6F52]/20 transition-colors italic">0{idx + 1}</span>
                    </div>
                    <h3 className="text-[17px] font-[1000] text-[#1A2421] mb-2">{title}</h3>
                    <p className="text-[14px] font-bold text-gray-400 leading-relaxed italic border-l-2 border-[#E0E5D2] pl-4">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommended: Saga Checkerboard */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#f1f3eb] shadow-sm">
           <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#4F6F52] mb-6">Popular Add-ons</h2>
           <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 4).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="bg-[#fbfcfa] border border-[#f1f3eb] rounded-[2rem] p-3 shadow-sm active:scale-95 transition-all group">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-3">
                    <Image src={s.image} alt="Service" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <p className="text-[13px] font-[1000] text-[#1A2421] line-clamp-1 uppercase mb-1 tracking-tight">{s.title}</p>
                  <p className="text-sm font-black text-[#a61d33]">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Saga Guarantee Badge */}
        <div className="p-12 text-center bg-[#3A4D39] rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="flex justify-center mb-4">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <ShieldCheck size={32} className="text-[#f7b614]" />
               </div>
            </div>
            <h4 className="text-white text-lg font-[1000] tracking-widest uppercase italic">Saga Certified</h4>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed px-4">
              Premium Hygiene • Single-Use Kits • Background Verified Experts
            </p>
        </div>
      </main>

      {/* 🚀 Saga Sticky Checkout Bar */}
     <div className="fixed bottom-0 inset-x-0 z-[60] 
  bg-white/90 backdrop-blur-xl 
  border-t border-[#e6eadf] 
  px-6 py-5 
  flex items-center justify-between
  shadow-[0_-12px_32px_rgba(58,77,57,0.08)]"
>
  {/* LEFT — Price */}
  <div className="flex  flex-col">
    <div className="flex items-center gap-2">
      <span className="text-[26px] font-extrabold text-[#1A2421] tracking-tight leading-none">
        ₹{selected.price}
      </span>

      <span className="bg-[#eef2e6] text-[#3A4D39] 
        text-[9px] font-bold px-2 py-0.5 
        rounded-full uppercase tracking-wide">
        Net Price
      </span>
    </div>

    <p className="mt-1 text-[10px] font-medium text-[#6b7a63] tracking-wide">
      Excluding visiting charges
    </p>
  </div>

  {/* RIGHT — CTA */}
  <button
    onClick={() => addToCart(selected)}
    className="
      h-14 px-8 
      rounded-[1.25rem] 
      bg-[#3A4D39] 
      hover:bg-[#2f3a1f]
      text-white 
      text-[12px] font-extrabold uppercase tracking-[0.18em]
      shadow-lg shadow-[#3a4d39]/25
      flex items-center gap-3
      active:scale-[0.97] transition-all
    "
  >
    Add to Cart
    <ChevronRight size={18} className="text-[#f7b614]" />
  </button>
</div>

    </div>
  );
}

/* ================= LOADER ================= */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fbfcfa] z-[100]">
      <div className="flex flex-col items-center">
        <Image src="/images/wLogo.png" alt="Logo" width={140} height={50} className="mb-10 object-contain" />
        <div className="relative w-56 h-[3px] bg-[#f2f4ed] rounded-full overflow-hidden">
          <div className="loading-bar-element absolute h-full w-1/3 bg-gradient-to-r from-transparent via-[#3A4D39] to-transparent" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#4F6F52] animate-pulse">Curating Rituals</p>
      </div>
      <style jsx>{`
        .loading-bar-element { animation: loading-slide 2s infinite cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes loading-slide { 0% { left: -100%; } 50% { left: 30%; } 100% { left: 100%; } }
      `}</style>
    </div>
  );
}