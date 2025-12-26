"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoHomeSharp, IoBagHandleOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCirclePlus } from "react-icons/fa6";
import { BsShieldCheck } from "react-icons/bs"; // This is your imported shield icon

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  // JWT User (phone-based login)
  const [user, setUser] = useState(null);

  /* ================= CHECK LOGIN SESSION ================= */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= CART COUNT ================= */
  useEffect(() => {
    const updateCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(savedCart.length);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  /* ================= MENU ITEMS ================= */
  const mobileMenuItems = [
    { name: "Home", href: "/", icon: <IoHomeSharp /> },
    { name: "Explore", href: "/beauty", icon: <GiHamburgerMenu /> },
    { name: "About", href: "/about", icon: <IoMdInformationCircleOutline /> },
    { name: "Support", href: "/contact", icon: <FaPhoneAlt /> },
    {
      name: user ? "Profile" : "Profile",
      href: user ? "/user" : "/login",
      icon: user ? <CgProfile /> : <CgProfile />,
    },
  ];

  const desktopLinks = ["Home", "Clean", "Beauty", "Event Decor", "About"];

  /* ================= NAV ANIMATION ================= */
  const navVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      {/* ================= DESKTOP FLOATING NAV ================= */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl transition-all duration-500 z-50 px-8 items-center justify-between rounded-2xl border ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-xl border-white/10 h-[74px] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
            : "bg-gray-900 h-[85px] border-transparent"
        }`}
      >
        <Link href="/" className="active:scale-95 transition-transform">
          <Image
            src="/images/LOGO (2).jpg"
            alt="Logo"
            width={150}
            height={40}
            className="rounded-lg object-contain"
          />
        </Link>

        {/* Center Menu */}
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
          {desktopLinks.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`}
              onClick={() => setActive(item)}
              className={`text-[13px] px-6 py-2.5 rounded-lg font-semibold tracking-wide transition-all duration-300 relative group ${
                active === item ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="relative z-10">{item}</span>
              {active === item && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-white">
            <IoBagHandleOutline className="text-2xl" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-blue-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-white ring-2 ring-gray-900"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link
            href={user ? "/user" : "/login"}
            className="bg-white text-gray-950 px-8 py-2.5 rounded-xl text-sm font-black tracking-tight hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
          >
            {user ? "ACCOUNT" : "GET STARTED"}
          </Link>
        </div>
      </motion.nav>

      {/* ================= MOBILE TOP NAV ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[74px] bg-[#030712] backdrop-blur-lg flex items-center justify-between px-5 z-50 border-b border-white/5">
        <button onClick={() => setMenuOpen(true)} className="p-2 active:scale-90">
          <GiHamburgerMenu className="text-2xl text-gray-300" />
        </button>
        <Link href="/">
          <Image src="/images/lOGO.jpg" alt="Logo" width={120} height={30} className="rounded-md" />
        </Link>
        <Link href="/cart" className="relative p-2">
          <IoBagHandleOutline className="text-2xl text-gray-300" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-blue-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold ring-2 ring-gray-900">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= MOBILE BOTTOM DOCK ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#030712] backdrop-blur-lg border-t border-white/5 px-4 py-2 flex justify-around z-40">
        {mobileMenuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActive(item.name)}
            className="flex flex-col items-center min-w-[60px]"
          >
            <span className={`text-2xl mb-1 ${active === item.name ? "text-blue-400" : "text-gray-200"}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold uppercase ${
              active === item.name ? "text-blue-400" : "text-gray-500"
            }`}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-gray-950 z-[70] p-8 shadow-2xl border-r border-gray-800"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-10">
                <Image src="/LOGO.jpg" alt="Logo" width={120} height={30} className="rounded" />
                <button onClick={() => setMenuOpen(false)} className="text-gray-400 p-2">
                  <IoClose className="text-3xl" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Main Categories</p>
                {["Home Deep Cleaning", "Bridal Makeup", "Salon for Men", "Wedding Decor"].map((item) => (
                  <Link
                    key={item}
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-gray-200 text-lg font-medium group-hover:text-blue-400 transition-colors">{item}</span>
                    <span className="text-gray-600">→</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-8 right-8 p-4 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  {/* FIXED: Changed from FaShieldCheck to BsShieldCheck */}
                  <BsShieldCheck /> 
                  <span className="text-xs font-bold text-white">Pro Verified</span>
                </div>
                <p className="text-[10px] text-gray-500">All our partners are background verified professionals.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}