"use client";

import Image from "next/image";
import Link from "next/link";
import FloatingOrderTracker from "@/components/FloatingOrderTracker";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Plus,
  Wrench,
  X,
  MapPin,
  Star,
  ArrowRight,
  LayoutGrid,
  Scissors, 
  User,
  
  Palette, 
  Wind, 
  CheckCircle2,
  Waves, 
  Zap, 
  Smile, 
  MessageCircle
} from "lucide-react";
import dynamic from "next/dynamic";
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });


import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";




/* ================= DATA ================= */

const CATEGORIES = [
  { name: "BEAUTY", icon: <Sparkles size={20} />, ref: "beautyRef" },
  { name: "Beatique", icon: <Scissors size={20} />, ref: "beatiqueRef" },
  { name: "Technical", icon: <Wrench size={20} />, ref: "techRef" },
];

const CRAZY_DEAL = {
  name: "Gold Facial",
  originalPrice: "₹1,875",
  price: 999,
  image: "/images/goldfacial.jpg",
  discount: "45% OFF",
  link: "/services/facial",
  category: "Woman Services"
};

const QUICK_SERVICES = [
  { title: "Suit Stitching", discount: "30% OFF", image: "/images/stitching.jpg", price: 1299, link: "/services/stitching" },
  { title: "AC Repair", discount: "₹200 OFF", image: "/images/crazyAc.avif", price: 499, link: "/services/ac-repair" },
  { title: "Deep Cleanup", discount: "50% OFF", image: "/images/deepc.webp", price: 799, link: "/services/cleaning" },
  { title: "Manicure", discount: "Starts ₹199", image: "/images/mpm.jpg", price: 199, link: "/services/manicure",category: "Woman Services" },
];

const BESTSELLERS = [
  { id: 1, name: "Manicure", image: "/images/mpm.jpg", count: "+120 more", price: 499, link: "/services/manicure", category: "Woman Services" },
  { id: 2, name: "Plumbing", image: "/images/plumbing.jpg", count: "+80 more", price: 299, link: "/services/plumbing" },
  { id: 3, name: "Makeup", image: "/images/makeup.jpg", count: "+150 more", price: 1499, link: "/services/makeup", category: "Woman Services" },
];

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/mpm.jpg", link: "/services/manicure", category: "Woman Services" },
  { title: "Pedicure", price: 599, image: "/images/vee.jpg", link: "/services/pedicure", category: "Woman Services" },
  { title: "Facial", price: 999, image: "/images/vee2.jpg", link: "/services/facial", category: "Woman Services" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/services/waxing", category: "Woman Services" },
  { title: "Cleaning", price: 799, image: "/images/cleanup.jpg", link: "/services/cleaning" },
  { title: "AC Repair", price: 499, image: "/images/ac.jpg", link: "/services/ac-repair" },
];
const want = [
  { id: 1, name: 'Pedicure', icon: Scissors,image:"/images/pedicure.png" },
  { id: 2, name: 'Manicure', icon: Zap,image:"/images/manicure.png" },
  { id: 3, name: 'Facial', icon: Sparkles,image:"/images/facial.png" },
  { id: 4, name: 'bleach', icon: Palette,image:"/images/bleach.png" },
  { id: 5, name: 'cleanup', icon: Waves,image:"/images/cleanup.png" },
  { id: 6, name: 'Waxing', icon: Wind ,image:"/images/waxing.png"},
  { id: 7, name: 'Makeup', icon: Smile,image:"/images/makeup.png" },
  { id: 8, name: 'Hair', icon: MessageCircle, image:"/images/hair.png"},
  // { id: 7, name: 'Hair', icon: Smile },
  // { id: 8, name: 'Mehndi', icon: MessageCircle },
];
const MOCK_ORDERS = [
  {
    orderId: "ORD-99283",
    status: "pending", // Should show in floating card
    serviceName: "Gold Facial",
    price: 999,
    date: "2026-01-31",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-88122",
    status: "accepted", // Should show in floating card
    serviceName: "AC Repair",
    price: 499,
    date: "2026-01-30",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-77100",
    status: "completed", // Filter should ignore this
    serviceName: "Manicure",
    price: 199,
    date: "2026-01-28",
    customerName: "Guest User"
  },
  {
    orderId: "ORD-00123",
    status: "cancelled", // Filter should ignore this
    serviceName: "Deep Cleanup",
    price: 799,
    date: "2026-01-25",
    customerName: "Guest User"
  }
];
/* ================= PAGE ================= */
const promoData = {
  "Waxing": { 
    title: "3 Step Korean Wax Ritual", 
    tag: "Full Arms, Full Legs & Underarms", 
    img: "/images/waxing.png", 
    price: "799",
    layout: "elegant-minimal" // The screenshot style
  },
  "Facial": { 
    title: "Instant Glow Facial", 
    tag: "Premium Herbal Range", 
    img: "/images/fruitfacial.webp", 
    price: "1299",
    layout: "soft-gradient" 
  },
  "Mehandi": { 
    title: "Bridal Mehandi Artist", 
    tag: "Traditional & Modern Designs", 
    img: "/images/mehandi.jpg", 
    price: "499",
    layout: "bold-split" 
  },
  "Makeup": { 
    title: "Party Makeup Look", 
    tag: "Professional MUA Choice", 
    img: "/images/makeup.png", 
    price: "1599",
    layout: "elegant-minimal" 
  },
  "Haircare": { 
    title: "Saga Hair Spa", 
    tag: "Deep Root Nourishment", 
    img: "/images/hair.jpg", 
    price: "899",
    layout: "floating-circle" 
  },
  "Bleach": { 
    title: "Oxy Glow Bleach", 
    tag: "Even Skin Tone", 
    img: "/images/bleach.png", 
    price: "299",
    layout: "soft-gradient" 
  }
};

