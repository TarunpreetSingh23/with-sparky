"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogIn, UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";

// Refined Input field component
const InputField = ({ label, type = "text", value, onChange, required, icon: Icon, placeholder }) => (
  <label className="block w-full group">
    <div className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors group-focus-within:text-blue-400">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </div>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-2xl border border-white/5 bg-[#111827]/60 text-white placeholder-gray-600 
                   focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300"
      />
    </div>
  </label>
);

const formVariants = {
  enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction) => ({ x: direction < 0 ? 30 : -30, opacity: 0, scale: 0.98, transition: { duration: 0.2 } }),
};

export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const changeMode = (newMode) => {
    setDirection(newMode === "signup" ? 1 : -1);
    setMode(newMode);
    setError("");
    setSuccess("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    
    // Simulate Logic - You would keep your existing handleSignUp/handleLogin logic here
    setTimeout(() => {
        setLoading(false);
        setSuccess("Redirecting...");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#030712] flex items-center justify-center py-10 px-4 relative overflow-hidden selection:bg-blue-500/30">
      {/* 🌌 High-End Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/10 relative z-10">
        
        {/* Left Panel: Visual/Brand Content */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <ShieldCheck className="w-12 h-12 text-white mb-8" />
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Elite Home <br /> Services.
            </h1>
            <p className="text-blue-100/80 text-lg font-medium leading-relaxed max-w-xs">
              Access verified professionals for your home, beauty, and events with one secure account.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 py-3 px-6 text-sm font-bold text-white rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </div>

        {/* Right Panel: The Forms */}
        <div className="p-8 sm:p-14 flex flex-col justify-center">
          {/* Custom App-Style Switcher */}
          <div className="flex bg-[#111827] p-1.5 rounded-2xl mb-10 border border-white/5">
            {["signup", "login"].map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                  mode === m ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {m === "signup" ? "Create" : "Sign In"}
              </button>
            ))}
          </div>

          <div className="relative min-h-[420px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.form
                key={mode}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onSubmit={handleAuth}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                    {mode === "signup" ? "Get Started" : "Welcome Back"}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">
                    {mode === "signup" ? "Enter your details to create an account" : "Please sign in to continue"}
                  </p>
                </div>

                {mode === "signup" && (
                  <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} placeholder="Choose your handle" />
                )}
                
                <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} placeholder="name@example.com" />
                
                <div className="space-y-2">
                    <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} placeholder="••••••••" />
                    {mode === "login" && (
                        <p className="text-[11px] text-right text-blue-400 font-bold uppercase tracking-wider cursor-pointer hover:text-blue-300 transition">Forgot Password?</p>
                    )}
                </div>

                {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">{error}</div>}
                {success && <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">{success}</div>}

                <motion.button 
                  type="submit" 
                  disabled={loading} 
                  className="mt-2 w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
                </motion.button>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}