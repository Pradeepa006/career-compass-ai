"use client";

import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";

interface DashboardNavProps {
  onMenuClick: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 bg-[#08061a]/80 backdrop-blur-xl sticky top-0 z-30">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-500 w-64">
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Quick search...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-600">⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          {user ? getInitials(user.full_name || user.username) : "?"}
        </div>
      </div>
    </header>
  );
}
