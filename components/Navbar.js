"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoClose,
  IoHomeSharp,
  IoBagHandleOutline,
} from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsShieldCheck } from "react-icons/bs";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= CART ================= */
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const desktopLinks = ["Home", "Clean", "Beauty", "Event Decor", "About"];

  const mobileMenuItems = [
    { name: "Home", href: "/", icon: <IoHomeSharp /> },
    { name: "Explore", href: "/beauty", icon: <GiHamburgerMenu /> },
    // { name: "Support", href: "/about", icon: <IoMdInformationCircleOutline /> },
    { name: "Support", href: "/contact", icon: <FaPhoneAlt /> },
    {
      name: "Profile",
      href: user ? "/user" : "/login",
      icon: <CgProfile />,
    },
  ];
  const sliderItems = [
    { name: "About Sparky", href: "/about", icon: <IoHomeSharp /> },
    { name: "Support", href: "/contact", icon: <GiHamburgerMenu /> },
    { name: "terms & conditions", href: "/t&c", icon: <IoMdInformationCircleOutline /> },
    { name: "Privacy Policy", href: "/privacy", icon: <FaPhoneAlt /> },
      { name: "Cancellation Policy", href: "/refund", icon: <FaPhoneAlt /> },
    // {
    //   name: "Profile",
    //   href: user ? "/user" : "/login",
    //   icon: <CgProfile />,
    // },
  ];

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl px-8 py-4 z-50 rounded-2xl border transition-all ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-blue-100 shadow-lg"
            : "bg-white border-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/wLogo.png"
            alt="Logo"
            width={140}
            height={34}
            className="object-contain"
          />
        </Link>

        {/* Center Menu */}
        <div className="mx-auto flex gap-1 bg-blue-50 p-1.5 rounded-xl border border-blue-100">
          {desktopLinks.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`}
              onClick={() => setActive(item)}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
                active === item
                  ? "text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {active === item && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                />
              )}
              <span className="relative z-10">{item}</span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
            <IoBagHandleOutline className="text-2xl" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link
            href={user ? "/user" : "/login"}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-black tracking-tight hover:bg-blue-700 transition"
          >
            {user ? "Account" : "Get Started"}
          </Link>
        </div>
      </motion.nav>

      {/* ================= MOBILE TOP NAV ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[72px] bg-[#030712] backdrop-blur border-b-4 border-grey-200 shadow-xl flex items-center justify-between px-5 z-50">
        <button onClick={() => setMenuOpen(true)}>
          <GiHamburgerMenu className="text-2xl text-white" />
        </button>

        <Link href="/">
          <Image src="/LOGO.jpg" alt="Logo" width={120} height={30} />
        </Link>

        <Link href="/cart" className="relative">
          <IoBagHandleOutline className="text-2xl text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
  {mobileMenuItems.map((item) => {
    const isActive = active === item.name;
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setActive(item.name)}
        className="relative flex flex-col items-center justify-center min-w-[65px] py-1 transition-all active:scale-90"
      >
        {/* Active Indicator Bar - Glides if you use a single div, 
            but for a simpler 'fade-and-slide' feel per item: */}
        <div 
          className={`absolute top-[-8px] w-6 h-[3px] bg-black rounded-b-full transition-all duration-300 ease-out ${
            isActive ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
          }`} 
        />

        {/* Icon Container */}
        <div
          className={`mb-1 transition-all duration-300 ease-in-out ${
            isActive ? "text-black scale-110" : "text-slate-400"
          }`}
        >
          <span className="text-xl">
            {item.icon}
          </span>
        </div>

        {/* Label Styling */}
        <span
          className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ease-in-out ${
            isActive ? "text-black opacity-100" : "text-slate-400 opacity-60"
          }`}
        >
          {item.name}
        </span>
      </Link>
    );
  })}
</nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[70] p-8 border-r border-blue-100 shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24 }}
            >
              <div className="flex justify-between items-center mb-10">
                <Image src="/images/wLogo.png" alt="Logo" width={120} height={30} />
                <button onClick={() => setMenuOpen(false)}>
                  <IoClose className="text-3xl text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Quick Links
                </p>
                {sliderItems.map((item) => (
                  <Link
                    key={item}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-between items-center text-gray-700 font-medium hover:text-blue-600"
                  >
                    {item.name}
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-8 right-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <BsShieldCheck />
                  <span className="text-xs font-bold">Verified Professionals</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  All partners are background verified.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
