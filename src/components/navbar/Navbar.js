import Link from "next/link";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Instagram, Twitter, MessageCircle  } from "lucide-react";
import CitySelect from "./CitySelect";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">

        <div className="flex h-16 items-center justify-between gap-6">

          {/* ================= Left Logo ================= */}
          <Link
            href="/patna-bihar"
            className="text-xl font-semibold tracking-tight"
          >
            TrueFeelings
          </Link>

          {/* ================= Center Search ================= */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-3 max-w-2xl">

            
           {/* <Suspense fallback={<div className="h-10 w-28 bg-muted animate-pulse rounded-md" />}>
              <CitySelect />
            </Suspense> */}
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search rentals, categories..."
                className="pl-9 h-10 rounded-md"
              />
            </div>



          </div>

          {/* ================= Right Links + Social ================= */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Contact
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">
                <Facebook size={18} />
              </Link>

              <Link href="#" className="hover:text-foreground transition">
                <Instagram size={18} />
              </Link>

              <Link href="#" className="hover:text-foreground transition">
                <MessageCircle  size={18} />
              </Link>
            </div>

          </div>

          {/* ================= Mobile ================= */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

        </div>

      </div>
    </header>
  );
}
