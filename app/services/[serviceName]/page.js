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
  const MIN_CART_VALUE = 300;
const [minCartError, setMinCartError] = useState("");


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
const getCartTotal = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
};

 const addToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    title: item.title,
    price: item.price,
    image: item.image,
    earning:item.earning,
    profit:item.profit,
    quantity: 1,
    category: item.category,
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  const total = getCartTotal();

  if (total < MIN_CART_VALUE) {
    const remaining = MIN_CART_VALUE - total;
    setMinCartError(`Add at least ₹${remaining} service `);
    return;
  }

  setMinCartError("");
  toast.success("Added to cart");
  router.push("/checkout");
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
{minCartError && (
  <div className="fixed bottom-19 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm z-[100]
    bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
    rounded-[2rem] p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500"
  >
    {/* Icon with Ring Progress Glow */}
    <div className="relative shrink-0">
      <div className="absolute inset-0 bg-blue-400 blur-lg opacity-20 rounded-full animate-pulse" />
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 
        flex items-center justify-center text-white shadow-lg shadow-blue-200"
      >
        <span className="text-xl font-black">₹</span>
      </div>
    </div>

    {/* Text Content */}
    <div className="flex-1">
      <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
        Almost there!
      </h4>
      <p className="text-[11px] font-bold text-gray-500 leading-tight">
         <span className="text-blue-600">{minCartError}</span> more to unlock checkout
      </p>
      
      {/* Tiny Progress Bar */}
      <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-1000 ease-out"
          style={{ width: '70%' }} // You can calculate percentage if you have current total
        />
      </div>
    </div>

    {/* Close or Arrow */}
    {/* <button className="p-2 text-gray-400 hover:text-gray-900">
       <ArrowRight size={18} />
    </button> */}
  </div>
)}
        {/* ✨ NEW: SERVICE STEPS SECTION (Urban Company Style) */}
{selected.steps && selected.steps.length > 0 && (
  <section className="bg-[#fcfdff] py-14 px-6 overflow-hidden">
    {/* Section Header */}
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-[1.5px] w-10 bg-blue-600 rounded-full" />
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
          The Workflow
        </span>
      </div>
      <h2 className="text-3xl font-black text-[#101a3c] tracking-tight leading-none">
        Service Protocol
      </h2>
    </div>

    {/* Steps Journey */}
    <div className="space-y-8 border-2-black">
      {selected.steps.map((step, idx) => {
        // Splitting logic: Handle "Step X – Title: Description"
        // This splits at the first "–" and then separates the title from desc at the ":"
        const [stepLabel, rest] = step.split(" – ");
        const [title, desc] = rest ? rest.split(": ") : [rest, ""];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="group relative bg-white p-6 rounded-[2rem] border border-blue-50/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1"
          >
            <div className="flex flex-col gap-4">
              {/* Top Row: Step Tag and Index */}
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-blue-50 rounded-full">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                    {stepLabel}
                  </span>
                </div>
                <span className="text-2xl font-black text-blue-100/50 group-hover:text-blue-100 transition-colors">
                  0{idx + 1}
                </span>
              </div>

              {/* Bottom Row: Content */}
              <div>
                <h3 className="text-[17px] font-black text-[#101a3c] mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-[14px] font-medium text-gray-500 leading-relaxed italic border-l-2 border-blue-100 pl-4">
                  {desc}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Trust Footer */}
    <div className="mt-12 p-8 bg-[#101a3c] rounded-[2.5rem] relative shadow-2xl shadow-blue-900/30 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={80} className="text-white" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
          <Star className="text-blue-400" fill="currentColor" size={20} />
        </div>
        <div>
          <h4 className="text-white text-lg font-black tracking-wide">
            Sparky Guarantee
          </h4>
          <p className="text-blue-200/60 text-xs font-medium leading-relaxed mt-1">
            Standardized {selected.steps.length}-step procedure followed by every certified expert to ensure quality results.
          </p>
        </div>
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