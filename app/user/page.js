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
      {/* <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#f1f3eb] px-6 py-5 flex justify-between items-center shadow-sm">
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
      </header> */}

      <main className="max-w-2xl mx-auto  pt-0.5">
        
        {/* 2. USER PROFILE CARD */}
       <header className="
  relative pt-10 pb-14 overflow-hidden
  bg-gradient-to-b from-[#a4c4a7] via-[#e8f0e8] to-[#F7F9F7]
">

  {/* Soft background glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_60%)] pointer-events-none" />

  <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">

    {/* Avatar Section */}
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6"
    >
      <div className="
        w-28 h-28
        rounded-full
        bg-gradient-to-br from-white to-[#f1f3eb]
        flex items-center justify-center
        shadow-[0_15px_35px_rgba(0,0,0,0.12)]
        border border-white
      ">
        <IoPersonCircleOutline size={95} className="text-gray-300" />
      </div>

      {/* Verified Badge */}
      <div className="
        absolute bottom-2 right-2
        w-9 h-9
        rounded-full
        bg-gradient-to-br from-emerald-500 to-emerald-600
        border-4 border-white
        flex items-center justify-center
        shadow-md
      ">
        <IoShieldCheckmarkOutline size={14} className="text-white" />
      </div>
    </motion.div>

    {/* Title */}
    <h1 className="
      text-2xl md:text-3xl
      font-extrabold
      tracking-tight
      bg-gradient-to-r from-gray-900 to-gray-600
      bg-clip-text text-transparent
      mb-1
    ">
      Your Account
    </h1>

    {/* Phone */}
    <p className="text-gray-500 text-sm font-medium tracking-tight">
      {user.phone}
    </p>

    {/* Status Badges */}
    <div className="flex gap-3 mt-5">

      <span className="
        text-[10px] font-semibold
        bg-gradient-to-br from-white to-[#f2f4ed]
        text-[#3A4D39]
        px-4 py-1.5
        rounded-full
        shadow-sm
        border border-white
      ">
        Verified
      </span>

      <span className="
        text-[10px] font-semibold
        bg-gradient-to-r from-[#a61d33] to-[#8e1729]
        text-white
        px-4 py-1.5
        rounded-full
        shadow-[0_6px_14px_rgba(166,29,51,0.35)]
      ">
        Premium Gold
      </span>

    </div>

  </div>
</header>


        {/* 3. ORDER HISTORY SECTION */}
      <section className="px-6 mt-6">
  {/* Header */}
  <div className="flex justify-between items-end mb-6">
    <div>
      <h3 className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-[#4F6F52]">
        Activity Log
      </h3>
      <p className="text-[10px] font-semibold text-gray-400 uppercase mt-0.5">
        Manage your past bookings
      </p>
    </div>

    <span className="
      px-4 py-1.5
      text-[10px] font-bold
      rounded-full
      bg-gradient-to-br from-[#f2f4ed] to-[#e8f0e8]
      text-[#3A4D39]
      border border-[#E0E5D2]
      shadow-[0_4px_12px_rgba(0,0,0,0.08)]
    ">
      {tasks.length} RECORDS
    </span>
  </div>

  {/* Empty State */}
  {tasks.length === 0 ? (
    <div className="
      bg-gradient-to-br from-white via-[#fbfcfa] to-[#f2f4ed]
      rounded-2xl
      p-12
      text-center
      shadow-[0_10px_25px_rgba(0,0,0,0.05)]
      border border-[#f1f3eb]
    ">
      <div className="
        w-20 h-20
        rounded-full
        bg-[#fbfcfa]
        flex items-center justify-center
        mx-auto mb-6
        shadow-inner
      ">
        <IoBagCheckOutline size={36} className="text-gray-300" />
      </div>
      <p className="
        text-[#1A2421]
        font-bold
        uppercase text-[11px]
        tracking-widest
        opacity-40
      ">
        No active bookings found
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          whileTap={{ scale: 0.97 }}
          key={task._id}
          className="
            bg-gradient-to-br from-white via-[#fbfcfa] to-[#f2f4ed]
            rounded-2xl
            p-6
            shadow-[0_12px_30px_rgba(58,77,57,0.06)]
            border border-[#f1f3eb]
            relative
            overflow-hidden
          "
        >
          {/* Top Row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <p className="text-[9px] font-extrabold text-gray-300 uppercase tracking-[0.2em] mb-1">
                Ref No: {task.order_id}
              </p>

              <div className="flex flex-wrap gap-2">
                {task.cart.map((item, i) => (
                  <span
                    key={i}
                    className="
                      text-[12px] font-bold text-[#1A2421]
                      italic uppercase tracking-tight
                      bg-gradient-to-br from-[#fbfcfa] to-[#f9faf7]
                      px-2.5 py-1
                      rounded-lg
                      border border-[#f1f3eb]
                      shadow-[0_3px_6px_rgba(0,0,0,0.05)]
                    "
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#3A4D39] tracking-tighter">
                ₹{task.total}
              </p>
              <div className="
                inline-block
                bg-gradient-to-br from-emerald-50 to-emerald-100
                text-emerald-600
                text-[8px] font-bold
                px-2 py-0.5
                rounded
                uppercase mt-1
              ">
                Success
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 border-t border-dashed border-[#f1f3eb] pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#f2f4ed] to-[#e9f0e9] rounded-xl shadow-inner">
                <IoCalendarOutline className="text-[#3A4D39]" size={16} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-tight text-[#4F6F52]">
                {task.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#f2f4ed] to-[#e9f0e9] rounded-xl shadow-inner">
                <IoTimeOutline className="text-[#3A4D39]" size={16} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-tight text-[#4F6F52]">
                {task.timeSlot}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => router.push(`/track/${task.order_id}`)}
            className="
              mt-6 w-full py-3
              bg-gradient-to-br from-[#3A4D39] to-[#2f3a1f]
              text-white
              rounded-xl
              flex items-center justify-center gap-2
              font-extrabold uppercase tracking-[0.2em]
              shadow-[0_6px_20px_rgba(58,77,57,0.25)]
              transition-transform active:scale-95
            "
          >
            <span className="text-[11px]">Live Track Status</span>
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