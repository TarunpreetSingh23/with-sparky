"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ChevronRight, ChevronLeft, LayoutGrid, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function CleaningPage() {
 const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.toUpperCase() || "ALL";
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  // const searchParams = useSearchParams();
  const router = useRouter();

  const MIN_CART_VALUE = 300;
  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_SOFT = "#f2f4ed";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_MAROON = "#a61d33";

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase();
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("ALL");
    }
  }, [searchParams]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    currentCart.push({ ...item, quantity: 1, _id: item._id || Date.now() });
    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCart(currentCart);
    
    if (getCartTotal() < MIN_CART_VALUE) {
      setMinCartError(`Add ₹${MIN_CART_VALUE - getCartTotal()} more`);
    } else {
      setMinCartError("");
      toast.success("Added to ritual bag");
    }
  };

  const getCartTotal = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    return items.reduce((sum, i) => sum + i.price, 0);
  };

  const filteredServices = selectedCategory === "ALL" 
    ? services 
    : services.filter((s) => s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) return <CleaningSkeleton />;


  return (
    <div className="bg-[#fbfcfa] min-h-screen text-[#1A2421] font-sans pb-32">
      
      {/* 1. PREMIUM STICKY HEADER */}
     <div
  className="
    sticky top-0 z-40
    bg-gradient-to-br from-white via-[#fbfcfa] to-[#f2f4ed]
    shadow-[0_8px_30px_rgba(58,77,57,0.12)]
    backdrop-blur-xl
  "
>
  {/* TOP BAR */}
  <div className="flex items-center justify-between px-6 py-4">
    <button
      onClick={() => router.back()}
      className="
        p-2 rounded-full
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        active:scale-95
        transition
      "
    >
      <ChevronLeft size={22} color={SAGA_GREEN} />
    </button>

    <h1
      className="
        text-[17px]
        font-[1000]
        italic
        tracking-tight
        text-[#1A2421]
      "
    >
      {selectedCategory === "ALL" ? "All Services" : selectedCategory}
    </h1>

    <button
      onClick={() => setCartOpen(true)}
      className="
        p-2 relative rounded-full
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        active:scale-95
        transition
      "
    >
      <ShoppingCart size={20} color={SAGA_GREEN} />

      {cart.length > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            bg-gradient-to-br from-[#a61d33] to-[#7a1224]
            text-white
            text-[8px]
            w-4 h-4
            rounded-full
            flex items-center justify-center
            font-black
            border-2 border-white
            shadow-sm
          "
        >
          {cart.length}
        </span>
      )}
    </button>
  </div>

  {/* CATEGORY PILLS */}
  <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-4 scroll-smooth">
    {["ALL", "FACIAL", "CLEANUP", "WAXING", "MAKEUP", "MANICURE"].map((cat) => (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`
          px-5 py-2
          rounded-xl
          text-[9px]
          font-black
          uppercase
          tracking-[0.22em]
          transition-all
          ${
            selectedCategory === cat
              ? `
                bg-gradient-to-br from-[#3A4D39] to-[#2f3a1f]
                text-white
                shadow-[0_6px_18px_rgba(58,77,57,0.4)]
              `
              : `
                bg-white
                text-[#4F6F52]
                border border-[#e5ead7]
                shadow-[0_2px_6px_rgba(0,0,0,0.08)]
                active:scale-95
              `
          }
        `}
      >
        {cat}
      </button>
    ))}
  </div>
</div>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Trust Badge */}
        {/* <div className="bg-[#f2f4ed] rounded-[2rem] p-5 border border-[#E0E5D2] flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck size={24} color={SAGA_GREEN} />
            </div>
            <div>
                <p className="text-[10px] font-black text-[#3A4D39] uppercase tracking-widest">Saga Safety Standards</p>
                <p className="text-xs text-[#4F6F52] opacity-80 font-bold">100% Hygienic & Certified Rituals</p>
            </div>
        </div> */}

        {/* 3. SERVICE CARDS (Yes Madam Horizontal Style) */}
        {filteredServices.map((service) => (
          <div 
            key={service._id} 
            className="flex gap-4 p-4 bg-white rounded-[2rem] border border-[#f1f3eb] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 {/* <span className="text-[8px] font-black text-[#a61d33] bg-[#fff1f2] px-2 py-0.5 rounded-full uppercase tracking-tighter">Bestseller</span> */}
                 <div className="flex items-center gap-1 text-[10px] font-bold text-[#f7b614]"><Star size={10} fill="currentColor"/> 4.8</div>
              </div>
              <h3 className="text-[15px] font-[1000] text-[#1A2421] mb-1 leading-snug tracking-tight">{service.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-black text-[#3A4D39]">₹{service.price}</span>
                <span className="text-[10px] text-[#4F6F52] font-black flex items-center gap-1 opacity-60"><Clock size={12}/> 45 Mins</span>
              </div>
              
              <p className="text-[11px] text-gray-700 font-bold leading-relaxed mb-4 line-clamp-2">{service.description}</p>
              
              <button 
                onClick={() => router.push(`services/${service.title}`)} 
                className="text-[10px] font-black text-[#a61d33] uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                View Details <ChevronRight size={12} />
              </button>
            </div>

            <div className="relative flex flex-col items-center shrink-0">
              <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden border border-[#f1f3eb] shadow-inner bg-[#f2f4ed]">
                <Image src={service.image} alt={service.title} fill className="object-cover" />
              </div>
              <button 
                onClick={() => addToCart(service)}
                className="absolute -bottom-2 w-24 bg-white border-2 border-[#E0E5D2] text-[#3A4D39] py-2 rounded-xl font-black text-[11px] shadow-xl hover:bg-[#3A4D39] hover:text-white hover:border-[#3A4D39] uppercase tracking-widest transition-all active:scale-90"
              >
                ADD
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* 4. PREMIUM FLOATING CART BAR */}
  {cart.length > 0 && (
  <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 bg-white/85 backdrop-blur-xl border-t border-black/5">
    <div className="max-w-md mx-auto">
      
      {/* MAIN CART CTA */}
      <div
        onClick={() => setCartOpen(true)}
        className="flex items-center justify-between gap-3 bg-[#3A4D39] text-white px-4 py-3 rounded-2xl
        shadow-[0_12px_28px_rgba(58,77,57,0.25)]
        active:scale-[0.97] transition"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ShoppingCart size={18} className="text-[#f7b614]" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-tight">
              ₹{cartTotal}
            </span>
            <span className="text-[10px] text-white/70">
              {cart.length} service{cart.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 bg-[#f7b614] text-[#3A4D39] px-3 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wide">
          Review
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  </div>
)}

      {/* 5. SAGA DRAWER (Bottom Sheet) */}
     <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${cartOpen ? 'bg-black/60 opacity-100 visible' : 'bg-black/0 opacity-0 invisible'}`} onClick={() => setCartOpen(false)}>
  <div 
    onClick={(e) => e.stopPropagation()}
    className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 transition-transform duration-700 ease-out transform ${cartOpen ? 'translate-y-0' : 'translate-y-full shadow-[0_-20px_50px_rgba(0,0,0,0.2)]'}`}
  >
    <div className="w-16 h-1.5 bg-[#f2f4ed] rounded-full mx-auto mb-8" />
    
    <div className="flex justify-between items-center mb-8">
      <div className="flex flex-col">
        <h2 className="text-2xl font-[1000] text-[#1A2421] italic leading-none">My <span className="text-[#a61d33]">Bag</span></h2>
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4F6F52] opacity-50 mt-1">{cart.length} Services Added</span>
      </div>

      <div className="flex items-center gap-3">
        {/* NEW: CLEAR ALL BUTTON */}
        {/* <button 
          onClick={() => {
            if(confirm("Empty your ritual bag?")) {
              setCart([]);
              localStorage.removeItem("cart");
              toast.success("Bag cleared");
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-50 text-[#a61d33] text-[10px] font-[1000] uppercase tracking-widest border border-rose-100 active:scale-95 transition-all"
        >
          Clear
        </button> */}
        
        <button onClick={() => setCartOpen(false)} className="p-3 bg-[#f2f4ed] rounded-full text-[#3A4D39] active:scale-90 transition-all">
          <X size={20}/>
        </button>
      </div>
    </div>

    {/* ITEM LIST */}
    <div className="max-h-[45vh] overflow-y-auto no-scrollbar space-y-4 mb-8">
      {cart.map((item, i) => (
        <div key={i} className="flex items-center justify-between bg-[#fbfcfa] p-4 rounded-[1.5rem] border border-[#f1f3eb] group">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#f2f4ed] border border-[#f1f3eb]">
              <Image src={item.image} fill className="object-cover" alt="img"/>
            </div>
            <div>
              <p className="text-[13px] font-black text-[#1A2421] leading-tight">{item.title}</p>
              <p className="text-[#3A4D39] font-black text-xs mt-1">₹{item.price}</p>
            </div>
          </div>

          {/* INDIVIDUAL REMOVE BUTTON (Already in your code, now always visible for easier mobile access) */}
          <button 
            onClick={() => {
              const updated = cart.filter((_, idx) => idx !== i);
              setCart(updated);
              localStorage.setItem("cart", JSON.stringify(updated));
            }} 
            className="p-2.5 text-[#a61d33] bg-rose-50 rounded-xl active:scale-90 transition-transform"
          >
            <Trash2 size={18}/>
          </button>
        </div>
      ))}
    </div>

    {/* FOOTER ACTION */}
    <div className="border-t border-[#f1f3eb] pt-8 space-y-6">
      <div className="flex justify-between items-end px-2">
        <span className="text-[#4F6F52] font-black uppercase text-[10px] tracking-widest opacity-60">Amount Payable</span>
        <span className="text-4xl font-[1000] text-[#1A2421] tracking-tighter leading-none">₹{cartTotal}</span>
      </div>
      <button 
        onClick={() => {
          if (cartTotal < MIN_CART_VALUE) {
            setMinCartError(`Add ₹${MIN_CART_VALUE - cartTotal} more to book`);
            return;
          }
          router.push("/checkout");
        }}
        className="w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3a4d39]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Confirm  <ChevronRight size={16} />
      </button>
    </div>
  </div>
</div>

      {/* 6. SAGA MIN-CART TOAST */}
      {minCartError && (
        <div className="fixed bottom-28 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:max-w-sm z-[110] bg-white/90 backdrop-blur-xl border-2 border-[#E0E5D2] shadow-2xl rounded-[2rem] p-5 flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-12 h-12 rounded-2xl bg-[#a61d33] flex items-center justify-center text-white font-[1000] text-xl shadow-lg shadow-rose-200 italic">₹</div>
          <div className="flex-1">
            <h4 className="text-[11px] font-black text-[#1A2421] uppercase tracking-widest">Ritual Minimum</h4>
            <p className="text-[12px] font-bold text-[#4F6F52]">{minCartError} more to checkout</p>
            <div className="mt-2 w-full h-1 bg-[#f2f4ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#f7b614]" style={{ width: `${(cartTotal / MIN_CART_VALUE) * 100}%` }} />
            </div>
          </div>
          <button onClick={() => setMinCartError("")} className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><X size={18}/></button>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- Professional Urban Loader ---
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
function CleaningSkeleton() {
  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-32 animate-pulse">

      {/* ===== HEADER SKELETON ===== */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_4px_20px_rgba(58,77,57,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-10 h-10 rounded-full bg-[#f2f4ed]" />
          <div className="h-5 w-32 rounded-lg bg-[#f2f4ed]" />
          <div className="w-10 h-10 rounded-full bg-[#f2f4ed]" />
        </div>

        {/* Category Pills Skeleton */}
        <div className="flex gap-3 px-6 pb-4 overflow-x-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-xl bg-[#f2f4ed]"
            />
          ))}
        </div>
      </div>

      {/* ===== SERVICES LIST SKELETON ===== */}
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 bg-white rounded-[2rem] border border-[#f1f3eb]"
          >
            {/* LEFT CONTENT */}
            <div className="flex-1 space-y-3">
              <div className="h-3 w-20 rounded bg-[#f7b614]/30" />
              <div className="h-5 w-3/4 rounded bg-[#f2f4ed]" />
              <div className="h-4 w-32 rounded bg-[#e6eadf]" />
              <div className="h-3 w-full rounded bg-[#f2f4ed]" />
              <div className="h-3 w-2/3 rounded bg-[#f2f4ed]" />
              <div className="h-3 w-24 rounded bg-[#f2f4ed]" />
            </div>

            {/* RIGHT IMAGE + BUTTON */}
            <div className="relative w-28">
              <div className="w-28 h-28 rounded-[1.5rem] bg-[#f2f4ed]" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-9 w-24 rounded-xl bg-white border border-[#e6eadf]" />
            </div>
          </div>
        ))}
      </main>

      {/* ===== FLOATING CART BAR SKELETON ===== */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#f1f3eb]">
        <div className="max-w-2xl mx-auto h-16 rounded-2xl bg-[#3A4D39]/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/30" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-white/30" />
              <div className="h-3 w-20 rounded bg-[#f7b614]/40" />
            </div>
          </div>
          <div className="h-9 w-20 rounded-xl bg-[#f7b614]/60" />
        </div>
      </div>
    </div>
  );
}
