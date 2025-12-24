import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// 👇 THIS THIRD ARGUMENT IS THE KEY FIX
const Service =
  mongoose.models.Service ||
  mongoose.model("Service", serviceSchema, "service");

export default Service;
