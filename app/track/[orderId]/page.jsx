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
  Sparkles
} from "lucide-react";

export default function TrackBookingPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState([]);
  const [adding, setAdding] = useState(null);

  // Reusable fetch function for auto-refresh logic
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

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

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

  const cancelOrder = async () => {

    if (!confirm("Cancel this booking?")) return;



    await fetch("/api/orders/cancel", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ orderId }),

    });



    router.refresh();

  };
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
        // AUTO REFRESH LOGIC: Re-fetch data and reload window for sync
        await fetchOrder();
        window.location.reload(); 
      }
    } catch (err) {
      alert("Failed to add add-on");
    } finally {
      setAdding(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center font-bold tracking-widest animate-pulse text-blue-500">SYNCING STATUS...</div>;

  if (!task) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-500">Booking not found</div>;

  const acceptedWorkers = task.assignedWorkers?.filter((w) => w.status === "accepted") || [];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 pb-24 font-sans selection:bg-blue-500/30">
      {/* Dynamic Progress Header */}
      <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Booking Tracker</p>
            <p className="text-sm font-bold text-white">#{task.order_id}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-6">
        
        {/* Status Card */}
        <section className="bg-gradient-to-br from-blue-600/20 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-1">
                {task.is_completed ? "Service Completed" : task.status}
              </h2>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Live Updates Enabled</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/40">
              <CheckCircle2 size={24} className="text-white" />
            </div>
          </div>
          
          {/* Progress Mini-Bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: task.is_completed ? "100%" : "60%" }} 
               className="h-full bg-blue-500" 
             />
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<Calendar size={18} />} label="Date" value={task.date} />
          <InfoCard icon={<Clock size={18} />} label="Slot" value={task.timeSlot} />
          <InfoCard icon={<MapPin size={18} />} label="Location" value={task.address} className="col-span-2" />
        </div>

        {/* Assigned Pro Card */}
        <section className="bg-[#111827]/50 border border-white/10 rounded-[2rem] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" /> Assigned Specialist
          </h3>
          
          {acceptedWorkers.length === 0 ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-white/5 rounded-2xl" />
              <div className="space-y-2">
                <div className="w-32 h-3 bg-white/10 rounded" />
                <div className="w-20 h-2 bg-white/5 rounded" />
              </div>
            </div>
          ) : (
            acceptedWorkers.map((w, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                      {w.workerId.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-white">{w.workerId}</p>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Verified Partner</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="#EAB308" className="text-yellow-500" />)}
                  </div>
                </div>
                {task.is_completed && <RateWorker workerId={w.workerId} />}
              </div>
            ))
          )}
        </section>

        {/* Add-ons / Upsell Section */}
        {addons.length > 0 && !task.is_completed && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <Sparkles size={16} className="text-blue-400" />
               <h3 className="text-xs font-black uppercase tracking-widest text-white">Recommended Add-ons</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {addons.map((s) => (
                <div key={s._id} className="min-w-[160px] bg-white/[0.03] border border-white/5 p-4 rounded-3xl space-y-3">
                  <p className="text-[11px] font-bold line-clamp-1">{s.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-400">₹{s.price}</span>
                    <button 
                      disabled={adding === s._id}
                      onClick={() => addAddon(s)}
                      className="p-2 bg-white/5 hover:bg-blue-600 rounded-xl transition-all disabled:opacity-50"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services & Invoice Summary */}
        <section className="bg-[#111827] rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Receipt size={14} /> Price Breakdown
            </h3>
            <div className="space-y-3">
              {task.cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{item.name}</span>
                  <span className="text-sm font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-blue-500">Total Amount</span>
              <span className="text-2xl font-black text-white">₹{task.total}</span>
            </div>
          </div>
        </section>

        {/* Actions Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent z-40">
          <div className="max-w-2xl mx-auto flex gap-3">
            {task.invoiceUrl && (
              <a
                href={task.invoiceUrl}
                target="_blank"
                className="flex-[2] py-4 bg-white text-black rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download size={16} /> Invoice
              </a>
            )}

            {!task.is_canceled && !task.is_completed && (
              <button
                onClick={cancelOrder}
                className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <XCircle size={16} /> Cancel
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
    <div className={`bg-[#111827]/30 border border-white/5 p-4 rounded-3xl flex items-start gap-3 ${className}`}>
      <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-200">{value}</p>
      </div>
    </div>
  );
}