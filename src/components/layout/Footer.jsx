import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 border-t border-gray-200">

      {/* Soft AI background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.08),_transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">

          {/* Brand / Description */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-slate-900">
              India<span className="text-indigo-600">AI</span>Mag
            </h3>

            <p className="mt-4 text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">
              IndiaAIMag is an Indian AI-focused platform that helps beginners,
              students, creators, and professionals understand artificial
              intelligence through practical guides, AI tools, prompts,
              automation ideas, and real-world use cases — without hype or jargon.
            </p>
          </div>

          {/* Internal Navigation */}
          <div className="text-center">
            <h4 className="text-slate-900 font-semibold mb-4">
              Explore AI
            </h4>

            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-indigo-600 transition">
                  AI Blog & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-slate-600 hover:text-indigo-600 transition">
                  Best AI Tools
                </Link>
              </li>
              <li>
                <Link href="/tag/beginner-guide" className="text-slate-600 hover:text-indigo-600 transition">
                  AI Guides for Beginners
                </Link>
              </li>
              <li>
                <Link href="/tag/automation" className="text-slate-600 hover:text-indigo-600 transition">
                  AI Automation & Use Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Trust */}
          <div className="text-center md:text-right">
            <h4 className="text-slate-900 font-semibold mb-4">
              Stay Connected
            </h4>

            <div className="flex justify-center md:justify-end gap-4 mb-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-slate-500 hover:text-indigo-600 transition"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="text-slate-500 hover:text-indigo-600 transition"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-slate-500 hover:text-indigo-600 transition"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-slate-600 max-w-xs mx-auto md:ml-auto md:mr-0">
              Practical AI insights — beginner-friendly, tested, and
              privacy-focused.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-gray-200 text-center text-xs text-slate-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-slate-700 font-medium">IndiaAIMag</span>.  
          Helping learn and use AI clearly and responsibly.
        </div>

      </div>
    </footer>
  );
}
