"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Send, Bell, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
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
        toast.success("Message transmitted successfully");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        router.push("/");
      } else toast.error("Transmission failed");
    } catch {
      toast.error("Network synchronization error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-10 bg-[#030712] text-white overflow-hidden font-sans">
      {/* 🌌 High-Fidelity Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-24 -left-24 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] bottom-0 right-0"></div>
      </div>

      <div className="max-w-7xl mx-2 px-6 relative z-10">
        {/* Section Header */}
        {/* <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> Contact Engine
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Let’s build something <br className="hidden md:block" /> remarkable together.
          </h2>
         
        </div> */}

        <div className="grid lg:grid-cols-5 gap-7">
          {/* Left Column: Contact Form (Spans 3) */}
          <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl transition-all duration-500 hover:border-blue-500/20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Mail size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Direct Message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Message Brief</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-[#030712] border border-white/5 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  placeholder="How can we help you today?"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Synchronizing..." : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>

          {/* Right Column: Newsletter & Info (Spans 2) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-[#030712] p-10 rounded-[40px] border border-white/10 shadow-2xl flex-1 flex flex-col transition-all duration-500 hover:border-white/20">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Bell size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Stay synchronized.</h3>
              <p className="text-gray-500 font-medium mb-8 flex-1">
                Join our exclusive network for premium service updates, quarterly discounts, and prioritized support windows.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-gray-700 focus:border-blue-500 outline-none transition-all"
                />
                <button className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Info Badge */}
            <div className="p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/5 flex items-center gap-4 transition-all duration-500 hover:bg-blue-500/10">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400">24/7 Security</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">All messages are end-to-end encrypted and prioritized by our logic core.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}