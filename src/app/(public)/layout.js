import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    default:
      "KirayNow – India's Event Rental Marketplace",
    template: "%s | KirayNow",
  },

  description:
    "KirayNow is a trusted event rental marketplace offering birthday decoration, wedding setups, party rentals and celebration services across multiple cities in India. Book verified professionals with transparent pricing.",

  alternates: {
    canonical: "https://kiraynow.com",
  },

  openGraph: {
    title:
      "KirayNow – Birthday, Wedding & Event Rentals in Your City",
    description:
      "Book trusted birthday decoration, wedding setups and party rental services near you with KirayNow.",
    url: "https://kiraynow.com",
    siteName: "KirayNow",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        width: 1200,
        height: 630,
        alt: "KirayNow Event Rental Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "KirayNow – Birthday, Wedding & Event Rentals",
    description:
      "Find trusted event professionals for birthday, wedding and party rentals with KirayNow.",
    images: [
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
    ],
  },

  icons: {
    icon: "/favicon.ico",
  },

  manifest: "/manifest.json",

  themeColor: "#ffffff",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const baseUrl = "https://kiraynow.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "KirayNow",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        description:
          "KirayNow is a trusted event rental marketplace offering birthday decoration, wedding setups and party rental services across multiple cities in India.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-8839931558",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <CityProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
