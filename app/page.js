"use client";

import Image from "next/image";
import Link from "next/link";
import FloatingOrderTracker from "@/components/FloatingOrderTracker";

import { useRef, useState, useEffect } from "react";
import {
  Search,
  Mic,
  MapPin,
  User,
  ChevronDown,
  Clock,
  Sparkles,
  
  Wrench,
  X,
  Star,
  ArrowRight,
  LayoutGrid,
  Scissors, 
  
  Palette, 
  Wind, 
  Waves, 
  Zap, 
  Smile, 
  MessageCircle
} from "lucide-react";

import { useRouter } from "next/navigation";
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
  { id: 1, name: 'Haircut', icon: Scissors },
  { id: 2, name: 'Nails', icon: Zap },
  { id: 3, name: 'Facial', icon: Sparkles },
  { id: 4, name: 'Coloring', icon: Palette },
  { id: 5, name: 'Spa', icon: Waves },
  { id: 6, name: 'Waxing', icon: Wind },
  { id: 7, name: 'Makeup', icon: Smile },
  { id: 8, name: 'Message', icon: MessageCircle },
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

export default function SparkyServiceApp() {
  
  const beautyRef = useRef(null);
  const beatiqueRef = useRef(null);
  const techRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const [orders, setorders] = useState([])
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selected, setSelected] = useState(null);
  const active = orders.find(order => 
   order.status !== 'cancelled' && order.status !== 'completed'
   );

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
// Filter for orders that are neither 'cancelled' nor 'completed'
   
  const handleBooking = (service) => {
    const itemToAdd = {
      title: service.name || service.title,
      price: typeof service.price === 'string' ? parseInt(service.price.replace('₹', '')) : service.price,
      image: service.image,
      quantity: 1,
      category: service.category,
      earning:service.earning,
      profit:service.profit,
    };
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(itemToAdd);
    localStorage.setItem("cart", JSON.stringify(existingCart));
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

  if (loading) return <PageLoader />;
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
    <div className="min-h-screen bg-[#edf4ff] text-[#111827] pb-32 font-sans overflow-x-hidden">
       
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#101a3c] via-[#a3b7d6] to-[#edf4ff] backdrop-blur-md  px-4 pt-4 pb-3 space-y-3">
        <div ref={searchRef} className="relative">
          <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 1 && setOpen(true)}
              placeholder="Search for services..."
              className="flex-1 bg-transparent outline-none text-sm font-medium"
            />
            {query && (
              <button onClick={() => { setQuery(""); setOpen(false); }} className="p-1 text-gray-400">✕</button>
            )}
          </div>

          {/* Search Dropdown with CSS Transition */}
     <div
  className={`absolute z-50 w-full mt-3 bg-white rounded-2xl border border-gray-100
  shadow-[0_16px_40px_rgba(0,0,0,0.12)]
  transition-all duration-200 origin-top
  ${
    open
      ? "opacity-100 scale-100 translate-y-0 visible"
      : "opacity-0 scale-95 -translate-y-2 invisible"
  }`}
