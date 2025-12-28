"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RateWorker from "@/components/AssignedWorker";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  XCircle,
  PlusCircle,
  CheckCircle2,
  ChevronLeft,
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
      case "Waiting for approval": return "15%";
      case "Accepted": return "40%";
      case "In Progress": return "75%";
      case "Completed": return "100%";
      default: return "0%";
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
          (s) => s.category === task?.cart?.[0]?.category && !existing.includes(s.title)
        );
        setAddons(filtered.slice(0, 3));
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
    <div className="min-h-screen bg-white flex items-center justify-center font-black tracking-widest text-blue-600 animate-pulse uppercase text-xs">
      Syncing Status...
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-red-500 font-bold p-6 text-center">
      Booking not found
      <button onClick={() => router.push('/')} className="mt-4 text-blue-600 underline">Back to home</button>
    </div>
  );

  const acceptedWorkers = task.assignedWorkers?.filter((w) => w.status === "accepted") || [];
  const showOtpCard = task.is_requested && !task.serviceOtp?.verified;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#030712] pb-32 font-sans selection:bg-blue-100">
      
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-[#030712]" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Tracking</p>
            <p className="text-xs font-bold text-blue-600">ID: {task.order_id}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        
        {/* Live Status Card */}
        <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Status</p>
              <h2 className="text-2xl font-black tracking-tight">
                {task.is_completed ? "Service Completed" : task.status}
              </h2>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <CheckCircle2 size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: getProgressWidth(task) }}
              className="h-full bg-blue-600"
            />
          </div>
        </section>

        {/* OTP Verification Card */}
        <AnimatePresence>
          {showOtpCard && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#030712] text-white p-6 rounded-[2rem] relative overflow-hidden shadow-xl"
            >
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-blue-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Lock size={12} /> Security Key
                  </h3>
                  <p className="text-sm font-bold text-gray-200">
                    Share this code with the partner to start service:
                  </p>
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-white tracking-[0.1em]">
                    {task.serviceOtp?.code || "----"}
                  </span>
                </div>
              </div>
              <ShieldEllipsis className="absolute -right-4 -bottom-4 text-white/5 opacity-20 w-24 h-24" />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<Calendar size={18} />} label="Scheduled Date" value={task.date} />
          <InfoCard icon={<Clock size={18} />} label="Arrival Time" value={task.timeSlot} />
          <InfoCard icon={<MapPin size={18} />} label="Service Address" value={task.address} className="col-span-2" />
        </div>

        {/* Specialist Card */}
        <section className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" /> Assigned Specialist
          </h3>
          
          {acceptedWorkers.length === 0 ? (
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl animate-pulse" />
              <div className="space-y-1">
                <div className="w-32 h-3 bg-gray-100 rounded animate-pulse" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Assigning best pro...</p>
              </div>
            </div>
          ) : (
            acceptedWorkers.map((w, i) => (
              <div key={i} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black text-white">
                      {w.workerId.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-lg">{w.workerId}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={10} /> Background Verified
                      </p>
                    </div>
                  </div>
                </div>
                {task.is_completed && <RateWorker workerId={w.workerId} />}
              </div>
            ))
          )}
        </section>

        {/* Add-ons */}
        {addons.length > 0 && !task.is_completed && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
               <Sparkles size={14} className="text-blue-600" />
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Complete the Look</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {addons.map((s) => (
                <div key={s._id} className="min-w-[170px] bg-white border border-gray-100 p-5 rounded-[2rem] space-y-4 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-tight text-[#030712] line-clamp-1">{s.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-600">₹{s.price}</span>
                    <button 
                      disabled={adding === s._id}
                      onClick={() => addAddon(s)}
                      className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Billing */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-7 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Receipt size={14} /> Billing Summary
            </h3>
            <div className="space-y-3">
              {task.cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">{item.name}</span>
                  <span className="text-sm font-black text-[#030712]">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-50 pt-5 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-blue-600">Grand Total</span>
              <span className="text-3xl font-black text-[#030712] tracking-tighter">₹{task.total}</span>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="fixed bottom-14 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto flex gap-3">
            {task.invoiceUrl && (
              <a
                href={task.invoiceUrl}
                target="_blank"
                className="flex-[3] py-4 bg-[#030712] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                <Download size={16} /> View Receipt
              </a>
            )}

            {!task.is_canceled && !task.is_completed && (
              <button
                onClick={cancelOrder}
                className="flex-1 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center active:scale-95 transition-all"
              >
                <XCircle size={16} />
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
    <div className={`bg-white border border-gray-100 p-5 rounded-[2rem] flex items-start gap-3 shadow-sm ${className}`}>
      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#030712] truncate">{value}</p>
      </div>
    </div>
  );
}