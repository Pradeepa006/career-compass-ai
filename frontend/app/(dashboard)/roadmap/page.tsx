"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, ChevronDown, Loader2, BookOpen, Clock, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { careerApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const CAREERS = [
  "Full Stack Developer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Engineer", "UI/UX Designer", "Mobile Developer",
  "Blockchain Developer", "Product Manager",
];

const PHASE_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
];

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const [career, setCareer] = useState(searchParams.get("career") || "Full Stack Developer");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => { if (career) fetchRoadmap(); }, [career]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const { data } = await careerApi.getRoadmap(career);
      setRoadmap(data);
    } catch { setRoadmap(null); }
    finally { setLoading(false); }
  };

  const toggleCompleted = (key: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Learning Roadmap</h1>
          <p className="text-gray-400 text-sm">Step-by-step learning path to reach your career goal</p>
        </div>
        {/* Career selector */}
        <div className="relative">
          <select
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="pl-4 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all appearance-none cursor-pointer"
          >
            {CAREERS.map((c) => <option key={c} value={c} className="bg-[#08061a]">{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Generating roadmap for {career}...</p>
        </div>
      ) : !roadmap ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="text-gray-400">Select a career to view your roadmap</p>
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="glass-card p-5 bg-gradient-to-r from-violet-500/8 to-transparent border-violet-500/15">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-2xl font-bold text-white">{roadmap.total_duration || "6-12 months"}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{roadmap.phases?.length || 4}</div>
                <div className="text-xs text-gray-500 mt-0.5">Learning Phases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{completed.size}</div>
                <div className="text-xs text-gray-500 mt-0.5">Steps Completed</div>
              </div>
              {roadmap.salary_range && (
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{roadmap.salary_range}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Target Salary</div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-white/5" />

            <div className="space-y-6">
              {(roadmap.phases || []).map((phase: any, phaseIdx: number) => (
                <motion.div
                  key={phaseIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: phaseIdx * 0.15 }}
                  className="relative lg:pl-20"
                >
                  {/* Phase circle (desktop) */}
                  <div className={cn("hidden lg:flex absolute left-3 top-5 w-10 h-10 rounded-full bg-gradient-to-br items-center justify-center shadow-lg -translate-x-1/2 z-10", PHASE_COLORS[phaseIdx % PHASE_COLORS.length])}>
                    <span className="text-white font-bold text-sm">{phaseIdx + 1}</span>
                  </div>

                  <div className="glass-card p-5">
                    {/* Phase header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className={cn("text-xs font-bold uppercase tracking-widest mb-1 bg-gradient-to-r bg-clip-text text-transparent", PHASE_COLORS[phaseIdx % PHASE_COLORS.length])}>
                          Phase {phaseIdx + 1}
                        </div>
                        <h3 className="text-base font-bold text-white">{phase.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{phase.duration}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-400">{phase.duration}</span>
                      </div>
                    </div>

                    {phase.description && <p className="text-sm text-gray-400 leading-relaxed mb-4">{phase.description}</p>}

                    {/* Skills */}
                    {phase.skills?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills to Learn</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.skills.map((skill: string) => (
                            <span key={skill} className="skill-badge">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steps/Topics */}
                    {phase.topics?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Topics</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {phase.topics.map((topic: string, topicIdx: number) => {
                            const key = `${phaseIdx}-${topicIdx}`;
                            const done = completed.has(key);
                            return (
                              <button
                                key={topicIdx}
                                onClick={() => toggleCompleted(key)}
                                className={cn(
                                  "flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all",
                                  done
                                    ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-400"
                                    : "bg-white/3 border-white/8 text-gray-400 hover:border-white/15 hover:text-gray-300"
                                )}
                              >
                                {done ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0" />}
                                <span className={cn("text-xs", done && "line-through opacity-70")}>{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {phase.resources?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended Resources</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((res: any, i: number) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-violet-300 hover:border-violet-500/30 transition-all cursor-pointer">
                              <BookOpen className="w-3.5 h-3.5" />{typeof res === "string" ? res : res.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
