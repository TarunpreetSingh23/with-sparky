"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RateWorker from "@/components/AssignedWorker";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  XCircle,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Receipt,
  Sparkles,
  ShieldEllipsis,
  Lock
} from "lucide-react";

export default function TrackBookingPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState([]);
  const [adding, setAdding] = useState(null);

  // 1. Fetch Order Data
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const data = await res.json();
      setTask(data.task || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const getProgressWidth = (task) => {
  if (task.is_completed) return "100%";

  switch (task.status) {
    case "Waiting for approval":
      return "10%";
    case "Accepted":
      return "30%";
    case "In Progress":
      return "70%";
    case "Completed":
      return "100%";
    default:
      return "0%";
  }
};

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // 2. Fetch Add-ons
  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        const existing = task?.cart?.map((i) => i.name) || [];
        const filtered = (Array.isArray(data) ? data : []).filter(
          (s) =>
            s.category === task?.cart?.[0]?.category &&
            !existing.includes(s.title)
        );
        setAddons(filtered.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    }
    if (task) fetchAddons();
  }, [task]);

  // 3. Actions
  const addAddon = async (service) => {
    setAdding(service._id);
    try {
      const res = await fetch("/api/orders/add-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          addon: {
            name: service.title,
            price: service.price,
            quantity: 1,
            category: service.category,
          },
        }),
      });

      if (res.ok) {
        // Auto-refresh logic
        await fetchOrder();
        window.location.reload(); 
      }
    } catch (err) {
      alert("Failed to add add-on");
    } finally {
      setAdding(null);
    }
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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center font-black tracking-widest text-blue-500 animate-pulse">
      SYNCING STATUS...
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-500 font-bold">
      Booking not found
    </div>
  );

  const acceptedWorkers = task.assignedWorkers?.filter((w) => w.status === "accepted") || [];
  
  // Logic to show OTP Card
  const showOtpCard = task.is_requested && !task.serviceOtp?.verified;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 pb-32 font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Service Tracker</p>
            <p className="text-sm font-bold text-white">#{task.order_id}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-6">
        
        {/* Live Status Card */}
      <section className="bg-gradient-to-br from-blue-600/20 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h2 className="text-2xl font-black tracking-tight text-white mb-1">
        {task.is_completed ? "Service Completed" : task.status}
      </h2>
      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">
        Live Updates Enabled
      </p>
    </div>

    <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/40">
      <CheckCircle2 size={24} className="text-white" />
    </div>
  </div>

  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: getProgressWidth(task) }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
    />
  </div>
</section>


        {/* --- SERVICE OTP SECTION --- */}
        <AnimatePresence>
          {showOtpCard && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Lock size={12} /> Service Verification
                  </h3>
                  <p className="text-white text-lg font-black tracking-tighter">
                    Share this code with the professional to start:
                  </p>
                </div>
                <div className="bg-emerald-500/20 px-6 py-3 rounded-2xl border border-emerald-500/30">
                  <span className="text-3xl font-black text-emerald-400 tracking-[0.2em]">
                    {task.serviceOtp?.code || "----"}
                  </span>
                </div>
              </div>
              <ShieldEllipsis className="absolute -right-4 -bottom-4 text-emerald-500/10 w-24 h-24" />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<Calendar size={18} />} label="Date" value={task.date} />
          <InfoCard icon={<Clock size={18} />} label="Slot" value={task.timeSlot} />
          <InfoCard icon={<MapPin size={18} />} label="Location" value={task.address} className="col-span-2" />
        </div>

        {/* Specialist Card */}
        <section className="bg-[#111827]/50 border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" /> Specialist Details
          </h3>
          
          {acceptedWorkers.length === 0 ? (
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="w-48 h-3 bg-white/5 rounded animate-pulse" />
                <p className="text-[10px] font-bold text-gray-600 uppercase">Finding best match...</p>
              </div>
            </div>
          ) : (
            acceptedWorkers.map((w, i) => (
              <div key={i} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                      {w.workerId.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-white text-lg">{w.workerId}</p>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified Pro</p>
                    </div>
                  </div>
                </div>
                {task.is_completed && <RateWorker workerId={w.workerId} />}
              </div>
            ))
          )}
        </section>

        {/* Add-ons Section */}
        {addons.length > 0 && !task.is_completed && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <Sparkles size={16} className="text-blue-400" />
               <h3 className="text-xs font-black uppercase tracking-widest text-white">Enhance Service</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {addons.map((s) => (
                <div key={s._id} className="min-w-[170px] bg-[#111827]/80 border border-white/5 p-5 rounded-[2rem] space-y-4 shadow-xl">
                  <p className="text-[11px] font-black uppercase tracking-tight line-clamp-1">{s.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-400">₹{s.price}</span>
                    <button 
                      disabled={adding === s._id}
                      onClick={() => addAddon(s)}
                      className="p-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-xl transition-all disabled:opacity-50 active:scale-90"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Billing Summary */}
        <section className="bg-[#111827] rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="p-8 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Receipt size={14} /> Final Invoice
            </h3>
            <div className="space-y-3">
              {task.cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">{item.name}</span>
                  <span className="text-sm font-black text-white">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-5 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Amount Due</span>
              <span className="text-3xl font-black text-white tracking-tighter">₹{task.total}</span>
            </div>
          </div>
        </section>

        {/* Sticky Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent z-40">
          <div className="max-w-2xl mx-auto flex gap-4">
            {task.invoiceUrl && (
              <a
                href={task.invoiceUrl}
                target="_blank"
                className="flex-[2] py-5 bg-white text-black rounded-[2rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
              >
                <Download size={18} strokeWidth={3} /> Invoice
              </a>
            )}

            {!task.is_canceled && !task.is_completed && (
              <button
                onClick={cancelOrder}
                className="px-8 py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[2rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value, className = "" }) {
  return (
    <div className={`bg-[#111827]/40 border border-white/5 p-5 rounded-[2rem] flex items-start gap-3 ${className}`}>
      <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-200 line-clamp-1">{value}</p>
      </div>
    </div>
  );
}