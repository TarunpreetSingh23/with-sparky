"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Mail,
  RefreshCcw,
  Smartphone,
} from "lucide-react";

const INITIAL_TIMER = 10; // 2 minutes logic

export default function Login() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | email | otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  /* ---------------- Timer Logic ---------------- */
  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (num) => {
    const digits = num.replace(/\D/g, "");
    return `+91${digits.slice(-10)}`;
  };

  /* ---------------- Send OTP ---------------- */
  const sendOtp = async (method) => {
    if (method === "whatsapp" && phone.length !== 10) {
      setMessage("Enter a valid 10-digit phone number");
      return;
    }
    if (method === "email" && !email.includes("@")) {
      setMessage("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const endpoint = method === "whatsapp" ? "/api/send-otp" : "/api/send-email-otp";
      const body = method === "whatsapp" ? { phone: formatPhoneNumber(phone) } : { email };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setStep("otp");
      setTimer(INITIAL_TIMER);
      setMessage(`OTP sent via ${method === "whatsapp" ? "WhatsApp" : "Email"}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Verify OTP ---------------- */
  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      let endpoint = "";
      let payload = { otp };

      if (email) {
        endpoint = "/api/verify-email-otp";
        payload.email = email.trim().toLowerCase();
        if (phone) payload.phone = formatPhoneNumber(phone);
      } else if (phone) {
        endpoint = "/api/verify-otp";
        payload.phone = formatPhoneNumber(phone);
      } else {
        throw new Error("No email or phone provided");
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      router.push("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center px-4 font-sans selection:bg-blue-100">
      <div className="w-full max-w-md mt-10">
        
        {/* Top Action */}
        {/* <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all"
          >
            Explore App <ArrowRight size={14} />
          </button>
        </div> */}

        {/* Main Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden"
        >
          {/* Brand Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500" />

          <div className="text-center mb-10">
            <motion.div 
              key={step}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-5 border border-blue-100/50"
            >
              {step === "email" ? (
                <Mail className="text-blue-600" size={28} />
              ) : step === "otp" ? (
                <ShieldCheck className="text-blue-600" size={28} />
              ) : (
                <MessageSquare className="text-blue-600" size={28} />
              )}
            </motion.div>
            <h1 className="text-[#030712] text-2xl font-black tracking-tight mb-2 uppercase italic">Secure Access</h1>
            <p className="text-slate-400 text-sm font-medium">
              Verify your identity to continue
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
                        <span className="text-slate-400 font-bold text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-16 pr-5 py-4.5 rounded-2xl bg-slate-50 text-[#030712] border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all text-base shadow-inner"
                      placeholder="00000 00000"
                    />
                  </div>
                </div>

                <button
                  onClick={() => sendOtp("whatsapp")}
                  disabled={loading}
                  className="w-full py-5 bg-[#030712] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Initializing..." : <>Get OTP on WhatsApp <ArrowRight size={16}/></>}
                </button>
                
                {/* <div className="pt-2">
                    <button 
                      onClick={() => setStep("email")}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Use email address instead
                    </button>
                </div> */}
              </motion.div>
            )}

            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setStep("phone")}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 hover:text-blue-600 transition-all"
                >
                  <ChevronLeft size={14} /> Back to Phone
                </button>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4.5 rounded-2xl bg-slate-50 text-[#030712] border border-slate-200 focus:border-blue-500 focus:bg-white outline-none font-bold transition-all text-base shadow-inner"
                    placeholder="name@example.com"
                  />
                </div>

                <button
                  onClick={() => sendOtp("email")}
                  disabled={loading}
                  className="w-full py-5 bg-[#030712] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                >
                  {loading ? "Sending..." : "Request Email Link"}
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8 text-center"
              >
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-blue-600 font-black text-xs tracking-widest">{formatTime(timer)}</span>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Verification Code</label>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-5 py-5 text-center tracking-[0.8em] rounded-3xl bg-slate-50 text-[#030712] border border-slate-200 focus:border-blue-500 focus:bg-white outline-none font-black text-2xl transition-all shadow-inner"
                    placeholder="••••"
                  />
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
                >
                  {loading ? "Verifying..." : "Confirm & Login"}
                </button>

                {timer === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep("email")}
                      className="py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 flex justify-center items-center gap-2 hover:bg-slate-100 transition-all"
                    >
                      <Mail size={14} /> Try Email
                    </button>

                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setMessage("");
                      }}
                      className="py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 flex justify-center items-center gap-2 hover:bg-slate-100 transition-all"
                    >
                      <RefreshCcw size={14} /> Change No.
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                message.toLowerCase().includes('failed') || message.toLowerCase().includes('valid') || message.toLowerCase().includes('invalid')
                ? 'bg-red-50 border-red-100 text-red-500' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        {/* Trust Footer */}
        <div className="mt-12 flex justify-center items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="h-px w-12 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-blue-600">
             <ShieldCheck size={16} /> Secure
          </div>
          <div className="h-px w-12 bg-slate-200" />
        </div>
      </div>
    </div>
  );
}