"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  IoLogOutOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoChevronForward,
  IoBagCheckOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";

import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme Constants
  const THEME_GREEN = "#3A4D39";
  const THEME_MAROON = "#a61d33";
  const THEME_GOLD = "#f7b614";

  useEffect(() => {
    if (!loading) window.scrollTo(0, 0);
  }, [loading]);

  useEffect(() => {
    async function initProfile() {
      try {
        const authRes = await fetch("/api/me");
        const authData = await authRes.json();

        if (!authData.user) {
          router.push("/login");
          return;
        }

        setUser(authData.user);

        const orderRes = await fetch("/api/orders/by-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: authData.user.phone }),
        });

        const orderData = await orderRes.json();
        setTasks(orderData.orders || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initProfile();
  }, [router]);


  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfa]">
        <div className="flex flex-col items-center gap-6">
          <div className={`w-12 h-12 border-4 border-[#f2f4ed] border-t-[${THEME_GREEN}] rounded-full animate-spin`} style={{ borderTopColor: THEME_GREEN }} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F6F52] animate-pulse">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfa] pb-32 font-sans text-[#1A2421]">
      {/* 1. STICKY BRANDED HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#f1f3eb] px-6 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-6 bg-[#a61d33] rounded-full" />
           <h1 className="text-xl font-[1000] tracking-tight italic uppercase">Account</h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-rose-50 text-[#a61d33] hover:bg-rose-100 active:scale-90 transition-all border border-rose-100"
        >
          <IoLogOutOutline size={22} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto  pt-0.5">
        
        {/* 2. USER PROFILE CARD */}
        <header className="relative pt-16 pb-12  overflow-hidden bg-gradient-to-b from-[#a4c4a7] to-[#F7F9F7]">
        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
              <IoPersonCircleOutline size={100} className="text-gray-200" />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <IoShieldCheckmarkOutline size={14} className="text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-[1000] tracking-tight text-gray-900 mb-1">Your Account</h1>
          <p className="text-gray-500 font-bold tracking-tight">{user.phone}</p>
          
          <div className="flex gap-2 mt-4">
            <span className="text-[10px] font-black bg-white/80 backdrop-blur-md text-[#3A4D39] px-3 py-1 rounded-full shadow-sm border border-white/50 uppercase tracking-widest">Verified</span>
            <span className="text-[10px] font-black bg-[#a61d33] text-white px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Premium Gold</span>
          </div>
        </div>
      </header>

        {/* 3. ORDER HISTORY SECTION */}
        <section className="px-6">
          <div className="flex justify-between px-1 items-end mb-8 ">
            <div>
                <h3 className="text-[12px] font-[1000] uppercase tracking-[0.2em] text-[#4F6F52]">
                  Activity Log
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Manage your past bookings</p>
            </div>
            <span className="bg-[#f2f4ed] text-[#3A4D39] px-4 py-1.5 rounded-full text-[10px] font-[1000] border border-[#E0E5D2]">
              {tasks.length} RECORDS
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-[#f1f3eb]">
              <div className="w-20 h-20 bg-[#fbfcfa] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <IoBagCheckOutline size={36} className="text-gray-300" />
              </div>
              <p className="text-[#1A2421] font-[1000] uppercase text-[11px] tracking-widest opacity-40">
                No active bookings found
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {tasks.map((task) => (
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  key={task._id}
                  className="bg-white border border-[#f1f3eb] rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(58,77,57,0.04)] relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                      <p className="text-[9px] font-[1000] text-gray-300 uppercase tracking-[0.2em] mb-2">
                        Ref No: {task.order_id}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {task.cart.map((item, i) => (
                          <span
                            key={i}
                            className="text-[13px] font-[1000] text-[#1A2421] italic uppercase tracking-tight bg-[#fbfcfa] px-3 py-1 rounded-lg border border-[#f1f3eb]"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-[1000] text-[#3A4D39] tracking-tighter">
                        ₹{task.total}
                      </p>
                      <div className="inline-block bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase mt-1">
                        Success
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-dashed border-[#f1f3eb] pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#f2f4ed] rounded-xl"><IoCalendarOutline className="text-[#3A4D39]" size={16} /></div>
                      <span className="text-[11px] font-black uppercase tracking-tight text-[#4F6F52]">{task.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#f2f4ed] rounded-xl"><IoTimeOutline className="text-[#3A4D39]" size={16} /></div>
                      <span className="text-[11px] font-black uppercase tracking-tight text-[#4F6F52]">{task.timeSlot}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/track/${task.order_id}`)}
                    className="mt-8 w-full py-4 bg-[#3A4D39] hover:bg-[#2f3a1f] text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#3a4d39]/20"
                  >
                    <span className="text-[11px] font-[1000] uppercase tracking-[0.2em]">
                      Live Track Status
                    </span>
                    <IoChevronForward size={14} className="text-[#f7b614]" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 4. PREMIUM SUPPORT CARD */}
        {/* <section className="mt-16 p-10 rounded-[3rem]  bg-[#1A2421] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0  right-0 w-32 h-32 bg-[#3A4D39] rounded-full blur-[60px] opacity-40 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-6">
                <IoShieldCheckmarkOutline className="text-[#f7b614]" size={24} />
            </div>
            <h4 className="text-2xl font-[1000] mb-3 tracking-tight italic uppercase">Need Help?</h4>
            <p className="text-white/50 text-[13px] font-bold mb-8 leading-relaxed">
              Our professional concierge is available 24/7 to manage your bookings and queries.
            </p>
            <button
              onClick={() => router.push("/contact")}
              className="bg-white text-[#1A2421] px-10 py-4 rounded-2xl text-[11px] font-[1000] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl"
            >
              Contact Concierge
            </button>
          </div>
        </section> */}
      </main>

      {/* Spacing for bottom navigation */}
      <div className="h-10" />
    </div>
  );
}