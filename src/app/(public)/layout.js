import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleTagManager } from '@next/third-parties/google'
import { CityProvider } from "@/context/CityContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://kiraynow.com"),

  title: {
    default: "KirayNow – Rent Furniture, Appliances & Equipment in Your City",
    template: "%s | KirayNow",
  },

  description:
    "KirayNow is a trusted rental platform where you can rent furniture, home appliances, electronics, and equipment in your city at affordable prices. Fast delivery, flexible rental plans, and reliable service.",

  keywords: [
    "kiraynow",
    "rent furniture online",
    "appliances on rent",
    "equipment rental near me",
    "furniture on rent in india",
    "home appliances rental",
    "rent products online india",
    "rental services in india",
  ],

  alternates: {
    canonical: "https://kiraynow.com",
  },

  openGraph: {
    title: "KirayNow – Rent Furniture, Appliances & Equipment",
    description:
      "Affordable furniture, appliances, and equipment rental in your city. Book online with KirayNow.",
    url: "https://kiraynow.com",
    siteName: "KirayNow",
    type: "website",
    images: [
      {
        url: "https://kiraynow.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KirayNow Rental Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "KirayNow – Rent Products in Your City",
    description:
      "Rent furniture, appliances and equipment easily with KirayNow.",
    images: ["https://kiraynow.com/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {/* <GoogleTagManager gtmId="GTM-KL3PXFC4" /> */}
        <CityProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
