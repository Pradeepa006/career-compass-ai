"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Target, TrendingUp, DollarSign, FileText,
  MessageSquare, Map, Github, ArrowRight, Zap,
  BarChart3, Award, Flame, Clock
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, Cell
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import { cn, formatCurrency, getScoreColor, getScoreGradient } from "@/lib/utils";

const SKILL_DATA = [
  { skill: "Frontend", value: 85, fullMark: 100 },
  { skill: "Backend", value: 70, fullMark: 100 },
  { skill: "DevOps", value: 45, fullMark: 100 },
  { skill: "AI/ML", value: 60, fullMark: 100 },
  { skill: "Mobile", value: 30, fullMark: 100 },
  { skill: "Security", value: 40, fullMark: 100 },
];

const PROGRESS_DATA = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 68 },
  { month: "May", score: 75 },
  { month: "Jun", score: 82 },
  { month: "Jul", score: 87 },
];

const TRENDING_SKILLS = [
  { name: "AI/ML", demand: 98, color: "#8b5cf6" },
  { name: "React", demand: 92, color: "#06b6d4" },
  { name: "TypeScript", demand: 90, color: "#3b82f6" },
  { name: "AWS", demand: 91, color: "#f59e0b" },
  { name: "Docker", demand: 88, color: "#10b981" },
  { name: "Next.js", demand: 85, color: "#ec4899" },
];

const QUICK_ACTIONS = [
  { href: "/dashboard/career-prediction", label: "Predict Career Path", icon: Brain, gradient: "from-violet-500 to-purple-600", desc: "Get AI career analysis" },
  { href: "/dashboard/resume", label: "Analyze Resume", icon: FileText, gradient: "from-cyan-500 to-blue-600", desc: "Upload & get ATS score" },
  { href: "/dashboard/skill-gap", label: "Skill Gap Check", icon: Target, gradient: "from-emerald-500 to-teal-600", desc: "Find missing skills" },
  { href: "/dashboard/ai-mentor", label: "Chat with AI Mentor", icon: MessageSquare, gradient: "from-pink-500 to-rose-600", desc: "Get career guidance" },
  { href: "/dashboard/salary", label: "Check Salary", icon: DollarSign, gradient: "from-amber-500 to-orange-600", desc: "Get salary estimates" },
  { href: "/dashboard/github-analysis", label: "GitHub Analysis", icon: Github, gradient: "from-gray-500 to-slate-600", desc: "Analyze your profile" },
];

function ScoreRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="url(#scoreGrad)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold gradient-text">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-2 text-center">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border-violet-500/20 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-violet-600/10 to-transparent" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-20">🧭</div>
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.full_name?.split(" ")[0] || user?.username || "Explorer"} 👋
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            Your career readiness score has increased by <span className="text-emerald-400 font-medium">+12 points</span> this week.
          </p>
          <Link href="/dashboard/career-prediction">
            <button className="btn-primary text-sm">
              <Zap className="w-4 h-4" /> Run Full Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Career Readiness", value: user?.career_readiness_score || 87, suffix: "/100", icon: Award, color: "from-violet-500 to-purple-600", isScore: true },
          { label: "Profile Completion", value: user?.profile_completion || 75, suffix: "%", icon: Target, color: "from-cyan-500 to-blue-600", isScore: true },
          { label: "Skills Tracked", value: user?.skills?.length || 12, suffix: "", icon: BarChart3, color: "from-emerald-500 to-teal-600", isScore: false },
          { label: "Day Streak", value: user?.streak_days || 7, suffix: " 🔥", icon: Flame, color: "from-orange-500 to-amber-600", isScore: false },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium">{metric.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {mounted ? metric.value : "--"}{metric.suffix}
              </div>
              {metric.isScore && (
                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={SKILL_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Skills" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Career Readiness Progress</h3>
            <span className="text-xs text-emerald-400 font-medium">+42 pts this year</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PROGRESS_DATA}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12, color: "#fff" }}
              />
              <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: "#7c3aed", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="glass-card p-4 hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer group text-center"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-medium text-white leading-snug">{action.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{action.desc}</div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom section: Trending Skills + Score Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Trending Skills 2025</h3>
            <Link href="/dashboard/skill-gap" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {TRENDING_SKILLS.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-300">{skill.name}</span>
                  <span className="text-xs font-bold text-white">{skill.demand}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: skill.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.demand}%` }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-5">Your AI Analysis Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <ScoreRing score={87} label="Career Readiness" />
            <ScoreRing score={75} label="Profile Complete" />
            <ScoreRing score={92} label="ATS Score" />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center"><Brain className="w-4 h-4 text-violet-400" /></div>
              <div>
                <div className="text-xs font-medium text-white">Top Match: Full Stack Developer</div>
                <div className="text-[10px] text-gray-500">94% match · $115k-$165k salary range</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center"><Target className="w-4 h-4 text-cyan-400" /></div>
              <div>
                <div className="text-xs font-medium text-white">5 Skills to Learn</div>
                <div className="text-[10px] text-gray-500">Kubernetes, GraphQL, Redis, Go, Terraform</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
