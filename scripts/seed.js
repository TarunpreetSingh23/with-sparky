"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useRef, useState, useEffect } from "react";
import { Search, Star, User,
  Users,
  Calendar,
  Phone,
  BaggageClaimIcon,
  LayoutGrid,ArrowRight,Scissors,Zap,Palette,Sparkles,Waves,Wind,Smile,MessageCircle, MapPin, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ================= DATA ================= */
const want = [
  { id: 1, name: 'Pedicure', icon: Scissors },
  { id: 2, name: 'Manicure', icon: Zap },
  { id: 3, name: 'Facial', icon: Sparkles },
  { id: 4, name: 'bleach', icon: Palette },
  { id: 5, name: 'cleanup', icon: Waves },
  { id: 6, name: 'Waxing', icon: Wind },
  { id: 7, name: 'Makeup', icon: Smile },
  { id: 8, name: 'Threading', icon: MessageCircle },
  { id: 7, name: 'Hair', icon: Smile },
  { id: 8, name: 'Mehndi', icon: MessageCircle },
];

const EXPLORE_CATEGORIES = [
  { name: "Salon for Women", image: "/images/salon_women.png", link: "/beauty" },
  { name: "Spa for Women", image: "/images/spa_women.png", link: "/spa" },
  { name: "Makeup & Styling", image: "/images/makeup.png", link: "/makeup" },
  { name: "Pre Bridal", image: "/images/bridal.png", link: "/bridal" },
];
const AMRITSAR_BOUNDS = [
  { lat: 31.709249, lng: 74.817049 },
  { lat: 31.666412, lng: 74.959695 },
  { lat: 31.569168, lng: 74.891628 },
  { lat: 31.626615, lng: 74.756365 },
];

const isInsidePolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const TRENDING_FILTERS = ["All", "Waxing", "Facial", "Mani-Pedi", "Spa Services", "Body"];

export default function SparkyServiceApp() {
  const [showMap, setShowMap] = useState(false);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [address, setAddress] = useState("Tap To Select Address");
  const [pendingLocation, setPendingLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
   const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
useEffect(() => {
    const saved = localStorage.getItem("user_address");
    if (saved) {
      try {
        const { address, lat, lng } = JSON.parse(saved);
        if (address) setAddress(address);
        if (lat && lng) setPendingLocation({ lat, lng });
      } catch (e) { console.error("Invalid saved address"); }
    }
  }, []);
  const handleWantClick = (wantName) => {
  setSelected(wantName); // Optional: if you want to highlight the clicked item

  // 1. Find all service titles on the page
  // We look for h3 tags (used in ServiceAppCard) or h2 tags (Drawer)
  const serviceElements = document.querySelectorAll("h3, h2");
  
  let targetElement = null;

  // 2. Loop through to find a match
  for (const el of serviceElements) {
    if (el.textContent.toLowerCase().includes(wantName.toLowerCase())) {
      targetElement = el;
      break;
    }
  }

  // 3. Scroll to the element if found
  if (targetElement) {
    const offset = 120; // Adjust based on your sticky header height
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });

    // Optional: Add a brief "highlight" effect to the found service
    const card = targetElement.closest('.group');
    if (card) {
      card.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        card.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
    }
  }
};
  const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchServices();
  }, []);
  // 1. Fetch Services & Sync Cart Count


  // 2. Logic: Real-time Search & Category Filtering
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = (service.name || service.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeFilter === "All" || 
        (service.category || "").toLowerCase().includes(activeFilter.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, activeFilter]);

  // 3. Logic: Add to Cart Functionality
  const addToCart = (service) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = {
      ...service,
      cartId: Date.now(), // Unique ID for cart items
    };
    const updatedCart = [...existingCart, newItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    
    // Optional: Add a small haptic or visual feedback here
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 font-sans">
      
      {/* 1. TOP BAR - FUNCTIONAL SEARCH */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
              <button onClick={() => setShowMap(false)} className="bg-white p-3 rounded-full shadow-lg border">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              <UserMap setAddress={(addr, lat, lng) => {
                setAddress(addr);
                setPendingLocation({ lat, lng });
              }} />

              <AnimatePresence>
                {outOfBounds && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-[#030712]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
                        <AlertTriangle size={48} className="text-yellow-500" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Outside Our Zone</h2>
                    <p className="text-slate-400 text-base max-w-[280px]">Sparky currently only serves the heart of <span className="text-blue-400 font-extrabold underline decoration-blue-500/30">Amritsar</span>.</p>
                    <button onClick={() => setOutOfBounds(false)} className="mt-12 px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl active:scale-95 shadow-xl">
                      Back to City
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center z-10">
              <button
                disabled={!pendingLocation}
                onClick={() => {
                  if (!pendingLocation) return;
                  const { lat, lng } = pendingLocation;
                  if (checkAmritsar(lat, lng)) {
                    localStorage.setItem("user_address", JSON.stringify({ address, lat, lng }));
                    setShowMap(false);
                  }
                }}
                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all ${
                  outOfBounds || !pendingLocation
                    ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed"
                    : "bg-blue-600 text-white shadow-2xl active:scale-95"
                }`}
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HEADER: Click triggers Map ================= */}
      <header className="bg-[#8A9A5B] px-4 pt-4 pb-6 rounded-b-[2.5rem] shadow-lg">
        <div 
  className="flex items-center text-white mb-5 gap-3 cursor-pointer group active:scale-[0.98] transition-all duration-200"
  onClick={() => setShowMap(true)}
>
  {/* Icon with a subtle glow/container for better visual weight */}
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white backdrop-blur-sm">
    <MapPin size={18} className="text-gray-700" fill="white" />
  </div>

  <div className="flex-1 min-w-0">
    {/* Primary Label: Bold, high-contrast, and clean */}
    <h3 className="text-[15px] font-black tracking-tight flex items-center gap-1 leading-none mb-1">
      <span className="truncate max-w-[180px]">
        HOME
      </span>
      <ArrowRight 
        size={14} 
        className="text-white/70 group-hover:translate-x-0.5 transition-transform rotate-90" 
      />
    </h3>
    
    {/* Secondary Label: Smaller, lower opacity, and elegant */}
    <p className="text-[11px] font-medium text-white/70 truncate tracking-wide uppercase">
      {address}
    </p>
  </div>
</div>

        <div className="relative group">
          <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-transparent focus-within:border-amber-400 transition-all">
            <input
              placeholder="Search for Services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
            />
            {searchQuery ? (
              <X size={18} className="text-gray-400 cursor-pointer" onClick={() => setSearchQuery("")} />
            ) : (
              <Search size={20} className="text-gray-500" />
            )}
          </div>
        </div>
      </header>

      {/* 2. PROMO BANNER - FUNCTIONAL BOOKING */}
      <section className="px-4 -mt-4">
        <div 
          onClick={() => router.push('/beauty')}
          className="relative cursor-pointer w-full aspect-[4/3] bg-[#B8C398] rounded-t-full overflow-hidden flex flex-col items-center justify-center border-b-8 border-[#424A2B] active:scale-[0.99] transition-transform"
        >
          <div className="text-center px-10">
            <h2 className="text-5xl font-serif font-light text-grey-500 italic">Korean</h2>
            <h2 className="text-4xl font-bold text-grey-500 uppercase tracking-tight -mt-2">Beauty Range</h2>
            <div className="mt-4 bg-[#5C673C] text-white px-6 py-2 rounded-lg inline-block">
              <span className="text-sm font-medium">starting @</span>
              <span className="text-xl font-black ml-1">₹749</span>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-12 bg-white/20 backdrop-blur-sm" />
        </div>
      </section>

      {/* 3. EXPLORE CATEGORIES */}
    

<section className="mt-4 px-4">
  <div className="max-w-md mx-auto p-3 bg-white rounded-[2.5rem] shadow-sm">
   <h2 className="text-center text-[#121212] text-2xl mb-2  font-medium tracking-wide">
  Our Services
</h2>


   <div className="grid grid-cols-4 gap-4">
          {want.map((cat, i) => (
            <Link key={i} href={"/"} className="flex flex-col items-center gap-2">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#ebf3d2] border border-rose-100 shadow-sm active:scale-95 transition-transform">
                <Image src={cat.image || "/images/sremovebg.png"} fill className="object-cover" alt={cat.name} />
              </div>
              <span className="text-[13px] font-bold text-center leading-tight text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>

  </div>
</section>

      {/* 4. TRENDING NEAR YOU - FUNCTIONAL FILTERING */}
      <section className="mt-10">
        <div className="px-4 mb-4">
            <h2 className="text-lg font-bold tracking-tight">Trending Near You</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {TRENDING_FILTERS.map((f, i) => (
            <button 
              key={i} 
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === f 
                ? 'bg-rose-100 text-[#a61d33] border-rose-200 shadow-sm' 
                : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 5. SERVICE LIST - FILTERED RESULTS */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 py-4 min-h-[160px]">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, i) => (
              <ServiceRowCard key={i} item={service} onAdd={() => addToCart(service)} />
            ))
          ) : (
            <p className="text-xs text-gray-400 italic px-2 py-10">No services found matching your criteria...</p>
          )}
        </div>
      </section>

      {/* 6. PROMO BANNER 2 - FUNCTIONAL BOOKING */}
      <section className="px-4 mt-8">
        <div className="bg-rose-50 rounded-3xl p-6 relative overflow-hidden flex items-center border border-rose-100">
           <div className="z-10 w-2/3">
              <span className="bg-[#a61d33] text-white text-[10px] font-bold px-3 py-1 rounded-r-full -ml-6 mb-3 inline-block">Flash Deal</span>
              <h3 className="text-2xl font-black text-[#a61d33] leading-none mb-2 italic">Korean Body Polishing</h3>
              <p className="text-lg font-bold text-gray-800">@ ₹1599</p>
              <button 
                onClick={() => router.push('/spa')}
                className="mt-4 bg-[#a61d33] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95"
              >
                Book Now
              </button>
           </div>
           <div className="absolute right-0 bottom-0 w-1/2 h-full">
              <Image src="/images/massage_model.png" fill className="object-contain object-right-bottom" alt="Promo" />
           </div>
        </div>
      </section>

      {/* BOTTOM NAVIGATION - FUNCTIONAL CART COUNT */}
 <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 pt-3 pb-6 flex justify-between items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
  
  <NavItem 
    label="Home" 
    onClick={() => router.push("/")}
    active
    icon={
      <User
        size={22}
        className="mb-1 text-[#8a9a5b]"
      />
    } 
  />
  
  <NavItem 
    label="Beauty" 
    onClick={() => router.push("/beauty")}
    
    icon={
      <User
        size={22}
        className="mb-1 text-[#8a9a5b]"
      />
    } 
  />

  {/* CENTER ACTION BUTTON */}
  <div 
    className="relative -top-10 cursor-pointer group"
    onClick={() => router.push("/cart")}
  >
    <div className="absolute inset-0 bg-[#8a9a5b]/10 rounded-full animate-ping scale-110 opacity-20" />
    
    <div className="relative w-16 h-16 bg-[#8a9a5b] rounded-full flex items-center justify-center p-1.5 shadow-[0_8px_25px_rgba(166,29,51,0.3)] border-[5px] border-white active:scale-90 transition-transform duration-200">
      <div className="w-full h-full border border-white/20 rounded-full flex items-center justify-center">
        <BaggageClaimIcon size={26} className="text-white" />

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#f7b614] text-[#8a9a5b] text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md animate-in zoom-in">
            {cartCount}
          </span>
        )}
      </div>
    </div>

    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#8a9a5b] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
      Cart
    </span>
  </div>

  <NavItem 
    label="Help" 
    onClick={() => router.push("/contact")}
    icon={
      <Phone
        size={22}
        className="mb-1 text-gray-400 group-hover:text-[#a61d33]"
      />
    } 
  />
  
  <NavItem 
    label="Account" 
    onClick={() => router.push("/user")}
    icon={
      <User
        size={22}
        className="mb-1 text-gray-400 group-hover:text-[#a61d33]"
      />
    } 
  />
</nav>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function ServiceRowCard({ item, onAdd }) {
  const router = useRouter();

  const handleCardClick = () => {
    // Navigate to the detail page using the item's title or ID
    router.push(`/services/${item.title || item.name}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="min-w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 transition-all hover:shadow-md cursor-pointer active:scale-[0.99]"
    >
      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
        <Image src={item.image || "/images/placeholder.jpg"} fill className="object-cover" alt={item.name} />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">
            {item.title || item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
             <span className="text-[10px] text-emerald-500 font-bold tracking-tight">Best Deal</span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation(); // 🔐 Critical: Prevents the card click from firing
            onAdd();
          }}
          className="relative z-10 w-full mt-2 border border-rose-200 text-[#a61d33] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#a61d33] hover:text-white transition-all shadow-sm bg-white active:scale-95"
        >
          ADD
        </button>
      </div>
    </div>
  );
}

function NavItem({ label, icon, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-all ${
        active ? "text-[#424A2B]" : "text-gray-400"
      }`}
    >
      {/* Icon container */}
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors
          ${
            active
              ? "bg-[#E0E5D2]"
              : "bg-gray-100 group-hover:bg-gray-200"
          }`}
      >
        {icon}
      </div>

      <span className="text-[10px] font-bold tracking-tight">
        {label}
      </span>
    </div>
  );
}


function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-[#a61d33] animate-spin mb-4" />
      <p className="text-[10px] font-bold text-[#a61d33] uppercase tracking-widest animate-pulse">Sparky Premium</p>
    </div>
  );
}