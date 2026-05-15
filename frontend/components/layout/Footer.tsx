"use client";

import Link from "next/link";
import { Compass, Github, Twitter, Linkedin, Sparkles } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Career Prediction", href: "/features/career-prediction" },
    { label: "Skill Gap Analysis", href: "/features/skill-gap" },
    { label: "Resume Analysis", href: "/features/resume-analysis" },
    { label: "AI Mentor", href: "/features/ai-mentor" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press Kit", href: "/press" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Status", href: "/status" },
    { label: "Changelog", href: "/changelog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[#060411] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Career<span className="gradient-text">Compass</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              AI-powered career guidance for the modern tech professional.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} CareerCompass AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            Built with AI for the next generation of tech professionals
          </div>
        </div>
      </div>
    </footer>
  );
}
