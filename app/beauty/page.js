"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- Custom Loader ---
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <Image src="/LOGO.jpg" alt="Logo" width={140} height={50} className="mb-6 opacity-80" />
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-full w-full bg-blue-600"
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
    if (!loading) window.scrollTo(0, 0);
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
    toast.success("Added to your booking", {
      style: { background: "#ffffff", color: "#030712", borderRadius: "16px", fontWeight: "bold", border: "1px solid #e5e7eb" }
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
    <div className="bg-[#f3f4f6] min-h-screen text-[#030712] font-sans selection:bg-blue-100">
      
      {/* 🔹 STICKY APP HEADER */}
      <div className="sticky top-0 bg-white shadow-sm z-40 border-b border-gray-100 py-4 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-3">
          {["ALL", "FACIAL", "CLEANSING", "WAXING", "MAKEUP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-[#030712] border-[#030712] text-white shadow-lg shadow-gray-200" 
                : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 SERVICE LIST */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4 pb-32">
        {filteredServices.map((service) => (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            key={service._id} 
            className="flex h-36 bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setSelectedService(service)}
          >
            <div className="relative w-36 h-full flex-shrink-0">
              <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              {service.discount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg">
                  {service.discount} OFF
                </div>
              )}
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-[15px] font-black tracking-tight text-[#030712] line-clamp-1 uppercase">{service.title}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                    <Star size={10} className="text-yellow-600 fill-yellow-600" />
                    <span className="text-[10px] font-black text-yellow-700">{service.rating?.average || "4.8"}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-medium line-clamp-2 leading-tight uppercase tracking-tighter">{service.description}</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Base Rate</p>
                  <p className="text-xl font-black text-[#030712] tracking-tighter leading-none">₹{service.price}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-2xl text-white shadow-lg shadow-blue-100 transition-all active:scale-90"
                >
                  <ShoppingCart size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* 🔹 BLINKIT-STYLE CHECKOUT DOCK */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50"
          >
            <div 
              onClick={() => setCartOpen(true)}
              className="bg-[#030712] text-white p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between border-2 border-white/10 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative">
                  <ShoppingCart size={22} className="text-blue-400" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#030712]">{cart.length}</span>
                </div>
                <div>
                    <span className="text-[10px] block font-black uppercase tracking-widest text-gray-400">Total Items</span>
                    <span className="text-sm font-black uppercase tracking-widest">Checkout</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black tracking-tighter italic">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
                <ChevronRight size={20} className="inline-block ml-2 text-blue-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 BOTTOM-SHEET STYLE MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setSelectedService(null)} 
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[3.5rem] shadow-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-6 mb-2" />
              <div className="overflow-y-auto p-8 pt-4 space-y-8 pb-32">
                <div className="relative h-72 rounded-[2.5rem] overflow-hidden shadow-inner border border-gray-100">
                  <Image src={selectedService.image} alt={selectedService.title} fill className="object-cover" />
                </div>
                <div>
                  <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Expert Session</span>
                  <h3 className="text-4xl font-black tracking-tight mb-3 uppercase italic">{selectedService.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{selectedService.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl"><Zap className="text-blue-600" size={20}/></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#030712]">Instant Fix</span>
                  </div>
                  <div className="p-5 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl"><ShieldCheck className="text-emerald-600" size={20}/></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#030712]">Verified Safe</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-gray-50 bg-white/80 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Payable</p>
                  <p className="text-4xl font-black text-[#030712] tracking-tighter leading-none">₹{selectedService.price}</p>
                </div>
                <button 
                  onClick={() => { addToCart(selectedService); setSelectedService(null); }}
                  className="bg-[#030712] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 CART SIDE PANEL */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl transition-transform duration-500 border-l border-gray-100 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Your Selection</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review your session items</p>
            </div>
            <button onClick={() => setCartOpen(false)} className="p-3 text-gray-400 hover:text-[#030712] bg-gray-50 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-[#030712]">{item.title}</p>
                  <p className="text-blue-600 font-black text-[12px]">₹{item.price}</p>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2.5 text-red-500 bg-red-50 rounded-xl active:scale-90 transition-transform"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-6 pt-10 border-t border-gray-50">
            <div className="flex justify-between items-end px-2">
              <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Payable</span>
              <span className="text-4xl font-black tracking-tighter italic text-[#030712]">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
            </div>
            <button onClick={() => router.push("/checkout")} className="w-full py-6 bg-[#030712] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[12px] active:scale-[0.98] transition-all shadow-xl shadow-gray-200">
              Finalize Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}