import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ClientLayout from "@/components/ClientLayout";
import RegisterSW from "./register-sw";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* ✅ VIEWPORT */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030712",
};

/* ✅ METADATA */
export const metadata = {
  title: "Sparky | Trusted Home & Beauty Services Near You",
  description:
    "Book reliable home services with Sparky – beauty, salon at home, AC repair, cleaning, plumbing & more. Verified professionals. Affordable pricing. Fast service.",
  keywords: [
    "home services",
    "beauty services at home",
    "salon at home",
    "AC repair",
    "home cleaning",
    "plumbing services",
    "electrician near me",
    "Sparky services"
  ],

  // ✅ Verification Section
  verification: {
    google: "00Tll4nTUIZo5sGMKKbG_aX1wr49ZgAbWgCconpIYUU",
    other: {
      "facebook-domain-verification":
        "py7iw7ig6emuxdr7ms66a1q0kqr0go",
    },
  },

  openGraph: {
    title: "Sparky | Trusted Home & Beauty Services",
    description:
      "From salon at home to AC repair and cleaning, Sparky connects you with verified professionals for fast, affordable home services.",
    url: "https://sparky.in",
    siteName: "Sparky",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sparky Home Services"
      }
    ],
    locale: "en_IN",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Sparky | Home & Beauty Services",
    description:
      "Book trusted home services – beauty, salon, AC repair, cleaning & more with Sparky.",
    images: ["/images/og-image.jpg"]
  },

  manifest: "/manifest.json",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ iOS PWA SUPPORT */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Shop ON" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body
        className={`${inter.variable} antialiased bg-white overflow-x-hidden`}
      >
        {/* ✅ GOOGLE MAPS – LOAD ONCE, CLIENT ONLY */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />

        <RegisterSW />

        <SessionWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
