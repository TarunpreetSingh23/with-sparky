"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  User, Phone, MapPin, ShoppingCart, 
  CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, 
  X, Map as MapIcon, Calendar,Home, Pencil, Trash2,Clock, CreditCard, Sparkles
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PAY_AFTER_SERVICE");

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
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [orderId, setOrderId] = useState("");
  const isRecipientValid =
  name.trim().length > 0 && /^\d{10}$/.test(phone);


  /* ================= AUTH & LOGIC (UNCHANGED) ================= */
  // useEffect(() => {
  //   fetch("/api/me").then(res => res.json()).then(data => {
  //     if (!data?.user) router.push("/login");
  //     else {
  //       setUser(data.user); setName(data.user.name || "");
  //       setPhone(data.user.phone || ""); setloginPhone(data.user.phone);
  //     }
  //   }).catch(() => router.push("/login"));
  // }, [router]);
const UPI_ID = "sparkyservices.in@okaxis"; // 🔴 replace with YOUR real UPI ID
const BRAND_NAME = "SPARKY";

const startUpiPayment = () => {
  const upiUrl =
    `upi://pay?pa=${UPI_ID}` +
    `&pn=${encodeURIComponent(BRAND_NAME)}` +
    `&am=${total.toFixed(0)}` +
    `&cu=INR`;

  window.location.href = upiUrl;
};
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

  const nextStep = () => validateStep() 
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
          date, timeSlot, paymentMethod:
          paymentMethod === "UPI" ? "UPI (SPARKY)" : "Pay After Service", status: "pending",
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
const getAvailableSlots = () => {
  if (!date) return slots;

  const today = format(new Date(), "yyyy-MM-dd");

  // If selected date is NOT today → show all slots
  if (date !== today) return slots;

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return slots.filter((slot) => {
    const slotDateTime = new Date(`${date} ${slot}`);
    return slotDateTime > oneHourLater;
  });
};

  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const steps = [
    { num: 1, title: "Identity", icon: User },
    { num: 2, title: "Location", icon: MapPin },
    { num: 3, title: "Schedule", icon: Calendar }
  ];
const updateQuantity = (index, qty) => {
  const updated = [...cart];
  updated[index].quantity = qty;
  setCart(updated);
  localStorage.setItem("cart", JSON.stringify(updated));
};
 return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#1A2421] pb-40 selection:bg-[#3A4D39]/10">
      
      {/* --- Full Screen Map Overlay --- */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-6 left-6 z-10">
              <button 
                onClick={() => setShowMap(false)} 
                className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 transition-transform"
              >
                <X size={20} className="text-[#3A4D39]" />
              </button>
            </div>
            <div className="flex-1 w-full relative bg-[#F2F4ED]">
              <UserMap setAddress={(addr) => setAddress(addr)} />
            </div>
            <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-center">
              <button 
                onClick={() => setShowMap(false)} 
                className="w-full max-w-md shadow-2xl bg-[#1A2F25] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <CheckCircle2 size={18} className="text-emerald-400" /> Confirm Location
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
            className="fixed inset-0 z-[110] bg-[#1A2F25]/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-2xl"
            >
              <div className="relative mx-auto w-20 h-20 mb-8">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }} 
                  animate={{ scale: 1, rotate: 12 }} 
                  className="absolute inset-0 bg-[#A61D33] rounded-3xl" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 size={32} color="white" />
                </div>
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight uppercase">slot Secured</h2>
              <p className="text-gray-500 text-[11px] mb-10 font-bold uppercase tracking-[0.1em] leading-relaxed px-4">
                Order <span className="text-[#1A2F25] font-black">#{orderId}</span> confirmed.<br/>
                <span className="opacity-60">Invoice dispatched via WhatsApp.</span>
              </p>
              <button 
                onClick={() => router.push("/")} 
                className="w-full py-5 bg-[#1A2F25] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all"
              >
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Cart Items */}
         <section className="space-y-4">
 <h3
  className="
    inline-block
    px-4 py-1.5
    text-xs font-extrabold uppercase tracking-widest
    text-white
    rounded-xl
    bg-gradient-to-r from-[#3A4D39] to-[#4F6F52]
    shadow-[0_4px_12px_rgba(0,0,0,0.15)]
    hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]
    transition-all
  "
>
  Checkout
</h3>


  <div className="space-y-3">
    {cart.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-4 transition-all duration-200 hover:shadow-md hover:border-gray-200"
      >
        {/* Left Content */}
        <div className="flex-1 pr-4">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            {item.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {item.title}
          </p>
        </div>

        {/* Price Section */}
        <div className="text-right min-w-[90px]">
          <p className="text-sm font-semibold text-green-600">
            ₹{item.price}
          </p>

          {item.originalPrice && (
            <p className="text-xs text-gray-400 line-through mt-0.5">
              ₹{item.originalPrice}
            </p>
          )}
        </div>
      </motion.div>
    ))}
  </div>
</section>


          {/* Recipient Form */}
       <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="relative bg-white rounded-2xl border border-gray-200/70 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
>
  {/* Header */}
  <header className="space-y-2">
    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
      Service Recipient
    </h2>
    <p className="text-xs text-gray-500 uppercase tracking-widest">
      Contact details for your professional
    </p>
  </header>

  {/* Divider */}
  <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

  {/* Form Fields */}
  <div className="mt-8 space-y-6">
    <InputField
      label="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={errors.name}
      placeholder="Enter recipient name"
      icon={User}
    />

    <InputField
      label="Contact Number"
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      error={errors.phone}
      placeholder="WhatsApp number"
      icon={Phone}
    />
  </div>
