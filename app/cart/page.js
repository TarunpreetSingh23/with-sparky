"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  Tag,
  ShieldCheck,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const TAX_RATE = 0.18;

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));

    const saved = localStorage.getItem("cart");
    if (saved) setCartItems(JSON.parse(saved));

    const savedCoupon = localStorage.getItem("coupon");
    if (savedCoupon) {
      setCoupon(savedCoupon);
      setDiscount(0.1);
    }
  }, []);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    if (updated.length === 0) localStorage.removeItem("coupon");
    toast.success("Item removed");
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1);
      localStorage.setItem("coupon", "SAVE10");
      toast.success("10% discount applied");
    } else {
      setDiscount(0);
      localStorage.removeItem("coupon");
      toast.error("Invalid coupon");
    }
  };

  const subtotal = cartItems.reduce((a, b) => a + b.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax - subtotal * discount;

  return (
    <div className="min-h-screen bg-[#f8f9f5] text-[#1A2421] pb-32 font-sans">
      {/* 1. PREMIUM HEADER */}
     <header className="relative z-20 px-5 pt-3 pb-9 rounded-b-[3rem]
  bg-gradient-to-br from-[#3A4D39] via-[#425b44] to-[#2f3a1f]
  shadow-[0_20px_40px_rgba(0,0,0,0.25)]
  overflow-hidden"
>
  {/* Subtle glow layer */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />

  {/* Title */}
  <div className="flex justify-center mb-3 relative z-10">
    <h1 className="text-[20px] font-black tracking-tight italic text-white">
      My <span className="text-[#f7b614] drop-shadow-sm">Basket</span>
    </h1>
  </div>

  {/* Floating summary card */}
  <div className="relative z-10 bg-white/15 backdrop-blur-xl rounded-2xl p-4
    border border-white/20
    shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.25)]
  ">
    <div className="flex items-center gap-4">
      
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#f7b614]/40 blur-lg rounded-full" />
        <div className="relative w-11 h-11 bg-gradient-to-br from-[#f7b614] to-[#f5a623]
          rounded-full flex items-center justify-center shadow-xl"
        >
          <ShoppingBag size={20} className="text-[#3A4D39]" />
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-white text-[13px] font-black tracking-widest uppercase">
          {cartItems.length} Services Selected
        </p>
        <p className="text-white/70 text-[10px] font-medium">
          Review your professional care bundle
        </p>
      </div>
    </div>
  </div>
</header>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30 space-y-6">
        
        {cartItems.length === 0 ? (
         <div className="bg-white rounded-[2rem] p-10 text-center
  shadow-[0_12px_30px_rgba(0,0,0,0.06)]
  border border-[#E0E5D2]">
  
  <div className="w-16 h-16 mx-auto mb-5 rounded-full
    bg-gradient-to-br from-[#f2f4ed] to-white
    flex items-center justify-center shadow-inner">
    <ShoppingBag size={26} className="text-[#4F6F52]" />
  </div>

  <h2 className="text-[17px] font-semibold text-gray-900">
    Basket is empty
  </h2>

  <p className="text-[11px] text-gray-400 mt-1 mb-6">
    Add services to continue
  </p>

  <Link
    href="/"
    className="inline-flex items-center justify-center
      px-6 py-3 rounded-xl
      bg-gradient-to-br from-[#3A4D39] to-[#2f3a1f]
      text-white text-[11px] font-semibold tracking-wide
      shadow-[0_8px_18px_rgba(58,77,57,0.35)]
      active:scale-95 transition"
  >
    Explore Services
  </Link>
</div>
        ) : (
          <>
            {/* 2. CART ITEMS: SAGA GREEN STYLE */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
             <div
  key={index}
  className="
    flex gap-3 p-3 rounded-[1.6rem]
    bg-gradient-to-br from-white to-[#fbfcfa]
    border border-[#E0E5D2]
    shadow-[0_10px_25px_rgba(58,77,57,0.08)]
    active:scale-[0.99] transition
  "
>
  {/* Image */}
  <div className="w-20 h-20 rounded-[1.25rem] overflow-hidden
    bg-[#f2f4ed] shrink-0
    shadow-inner">
    <img
      src={item.image || "/placeholder.png"}
      alt={item.name}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Info */}
  <div className="flex-1">
    <h3 className="text-[13px] font-semibold text-[#1A2421] truncate">
      {item.name}
    </h3>
    <p className="text-[10px] text-gray-400 mt-0.5 truncate">
      {item.title}
    </p>

    <div className="flex items-center justify-between mt-2">
      <span className="text-[15px] font-semibold text-[#3A4D39]">
        ₹{item.price}
      </span>

      <button
        onClick={() => removeItem(index)}
        className="
          w-fit h-fit rounded-lg
          bg-gradient-to-br from-rose-50 to-white
          text-rose-500
          shadow-[0_4px_10px_rgba(0,0,0,0.08)]
          active:scale-90 transition
        "
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
</div>
              ))}
            </div>

            {/* 3. COUPON SECTION */}
            {/* <div className="bg-white border border-[#E0E5D2] rounded-[1.75rem] p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-[#fdfcf0] rounded-full flex items-center justify-center">
                <Tag size={18} className="text-[#f7b614]" />
              </div>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="PROMO CODE"
                className="flex-1 bg-transparent outline-none text-sm font-black uppercase tracking-[0.2em] placeholder:text-gray-300"
              />
              <button
                onClick={applyCoupon}
                className="bg-[#3A4D39] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
              >
                Apply
              </button>
            </div> */}

            {/* 4. BILL SUMMARY: CLEAN & STRUCTURED */}
           <div className="
  bg-gradient-to-br from-white to-[#fbfcfa]
  rounded-[2rem] p-6
  border border-[#E0E5D2]
  shadow-[0_12px_30px_rgba(0,0,0,0.06)]
">
  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
    Payment Summary
  </p>

  <Row label="Subtotal" value={`₹${subtotal.toFixed(0)}`} />
  <Row label="Handling Fee" value="FREE" highlightColor="text-emerald-500" />

  <div className="mt-4 pt-4 border-t border-dashed border-[#E0E5D2]
    flex justify-between items-center">
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400">
        Total
      </p>
      <p className="text-[24px] font-semibold text-[#1A2421]">
        ₹{subtotal.toFixed(0)}
      </p>
    </div>

    <div className="text-right">
      <span className="text-[9px] font-semibold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
        Secure
      </span>
    </div>
  </div>
</div>

            {/* 5. CHECKOUT ACTION BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 bg-white/85 backdrop-blur-xl border-t border-[#E0E5D2]">
  <button
    onClick={handleCheckout}
    className="
      w-full
      h-14
      rounded-2xl
      bg-gradient-to-br from-[#3A4D39] via-[#465f45] to-[#2f3a1f]
      text-white
      text-[13px]
      font-semibold
      tracking-wide
      shadow-[0_10px_20px_rgba(58,77,57,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]
      active:scale-[0.97]
      active:shadow-[0_6px_14px_rgba(58,77,57,0.35)]
      transition-all
      flex
      items-center
      justify-center
      gap-2
    "
  >
    <span>Checkout</span>
    <ArrowRight size={16} className="text-[#f7b614]" />
  </button>
</div>
          </>
        )}
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */
function Row({ label, value, highlightColor = "text-[#1A2421]" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className={`text-[12px] font-black tracking-tight ${highlightColor}`}>{value}</span>
    </div>
  );
}