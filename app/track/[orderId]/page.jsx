"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RateWorker from "@/components/AssignedWorker";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  XCircle,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Receipt,
  Sparkles,
  Shield,
  CreditCard,
  User,
  ArrowRight
} from "lucide-react";

export default function TrackBookingPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState([]);
  const [adding, setAdding] = useState(null);

  // Theme Constants
  const THEME_GREEN = "#3A4D39";
  const THEME_MAROON = "#a61d33";
  const THEME_GOLD = "#f7b614";

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const data = await res.json();
      setTask(data.task || null);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const getProgressWidth = (task) => {
    if (task.is_completed) return "100%";
    switch (task.status) {
      case "Waiting for approval": return "15%";
      case "Accepted": return "40%";
      case "In Progress": return "75%";
      case "Completed": return "100%";
      default: return "5%";
    }
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const existing = task?.cart?.map((i) => i.name) || [];
        const filtered = (Array.isArray(data) ? data : []).filter(
          (s) => s.category === task?.cart?.[0]?.category && !existing.includes(s.title)
        );
        setAddons(filtered.slice(0, 40));
      } catch (err) { console.error(err); }
    }
    if (task) fetchAddons();
  }, [task]);

  const addAddon = async (service) => {
    setAdding(service._id);
    try {
      const res = await fetch("/api/orders/add-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, addon: { name: service.title, price: service.price, quantity: 1, category: service.category } }),
      });
      if (res.ok) { await fetchOrder(); window.location.reload(); }
    } catch (err) { alert("Failed to add add-on"); } finally { setAdding(null); }
  };

  const cancelOrder = async () => {
    if (!confirm("Cancel this booking?")) return;
    await fetch("/api/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fbfcfa] flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-[#f2f4ed] border-t-[#3A4D39] rounded-full animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F6F52] animate-pulse">Syncing Ritual...</span>
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-[#fbfcfa] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-rose-50 text-[#a61d33] rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <XCircle size={40} />
      </div>
      <h2 className="text-2xl font-[1000] text-[#1A2421] mb-2 tracking-tight italic uppercase">Booking Not Found</h2>
      <p className="text-[#4F6F52] font-bold text-sm mb-8 opacity-60">We couldn't locate the ritual details you requested.</p>
      <button onClick={() => router.push('/')} className="px-10 py-4 bg-[#3A4D39] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Return to Sanctuary</button>
    </div>
  );

  const acceptedWorkers = task.assignedWorkers?.filter((w) => w.status === "accepted") || [];
  const showOtpCard = task.is_requested && !task.serviceOtp?.verified;

  return (
    <div className="min-h-screen bg-[#fbfcfa] pb-44 font-sans text-[#1A2421]">
      
      {/* --- Premium Header --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-[#f1f3eb]">
        <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#f2f4ed] text-[#3A4D39] active:scale-90 transition-all">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-[#4F6F52] opacity-40">Ritual ID</span>
            <span className="text-[15px] font-[1000] text-[#1A2421] tracking-tighter italic uppercase">#{task.order_id.slice(-6)}</span>
          </div>
          <div className="w-11" /> 
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 space-y-6">
        
        {/* --- Live Status Card --- */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(58,77,57,0.06)] border border-[#f1f3eb] relative overflow-hidden">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  {!task.is_completed && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7b614] opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${task.is_completed ? 'bg-emerald-500' : 'bg-[#f7b614]'}`}></span>
                </span>
                <span className="text-[10px] font-black text-[#a61d33] uppercase tracking-[0.15em]">Live Progress</span>
              </div>
              <h1 className="text-3xl font-[1000] text-[#1A2421] tracking-tighter leading-none italic uppercase">
                {task.is_completed ? "Finished" : task.status}
              </h1>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${task.is_completed ? 'bg-emerald-50 text-emerald-600' : 'bg-[#f2f4ed] text-[#3A4D39]'}`}>
              <CheckCircle2 size={28} />
            </div>
          </div>

          <div className="relative w-full h-3 bg-[#f2f4ed] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: getProgressWidth(task) }}
              transition={{ duration: 2, ease: "circOut" }}
              className="absolute h-full bg-gradient-to-r from-[#3A4D39] to-[#4F6F52] rounded-full shadow-[0_0_15px_rgba(58,77,57,0.3)]"
            />
          </div>
          <p className="text-right text-[9px] font-[1000] uppercase tracking-widest text-gray-300 mt-3">Verified Sparky Pipeline</p>
        </section>

        {/* --- Premium OTP Verification --- */}
        <AnimatePresence>
          {showOtpCard && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] p-1 bg-gradient-to-br from-[#1A2421] to-[#3A4D39] shadow-2xl shadow-[#3a4d39]/30"
            >
              <div className="bg-[#0b0f19]/40 backdrop-blur-xl rounded-[2.3rem] p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Shield size={120} color="white" /></div>
                
                <div className="relative z-10 flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                        <LockIcon size={20} className="text-[#f7b614]" />
                      </div>
                      <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/80">Service Passcode</span>
                   </div>
                   
                   <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-3xl p-5">
                      <p className="text-[13px] font-bold text-white/50 max-w-[150px] leading-snug">
                        Disclose this PIN only when the professional arrives.
                      </p>
                      <span className="text-4xl font-[1000] text-[#f7b614] tracking-[0.15em] italic">
                        {task.serviceOtp?.code || "...."}
                      </span>
                   </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- Information Grid --- */}
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={Calendar} label="Reserved Date" value={task.date} themeColor={THEME_GREEN} />
          <InfoCard icon={Clock} label="Time Window" value={task.timeSlot} themeColor={THEME_GREEN} />
          <InfoCard icon={MapPin} label="Service Address" value={task.address} fullWidth themeColor={THEME_GREEN} />
        </div>

        {/* --- Specialist Card --- */}
        <section className="bg-white border border-[#f1f3eb] rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-[11px] font-[1000] text-[#4F6F52] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <User size={14} className="text-[#a61d33]" /> Assigned Specialist
          </h3>
          
          {acceptedWorkers.length === 0 ? (
            <div className="flex items-center gap-4 bg-[#fbfcfa] rounded-[1.5rem] p-5 border-2 border-dashed border-[#f1f3eb]">
              <div className="w-14 h-14 bg-[#f2f4ed] rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="w-32 h-3 bg-[#f2f4ed] rounded animate-pulse" />
                <div className="w-24 h-2.5 bg-[#f2f4ed] rounded animate-pulse" />
              </div>
            </div>
          ) : (
            acceptedWorkers.map((w, i) => (
              <div key={i} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#3A4D39] text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-[1000] shadow-lg shadow-[#3a4d39]/20 italic">
                      {w.workerId.charAt(0)}
                    </div>
                    <div>
                      <p className="font-[1000] text-[#1A2421] text-xl tracking-tight leading-none italic uppercase">{w.workerId}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                         <ShieldCheck size={14} className="text-[#a61d33]" />
                         <span className="text-[11px] font-black uppercase tracking-wider text-[#4F6F52] opacity-60">Gold Partner</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
                {task.is_completed && <RateWorker workerId={w.workerId} />}
              </div>
            ))
          )}
        </section>

        {/* --- Add-ons Section --- */}
        {addons.length > 0 && !task.is_completed && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-3 px-2">
               <Sparkles size={18} className="text-[#f7b614]" />
               <h3 className="text-[13px] font-[1000] text-[#1A2421] uppercase tracking-widest italic">Enhance Ritual</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
              {addons.map((s) => (
                <div key={s._id} className="snap-center shrink-0 min-w-[240px] bg-white border border-[#f1f3eb] p-5 rounded-[2rem] shadow-[0_15px_35px_rgba(58,77,57,0.04)] flex flex-col justify-between gap-4 active:scale-[0.98] transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-[#f2f4ed] text-[#3A4D39] text-[9px] font-[1000] px-3 py-1 rounded-full uppercase tracking-widest">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-[15px] font-[1000] text-[#1A2421] leading-snug line-clamp-2 italic uppercase">{s.title}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#f1f3eb]">
                    <span className="text-lg font-[1000] text-[#3A4D39]">₹{s.price}</span>
                    <button 
                      disabled={adding === s._id}
                      onClick={() => addAddon(s)}
                      className="w-10 h-10 flex items-center justify-center bg-[#3A4D39] text-white rounded-xl shadow-lg shadow-[#3a4d39]/20 disabled:opacity-50 transition-all"
                    >
                      {adding === s._id ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : <Plus size={20} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Billing Details --- */}
        <section className="bg-white rounded-[2.5rem] border border-[#f1f3eb] shadow-sm overflow-hidden mb-12">
          <div className="p-8 space-y-5">
            <h3 className="text-[11px] font-[1000] text-[#4F6F52] uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
              <Receipt size={14} className="text-[#a61d33]" /> Billing Overview
            </h3>
            
            <div className="space-y-4">
              {task.cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-[#4F6F52] uppercase tracking-tight">{item.name}</span>
                  <span className="text-[#1A2421]">₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-dashed border-[#E0E5D2]" />

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Amount Payable</span>
                <span className="text-[9px] text-emerald-600 font-black uppercase mt-1">Inclusive of Taxes</span>
              </div>
              <span className="text-3xl font-[1000] text-[#1A2421] tracking-tighter leading-none italic">₹{task.total}</span>
            </div>
          </div>
          <div className="bg-[#fbfcfa] px-8 py-4 border-t border-[#f1f3eb] flex items-center gap-3">
             <ShieldCheck size={16} className="text-[#3A4D39] opacity-40" />
             <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4F6F52] opacity-50">Sparky Encrypted Security Protocol</span>
          </div>
        </section>

      </main>

      {/* --- Fixed Bottom Actions --- */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-[#f1f3eb] z-50 pb-10">
        <div className="max-w-md mx-auto flex gap-4">
          {task.invoiceUrl && (
            <a
              href={task.invoiceUrl}
              target="_blank"
              className="flex-[2] h-16 bg-[#1A2421] text-white rounded-[1.5rem] font-[1000] uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-2xl shadow-black/10"
            >
              <Download size={18} className="text-[#f7b614]" /> Receipt
            </a>
          )}

          {!task.is_canceled && !task.is_completed && (
            <button
              onClick={cancelOrder}
              className="flex-1 h-16 bg-rose-50 text-[#a61d33] border-2 border-rose-100 rounded-[1.5rem] font-[1000] uppercase text-[11px] tracking-[0.2em] flex items-center justify-center active:scale-[0.98] transition-all"
            >
              Abort
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// Sub-component for theme-aligned info cards
function InfoCard({ icon: Icon, label, value, fullWidth = false, themeColor }) {
  return (
    <div className={`bg-white border border-[#f1f3eb] p-6 rounded-[2rem] flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="p-3 bg-[#f2f4ed] text-[#3A4D39] rounded-2xl">
        <Icon size={20} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-[#4F6F52] mb-1.5 opacity-60">{label}</p>
        <p className="text-[14px] font-[1000] text-[#1A2421] truncate uppercase tracking-tighter italic">{value}</p>
      </div>
    </div>
  );
}

function LockIcon({ size, className }) {
  return <Shield size={size} className={className} />;
}