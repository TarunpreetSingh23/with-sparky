"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  IoLogOutOutline, 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoCallOutline, 
  IoLocationOutline,
  IoChevronForward,
  IoBagCheckOutline,
  IoPersonCircleOutline
} from "react-icons/io5";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force scroll to top on load
  useEffect(() => {
    if (!loading) window.scrollTo(0, 0);
  }, [loading]);

  // Auth & Data Fetching
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
      } catch (error) {
        console.error("Profile Load Error:", error);
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

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Synchronizing</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030712] pb-24 font-sans text-white">
      
      {/* 📱 App Header */}
      <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter italic">MY ACCOUNT</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <IoLogOutOutline size={22} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8">
        
        {/* User Identity Section */}
        <section className="mb-12 flex items-center gap-5 p-2">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <IoPersonCircleOutline size={48} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#030712] rounded-full"></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Authenticated User</p>
            <h2 className="text-2xl font-bold tracking-tight">{user.phone}</h2>
            <p className="text-gray-500 text-xs font-medium">Standard Membership</p>
          </div>
        </section>

        {/* Order History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-gray-400">Order History</h3>
            <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500">{tasks.length} Total</span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-12 text-center">
              <IoBagCheckOutline size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-medium">No bookings identified yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 transition-all duration-300 active:scale-[0.98] active:bg-white/[0.05]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ID: {task.order_id}</p>
                      <div className="flex flex-wrap gap-2">
                        {task.cart.map((item, i) => (
                          <span key={i} className="text-xs font-bold text-blue-400">
                            {item.name}{i !== task.cart.length - 1 ? " • " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black tracking-tighter text-emerald-400">₹{task.total}</p>
                        <p className="text-[9px] font-bold text-gray-600 uppercase">Paid After Service</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 border-t border-white/5 pt-5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <IoCalendarOutline className="text-blue-500" size={14} />
                      <span className="text-[11px] font-medium uppercase tracking-tighter">{task.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <IoTimeOutline className="text-blue-500" size={14} />
                      <span className="text-[11px] font-medium uppercase tracking-tighter">{task.timeSlot}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-gray-400">
                      <IoLocationOutline className="text-blue-500" size={14} />
                      <span className="text-[11px] font-medium line-clamp-1 opacity-80">{task.address}</span>
                    </div>
                  </div>
                  
                <button
  onClick={() => router.push(`/track/${task.order_id}`)}
  className="mt-5 w-full py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
>
  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
    Track Booking
  </span>
  <IoChevronForward size={12} className="text-gray-600" />
</button>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* Support Footer Card */}
        <section className="mt-12 p-8 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 bg-white/10 blur-3xl rounded-full"></div>
            <h4 className="text-xl font-bold mb-2">Need Assistance?</h4>
            <p className="text-blue-100 text-xs font-medium mb-6 leading-relaxed">Our concierge team is available 24/7 to help with your bookings or service queries.</p>
            <button onclick={()=>{router.push("/contact")}} className="bg-white text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform">
                Contact Support
            </button>
        </section>

      </main>
    </div>
  );
}