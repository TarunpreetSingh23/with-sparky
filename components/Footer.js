"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

return (
  <footer className="w-full bg-white flex justify-center">

    {/* App Container (Mobile Width) */}
    <div className="w-full max-w-[430px] bg-[#F5F7F2] border-t border-[#E0E5D2] relative overflow-hidden">

      {/* Soft ambient background */}
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#8A9A5B]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-60 h-60 bg-[#3A4D39]/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="px-6 py-12 relative z-10">

        {/* Brand Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Link href="/" className="inline-block">
            <Image
              src="/images/wLogo.png"
              alt="Sparky Logo"
              width={120}
              height={32}
              className="object-contain"
            />
          </Link>

          <div className="space-y-4">
            <h2 className="text-[24px] font-semibold text-[#1A2421] tracking-tight leading-snug">
              Rituals, Reimagined at Home
            </h2>

            <p className="text-[#6B7A63] text-[14px] leading-relaxed">
              Thoughtfully curated beauty and home services delivered by
              verified professionals with uncompromised hygiene and care.
            </p>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-[#E0E5D2] text-center">
          <p className="text-[11px] text-[#6B7A63] tracking-wide">
            © {currentYear} Sparky • Crafted with care
          </p>
        </div>

      </div>
    </div>

  </footer>
);
}
