"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/cartu";

  return (
    <>
      {!hideLayout && <Navbar />}

      <main
        className={
          !hideLayout ? "pt-[66px] md:pt-[70px] pb-[72px] md:pb-0" : ""
        }
      >
        {children}
        <Toaster position="top-right" />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}
