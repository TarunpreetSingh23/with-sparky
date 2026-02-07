"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  User, Phone, MapPin, ShoppingCart, 
  CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, 
  X, Map as MapIcon, Calendar, Clock, CreditCard, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ------------------ Theme Constants ------------------ */
const THEME = {
  green: "#3A4D39",
  softGreen: "#f2f4ed",
  maroon: "#a61d33",
  gold: "#f7b614",
  text: "#1A2421",
  bg: "#fbfcfa"
};

/* ------------------ Modern Input Component ------------------ */
const InputField = ({ label, type = "text", value, onChange, error, placeholder, icon: Icon, disabled }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-[1000] text-[#4F6F52] uppercase tracking-[0.15em] ml-2">
      {label}
    </label>
    <div className={`
      relative flex items-center bg-[#fbfcfa] rounded-2xl border-2 transition-all duration-300
      ${error ? "border-rose-200 bg-rose-50/30" : "border-[#f1f3eb] focus-within:border-[#3A4D39] focus-within:bg-white focus-within:shadow-xl focus-within:shadow-[#3A4D39]/5"}
    `}>
      {Icon && (
        <div className="pl-5 text-[#3A4D39] opacity-40">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-5 py-5 bg-transparent text-sm font-[1000] text-[#1A2421] outline-none placeholder:text-gray-300 disabled:text-gray-300 uppercase tracking-tight"
      />
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[#a61d33] text-[9px] font-black uppercase pl-2 tracking-widest">
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
  const [pincode, setPincode] = useState("143001");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [orderId, setOrderId] = useState("");

  /* ================= AUTH & LOGIC (UNCHANGED) ================= */
  useEffect(() => {
    fetch("/api/me").then(res => res.json()).then(data => {
      if (!data?.user) router.push("/login");
      else {
        setUser(data.user); setName(data.user.name || "");
        setPhone(data.user.phone || ""); setloginPhone(data.user.phone);
      }
    }).catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!name.trim()) e.name = "Full name required";
      if (!/^\d{10}$/.test(phone)) e.phone = "Invalid 10-digit number";
    }
    if (step === 2) {
      if (!address.trim()) e.address = "Detailed address required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => validateStep() && setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleConfirm = async () => {
    if (!validateStep() || !cart.length || !date || !timeSlot) return;
    setIsPlacingOrder(true);
    const formattedCart = cart.map(item => ({
      name: item.title || item.name,
      price: item.price,
      quantity: item.quantity || 1,
      category: item.category,
      earning: item.earning,
      profit: item.profit
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: formattedCart, subtotal, discount, total,
          customerName: name, loginPhone, phone, address, pincode,
          date, timeSlot, paymentMethod: "COD", status: "pending",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setOrderSuccess(true); setOrderId(data.orderId);
      localStorage.removeItem("cart");
    } catch (err) {
      alert("Error placing order");
    } finally { setIsPlacingOrder(false); }
  };

  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const steps = [
    { num: 1, title: "Identity", icon: User },
    { num: 2, title: "Location", icon: MapPin },
    { num: 3, title: "Schedule", icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcfa] font-sans text-[#1A2421] pb-40">
      
      {/* --- Full Screen Map Overlay (Saga Style) --- */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-6 left-6 z-10">
              <button onClick={() => setShowMap(false)} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-[#f1f3eb]">
                <X size={24} color={THEME.green} />
              </button>
            </div>
            <div className="flex-1 w-full relative bg-[#f2f4ed]"><UserMap setAddress={(addr) => setAddress(addr)} /></div>
            <div className="absolute bottom-19 left-0 right-0 px-8 flex justify-center">
              <button onClick={() => setShowMap(false)} className="w-full max-w-sm shadow-2xl bg-[#3A4D39] text-white py-5 rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all">
                <CheckCircle2 size={18} className="text-[#f7b614]" /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Success Modal (Saga Style) --- */}
      <AnimatePresence>
      {orderSuccess && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-[#3A4D39]/80 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl border border-white/20">
            <div className="relative mx-auto w-24 h-24 mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-[#a61d33] rounded-[2rem] rotate-12" />
              <div className="absolute inset-0 flex items-center justify-center"><CheckCircle2 size={40} color="white" /></div>
            </div>
            <h2 className="text-2xl font-[1000] mb-2 tracking-tight italic uppercase">Ritual Secured</h2>
            <p className="text-gray-400 text-[11px] mb-10 font-bold uppercase tracking-widest leading-relaxed">
              Order <span className="text-[#3A4D39]">#{orderId}</span> is confirmed.<br/>Invoice dispatched to WhatsApp.
            </p>
            <button onClick={() => router.push("/")} className="w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95">
              Back to Home
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* --- Header & Stepper --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-[#f1f3eb]">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-[#f2f4ed] rounded-full transition-all"><ChevronLeft size={24} color={THEME.green} /></button>
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${step === s.num ? "bg-[#3A4D39] text-white shadow-lg" : step > s.num ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#fbfcfa] text-gray-300 border border-[#f1f3eb]"}`}>
                  <s.icon size={12} /> <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-4 h-0.5 rounded-full ${step > i + 1 ? "bg-emerald-400" : "bg-[#f1f3eb]"}`} />}
              </div>
            ))}
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: FORMS --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#f1f3eb]">
              <div className="mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f2f4ed] rounded-2xl flex items-center justify-center"><User size={24} color={THEME.green} /></div>
                <div>
                    <h2 className="text-2xl font-[1000] tracking-tighter uppercase italic">Identity</h2>
                    <p className="text-[10px] font-black text-[#4F6F52] uppercase tracking-[0.2em] opacity-60">Verification of service recipient</p>
                </div>
              </div>
              <div className="grid gap-8">
                <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Recipient Name" icon={User} />
                <InputField label="Contact Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="WhatsApp Contact" icon={Phone} />
              </div>
              <button onClick={nextStep} className="mt-12 w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#3A4D39]/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                Next: Location <ArrowRight size={16} color={THEME.gold} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#f1f3eb]">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f2f4ed] rounded-2xl flex items-center justify-center"><MapPin size={24} color={THEME.green} /></div>
                    <div>
                        <h2 className="text-2xl font-[1000] tracking-tighter uppercase italic">Location</h2>
                        <p className="text-[10px] font-black text-[#4F6F52] uppercase tracking-[0.2em] opacity-60">Professional arrival point</p>
                    </div>
                  </div>
                </div>

                <div onClick={() => setShowMap(true)} className="group cursor-pointer mb-10 relative h-44 rounded-[2rem] overflow-hidden border-2 border-dashed border-[#E0E5D2] bg-[#fbfcfa] hover:bg-[#f2f4ed] transition-all flex flex-col items-center justify-center gap-3">
                  <div className="bg-white p-5 rounded-full shadow-xl z-10 group-hover:scale-110 transition-transform"><MapIcon color={THEME.green} /></div>
                  <p className="text-[#3A4D39] font-[1000] text-[10px] uppercase tracking-[0.2em]">Precision Map Pin</p>
                </div>

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

                <button onClick={nextStep} className="mt-12 w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  Next: Schedule <ArrowRight size={16} color={THEME.gold} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#f1f3eb]">
              <div className="mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f2f4ed] rounded-2xl flex items-center justify-center"><Clock size={24} color={THEME.green} /></div>
                <div>
                    <h2 className="text-2xl font-[1000] tracking-tighter uppercase italic">Schedule</h2>
                    <p className="text-[10px] font-black text-[#4F6F52] uppercase tracking-[0.2em] opacity-60">Pick your ritual window</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-[1000] text-[#4F6F52] uppercase tracking-widest flex items-center gap-2 px-1"><Calendar size={12}/> Preferred Date</label>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {next5Days.map((d, i) => {
                      const isSelected = date === format(d, "yyyy-MM-dd");
                      return (
                        <button key={i} onClick={() => setDate(format(d, "yyyy-MM-dd"))}
                          className={`flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-500
                            ${isSelected ? "bg-[#3A4D39] border-[#3A4D39] text-white shadow-2xl scale-105" : "bg-[#fbfcfa] border-[#f1f3eb] text-gray-400 hover:border-[#3A4D39]"}`}>
                          <span className="text-[9px] font-black uppercase mb-1 opacity-60">{format(d, "EEE")}</span>
                          <span className="text-3xl font-[1000] tracking-tighter italic">{format(d, "dd")}</span>
                          <span className="text-[9px] font-black uppercase mt-1">{format(d, "MMM")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-[1000] text-[#4F6F52] uppercase tracking-widest flex items-center gap-2 px-1"><Clock size={12}/> Available Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {slots.map((slot, i) => (
                      <button key={i} onClick={() => setTimeSlot(slot)}
                        className={`py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border-2 transition-all
                          ${timeSlot === slot ? "bg-[#a61d33] border-[#a61d33] text-white shadow-xl" : "bg-white border-[#f1f3eb] text-[#4F6F52] hover:border-[#3A4D39]"}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleConfirm} disabled={isPlacingOrder} className="mt-16 w-full py-6 bg-[#3A4D39] hover:bg-[#2f3a1f] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]">
                {isPlacingOrder ? <span className="animate-pulse italic">Placing Ritual...</span> : <>Confirm Booking </>}
              </button>
            </motion.div>
          )}
        </div>

        {/* --- RIGHT: SUMMARY --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(58,77,57,0.06)] border border-[#f1f3eb]">
              <h2 className="text-[11px] font-[1000] mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-[#4F6F52] border-b border-[#f1f3eb] pb-6">
                <ShoppingCart size={14} className="text-[#a61d33]" /> Basket Summary
              </h2>
              <div className="space-y-6 max-h-[350px] overflow-y-auto no-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-start group">
                    <div className="flex-1">
                      <p className="font-[1000] text-[13px] text-[#1A2421] leading-tight uppercase italic">{item.name || item.title}</p>
                      <p className="text-[9px] text-[#4F6F52] font-black uppercase mt-1 opacity-50 tracking-widest">{item.category}</p>
                    </div>
                    <span className="font-[1000] text-[#3A4D39] text-[14px]">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-dashed border-[#E0E5D2] space-y-4">
                <div className="flex justify-between font-bold text-[11px] text-[#4F6F52] uppercase tracking-tighter"><span>Basket Value</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between font-[1000] text-[11px] text-emerald-600 uppercase"><span>Theme Discount</span><span>- ₹{discount.toFixed(0)}</span></div>
                <div className="flex justify-between items-center pt-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Grand total</span>
                      <span className="text-4xl font-[1000] text-[#1A2421] tracking-tighter italic leading-none mt-1">₹{total.toFixed(0)}</span>
                   </div>
                   <div className="bg-[#f7b614] h-10 w-10 rounded-full flex items-center justify-center text-[#3A4D39] shadow-lg"><CreditCard size={18} /></div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2421] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#3A4D39] rounded-full blur-3xl opacity-40 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-[#f7b614]"><ShieldCheck size={24}/></div>
                  <div>
                    <p className="text-xs font-[1000] text-white uppercase tracking-widest">Saga Secure</p>
                    <p className="text-[10px] text-white/50 font-bold mt-1 uppercase tracking-tighter leading-tight italic">End-to-End Encrypted<br/>Payment Protocol</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}