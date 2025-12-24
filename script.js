import mongoose from "mongoose";
import Service from "../models/servicemodel.js";
import { connects } from "../dbconfig/dbconfig.js";

const services = [
  {
    serviceId: "WU2001",
    category: "Woman Services",
    title: "SPA MANICURE",
    description: "Relaxing spa manicure",
    price: 1200,
    rating: 5,
  },
  {
    serviceId: "WU2002",
    category: "Woman Services",
    title: "DIP POWDER MANICURE",
    description: "Long-lasting powder manicure",
    price: 1100,
    rating: 4.9,
  },
];

async function seed() {
  try {
    await connects();

    await Service.insertMany(services);

    console.log("✅ Services inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
