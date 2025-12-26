"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Eye, Trash2, Star, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";


// --- Custom CSS Loader ---
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#030712] z-[100]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col items-center">
        <Image src="/LOGO.jpg" alt="Logo" width={180} height={60} className="mb-3 rounded-2xl shadow-2xl" />
        <div className="w-54 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "circIn" }}
            className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
      </motion.div>
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
  const router = useRouter();
   useEffect(() => {
      if (!loading) {
        window.scrollTo(0, 0);
      }
    }, [loading]);
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
    toast.success("Added to your session", {
      style: { background: "#111827", color: "#fff", border: "1px solid #1f2937", borderRadius: "12px" }
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
    <div className="bg-[#030712] min-h-screen text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* 🔹 MOBILE APP HEADER */}
      <div className="sticky top-[70px] bg-[#030712]/90 backdrop-blur-xl z-40 border-b border-white/5 py-3 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-2">
          {["ALL", "FACIAL", "CLEANSING", "WAXING", "MAKEUP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 COMPACT HORIZONTAL GRID */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {filteredServices.map((service) => (
          <div 
            key={service._id} 
            className="flex h-32 bg-[#111827]/40 border border-white/5 rounded-3xl overflow-hidden active:scale-[0.98] transition-all cursor-pointer shadow-lg group"
            onClick={() => setSelectedService(service)}
          >
            {/* Left: Precise Image */}
            <div className="relative w-32 h-full flex-shrink-0">
              <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {service.discount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md">
                  {service.discount} OFF
                </div>
              )}
            </div>

            {/* Right: Modern Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1 uppercase">{service.title}</h3>
                  <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg border border-white/5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-300">{service.rating?.average || "4.8"}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 leading-relaxed">{service.description}</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Base Rate</p>
                  <p className="text-lg font-black text-white tracking-tighter">₹{service.price}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                  className="bg-blue-600 hover:bg-blue-500 p-2 rounded-xl text-white shadow-lg transition-colors"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 🔹 PERSISTENT CHECKOUT DOCK */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div 
            onClick={() => setCartOpen(true)}
            className="bg-white text-black p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between border-4 border-[#030712] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Checkout</span>
            </div>
            <span className="text-xl font-black tracking-tighter">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
          </div>
        </div>
      )}

      {/* 🔹 BOTTOM-SHEET STYLE MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-t-[3rem] border-t border-white/10 shadow-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slideUp">
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="overflow-y-auto p-8 pt-4 space-y-6 pb-32">
              <div className="relative h-56 rounded-3xl overflow-hidden border border-white/5">
                <Image src={selectedService.image} alt={selectedService.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
              </div>

              <div>
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Premium Care</span>
                <h3 className="text-3xl font-bold tracking-tight mb-2 uppercase">{selectedService.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{selectedService.description}</p>
              </div>

              {/* Service Features Row */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Zap className="text-blue-500" size={20}/>
                    <span className="text-[10px] font-bold uppercase text-gray-300">Instant Booking</span>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <ShieldCheck className="text-blue-500" size={20}/>
                    <span className="text-[10px] font-bold uppercase text-gray-300">Safe Pro</span>
                 </div>
              </div>
            </div>

            {/* Modal Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-white/5 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Payable</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">₹{selectedService.price}</p>
              </div>
              <button 
                onClick={() => { addToCart(selectedService); setSelectedService(null); }}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 CART SIDE PANEL (Pure CSS Transition) */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#030712] z-[70] shadow-2xl transition-transform duration-500 border-l border-white/5 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Selection</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 text-gray-500 bg-white/5 rounded-full"><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-[#111827] rounded-3xl border border-white/5">
                <div>
                  <p className="text-sm font-bold uppercase">{item.title}</p>
                  <p className="text-blue-500 font-black text-xs">₹{item.price}</p>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Total Payable</span>
              <span className="text-3xl font-black tracking-tighter italic">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
            </div>
            <button onClick={() => router.push("/checkout")} className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-all">
              Finalize Booking
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}