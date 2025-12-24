import mongoose from "mongoose";

const cleanSchema = new mongoose.Schema(
  {
    maincategory: {
      type: String,
      required: true, // e.g., "Electrician", "Decoration"
    },
    category:{
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

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to User model
        comment: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker", // worker IDs who can do this clean
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const Clean =
  mongoose.models.Clean || mongoose.model("Clean", cleanSchema);

export default Clean;
