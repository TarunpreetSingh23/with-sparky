"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/checkout" || pathname === "/cart" || pathname ==="/beauty";

  return (
    <>
      {!hideLayout && <Navbar />}

      <main
        className={
          !hideLayout
            ? ""
            : ""
        }
      >
        {children}
        <Toaster position="top-right" />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}
