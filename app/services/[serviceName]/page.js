"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Clock,
  Star,
  Zap,
  ChevronRight,
  ShieldAlert,
  ChevronLeft,
  Share2,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

export default function ServiceDetailPage() {
  const { serviceName } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [minCartError, setMinCartError] = useState("");

  const MIN_CART_VALUE = 299;
  
  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_MAROON = "#a61d33";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_BG = "#fbfcfa";

  const normalize = (s) => s?.toLowerCase().replace(/[\s-]+/g, "") || "";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || [];
        setServices(list);
        const decoded = decodeURIComponent(serviceName || "");
        const found = list.find((s) => normalize(s.title).includes(normalize(decoded)));
        setSelected(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [serviceName]);

  useEffect(() => { window.scrollTo(0, 0); }, [serviceName]);

  const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const addToCart = (service) => {
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

  if (loading) return <ServiceDetailSkeleton />;

  if (!selected) return <div className="p-10 text-center font-black text-[#a61d33]">Service not found</div>;

  return (
    <div className="min-h-screen bg-white flex justify-center">
  <div
    className="
      w-full
      max-w-[430px]
      min-h-screen
      bg-[#fbfcfa]
      text-[#1A2421]
      pb-32
      font-sans
      relative
      overflow-hidden
      shadow-[0_0_60px_rgba(0,0,0,0.08)]
      selection:bg-[#f2f4ed]
    "
  >
      
      {/* 📍 Header Overlay */}
     <header
  className="
    fixed
    top-0
    left-1/2
    -translate-x-1/2
    w-full
    max-w-[430px]
    z-[50]
    flex justify-between items-center
    px-4 py-4
  "
>
  <button
    onClick={() => router.back()}
    className="w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all"
  >
    <ChevronLeft size={22} className="text-[#3A4D39]" />
  </button>

  <div className="flex gap-2">
    <button
      className="p-2 relative w-10 h-10 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart size={22} color={SAGA_GREEN} />
    </button>
  </div>
</header>

      {/* 🖼️ Hero Visual with Arch Style */}
      <div className="relative w-full h-[420px] bg-white overflow-hidden flex items-center justify-center rounded-b-[3.5rem] shadow-xl">
<Image
  src={selected.image}
  alt={selected.title}
  fill
  sizes="100vw"
  quality={100}
  priority
  className="object-cover"
  style={{ objectPosition: "center" }}
/>        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
      </div>

      <main className="space-y-4 px-4 mt-[-30px] relative z-10">
        
        {/* Card 1: Core Title & Pricing */}
       <section className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(58,77,57,0.08)] border border-[#f1f3eb] transition-all hover:shadow-[0_12px_40px_rgba(58,77,57,0.12)]">
  <div className="space-y-3">

    {/* Tags & Rating */}
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-extrabold text-[#a61d33] bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-inner">
        Premium Services
      </span>

      <div className="flex items-center gap-1 bg-gradient-to-br from-[#fff9e6] to-[#fff1c4] px-2.5 py-1 rounded-full border border-amber-100 shadow-sm">
        <Star size={12} fill="#f7b614" className="text-[#f7b614]" />
        <span className="text-[10px] font-extrabold text-[#3A4D39]">{selected.rating || "4.9"}</span>
      </div>
    </div>

    {/* Title */}
    <h1 className="text-[22px] md:text-[26px] font-[1000] tracking-tight text-[#1A2421] leading-snug italic uppercase">
      {selected.title}
    </h1>

    {/* Description */}
    <p className="text-[#4F6F52] text-[14px] md:text-[15px] font-bold leading-relaxed opacity-80">
      {selected.description}
    </p>

    {/* Price & Badge */}
    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white">
      <span className="text-2xl md:text-3xl  font-[1000] text-[#3A4D39] ">
        ₹{selected.price}
      </span>
      <span className="text-[#a61d33] text-[14px] line-through font-bold">
        ₹{selected.price + 300}
      </span>
      <span className="ml-auto bg-gradient-to-br from-[#3A4D39] to-[#4F6F52] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg uppercase italic tracking-widest">
        Best Value
      </span>
    </div>
  </div>
</section>


        {/* Min Cart Toast */}
      {minCartError && (
  <div
    className="fixed bottom-19 left-1/2 -translate-x-1/2 z-[100]
    w-[90%] max-w-xs
    bg-white
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

        {/* ✨ SERVICE STEPS: Saga Style */}
      {selected.steps && selected.steps.length > 0 && (
  <section className="mt-12 px-6">

    {/* Header */}
    <div className="mb-10">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-[#8A9A5B] uppercase mb-2">
        How It Works
      </p>

      <h2 className="text-[24px] font-semibold text-[#1A2421] tracking-tight">
        Service Journey
      </h2>
    </div>

    {/* Steps */}
    <div className="space-y-8 relative">

      {/* Vertical Line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-[#E8ECE4]" />

      {selected.steps.map((step, idx) => {
        const [stepLabel, rest] = step.split(" – ");
        const [title, desc] = rest ? rest.split(": ") : [rest, ""];

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            viewport={{ once: true }}
            className="relative pl-12"
          >

            {/* Step Dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full 
              bg-white border border-[#DCE3D2] 
              flex items-center justify-center
              text-[11px] font-semibold text-[#3A4D39]
              shadow-sm
            ">
              {idx + 1}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-[16px] font-semibold text-[#1A2421] leading-snug">
                {title}
              </h3>

              <p className="text-[14px] text-[#5f6b4a] leading-relaxed">
                {desc}
              </p>
            </div>

          </motion.div>
        );
      })}
    </div>
  </section>
)}

        {/* Recommended: Saga Checkerboard */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#f1f3eb] shadow-sm">
           <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#4F6F52] mb-6">Popular Add-ons</h2>
           <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 6).map((s, i) => (
                <div key={i} onClick={() => router.push(`/services/${encodeURIComponent(s.title)}`)} className="bg-[#fbfcfa] border border-[#f1f3eb] rounded-[2rem] p-3 shadow-sm active:scale-95 transition-all group">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-3">
                    <Image src={s.image} alt="Service" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <p className="text-[13px] font-[1000] text-[#1A2421] line-clamp-1 uppercase mb-1 tracking-tight">{s.title}</p>
                  <p className="text-sm font-black text-[#a61d33]">₹{s.price}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Saga Guarantee Badge */}
        <div className="p-12 text-center bg-[#3A4D39] rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="flex justify-center mb-4">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <ShieldCheck size={32} className="text-[#f7b614]" />
               </div>
            </div>
            <h4 className="text-white text-lg font-[1000] tracking-widest uppercase italic">Sparky Certified</h4>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed px-4">
              Premium Hygiene • Single-Use Kits • Background Verified Experts
            </p>
        </div>
      </main>

      {/* 🚀 Saga Sticky Checkout Bar */}
<div
  className="
    fixed
    bottom-0
    left-1/2
    -translate-x-1/2
    w-full
    max-w-[430px]
    z-60
    bg-white/90 backdrop-blur-xl
    border-t border-[#e6eadf]
    px-6 py-4
    flex items-center justify-between
    shadow-[0_-12px_32px_rgba(58,77,57,0.08)]
    transition-all
  "
>

  {/* LEFT — Price */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="text-[24px] md:text-[26px] font-extrabold text-[#1A2421] tracking-tight leading-none">
        ₹{selected.price}
      </span>

      <span className="
        bg-gradient-to-r from-[#3A4D39] to-[#4F6F52] 
        text-white
        text-[9px] font-bold px-2 py-0.5 
        rounded-full uppercase tracking-wide
        shadow-[0_2px_8px_rgba(58,77,57,0.25)]
      ">
        Net Price
      </span>
    </div>

    <p className="mt-1 text-[10px] font-medium text-[#6b7a63] tracking-wide">
      Excluding visiting charges
    </p>
  </div>

  {/* RIGHT — CTA */}
  <button
    onClick={() => addToCart(selected)}
    className="
      h-12 md:h-14 px-6 md:px-8 
      rounded-[1.5rem] 
   bg-gradient-to-br from-[#3A4D39] via-[#465f45] to-[#2f3a1f]
      text-white 
      text-[12px] font-extrabold uppercase tracking-[0.18em]
      shadow-[0_6px_18px_rgba(58,77,57,0.3)]
      flex items-center justify-center gap-3
      active:scale-[0.97] transition-all
    "
  >
    Book Now
    <ChevronRight size={18} className="text-[#f7b614]" />
  </button>
</div>


    </div>
    </div>
  );
}

/* ================= LOADER ================= */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fbfcfa] z-[100]">
      <div className="flex flex-col items-center">
        <Image src="/images/wLogo.png" alt="Logo" width={140} height={50} className="mb-10 object-contain" />
        <div className="relative w-56 h-[3px] bg-[#f2f4ed] rounded-full overflow-hidden">
          <div className="loading-bar-element absolute h-full w-1/3 bg-gradient-to-r from-transparent via-[#3A4D39] to-transparent" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#4F6F52] animate-pulse">Curating Rituals</p>
      </div>
      <style jsx>{`
        .loading-bar-element { animation: loading-slide 2s infinite cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes loading-slide { 0% { left: -100%; } 50% { left: 30%; } 100% { left: 100%; } }
      `}</style>
    </div>
  );
}
function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#fbfcfa] pb-32 animate-pulse">

      {/* ===== HEADER FLOATING BUTTONS ===== */}
      <div className="fixed top-0 inset-x-0 z-[50] flex justify-between items-center px-4 py-4">
        <div className="w-10 h-10 rounded-full bg-white shadow border border-[#f1f3eb]" />
        <div className="w-10 h-10 rounded-full bg-white shadow border border-[#f1f3eb]" />
      </div>

      {/* ===== HERO IMAGE ===== */}
      <div className="relative w-full h-[420px] rounded-b-[3.5rem] overflow-hidden bg-[#f2f4ed]">
        <div className="absolute bottom-10 left-6 h-8 w-44 rounded-xl bg-white/80" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="space-y-4 px-4 mt-[-40px] relative z-10">

        {/* TITLE + PRICE CARD */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#f1f3eb] shadow-sm space-y-4">
          <div className="flex gap-3">
            <div className="h-6 w-32 rounded-full bg-[#f2f4ed]" />
            <div className="h-6 w-20 rounded-full bg-[#f2f4ed]" />
          </div>

          <div className="h-7 w-3/4 rounded-xl bg-[#e6eadf]" />
          <div className="h-4 w-full rounded-lg bg-[#f2f4ed]" />
          <div className="h-4 w-2/3 rounded-lg bg-[#f2f4ed]" />

          <div className="flex items-center gap-4 pt-4 border-t border-[#f1f3eb]">
            <div className="h-8 w-24 rounded-xl bg-[#e6eadf]" />
            <div className="h-6 w-16 rounded-lg bg-[#f2f4ed]" />
            <div className="ml-auto h-7 w-24 rounded-xl bg-[#f2f4ed]" />
          </div>
        </section>

        {/* SERVICE STEPS */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#f1f3eb] space-y-6">
          <div className="h-6 w-48 rounded-xl bg-[#e6eadf]" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#fbfcfa] p-6 rounded-[2rem] border border-[#f1f3eb] space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded bg-[#f2f4ed]" />
                <div className="h-8 w-8 rounded-lg bg-[#e6eadf]" />
              </div>
              <div className="h-5 w-2/3 rounded bg-[#e6eadf]" />
              <div className="h-4 w-full rounded bg-[#f2f4ed]" />
              <div className="h-4 w-3/4 rounded bg-[#f2f4ed]" />
            </div>
          ))}
        </section>

        {/* ADD-ONS GRID */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-[#f1f3eb]">
          <div className="h-4 w-32 rounded bg-[#e6eadf] mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded-[1.5rem] bg-[#f2f4ed]" />
                <div className="h-4 w-3/4 rounded bg-[#e6eadf]" />
                <div className="h-4 w-16 rounded bg-[#f2f4ed]" />
              </div>
            ))}
          </div>
        </section>

        {/* GUARANTEE BANNER */}
        <div className="h-44 rounded-[3rem] bg-[#3A4D39]/20" />
      </main>

      {/* ===== STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-[#e6eadf] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-24 rounded bg-[#e6eadf]" />
            <div className="h-3 w-32 rounded bg-[#f2f4ed]" />
          </div>
          <div className="h-14 w-40 rounded-[1.25rem] bg-[#3A4D39]/30" />
        </div>
      </div>
    </div>
  );
}
