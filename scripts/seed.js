import "dotenv/config";   
import mongoose from "mongoose";
import { connects } from "../dbconfig/dbconfig.js";
import Service from "../models/servicemodel.js";

const services = [
  {
    serviceId: "WU3001",
    category: "Woman Services",
    title: "CLASSICAL MANICURE",
    description: "Traditional manicure for clean and healthy nails.",
    price: 600,
    rating: 4.9,
  },
  {
    serviceId: "WU3002",
    category: "Woman Services",
    title: "DIP POWDER MANICURE",
    description: "Long-lasting powder manicure without UV light.",
    price: 1100,
    rating: 5,
  },
  {
    serviceId: "WU3003",
    category: "Woman Services",
    title: "SPA MANICURE",
    description: "Luxury manicure with massage and hydration.",
    price: 1200,
    rating: 5,
  }
];

async function seedServices() {
  try {
    await connects();

    const result = await Service.insertMany(services, {
      ordered: false, // continues even if one fails
    });

    console.log("✅ Services inserted:", result.length);
  } catch (error) {
    console.error("❌ Error inserting services:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedServices();
