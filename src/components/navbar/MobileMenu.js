import Link from "next/link";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Instagram, MessageCircle } from "lucide-react";
import CitySelect from "./CitySelect";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">

        {/* ================= TOP BAR ================= */}
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link
            href="/patna-bihar"
            className="text-lg font-semibold tracking-tight"
          >
            TrueFeelings
          </Link>

          {/* Desktop Center */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-6">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search rentals..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Desktop Right */}
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

            <div className="flex items-center gap-3 text-muted-foreground">
              <Facebook size={18} />
              <Instagram size={18} />
              <MessageCircle size={18} />
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex items-center gap-3 md:hidden">

            {/* <Suspense fallback={null}>
              <CitySelect />
            </Suspense> */}

            <MobileMenu />
          </div>
        </div>

        {/* ================= MOBILE SEARCH BELOW ================= */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search rentals..."
              className="pl-9 h-10"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
