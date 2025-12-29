"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ShieldCheck,
  ArrowUpRight,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden font-sans">
      {/* Decorative Gradient Background Blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Brand & Mission Section - Spans 5 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-8"
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

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-[#030712] tracking-tighter leading-[0.9] lg:max-w-md">
                Elevating Home <br />
                <span className="text-blue-600 flex items-center gap-2">
                   Services <Sparkle className="fill-blue-600 text-blue-600" size={24} />
                </span>
              </h2>
              
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-[15px]">
                Professional, verified, and high-quality services delivered to your doorstep. We are redefining the standard of home care.
              </p>
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact & Professional Info Section - Spans 7 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {/* Bento Box 1: Contact Details */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">Global Support</h3>
              <ul className="space-y-6">
                <li>
                  <a href="mailto:support@sparky.com" className="group flex items-center gap-4 text-slate-600 font-bold hover:text-[#030712] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <span className="text-[14px]">support@sparky.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+910000000000" className="group flex items-center gap-4 text-slate-600 font-bold hover:text-[#030712] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Phone size={18} />
                    </div>
                    <span className="text-[14px]">+91 00000-00000</span>
                  </a>
                </li>
                <li className="flex items-center gap-4 text-slate-600 font-bold">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MapPin size={18} />
                  </div>
                  <span className="text-[14px]">Amritsar, Punjab</span>
                </li>
              </ul>
            </div>

            {/* Bento Box 2: Verification Badge */}
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                   <ShieldCheck className="text-blue-600" size={24} />
                </div>
                <h3 className="text-[15px] font-black uppercase tracking-tight text-[#030712]">Safety First Network</h3>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                  Every professional on our platform undergoes a rigorous 5-step background check and skill validation.
                </p>
              </div>
              <Link href="/privacy" className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-3 transition-all duration-300">
                TRUST CENTER <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Legal Section - Ultra Clean */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
               © {currentYear} Sparky Services Pvt Ltd.
             </p>
          </div>
          
          <div className="flex gap-8">
            {['Terms', 'Privacy', 'Refunds'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace('terms', 't&c')}`} 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}