"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ChevronRight, ChevronLeft, Share2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// --- Professional Urban Loader ---
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  useEffect(() => {
    if (!loading) window.scrollTo(0, 0);
  }, [loading]);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setSelectedCategory(catFromUrl.toUpperCase());
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

  const getCartTotal = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    return cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const addToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    currentCart.push({
      title: item.title,
      price: item.price,
      image: item.image,
      earning: item.earning,
      profit: item.profit,
      quantity: 1,
      category: item.category,
      _id: item._id || Date.now() // Ensure ID for removal
    });

    localStorage.setItem("cart", JSON.stringify(currentCart));
    
    const total = getCartTotal();

    if (total < MIN_CART_VALUE) {
      const remaining = MIN_CART_VALUE - total;
      setMinCartError(`Add at least ₹${remaining} service`);
      // Update local state so UI reflects change before refresh
      setCart(currentCart); 
    } else {
      setMinCartError("");
      toast.success("Added to cart");
    }

    // Refresh page after small delay to let user see feedback
    // setTimeout(() => {
    //   window.location.reload();
    // }, 800);
  };

  const removeFromCart = (id) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = existingCart.findIndex(item => item._id === id);
    if (idx > -1) existingCart.splice(idx, 1);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart([...existingCart]); // Trigger re-render
  };

  const filteredServices = selectedCategory === "ALL" 
    ? services 
    : services.filter((s) => s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#f2f4f7] min-h-screen text-[#1a1a1b] font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* --- Sticky Header & Category Filter --- */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-center px-4 py-3">
          {/* <button onClick={() => router.back()} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button> */}
          <h1 className="text-lg font-bold tracking-tight">
            {selectedCategory === "ALL" ? "All Services" : selectedCategory}
          </h1>
          {/* <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <Share2 size={20} />
          </button> */}
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-3 scroll-smooth">
          {["ALL", "FACIAL", "CLEANUP", "WAXING", "MAKEUP", "MANICURE", "PEDICURE"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Service List --- */}
      <main className="max-w-2xl mx-auto p-4 flex flex-col gap-3 pb-32">
        <div className="bg-white rounded-2xl p-4 mb-2 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Star size={14} fill="currentColor" />
                <span className="text-[12px] font-bold">4.8 (120k reviews)</span>
            </div>
            <p className="text-sm text-slate-500">Professional services delivered at your doorstep.</p>
        </div>

        {filteredServices.map((service) => (
          <div 
            key={service._id} 
            className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <h3 className="text-md font-bold text-slate-900 mb-1 leading-snug">{service.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-slate-900">₹{service.price}</span>
                <span className="text-xs text-slate-400 font-medium">• 45 mins</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{service.description}</p>
              <button onClick={() => router.push(`services/${service.title}`)} className="text-xs font-bold text-blue-600 hover:underline">
                View details
              </button>
            </div>
            <div className="relative flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <Image src={service.image} alt={service.title} fill className="object-cover" />
              </div>
              <button 
                onClick={() => addToCart(service)}
                className="absolute -bottom-2 w-20 bg-white border border-slate-200 text-blue-600 py-1.5 rounded-lg font-bold text-[12px] shadow-md hover:bg-blue-50 uppercase"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* --- Sticky Bottom Cart Bar --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50">
          <div 
            onClick={() => setCartOpen(true)}
            className="max-w-2xl mx-auto bg-blue-600 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-1.5 rounded-lg"><ShoppingCart size={18} /></div>
                <div>
                    <span className="block text-xs font-bold uppercase tracking-tighter">₹{cartTotal} • {cart.length} Item{cart.length > 1 ? 's' : ''}</span>
                    <span className="text-[10px] font-medium opacity-70 italic">Checkout to proceed</span>
                </div>
            </div>
            <div className="flex items-center gap-1 font-bold">
              <span>View Cart</span>
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      )}

      {/* --- Unique Bottom Sheet Cart Drawer --- */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${cartOpen ? 'bg-black/60 opacity-100 visible' : 'bg-black/0 opacity-0 invisible'}`} onClick={() => setCartOpen(false)}>
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-6 transition-transform duration-500 transform ${cartOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* Drawer Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Ritual Bag</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto no-scrollbar space-y-4 mb-6">
            {cart.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden"><Image src={item.image} fill className="object-cover" alt="img"/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-blue-600 font-bold text-xs">₹{item.price}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 bg-red-50 rounded-lg"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 font-medium">Total Payable</span>
              <span className="text-2xl font-black text-slate-900">₹{cartTotal}</span>
            </div>
            <button 
              onClick={() => {
                if (cartTotal < MIN_CART_VALUE) {
                  setMinCartError(`Add ₹${MIN_CART_VALUE - cartTotal} more`);
                  return;
                }
                router.push("/checkout");
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-transform"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>

      {/* --- Error Toast for Min Cart --- */}
      {minCartError && (
        <div className="fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-sm z-[110] bg-white border border-slate-100 shadow-2xl rounded-3xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">₹</div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900 uppercase">Almost there!</h4>
            <p className="text-[11px] text-gray-500">{minCartError} more to unlock checkout</p>
          </div>
          <button onClick={() => setMinCartError("")}><X size={16} className="text-slate-400"/></button>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}