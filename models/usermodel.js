import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows null values
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows users with only phone or only email
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
