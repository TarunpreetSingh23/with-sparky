"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Define consistent styling
  const linkClass = "text-gray-400 hover:text-[#3ab4ff] transition duration-300";
  const headingClass = "text-xl font-bold mb-4 text-white";

  return (
    <footer className="relative bg-[#030712] text-white overflow-hidden border-t border-gray-700">
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 relative z-10">
        
        {/* Top Section: Brand, Tagline, and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-10 border-b border-gray-700">
          
          {/* Column 1: Brand & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/LOGO (2).jpg" 
                alt="Company Logo"
                width={170}
                height={30}
                className="rounded-lg shadow-xl"
              />
            </Link>
            <p className="mt-2 text-lg font-semibold text-gray-300">
              Quick.<span className="text-[#3ab4ff]">Trusted</span>.Done.
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Your one-stop solution for reliable and quality home services.
            </p>
          </motion.div>

          {/* Column 2: Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className={linkClass}>About Us</Link></li>
              <li><Link href="/services" className={linkClass}>All Services</Link></li>
              <li><Link href="/careers" className={linkClass}>Careers</Link></li>
              <li><Link href="/blog" className={linkClass}>Blog & Tips</Link></li>
            </ul>
          </motion.div>

          {/* Column 3: Legal & Support */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0 }}
          >
            <h3 className={headingClass}>Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/t&c" className={linkClass}>Terms & Conditions</Link></li>
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/refund" className={linkClass}>Refund Policy</Link></li>
              <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
            </ul>
          </motion.div>

          {/* Column 4: Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <h3 className={headingClass}>Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-pink-500" />
                <a href="mailto:support@sparky.com" className="hover:text-white transition">support@sparky.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-yellow-500" />
                <a href="tel:+10000000000" className="hover:text-white transition">+1 (000) 000-0000</a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin size={18} className="text-indigo-500 flex-shrink-0 mt-1" />
                <span>Amritsar, Punjab, India</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-white transition transform hover:scale-110"><Instagram size={20} /></a>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar (Copyright) */}
        <div className="mt-8 pt-4 text-center text-gray-500 text-sm">
          <p>
            © {currentYear} Sparky. All rights reserved. 
            <span className="mx-2 text-gray-700">|</span>
            <Link href="/sitemap" className="hover:text-white transition">Sitemap</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}