"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, ArrowRight, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import HeroCarousel from "@/components/herocarosel";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- Mock Data ---
const MOST_BOOKED_SERVICES = [
  { name: "Manicure", image: "/images/mpm.jpg", rating: 4.79, reviews: "3.2M", currentPrice: "₹499", originalPrice: "₹799", href: "/services/manicure" },
  { name: "Bleach & Facial", image: "/images/vee4.jpg", rating: 4.91, reviews: "1.1M", currentPrice: "₹999", originalPrice: "₹1499", href: "/services/facial" },
  { name: "Theme Decor", image: "/images/wd.jpg", rating: 4.79, reviews: "68K", currentPrice: "₹2499", originalPrice: null, href: "/services/theme" },
  { name: "Kitchen Cleaning", image: "/images/kc.jpg", rating: 4.72, reviews: "69K", currentPrice: "₹1299", originalPrice: null, href: "/services/kitchen" },
];

const BEAUTY_CATEGORIES = [
  { id: 1, name: "Party Makeup", image: "/images/m.jpeg", href: "/services/party-makeup" },
  { id: 2, name: "Bridal Makeup", image: "/images/vee5.jpg", href: "/services/bridal-makeup" },
  { id: 3, name: "Manicure & Pedicure", image: "/images/mpm.jpg", href: "/services/manicure" },
  { id: 4, name: "Bleach & Facial", image: "/images/vee4.jpg", href: "/services/bleach" },
  { id: 5, name: "Hair Styling", image: "/images/m.jpeg", href: "/services/hair" },
  { id: 6, name: "Threading", image: "/images/tm.jpg", href: "/services/threading" },
  { id: 7, name: "Waxing", image: "/images/wm.jpg", href: "/services/waxing" },
];

const CLEANING_CATEGORIES = [
  { id: 1, name: "Home Deep Cleaning", image: "/images/hc1.webp", href: "/services/home" },
  { id: 2, name: "Office Cleaning", image: "/images/oc.jpg", href: "/services/office" },
  { id: 3, name: "Carpet Cleaning", image: "/images/cc.webp", href: "/services/carpet" },
  { id: 4, name: "Window Cleaning", image: "/images/wc.jpg", href: "/services/window" },
  { id: 5, name: "Sofa Cleaning", image: "/images/hc.webp", href: "/services/sofa" },
  { id: 6, name: "Kitchen Appliance", image: "/images/kc.jpg", href: "/services/kitchen" },
  { id: 7, name: "Bathroom Sanitization", image: "/images/washc.webp", href: "/services/bathroom" },
];

const EVENT_CATEGORIES = [
  { id: 1, name: "Birthday Decor", image: "/images/bd.jpg", href: "/services/birthday" },
  { id: 2, name: "Wedding Decor", image: "/images/wd.jpg", href: "/services/wedding" },
  { id: 3, name: "Corporate Event", image: "/images/event-corporate.jpg", href: "/services/corporate" },
  { id: 4, name: "Balloon Decoration", image: "/images/event-balloons.jpg", href: "/services/balloons" },
  { id: 5, name: "Flower Arrangements", image: "/images/event-flowers.jpg", href: "/services/flowers" },
  { id: 6, name: "Stage & Lighting", image: "/images/event-stage.jpg", href: "/services/stage" },
];

// --- Sub-Components ---

const ServiceCard = ({ service }) => (
  <div className="group relative bg-[#111827]/40 backdrop-blur-xl border border-white/5 rounded-[24px] overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-2">
    <Link href={service.href}>
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-[10px] font-bold">{service.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-gray-500 text-xs mb-4">{service.reviews} reviews</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-white">{service.currentPrice}</span>
            {service.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2 font-medium">{service.originalPrice}</span>
            )}
          </div>
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

