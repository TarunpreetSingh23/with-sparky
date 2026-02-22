"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#F5F7F2] border-t border-[#E0E5D2] overflow-hidden font-sans">
      
      {/* Soft ambient background */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8A9A5B]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#3A4D39]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Brand Block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <Link href="/" className="inline-block">
              <Image
                src="/images/wLogo.png"
                alt="Sparky Logo"
                width={140}
                height={36}
                className="object-contain"
              />
            </Link>

            <div className="space-y-4">
              <h2 className="text-[34px] font-black text-[#1A2421] tracking-tight leading-tight">
                Premium Care for <br />
                <span className="text-[#3A4D39] inline-flex items-center gap-2">
                  Everyday Rituals
                  <Sparkles size={22} className="text-[#8A9A5B]" />
                </span>
              </h2>

              <p className="text-[#6B7A63] font-medium max-w-sm leading-relaxed text-[15px]">
                Thoughtfully curated beauty and home services, delivered by
                verified professionals with salon-grade hygiene and care.
              </p>
            </div>
          </motion.div>

          {/* Minimal Trust Statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            {/* <div className="bg-white rounded-[2rem] p-8 border border-[#E0E5D2] shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#8A9A5B] mb-3">
                Saga Promise
              </p>
              <p className="text-[#3A4D39] font-bold text-[15px] leading-relaxed">
                Certified Experts • Single-Use Kits • Transparent Pricing •
                Calm, Reliable Experiences
              </p>
            </div> */}
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-[#E0E5D2] flex justify-center">
          <p className="text-[11px] font-semibold text-[#6B7A63] uppercase tracking-[0.2em]">
            © {currentYear} Sparky • Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
}
