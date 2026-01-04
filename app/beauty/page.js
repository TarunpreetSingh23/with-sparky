"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ShieldCheck, Zap, ChevronRight, ChevronLeft, Share2, Search, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        <span className="mt-4 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">
          Refining Experience
        </span>
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
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>

      {/* 📍 Glass Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-white/20">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20}/></button>
          </div>
          <div className="text-center">
            <h1 className="text-[14px] font-black tracking-tighter uppercase italic leading-none">{selectedCategory === "ALL" ? "Bestsellers" : selectedCategory}</h1>
            <p className="text-[7px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Curated</p>
          </div>
          <div />
        </div>
        
        <div className="flex px-5 gap-2 pb-4 overflow-x-auto no-scrollbar">
          {["ALL", "FACIAL", "CLEANSING", "WAXING", "MAKEUP"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-[#030712] border-[#030712] text-white shadow-sm" 
                : "bg-white/50 border-slate-200 text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Bento Grid Service List */}
      <main className="max-w-4xl mx-auto px-5 py-6 grid grid-cols-2 gap-4 pb-44 relative z-10">
        {filteredServices.map((service, idx) => (
          <div 
            key={service._id} 
            className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] overflow-hidden shadow-sm flex flex-col group relative active:scale-[0.97] transition-transform"
            onClick={() => setSelectedService(service)}
          >
            <div className="relative aspect-[4/5] w-full bg-slate-50">
              <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <div className="absolute bottom-2 right-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                  className="bg-white text-[#030712] border border-slate-100 px-3 py-1.5 rounded-xl font-black text-[8px] shadow-lg hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                >
                  Add
                </button>
              </div>

              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md border border-white px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Clock size={10} className="text-blue-500" />
                <span className="text-[7px] font-black text-slate-700 uppercase">8 mins</span>
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[10px] font-black tracking-tight text-[#1a1a1a] line-clamp-1 uppercase italic">
                  {service.title}
                </h3>
                <div className="flex items-center gap-0.5 ml-1">
                  <Star size={8} className="text-amber-400 fill-amber-400" />
                  <span className="text-[8px] font-black text-slate-400">{service.rating?.average || "4.8"}</span>
                </div>
              </div>
              
              <div className="mt-auto pt-2 flex items-end justify-between border-t border-slate-50/50">
                <div className="flex flex-col">
                  <p className="text-[9px] text-blue-600 font-black tracking-tighter italic leading-none">₹{service.price}</p>
                  <p className="text-[7px] text-slate-300 line-through mt-0.5">₹{service.price + 150}</p>
                </div>
                <Sparkles size={10} className="text-blue-200" />
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 🚀 Floating Checkout Pill */}
      <div className={`fixed bottom-17 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-50 transition-all duration-300 transform ${cart.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
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
              onClick={() => { addToCart(selectedService); setSelectedService(null); }}
              className="bg-[#030712] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Confirm Choice
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
            <button onClick={() => router.push("/checkout")} className="w-full py-4 bg-[#030712] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
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