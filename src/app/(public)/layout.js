import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleTagManager } from '@next/third-parties/google'

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
    default: "IndiaAIMag – AI Tools, Guides & Prompts for Beginners in India",
    template: "%s | IndiaAIMag",
  },

  description:
    "IndiaAIMag ek Hinglish AI platform hai jahan aapko milte hain practical AI tools, ChatGPT prompts, image generator tips aur automation guides — beginners aur Indian users ke liye simple language me.",

  keywords: [
    "indiaaimag",
    "india ai mag",
    "ai tools india",
    "ai guides for beginners",
    "chatgpt prompts india",
    "ai prompts hinglish",
    "ai automation india",
    "learn ai hinglish",
    "ai blog india",
  ],

  alternates: {
    canonical: "https://indiaaimag.com",
  },

  openGraph: {
    title: "IndiaAIMag – AI Tools, Guides & Prompts for India",
    description:
      "AI tools, ChatGPT prompts aur automation guides Hinglish me. IndiaAIMag helps beginners and Indian users use AI practically.",
    url: "https://indiaaimag.com",
    siteName: "IndiaAIMag",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dsc5aznps/image/upload/v1767975434/posts/tbyj0t1ch4xn0enetlij.png",
        width: 1200,
        height: 630,
        alt: "IndiaAIMag – AI Tools, Guides & Prompts for Beginners",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "IndiaAIMag – AI Tools & Prompts in Hinglish",
    description:
      "AI tools, ChatGPT prompts aur automation guides Hinglish me. Learn practical AI with IndiaAIMag.",
    images: [
      "https://res.cloudinary.com/dsc5aznps/image/upload/v1767975434/posts/tbyj0t1ch4xn0enetlij.png",
    ],
    creator: "@indiaaimag",
  },

  icons: {
  icon: "/favicon.ico",
  shortcut: "/favicon.ico",
  apple: "/favicon.ico",
},

  manifest: "/manifest.json",

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    bing: "YOUR_BING_VERIFICATION_CODE",
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
        <GoogleTagManager gtmId="GTM-KL3PXFC4" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
