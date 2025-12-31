"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Search,
  Mic,
  MapPin,
  User,
  ChevronDown,
  Clock,
  Sparkles,
  Scissors,
  Wrench,
  X,
  Star,
  ArrowRight,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ================= DATA ================= */

const CATEGORIES = [
  { name: "Beauty", icon: <Sparkles size={20} />, ref: "beautyRef" },
  { name: "Beatique", icon: <Scissors size={20} />, ref: "beatiqueRef" },
  { name: "Technical", icon: <Wrench size={20} />, ref: "techRef" },
];

const CRAZY_DEAL = {
  name: "Gold Facial",
  originalPrice: "₹1,875",
  price: 999, // Changed to number for logic
  image: "/images/goldfacial.jpg",
  discount: "45% OFF",
  link: "/services/facial"
};

const QUICK_SERVICES = [
  { title: "Suit Stitching", discount: "30% OFF", image: "/images/stitching.jpg", price: 1299, link: "/services/stitching" },
  { title: "AC Repair", discount: "₹200 OFF", image: "/images/crazyAc.avif", price: 499, link: "/services/ac-repair" },
  { title: "Deep Cleanup", discount: "50% OFF", image: "/images/deepc.webp", price: 799, link: "/services/cleaning" },
  { title: "Manicure", discount: "Starts ₹199", image: "/images/mpm.jpg", price: 199, link: "/services/manicure" },
];

const BESTSELLERS = [
  { id: 1, name: "Manicure", image: "/images/mpm.jpg", count: "+120 more", price: 499, link: "/services/manicure",category:"Woman Services" },
  { id: 2, name: "Plumbing", image: "/images/plumbing.jpg", count: "+80 more", price: 299, link: "/services/plumbing" },
  { id: 3, name: "Makeup", image: "/images/makeup.jpg", count: "+150 more", price: 1499, link: "/services/makeup" ,category:"Woman Services" },
];

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/mpm.jpg", link: "/services/manicure",category:"Woman Services" },
  { title: "Pedicure", price: 599, image: "/images/vee.jpg", link: "/services/pedicure",category:"Woman Services" },
  { title: "Facial", price: 999, image: "/images/vee2.jpg", link: "/services/facial",category:"Woman Services" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/services/waxing",category:"Woman Services" },
  { title: "Cleaning", price: 799, image: "/images/cleanup.jpg", link: "/services/cleaning" },
  { title: "AC Repair", price: 499, image: "/images/ac.jpg", link: "/services/ac-repair" },
];

/* ================= PAGE ================= */

