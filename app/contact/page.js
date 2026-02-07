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
    <section className="min-h-screen bg-[#fbfcfa] text-[#1A2421] py-6 font-sans selection:bg-[#f2f4ed]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#f2f4ed] px-4 py-1.5 rounded-full border border-[#E0E5D2] mb-6">
             <Headphones size={14} className="text-[#3A4D39]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3A4D39]">Sparky</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter text-[#1A2421] italic uppercase">
            How can we <span className="text-[#a61d33]">assist</span> you?
          </h1>
        </div>

        {/* ================= CONTACT FORM ================= */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-[0_20px_60px_rgba(58,77,57,0.06)] border border-[#f1f3eb] relative overflow-hidden">
            {/* Decorative Arch */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2f4ed] rounded-full -translate-y-16 translate-x-16 opacity-50" />
            
            <div className="flex items-center gap-4 mb-12 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#3A4D39] flex items-center justify-center shadow-xl shadow-[#3a4d39]/20">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-[1000] tracking-tight italic uppercase">Send a Message</h3>
                <p className="text-[10px] font-black text-[#4F6F52] uppercase tracking-[0.15em] mt-1 opacity-60">
                  Typical response time: Under 60 minutes
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#3A4D39] ml-2">First Name</label>
                  <input required placeholder="Jane" className="w-full p-5 rounded-2xl bg-[#fbfcfa] border-2 border-[#f1f3eb] focus:bg-white focus:border-[#3A4D39] outline-none font-bold transition-all placeholder:text-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#3A4D39] ml-2">Last Name</label>
                  <input required placeholder="Doe" className="w-full p-5 rounded-2xl bg-[#fbfcfa] border-2 border-[#f1f3eb] focus:bg-white focus:border-[#3A4D39] outline-none font-bold transition-all placeholder:text-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#3A4D39] ml-2">Email Address</label>
                <input required type="email" placeholder="jane@example.com" className="w-full p-5 rounded-2xl bg-[#fbfcfa] border-2 border-[#f1f3eb] focus:bg-white focus:border-[#3A4D39] outline-none font-bold transition-all placeholder:text-gray-300" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#3A4D39] ml-2">Your Inquiry</label>
                <textarea required rows={4} placeholder="Tell us more about your ritual requirements..." className="w-full p-5 rounded-2xl bg-[#fbfcfa] border-2 border-[#f1f3eb] focus:bg-white focus:border-[#3A4D39] outline-none font-bold transition-all resize-none placeholder:text-gray-300" />
              </div>

              <button disabled={loading} className="w-full bg-[#3A4D39] hover:bg-[#2f3a1f] py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[11px] text-white shadow-2xl shadow-[#3a4d39]/20 flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
                {loading ? "Transmitting..." : <>Dispatch Message <Send size={16} className="text-[#f7b614]" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* ================= FAQ CENTER ================= */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-[3.5rem] shadow-sm border border-[#f1f3eb] overflow-hidden">
            <div className="p-10 md:p-14 border-b border-[#f1f3eb] text-center bg-[#fbfcfa]">
              <h2 className="text-3xl font-[1000] tracking-tighter italic uppercase mb-2">
                Support <span className="text-[#4F6F52]">Center</span>
              </h2>
              <p className="text-[#4F6F52] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                Frequently Asked Questions
              </p>
            </div>

            <div className="divide-y divide-[#f1f3eb]">
              <FAQItem question="Do I need to sign up to view services?" answer="No. You can browse all luxury rituals without signing up. Authentication is required only during the secure checkout process." />
              <FAQItem question="How do I book a ritual?" answer="Select your desired ritual, verify your identity via WhatsApp OTP, choose your professional, and confirm your preferred time slot." />
              <FAQItem question="How is my location captured?" answer="We integrate with Google Precision Maps to ensure our professionals arrive exactly at your doorstep." />
              <FAQItem question="Will I receive an invoice?" answer="Absolutely. A professional digital invoice is automatically dispatched to your registered WhatsApp upon booking confirmation." />
              <FAQItem question="Can I track my professional?" answer="Yes. Every Saga professional is tracked in real-time. You can view their progress live via the tracking link in your account." />
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-20 flex flex-col items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#4F6F52] opacity-40">
            <a href="/t&c" className="hover:text-[#a61d33] transition-colors">Terms</a>
            <div className="w-1 h-1 bg-[#4F6F52] rounded-full" />
            <a href="/privacy" className="hover:text-[#a61d33] transition-colors">Privacy</a>
            <div className="w-1 h-1 bg-[#4F6F52] rounded-full" />
            <a href="/refund" className="hover:text-[#a61d33] transition-colors">Refunds</a>
          </div>
          
          <div className="flex items-center gap-2">
             <ShieldCheck size={16} className="text-[#3A4D39] opacity-20" />
             <span className="text-[9px] font-black uppercase tracking-widest text-[#3A4D39] opacity-20">End-to-End Encrypted Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}