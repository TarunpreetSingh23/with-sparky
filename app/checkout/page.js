"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  User, Phone, MapPin, Calendar, Clock, ShoppingCart, 
  Tag, CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, Zap 
} from "lucide-react";

const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });

/* ------------------ Professional Input Component ------------------ */
const InputField = ({ label, type = "text", value, onChange, error, placeholder, icon: Icon, disabled }) => (
  <div className="flex flex-col group w-full">
    <label className="text-gray-400 mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2">
      {Icon && <Icon size={13} />} {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-5 py-4 rounded-2xl border bg-[#111827]/50 text-[15px] font-medium outline-none transition-all duration-300
        ${error ? "border-red-500/50" : "border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"}
        ${disabled ? "opacity-70 cursor-not-allowed" : ""}
      `}
    />
    {error && <span className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{error}</span>}
  </div>
);

export default function Checkout() {
  const router = useRouter();

  /* ================= JWT USER ================= */
  const [user, setUser] = useState(null);

  /* ================= STATE ================= */
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
const [invoiceUrl, setInvoiceUrl] = useState("");
const [orderId, setOrderId] = useState("");

//    useEffect(() => {
//       if (!loading) {
//         window.scrollTo(0, 0);
//       }
//     }, [loading]);
  /* ================= AUTH CHECK (JWT) ================= */
  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          setPhone(data.user.phone);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  /* ================= CART ================= */
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  /* ================= PRICE ================= */
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  /* ================= VALIDATION ================= */
  const validateStep = () => {
    const e = {};
    if (step === 1 && !name.trim()) e.name = "Name is required";
    if (step === 2) {
      if (!address.trim()) e.address = "Address is required";
      if (!/^\d{6}$/.test(pincode)) e.pincode = "6-digit PIN required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => validateStep() && setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  /* ================= CONFIRM ================= */
  const handleConfirm = async () => {
    if (!validateStep()) return;
    if (!cart.length) return alert("Cart is empty");
    if (!user) return router.push("/login");
    if (!date || !timeSlot) return alert("Please select date and time slot");

    setIsPlacingOrder(true);

    const formattedCart = cart.map((item) => ({
      name: item.title || item.serviceName,
      price: item.price || item.cost || 0,
      quantity: item.quantity || 1,
      category: item.category || "general",
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: formattedCart,
          subtotal,
          discount,
          total,
          customerName: name,
          phone: user.phone,
          address,
          pincode,
          date,
          timeSlot,
          paymentMethod: "Pay After Service",
          status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

     setOrderSuccess(true);
setInvoiceUrl(data.invoiceUrl);
setOrderId(data.orderId);

localStorage.removeItem("cart");
setCart([]);

      router.push("/");
    } catch (err) {
      alert("Failed to place order: " + (err.message || "An unknown error occurred."));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  /* ================= TIME LOGIC ================= */
  const isSlotDisabled = (slot) => {
    if (date !== format(new Date(), "yyyy-MM-dd")) return false;
    const [_, end] = slot.split(" - ");
    const [h, m] = end.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(h, m, 0, 0);
    return endTime <= new Date(Date.now() + 30 * 60000);
  };

  const next5Days = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const slots = [
    "09:00 - 10:00", "10:30 - 11:30", "12:00 - 13:00",
    "13:30 - 14:30", "15:00 - 16:00", "16:30 - 17:30"
  ];

  return (
    <div className="min-h-screen bg-[#030712] pb-20 font-sans text-white overflow-x-hidden selection:bg-blue-500/30">
      {orderSuccess && (
  <div className="fixed inset-0 z-[100] bg-[#030712] flex items-center justify-center px-6">
    <div className="max-w-md w-full bg-[#111827] border border-white/10 rounded-[32px] p-8 text-center shadow-2xl">
      
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 size={32} className="text-emerald-500" />
      </div>

      <h2 className="text-2xl font-black mb-2">Order Confirmed</h2>
      <p className="text-gray-400 text-sm mb-6">
        Your order <span className="font-bold text-white">{orderId}</span> has been placed successfully.
      </p>

      {/* DOWNLOAD INVOICE */}
      <a
        href={invoiceUrl}
        target="_blank"
        className="block w-full py-4 mb-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-[13px] transition-all"
      >
        Download Invoice
      </a>

      {/* GO HOME */}
      <button
        onClick={() => router.push("/")}
        className="w-full py-3 text-gray-400 hover:text-white font-bold uppercase tracking-widest text-[11px]"
      >
        Go to Home
      </button>
    </div>
  </div>
)}

      {/* 💎 Stepper Header */}
      <div className="bg-[#030712]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between relative">
          <div className="absolute left-0 w-full h-[2px] bg-white/5 top-[20px] -z-10" />
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${step === s ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-110" : step > s ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400 opacity-40"}`}>
                {step > s ? <CheckCircle2 size={18}/> : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider ${step === s ? "text-blue-500" : "text-gray-600"}`}>
                {s === 1 ? "User" : s === 2 ? "Spot" : "Time"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
        
        {/* 🚀 Step Forms */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-5">
                 <button onClick={nextStep} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[13px] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Next: Set Location <ArrowRight size={18}/>
              </button>
              <div className="space-y-3">
                <h2 className="text-2xl text-center font-bold tracking-tight">Customer Information</h2>
                {/* <p className="text-gray-500 text-[15px] font-medium">Verify your contact details for service coordination.</p> */}
              </div>
              <div className="bg-[#111827]/40 rounded-[32px] p-6 md:p-8 border border-white/5 space-y-10">
                <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Enter your name" icon={User} />
                <InputField label="Mobile Number" type="tel" value={phone} disabled={true} icon={Phone} />
              </div>
              {/* <button onClick={nextStep} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[13px] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Next: Set Location <ArrowRight size={18}/>
              </button> */}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase tracking-widest hover:text-white mb-2 transition-colors">
                <ChevronLeft size={16}/> Back
              </button>
               <button onClick={nextStep} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[13px] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Next: Select Time <ArrowRight size={18}/>
              </button>
            
              <div className="space-y-3">
                <h2 className="text-2xl text-center font-bold tracking-tight">Address Details</h2>
                {/* <p className="text-gray-500 text-[15px] font-medium">Where should our professional arrive?</p> */}
              </div>
              <div className="bg-[#111827]/40 rounded-[32px] p-8 md:p-10 border border-white/5 space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Complete Address</label>
                  <textarea rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Apt, Landmark, Area..." 
                    className="w-full p-6 rounded-2xl bg-[#111827]/80 border border-white/10 focus:border-blue-500 outline-none font-medium transition-all text-[15px] text-white" />
                  {errors.address && <span className="text-red-500 text-[10px] font-bold uppercase">{errors.address}</span>}
                </div>
                <InputField label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} error={errors.pincode} placeholder="6-digit PIN" icon={MapPin} />
                <button onClick={() => setShowMap(!showMap)} className="w-full py-4 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  {showMap ? "Hide Map View" : "Pin precise location on Map"}
                </button>
                {showMap && <div className="h-full rounded-3xl overflow-hidden border border-white/10 transition-all"><UserMap setAddress={setAddress}/></div>}
              </div>
             
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase tracking-widest hover:text-white mb-2 transition-colors">
                <ChevronLeft size={16}/> Back
              </button>
                            <button onClick={handleConfirm} disabled={isPlacingOrder} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                {isPlacingOrder ? "Placing Order..." : <>Confirm & Reserve <CheckCircle2 size={18}/></>}
              </button>
              <div className="space-y-3">
                <h2 className="text-2xl text-center font-bold tracking-tight">Booking Window</h2>
                {/* <p className="text-gray-500 text-[15px] font-medium">Select a time that suits your schedule.</p> */}
              </div>
              <div className="bg-[#111827]/40 rounded-[32px] p-8 md:p-10 border border-white/5 space-y-12">
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {next5Days.map((d, i) => {
                    const formatted = format(d, "yyyy-MM-dd");
                    const activeDate = date === formatted;
                    return (
                      <button key={i} onClick={() => setDate(formatted)}
                        className={`flex-shrink-0 w-15 h-19 rounded-3xl flex flex-col items-center justify-center transition-all border duration-300
                        ${activeDate ? "bg-blue-600 border-blue-500 shadow-xl" : "bg-[#030712] border-white/10 text-gray-500 hover:border-white/20"}`}>
                        <span className="text-[10px] font-bold uppercase mb-1">{format(d, "EEE")}</span>
                        <span className="text-2xl font-black">{format(d, "dd")}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((slot, i) => {
                    const disabled = isSlotDisabled(slot);
                    const activeSlot = timeSlot === slot;
                    return (
                      <button key={i} disabled={disabled} onClick={() => setTimeSlot(slot)}
                        className={`py-4 rounded-2xl font-bold text-[12px] transition-all border duration-300
                        ${disabled ? "opacity-10 cursor-not-allowed" : activeSlot ? "bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/10" 
                        : "bg-[#030712] border-white/10 text-gray-400 hover:border-blue-500"}`}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* <button onClick={handleConfirm} disabled={isPlacingOrder} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                {isPlacingOrder ? "Placing Order..." : <>Confirm & Reserve <CheckCircle2 size={18}/></>}
              </button> */}
            </div>
          )}
        </div>

        {/* 🧾 Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-40 space-y-8">
            <div className="bg-[#111827] rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <ShoppingCart size={20} className="text-blue-500" /> Cart Summary
              </h2>
              <div className="space-y-6">
                <div className="max-h-56 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="w-3/4">
                        <p className="font-bold text-[13px] text-gray-200 line-clamp-1 uppercase tracking-tight">{item.name || item.title}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase mt-1">Verified Pro Session</p>
                      </div>
                      <span className="font-black text-blue-400 text-sm">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 space-y-4 border-t border-white/5 font-medium">
                  <div className="flex justify-between text-[11px] text-gray-500 uppercase font-black">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-400 uppercase font-black">
                    <span className="flex items-center gap-1.5"><Tag size={12}/> Applied Promo</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-[11px] font-black uppercase text-gray-400">Total</span>
                    <span className="text-4xl font-black tracking-tighter">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/5 p-8 rounded-[32px] border border-blue-500/10 flex items-center gap-5 transition-colors hover:bg-blue-600/10">
              <div className="bg-blue-600/20 p-3.5 rounded-2xl"><ShieldCheck size={22} className="text-blue-500"/></div>
              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">Safety protocols active: Professional ID verification required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}