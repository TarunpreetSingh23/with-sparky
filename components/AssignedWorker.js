"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function RateWorker({ workerId }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async (stars) => {
    try {
      setRating(stars);

      await fetch("/api/workers/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, stars }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Rating failed", err);
    }
  };

  if (submitted) {
    return (
      <p className="text-emerald-400 text-xs font-black uppercase mt-2">
        Thank you for rating!
      </p>
    );
  }

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} onClick={() => submitRating(s)}>
          <Star
            size={18}
            className={
              s <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-500"
            }
          />
        </button>
      ))}
    </div>
  );
}
