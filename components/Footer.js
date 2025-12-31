"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Brand & Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-8"
          >
            <Link href="/" className="inline-block transition-transform hover:scale-95 duration-300">
              <Image
                src="/images/wLogo.png"
                alt="Sparky Logo"
                width={130}
                height={32}
                className="rounded-lg object-contain"
              />
            </Link>

            <div className="space-y-5">
              <h2 className="text-4xl font-black text-[#030712] tracking-tighter leading-[1.1]">
                Elevating Home <br />
                <span className="text-blue-600 flex items-center gap-2">
                    Services <Sparkle className="fill-blue-600 text-blue-600" size={24} />
                </span>
              </h2>
              
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-[15px]">
                Professional, verified, and high-quality services delivered to your doorstep. We are redefining the standard of home care.
              </p>
            </div>

            {/* Social Icons Integrated Here for better visual flow */}
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Contact Card Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 w-full lg:mt-2"
          >
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Global Support</h3>
              
              <ul className="space-y-6">
                <li>
                  <a href="mailto:contact@sparky.org.in" className="group flex items-center gap-4 text-slate-600 font-bold hover:text-[#030712] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <Mail size={18} />
                    </div>
                    <span className="text-[14px] tracking-tight">contact@sparky.org.in</span>
                  </a>
                </li>
                
                <li className="flex items-center gap-4 text-slate-600 font-bold">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <span className="text-[14px] tracking-tight">Amritsar, Punjab</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Refined Bottom Copyright Section */}
        <div className="mt-16 pt-8 mb-6 border-t border-slate-50 flex justify-center items-center">
          <div className="flex items-center gap-2.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
               © {currentYear} Sparky Services • All Rights Reserved
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}