const CategorySection = ({ title, categories, viewAllHref }) => (
  <section className="py-12 md:py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h2>
          <div className="h-1 w-12 bg-blue-500 rounded-full mt-3" />
        </div>
        <Link href={viewAllHref} className="text-blue-400 font-bold text-sm hover:text-blue-300 transition flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.slice(0, 7).map((cat) => (
          <div key={cat.id} className="group relative h-40 md:h-52 rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
            <Link href={cat.href}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-sm md:text-lg leading-tight line-clamp-2">{cat.name}</p>
              </div>
            </Link>
          </div>
        ))}

        <Link
          href={viewAllHref}
          className="relative h-40 md:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col items-center justify-center text-center p-6 shadow-xl hover:shadow-blue-500/20 transition-all border border-white/10 active:scale-95"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
             <ArrowRight className="text-white" />
          </div>
          <span className="text-white font-black text-sm uppercase tracking-widest">See More</span>
        </Link>
      </div>
    </div>
  </section>
);

function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#030712] z-[100]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col items-center">
        <Image src="LOGO.jpg" alt="Logo" width={180} height={60} className="mb-10 rounded-2xl shadow-2xl" />
        <div className="w-56 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "circIn" }}
            className="h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Page Component ---
export default function Home() {
  const { data: session } = useSession();
  const cleaningRef = useRef(null);
  const eventRef = useRef(null);
  const beautyRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const seen = localStorage.getItem("onboardingSeen");
    if (isMobile && seen !== "true") {
      router.replace("/onboarding");
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-[#030712] min-h-screen text-gray-100 selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <div className="relative">
        <HeroCarousel />
      </div>

      <main className="relative z-10 pb-20">
        
        {/* 2. Trust Banner */}
        <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-8 border-y border-white/5 bg-white/[0.02] backdrop-blur-md rounded-3xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400" size={24} />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Verified Pros</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={24} />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-red-400" size={24} />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">Doorstep Service</span>
            </div>
          </div>
        </div>

        {/* 3. Most Booked Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="text-left">
                <span className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3 block">Favorites</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Top Rated Services</h2>
              </div>
              <p className="mt-4 md:mt-0 text-gray-400 text-lg max-w-md font-medium">Verified excellence at your fingertips.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {MOST_BOOKED_SERVICES.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* --- Category Sections with Dynamic Background Blurs --- */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div ref={cleaningRef}>
            <CategorySection 
              title="Home & Office"
              categories={CLEANING_CATEGORIES}
              viewAllHref="/clean"
            />
          </div>

          <div ref={beautyRef}>
            <CategorySection
              title="Beauty & Salon"
              categories={BEAUTY_CATEGORIES}
              viewAllHref="/facial"
            />
          </div>

          <div ref={eventRef}>
            <CategorySection
              title="Event Styling"
              categories={EVENT_CATEGORIES}
              viewAllHref="/eventdecor"
            />
          </div>
        </div>

        {/* 4. CTA Section */}
        <section className="px-4 py-12 md:py-24">
          <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-900 p-8 md:p-16 text-center shadow-2xl shadow-blue-500/20 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to transform<br/>your space?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">Experience the best in professional service delivery, right at your doorstep.</p>
            <Link
              href="/all-services"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-900 font-black rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95"
            >
              Explore All Services
            </Link>
          </div>
        </section>

      </main>

      {/* 5. Footer */}
      {/* <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Image src="/images/LOGO (2).jpg" alt="Brand Logo" width={160} height={50} className="mb-6 rounded-lg" />
              <p className="text-gray-500 text-sm leading-relaxed">Your premium destination for home, beauty, and events.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400 transition">Latest News</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400 transition">Support Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Use</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Stay Connected</h4>
              <p className="text-gray-500 text-sm mb-4">support@sparky.com</p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">
                    <span className="text-xs">IG</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">
                    <span className="text-xs">FB</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/5 text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Sparky Services. Crafted for Excellence.
          </div>
        </div>
      </footer> */}

      {/* Added a simple CSS shimmer animation for the loader since motion is removed */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}