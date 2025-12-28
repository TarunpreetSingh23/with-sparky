import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ClientLayout from "@/components/ClientLayout";
import RegisterSW from "./register-sw";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* ✅ ONLY HERE */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030712",
};

/* ✅ CLEAN METADATA */
export const metadata = {
  title: "Shop ON",
  description: "Leading ecommerce platform",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Shop ON" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body
        className={`${inter.variable} antialiased bg-[#edf4ff] overflow-x-hidden`}
      >
        <RegisterSW />

        <SessionWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
