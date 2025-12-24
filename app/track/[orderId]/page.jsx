"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RateWorker from "@/components/AssignedWorker";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  XCircle,
  PlusCircle,
  Star
} from "lucide-react";

export default function TrackBookingPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔹 ADD-ON STATE */
  const [addons, setAddons] = useState([]);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setTask(data.task || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  /* 🔹 FETCH ADD-ONS */
  useEffect(() => {
    async function fetchAddons() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();

        // simple heuristic: same category + not already in cart
        const existing = task?.cart?.map((i) => i.name) || [];

        const filtered = (Array.isArray(data) ? data : []).filter(
          (s) =>
            s.category === task?.cart?.[0]?.category &&
            !existing.includes(s.title)
        );

        setAddons(filtered.slice(0, 4));
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
      await fetch("/api/orders/add-addon", {
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

      router.refresh();
    } catch (err) {
      alert("Failed to add add-on");
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#030712] text-white p-10">
        Order not found
      </div>
    );
  }


  const acceptedWorkers =
    task.assignedWorkers?.filter((w) => w.status === "accepted") || [];

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-10 max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <Header task={task} />

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Info icon={<Calendar size={16} />} label="Date" value={task.date} />
        <Info icon={<Clock size={16} />} label="Time" value={task.timeSlot} />
        <Info icon={<MapPin size={16} />} label="Address" value={task.address} />
        <Info icon={<User size={16} />} label="Customer" value={task.customerName} />
      </div>

      {/* Services */}
      <Services task={task} />

      {/* Assigned Worker */}
     <AssignedWorkers workers={acceptedWorkers} task={task} />


      {/* 🔹 ADD-ONS */}
      {addons.length > 0 && (
        <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
            Enhance Your Service
          </h3>

          <div className="space-y-3">
            {addons.map((s) => (
              <div
                key={s._id}
                className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-xs text-gray-400">₹{s.price}</p>
                </div>

                <button
                  disabled={adding === s._id}
                  onClick={() => addAddon(s)}
                  className="flex items-center gap-1 text-xs font-black uppercase bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500 transition"
                >
                  <PlusCircle size={14} />
                  {adding === s._id ? "Adding…" : "Add"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {task.invoiceUrl && (
          <a
            href={task.invoiceUrl}
            target="_blank"
            className="flex-1 py-4 bg-blue-600 rounded-2xl text-center font-black uppercase text-xs flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download Invoice
          </a>
        )}

        {!task.is_canceled && !task.is_completed && (
          <button
            onClick={cancelOrder}
            className="flex-1 py-4 bg-red-600/20 text-red-500 border border-red-500/30 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2"
          >
            <XCircle size={16} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Header({ task }) {
  return (
    <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        Order ID
      </p>
      <h1 className="text-3xl font-black">{task.order_id}</h1>
      <p className="mt-2 text-sm font-bold text-blue-400">{task.status}</p>
    </div>
  );
}

function Services({ task }) {
  return (
    <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
        Services
      </h3>

      {task.cart.map((item, i) => (
        <div key={i} className="flex justify-between text-sm font-bold mb-2">
          <span>{item.name}</span>
          <span>₹{item.price}</span>
        </div>
      ))}

      <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-black">
        <span>Total</span>
        <span>₹{task.total}</span>
      </div>
    </div>
  );
}

function AssignedWorkers({ workers, task }) {
  return (
    <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
        Assigned Professional
      </h3>

      {workers.length === 0 ? (
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          Waiting for professional to accept
        </p>
      ) : (
        workers.map((w, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl px-4 py-3 mb-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{w.workerId}</span>
              <span className="text-emerald-400 font-black uppercase text-xs">
                Accepted
              </span>
            </div>

            {/* ⭐ RATE AFTER COMPLETION */}
            {task.is_completed && (
              <RateWorker workerId={w.workerId} />
            )}
          </div>
        ))
      )}
    </div>
  );
}


function Info({ icon, label, value }) {
  return (
    <div className="bg-[#111827] p-5 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
        {icon} {label}
      </div>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
