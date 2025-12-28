"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Mic,
  ChevronDown,
  User,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATIC_SERVICES = [
  { title: "Manicure", price: 499, image: "/images/vee5.jpg", link: "/services/manicure" },
  { title: "Pedicure", price: 599, image: "/images/mpm.jpg", link: "/services/pedicure" },
  { title: "Facial", price: 999, image: "/images/vee2.jpg", link: "/services/facial" },
  { title: "Waxing", price: 699, image: "/images/wm.jpg", link: "/services/waxing" },
  { title: "Cleaning", price: 799, image: "/images/kc.jpg", link: "/services/cleaning" },
  { title: "Geyser Repair", price: 499, image: "/images/massage.jpeg", link: "/services/geyser" },
];

const CATEGORIES = [
  { name: "All", icon: "🧺" },
  { name: "Winter", icon: "❄️" },
  { name: "Electronics", icon: "🎧" },
  { name: "Beauty", icon: "💄" },
  { name: "Decor", icon: "🏠" },
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

  return (
    <div className="md:hidden w-full min-h-screen bg-white flex flex-col font-sans">
      
      {/* 📍 HEADER COMPONENT */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-tight">Sparky in</span>
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-black italic">15 minutes</h1>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 mt-0.5">
              <span className="uppercase">HOME</span>
              <span className="text-gray-300">-</span>
              <span className="truncate max-w-[150px]">Tarun, Gs colony gali no...</span>
              <ChevronDown size={14} className="text-gray-800" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User size={20} />
            </div>
          </div>
        </div>

        {/* 🔍 SEARCH COMPONENT */}
        <div ref={searchRef} className="relative z-50">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={18} />
            ) : (
              <Search className="text-gray-400" size={18} />
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search "Deep Cleaning"...'
              className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] placeholder-gray-400 font-medium"
            />
            <Mic className="text-gray-400" size={18} />
          </div>

          {/* SUGGESTIONS OVERLAY */}
          {open && results.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
              {results.map((s) => (
                <div key={s.title} onClick={() => router.push(s.link)} className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b last:border-0">
                   <div className="relative w-10 h-10 rounded-lg overflow-hidden"><Image src={s.image} fill className="object-cover" alt={s.title}/></div>
                   <p className="flex-1 text-sm font-bold">{s.title}</p>
                   <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 🧭 HORIZONTAL CATEGORIES */}
      <nav className="flex items-center gap-6 overflow-x-auto px-5 py-4 no-scrollbar">
        {CATEGORIES.map((cat, idx) => (
          <div key={cat.name} className="flex flex-col items-center min-w-fit gap-1">
            <div className={`text-2xl h-10 w-10 flex items-center justify-center ${idx === 0 ? "border-b-2 border-black" : ""}`}>
              {cat.icon}
            </div>
            <span className={`text-[11px] font-bold ${idx === 0 ? "text-black" : "text-gray-400"}`}>{cat.name}</span>
          </div>
        ))}
      </nav>

      <main className="flex-1 bg-[#f3f4f6]/50 p-4 space-y-4">
        
        {/* ⚡ BENTO CRAZY DEALS */}
        <div className="grid grid-cols-12 gap-3 h-[280px]">
          {/* Main Large Card */}
          <div className="col-span-4 bg-[#e0f2ff] rounded-2xl p-4 flex flex-col items-center relative overflow-hidden h-full shadow-sm">
            <span className="text-blue-900 font-black text-[10px] uppercase tracking-tighter text-center">Crazy Deals</span>
            <div className="bg-black/10 text-black text-[9px] px-2 py-0.5 rounded-sm mt-1 line-through">₹1,875</div>
            <div className="bg-yellow-400 text-black font-black text-lg px-2 rounded-md mt-0.5 shadow-sm">₹1,199</div>
            <span className="font-bold text-xs mt-2 text-center leading-tight">Hair Dryer</span>
            <div className="mt-auto w-full h-24 relative translate-y-2">
                <Image src="/images/vee2.jpg" alt="dryer" fill className="object-contain" />
            </div>
          </div>

          {/* Sub Grid Cards */}
          <div className="col-span-8 grid grid-cols-2 gap-3 h-full">
            {[
                { title: "Self Care", disc: "55% OFF", color: "bg-[#e0f2ff]" },
                { title: "Hot Deals", disc: "60% OFF", color: "bg-[#e0f2ff]" },
                { title: "Home Care", disc: "70% OFF", color: "bg-[#e0f2ff]" },
                { title: "Apparel", disc: "70% OFF", color: "bg-[#e0f2ff]" },
            ].map((d, i) => (
                <div key={i} className={`${d.color} rounded-2xl p-3 relative flex flex-col shadow-sm overflow-hidden`}>
                    <span className="bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm absolute top-0 right-3">Up to {d.disc}</span>
                    <span className="text-[11px] font-extrabold leading-tight mt-1 max-w-[60px]">{d.title}</span>
                    <div className="mt-auto self-end w-12 h-12 relative">
                        <Image src={STATIC_SERVICES[i].image} fill className="object-cover rounded-lg" alt="img"/>
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* 🏷️ PROMO BANNER */}
        <div className="bg-[#e0f2ff] rounded-xl p-3 flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white font-black text-[10px] p-1.5 rounded-lg leading-none">ixigo</div>
                <div className="flex flex-col">
                    <span className="text-xs font-extrabold leading-none">Flat ₹800 OFF on flights</span>
                    <span className="text-[10px] text-gray-500 font-medium">Unlock on orders above ₹999</span>
                </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
        </div>

        {/* 🏆 BESTSELLERS */}
        <section className="pt-2">
          <h2 className="text-lg font-black tracking-tight mb-4">Bestsellers</h2>
          <div className="grid grid-cols-3 gap-3 pb-8">
            {STATIC_SERVICES.slice(0, 3).map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">+124 more</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 🧭 NAVIGATION FOOTER (STYLIZED) */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center gap-1 text-yellow-500"><Image src="/images/wLOGO.png" width={20} height={20} alt="home" className="grayscale" /><span className="text-[10px] font-bold">Home</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><ClockIcon size={20}/><span className="text-[10px] font-bold">Order Again</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><LayoutGrid size={20}/><span className="text-[10px] font-bold">Categories</span></div>
        <div className="flex flex-col items-center gap-1 text-gray-400"><PrintIcon size={20}/><span className="text-[10px] font-bold">Print</span></div>
      </footer>
    </div>
  );
}

// Minimal Icons for Footer
const ClockIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const LayoutGrid = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const PrintIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;