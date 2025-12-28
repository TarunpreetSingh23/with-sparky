"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoLogOutOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoChevronForward,
  IoBagCheckOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-[#edf4ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">
            Loading Profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf4ff] pb-24 font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-blue-100 px-6 py-5 flex justify-between items-center">
        <h1 className="text-lg font-black tracking-tight">My Account</h1>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
        >
          <IoLogOutOutline size={22} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8">
        {/* User Info */}
        <section className="mb-12 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-300/40">
              <IoPersonCircleOutline size={46} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#edf4ff] rounded-full" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
              Verified User
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              {user.phone}
            </h2>
            <p className="text-gray-500 text-xs font-medium">
              Standard Membership
            </p>
          </div>
        </section>

        {/* Orders */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">
              Order History
            </h3>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">
              {tasks.length} Orders
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-blue-100">
              <IoBagCheckOutline size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">
                No bookings yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm active:scale-[0.98] transition"
                >
                  <div className="flex justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        ID: {task.order_id}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {task.cart.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold text-blue-600"
                          >
                            {item.name}
                            {i !== task.cart.length - 1 && " •"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-500">
                        ₹{task.total}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Pay After Service
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 border-t border-blue-50 pt-4 text-gray-500">
                    <div className="flex items-center gap-2 text-xs">
                      <IoCalendarOutline className="text-blue-500" />
                      {task.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <IoTimeOutline className="text-blue-500" />
                      {task.timeSlot}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-xs">
                      <IoLocationOutline className="text-blue-500" />
                      <span className="line-clamp-1">{task.address}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/track/${task.order_id}`)}
                    className="mt-5 w-full py-3 bg-blue-50 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                      Track Booking
                    </span>
                    <IoChevronForward size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Support Card */}
        <section className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
          <h4 className="text-xl font-bold mb-2">Need Assistance?</h4>
          <p className="text-blue-100 text-xs font-medium mb-6">
            Our support team is available 24/7 for your bookings and queries.
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="bg-white text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition"
          >
            Contact Support
          </button>
        </section>
      </main>
    </div>
  );
}
