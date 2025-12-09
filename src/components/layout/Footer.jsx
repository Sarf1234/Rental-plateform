import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 border-t border-gray-200">
      
      {/* Soft AI background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.06),_transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">

          {/* Brand / About */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-gray-900">
              India<span className="text-indigo-600">AI</span>Mag
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-sm mx-auto md:mx-0">
              IndiaAIMag helps beginners and professionals understand AI through
              simple guides, tools, prompts, and real-world use cases — without hype or confusion.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h4 className="text-gray-900 font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-indigo-600 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-600 hover:text-indigo-600 transition">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/tag/beginner-guide" className="text-gray-600 hover:text-indigo-600 transition">
                  Beginner Guides
                </Link>
              </li>
              <li>
                <Link href="/tag/automation" className="text-gray-600 hover:text-indigo-600 transition">
                  Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Trust */}
          <div className="text-center md:text-right">
            <h4 className="text-gray-900 font-semibold mb-4">Follow</h4>

            <div className="flex justify-center md:justify-end gap-4 mb-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-gray-600 max-w-xs ml-auto mr-auto md:mr-0">
              Practical AI insights — tested, simple, and privacy-minded.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-gray-700 font-medium">IndiaAIMag</span>.  
          Helping India understand AI — clearly and responsibly.
        </div>
      </div>
    </footer>
  );
}
