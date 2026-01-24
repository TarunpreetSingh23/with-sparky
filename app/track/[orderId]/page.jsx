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
  Plus,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Receipt,
  Sparkles,
  Shield,
  CreditCard,
  User
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
      default: return "5%";
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium text-gray-500 animate-pulse">Syncing your booking...</span>
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <XCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
      <p className="text-gray-500 mb-6">We couldn't locate the order details you requested.</p>
      <button onClick={() => router.push('/')} className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">Back to Home</button>
    </div>
  );

  const acceptedWorkers = task.assignedWorkers?.filter((w) => w.status === "accepted") || [];
  const showOtpCard = task.is_requested && !task.serviceOtp?.verified;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-40 font-sans text-gray-900">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Booking ID</span>
            <span className="text-sm font-bold text-gray-900 font-mono tracking-tight">#{task.order_id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* --- Status Card --- */}
        <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  {!task.is_completed && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${task.is_completed ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                </span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Live Status</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {task.is_completed ? "Service Completed" : task.status}
              </h1>
            </div>
            <div className={`p-3 rounded-2xl ${task.is_completed ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: getProgressWidth(task) }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
          <p className="text-right text-[10px] font-medium text-gray-400 mt-2">Estimated progress</p>
        </section>

        {/* --- OTP Verification Card --- */}
        <AnimatePresence>
          {showOtpCard && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl"
            >
              <div className="bg-[#0b0f19] rounded-[1.3rem] p-5 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 flex flex-col gap-4">
                   <div className="flex items-center gap-2 text-blue-400">
                      <Shield size={16} className="fill-blue-400/20" />
                      <span className="text-xs font-bold tracking-widest uppercase">Security Code</span>
                   </div>
                   
                   <div className="flex justify-between items-end">
                      <p className="text-sm text-gray-300 max-w-[60%] leading-relaxed">
                        Share this PIN with your pro when they arrive to start the job.
                      </p>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-3xl font-mono font-bold text-white tracking-widest">
                          {task.serviceOtp?.code || "...."}
                        </span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* --- Information Grid --- */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={Calendar} label="Date" value={task.date} />
          <InfoCard icon={Clock} label="Time" value={task.timeSlot} />
          <InfoCard icon={MapPin} label="Location" value={task.address} fullWidth />
        </div>

        {/* --- Specialist Section --- */}
        <section className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={14} className="text-gray-900" /> Specialist Details
          </h3>
          
          {acceptedWorkers.length === 0 ? (
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-2.5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            acceptedWorkers.map((w, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black border border-blue-100">
                      {w.workerId.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{w.workerId}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <ShieldCheck size={12} className="text-green-500" />
                         <span className="text-[11px] font-semibold text-gray-500">Verified Partner</span>
                      </div>
                    </div>
                  </div>
                  {/* Visual Phone Button (No Logic) */}
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                {task.is_completed && <RateWorker workerId={w.workerId} />}
              </div>
            ))
          )}
        </section>

        {/* --- Add-ons --- */}
        {addons.length > 0 && !task.is_completed && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 px-1">
               <Sparkles size={16} className="text-amber-500 fill-amber-500/20" />
               <h3 className="text-sm font-bold text-gray-900">Recommended Add-ons</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
              {addons.map((s) => (
                <div key={s._id} className="snap-center shrink-0 min-w-[200px] bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between gap-3 relative group active:scale-95 transition-transform">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tight">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{s.title}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-sm font-bold text-gray-900">₹{s.price}</span>
                    <button 
                      disabled={adding === s._id}
                      onClick={() => addAddon(s)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {adding === s._id ? <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : <Plus size={16} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Billing Summary --- */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Receipt size={14} className="text-gray-900" /> Payment Details
            </h3>
            
            <div className="space-y-3">
              {task.cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <span className="font-semibold text-gray-900">₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-dashed border-gray-200" />

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">Total Amount</span>
                <span className="text-xs text-green-600 font-medium">Includes taxes</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">₹{task.total}</span>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center gap-2">
             <CreditCard size={14} className="text-gray-400" />
             <span className="text-xs font-medium text-gray-500">Payment handled via secure gateway</span>
          </div>
        </section>

      </main>

      {/* --- Fixed Bottom Action Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 pb-8">
        <div className="max-w-md mx-auto flex gap-3">
          {task.invoiceUrl && (
            <a
              href={task.invoiceUrl}
              target="_blank"
              className="flex-[2] h-12 bg-gray-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-gray-900/10"
            >
              <Download size={18} /> Download Invoice
            </a>
          )}

          {!task.is_canceled && !task.is_completed && (
            <button
              onClick={cancelOrder}
              className="flex-1 h-12 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// Sub-component for clean info cards
function InfoCard({ icon: Icon, label, value, fullWidth = false }) {
  return (
    <div className={`bg-white border border-gray-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="p-2.5 bg-gray-50 text-gray-700 rounded-xl">
        <Icon size={18} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900 truncate leading-tight">{value}</p>
      </div>
    </div>
  );
}