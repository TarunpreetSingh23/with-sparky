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
  AlertTriangle,
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
  { id: 4, name: 'Bleach', icon: Palette,image:"/images/bleach.png" },
  { id: 5, name: 'Cleanup', icon: Waves,image:"/images/cleanup.png" },
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
const mainbg = "#f8f8f6";       // Light Sage Grey (Sophisticated depth)
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
  const [servicesLoading, setServicesLoading] = useState(true);
const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selected, setSelected] = useState(null);
  const [minCartError, setMinCartError] = useState("");
const AMRITSAR_BOUNDS = [
  { lat: 31.670068, lng: 74.862815 },
  { lat: 31.657253, lng: 74.919065 },
  { lat: 31.596597, lng: 74.877805 },
  { lat: 31.630555, lng: 74.779767 },
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
      }finally {
  setServicesLoading(false);
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
  setOrdersLoading(false);
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

 const MIN_CART_VALUE = 299;

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
if (servicesLoading || services.length === 0) {
  return <SparkySkeletonPage />;
}

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
    <div className="min-h-screen bg-white flex justify-center">
  <div
    className="
      w-full 
      max-w-[430px] 
      min-h-screen 
      bg-[#f8fafc] 
      shadow-[0_0_60px_rgba(0,0,0,0.08)]
      relative
      overflow-hidden
    "
  >
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
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Not Serving In Your Area</h2>
                    <p className="text-slate-400 text-base max-w-[280px]">Sparky currently only serves the heart of <span className="text-blue-400 font-extrabold underline decoration-blue-500/30">Amritsar</span>.</p>
                    <button onClick={() => setOutOfBounds(false)} className="mt-12 px-7 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl active:scale-95 shadow-xl">
                      Back
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
                    : "bg-[#8a9a5b] text-white shadow-2xl active:scale-95"
                }`}
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= HEADER ================= */}
  <header
  className="
    relative
    px-4 pt-3 pb-5
    rounded-b-[2.2rem]
    bg-gradient-to-br from-[#6f7f46] to-[#8a9a5b]
    shadow-[0_18px_40px_rgba(0,0,0,0.35)]
    
  "
>
  {/* Soft 3D highlight */}
  <div className="absolute inset-0 bg-gradient-to-t rounded-b-[2.2rem] from-black/25 via-transparent to-white/10 pointer-events-none" />

  {/* TOP ROW */}
  <div
    onClick={() => setShowMap(true)}
    className="relative z-10 flex items-center justify-between text-white cursor-pointer mb-3"
  >
    {/* LEFT — LOCATION */}
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative">
        <div className="absolute inset-0 bg-white/40 blur-md rounded-full" />
        <div className="relative w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
          <MapPin size={14} className="text-[#1f4637]" />
        </div>
      </div>

      <div className="flex flex-col leading-none min-w-0">
        <span className="text-[12px] font-medium tracking-wide">
          Home
        </span>
        <span className="text-[10px] text-white/80 truncate max-w-[160px]">
          {address}
        </span>
      </div>
    </div>

    {/* RIGHT — BRAND */}
    <div className="flex flex-col items-end leading-none">
      <span className="text-[14px] font-semibold tracking-[0.25em]">
        SPARKY
      </span>
      {/* <span className="text-[9px] text-white/70 tracking-widest">
        in 40 mins
      </span> */}
    </div>
  </div>

  {/* SEARCH */}
<div ref={searchRef} className="relative z-10">
  {/* SEARCH BAR */}
  <div className="flex items-center bg-white/95 rounded-full px-3 py-2 border border-white/30 shadow backdrop-blur-md">
    <Search size={14} className="text-gray-400 mr-2" />
    <input
      placeholder="Search services"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="flex-1 bg-transparent outline-none text-[12px] text-gray-800"
    />
    {query && (
      <X
        size={12}
        className="text-gray-400 cursor-pointer"
        onClick={() => setQuery("")}
      />
    )}
  </div>

  {/* DROPDOWN */}
  {open && results.length > 0 && (
    <div className="absolute top-full mt-2 w-full bg-white rounded-[1.6rem] shadow-xl z-[999] overflow-hidden">
      {results.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            setQuery("");
            setOpen(false);
            setSelectedService(item);
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          <Image
            src={item.image || "/images/placeholder.jpg"}
            width={40}
            height={40}
            className="rounded-xl object-cover"
            alt=""
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">{item.name || item.title}</p>
            <p className="text-xs text-gray-400">{item.category}</p>
          </div>
          <span className="font-bold text-sm">₹{item.price}</span>
        </div>
      ))}
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
      <main className="px-2 space-y-8 pt-0.5 ">


   <section className="mt-2 px-3">
  <div className="
    max-w-md mx-auto
    p-3.5
    rounded-3xl
    bg-gradient-to-b from-white via-[#fbfcfa] to-[#f2f4ed]
    border border-[#f1f3eb]
    shadow-[0_15px_40px_rgba(0,0,0,0.05)]
  ">

    {/* Heading */}
    <div className="text-center mb-6">
      <h2 className="
        text-[24px]
        font-serif
        italic
        tracking-tight
        bg-gradient-to-r from-[#1A2421] to-[#3A4D39]
        bg-clip-text text-transparent
      ">
        Our Services
      </h2>

      <div className="mx-auto mt-1 w-12 h-[2px]
        bg-gradient-to-r from-[#8A9A5B] to-[#6f7f46]
        rounded-full opacity-70"
      />
    </div>

    {/* Grid */}
    <div className="grid grid-cols-4 gap-4">

      {want.map((cat, i) => (
        <button
          key={i}
          onClick={() => handleWantClick(cat.name)}
          className="group flex flex-col items-center gap-2"
        >
          {/* Image Tile */}
          <div className="
            relative w-full aspect-square
            rounded-2xl overflow-hidden
            bg-gradient-to-br from-[#ebf3d2] to-[#dfe9b9]
            border border-[#e5ead7]
            shadow-[0_8px_18px_rgba(0,0,0,0.06)]
            group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]
            transition-all duration-300
          ">
            <Image
              src={cat.image || "/images/sremovebg.png"}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              alt={cat.name}
            />

            {/* subtle overlay shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-40" />
          </div>

          {/* Label */}
          <span className="
            text-[12px]
            font-medium
            text-center
            text-[#1A2421]
            tracking-tight
          ">
            {cat.name}
          </span>
        </button>
      ))}

    </div>

  </div>
</section>


{minCartError && (
  <div
    className="fixed bottom-13 left-1/2 -translate-x-1/2 z-[100]
    w-[90%] max-w-xs
    bg-white/70 backdrop-blur-2xl
    border border-white/40
    shadow-[0_10px_40px_rgba(0,0,0,0.12)]
    rounded-2xl px-4 py-3
    flex items-center gap-3
    animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    {/* Gradient 3D Icon */}
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-xl
        bg-gradient-to-br from-[#8a9a5b] via-[#7f8f52] to-[#6f7f46]
        flex items-center justify-center
        text-white text-sm font-semibold
        shadow-md shadow-blue-300/40"
      >
        ₹
      </div>
    </div>

    {/* Text */}
    <div className="flex-1">
      <p className="text-xs font-semibold text-gray-900 leading-tight">
         <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#8a9a5b] via-[#7f8f52] to-[#6f7f46] font-bold">
          {minCartError}
        </span> more
      </p>
      <p className="text-[10px] text-gray-500 font-medium">
        to proceed to checkout
      </p>

      {/* Minimal Progress */}
      <div className="mt-2 h-[3px] w-full bg-gray-200/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-br from-[#8a9a5b] via-[#7f8f52] to-[#6f7f46]transition-all duration-700 ease-out rounded-full"
          style={{ width: "70%" }} 
        />
      </div>
    </div>
  </div>
)}

<section ref={beautyRef} className="pt-1">
  {/* <SectionTitle title="Beauty Services" /> */}
  <FloatingOrderTracker activeOrder={active} />

  {[
    "Waxing","Facial","Mehandi","Haircare","Threading",
    "Makeup","Bleach","Cleanup","Manicure","Pedicure","Hair","Mehndi"
  ].map((subCat) => {
    const filteredServices = services.filter(
      (item) =>
        item.category === "Woman Services" &&
        (item.name || item.title || "")
          .toLowerCase()
          .includes(subCat.toLowerCase())
    );

    if (filteredServices.length === 0) return null;
    const displayServices = filteredServices.slice(0, 3);

    return (
      <div key={subCat} className="mb-12">

        {/* 🌷 CATEGORY HEADER */}
        <div className="flex items-center justify-between px-4 mb-4">
          <h3
            className="
              flex items-center gap-3
              text-[14px]
              font-serif italic
              tracking-tight
              text-[#1A2421]
            "
          >
            <span
              className="
                w-1.5 h-6 rounded-full
                bg-gradient-to-b from-[#8A9A5B] to-[#6f7f46]
                shadow-[0_2px_6px_rgba(0,0,0,0.25)]
              "
            />
            {subCat}
          </h3>

       {/* <button
  onClick={() =>
    router.push(`/beauty?category=${subCat.toUpperCase()}`)
  }
  className="
    text-[8px] 
    font-black
    uppercase
    tracking-[0.12em]
    px-2 py-0.5
    rounded-full
    bg-white/80
    border border-[#8A9A5B]/20
    text-[#3A4D39]
    shadow-[0_1px_4px_rgba(0,0,0,0.05)]
    active:scale-90
    transition-all
    duration-200
  "
>
  View all
</button>  */}
<button 
            onClick={() => router.push(`/beauty?category=${subCat.toUpperCase()}`)}
            className="flex items-center gap-1 bg-[#3A4D39]/5 text-[#3A4D39]  px-3 py-1.5 rounded-full border border-[#3A4D39]/10 active:scale-95 transition-all"
          >
            <span className="text-[9px] font-black uppercase tracking-widest">View All</span>
            {/* <ChevronRight size={12} strokeWidth={3} /> */}
          </button>
        </div>

        {/* 🧊 SERVICES GRID */}
        <div className="grid grid-cols-3 gap-3 px-2">
          {displayServices.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedService(item)}
              className="
                transform-gpu
                transition
                hover:-translate-y-[2px]
              "
            >
              <ServiceAppCard item={item} />
            </div>
          ))}
        </div>

        {/* 🌈 SUBCATEGORY PROMO */}
        {/* <div className="mt-6 px-2">
          <SubCategoryPromo subCat={subCat} />
        </div> */}
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
  className={`fixed 
    bottom-0 
    left-1/2 
    -translate-x-1/2
    w-full
    max-w-[430px]
    z-[70]
    bg-gradient-to-b from-[#ffffff] via-[#fbfcf8] to-[#f4f6ef]
    rounded-t-[2.75rem]
    shadow-[0_-18px_45px_rgba(66,74,43,0.22)]
    overflow-hidden
    transition-transform duration-300 ease-out transform
    ${selectedService ? "translate-y-0" : "translate-y-full"}`}
>
  {/* Drag Handle */}
  <div className="w-10 h-1.5 bg-[#8A9A5B]/40 rounded-full mx-auto mt-3 mb-3" />

  {selectedService && (
    <div className="px-6 pb-7 pt-1">

      {/* Image */}
      <div className="relative w-full h-56 rounded-[1.9rem] overflow-hidden mb-5
        shadow-[0_12px_28px_rgba(0,0,0,0.18)]
        border border-white/60"
      >
        <Image
          src={selectedService.image}
          fill
          className="object-cover"
          alt="Service Detail"
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-white/10" />

        {/* Close */}
        <button
          onClick={() => setSelectedService(null)}
          className="
            absolute top-3 right-3
            bg-white/80 backdrop-blur
            p-2 rounded-full
            shadow-md
            active:scale-90 transition
          "
        >
          <X size={16} className="text-[#2f3a1f]" />
        </button>
      </div>

      {/* Title + Price */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-[20px] font-semibold text-[#2f3a1f] leading-snug tracking-tight">
            {selectedService.name || selectedService.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-yellow-500">
              <Star size={13} fill="currentColor" />
              <span className="ml-1 text-[12px] font-semibold text-[#424A2B]">
                4.9
              </span>
            </div>

            <span className="text-[#8A9A5B]">•</span>

            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8A9A5B]">
              Verified
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[22px] font-semibold text-[#424A2B] tracking-tight">
            ₹{selectedService.price || "799"}
          </p>
          <p className="text-[9px] text-[#8A9A5B] uppercase tracking-widest">
            Base
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#5f6b4a] leading-relaxed mb-6 font-normal text-[13px]">
        {selectedService.description ||
          "Premium at-home service delivered by trained professionals using hygienic, salon-grade products."}
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        {/* Primary */}
        <button
          onClick={() => handleBooking(selectedService)}
          className="
            flex-1
            py-3.5
            rounded-xl
            bg-gradient-to-br from-[#8A9A5B] to-[#6f7f46]
            text-white
            text-[11px]
            font-semibold
            uppercase tracking-widest
            shadow-[0_8px_20px_rgba(138,154,91,0.45)]
            active:scale-[0.97]
            transition-all
            flex items-center justify-center gap-2
          "
        >
          Book Now<ArrowRight size={14} />
        </button>

        {/* Secondary */}
        <button
          onClick={() => router.push(`services/${selectedService.title}`)}
          className="
            flex-1
            py-3.5
            rounded-xl
            bg-white
            text-[#424A2B]
            border border-[#8A9A5B]/30
            text-[11px]
            font-semibold
            uppercase tracking-widest
            shadow-sm
            active:scale-[0.97]
            transition-all
          "
        >
          Details
        </button>
      </div>
    </div>
  )}
</div>

    </div>
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
    <div
      className="
        group relative flex w-full flex-col
        rounded-[1.9rem]
        bg-gradient-to-b from-white via-[#fbfcf7] to-[#f1f4ea]
        border border-[#8A9A5B]/20
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(138,154,91,0.25)]
        cursor-pointer
        h-full
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={item.image}
          fill
          className="
            object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
          alt={item.name || item.title}
        />

        {/* Feminine soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6f7f46]/45 via-transparent to-white/10" />

        {/* Rating Badge */}
        {item.rating && (
          <div
            className="
              absolute top-2.5 right-2.5
              bg-white/85 backdrop-blur
              px-2.5 py-1
              rounded-full
              text-[10px]
              font-semibold
              text-[#424A2B]
              shadow-md
              flex items-center gap-1
            "
          >
            <Star size={10} fill="#facc15" className="text-yellow-400" />
            {item.rating}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 justify-between px-3.5 py-3">
        {/* TITLE */}
        <h3
          className="
            text-[13px]
            font-semibold
            text-[#2f3a1f]
            leading-snug
            line-clamp-2
            min-h-[34px]
            tracking-tight
          "
        >
          {item.name || item.title}
        </h3>

        {/* PRICE + ACTION */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#b2b9a3] line-through leading-none">
              ₹{dummyPrice}
            </span>
            <span className="text-[14px] font-semibold text-[#3A4D39] leading-tight">
              ₹{item.price}
            </span>
          </div>

          {/* ADD BUTTON — feminine 3D */}
          <button
            className="
              w-9 h-9 rounded-full
              bg-gradient-to-br from-[#8A9A5B]/25 to-[#6f7f46]/25
              text-[#3A4D39]
              flex items-center justify-center
              shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.15)]
              transition-all duration-300
              group-hover:from-[#8A9A5B] group-hover:to-[#6f7f46]
              group-hover:text-white
              active:scale-90
            "
          >
            <Plus size={15} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* Subtle luxury accent */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8A9A5B]/60 to-transparent opacity-70" />
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
    <div className="min-h-screen bg-white flex justify-center">
      <div
        className="
          w-full
          max-w-[430px]
          min-h-screen
          bg-white
          pb-3
          relative
          overflow-hidden
          shadow-[0_0_60px_rgba(0,0,0,0.08)]
        "
      >
        <HeaderSkeleton />
        <ServicesGridSkeleton />
        <ServiceSectionSkeleton />
        <ServiceSectionSkeleton />
      </div>
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