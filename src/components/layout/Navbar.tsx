"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Settings } from "lucide-react";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/cafe-hunter", label: "Cafe Hunter" },
  { href: "/cats", label: "Cats" },
  { href: "/schedule", label: "Schedule" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/20 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-hanken font-bold text-2xl tracking-tight text-white hover:text-accent-blue transition-colors"
        >
          Portfolio
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-inter text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? "text-accent-blue" : "text-[#BFC7D5] hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-blue rounded-full shadow-[0_0_8px_rgba(159,202,255,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-[#BFC7D5] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 text-[#BFC7D5] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
