"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  ArrowRight, Sparkles, Brain, Target, TrendingUp,
  Github, Star, Users, Zap, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const FLOATING_SKILLS = [
  { label: "Python", x: "8%", y: "25%", delay: 0 },
  { label: "React", x: "85%", y: "20%", delay: 0.5 },
  { label: "Machine Learning", x: "5%", y: "65%", delay: 1 },
  { label: "AWS", x: "88%", y: "60%", delay: 1.5 },
  { label: "TypeScript", x: "15%", y: "45%", delay: 0.8 },
  { label: "Docker", x: "80%", y: "40%", delay: 1.2 },
  { label: "SQL", x: "20%", y: "80%", delay: 0.3 },
  { label: "FastAPI", x: "75%", y: "78%", delay: 0.9 },
];

const CAREER_PATHS = [
  { name: "Full Stack Dev", color: "from-violet-500 to-purple-500", score: 94 },
  { name: "AI/ML Engineer", color: "from-cyan-500 to-blue-500", score: 87 },
  { name: "Data Scientist", color: "from-emerald-500 to-green-500", score: 72 },
  { name: "DevOps Engineer", color: "from-orange-500 to-amber-500", score: 68 },
];

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#080612]">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-700/8 blur-[150px]" />
      </div>

      {/* Floating skill badges */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOATING_SKILLS.map((skill) => (
          <motion.div
            key={skill.label}
            className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs font-medium text-gray-300"
            style={{ left: skill.x, top: skill.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0.8],
              scale: [0.8, 1, 1, 0.95],
              y: [0, -8, 0, -4],
            }}
            transition={{
              duration: 4,
              delay: skill.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            {skill.label}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ y: y1, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Intelligence Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
            >
              Find Your
              <br />
              <span className="gradient-text glow-text">
                <TypeAnimation
                  sequence={[
                    "Dream Career",
                    2000,
                    "Ideal Path",
                    2000,
                    "Future Role",
                    2000,
                    "Next Level",
                    2000,
                  ]}
                  wrapper="span"
                  speed={40}
                  repeat={Infinity}
                />
              </span>
              <br />
              <span className="text-gray-300">with AI Precision</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              CareerCompass AI analyzes your skills, resume, and interests to predict
              your ideal career path, identify skill gaps, and generate a personalized
              roadmap to get you job-ready.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Link href="/register">
                <button className="btn-primary text-base px-8 py-4 glow-purple">
                  <Zap className="w-5 h-5" />
                  Start Your Analysis Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-secondary text-base px-8 py-4">
                  <Brain className="w-5 h-5" />
                  Explore Dashboard
                </button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-[#080612] flex items-center justify-center text-xs text-white font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span><strong className="text-gray-300">50,000+</strong> careers analyzed</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span><strong className="text-gray-300">4.9/5</strong> rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-violet-400" />
                <span><strong className="text-gray-300">No credit card</strong> required</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Career Prediction Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main prediction card */}
            <div className="glass-card p-6 neon-border relative">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Career Analysis</div>
                    <div className="text-xs text-gray-500">Based on your profile</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live Analysis</span>
                </div>
              </div>

              {/* Career matches */}
              <div className="space-y-3 mb-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top Career Matches</div>
                {CAREER_PATHS.map((career, i) => (
                  <motion.div
                    key={career.name}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 font-medium">{career.name}</span>
                      <span className="text-sm font-bold text-white">{career.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full bg-gradient-to-r", career.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${career.score}%` }}
                        transition={{ delay: 1 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommended skills */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top Skills to Learn</div>
                <div className="flex flex-wrap gap-2">
                  {["GraphQL", "Kubernetes", "Next.js 15", "FastAPI", "Redis"].map((skill) => (
                    <span key={skill} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Readiness score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-5 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Career Readiness Score</div>
                    <div className="text-2xl font-bold gradient-text">87<span className="text-base text-gray-400">/100</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-0.5">Salary Range</div>
                    <div className="text-base font-bold text-white">$115k – $165k</div>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating action indicators */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-xl border border-emerald-500/30"
            >
              <div className="flex items-center gap-2 text-xs">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">98% accuracy</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 glass-card px-3 py-2 rounded-xl border border-cyan-500/30"
            >
              <div className="flex items-center gap-2 text-xs">
                <Github className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">GitHub analyzed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
