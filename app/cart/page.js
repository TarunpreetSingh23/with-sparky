"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  Tag,
  ShieldCheck,
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
    <div className="min-h-screen bg-[#edf4ff] text-gray-900 pt-6 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Your Cart</h1>
            <p className="text-gray-500 text-sm">
              {cartItems.length} services selected
            </p>
          </div>
          <Link
            href="/"
            className="text-blue-600 text-xs font-black uppercase tracking-widest"
          >
            Add More
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-3xl p-16 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">Your cart is empty</h2>
            <Link
              href="/"
              className="text-blue-600 text-sm font-bold"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-white border border-blue-100 p-4 rounded-2xl shadow-sm"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Professional service
                    </p>
                    <p className="text-blue-600 font-black text-sm mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <Tag size={18} className="text-blue-500" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon Code"
                className="flex-1 bg-transparent outline-none text-sm font-bold uppercase tracking-widest"
              />
              <button
                onClick={applyCoupon}
                className="text-blue-600 text-xs font-black uppercase tracking-widest"
              >
                Apply
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-white border border-blue-100 rounded-3xl p-6 space-y-4 shadow-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(0)}`} />
              <Row label="Taxes & Fees" value={`₹${tax.toFixed(0)}`} />
              {discount > 0 && (
                <Row
                  label="Discount"
                  value={`- ₹${(subtotal * discount).toFixed(0)}`}
                  highlight
                />
              )}
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest">
                  Amount Payable
                </span>
                <span className="text-3xl font-black tracking-tighter">
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>

              <div className="flex justify-center items-center gap-2 text-gray-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Secure Checkout
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div
      className={`flex justify-between text-xs font-bold uppercase tracking-widest ${
        highlight ? "text-emerald-500" : "text-gray-500"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
