"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Send, Bell, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

/* ================= FAQ ITEM ================= */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-slate-100 transition-all ${open ? "bg-slate-50/50" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-6 px-4 text-left transition-all"
      >
        <span className="text-[#030712] font-bold text-sm md:text-base tracking-tight">
          {question}
        </span>
        <div className={`p-1 rounded-full transition-transform duration-300 ${open ? "bg-blue-100 text-blue-600 rotate-180" : "text-slate-400"}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
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
        toast.success("Message sent successfully");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        router.push("/");
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] text-[#030712] py-12 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* ================= FAQ SECTION ================= */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-50 text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
                Support Center
              </h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                Frequently Asked Questions
              </p>
            </div>

            <div className="divide-y divide-slate-50 px-2 pb-4">
              <FAQItem question="Do I need to sign up to view services?" answer="No. You can browse all services without signing up. Login is required only at checkout." />
              <FAQItem question="How do I book a service?" answer="Select a service, verify your phone number via OTP, choose date, time, and location, and confirm your booking." />
              <FAQItem question="How is my location captured?" answer="We use Google Maps for precise location selection to ensure smooth service delivery." />
              <FAQItem question="Will I receive an invoice?" answer="Yes. Once your booking is confirmed, an invoice is automatically sent to your WhatsApp." />
              <FAQItem question="Can I track my service after booking?" answer="Yes. You can track the professional in real time until they arrive at your location." />
              <FAQItem question="What payment methods are accepted?" answer="We support UPI, debit/credit cards, net banking, and other digital payment options." />
            </div>
          </div>
        </div>

        {/* ================= CONTACT & INFO ================= */}
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

          {/* GET IN TOUCH */}
          <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Mail size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  Get in Touch
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  We usually respond within 2 hours
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input required placeholder="First Name" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all" />
                <input required placeholder="Last Name" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all" />
              </div>

              <input required type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all" />
              <textarea required rows={4} placeholder="How can we help you today?" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all resize-none" />

              <button disabled={loading} className="w-full bg-[#030712] hover:bg-slate-800 py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-slate-200 flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
                {loading ? "Sending..." : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>

          {/* STAY UPDATED */}
          <div className="lg:col-span-2">
            <div className="bg-blue-600 p-10 rounded-[40px] shadow-xl shadow-blue-100 h-full flex flex-col justify-center text-white relative overflow-hidden">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bell size={22} className="text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  Stay Updated
                </h3>
              </div>
              
              <p className="text-blue-100 font-medium mb-8 leading-relaxed">
                Join our newsletter to receive exclusive offers, luxury service alerts, and home care tips.
              </p>

              <input placeholder="Your email address" className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 mb-4 outline-none focus:bg-white/20 transition-all font-bold" />
              <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-all">
                Subscribe Now <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* ================= POLICIES LINKS ================= */}
        <div className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 space-x-6">
          <a href="/t&c" className="hover:text-blue-600 transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
          <a href="/refund" className="hover:text-blue-600 transition-colors">Refunds</a>
        </div>

      </div>
    </section>
  );
}