>
  {results.length > 0 ? (
    <div className="max-h-[420px] overflow-y-auto overscroll-contain">
      {results.map((s, index) => (
        <div
          key={s.id || s.title || index}
          onClick={() => {
            setSelectedService(s);
            setOpen(false);
            setQuery("");
          }}
          className="group flex items-center gap-4 px-4 py-3 cursor-pointer
          hover:bg-blue-50 transition-colors
          border-b border-gray-100 last:border-0"
        >
          {/* Image */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={s.image || "/images/placeholder.jpg"}
              alt={s.name || s.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Title + Category */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {s.name || s.title}
            </p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5 truncate">
              {s.category}
            </p>
          </div>

          {/* Price + Arrow */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-bold text-blue-600">
              ₹{s.price}
            </span>
            <ArrowRight
              size={16}
              className="text-gray-900 group-hover:text-blue-600 transition-colors"
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    /* No Results */
    <div className="px-6 py-10 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Search size={18} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-800">
        No services found
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Try searching for <span className="font-semibold">Facial</span> or{" "}
        <span className="font-semibold">AC</span>
      </p>
    </div>
  )}
</div>

        </div>

        {/* <div className="flex gap-6 justify-center overflow-x-auto no-scrollbar pt-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => scrollTo(c.ref)}
              className="flex flex-col items-center gap-2 min-w-[64px] active:scale-90 transition-transform group"
            >
              <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                <div className="text-blue-600">{c.icon}</div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-blue-600">
                {c.name}
              </span>
            </button>
          ))}
        </div> */}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="px-4 space-y-8 pt-2 ">
  
        <div className="max-w-md mx-auto p-6 bg-white h-[50%] rounded-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-8">
        What do you want to do?
      </h2>

      <div className="grid grid-cols-4 gap-y-8 gap-x-4">
        {want.map((service) => {
          const IconComponent = service.icon;
          const isActive = selected === service.id;

          return (
           <button
  key={service.id}
  onClick={() => handleWantClick(service.name)} // Changed this
  className="flex flex-col items-center group outline-none"
>
              {/* Icon Circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "bg-[#101a3c] text-white scale-110 shadow-lg" 
                  : "bg-cyan-50 text-grey-700 group-hover:bg-cyan-100"
              }`}>
                <IconComponent size={32} strokeWidth={1.5} />
              </div>
              
              {/* Label */}
              <span className={`mt-2 text-[11px] font-bold tracking-tight transition-colors ${
                isActive ? "text-[#101a3c]" : "text-grey-800"
              }`}>
                {service.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>


        <section ref={beautyRef} className="pt-2">
  <SectionTitle title="BEAUTY SERVICES" />
  <FloatingOrderTracker activeOrder={active} />
  {/* We define the sub-categories we want to extract */}
  {["Waxing", "Facial", "Spa", "Haircut", "Nails", "Makeup"].map((subCat) => {
    // Filter services that belong to "Woman Services" AND match the sub-category name
    const filteredServices = services.filter(
      (item) =>
        item.category === "Woman Services" &&
        (item.name || item.title || "").toLowerCase().includes(subCat.toLowerCase())
    );

    // Only render the sub-section if we actually found matching services in the DB
    if (filteredServices.length === 0) return null;

    return (
      <div key={subCat} className="mb-8">
        <h3 className="px-4 mb-3 text-sm font-bold text-[#101a3c] uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-400 rounded-full" />
          {subCat}
        </h3>
        
        <div className="grid grid-cols-3 gap-3 px-1">
          {filteredServices.map((item) => (
            <div key={item.id} onClick={() => setSelectedService(item)}>
              <ServiceAppCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  })}
</section>

        <section ref={beatiqueRef} className="pt-4">
          <SectionTitle title="The Beatique" />
          <div className="grid grid-cols-3 gap-3">
            {BESTSELLERS.map((item) => (
              <div key={item.id} onClick={() => setSelectedService(item)}>
                <ServiceAppCard item={item} />
              </div>
            ))}
          </div>
        </section>

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
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-300 ease-out transform ${selectedService ? "translate-y-0" : "translate-y-full"}`}>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
        
        {selectedService && (
          <div className="px-6 pb-8 pt-2">
            <div className="relative w-full h-64 rounded-3xl overflow-hidden mb-6 shadow-md border border-gray-100">
              <Image src={selectedService.image} fill className="object-cover" alt="Detail" />
              <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg">
                <X size={20} className="text-gray-800" />
              </button>
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedService.name || selectedService.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 text-sm font-bold text-gray-600">4.9</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm font-bold text-blue-600 tracking-wide uppercase text-[10px]">Verified Expert</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-600 tracking-tighter">₹{selectedService.price || "799"}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[9px]">Base Price</p>
              </div>
            </div>
            
            <p className="text-gray-500 leading-relaxed mb-8 font-medium text-sm">
              Indulge in a premium service experience. Our certified professionals ensure top-tier hygiene and salon-grade results.
            </p>
            
            <div className="flex gap-4">
              <button onClick={() => handleBooking(selectedService)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Book Now <ArrowRight size={16} />
              </button>
              <button onClick={() => { router.push(`services/${selectedService.title}`) }} className="flex-1 bg-gray-50 text-gray-800 border border-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all">
                View Info
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
  return (
    <div className="group relative flex w-full h-[200px] flex-col gap-3 bg-white p-3 rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer">
      
      {/* Image Container with Zoom Effect */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image 
          src={item.image} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={item.name || item.title} 
        />
        
        {/* Optional: Floating Badge for Rating or Tag */}
        {item.rating && (
           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
             ★ {item.rating}
           </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-1">
        {/* Title */}
        <h3 className="text-sm font-semibold text-blue-900 line-clamp-2 leading-tight">
          {item.title}
        </h3>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-xs text-red-400 font-medium">at Just</span>
            <span className="text-sm font-bold text-blue-900">₹{item.price}</span>
          </div>
          
          {/* subtle 'Add' button visual */}
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-colors group-hover:bg-black group-hover:text-white">
          
            <span className="text-lg leading-none mb-0.5">+</span> 
          </div> */}
        </div>
      </div>
    </div>
  );
}

 
function SectionTitle({ title }) {
  return (
    <div className="flex justify-between items-end mb-5 px-4">
      <div className="flex flex-col">
        {/* Subtle Accent Line */}
        <div className="w-8 h-[3px] bg-blue-500 rounded-full mb-1.5 opacity-80" />
        
        <h2 className="text-[20px] font-black text-gray-800 leading-none tracking-tight">
          {title}
        </h2>
      </div>

      {/* Re-enabled 'See All' with better styling */}
      {/* <button className="flex items-center group">
        <span className="text-[12px] font-extrabold text-blue-400 uppercase tracking-[0.05em] transition-colors group-hover:text-blue-300">
          See All
        </span>
        <svg 
          className="w-3.5 h-3.5 ml-1 text-blue-400 transition-transform group-hover:translate-x-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button> */}
    </div>
  );
}