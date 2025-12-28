"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Send, Bell, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

/* ================= FAQ ITEM ================= */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-white font-medium text-sm md:text-base">
          {question}
        </span>
        <span className="text-blue-400 text-xl">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
          {answer}
        </p>
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
    <section className="relative py-12 bg-[#030712] text-white overflow-hidden font-sans">
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-24 -left-24 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] bottom-0 right-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* ================= FAQ SECTION ================= */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] px-6 md:px-12 py-10 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                Everything you need to know about booking and services on Sparky.
              </p>
            </div>

            <FAQItem question="Do I need to sign up to view services?" answer="No. You can browse all services without signing up. Login is required only at checkout." />
            <FAQItem question="How do I book a service?" answer="Select a service, verify your phone number via OTP, choose date, time, and location, and confirm your booking." />
            <FAQItem question="How is my location captured?" answer="We use Google Maps for precise location selection to ensure smooth service delivery." />
            <FAQItem question="Will I receive an invoice?" answer="Yes. Once your booking is confirmed, an invoice is automatically sent to your WhatsApp." />
            <FAQItem question="Can I track my service after booking?" answer="Yes. You can track the professional in real time until they arrive at your location." />
            <FAQItem question="What happens when the professional arrives?" answer="You’ll be asked to verify an OTP to securely start the service." />
            <FAQItem question="Can I add extra services during the appointment?" answer="Yes. Add-ons can be selected during the service and will be billed only after your confirmation." />
            <FAQItem question="What if no professional is available?" answer="Our system automatically assigns the nearest verified professional to avoid delays." />
            <FAQItem question="Can I cancel or reschedule my booking?" answer="Yes. You can cancel or reschedule before the service starts. Cancellation policies may apply." />
            <FAQItem question="How are professionals verified on Sparky?" answer="All professionals undergo ID verification, background checks, and skill validation." />
            <FAQItem question="What payment methods are accepted?" answer="We support UPI, debit/credit cards, net banking, and other digital payment options." />
            <FAQItem question="Do I need to pay in advance?" answer="Some services require advance payment, while others allow payment after completion." />
            <FAQItem question="What if I am not satisfied with the service?" answer="You can raise a support request, and our team will review and resolve the issue promptly." />
            <FAQItem question="Can I book services for someone else?" answer="Yes. You can book services for friends or family using their address and contact details." />
            <FAQItem question="Is my personal data secure?" answer="Yes. All user data and transactions are encrypted and protected using industry standards." />
          </div>
        </div>

        {/* ================= CONTACT & INFO ================= */}
        <div className="grid lg:grid-cols-5 gap-7">

          {/* GET IN TOUCH */}
          <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl">
            <div className="flex items-start gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Mail size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  Get in Touch
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Reach out to us for help or inquiries
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input required placeholder="First Name" className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5" />
                <input required placeholder="Last Name" className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5" />
              </div>

              <input required type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5" />
              <textarea required rows={4} placeholder="Tell us how we can help you" className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5 resize-none" />

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-3">
                {loading ? "Sending..." : <>Submit <Send size={16} /></>}
              </button>
            </form>
          </div>

          {/* STAY UPDATED */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-[#030712] p-10 rounded-[40px] border border-white/10 h-full">
              <div className="flex items-start gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Bell size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    Stay Updated
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Get updates, offers, and service alerts
                  </p>
                </div>
              </div>

              <input placeholder="Enter your email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 mb-4" />
              <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase flex justify-center items-center gap-2">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* ================= POLICIES LINKS ================= */}
        <div className="mt-10 text-center text-xs text-gray-500 space-x-4">
          <a href="/t&c" className="hover:text-white">Terms & Conditions</a>
          <span>|</span>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <span>|</span>
          <a href="/refund" className="hover:text-white">Refund Policy</a>
        </div>

      </div>
    </section>
  );
}