"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ShieldCheck, Zap, Wind,Flame,Smile,LayoutGrid,ChevronRight, ChevronLeft, Share2, Search, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// --- Custom "Out of this World" Loader ---
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

export default function CleaningPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const [minCartError, setMinCartError] = useState("");

  const router = useRouter();
  const MIN_CART_VALUE = 300;

const cartTotal = cart.reduce(
  (sum, item) => sum + item.price * (item.quantity || 1),
  0
);


  useEffect(() => {
    if (!loading) window.scrollTo(0, 0);
  }, [loading]);
useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setSelectedCategory(catFromUrl.toUpperCase());
    }
  }, [searchParams]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (newItem) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push({ ...newItem, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    toast.success("Added to ritual", {
      style: { background: "#030712", color: "#fff", borderRadius: "15px", fontSize: "10px", fontWeight: "bold" }
    });
  };

  const removeFromCart = (id) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = existingCart.findIndex(item => item._id === id);
    if (idx > -1) existingCart.splice(idx, 1);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
  };

  const filteredServices = selectedCategory === "ALL" 
    ? services 
    : services.filter((s) => s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-[#030712] font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* 🔮 Mesh Gradients */}
      {/* 📍 Ultra-Modern Professional Glass Header */}
{/* <div className="sticky top-0 z-40 items-center justify-center"> */}
  {/* The Glass Base */}
  {/* <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]" /> */}

  <div className="relative">
    {/* Upper Row: Navigation & Title */}
    {/* <div className="flex items-center justify-between px-6 py-4"> */}
      {/* <button 
        onClick={() => router.back()} 
        className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full border border-slate-100 shadow-sm active:scale-90 transition-transform"
      >
        <ChevronLeft size={20} className="text-slate-800" />
      </button> */}

      {/* <div className="flex flex-col items-center justify-center">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-0.5 ml-1">
          {selectedCategory === "ALL" ? "Premium Selection" : "Category"}
        </span>
        <h1 className="text-16px font-black tracking-tight text-[#101a3c] uppercase italic leading-none">
          {selectedCategory === "ALL" ? "Bestsellers" : selectedCategory}
        </h1>
      </div> */}

      {/* <button className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full border border-slate-100 shadow-sm active:scale-90 transition-transform">
        <Share2 size={18} className="text-slate-800" />
      </button> */}
    {/* </div> */}

    {/* Lower Row: Scrollable Filter Chips */}
   <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-sm border border-slate-50">
  <h2 className="text-xl font-black text-[#101a3c] mb-6 uppercase italic tracking-tight px-2">
    Choose a Service
  </h2>

  {/* Horizontal Scroll Container */}
  <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 px-2 scroll-smooth items-start">
    {["ALL", "FACIAL", "CLEANSING", "WAXING", "MAKEUP"].map((cat) => {
      const isActive = selectedCategory === cat;
      
      // Mapping text categories to Lucide Icons
      const IconComponent = {
        ALL: LayoutGrid,
        FACIAL: Sparkles,
        CLEANSING: Wind,
        WAXING: Flame,
        MAKEUP: Smile,
      }[cat] || Sparkles;

      return (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className="flex flex-col items-center flex-shrink-0 group outline-none transition-transform active:scale-95"
        >
          {/* Icon Circle */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive
                ? "bg-[#101a3c] text-white scale-105 shadow-[0_10px_20px_rgba(16,26,60,0.2)]"
                : "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100"
            }`}
          >
            <IconComponent size={26} strokeWidth={isActive ? 2 : 1.5} />
          </div>

          {/* Label */}
          <span
            className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
              isActive ? "text-[#101a3c]" : "text-slate-400"
            }`}
          >
            {cat}
          </span>
          
          {/* Active Indicator Dot */}
          {isActive && (
            <div className="w-1.5 h-1.5 bg-[#101a3c] rounded-full mt-1" />
          )}
        </button>
      );
    })}
  </div>
</div>
  </div>
{/* </div> */}

      {/* 🔹 Bento Grid Service List */}
      {/* 🔹 List View Service List (Matches image_e1b5c4.jpg) */}
<main className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-6 pb-44 relative z-10">
  {filteredServices.map((service) => (
    <div 
      key={service._id} 
      className="flex gap-4 items-center bg-transparent group cursor-pointer"
      onClick={() => { router.push(`services/${service.title}`) }} 
    >
      {/* 1. Image Container - Matches rounded corners from screenshot */}
      <div className="relative w-32 h-32 flex-shrink-0 rounded-[2rem] overflow-hidden shadow-sm">
        <Image 
          src={service.image} 
          alt={service.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col flex-1">
        <h3 className="text-[18px] font-bold text-[#1a1a1b] leading-tight mb-1">
          {service.title}
        </h3>
        
        {/* Meta Info (Matches the grey text in screenshot) */}
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
          <span className="text-[11px] text-grey-600 font-medium">{service.description}</span>
          {/* <span className="text-[11px] text-slate-400 font-medium">Package</span>
          <span className="text-[11px] text-slate-400 font-medium">Offer till Sep 18, 2021</span> */}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Price Styling */}
          <span className="text-[15px] font-bold text-blue-600">
            ₹{service.price}
          </span>

          {/* Book Now Button - Indigo color matching image_e1b5c4.jpg */}
          <button 
            onClick={() => { router.push(`services/${service.title}`) }} 
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-[12px] shadow-sm hover:bg-[#4f46e5] active:scale-95 transition-all"
          >
            view more
          </button>
        </div>
      </div>
    </div>
  ))}
</main>

      {/* 🚀 Floating Checkout Pill */}
      <div className={`fixed bottom-19 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-50 transition-all duration-300 transform ${cart.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div 
          onClick={() => setCartOpen(true)}
          className="bg-[#030712] text-white p-2 pr-4 rounded-[1.8rem] shadow-xl flex items-center justify-between border border-white/10 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center relative shadow-lg">
              <ShoppingCart size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-tighter italic leading-none">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
              <span className="text-[7px] font-bold uppercase opacity-50 tracking-widest mt-0.5">Cart</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 py-2 px-3 rounded-xl">
            <span className="text-[9px] font-black uppercase tracking-widest">View</span>
            <ChevronRight size={14} className="text-blue-400" />
          </div>
        </div>
      </div>
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

      {/* 📱 Detail Modal */}
      <div className={`fixed inset-0 z-[60] flex items-end justify-center transition-opacity duration-300 ${selectedService ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
        <div className={`relative w-full max-w-xl bg-white rounded-t-[3rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col border-t border-white transition-transform duration-500 ease-out transform ${selectedService ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-4 mb-2" />
          <div className="overflow-y-auto p-6 pt-2 space-y-6 pb-32">
            <div className="relative h-[280px] rounded-[2.5rem] overflow-hidden border-2 border-slate-50">
              {selectedService && <Image src={selectedService.image} alt={selectedService.title} fill className="object-cover" />}
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-white backdrop-blur-md p-2 rounded-full text-black border border-white/30"><X size={18}/></button>
            </div>
            
            <div className="px-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase italic">Elite</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase">Verified</span>
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-3 uppercase italic leading-[0.85] text-slate-900">{selectedService?.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-xs">{selectedService?.description || "Signature experience designed for perfection."}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 px-1">
              <div className="p-4 bg-slate-50 rounded-3xl flex items-center gap-3">
                <Zap className="text-blue-600" size={18}/>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#030712]">Instant Fix</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" size={18}/>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#030712]">Verified Safe</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-50 bg-white/90 backdrop-blur-md flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
              <p className="text-2xl font-black text-[#030712] tracking-tighter italic leading-none">₹{selectedService?.price}</p>
            </div>
            <button 
             onClick={() => { router.push(`services/${selectedService.title}`) }}
              className="bg-[#030712] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
            >
              view Info
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[70] transition-transform duration-500 border-l border-slate-100 transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Ritual Bag</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review items</p>
            </div>
            <button onClick={() => setCartOpen(false)} className="p-2 text-slate-400 bg-slate-50 rounded-full"><X size={18} /></button>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden"><Image src={item.image} fill className="object-cover" alt="img"/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase leading-tight text-[#030712]">{item.title}</p>
                    <p className="text-blue-600 font-black text-[10px] mt-0.5">₹{item.price}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-300"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-end px-1">
              <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest">Total</span>
              <span className="text-3xl font-black tracking-tighter italic text-[#030712]">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
            </div>
           <button
  onClick={() => {
    if (cartTotal < MIN_CART_VALUE) {
      setMinCartError(`Add ₹${MIN_CART_VALUE - cartTotal} more to continue booking`);
      return;
    }
    router.push("/checkout");
  }}
  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
    ${cartTotal < MIN_CART_VALUE
      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
      : "bg-[#030712] text-white active:scale-95"
    }`}
>
  Confirm & Book
</button>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes loading-slide {
          from { left: -100%; }
          to { left: 100%; }
        }
        .animate-loading-slide {
          animation: loading-slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}