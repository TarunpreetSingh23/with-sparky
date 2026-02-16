"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Send, ChevronDown, ShieldCheck, Headphones, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

/* ================= FAQ ITEM (SAGA STYLE) ================= */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-[#f1f3eb] transition-all duration-500 ${open ? "bg-[#fbfcfa]" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-7 px-6 text-left transition-all"
      >
        <span className="text-[#1A2421] font-[1000] text-sm md:text-base tracking-tight italic uppercase">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${open ? "bg-[#3A4D39] text-white rotate-180 shadow-lg" : "bg-[#f2f4ed] text-[#3A4D39]"}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {open && (
        <div className="px-6 pb-8 animate-in fade-in slide-in-from-top-3 duration-500">
          <p className="text-[13px] text-[#4F6F52] leading-relaxed font-bold opacity-80 border-l-2 border-[#E0E5D2] pl-4 italic">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================= SUPPORT PAGE ================= */
export default function SupportPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Concierge notified successfully");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        router.push("/");
      } else {
        toast.error("Failed to reach concierge");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
   <section className="min-h-screen bg-[#fafafa] text-[#1c1c1c] py-12 font-sans">
  <div className="max-w-5xl mx-auto px-4">

    {/* ========= HEADER ========= */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full 
        border border-gray-200 shadow-sm">
        <Headphones size={13} className="text-gray-600" />
        <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
          Support
        </span>
      </div>

      <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
        How can we{" "}
        <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
          assist
        </span>{" "}
        you?
      </h1>
    </div>

    {/* ========= CONTACT CARD ========= */}
    <div className="max-w-2xl mx-auto mb-16">
      <div className="bg-white p-8 rounded-3xl border border-gray-100
        shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl 
            bg-gradient-to-br from-gray-900 to-gray-600
            flex items-center justify-center
            shadow-md shadow-black/10">
            <MessageSquare size={18} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            Send a Message
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50
              border border-gray-200 focus:bg-white
              focus:border-gray-900 outline-none transition"
            />
            <input
              required
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50
              border border-gray-200 focus:bg-white
              focus:border-gray-900 outline-none transition"
            />
          </div>

          <input
            required
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-gray-50
            border border-gray-200 focus:bg-white
            focus:border-gray-900 outline-none transition"
          />

          <textarea
            required
            rows={4}
            placeholder="Your message..."
            className="w-full px-4 py-3 rounded-xl bg-gray-50
            border border-gray-200 focus:bg-white
            focus:border-gray-900 outline-none transition resize-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-gray-900 to-gray-700
            text-white font-semibold tracking-wide
            shadow-lg shadow-black/10
            hover:opacity-90 transition active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Dispatch Message"}
          </button>

        </form>
      </div>
    </div>

    {/* ========= FAQ ========= */}
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-gray-100
        shadow-[0_15px_40px_rgba(0,0,0,0.05)] overflow-hidden">

        <div className="p-8 text-center border-b border-gray-100">
          <h2 className="text-2xl font-semibold tracking-tight">
            Support Center
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Frequently Asked Questions
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          <FAQItem question="Do I need to sign up?" answer="No. Browse freely. Login is required only during checkout." />
          <FAQItem question="How do I book?" answer="Select service → verify → choose time → confirm." />
          <FAQItem question="Will I receive invoice?" answer="Yes. A digital invoice is sent instantly." />
        </div>

      </div>
    </div>

  </div>
</section>

  );
}