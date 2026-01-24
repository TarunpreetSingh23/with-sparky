"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  User, Phone, MapPin, ShoppingCart, 
  CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, 
  X, Map as MapIcon, Calendar, Clock
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ------------------ Modern Input Component ------------------ */
const InputField = ({ label, type = "text", value, onChange, error, placeholder, icon: Icon, disabled }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
      {label}
    </label>
    <div className={`
      relative flex items-center bg-gray-50 rounded-2xl border-2 transition-all duration-300
      ${error ? "border-red-500 bg-red-50/10" : "border-transparent focus-within:border-blue-600 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-600/10"}
    `}>
      {Icon && (
        <div className="pl-4 text-gray-400">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-4 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400 disabled:text-gray-400"
      />
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-bold uppercase pl-1">
        {error}
      </motion.p>
    )}
  </div>
);

export default function Checkout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loginPhone, setloginPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [orderId, setOrderId] = useState("");

  /* ================= AUTH CHECK & COOKIE SYNC ================= */
  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || ""); 
          setloginPhone(data.user.phone);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  /* ================= CART ================= */
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  /* ================= VALIDATION ================= */
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!name.trim()) e.name = "Name is required";
      if (!/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit number";
    }
    if (step === 2) {
      if (!address.trim()) e.address = "Address is required";
      if (!/^\d{6}$/.test(pincode)) e.pincode = "Invalid PIN";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => validateStep() && setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleConfirm = async () => {
    if (!validateStep()) return;
    if (!cart.length) return;
    if (!date || !timeSlot) return alert("Select Date & Time");

    setIsPlacingOrder(true);
    const formattedCart = cart.map((item) => ({
      name: item.title || item.name,
      price: item.price,
      quantity: item.quantity || 1,
      category: item.category
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: formattedCart, subtotal, discount, total,
          customerName: name, loginPhone: loginPhone, phone: phone,
          address, pincode,
          date, timeSlot, paymentMethod: "COD", status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setOrderSuccess(true);
      setInvoiceUrl(data.invoiceUrl);
      setOrderId(data.orderId);
      localStorage.removeItem("cart");
    } catch (err) {
      alert("Error placing order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const slots = ["09:00 - 10:00", "10:30 - 11:30", "12:00 - 13:00", "15:00 - 16:00", "16:30 - 17:30"];

  // ---------------- UI HELPERS ----------------
  const steps = [
    { num: 1, title: "Contact", icon: User },
    { num: 2, title: "Address", icon: MapPin },
    { num: 3, title: "Slot", icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-slate-900 pb-40">
      
      {/* --- Full Screen Map Overlay (Blinkit Style) --- */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
              <button 
                onClick={() => setShowMap(false)}
                className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-800" />
              </button>
            </div>

            {/* The Map Component */}
            <div className="flex-1 w-full h-full relative">
               <UserMap setAddress={(addr) => { setAddress(addr); }} />
            </div>

            {/* Bottom Floating Action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex justify-center pb-10">
              <button 
                onClick={() => setShowMap(false)}
                className="pointer-events-auto shadow-2xl shadow-blue-600/30 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-transform active:scale-95"
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- Success Modal --- */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400" />
              <div className="mx-auto w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black mb-2 tracking-tight text-gray-900">Booked!</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium leading-relaxed">
                Your service order <span className="font-bold text-gray-900">#{orderId}</span> has been successfully placed.
              </p>
              
              <div className="space-y-3">
                <Link
                  href={invoiceUrl}
                  target="_blank"
                  className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors"
                >
                  Download Invoice
                </Link>
                <button onClick={() => router.push("/")} className="block w-full py-4 text-gray-400 font-bold uppercase text-xs tracking-widest hover:text-gray-600">
                  Return Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main App Header --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">SecureCheckout</span>
          </div>
          
          {/* Custom Stepper */}
          <div className="flex items-center gap-2 sm:gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all
                  ${step === s.num ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : step > s.num ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-400"}
                `}>
                  <s.icon size={12} />
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-4 h-0.5 rounded-full ${step > i + 1 ? "bg-emerald-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Form & Logic --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/50">
              <div className="mb-8">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">Who is this for?</h2>
                <p className="text-gray-400 text-sm font-medium mt-1">We need your contact details for updates.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <InputField 
                  label="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  error={errors.name} 
                  placeholder="e.g. John Doe" 
                  icon={User}
                />
                <InputField 
                  label="Phone Number" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  error={errors.phone}
                  placeholder="10-digit mobile number" 
                  icon={Phone} 
                />
              </div>

              <div className="mt-10">
                <button onClick={nextStep} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Address (With Map Trigger) */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 mb-2 pl-2">
                <ChevronLeft size={16}/> Go Back
              </button>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/50">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h2 className="text-2xl font-black tracking-tight text-gray-900">Where to?</h2>
                      <p className="text-gray-400 text-sm font-medium mt-1">Select the service location.</p>
                   </div>
                   <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                      <MapPin size={24} />
                   </div>
                </div>

                {/* Map Trigger Card */}
                <div 
                  onClick={() => setShowMap(true)}
                  className="group cursor-pointer mb-8 relative h-48 rounded-3xl overflow-hidden border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-3"
                >
                   {/* If UserMap can render static, put it here, otherwise just a placeholder or image */}
                   <div className="absolute inset-0 opacity-20 pointer-events-none">
                      {/* You can put a static map image here */}
                   </div>
                   <div className="bg-white p-4 rounded-full shadow-lg z-10 group-hover:scale-110 transition-transform">
                      <MapIcon className="text-blue-600" />
                   </div>
                   <p className="text-blue-600 font-bold text-sm uppercase tracking-wider z-10">Tap to Pin Location</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exact Address</label>
                    <textarea 
                      rows={3} 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="House No, Floor, Landmark..." 
                      className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none font-bold text-gray-900 text-sm resize-none transition-all
                        ${errors.address ? "border-red-500 bg-red-50/10" : "border-transparent focus:border-blue-500 focus:bg-white"}
                      `} 
                    />
                    {errors.address && <span className="text-red-500 text-[10px] font-bold uppercase">{errors.address}</span>}
                  </div>
                  
                  <InputField label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} error={errors.pincode} placeholder="e.g. 110001" icon={MapPin} />
                </div>

                <div className="mt-10">
                  <button onClick={nextStep} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Review Schedule <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Schedule */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 mb-2 pl-2">
                <ChevronLeft size={16}/> Go Back
              </button>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/50">
                 <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">When should we come?</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">Pick a convenient date and time.</p>
                 </div>

                 {/* Date Selector */}
                 <div className="space-y-4 mb-8">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14}/> Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {next5Days.map((d, i) => {
                        const isSelected = date === format(d, "yyyy-MM-dd");
                        return (
                          <button key={i} onClick={() => setDate(format(d, "yyyy-MM-dd"))}
                            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300
                              ${isSelected ? "bg-gray-900 border-gray-900 text-white shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                            <span className="text-[10px] font-black uppercase mb-1">{format(d, "EEE")}</span>
                            <span className="text-2xl font-black">{format(d, "dd")}</span>
                            <span className="text-[9px] font-medium mt-1 opacity-70">{format(d, "MMM")}</span>
                          </button>
                        )
                      })}
                    </div>
                 </div>

                 {/* Time Selector */}
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Clock size={14}/> Select Time Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {slots.map((slot, i) => (
                        <button key={i} onClick={() => setTimeSlot(slot)}
                          className={`py-4 px-2 rounded-xl font-bold text-xs border-2 transition-all
                            ${timeSlot === slot ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white border-gray-100 text-gray-500 hover:border-blue-200"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-gray-100">
                    <button onClick={handleConfirm} disabled={isPlacingOrder} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                      {isPlacingOrder ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>Confirm Booking <CheckCircle2 size={20} /></>
                      )}
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* --- RIGHT COLUMN: Cart Summary (Sticky) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100">
              <h2 className="text-xs font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4">
                <ShoppingCart size={14} className="text-gray-900" /> Order Summary
              </h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900 leading-tight">{item.name || item.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">{item.category}</p>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-green-600 font-bold">
                  <span>Discount (10%)</span>
                  <span>- ₹{discount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                   <span className="text-xs font-black uppercase text-gray-400">Total to Pay</span>
                   <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[2rem] border border-blue-100/50 flex items-center gap-4">
               <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                  <ShieldCheck size={20}/> 
               </div>
               <div>
                 <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">100% Safe Service</p>
                 <p className="text-[10px] text-blue-600/70 font-medium mt-0.5">Verified professionals only</p>
               </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
