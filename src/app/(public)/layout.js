import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://indiaaimag.com"),

  title: {
    default: "India AI Mag – AI Prompts, ChatGPT Tools & Automation in Hinglish",
    template: "%s | India AI Mag",
  },

  description:
    "India AI Mag ek Hinglish AI blog hai jahan aapko milte hain best AI prompts, ChatGPT tools, image generator prompts aur automation guides – beginners aur businesses ke liye simple language me.",

  keywords: [
    "india ai mag",
    "indiaaimag",
    "ai prompts hinglish",
    "chatgpt prompts hinglish",
    "ai tools india",
    "ai tools hinglish",
    "ai automation india",
    "learn ai hinglish",
    "best ai prompts india",
    "ai blog india",
  ],

  // Canonical URL
  alternates: {
    canonical: "https://indiaaimag.com",
  },

  // Open Graph (Social Sharing)
  openGraph: {
    title: "India AI Mag – AI Prompts & ChatGPT Tools in Hinglish",
    description:
      "Best AI prompts, ChatGPT tools, image generation tips aur automation guides Hinglish me. India AI Mag – practical AI learning for Indian users.",
    url: "https://indiaaimag.com",
    siteName: "India AI Mag",
    type: "website",
    images: [
      {
        url: "https://indiaaimag.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "India AI Mag – AI Prompts, Tools & Automation in Hinglish",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "India AI Mag – AI Prompts & Tools in Hinglish",
    description:
      "AI prompts, ChatGPT tools aur automation guides Hinglish me. Learn practical AI with India AI Mag.",
    images: ["https://indiaaimag.com/og-image.jpg"],
    creator: "@indiaaimag", // optional (agar handle ho)
  },

  // Icons
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },

  // Manifest (PWA optional)
  manifest: "/manifest.json",

  // Verification (fill real codes later)
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    bing: "YOUR_BING_VERIFICATION_CODE",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
