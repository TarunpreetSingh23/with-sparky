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

const INITIAL_TIMER = 20;

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
  <div className="min-h-screen bg-[#f7f8f6] flex flex-col items-center justify-center px-6 font-[Inter] overflow-hidden">

{/* SOFT BACKGROUND */}
<div className="absolute top-0 right-0 w-80 h-80 bg-rose-100 blur-[140px] opacity-40 rounded-full"/>
<div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100 blur-[140px] opacity-40 rounded-full"/>

<div className="w-full max-w-md relative">

<motion.div
initial={{ opacity:0, y:30 }}
animate={{ opacity:1, y:0 }}
className="
bg-white/80 backdrop-blur-xl
rounded-[2.2rem]
p-8
border border-neutral-200
shadow-[0_25px_70px_rgba(0,0,0,0.06)]
"
>

{/* HEADER */}
<div className="text-center mb-8">
<h1 className="text-lg font-semibold tracking-wide text-neutral-800">
Welcome to
<span className="ml-2 font-bold bg-gradient-to-r from-[#a61d33] to-[#ff7a59] bg-clip-text text-transparent">
SPARKY
</span>
</h1>

<p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mt-1">
{step==="otp" ? "Identity Verification" : "Salon Access"}
</p>
</div>

<AnimatePresence mode="wait">

{/* ================= PHONE ================= */}
{step==="phone" && (
<motion.div
key="phone"
initial={{opacity:0,x:20}}
animate={{opacity:1,x:0}}
exit={{opacity:0,x:-20}}
className="space-y-6"
>

<label className="text-[11px] uppercase tracking-widest text-neutral-500 flex justify-between">
Mobile Number
<Smartphone size={14} className="opacity-40"/>
</label>

<div className="relative">
<div className="absolute left-4 top-1/2 -translate-y-1/2 border-r pr-3 text-sm font-medium text-neutral-700">
+91
</div>

<input
type="tel"
maxLength="10"
value={phone}
onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))}
placeholder="Enter 10-digit number"
className="
w-full pl-14 pr-4 py-4
rounded-xl text-sm
bg-[#fafafa]
border border-neutral-200
focus:border-neutral-400
focus:bg-white
outline-none transition
"
/>
</div>

<button
onClick={()=>sendOtp("whatsapp")}
disabled={loading || phone.length!==10}
className={`w-full py-4 rounded-xl text-[11px]
uppercase tracking-[0.2em]
font-semibold text-white
flex items-center justify-center gap-2
transition-all duration-300
${
phone.length===10
? "bg-gradient-to-br from-[#1A2F25] to-[#0d1511] shadow-lg hover:shadow-2xl active:translate-y-[2px]"
: "bg-neutral-200 text-neutral-400 cursor-not-allowed"
}`}
>
{loading ? "Sending OTP..." :
<>
Send WhatsApp OTP
<ArrowRight size={14}/>
</>}
</button>

</motion.div>
)}

{/* ================= EMAIL ================= */}
{step==="email" && (
<motion.div
key="email"
initial={{opacity:0,x:15}}
animate={{opacity:1,x:0}}
exit={{opacity:0,x:-15}}
className="space-y-6"
>

<button
onClick={()=>setStep("phone")}
className="text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1 hover:text-neutral-700"
>
<ChevronLeft size={14}/> Back
</button>

<label className="text-[11px] uppercase tracking-widest text-neutral-500">
Email Address
</label>

<div className="relative">
<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="name@example.com"
className="
w-full px-5 py-4
rounded-xl text-sm
bg-[#fafafa]
border border-neutral-200
focus:border-neutral-400
focus:bg-white
outline-none transition
"
/>
<Mail size={16}
className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300"/>
</div>

<button
onClick={()=>sendOtp("email")}
disabled={loading}
className="
w-full py-4 rounded-xl
text-[11px]
uppercase tracking-[0.2em]
font-semibold text-white
bg-gradient-to-br from-[#3A4D39] to-[#1b2520]
shadow-lg hover:shadow-2xl
active:translate-y-[2px]
transition-all
"
>
{loading ? "Sending..." : "Request Email Link"}
</button>

</motion.div>
)}

{/* ================= OTP ================= */}
{step==="otp" && (
<motion.div
key="otp"
initial={{opacity:0,scale:.96}}
animate={{opacity:1,scale:1}}
className="space-y-7 text-center"
>

<div className="flex flex-col items-center">
<div className="px-4 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] tracking-widest">
{formatTime(timer)}
</div>

<p className="text-[10px] uppercase text-neutral-400 mt-2">
Enter code from message
</p>
</div>

<div className="relative">
<input
type="number"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
placeholder="••••"
className="
w-full py-5
text-center text-2xl
tracking-[0.6em]
rounded-xl
bg-[#fafafa]
border border-neutral-200
focus:border-neutral-400
outline-none
"
/>

<Lock size={16}
className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1 text-neutral-300"/>
</div>

<button
onClick={verifyOtp}
disabled={loading}
className="
w-full py-4 rounded-xl
text-[11px]
uppercase tracking-[0.2em]
font-semibold text-white
bg-gradient-to-r from-[#a61d33] to-[#ff7a59]
shadow-lg hover:shadow-2xl
active:translate-y-[2px]
transition-all
"
>
{loading ? "Verifying..." : "Confirm OTP"}
</button>

{/* TIMER LOGIC — UNCHANGED */}
{timer===0 && (
<div className="pt-2 flex justify-center gap-6">

{/* <button
onClick={()=>setStep("phone")}
className="text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2 hover:text-neutral-800"
>
<RefreshCcw size={12}/> Resend SMS
</button> */}

<button
  onClick={() => {
    setStep("email");
    setMessage("");
  }}
  className="text-[10px] uppercase tracking-widest text-[#a61d33] flex items-center gap-2"
>
  <Mail size={12}/> Try Email
</button>

</div>
)}

</motion.div>
)}

</AnimatePresence>

{/* MESSAGE */}
{message && (
<motion.div
initial={{opacity:0,y:5}}
animate={{opacity:1,y:0}}
className="
mt-6 p-3 rounded-xl
text-[10px]
uppercase tracking-widest
text-center border bg-neutral-50
"
>
{message}
</motion.div>
)}

</motion.div>
</div>
</div>
  );
}