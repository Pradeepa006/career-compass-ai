"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass, LayoutDashboard, FileText, Target, Brain,
  MessageSquare, Briefcase, Map, Github, DollarSign,
  User, Settings, Shield, LogOut, Sparkles, X
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn, getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { section: "Overview" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { section: "AI Tools" },
  { href: "/dashboard/career-prediction", label: "Career Prediction", icon: Brain, badge: "AI" },
  { href: "/dashboard/skill-gap", label: "Skill Gap Analysis", icon: Target },
  { href: "/dashboard/ai-mentor", label: "AI Mentor", icon: MessageSquare, badge: "GPT-4" },
  { section: "Profile" },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: FileText },
  { href: "/dashboard/github-analysis", label: "GitHub Analyzer", icon: Github },
  { section: "Career" },
  { href: "/dashboard/jobs", label: "Job Recommendations", icon: Briefcase },
  { href: "/dashboard/roadmap", label: "Learning Roadmap", icon: Map },
  { href: "/dashboard/salary", label: "Salary Prediction", icon: DollarSign },
  { section: "Account" },
  { href: "/dashboard/profile", label: "Profile Settings", icon: User },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 h-full min-h-screen flex flex-col bg-[#08061a] border-r border-white/5">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <Compass className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">
            Career<span className="gradient-text">Compass</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Plan badge */}
      {user?.plan === "pro" && (
        <div className="mx-4 mt-4 mb-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/15 to-purple-500/10 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-medium text-violet-300">Pro Plan Active</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          if ("section" in item && !item.href) {
            return (
              <div key={i} className="px-3 pt-5 pb-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {item.section}
              </div>
            );
          }

          if (!item.href) return null;
          const Icon = item.icon!;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div className={cn("sidebar-link", isActive && "active")}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {/* Admin */}
        {user?.is_admin && (
          <Link href="/dashboard/admin" onClick={onClose}>
            <div className={cn("sidebar-link", pathname === "/dashboard/admin" && "active")}>
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">Admin Panel</span>
            </div>
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user ? getInitials(user.full_name || user.username) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.full_name || user?.username}</div>
            <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
