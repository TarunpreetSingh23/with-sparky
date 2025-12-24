import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    workerId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // optional
    },

    role: {
      type: String,
      enum: ["MU", "CL", "DC"],
      required: true,
    },

    availability: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFFLINE"],
      default: "AVAILABLE",
    },

    pushToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Worker ||
  mongoose.model("Worker", WorkerSchema);
