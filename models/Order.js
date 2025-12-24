import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  paymentMethod: String,
  products: Array,
  subtotal: Number,
  tax: Number,
  delivery: Number,
  discount: Number,
  total: Number,
 
  isDispatched: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