export default function SparkyServiceApp() {
const navcolour = "#8a9a5b";    // Near-Black Green (Very high-end feel)
const herocolour = "#b8c398";   // Soft Clay (Elegant background for text)
const herobutton = "#5c673c";   // Forest Green (Clear action button)
const mainbg = "#ebede9";       // Light Sage Grey (Sophisticated depth)
// const router=useRouter();

  const beautyRef = useRef(null);
  const beatiqueRef = useRef(null);
  const techRef = useRef(null);
  const searchRef = useRef(null);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [address, setAddress] = useState("Tap To Select Address");
  const router = useRouter();
  const [orders, setorders] = useState([])
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selected, setSelected] = useState(null);
  const [minCartError, setMinCartError] = useState("");
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
  const active = orders.find(order => 
   order.status !== 'cancelled' && order.status !== 'completed'
   );
  console.log(active)
  const refs = { beautyRef, beatiqueRef, techRef };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/by-phone");
        const data = await res.json();
        setorders(data);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
   const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;
    const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
    setOutOfBounds(!inside);
    return inside;
  };
// Filter for orders that are neither 'cancelled' nor 'completed'
   const getCartTotal = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

 const MIN_CART_VALUE = 300;

const handleBooking = (service) => {
  const itemToAdd = {
    title: service.name || service.title,
    price: typeof service.price === 'string'
      ? parseInt(service.price.replace('₹', ''))
      : service.price,
    image: service.image,
    quantity: 1,
    category: service.category,
    earning: service.earning,
    profit: service.profit,
  };

  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  existingCart.push(itemToAdd);
  localStorage.setItem("cart", JSON.stringify(existingCart));

  const total = getCartTotal();

  if (total < MIN_CART_VALUE) {
    const remaining = MIN_CART_VALUE - total;
    setMinCartError(`Add at least ₹${remaining} service`);
    return; // ❌ Stop navigation
  }

  setMinCartError("");
  router.push("/checkout");
};


  useEffect(() => {
  // Only search if user has typed at least 2 characters
  if (query.trim().length < 2) {
    setResults([]);
    setOpen(false);
    return;
  }

  // Filter the services fetched from your database API
  const filtered = services.filter((s) => {
    const serviceTitle = (s.name || s.title || "").toLowerCase();
    const serviceCategory = (s.category || "").toLowerCase();
    const searchTerm = query.toLowerCase();
    
    return serviceTitle.includes(searchTerm) || serviceCategory.includes(searchTerm);
  });

  setResults(filtered.slice(0, 6)); // Show top 6 matches
  setOpen(true);
}, [query, services]);
useEffect(() => {
  const savedAddress = localStorage.getItem("user_address_text");

  if (savedAddress) {
    setAddress(savedAddress);
  }
}, []);


  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (refKey) => {
    const target = refs[refKey];
    if (target && target.current) {
      window.scrollTo({
        top: target.current.offsetTop - 110,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <SparkySkeletonPage />;

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

  return (
    <div style={{ backgroundColor: mainbg }} className="min-h-screen  text-[#111827] pb-32 font-sans overflow-x-hidden">
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
                   localStorage.setItem(
  "user_address",
  JSON.stringify({ address, lat, lng })
);

// 🔥 ADD THIS
localStorage.setItem("user_address_text", address);

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
      {/* ================= HEADER ================= */}
     <header style={{ backgroundColor: navcolour }}  className={` px-4 pt-4 pb-5 rounded-b-[2.5rem] shadow-lg`}>
  <div
  onClick={() => setShowMap(true)}
  className="flex items-center gap-3 text-white cursor-pointer group active:scale-[0.98] mb-3 transition-all duration-200"
>
  {/* Location Icon */}
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
    <MapPin size={16} className="text-[#1f4637]" />
  </div>

  {/* Content */}
  <div className="flex flex-1 items-center justify-between min-w-0">

    {/* LEFT — Address */}
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1">
        <span className="text-[14px] font-semibold tracking-tight leading-none">
          Home
        </span>
        <ArrowRight
          size={12}
          className="text-white/60 rotate-90"
        />
      </div>

      <span className="mt-0.5 text-[11px] font-medium text-white/70 truncate max-w-[180px] tracking-wide">
        {address}
      </span>
    </div>

    {/* RIGHT — Brand */}
    <div className="flex flex-col items-end leading-none">
      <span className="text-[18px] font-extrabold tracking-[0.14em]">
        SPARKY
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
        in 40 mins
      </span>
    </div>

  </div>
</div>


        <div className="relative group">
          <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-transparent focus-within:border-amber-400 transition-all">
            <input
              placeholder="Search for Services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
            />
            {query ? (
              <X size={18} className="text-gray-400 cursor-pointer" onClick={() => setQuery("")} />
            ) : (
              <Search size={20} className="text-gray-500" />
            )}
          </div>
 {open && results.length > 0 && (
  <div className="absolute top-full mt-3 w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(58,77,57,0.15)] border border-[#f1f3eb] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
    {/* Header for Results */}
    <div className="bg-[#fbfcfa] px-5 py-2.5 border-b border-[#f1f3eb]">
      <p className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-[#4F6F52] opacity-60">
        Top  Matches
      </p>
    </div>

    <div className="max-h-[380px] overflow-y-auto no-scrollbar">
      {results.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            setQuery("");
            setOpen(false);
            setSelectedService(item);
          }}
          className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fbfcfa] transition-all border-b border-[#f1f3eb] last:border-0 group"
        >
          {/* Service Image with Saga Soft Background */}
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#f2f4ed] shrink-0 border border-[#f1f3eb] shadow-sm">
            <Image
              src={item.image || "/images/placeholder.jpg"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              alt={item.name || item.title}
            />
          </div>

          {/* Service Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-[1000] text-[#1A2421] leading-tight truncate uppercase tracking-tight">
              {item.name || item.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-black text-[#a61d33] uppercase tracking-widest bg-rose-50 px-1.5 py-0.5 rounded">
                 Verified
               </span>
               <p className="text-[10px] font-bold text-[#4F6F52] opacity-50 truncate italic">
                 {item.category}
               </p>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[15px] font-[1000] text-[#3A4D39] tracking-tighter">
              ₹{item.price}
            </span>
            <div className="w-5 h-5 rounded-full bg-[#3A4D39]/5 flex items-center justify-center group-hover:bg-[#3A4D39] transition-colors">
               {/* <ChevronRight size={12} className="text-[#3A4D39] group-hover:text-white" /> */}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer for Dropdown */}
    {/* <div className="bg-white px-5 py-3 text-center border-t border-[#f1f3eb]">
       <button className="text-[10px] font-black uppercase tracking-[0.1em] text-[#a61d33] hover:opacity-70 transition-opacity">
         View all matches
       </button>
    </div> */}
  </div>
)}

        </div>
      </header>
 {/* <section className="px-4 -mt-0">
        <div 
        style={{ backgroundColor: herocolour }}
          onClick={() => router.push('/beauty')}
          className="relative cursor-pointer w-full aspect-[4/3]  rounded-t-full overflow-hidden flex flex-col items-center justify-center border-b-8 border-[#424A2B] active:scale-[0.99] transition-transform"
        >
          <div className="text-center px-10">
            <h2 className="text-5xl font-serif font-light text-grey-500 italic">Korean</h2>
            <h2 className="text-4xl font-bold text-grey-500 uppercase tracking-tight -mt-2">Beauty Range</h2>
            <div style={{ backgroundColor: herobutton }} className="mt-4  text-white px-6 py-2 rounded-lg inline-block">
              <span className="text-sm font-medium">starting @</span>
              <span className="text-xl font-black ml-1">₹749</span>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-12 bg-white/20 backdrop-blur-sm" />
        </div>
      </section> */}
      {/* ================= MAIN CONTENT ================= */}
      <main className="px-4 space-y-8 pt-2 ">


     <section className="mt-4 px-2">
  <div className="max-w-md mx-auto p-5 bg-white rounded-[2.5rem] shadow-sm">
   <h2 className="text-center text-[26px] mb-0.5 font-serif font-light italic text-[#1A2421] tracking-tight">
  Our Services
</h2>
{/* <div className="mx-auto mt-0.5 mb-0.5 w-10 h-[2px] bg-[#8A9A5B] rounded-full" /> */}



   <div className="grid grid-cols-4 mb-2 w-full gap-4">
         {want.map((cat, i) => (
  <button
    key={i}
    onClick={() => handleWantClick(cat.name)}
    className="flex flex-col items-center gap-2 text-left"
  >
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#ebf3d2] border border-rose-100 shadow-sm active:scale-95 transition-transform">
      <Image
        src={cat.image || "/images/sremovebg.png"}
        fill
        className="object-cover"
        alt={cat.name}
      />
    </div>

    <span className="text-[13px] font-sans text-center leading-tight text-gray-700">
      {cat.name}
    </span>
  </button>
))}

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
<section ref={beautyRef} className="pt-0.5">
  <SectionTitle title="Beauty Services" />
  <FloatingOrderTracker activeOrder={active} />

  {["Waxing", "Facial", "Mehandi", "Haircare", "Threading", "Makeup", "Bleach", "Cleanup", "Manicure", "Pedicure", "Hair", "Mehndi"].map((subCat) => {
    const filteredServices = services.filter(
      (item) =>
        item.category === "Woman Services" &&
        (item.name || item.title || "").toLowerCase().includes(subCat.toLowerCase())
    );

    if (filteredServices.length === 0) return null;

    // Change display limit to 3 items
    const displayServices = filteredServices.slice(0, 3);

    return (
      <div key={subCat} className="mb-10">
        
        {/* Category Header with Top-Aligned View All Button */}
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-[13px] font-black text-[#1A2421] uppercase tracking-[0.15em] flex items-center gap-2">
            <span className="w-1 h-5 bg-[#4F6F52] rounded-full" />
            {subCat}
          </h3>
          
          <button 
            onClick={() => router.push(`/beauty?category=${subCat.toUpperCase()}`)}
            className="flex items-center gap-1 bg-[#3A4D39]/5 text-[#3A4D39] px-3 py-1.5 rounded-full border border-[#3A4D39]/10 active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">View All</span>
            {/* <ChevronRight size={12} strokeWidth={3} /> */}
          </button>
        </div>
        
        {/* Services Grid (3 Columns) */}
        <div className="grid grid-cols-3 gap-3 px-2">
          {displayServices.map((item) => (
            <div key={item.id} onClick={() => setSelectedService(item)}>
              <ServiceAppCard item={item} />
            </div>
          ))}
        </div>

        {/* DYNAMIC HERO CAROUSEL remains below the grid */}
        <div className="mt-6 px-2">
          <SubCategoryPromo subCat={subCat} />
        </div>
      </div>
    );
  })}
</section>

        {/* <section ref={beatiqueRef} className="pt-2">
          <SectionTitle title="The Beatique" />
          <div className="grid grid-cols-3 gap-3">
            {BESTSELLERS.map((item) => (
              <div key={item.id} onClick={() => setSelectedService(item)}>
                <ServiceAppCard item={item} />
              </div>
            ))}
          </div>
        </section> */}

        {/* <section ref={techRef} className="pt-4">
          <SectionTitle title="Tech Masters" />
          <div className="grid grid-cols-3 gap-3">
            {BESTSELLERS.map((item) => (
              <div key={item.id} onClick={() => setSelectedService(item)}>
                <ServiceAppCard item={item} />
              </div>
            ))}
          </div>
        </section> */}
      </main>

      {/* ================= BOTTOM SLIDE DRAWER (CSS TRANSITION) ================= */}
      {/* Backdrop */}
      <div 
        onClick={() => setSelectedService(null)}
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px] transition-opacity duration-300 ${selectedService ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
      
      {/* Drawer */}
      <div
  className={`fixed bottom-0 left-0 right-0 bg-[#fdfefb] rounded-t-[2.75rem] z-[70]
  shadow-[0_-20px_60px_rgba(66,74,43,0.25)] overflow-hidden
  transition-transform duration-300 ease-out transform
  ${selectedService ? "translate-y-0" : "translate-y-full"}`}
>
  {/* Drag Handle */}
  <div className="w-12 h-1.5 bg-[#8A9A5B]/30 rounded-full mx-auto mt-4 mb-3" />

  {selectedService && (
    <div className="px-6 pb-8 pt-2">

      {/* Image */}
      <div className="relative w-full h-64 rounded-[2rem] overflow-hidden mb-6 shadow-md border border-[#8A9A5B]/20">
        <Image
          src={selectedService.image}
          fill
          className="object-cover"
          alt="Service Detail"
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#424A2B]/40 via-transparent to-transparent" />

        {/* Close */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-md active:scale-90 transition"
        >
          <X size={18} className="text-[#424A2B]" />
        </button>
      </div>

      {/* Title + Price */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#2f3a1f] tracking-tight leading-snug">
            {selectedService.name || selectedService.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="ml-1 text-sm font-bold text-[#424A2B]">
                4.9
              </span>
            </div>

            <span className="text-[#8A9A5B]">•</span>

            <span className="text-[10px] font-black uppercase tracking-widest text-[#8A9A5B]">
              Verified Expert
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-[#424A2B] tracking-tight">
            ₹{selectedService.price || "799"}
          </p>
          <p className="text-[9px] font-bold text-[#8A9A5B] uppercase tracking-widest">
            Base Price
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#5f6b4a] leading-relaxed mb-8 font-medium text-sm">
        {selectedService.description ||
          "Enjoy a premium, hygienic, at-home service delivered by trained professionals using salon-grade products."}
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        {/* Primary */}
        <button
          onClick={() => handleBooking(selectedService)}
          className="flex-1 bg-gradient-to-r from-[#8A9A5B] to-[#6f7f46]
          text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest
          shadow-lg shadow-[#8A9A5B]/40 active:scale-[0.97]
          transition-all flex items-center justify-center gap-2"
        >
          Book Now <ArrowRight size={16} />
        </button>

        {/* Secondary */}
        <button
          onClick={() => router.push(`services/${selectedService.title}`)}
          className="flex-1 bg-white text-[#424A2B] border border-[#8A9A5B]/30
          py-4 rounded-2xl font-black text-xs uppercase tracking-widest
          active:scale-[0.97] transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  )}
</div>

    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */
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
// import Image from 'next/image';
// import { Plus } from 'lucide-react'; // Optional: Use an icon library like lucide-react

function ServiceAppCard({ item }) {
  const dummyPrice = Math.round(item.price * 1.3);

  return (
    <div className="group relative flex w-full flex-col bg-white rounded-[1.75rem] border border-[#8A9A5B]/15 overflow-hidden transition-all duration-300 hover:shadow-[0_18px_40px_rgba(66,74,43,0.18)] hover:-translate-y-1 cursor-pointer h-full">

      {/* Image Section */}
      <div className="relative w-full aspect-square bg-[#f4f6ef] overflow-hidden">
        <Image
          src={item.image}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={item.name || item.title}
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#424A2B]/50 via-transparent to-transparent" />

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded-full text-[10px] font-black text-[#424A2B] shadow-sm flex items-center gap-1">
            <Star size={10} fill="#facc15" className="text-yellow-400" />
            {item.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between p-3">
        {/* Title */}
        <h3 className="text-[13px] font-bold text-[#2f3a1f] leading-snug line-clamp-2 min-h-[34px]">
          {item.name || item.title}
        </h3>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#9ca38b] line-through leading-none">
              ₹{dummyPrice}
            </span>
            <span className="text-[14px] font-black text-[#424A2B] leading-tight">
              ₹{item.price}
            </span>
          </div>

          {/* Add Button */}
          <button
            className="w-9 h-9 rounded-full bg-[#8A9A5B]/15 text-[#424A2B] flex items-center justify-center 
            group-hover:bg-[#8A9A5B] group-hover:text-white transition-all duration-300 shadow-sm active:scale-90"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Premium Accent Strip */}
      {/* <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#8A9A5B] to-transparent opacity-70" /> */}
    </div>
  );
}


 
function SectionTitle({ title }) {
  return (
    <div className="relative mt-0.5 mb-3 px-4">
      <div className="flex items-center justify-center">
        
        {/* Left Section: Typography focus */}
        <div className="flex flex-col">
          <div className="w-full flex items-center  justify-center gap-2 mb-0.5">
            {/* Minimalist Accent: A vertical pill instead of horizontal bars */}
            {/* <div className="w-1 h-6 bg-[#424a2b] text-center rounded-full" /> */}
            
            <h2 className="text-[29px] text-center font-bold text-grey-500  tracking-tight italic text-grey-900 ">
              {title}
            </h2>
          </div>

          {/* <div className="flex items-center gap-2 pl-3">
             <div className="flex -space-x-1">
                {[1, 2, 3,4].map((i) => (
                  <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <Star size={8} fill="#94a3b8" className="text-yellow-400" />
                  </div>
                ))}
             </div>
             <p className="text-[11px] text-slate-500 font-bold tracking-tight">
               4.8 <span className="text-slate-300 mx-1">•</span> 100+ Bookings
             </p>
          </div> */}
        </div>

        {/* Right Section: Interactive/Status element */}
        {/* <div className="flex flex-col items-end gap-1">
           <div className="bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-tight text-emerald-700">
               Best Price
             </span>
           </div>
           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded-md transition-colors">
              See All
           </button>
        </div> */}

      </div>

      {/* Optional: Subtle bottom divider that fades out */}
      {/* <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-slate-100 via-slate-50 to-transparent" /> */}
    </div>
  );
}

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
    />
  );
}

function HeaderSkeleton() {
  return (
    <header className="bg-[#8A9A5B] px-4 pt-4 pb-6 rounded-b-[2.5rem]">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-48 mb-4" />
      <Skeleton className="h-12 w-full rounded-xl bg-white/70" />
    </header>
  );
}
function ServicesGridSkeleton() {
  return (
    <section className="mt-4 px-4">
      <div className="max-w-md mx-auto p-3 bg-white rounded-[2.5rem] shadow-sm">
        <Skeleton className="h-6 w-40 mx-auto mb-6" />

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ServiceSectionSkeleton() {
  return (
    <section className="pt-4">
      {/* Section title */}
      <div className="px-4 mb-4 flex items-center gap-2">
        <Skeleton className="w-1 h-6 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-2.5 border border-gray-100"
          >
            <Skeleton className="w-full aspect-square rounded-xl mb-3" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function SparkySkeletonPage() {
  return (
    <div className="min-h-screen bg-white pb-3">
      <HeaderSkeleton />
      <ServicesGridSkeleton />
      <ServiceSectionSkeleton />
      <ServiceSectionSkeleton />
    </div>
  );
}
function SubCategoryPromo({ subCat }) {
  const data = promoData[subCat];

  if (!data || !data.layout) {
    return <div className="mx-4 h-2 bg-[#f8f9f5] rounded-full opacity-50" />;
  }

  /* LAYOUT 1: THE "YES MADAM" ARCH (Classic Screenshot Style) */
  if (data.layout === "arch-classic") {
    return (
      <div className="mx-2 mt-5 relative h-52 rounded-[2.5rem] bg-[#f9c27d] overflow-hidden border border-[#e0e5d2] shadow-sm group">
        <div className="absolute top-0 left-0 bg-[#a66d2d] text-white text-[10px] font-bold px-5 py-1.5 rounded-br-[1.5rem] z-20">
          {data.tag}
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center pl-8 w-1/2">
          <h4 className="text-[28px] font-black text-[#1a2421] leading-tight mb-2 tracking-tighter">
            {data.title}
          </h4>
          <p className="text-xl font-black text-[#1a2421]">@ ₹{data.price}</p>
          <button className="mt-4 w-32 bg-[#a66d2d] text-white py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition">
            Book Now
          </button>
        </div>
        <div className="absolute right-0 bottom-0 w-[60%] h-full">
           <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f9c27d] to-transparent z-10" />
           {/* Architectural Arch Shape */}
           <div className="absolute top-4 right-4 bottom-0 left-0 bg-white/20 rounded-t-full border-t-4 border-white/30" />
           <Image src={data.img} fill className="object-cover object-center translate-y-4" alt="promo" />
        </div>
      </div>
    );
  }

  /* LAYOUT 2: THE GLASS CARD (High-End Aesthetic) */
  if (data.layout === "glass-card") {
    return (
      <div className="mx-2 mt-5 relative h-48 rounded-[2.5rem] overflow-hidden border border-white/20 shadow-xl group">
        <Image src={data.img} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" alt="promo" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-[2rem]">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-black text-white leading-none uppercase tracking-tighter">{data.title}</h4>
              <p className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-widest">{data.tag}</p>
            </div>
            <div className="bg-[#f7b614] text-black h-10 w-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition">
              <ArrowRight size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* LAYOUT 3: BOLD SPLIT (High Conversion) */
  if (data.layout === "bold-split") {
    return (
      <div className="mx-2 mt-5 relative h-40 bg-[#1A2421] rounded-[2.5rem] overflow-hidden flex items-center group border-t-4 border-[#3A4D39]">
        <div className="flex-1 pl-8 pr-4 py-6 z-10">
          <span className="bg-[#f7b614] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block">Flash Deal</span>
          <h4 className="text-xl font-black text-white leading-tight italic">{data.title}</h4>
          <p className="text-white/60 text-[10px] mt-1 font-bold">Limited slots available nearby</p>
        </div>
        <div className="relative w-[45%] h-full skew-x-[-12deg] translate-x-6 border-l-8 border-[#3A4D39] overflow-hidden shadow-2xl">
          <Image src={data.img} fill className="object-cover unskew-x-[12deg] scale-125" alt="promo" />
        </div>
      </div>
    );
  }

  /* LAYOUT 4: ELEGANT MINIMAL (Focus on Cleanliness) */
  if (data.layout === "elegant-minimal") {
    return (
      <div className="mx-2 mt-5 h-36 rounded-[2rem] bg-white border border-[#E0E5D2] flex items-center p-2 shadow-sm">
        <div className="relative h-full aspect-square rounded-[1.5rem] overflow-hidden">
          <Image src={data.img} fill className="object-cover" alt="promo" />
        </div>
        <div className="flex-1 px-6">
          <p className="text-[10px] font-black text-[#4F6F52] tracking-[0.2em] uppercase mb-1">Saga Select</p>
          <h4 className="text-lg font-black text-[#1A2421] leading-none mb-2 tracking-tighter">{data.title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#3A4D39]">₹{data.price}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">Best Value</span>
          </div>
        </div>
        <div className="pr-4"><Plus className="text-[#3A4D39]" size={24} strokeWidth={3} /></div>
      </div>
    );
  }

  /* LAYOUT 5: FLOATING CIRCLE (Branded Geometric) */
  if (data.layout === "floating-circle") {
    return (
      <div className="mx-2 mt-5 h-32 bg-[#F5F7F2] rounded-[2.5rem] border border-[#dfe5d2] flex items-center overflow-hidden relative group">
        <div className="flex-1 pl-8">
          <h4 className="text-xl font-black text-[#1A2421] leading-tight italic">{data.title}</h4>
          <p className="text-[#4F6F52] font-black text-[10px] uppercase tracking-widest mt-1 opacity-70">{data.tag}</p>
        </div>
        <div className="relative h-full w-[45%] bg-[#3A4D39] rounded-l-full flex items-center justify-center border-l-8 border-white group-hover:w-[50%] transition-all duration-500">
           <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image src={data.img} fill className="object-cover" alt="promo" />
           </div>
        </div>
      </div>
    );
  }

  /* LAYOUT 6: SOFT GRADIENT (Calm & Soothing) */
  if (data.layout === "soft-gradient") {
    return (
      <div className="mx-2 mt-5 h-44 rounded-[2.5rem] bg-gradient-to-r from-[#edf1e5] to-[#f9fbf4] border border-white p-6 relative overflow-hidden flex flex-col justify-center">
        <div className="z-10 relative">
          <Star className="text-[#f7b614] mb-3" fill="#f7b614" size={20} />
          <h4 className="text-2xl font-black text-[#3A4D39] leading-tight tracking-tighter w-2/3">{data.title}</h4>
          <p className="text-[11px] font-bold text-gray-500 mt-2 uppercase tracking-widest">{data.tag}</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/40 blur-3xl rounded-full" />
        <div className="absolute right-4 bottom-4 w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
          <Image src={data.img} fill className="object-cover" alt="promo" />
        </div>
      </div>
    );
  }

  return null;
}
