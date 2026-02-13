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
      <header className="bg-[#3A4D39] px-6 pt-8 pb-12 rounded-b-[3rem] shadow-lg relative z-20">
        <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-white tracking-tight italic">My <span className="text-[#f7b614]">Basket</span></h1>
            <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f7b614] rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingBag size={20} className="text-[#3A4D39]" />
                </div>
                <div>
                    <p className="text-white text-[13px] font-black uppercase tracking-widest">{cartItems.length} Services Selected</p>
                    <p className="text-white/60 text-[10px] font-bold">Review your professional care bundle</p>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30 space-y-6">
        
        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#E0E5D2] rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-[#f2f4ed] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-[#4F6F52]" />
            </div>
            <h2 className="text-xl font-black mb-2 tracking-tight">Your basket is empty</h2>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed">Looks like you haven't added any luxury services yet.</p>
            <Link href="/" className="bg-[#3A4D39] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg">
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
                  className="flex gap-4 bg-white border border-[#E0E5D2] p-3 rounded-[2rem] shadow-[0_8px_30px_rgba(58,77,57,0.04)] group transition-all"
                >
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-[#f2f4ed] shrink-0 border border-[#f1f3eb]">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  <div className="flex-1 py-1">
                    {/* <span className="text-[9px] font-black text-[#4F6F52] uppercase tracking-widest opacity-60">Saga Premium</span> */}
                    <h3 className="text-[14px] font-black text-[#1A2421] leading-tight mt-0.5 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-[#3A4D39] font-black text-[16px] tracking-tight">
                            ₹{item.price}
                        </p>
                        <button
                            onClick={() => removeItem(index)}
                            className="p-2 bg-rose-50 text-rose-500 rounded-xl active:scale-90 transition-transform"
                        >
                            <Trash2 size={16} />
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
            <div className="bg-white border border-[#E0E5D2] rounded-[2.5rem] p-8 space-y-5 shadow-sm">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F6F52]">Payment Summary</h4>
              
              <div className="space-y-3">
                <Row label="Subtotal" value={`₹${subtotal.toFixed(0)}`} />
                <Row label="Handling fee" value="FREE" highlightColor="text-emerald-500" />
                <Row label="Saga Visiting charges" value="₹0" />
                
                {discount > 0 && (
                  <div className="flex justify-between items-center py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Coupon Savings</span>
                    <span className="text-xs font-black text-emerald-700">- ₹{(subtotal * discount).toFixed(0)}</span>
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-dashed border-[#E0E5D2] flex justify-between items-center">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Payable</span>
                    <p className="text-3xl font-[1000] text-[#1A2421] tracking-tighter mt-1">₹{subtotal.toFixed(0)}</p>
                </div>
                <div className="text-right">
                    <div className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-md uppercase mb-1">Secure Transaction</div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Incl. of all taxes</p>
                </div>
              </div>
            </div>

            {/* 5. CHECKOUT ACTION BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-[#E0E5D2] flex flex-col gap-3 z-50">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#3A4D39] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-[0_15px_30px_rgba(58,77,57,0.3)] hover:bg-[#2f3a1f] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Checkout Now <ArrowRight size={16} className="text-[#f7b614]" />
              </button>

              <div className="flex justify-center items-center gap-2 text-[#4F6F52] opacity-60">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                  100% Secure Checkout • Verified Partner
                </span>
              </div>
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