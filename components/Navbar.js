"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import { X, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
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
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [active, setActive] = useState("Home");
  const [showMap, setShowMap] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [user, setUser] = useState(null);
// const [active, setActive] = useState(mo);
  const [activeIndex, setActiveIndex] = useState(0);
const [address, setAddress] = useState("Tap To select Address");
const [pendingLocation, setPendingLocation] = useState(null);
  // Update index when active state changes to move the slider
  const handleItemClick = (name, index) => {
    setActive(name);
    setActiveIndex(index);
  };
  /* ================= AUTH ================= */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);
const checkAmritsar = (lat, lng) => {
    if (!lat || !lng) return false;

    const CENTER = { lat: 31.6340, lng: 74.8723 }; // Amritsar center
    const MAX_KM = 35;

    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat - CENTER.lat);
    const dLng = toRad(lng - CENTER.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(CENTER.lat)) *
        Math.cos(toRad(lat)) *
        Math.sin(dLng / 2) ** 2;

    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const inside = distance <= MAX_KM;
    
    // We update the state here so the UI reacts
    setOutOfBounds(!inside);
    return inside;
  };
  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
useEffect(() => {
  const saved = localStorage.getItem("user_address");
  if (saved) {
    try {
      const { address, lat, lng } = JSON.parse(saved);
      if (address) setAddress(address);
      if (lat && lng) setPendingLocation({ lat, lng });
    } catch (e) {
      console.error("Invalid saved address");
    }
  }
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
    { name: "Beauty", href: "/beauty", icon: <GiHamburgerMenu /> },
    { name: "buetique", href: "/botique", icon: <IoMdInformationCircleOutline /> },
    { name: "Support", href: "/contact", icon: <FaPhoneAlt /> },
    
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
   <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
              <button onClick={() => setShowMap(false)} className="bg-white p-3 rounded-full shadow-lg border">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 w-full h-full relative">
              {/* FIXED: Check your UserMap component's output order. 
                  Standard is usually (address, lat, lng) */}
              <UserMap setAddress={(addr, lat, lng) => {
                setAddress(addr);
                setPendingLocation({ lat, lng });
                // Check instantly so the "Sorry" overlay can appear immediately
                // checkAmritsar(lat, lng);
              }} />

              <AnimatePresence>
  {outOfBounds && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      /* Higher Z-index and saturated backdrop for that premium glass feel */
      className="fixed inset-0 z-[200] bg-[#030712]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative mb-8"
      >
        {/* Pulsing Outer Ring */}
        <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping scale-150 opacity-20" />
        
        {/* Main Icon Circle */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
          <AlertTriangle size={48} className="text-yellow-500" />
        </div>
      </motion.div>

      {/* Text Content with Staggered Slide-up */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">
          Outside Our Zone
        </h2>
        <p className="text-slate-400 text-base max-w-[280px] leading-relaxed font-medium">
          Sparky currently only serves the heart of <span className="text-blue-400 font-extrabold underline decoration-blue-500/30 underline-offset-4">Amritsar</span>. 
        </p>
        <p className="text-slate-500 text-xs mt-2 font-bold tracking-widest uppercase opacity-70">
          More cities coming soon
        </p>
      </motion.div>

      {/* High-Action Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setOutOfBounds(false)}
        className="mt-12 group relative px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl overflow-hidden active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        <span className="relative z-10">Back to City</span>
        {/* Subtle hover glow inside button */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>
            </div>

            <div className="absolute bottom-10 left-0 right-0 p-6 flex justify-center z-10">
              <button
                disabled={!pendingLocation}
                onClick={() => {
  if (!pendingLocation) return;

  const { lat, lng } = pendingLocation;

  if (checkAmritsar(lat, lng)) {
    localStorage.setItem(
      "user_address",
      JSON.stringify({
        address,
        lat,
        lng,
      })
    );

    setShowMap(false);
  }
}}

                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all ${
                  outOfBounds || !pendingLocation
                    ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed"
                    : "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 active:scale-95"
                }`}
              >
                <CheckCircle2 size={20} /> Confirm Location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <nav className="md:hidden fixed top-0 left-0 w-full bg-[#030712] backdrop-blur-xl px-4 py-1 pt-2 z-50 flex items-center justify-between border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      
      {/* Glow Effect Element - Placed behind the time for focus */}
      <div className="absolute top-0 left-4 w-24 h-12 bg-blue-500/10 blur-[40px] -z-10" />

      {/* Left Section: Delivery Time & Address */}
      <div className="flex flex-col tracking-tight">
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-400 leading-tight">
          SPARKY in
        </span>
        
        <div className="flex items-center mt-0.5 gap-1">
          <h1 className="text-[21px] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            40 minutes
          </h1>
        </div>

        <button onClick={() => {
  setOutOfBounds(false);
  setShowMap(true);}} className="flex items-center gap-0.5 mt-1 group">
            <span className="text-[13px] font-bold text-slate-100">HOME - </span>
            <span className="text-[13px] font-medium text-slate-400 truncate max-w-[160px]">{address}</span>
            <IoMdArrowDropdown className="text-base text-blue-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
      </div>

      {/* Right Section: Profile Icon with Glow Wrapper */}
      <div className="flex items-center gap-4">
               <Link href="/cart" className="relative">
          <IoBagHandleOutline className="text-3xl text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/user">
          <div className="relative group">
            {/* Glow behind profile */}
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-active:opacity-100 transition-opacity" />
            
            <div className="relative bg-slate-800/40 p-2 rounded-full border border-white/10 shadow-lg active:scale-90 transition-all backdrop-blur-md">
              <FaUserCircle className="text-[26px] text-slate-200" />
            </div>
          </div>
        </Link>
      </div>
    </nav>

    {/* ================= MOBILE BOTTOM NAV ================= */}
 <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      
      {/* Navigation Container */}
      <nav className="relative pointer-events-auto bg-[#030712] border-t border-white/10 px-2 pt-3 pb-2 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        
        {/* The Sliding Indicator */}
        {/* <div 
          className="absolute top-2 h-10 bg-white/10 rounded-xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `${100 / mobileMenuItems.length}%`,
            transform: `translateX(${activeIndex * 100}%) scale(0.85)`,
          }}
        /> */}

        {mobileMenuItems.map((item, index) => {
          const isActive = active === item.name;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleItemClick(item.name, index)}
              className="relative flex flex-col items-center justify-center flex-1 transition-all z-10"
            >
              {/* Icon - Glow effect on active */}
              <div
                className={`text-2xl mb-1 transition-all duration-300 ${
                  isActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-slate-200"
                }`}
              >
                {isActive ? item.icon : item.icon}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${
                  isActive ? "text-white" : "text-slate-200"
                }`}
              >
                {item.name}
              </span>

              {/* Unique Bottom Line Slit */}
              <div className={`mt-1.5 h-[2px] rounded-full transition-all duration-500 ${
                isActive ? "w-4 bg-blue-400" : "w-0 bg-transparent"
              }`} />
            </Link>
          );
        })}
      </nav>
    </div>

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
