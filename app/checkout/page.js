"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  User, Phone, MapPin, ShoppingCart, 
  CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, 
  X, Map as MapIcon, Calendar,Home, Pencil, Trash2,Clock, CreditCard, Sparkles,AlertTriangle,ShoppingBag,Tag,Check
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
  const [showReferralInput, setShowReferralInput] = useState(false);
const [referralCode, setReferralCode] = useState("");
const [referralError, setReferralError] = useState("");
const [referralDiscount, setReferralDiscount] = useState(0);
  const isRecipientValid =
  name.trim().length > 0 && /^\d{10}$/.test(phone);
  /* ================= AMRITSAR BOUND CHECK ================= */

const [outOfBounds, setOutOfBounds] = useState(false);
const [pendingLocation, setPendingLocation] = useState(null);

const AMRITSAR_BOUNDS = [
  { lat: 31.670068, lng: 74.862815 },
  { lat: 31.657253, lng: 74.919065 },
  { lat: 31.596597, lng: 74.877805 },
  { lat: 31.630555, lng: 74.779767 },
];

const isInsidePolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
};

const checkAmritsar = (lat, lng) => {
  if (!lat || !lng) return false;
  const inside = isInsidePolygon({ lat, lng }, AMRITSAR_BOUNDS);
  setOutOfBounds(!inside);
  return inside;
};


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
const applyReferralCode = () => {
 const validCoupons = ["SP1852", "SP2633", "SP3677"];

const code = referralCode.trim().toUpperCase();

if (!validCoupons.includes(code)) {
  setReferralError("Invalid Coupon Code");
  setReferralDiscount(0);
  return;
}

  setReferralError("");
  setReferralDiscount(validCoupons[code]);
};
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
  const total = subtotal;

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
          coupon:referralCode.toUpperCase()  || "NULL",
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
  <div className="
    min-h-screen 
    bg-[#f8f9f5] 
    text-[#1A2421] 
    pb-44 
    font-sans 
    selection:bg-[#3A4D39]/20
  ">
    {/* --- PREMIUM 3D HEADER --- */}
   <header
  className="
    relative z-20
    px-5 pt-4 pb-10
    rounded-b-[2.5rem]
    bg-gradient-to-br from-[#1A2F25] via-[#2E4236] to-[#26352C]
    shadow-[0_15px_40px_rgba(0,0,0,0.18)]
    overflow-hidden
  "
>
  {/* Soft Ambient Glow */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
  <div className="absolute -bottom-12 -left-10 w-32 h-32 bg-black/20 blur-2xl rounded-full" />

  {/* Top Row */}
  <div className="flex items-center justify-between mb-6 relative z-10">
    <button
      onClick={() => router.back()}
      className="
        w-9 h-9
        bg-white/10
        backdrop-blur-md
        rounded-xl
        flex items-center justify-center
        border border-white/15
        text-white
        active:scale-90
        transition
      "
    >
      <ArrowRight size={16} className="rotate-180" />
    </button>

    <h1 className="text-[18px] font-bold tracking-tight text-white">
      Secure <span className="text-white">Checkout</span>
    </h1>

    <div className="w-9" />
  </div>

  {/* Compact Summary Card */}
  <div
    className="
      relative z-10
      bg-white/8
      backdrop-blur-lg
      rounded-2xl
      px-4 py-3
      border border-white/15
      shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
    "
  >
    <div className="flex items-center gap-3">
      <div className="relative w-9 h-9 rounded-xl
        bg-gradient-to-br from-white to-grey-100
        flex items-center justify-center
        shadow-md"
      >
        <ShoppingBag size={16} className="text-[#1A2F25]" />
      </div>

      <div className="leading-tight ">
        <p className="text-white text-[12px] font-semibold tracking-wide">
          {cart.length} Services Selected
        </p>
        <p className="text-white/50 text-[9px] uppercase tracking-widest">
          Verified Professionals
        </p>
      </div>
    </div>
  </div>
</header>

    {/* --- MAIN CONTENT (Mobile Optimized) --- */}
    <main className="max-w-md mx-auto px-5 -mt-6 relative z-30 space-y-6">
      
      {/* 1. RECIPIENT CARD */}
      <section className="
        bg-white/80 backdrop-blur-md
        rounded-[2.5rem] p-7
        border border-white/60
        shadow-[0_15px_40px_rgba(58,77,57,0.06)]
      ">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#3A4D39]/5 rounded-xl">
            <User size={16} className="text-[#3A4D39]" />
          </div>
          <h2 className="text-[15px] font-bold text-gray-800">Service Recipient</h2>
        </div>

        <div className="space-y-4">
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Resident name"
            className="!rounded-2xl"
          />
          <InputField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="10-digit mobile"
          />
        </div>
      </section>

      {/* 2. ORDER LIST CARD */}
      <section className="
        bg-white/80 backdrop-blur-md
        rounded-[2.5rem] p-7
        border border-white/60
        shadow-[0_15px_40px_rgba(58,77,57,0.06)]
      ">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Selected Care</p>
        <div className="space-y-3">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <div>
                <p className="text-[13px] font-bold text-gray-900">{item.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-medium">{item.title}</p>
              </div>
              <p className="text-[14px] font-black text-[#3A4D39]">₹{item.price}</p>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-3">
          <div className="flex justify-between text-[12px] font-medium text-gray-500">
            <span>Item Total</span>
            <span className="text-gray-900">₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-[12px] font-medium text-gray-500">
            <span>Platform Fee</span>
            <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">To Pay</p>
              <p className="text-2xl font-black text-[#1A2F25]">₹{subtotal.toFixed(0)}</p>
            </div>
            <div className="bg-[#F2F4ED] px-4 py-2 rounded-2xl flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#3A4D39]" />
              <span className="text-[9px] font-black text-[#3A4D39] uppercase">Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REFERRAL SECTION */}
      <section className="px-2">
        {!showReferralInput ? (
          <button 
            onClick={() => setShowReferralInput(true)}
            className="text-[11px] font-black uppercase tracking-widest text-[#3A4D39]/60 hover:text-[#3A4D39] flex items-center gap-2"
          >
            <Tag size={12} /> Have a Promo Code?
          </button>
        ) : (
          <div className="flex gap-2">
            <input 
              value={referralCode} 
              onChange={(e) => setReferralCode(e.target.value)} 
              placeholder="ENTER CODE"
              className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#3A4D39]/10"
            />
            <button onClick={applyReferralCode} className="bg-[#3A4D39] text-white px-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all">Apply</button>
          </div>
        )}
        {referralError && <p className="text-red-500 text-[9px] font-bold mt-2 uppercase px-1">{referralError}</p>}
      </section>
    </main>

    {/* --- STICKY MOBILE ACTION BAR --- */}
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-6 pb-10">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="flex-1 overflow-hidden" onClick={() => setShowMap(true)}>
          <div className="flex items-center gap-2">
            <MapPin size={12} className={!address ? "text-red-500" : "text-[#3A4D39]"} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${!address ? "text-red-500" : "text-gray-400"}`}>
              Service Spot
            </span>
          </div>
          <p className={`text-[12px] font-bold truncate mt-0.5 ${!address ? "text-red-500" : "text-gray-900"}`}>
            {address || "Locate on Map"}
          </p>
        </div>

        <button
          disabled={!address || !isRecipientValid}
          onClick={() => {
            if (!isRecipientValid) {
              setErrors({
                name: !name.trim() ? "Required" : "",
                phone: !/^\d{10}$/.test(phone) ? "Invalid" : ""
              });
              return;
            }
            setShowSlotPicker(true);
          }}
          className={`
            h-14 px-8 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all flex items-center gap-3
            ${!address || !isRecipientValid 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-br from-[#1A2F25] to-[#3A4D39] text-white shadow-[0_10px_30px_rgba(26,47,37,0.3)] active:scale-95"
            }
          `}
        >
          <span>Pick Slot</span>
          <ArrowRight size={16} className="text-[#f7b614]" />
        </button>
      </div>
    </div>

    {/* --- LOGIC COMPONENTS (MODALS & OVERLAYS) --- */}
    <AnimatePresence>
      {showMap && (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-white flex flex-col">
           {/* Map Header */}
           <div className="absolute top-6 left-6 right-6 z-10 flex justify-between">
              <button onClick={() => setShowMap(false)} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100"><X size={20} /></button>
           </div>
           <div className="flex-1 w-full relative">
              <UserMap setAddress={(addr, lat, lng) => { setAddress(addr); setPendingLocation({ lat, lng }); }} />
              {outOfBounds && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                  <AlertTriangle size={48} className="text-yellow-500 mb-4" />
                  <h2 className="text-white font-black text-2xl uppercase italic">Outside Amritsar</h2>
                  <button onClick={() => setOutOfBounds(false)} className="mt-8 px-10 py-4 bg-white rounded-xl font-black text-[10px] uppercase">Back</button>
                </div>
              )}
           </div>
           <div className="p-6 pb-10 bg-white border-t border-gray-100">
              <button 
                onClick={() => {
                  if (pendingLocation && checkAmritsar(pendingLocation.lat, pendingLocation.lng)) {
                    localStorage.setItem("user_address", JSON.stringify({ address, ...pendingLocation }));
                    setShowMap(false);
                  }
                }}
                className="w-full bg-[#1A2F25] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px]"
              >
                Confirm Service Location
              </button>
           </div>
        </motion.div>
      )}

      {(showSlotPicker || showPaymentModal || orderSuccess) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1A2F25]/60 backdrop-blur-md z-[998]"
          onClick={() => { setShowSlotPicker(false); setShowPaymentModal(false); }}
        />
      )}

      {/* Modern Slot Picker */}
    {showSlotPicker && (
  <motion.div
  initial={{ y: 80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 80, opacity: 0 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 28,
    mass: 0.8
  }}
  className="
    fixed bottom-0 left-1/2 -translate-x-1/2
    w-full max-w-[430px]
    bg-white
    rounded-t-[2.5rem]
    px-5 pt-5 pb-7
    z-[999]
    shadow-[0_-20px_50px_rgba(0,0,0,0.15)]
    will-change-transform
  "
>
    {/* Drag Indicator */}
    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

    {/* Title */}
    <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
      Choose Arrival Time
    </h2>
    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 mb-6">
      Arrives within 30 mins of slot
    </p>

    {/* Date Selector */}
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {next5Days.map((d, i) => {
        const value = format(d, "yyyy-MM-dd");
        const isSelected = date === value;

        return (
          <button
            key={i}
            onClick={() => setDate(value)}
            className={`
              min-w-[62px] h-[75px]
              rounded-2xl
              border
              flex flex-col items-center justify-center
              transition-all text-center
              ${
                isSelected
                  ? "bg-[#3A4D39] text-white border-[#3A4D39]"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }
            `}
          >
            <span className="text-[9px] font-semibold uppercase">
              {format(d, "EEE")}
            </span>
            <span className="text-[16px] font-bold">
              {format(d, "dd")}
            </span>
          </button>
        );
      })}
    </div>

    {/* Time Slots */}
    <div className="mt-6 grid grid-cols-3 gap-2">
      {getAvailableSlots().map((slot, i) => (
        <button
          key={i}
          onClick={() => setTimeSlot(slot)}
          className={`
            py-3
            rounded-xl
            border
            text-[10px] font-semibold
            transition-all
            ${
              timeSlot === slot
                ? "bg-[#3A4D39]/10 border-[#3A4D39] text-[#3A4D39]"
                : "bg-gray-50 border-gray-100 text-gray-400"
            }
          `}
        >
          {slot}
        </button>
      ))}
    </div>

    {/* CTA */}
    <button
      onClick={() => {
        if (date && timeSlot) {
          setShowSlotPicker(false);
          setShowPaymentModal(true);
        }
      }}
      disabled={!date || !timeSlot}
      className="
        mt-8
        w-full
        h-12
        rounded-2xl
        bg-gradient-to-br from-[#3A4D39] to-[#2f3a1f]
        text-white
        text-[11px]
        font-semibold
        uppercase tracking-widest
        shadow-lg
        transition-all
        active:scale-[0.97]
        disabled:opacity-30
      "
    >
      Confirm Appointment
    </button>
  </motion.div>
)}
{showPaymentModal && (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.96 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 26
    }}
    className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-[92%] max-w-[380px]
      bg-white/90 backdrop-blur-2xl
      rounded-[2rem]
      shadow-[0_30px_70px_rgba(0,0,0,0.15)]
      border border-white/60
      z-[999]
      px-6 pt-6 pb-7
    "
  >
    {/* Header */}
    <div className="mb-6">
      <h2 className="text-[18px] font-semibold tracking-tight text-gray-900">
        Select Payment
      </h2>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
        100% Secure Transaction
      </p>
    </div>

    {/* Payment Options */}
    <div className="space-y-2">
      {[
        { name: 'Google Pay', icon: Sparkles, color: 'text-blue-500', method: 'UPI' },
        { name: 'PhonePe', icon: CreditCard, color: 'text-purple-600', method: 'UPI' },
        { name: 'Pay after service', icon: ShieldCheck, color: 'text-[#3A4D39]', method: 'PAY_AFTER_SERVICE', bg: 'bg-[#F6F8F4]' }
      ].map((opt, i) => (
        <button
          key={i}
          onClick={() => {
            setPaymentMethod(opt.method);
            setShowPaymentModal(false);
            opt.method === 'UPI' ? startUpiPayment() : handleConfirm();
          }}
          className={`
            w-full flex items-center justify-between
            rounded-2xl
            px-4 py-4
            text-left
            border border-gray-100
            bg-white
            transition-all duration-200
            active:scale-[0.98]
            hover:shadow-md
            ${opt.bg || ""}
          `}
        >
          <div className="flex items-center gap-3">
            <opt.icon size={18} className={opt.color} />
            <span className="text-[13px] font-semibold text-gray-800">
              {opt.name}
            </span>
          </div>

          <ArrowRight size={14} className="text-gray-300" />
        </button>
      ))}
    </div>

    {/* Divider */}
    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

    {/* Back Button */}
    <button
      onClick={() => setShowPaymentModal(false)}
      className="
        mt-4
        w-full
        text-[10px]
        font-semibold
        uppercase tracking-widest
        text-gray-400
        hover:text-gray-600
        transition
      "
    >
      Cancel
    </button>
  </motion.div>
)}
      {/* Order Success Overlay */}
      {orderSuccess && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm bg-white rounded-[3rem] p-10 z-[1000] text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black italic mb-2 uppercase">Order Placed</h2>
          <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8">Your professional has been notified. Booking ID <span className="text-black font-black">#{orderId}</span></p>
          <button onClick={() => router.push("/")} className="w-full py-5 bg-[#1A2F25] text-white rounded-2xl font-black uppercase tracking-widest text-[11px]">Back to Explore</button>
        </motion.div>
      )}
    </AnimatePresence>

    <style jsx global>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      body { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.02em; }
    `}</style>
  </div>
);

}

