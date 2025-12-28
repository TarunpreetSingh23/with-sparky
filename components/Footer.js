"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass =
    "text-gray-600 hover:text-blue-600 transition-colors duration-300";
  const headingClass =
    "text-lg font-black mb-4 text-gray-900 tracking-tight";

  return (
    <footer className="relative bg-gradient-to-b from-[#edf4ff] to-white border-t border-blue-100 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-10 border-b border-blue-100">
          
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/LOGO.jpg"
                alt="Company Logo"
                width={160}
                height={30}
                className="rounded-lg shadow-sm"
              />
            </Link>

            <p className="text-lg font-black text-gray-800">
              Quick.<span className="text-blue-600">Trusted</span>.Done.
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Your one-stop solution for reliable and quality home services.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className={linkClass}>About Us</Link></li>
              <li><Link href="/services" className={linkClass}>All Services</Link></li>
              <li><Link href="/careers" className={linkClass}>Careers</Link></li>
              <li><Link href="/blog" className={linkClass}>Blog & Tips</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={headingClass}>Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/t&c" className={linkClass}>Terms & Conditions</Link></li>
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/refund" className={linkClass}>Refund Policy</Link></li>
              <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <h3 className={headingClass}>Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <a href="mailto:support@sparky.com" className="hover:text-blue-600">
                  support@sparky.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-500" />
                <a href="tel:+10000000000" className="hover:text-blue-600">
                  +1 (000) 000-0000
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-indigo-500 mt-1" />
                <span>Amritsar, Punjab, India</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a className="text-gray-400 hover:text-blue-600 transition"><Facebook size={20} /></a>
              <a className="text-gray-400 hover:text-blue-600 transition"><Twitter size={20} /></a>
              <a className="text-gray-400 hover:text-blue-600 transition"><Instagram size={20} /></a>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 text-center text-gray-500 text-sm">
          © {currentYear} Sparky. All rights reserved.
          <span className="mx-2 text-gray-300">|</span>
          <Link href="/sitemap" className="hover:text-blue-600 transition">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
