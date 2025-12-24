"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";

// Dummy API for now (replace with MongoDB fetch)
const dummyTasks = [
  {
    id: "1",
    title: "Fix AC",
    description: "Repair air conditioning system in Room 204.",
    date: new Date(),
    status: "Ongoing",
    priority: "High",
    client: "John Doe",
    contact: "+1 234 567 890",
    location: "Building A, Room 204",
  },
  {
    id: "2",
    title: "Install Washing Machine",
    description: "Install Samsung washing machine in apartment 302.",
    date: new Date(),
    status: "Pending",
    priority: "Medium",
    client: "Jane Smith",
    contact: "+1 987 654 321",
    location: "Building B, Apt 302",
  },
];

export default function TaskDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [task, setTask] = useState(null);

  useEffect(() => {
    const found = dummyTasks.find((t) => t.id === id);
    setTask(found);
  }, [id]);

  if (!task) {
    return <p className="text-center mt-10">Loading task...</p>;
  }

  return (
    <main className="bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="text-blue-600 font-medium mr-2"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold">{task.title}</h1>
      </div>

      {/* Task Card */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-bold mb-2">{task.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{task.description}</p>

        <div className="text-sm space-y-2">
          <p>
            <span className="font-medium">Date:</span>{" "}
            {format(new Date(task.date), "MMM dd, yyyy")}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-lg ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "Ongoing"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {task.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Priority:</span>{" "}
            <span
              className={`px-2 py-1 rounded-lg ${
                task.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority}
            </span>
          </p>
          <p>
            <span className="font-medium">Client:</span> {task.client}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {task.contact}
          </p>
          <p>
            <span className="font-medium">Location:</span> {task.location}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl shadow">
          Accept
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl">
          Reject
        </button>
      </div>
    </main>
  );
}