export default function SparkyServiceApp() {
  const beautyRef = useRef(null);
  const beatiqueRef = useRef(null);
  const techRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const [services, setServices] = useState([]);
const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

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
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  // Helper function to add to cart and redirect
  const handleBooking = (service) => {
    // 1. Prepare the item object
    const itemToAdd = {
      title: service.name || service.title,
      price: typeof service.price === 'string' ? parseInt(service.price.replace('₹', '')) : service.price,
      image: service.image,
      quantity: 1,
      category:service.category
      
    };
 console.log(itemToAdd);
    // 2. Get existing cart or initialize
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // 3. Add to cart
    existingCart.push(itemToAdd);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // 4. Redirect to checkout
    router.push("/checkout");
  };

  // Search Logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const filtered = STATIC_SERVICES.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
    setOpen(true);
  }, [query]);

  // Handle Search Outside Click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Page Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-[#edf4ff] text-[#111827] pb-32 font-sans overflow-x-hidden">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#030712] via-[#a3b7d6] to-[#edf4ff] backdrop-blur-md border-b border-blue-50 px-4 pt-4 pb-3 space-y-3">
        {/* <div className="flex justify-between items-center">
          <Link href="/" className="active:scale-95 transition-transform">
            <Image src="/images/wLogo.png" alt="Logo" width={110} height={28} />
          </Link>
          <div className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
            <User size={18} className="text-gray-600" />
          </div>
        </div> */}

        {/* Search Bar */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center bg-gray-50  rounded-2xl px-4 py-3 ">
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

          {open && results.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              {results.map((s) => (
                <div key={s.title} onClick={() => { setSelectedService(s); setOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border">
                    <Image src={s.image} alt={s.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{s.title}</p>
                    <p className="text-xs text-blue-500 font-semibold text-">Starts ₹{s.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Icons */}
        <div className="flex gap-6 justify-center overflow-x-auto no-scrollbar pt-2">
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
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="px-4 space-y-8 pt-6">
        
        {/* Crazy Deals Section */}
        <div className="grid grid-cols-12 gap-3 h-72">
          <div onClick={() => setSelectedService(CRAZY_DEAL)} className="col-span-5 bg-blue-100 p-5 relative overflow-hidden shadow-sm border border-blue-200 cursor-pointer rounded-3xl">
            {/* <span className="bg-white/80 backdrop-blur-sm text-blue-700 text-[10px] font-black px-3  rounded-full">CRAZY DEAL</span>
            <div className=" ml-7.5  relative z-10">
              <p className="text-2xl font-black tracking-tighter text-blue-900">₹{CRAZY_DEAL.price}</p>
              <p className="text-xs line-through text-blue-900/50 font-bold">{CRAZY_DEAL.originalPrice}</p>
              <p className="text-sm font-black mt-1 leading-tight">{CRAZY_DEAL.name}</p>
            </div> */}
            <div className="absolute bottom-0 right-0 w-full h-full">
              <Image src={CRAZY_DEAL.image} fill className="object-cover object-top" alt="" />
            </div>
          </div>

          <div className="col-span-7 grid grid-cols-2 gap-3">
            {QUICK_SERVICES.map((d, i) => (
              <div key={i} onClick={() => setSelectedService(d)} className="bg-gray-50 border border-gray-100 rounded-3xl  relative flex flex-col justify-between overflow-hidden cursor-pointer active:scale-95 transition-all">
                {/* <span className="absolute top-2 right-2 bg-white/90 text-[8px] font-black px-2 py-1 rounded-lg border border-gray-100">{d.discount}</span>
                <p className="text-[11px] font-black leading-tight pr-4">{d.title}</p> */}
                <div className=" w-full h-full relative">
                  <Image src={d.image} fill className="object-cover rounded-xl shadow-sm" alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Sections */}
<section ref={beautyRef} className="pt-2">
  <SectionTitle title="Beauty Services" />

  <div className="grid grid-cols-3 gap-3">
    {services
      .filter(item => item.category === "Woman Services")
      .map(item => (
        <div key={item.id} onClick={() => setSelectedService(item)}>
          <ServiceAppCard item={item} />
        </div>
      ))}
  </div>
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

        <section ref={techRef} className="pt-4">
          <SectionTitle title="Tech Masters" />
          <div className="grid grid-cols-3 gap-3">
            {BESTSELLERS.map((item) => (
              <div key={item.id} onClick={() => setSelectedService(item)}>
                <ServiceAppCard item={item} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= BOTTOM SLIDE DRAWER ================= */}
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
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
                  Indulge in a premium service experience. Our certified professionals ensure top-tier hygiene and salon-grade results in the comfort of your home. 
                </p>
                <div className="flex gap-4">
                  <button onClick={() => handleBooking(selectedService)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    Book Now <ArrowRight size={16} />
                  </button>
                  <button onClick={() => {  router.push(`services/${selectedService.title}`) }} className="flex-1 bg-gray-50 text-gray-800 border border-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all">
                    View Info
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center gap-4">
        <Image src="/images/wLogo.png" alt="Logo" width={160} height={48} />
        <div className="w-54 h-1 bg-blue-100 rounded-full overflow-hidden">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }} className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Data...</span>
      </motion.div>
    </div>
  );
}

function ServiceAppCard({ item }) {
  return (
    <div className="bg-white rounded-[2rem] p-2 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center active:scale-95 transition-all cursor-pointer">
      <div className="w-full aspect-square relative mb-3 overflow-hidden rounded-[1.5rem] border border-gray-50">
        <Image src={item.image} fill className="object-cover" alt={item.name} />
      </div>
      <span className="text-[11px] font-black text-gray-800 text-center truncate w-full mb-1 px-1 leading-tight">{item.title}</span>
      <div className="bg-blue-50 text-blue-600 rounded-full py-0.5 px-2 text-[8px] font-black uppercase tracking-tighter">{item.price}</div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex justify-between items-end mb-4 px-1">
      <h2 className="text-lg font-black tracking-tighter text-gray-900">{title}</h2>
      <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1 border-b-2 border-blue-600/10">See All</span>
    </div>
  );
}

function NavIcon({ icon, label, active }) {
  return (
    <div className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-blue-600" : "text-gray-400"}`}>
      {icon}
      <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
    </div>
  );
}