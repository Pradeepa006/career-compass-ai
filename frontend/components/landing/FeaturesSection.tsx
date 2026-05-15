"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain, FileSearch, Target, Map, MessageSquare, BarChart3,
  Briefcase, Github, DollarSign, Shield, Zap, TrendingUp
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Career Prediction",
    description: "Advanced ML models analyze your skills, experience, and interests to predict your ideal career path with 98% accuracy.",
    gradient: "from-violet-500 to-purple-600",
    badge: "Core Feature",
  },
  {
    icon: FileSearch,
    title: "Smart Resume Analysis",
    description: "Upload your PDF/DOCX resume for instant ATS scoring, skill extraction, and AI-powered improvement suggestions.",
    gradient: "from-cyan-500 to-blue-600",
    badge: "Popular",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Compare your current skills against target roles and get a precise breakdown of exactly what you need to learn.",
    gradient: "from-emerald-500 to-teal-600",
    badge: null,
  },
  {
    icon: Map,
    title: "Personalized Roadmap",
    description: "Get a structured learning path from beginner to job-ready, with curated resources, timelines, and milestones.",
    gradient: "from-orange-500 to-amber-600",
    badge: null,
  },
  {
    icon: MessageSquare,
    title: "AI Mentor Chatbot",
    description: "Chat with your personal AI career mentor for interview prep, salary negotiation, and career guidance 24/7.",
    gradient: "from-pink-500 to-rose-600",
    badge: "GPT-4 Powered",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Beautiful dashboards showing career readiness scores, skill progress, industry trends, and learning analytics.",
    gradient: "from-indigo-500 to-violet-600",
    badge: null,
  },
  {
    icon: Briefcase,
    title: "Job Matching Engine",
    description: "Personalized job recommendations based on your profile with match scores and targeted preparation strategies.",
    gradient: "from-teal-500 to-cyan-600",
    badge: null,
  },
  {
    icon: Github,
    title: "GitHub Analyzer",
    description: "Deep analysis of your GitHub profile - tech stack detection, contribution scoring, and career recommendations.",
    gradient: "from-gray-500 to-slate-600",
    badge: null,
  },
  {
    icon: DollarSign,
    title: "Salary Prediction",
    description: "AI-powered salary estimates based on your skills, location, experience, and education with market benchmarks.",
    gradient: "from-green-500 to-emerald-600",
    badge: null,
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0818]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-violet-600/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Everything You Need
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Built for the Modern
            <span className="gradient-text"> Tech Professional</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From entry-level to senior positions, CareerCompass AI adapts to your unique
            journey and delivers insights that actually move your career forward.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="feature-card group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                      {feature.badge && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 whitespace-nowrap">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
