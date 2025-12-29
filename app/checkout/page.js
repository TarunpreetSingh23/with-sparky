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
    <label className="text-gray-400 mb-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
      {Icon && <Icon size={12} className="text-blue-600" />} {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-5 py-3.5 rounded-2xl border bg-white text-[15px] font-bold text-[#030712] outline-none transition-all duration-300
        ${error ? "border-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"}
        ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : ""}
      `}
    />
    {error && <span className="text-red-500 text-[9px] mt-1.5 font-black uppercase ml-1">{error}</span>}
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
  const [phone, setPhone] = useState(""); // Now editable
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
          // Set initial values from cookie data
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
          customerName: name,loginPhone:loginPhone, phone: phone, // Uses the current (potentially edited) state
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

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-32 font-sans text-[#030712] selection:bg-blue-100">
      
      {/* Success Overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center px-6">
          <div className="max-w-sm w-full text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black mb-2 tracking-tighter">Booking Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-8 px-4 font-medium">Your request for <span className="font-bold text-black">{orderId}</span> is scheduled.</p>
            <a href={invoiceUrl} target="_blank" className="block w-full py-4 bg-[#030712] text-white rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl text-center">Download Receipt</a>
            <button onClick={() => router.push("/")} className="w-full mt-4 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center">Go to Home</button>
          </div>
        </div>
      )}

      {/* Header Stepper */}
      <div className="bg-white sticky top-0 z-40 px-4 py-5 border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between px-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300
                ${step === s ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : step > s ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                {step > s ? <CheckCircle2 size={16}/> : s}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${step === s ? "text-blue-600" : "text-gray-400"}`}>
                {s === 1 ? "Details" : s === 2 ? "Location" : "Schedule"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black tracking-tight">Personal Info</h2>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><User size={20}/></div>
              </div>
              <div className="space-y-6">
                <InputField 
                  label="Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  error={errors.name} 
                  placeholder="Type your name" 
                  icon={User}
                />
                <InputField 
                  label="Mobile Number" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} // User can now edit this
                  error={errors.phone}
                  placeholder="10-digit mobile number" 
                  icon={Phone} 
                />
              </div>
              <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-lg shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all text-center">
                Continue to Address <ArrowRight size={18}/>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <button onClick={prevStep} className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 ml-2">
                <ChevronLeft size={14}/> Back
              </button>
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-8">
                <h2 className="text-xl font-black tracking-tight">Service Address</h2>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Complete Address</label>
                  <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House No, Landmark, Area..." 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none font-bold text-[#030712] transition-all text-sm" />
                  {errors.address && <span className="text-red-500 text-[9px] font-black uppercase">{errors.address}</span>}
                </div>
                <InputField label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} error={errors.pincode} placeholder="6-digit PIN" icon={MapPin} />
                <button onClick={() => setShowMap(!showMap)} className="w-full py-3 bg-gray-50 text-[#030712] border border-gray-200 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 text-center">
                  {showMap ? "Hide Map" : "Open Map Selection"}
                </button>
                {showMap && <div className="rounded-2xl overflow-hidden border border-gray-100 h-64"><UserMap setAddress={setAddress}/></div>}
                <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-lg flex items-center justify-center gap-3 text-center">
                  Continue to Schedule <ArrowRight size={18}/>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <button onClick={prevStep} className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-widest ml-2">
                <ChevronLeft size={14}/> Back
              </button>
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-10">
                <h2 className="text-xl font-black tracking-tight">Select Slot</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {next5Days.map((d, i) => (
                    <button key={i} onClick={() => setDate(format(d, "yyyy-MM-dd"))}
                      className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border text-center transition-all
                      ${date === format(d, "yyyy-MM-dd") ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-gray-100 text-gray-400"}`}>
                      <span className="text-[9px] font-black uppercase mb-1">{format(d, "EEE")}</span>
                      <span className="text-xl font-black">{format(d, "dd")}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {slots.map((slot, i) => (
                    <button key={i} onClick={() => setTimeSlot(slot)}
                      className={`py-3.5 rounded-xl font-bold text-[12px] border text-center transition-all
                      ${timeSlot === slot ? "bg-[#030712] text-white" : "bg-white border-gray-100 text-gray-500"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
                <button onClick={handleConfirm} disabled={isPlacingOrder} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-lg flex items-center justify-center gap-3 text-center">
                  {isPlacingOrder ? "Working..." : <>Confirm & Reserve <CheckCircle2 size={18}/></>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-400">
                <ShoppingCart size={16} className="text-blue-600" /> Cart Summary
              </h2>
              <div className="space-y-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex-1"><p className="font-bold text-[12px] text-[#030712] truncate">{item.name || item.title}</p></div>
                    <span className="font-black text-[#030712] text-sm ml-4">₹{item.price}</span>
                  </div>
                ))}
                <div className="pt-6 space-y-3 border-t border-gray-50">
                  <div className="flex justify-between items-center font-black">
                    <span className="text-[11px] uppercase text-gray-400">Grand Total</span>
                    <span className="text-3xl tracking-tighter text-[#030712]">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-[28px] border border-blue-100 flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm"><ShieldCheck size={20} className="text-blue-600"/></div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Verified Pros • Safe Service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}