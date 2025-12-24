"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  Loader2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/manicure.jpg", link: "/services/manicure" },
  { title: "Pedicure", price: 599, image: "/images/pedicure.jpg", link: "/services/pedicure" },
  { title: "Facial", price: 999, image: "/images/mpm.jpg", link: "/services/facial" },
  { title: "Waxing", price: 699, image: "/images/waxing.jpg", link: "/services/waxing" },
  { title: "Cleaning", price: 799, image: "/images/kc.jpg", link: "/services/cleaning" },
  { title: "Geyser Repair", price: 499, image: "/images/wm.jpg", link: "/services/geyser" },
];

export default function HeroCarousel() {
  const router = useRouter();
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const filtered = STATIC_SERVICES.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
    setOpen(true);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("touchstart", handler);
    return () => document.removeEventListener("touchstart", handler);
  }, []);

  return (
    <div className="md:hidden w-full pt-4 px-5 pb-8 bg-[#030712] flex flex-col font-sans">
      
      {/* 🔍 SEARCH ENGINE COMPONENT */}
      <div ref={searchRef} className="relative mb-6 z-50">
        <div className={`flex items-center gap-3 bg-[#111827]/60 backdrop-blur-xl rounded-2xl px-5 py-4 border transition-all duration-300 ${open ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/5'}`}>
          {loading ? (
            <Loader2 className="animate-spin text-blue-500" size={18} />
          ) : (
            <Search className="text-gray-400" size={18} />
          )}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setOpen(true)}
            placeholder="Search for 'Deep Cleaning'..."
            className="flex-1 bg-transparent outline-none text-white text-[15px] placeholder-gray-500 font-medium"
          />

          {query && (
            <button onClick={() => { setQuery(""); setOpen(false); }} className="p-1 hover:bg-white/10 rounded-full">
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* 🔽 FLOATING RESULTS ISLAND */}
        {open && results.length > 0 && (
          <div className="absolute w-full mt-3 bg-[#0f172a] rounded-[24px] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-white/5 bg-white/5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Suggestions</span>
            </div>
            {results.map((s) => (
              <div
                key={s.title}
                onClick={() => router.push(s.link)}
                className="flex items-center gap-4 p-4 hover:bg-white/5 active:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/10">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-white tracking-tight">{s.title}</p>
                  <p className="text-[12px] text-blue-400 font-semibold italic">Starts ₹{s.price}</p>
                </div>
                <ChevronRight size={16} className="text-gray-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎴 APP HERO CANVAS */}
      <div className="relative rounded-[36px] p-8 bg-[#0a0f1d] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        {/* Decorative Radial Gradient */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] -z-0 rounded-full" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400">
                <Zap size={14} fill="currentColor" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">Premium Care</p>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">Winter</h1>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
            <Sparkles className="text-yellow-400" size={24} />
          </div>
        </div>

        {/* SERVICE GRID (App Store Style) */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 relative z-10">
          {STATIC_SERVICES.slice(0, 6).map((s) => (
            <div
              key={s.title}
              onClick={() => router.push(s.link)}
              className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform duration-200"
            >
              <div className="relative w-full aspect-square rounded-[22px] overflow-hidden mb-3 shadow-xl ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
                <Image src={s.image} alt={s.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
              </div>
              <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-wider leading-none truncate w-full px-1">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* PRIMARY CALL TO ACTION */}
        {/* <div className="mt-10 relative z-10">
            <button
                onClick={() => router.push("/facial")}
                className="w-full py-5 rounded-[22px] bg-white text-[#030712] font-black text-[13px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                Explore Services 
                <div className="bg-black/5 p-1 rounded-full">
                    <ArrowRight size={16} strokeWidth={3} />
                </div>
            </button>
        </div> */}
      </div>
      
      {/* Footer micro-details */}
      {/* <div className="mt-6 flex justify-center items-center gap-6 opacity-30">
          <span className="text-[9px] font-bold text-white uppercase tracking-widest">Secure Payments</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full" />
          <span className="text-[9px] font-bold text-white uppercase tracking-widest">Verified Pros</span>
      </div> */}
    </div>
  );
}