import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    subscribed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
