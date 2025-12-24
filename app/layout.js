import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ClientLayout from "@/components/ClientLayout";
import RegisterSW from "./register-sw"; // ✅ ADD

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: "no",
  },
  title: "Shop ON",                 // ✅ ADD
  description: "Leading ecommerce platform",
  manifest: "/manifest.json",       // ✅ ADD
  themeColor: "#030712",             // ✅ ADD
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA meta tags */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black"
        />
        <meta name="apple-mobile-web-app-title" content="Shop ON" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body
        className={`${inter.variable} antialiased bg-[#030712] overflow-x-hidden`}
      >
        {/* ✅ Register service worker */}
        <RegisterSW />

        <SessionWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
