"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ChevronRight, ChevronLeft, LayoutGrid, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function CleaningPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const MIN_CART_VALUE = 300;
  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_SOFT = "#f2f4ed";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_MAROON = "#a61d33";

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#fbfcfa] min-h-screen text-[#1A2421] font-sans pb-32">
      
      {/* 1. PREMIUM STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_4px_20px_rgba(58,77,57,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#f2f4ed] rounded-full transition-colors">
            <ChevronLeft size={24} color={SAGA_GREEN} />
          </button>
          <h1 className="text-lg font-[1000] tracking-tight italic text-[#1A2421]">
            {selectedCategory === "ALL" ? "All Services" : selectedCategory}
          </h1>
          <button className="p-2 relative" onClick={() => setCartOpen(true)}>
             <ShoppingCart size={22} color={SAGA_GREEN} />
             {cart.length > 0 && <span className="absolute top-0 right-0 bg-[#a61d33] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">{cart.length}</span>}
          </button>
        </div>

        {/* 2. CATEGORY PILLS (Professional Style) */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-4 scroll-smooth">
          {["ALL", "FACIAL", "CLEANUP", "WAXING", "MAKEUP", "MANICURE"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                selectedCategory === cat 
                ? "bg-[#3A4D39] border-[#3A4D39] text-white shadow-lg" 
                : "bg-white border-[#f1f3eb] text-[#4F6F52] hover:border-[#3A4D39]"
              }`}
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
              
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-4 line-clamp-2">{service.description}</p>
              
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
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#f1f3eb] z-50">
          <div 
            onClick={() => setCartOpen(true)}
            className="max-w-2xl mx-auto bg-[#3A4D39] text-white px-6 py-4 rounded-2xl shadow-[0_15px_30px_rgba(58,77,57,0.3)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-xl border border-white/10"><ShoppingCart size={20} color={SAGA_ACCENT} /></div>
                <div>
                    <span className="block text-sm font-black tracking-tight italic">₹{cartTotal} • {cart.length} Service{cart.length > 1 ? 's' : ''}</span>
                    <span className="text-[10px] font-bold text-[#f7b614] uppercase tracking-tighter">View ritual bag</span>
                </div>
            </div>
            <div className="bg-[#f7b614] text-[#3A4D39] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
              Review <ChevronRight size={14} />
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
            <h2 className="text-2xl font-[1000] text-[#1A2421] italic">My  <span className="text-[#a61d33]">Bag</span></h2>
            <button onClick={() => setCartOpen(false)} className="p-3 bg-[#f2f4ed] rounded-full text-[#3A4D39]"><X size={20}/></button>
          </div>

          <div className="max-h-[45vh] overflow-y-auto no-scrollbar space-y-4 mb-8">
            {cart.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#fbfcfa] p-4 rounded-[1.5rem] border border-[#f1f3eb] group">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#f2f4ed] border border-[#f1f3eb]"><Image src={item.image} fill className="object-cover" alt="img"/></div>
                  <div>
                    <p className="text-[13px] font-black text-[#1A2421] leading-tight">{item.title}</p>
                    <p className="text-[#3A4D39] font-black text-xs mt-1">₹{item.price}</p>
                  </div>
                </div>
                <button onClick={() => {
                   const updated = cart.filter((_, idx) => idx !== i);
                   setCart(updated);
                   localStorage.setItem("cart", JSON.stringify(updated));
                }} className="p-2.5 text-rose-400 bg-rose-50 rounded-xl active:scale-90 transition-transform opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>

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
              Confirm Ritual <ChevronRight size={16} />
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