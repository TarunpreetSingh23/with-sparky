"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Mail,
  RefreshCcw,
  Smartphone,
  Lock,
} from "lucide-react";
import Image from "next/image";

const INITIAL_TIMER = 120;

export default function Login() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const router = useRouter();

  // Theme Colors
  const SAGA_GREEN = "#3A4D39";
  const SAGA_MAROON = "#a61d33";

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
        if (phone) payload.phone = phone;
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
    <div className="min-h-screen bg-[#fbfcfa] flex flex-col items-center px-6 font-sans overflow-hidden">
      
      {/* 1. BRAND LOGO */}
      <div className="mt-16 mb-12 text-center">
        <Image 
          src="/images/wLogo.png" 
          alt="Saga Logo" 
          width={150} 
          height={50} 
          className="object-contain mx-auto" 
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f2f4ed] rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-60" />

        {/* 2. AUTH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(58,77,57,0.08)] border border-[#f1f3eb] relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className="text-2xl font-[1000] text-[#1A2421] tracking-tight italic uppercase">
               Welcome to <span className="text-[#a61d33]">SPARKY</span>
            </h1>
            <p className="text-[#4F6F52] text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">
              {step === "otp" ? "Identity Verification" : "Salon Access"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-[1000] uppercase tracking-widest text-[#3A4D39]">Mobile Number</label>
                    <Smartphone size={14} className="text-[#E0E5D2]" />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-[#f1f3eb] pr-3">
                        <span className="text-[#3A4D39] font-[1000] text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[#fbfcfa] text-[#1A2421] border-2 border-[#f1f3eb] focus:border-[#3A4D39] focus:bg-white outline-none font-[1000] transition-all text-lg tracking-wider"
                      placeholder="00000 00000"
                    />
                  </div>
                </div>

                <button
                  onClick={() => sendOtp("whatsapp")}
                  disabled={loading}
                  className="w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-[#3a4d39]/30 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Initializing..." : (
                    <>
                      Send WhatsApp OTP 
                      <ArrowRight size={16} className="text-[#f7b614]" />
                    </>
                  )}
                </button>
                
                {/* <button 
                  onClick={() => setStep("email")}
                  className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#a61d33] hover:opacity-70 transition-opacity"
                >
                  Use email instead
                </button> */}
              </motion.div>
            )}

            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setStep("phone")}
                  className="text-[10px] font-[1000] uppercase tracking-widest text-gray-400 flex items-center gap-2 hover:text-[#3A4D39] transition-all"
                >
                  <ChevronLeft size={14} /> Back to Phone
                </button>

                <div className="space-y-3">
                  <label className="text-[10px] font-[1000] uppercase tracking-widest text-[#3A4D39] px-1">Email ID</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-[#fbfcfa] text-[#1A2421] border-2 border-[#f1f3eb] focus:border-[#3A4D39] focus:bg-white outline-none font-[1000] transition-all text-base"
                      placeholder="name@example.com"
                    />
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-[#E0E5D2]" size={18} />
                  </div>
                </div>

                <button
                  onClick={() => sendOtp("email")}
                  disabled={loading}
                  className="w-full py-5 bg-[#3A4D39] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-[#3a4d39]/30 active:scale-95 transition-all"
                >
                  {loading ? "Sending..." : "Request Email Link"}
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-[#f2f4ed] px-5 py-2 rounded-full border border-[#E0E5D2] flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#a61d33] animate-pulse" />
                    <span className="text-[#3A4D39] font-[1000] text-xs tracking-widest">{formatTime(timer)}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Enter code from message</p>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-6 py-6 text-center tracking-[0.8em] rounded-[1.5rem] bg-[#fbfcfa] text-[#1A2421] border-2 border-[#f1f3eb] focus:border-[#3A4D39] focus:bg-white outline-none font-[1000] text-3xl transition-all shadow-inner"
                    placeholder="••••"
                  />
                  <Lock className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[#E0E5D2]" size={20} />
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full py-5 bg-[#a61d33] text-white rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-rose-200 active:scale-95 transition-all"
                >
                  {loading ? "Verifying..." : "Confirm Otp"}
                </button>

                {timer === 0 && (
                  <div className="pt-2 flex justify-center gap-6">
                    <button onClick={() => setStep("phone")} className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-[#3A4D39] flex items-center gap-2">
                      <RefreshCcw size={12} /> Resend SMS
                    </button>
                    <button onClick={() => setStep("email")} className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-[#a61d33] flex items-center gap-2">
                      <Mail size={12} /> Try Email
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-4 rounded-2xl text-center text-[10px] font-[1000] uppercase tracking-widest border ${
                message.toLowerCase().includes('fail') || message.toLowerCase().includes('valid')
                ? 'bg-rose-50 border-rose-100 text-[#a61d33]' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-700'
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        {/* 3. TRUST FOOTER */}
        {/* <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-[#4F6F52] opacity-40">
            <div className="h-[1px] w-8 bg-[#4F6F52]" />
            <span className="text-[9px] font-[1000] uppercase tracking-[0.3em]">Secure Saga Protocol</span>
            <div className="h-[1px] w-8 bg-[#4F6F52]" />
          </div>
          <div className="flex items-center gap-6 opacity-20">
             <ShieldCheck size={20} className="text-[#3A4D39]" />
             <Lock size={20} className="text-[#3A4D39]" />
          </div>
        </div> */}
      </div>
    </div>
  );
}