</motion.div>

        </div>

        {/* --- RIGHT COLUMN: SUMMARY --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-[13px] font-medium text-gray-600">
                  <span>Item total</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[13px] font-medium text-gray-600">
                  <span>Taxes and Fee</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Total Payable</span>
                  <span className="text-2xl font-black text-[#1A2421]">₹{subtotal.toFixed(0)}</span>
                </div>
              </div>

              <div className="bg-[#F2F4ED] rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck size={18} className="text-[#3A4D39]" />
                <p className="text-[10px] font-bold text-[#3A4D39] uppercase tracking-tight">
                  Secure Checkout Guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS (Slot Picker & Payment) --- */}
      <AnimatePresence>
        {(showSlotPicker || showPaymentModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A2F25]/40 backdrop-blur-sm z-[998]"
            onClick={() => { setShowSlotPicker(false); setShowPaymentModal(false); }}
          />
        )}

        {showSlotPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl z-[999]"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Select Arrival Time</h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Estimated duration: 2 hrs</p>

            <div className="mt-8">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {next5Days.map((d, i) => {
                  const value = format(d, "yyyy-MM-dd");
                  const isSelected = date === value;
                  return (
                    <button
                      key={i}
                      onClick={() => setDate(value)}
                      className={`min-w-[60px] h-[70px] rounded-2xl border-2 flex flex-col items-center justify-center transition-all
                        ${isSelected ? "border-[#3A4D39] bg-[#3A4D39] text-white shadow-lg" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tighter mb-1">{format(d, "EEE")}</span>
                      <span className="text-base font-black">{format(d, "dd")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Slots</p>
              <div className="grid grid-cols-3 gap-3">
                {getAvailableSlots().map((slot, i) => (

                  <button
                    key={i}
                    onClick={() => setTimeSlot(slot)}
                    className={`py-3 rounded-xl border-2 text-[11px] font-black transition-all
                      ${timeSlot === slot ? "border-[#3A4D39] bg-[#3A4D39]/5 text-[#3A4D39]" : "border-gray-50 text-gray-500 hover:border-gray-200"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {date === format(new Date(), "yyyy-MM-dd") &&
  getAvailableSlots().length === 0 && (
    <p className="text-center text-[11px] text-red-500 font-bold uppercase tracking-wider mt-4">
      No slots available for today
    </p>
)}

            </div>

            <button
              onClick={() => { if (date && timeSlot) { setShowSlotPicker(false); setShowPaymentModal(true); }}}
              disabled={!date || !timeSlot}
              className="mt-8 w-full py-5 bg-[#1A2F25] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] disabled:opacity-30 shadow-xl transition-all active:scale-95"
            >
              Confirm Slot
            </button>
          </motion.div>
        )}

        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-white rounded-[2.5rem] shadow-2xl z-[999] p-8"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Payment Method</h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-widest">100% Secure Transaction</p>

            <div className="mt-8 space-y-3">
              {[
                { name: 'Google Pay', icon: Sparkles, color: 'text-blue-500', method: 'UPI' },
                { name: 'PhonePe', icon: CreditCard, color: 'text-purple-600', method: 'UPI' },
                { name: 'Pay after service', icon: ShieldCheck, color: 'text-[#3A4D39]', method: 'PAY_AFTER_SERVICE', bg: 'bg-[#F2F4ED]' }
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPaymentMethod(opt.method);
                    setShowPaymentModal(false);
                    opt.method === 'UPI' ? startUpiPayment() : handleConfirm();
                  }}
                  className={`w-full flex items-center justify-between border border-gray-100 rounded-2xl px-5 py-5 hover:bg-gray-50 transition-all group ${opt.bg || ''}`}
                >
                  <div className="flex items-center gap-4">
                    <opt.icon size={20} className={opt.color} />
                    <span className="text-[13px] font-bold text-gray-800">{opt.name}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                </button>
              ))}
            </div>
            <button onClick={() => setShowPaymentModal(false)} className="mt-6 w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
              Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STICKY MOBILE FOOTER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t px-6 py-5 pb-8 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]
          ${!address ? "border-red-100" : "border-gray-100"}`}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className={`flex items-start gap-4 flex-1`}>
            <div className={`mt-1 p-2 rounded-xl ${!address ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-700"}`}>
              <Home size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-[11px] font-black uppercase tracking-widest ${!address ? "text-red-600" : "text-gray-400"}`}>
                  Delivery Address
                </p>
                <button onClick={() => setShowMap(true)} className="text-gray-400 hover:text-black transition-colors">
                  <Pencil size={12} />
                </button>
              </div>
              <p className={`text-[13px] font-bold leading-snug line-clamp-1 mt-0.5 ${!address ? "text-red-500" : "text-gray-900"}`}>
                {address || "Please select your location"}
              </p>
            </div>
          </div>

          <button
  disabled={!address || !isRecipientValid}
  onClick={() => {
    if (!isRecipientValid) {
      setErrors({
        name: !name.trim() ? "Full name required" : "",
        phone: !/^\d{10}$/.test(phone) ? "Invalid 10-digit number" : ""
      });
      return;
    }

    setShowSlotPicker(true);
  }}
  className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all active:scale-95
    ${
      !address || !isRecipientValid
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#1A2F25] text-white hover:shadow-2xl"
    }
  `}
>
  Select Time Slot
</button>

        </div>
      </motion.div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
    </div>
  );

}

