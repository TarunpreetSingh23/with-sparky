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
} from "lucide-react";

const INITIAL_TIMER = 10; // 2 minutes

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

      const endpoint =
        method === "whatsapp" ? "/api/send-otp" : "/api/send-email-otp";

      const body =
        method === "whatsapp"
          ? { phone: formatPhoneNumber(phone) }
          : { email };

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

    // 📧 Email OTP flow (SEND PHONE ALSO)
    if (email) {
      endpoint = "/api/verify-email-otp";
      payload.email = email.trim().toLowerCase();

      if (phone) {
        payload.phone = formatPhoneNumber(phone);
      }
    }

    // 📱 Phone / WhatsApp OTP flow
    else if (phone) {
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
    if (!res.ok) {
      throw new Error(data.error || "Invalid OTP");
    }

    // ✅ Login success
    router.push("/");
  } catch (err) {
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-[#030712] flex justify-center px-4">
      <div className="w-full max-w-md mt-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-white text-xs font-black uppercase flex items-center gap-2"
          >
            Skip <ArrowRight size={14} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              {step === "email" ? (
                <Mail className="text-blue-500" />
              ) : (
                <MessageSquare className="text-blue-500" />
              )}
            </div>
            <h1 className="text-white text-2xl font-bold">Secure Login</h1>
            <p className="text-gray-400 text-sm">
              Verify your account to continue
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
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-4 rounded-xl bg-[#111827] text-white border border-white/10"
                  placeholder="10-digit phone number"
                />

                <button
                  onClick={() => sendOtp("whatsapp")}
                  disabled={loading}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold"
                >
                  {loading ? "Sending..." : "Get OTP on WhatsApp"}
                </button>
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
                  className="text-xs text-blue-400 flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Back
                </button>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-[#111827] text-white border border-white/10"
                  placeholder="name@example.com"
                />

                <button
                  onClick={() => sendOtp("email")}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
                >
                  {loading ? "Sending..." : "Send Email OTP"}
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 text-center"
              >
                <div className="text-2xl font-mono font-bold text-blue-500">
                  {formatTime(timer)}
                </div>

                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 text-center tracking-widest rounded-xl bg-[#111827] text-white border border-white/10"
                  placeholder="Enter OTP"
                />

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
                >
                  {loading ? "Verifying..." : "Confirm & Login"}
                </button>

                {timer === 0 && (
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={() => setStep("email")}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex justify-center gap-2"
                    >
                      <Mail size={14} /> Login via Email
                    </button>

                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setMessage("");
                      }}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex justify-center gap-2"
                    >
                      <RefreshCcw size={14} /> Change Number
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <p className="mt-4 text-center text-xs font-bold text-red-400">
              {message}
            </p>
          )}
        </motion.div>

        <div className="mt-6 flex justify-center items-center gap-2 text-gray-500 text-xs">
          <ShieldCheck size={14} className="text-blue-500" />
          Multi-Channel Secure Verification
        </div>
      </div>
    </div>
  );
}
