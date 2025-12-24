'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, CreditCard, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  
  const TAX_RATE = 0.18;

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => data?.user ? setUser(data.user) : setUser(null))
      .catch(() => setUser(null));

    const saved = localStorage.getItem('cart');
    if (saved) setCartItems(JSON.parse(saved));

    const savedCoupon = localStorage.getItem('coupon');
    if (savedCoupon) {
      setCoupon(savedCoupon);
      setDiscount(0.1);
    }
  }, []);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed", { style: { background: "#030712", color: "#fff" } });
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  const removeItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (newCart.length === 0) localStorage.removeItem('coupon');
    toast.success("Removed from selection");
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setDiscount(0.1);
      localStorage.setItem('coupon', 'SAVE10');
      toast.success("10% Discount Applied!");
    } else {
      setDiscount(0);
      localStorage.removeItem('coupon');
      toast.error("Invalid Code");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax   - (subtotal * discount);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 pt-3 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Simple Header */}
        <header className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-gray-500 text-sm">{cartItems.length} items selected</p>
          </div>
          <Link href="/" className="text-blue-500 text-sm font-bold uppercase tracking-widest">
            Add More
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <ShoppingBag className="mx-auto text-gray-700 mb-4" size={48} />
            <h2 className="text-lg font-semibold">Your cart is empty</h2>
            <Link href="/" className="text-blue-500 text-sm mt-4 inline-block font-bold">Browse Services</Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Compact Service List */}
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate uppercase tracking-wide">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">Professional service</p>
                    <p className="text-blue-400 font-black text-sm mt-1">₹{item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(index)}
                    className="p-3 text-gray-500 hover:text-red-500 active:scale-90 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Section */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <Tag size={18} className="text-blue-500" />
              <input
                type="text"
                placeholder="Coupon Code"
                className="bg-transparent flex-1 text-sm outline-none font-bold uppercase tracking-widest"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon} className="text-blue-500 text-xs font-black uppercase tracking-widest">
                Apply
              </button>
            </div>

            {/* Clean Bill Details */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Taxes & Fee</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              {/* <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Delivery</span>
                <span>₹{}</span>
              </div> */}
              {discount > 0 && (
                <div className="flex justify-between text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  <span>Discount</span>
                  <span>- ₹{(subtotal * discount).toFixed(0)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest">Amount Payable</span>
                <span className="text-3xl font-black tracking-tighter">₹{total.toFixed(0)}</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
              </button>
              
              <div className="flex items-center justify-center gap-2 opacity-40">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}