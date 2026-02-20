"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, ShoppingCart, Trash2, Star, ChevronRight, ChevronLeft, LayoutGrid, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function CleaningPage() {
 const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category")?.toUpperCase() || "ALL";
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [minCartError, setMinCartError] = useState("");
  // const searchParams = useSearchParams();
  const router = useRouter();

  const MIN_CART_VALUE = 300;
  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_SOFT = "#f2f4ed";
  const SAGA_ACCENT = "#f7b614";
  const SAGA_MAROON = "#a61d33";

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase();
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("ALL");
    }
  }, [searchParams]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/facial");
        const data = await res.json();
        setServices(data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchServices();
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

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
  // router.push("/checkout");
  router.refresh();
  };

  const getCartTotal = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    return items.reduce((sum, i) => sum + i.price, 0);
  };

  const filteredServices = selectedCategory === "ALL" 
    ? services 
    : services.filter((s) => s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) return <CleaningSkeleton />;


  return (
    <div className="bg-[#fbfcfa] min-h-screen text-[#1A2421] font-sans pb-32">
      
      {/* 1. PREMIUM STICKY HEADER */}
     <div
  className="
    sticky top-0 z-40
    bg-gradient-to-br from-white via-[#fbfcfa] to-[#f2f4ed]
    shadow-[0_8px_30px_rgba(58,77,57,0.12)]
    backdrop-blur-xl
  "
>
  {/* TOP BAR */}
  <div className="flex items-center justify-between px-6 py-4">
    <button
      onClick={() => router.back()}
      className="
        p-2 rounded-full
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        active:scale-95
        transition
      "
    >
      <ChevronLeft size={22} color={SAGA_GREEN} />
    </button>

    <h1
      className="
        text-[17px]
        font-[1000]
        italic
        tracking-tight
        text-[#1A2421]
      "
    >
      {selectedCategory === "ALL" ? "All Services" : selectedCategory}
    </h1>

    <button
      onClick={() => setCartOpen(true)}
      className="
        p-2 relative rounded-full
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        active:scale-95
        transition
      "
    >
      <ShoppingCart size={20} color={SAGA_GREEN} />

      {cart.length > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            bg-gradient-to-br from-[#a61d33] to-[#7a1224]
            text-white
            text-[8px]
            w-4 h-4
            rounded-full
            flex items-center justify-center
            font-black
            border-2 border-white
            shadow-sm
          "
        >
          {cart.length}
        </span>
      )}
    </button>
  </div>

  {/* CATEGORY PILLS */}
 <div className="flex overflow-x-auto no-scrollbar gap-3 px-5 pb-4 scroll-smooth">

  {["ALL", "FACIAL", "CLEANUP", "WAXING", "MAKEUP", "MANICURE"].map((cat) => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      className={`
        relative
        px-4 py-2
        rounded-full
        text-[10px]
        font-semibold
        tracking-wide
        whitespace-nowrap
        transition-all duration-300
        ${
          selectedCategory === cat
            ? `
              bg-gradient-to-br from-[#3A4D39] via-[#344233] to-[#2f3a1f]
              text-white
              shadow-[0_8px_20px_rgba(58,77,57,0.35)]
              border border-[#2f3a1f]
            `
            : `
              bg-gradient-to-b from-white to-[#f8faf5]
              text-[#4F6F52]
              border border-[#e5ead7]
              shadow-[0_3px_8px_rgba(0,0,0,0.06)]
              hover:shadow-[0_6px_14px_rgba(0,0,0,0.08)]
              active:scale-95
            `
        }
      `}
    >
      {cat}
    </button>
  ))}

</div>

</div>

     <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

  {filteredServices.map((service) => (
    <div
      key={service._id}
      className="
        group
        flex gap-4
        p-5
        rounded-3xl
        bg-gradient-to-br from-white via-[#fbfcfa] to-[#f2f4ed]
        border border-[#f1f3eb]
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
        hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]
        transition-all duration-300
      "
    >

      {/* LEFT CONTENT */}
      <div className="flex-1">

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold text-[#f7b614]">
          <Star size={10} fill="currentColor" />
          4.8
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-extrabold tracking-tight text-[#1A2421] leading-snug mb-2">
          {service.title}
        </h3>

        {/* Price & Duration */}
        <div className="flex items-center gap-3 mb-3">
          <span className="
            text-lg font-black
            bg-gradient-to-r from-[#3A4D39] to-[#2f3a1f]
            bg-clip-text text-transparent
          ">
            ₹{service.price}
          </span>

          <span className="text-[11px] text-[#4F6F52] font-medium flex items-center gap-1 opacity-70">
            <Clock size={12} /> 45 Mins
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* View Details */}
        <button
          onClick={() => router.push(`services/${service.title}`)}
          className="
            text-[11px]
            font-semibold
            text-[#a61d33]
            flex items-center gap-1
            hover:gap-2
            transition-all
          "
        >
          View Details
          <ChevronRight size={14} />
        </button>

      </div>

      {/* RIGHT IMAGE + ADD */}
      <div className="relative flex flex-col items-center shrink-0">

        {/* Image */}
        <div className="
          relative w-28 h-28
          rounded-2xl overflow-hidden
          bg-gradient-to-br from-[#f2f4ed] to-[#e6eadf]
          border border-[#f1f3eb]
          shadow-inner
        ">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => addToCart(service)}
          className="
            absolute -bottom-3
            w-24 py-2
            rounded-xl
            text-[11px] font-semibold
            bg-gradient-to-r from-[#ffffff] to-[#f2f4ed]
            border border-[#E0E5D2]
            text-[#3A4D39]
            shadow-lg
            hover:bg-gradient-to-r hover:from-[#3A4D39] hover:to-[#2f3a1f]
            hover:text-white
            hover:border-[#3A4D39]
            transition-all
            active:scale-90
          "
        >
          Add
        </button>

      </div>

    </div>
  ))}

</main>


      {/* 4. PREMIUM FLOATING CART BAR */}
 {cart.length > 0 && (
  <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
    <div className="max-w-sm mx-auto">

      <div
        onClick={() => setCartOpen(true)}
        className="
        relative
        flex items-center justify-between
        px-4 py-2.5
        rounded-2xl
        bg-gradient-to-br from-[#3A4D39] via-[#465f45] to-[#2f3a1f]
        text-white
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        active:scale-[0.97]
        transition-all duration-200
        border border-white/5
        backdrop-blur-xl
        "
      >

        {/* subtle top shine */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0 relative z-10">
          
          <div className="
            w-8 h-8
            rounded-lg
            bg-gradient-to-br from-[#f7b614] to-[#ffcc4d]
            flex items-center justify-center
            shadow-md shadow-black/20
          ">
            <ShoppingCart size={16} className="text-black" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-tight">
              ₹{cartTotal}
            </span>
            <span className="text-[10px] text-white/60">
              {cart.length} item{cart.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* RIGHT MINI CTA */}
        <div className="
          relative z-10
          px-3 py-1.5
          rounded-lg
          text-[10px]
          font-medium
          tracking-wide
          bg-gradient-to-r from-white/10 to-white/5
          border border-white/10
          backdrop-blur-md
          flex items-center gap-1
        ">
          Review
          <ChevronRight size={13} className="opacity-70" />
        </div>

      </div>

    </div>
  </div>
)}


      {/* 5. SAGA DRAWER (Bottom Sheet) */}
 <div
  className={`fixed inset-0 z-[100] transition-all duration-500 ${
    cartOpen
      ? "bg-black/60 backdrop-blur-sm opacity-100 visible"
      : "bg-black/0 opacity-0 invisible"
  }`}
  onClick={() => setCartOpen(false)}
>
  <div
    onClick={(e) => e.stopPropagation()}
    className={`
      absolute bottom-0 left-0 right-0
      rounded-t-[3rem]
      p-6
      bg-gradient-to-b from-white via-[#fbfcfa] to-[#f2f4ed]
      border-t border-[#f1f3eb]
      shadow-[0_-25px_60px_rgba(0,0,0,0.18)]
      transition-transform duration-700 ease-out
      ${cartOpen ? "translate-y-0" : "translate-y-full"}
    `}
  >
    {/* Drag Handle */}
    <div className="w-14 h-1.5 bg-gradient-to-r from-[#f2f4ed] to-[#e6eadf] rounded-full mx-auto mb-6" />

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-[1000] italic leading-none bg-gradient-to-r from-[#1A2421] to-[#3A4D39] bg-clip-text text-transparent">
          My <span className="text-[#a61d33]">Bag</span>
        </h2>
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4F6F52] opacity-50 mt-1 block">
          {cart.length} Services Added
        </span>
      </div>

      <button
        onClick={() => setCartOpen(false)}
        className="p-3 rounded-full
        bg-gradient-to-br from-[#f2f4ed] to-[#e6eadf]
        shadow-md shadow-[#3A4D39]/10
        active:scale-90 transition-all"
      >
        <X size={18} className="text-[#3A4D39]" />
      </button>
    </div>

    {/* ITEM LIST */}
    <div className="max-h-[45vh] overflow-y-auto no-scrollbar space-y-4 mb-6">
      {cart.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between
          p-4 rounded-2xl
          bg-gradient-to-br from-[#fbfcfa] to-[#f2f4ed]
          border border-[#f1f3eb]
          shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden
              bg-gradient-to-br from-[#f2f4ed] to-[#e6eadf]
              border border-[#f1f3eb]">
              <Image src={item.image} fill className="object-cover" alt="img" />
            </div>

            <div>
              <p className="text-[13px] font-black text-[#1A2421] leading-tight">
                {item.title}
              </p>
              <p className="text-[#3A4D39] font-black text-xs mt-1">
                ₹{item.price}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const updated = cart.filter((_, idx) => idx !== i);
              setCart(updated);
              localStorage.setItem("cart", JSON.stringify(updated));
            }}
            className="p-2.5 rounded-xl
            bg-gradient-to-br from-rose-50 to-rose-100
            shadow-sm
            active:scale-90 transition"
          >
            <Trash2 size={16} className="text-[#a61d33]" />
          </button>
        </div>
      ))}
    </div>

    {/* FOOTER */}
    <div className="border-t border-[#f1f3eb] pt-6 space-y-5">
      <div className="flex justify-between items-end px-1">
        <span className="text-[#4F6F52] font-black uppercase text-[10px] tracking-widest opacity-60">
          Amount Payable
        </span>
        <span className="text-3xl font-[1000] tracking-tight
          bg-gradient-to-r from-[#1A2421] to-[#3A4D39]
          bg-clip-text text-transparent">
          ₹{cartTotal}
        </span>
      </div>

      <button
        onClick={() => {
          if (cartTotal < MIN_CART_VALUE) {
            setMinCartError(
              `Add ₹${MIN_CART_VALUE - cartTotal} more to book`
            );
            return;
          }
          router.push("/checkout");
        }}
        className="
          w-full py-4 rounded-2xl
          bg-gradient-to-r from-[#3A4D39] to-[#2f3a1f]
          text-white
          font-black uppercase tracking-[0.15em] text-xs
          shadow-[0_15px_35px_rgba(58,77,57,0.35)]
          active:scale-[0.98]
          transition-all
          flex items-center justify-center gap-2
        "
      >
        Confirm
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
</div>


      {/* 6. SAGA MIN-CART TOAST */}
     {minCartError && (
  <div
    className="fixed bottom-19 left-1/2 -translate-x-1/2 z-[100]
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- Professional Urban Loader ---
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
function CleaningSkeleton() {
  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-32 animate-pulse">

      {/* ===== HEADER SKELETON ===== */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_4px_20px_rgba(58,77,57,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-10 h-10 rounded-full bg-[#f2f4ed]" />
          <div className="h-5 w-32 rounded-lg bg-[#f2f4ed]" />
          <div className="w-10 h-10 rounded-full bg-[#f2f4ed]" />
        </div>

        {/* Category Pills Skeleton */}
        <div className="flex gap-3 px-6 pb-4 overflow-x-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-xl bg-[#f2f4ed]"
            />
          ))}
        </div>
      </div>

      {/* ===== SERVICES LIST SKELETON ===== */}
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 bg-white rounded-[2rem] border border-[#f1f3eb]"
          >
            {/* LEFT CONTENT */}
            <div className="flex-1 space-y-3">
              <div className="h-3 w-20 rounded bg-[#f7b614]/30" />
              <div className="h-5 w-3/4 rounded bg-[#f2f4ed]" />
              <div className="h-4 w-32 rounded bg-[#e6eadf]" />
              <div className="h-3 w-full rounded bg-[#f2f4ed]" />
              <div className="h-3 w-2/3 rounded bg-[#f2f4ed]" />
              <div className="h-3 w-24 rounded bg-[#f2f4ed]" />
            </div>

            {/* RIGHT IMAGE + BUTTON */}
            <div className="relative w-28">
              <div className="w-28 h-28 rounded-[1.5rem] bg-[#f2f4ed]" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-9 w-24 rounded-xl bg-white border border-[#e6eadf]" />
            </div>
          </div>
        ))}
      </main>

      {/* ===== FLOATING CART BAR SKELETON ===== */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#f1f3eb]">
        <div className="max-w-2xl mx-auto h-16 rounded-2xl bg-[#3A4D39]/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/30" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-white/30" />
              <div className="h-3 w-20 rounded bg-[#f7b614]/40" />
            </div>
          </div>
          <div className="h-9 w-20 rounded-xl bg-[#f7b614]/60" />
        </div>
      </div>
    </div>
  );
}
