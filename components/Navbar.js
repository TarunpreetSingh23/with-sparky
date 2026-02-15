"use client";

import Link from "next/link";
import { useRouter,usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import dynamic from "next/dynamic";
import { X, MapPin, CheckCircle2, User,AlertTriangle,Phone } from "lucide-react";
import { FaListUl } from "react-icons/fa";

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
// import { useRouter } from "next/router";
const UserMap = dynamic(() => import("@/components/UserMap"), { ssr: false });
export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const router=useRouter();
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
// Example: Custom Amritsar delivery boundary
const AMRITSAR_BOUNDS = [
  { lat: 31.709249, lng: 74.817049 }, // North-West
  { lat: 31.666412, lng: 74.959695 }, // North-East
  { lat: 31.569168, lng: 74.891628 }, // South-East
  { lat: 31.626615, lng: 74.756365 }, // South-West
];
const isInsidePolygon = (point, polygon) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat <
        ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

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

  const inside = isInsidePolygon(
    { lat, lng },
    AMRITSAR_BOUNDS
  );

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
    // { name: "buetique", href: "/botique", icon: <IoMdInformationCircleOutline /> },
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
  

    {/* ================= MOBILE BOTTOM NAV ================= */}
 {/* <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"> */}
      
      {/* Navigation Container */}
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[56px] flex items-center z-50">
  
  <NavItem
    label="Home"
    onClick={() => router.push("/")}
    active={isActive("/")}
    icon={<IoHomeSharp size={18} />}
  />

  <NavItem
    label="Beauty"
    onClick={() => router.push("/beauty")}
    active={isActive("/beauty")}
    icon={<FaListUl size={18} />}
  />

  {/* CENTER SLOT (same width as others) */}
  <div
    onClick={() => router.push("/cart")}
    className="flex-1 flex justify-center"
  >
    <div className="relative -top-3 flex flex-col items-center">
      <div className="w-11 h-11 bg-[#8a9a5b] rounded-full flex items-center justify-center">
        <IoBagHandleOutline size={18} className="text-white" />
      </div>
      <span className="text-[9px] mt-[2px] text-gray-500">Cart</span>
    </div>
  </div>

  <NavItem
    label="Help"
    onClick={() => router.push("/contact")}
    active={isActive("/contact")}
    icon={<Phone size={18} />}
  />

  <NavItem
    label="Account"
    onClick={() => router.push("/user")}
    active={isActive("/user")}
    icon={<FaUserCircle size={18} />}
  />
</nav>
    {/* </div> */}

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
function NavItem({ label, icon, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center cursor-pointer flex-1 ${
        active ? "text-[#8a9a5b]" : "text-gray-400"
      }`}
    >
      <div className="h-[20px] flex items-center justify-center">
        {icon}
      </div>

      <span className="text-[9px] font-medium leading-none mt-[2px]">
        {label}
      </span>
    </div>
  );
}