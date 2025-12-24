"use client";

import React from 'react';
import { motion } from 'framer-motion';

// === ICONS ===
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const StarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function AboutUs() {

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const brandBlue = "#002366";

  return (
    <div className="bg-gray-50 font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-br from-[#002366] to-gray-900 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-extrabold">About Sparky</motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Connecting you with trusted, skilled professionals for all your home service needs. 
            We are committed to quality, safety, and reliability.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <motion.section 
        className="py-20 sm:py-28"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-semibold text-gray-900 border-l-4 border-[#002366] pl-4">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our mission is to simplify home services by creating a seamless, transparent, and trustworthy platform.
              We empower local technicians to grow their business while ensuring customers receive top-tier service every time.
              We believe in building a community based on respect, integrity, and excellence.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp} 
            className="bg-white shadow-lg p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-semibold text-[#002366]">Our Vision</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              To become India’s most trusted home services platform, known for our unwavering commitment 
              to quality, reliability, and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-20 border-y border-gray-200">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center">
            <motion.h2 variants={fadeInUp} className="text-3xl font-semibold text-gray-900">Why Choose Sparky?</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 max-w-2xl mx-auto text-gray-600">
              We go the extra mile to ensure your peace of mind.
            </motion.p>
          </div>

          <motion.div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {[
              { Icon: ShieldIcon, title: "Verified Professionals", desc: "Every technician undergoes a rigorous verification process, including background checks, for your safety." },
              { Icon: CheckCircleIcon, title: "Quality Guarantee", desc: "We’re committed to excellence. If you're not satisfied, we’ll make it right through our rework and support policy." },
              { Icon: StarIcon, title: "Transparent Pricing", desc: "No hidden fees. All costs are clear upfront, so you know exactly what you’re paying for." }
            ].map(({ Icon, title, desc }, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#002366]/10 mb-4">
                  <Icon className="h-7 w-7" style={{ color: brandBlue }}/>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-[#002366] to-gray-900 text-white text-center"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold">Ready to Experience the Sparky Difference?</h2>
          <p className="mt-4 text-gray-300 text-lg">
            Book a trusted professional in minutes and get your to-do list done with confidence.
          </p>
          <div className="mt-8">
            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#002366] font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Book a Service
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}