"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ReviewPage() {
  const { id: orderId } = useParams(); // order ID from URL
  const { data: session } = useSession(); // logged-in user
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const res = await fetch(`/api/services/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId, 
                        // send the order ID
        userId: session.user.id, // logged-in user ID
        rating,
        comment,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess("Review added successfully!");
      setRating(0);
      setComment("");
    } else {
      setSuccess(`Error: ${data.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>

      <div className="flex mb-4 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-3xl ${
              rating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        rows={4}
        className="border w-full p-3 rounded mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Submit Review
      </button>

      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  );
}
