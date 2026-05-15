"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Features",
    dropdown: [
      { href: "/features/career-prediction", label: "Career Prediction", icon: "🎯" },
      { href: "/features/skill-gap", label: "Skill Gap Analysis", icon: "📊" },
      { href: "/features/resume-analysis", label: "Resume Analysis", icon: "📄" },
      { href: "/features/ai-mentor", label: "AI Mentor", icon: "🤖" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3 frosted border-b border-white/8"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Career<span className="gradient-text">Compass</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-3 h-3" /> AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    {link.label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === link.label && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 frosted border border-white/10 rounded-xl p-2 shadow-2xl shadow-black/50"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all"
                          >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link href="/register">
              <button className="btn-primary text-sm">
                <Sparkles className="w-4 h-4" />
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-white/10 mt-3">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.label}>
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {link.label}
                      </div>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="flex flex-col gap-2 pt-4 px-3">
                  <Link href="/login" className="block text-center py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/register" className="block text-center btn-primary" onClick={() => setMobileOpen(false)}>
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
