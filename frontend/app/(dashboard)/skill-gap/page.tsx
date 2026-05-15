"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Search, ChevronDown, ArrowRight, Loader2, BookOpen, ExternalLink } from "lucide-react";
import { skillsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const CAREER_OPTIONS = [
  "Full Stack Developer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Engineer", "UI/UX Designer", "Mobile Developer",
  "Blockchain Developer", "Product Manager",
];

const LEVEL_OPTIONS = ["entry", "mid", "senior"];

const RESOURCES: Record<string, string[]> = {
  React: ["https://react.dev", "https://frontendmasters.com"],
  Python: ["https://docs.python.org", "https://realpython.com"],
  TypeScript: ["https://www.typescriptlang.org/docs/", "https://execute-program.com"],
  Docker: ["https://docs.docker.com", "https://www.udemy.com"],
};

export default function SkillGapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [level, setLevel] = useState("mid");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setCurrentSkills([...currentSkills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => setCurrentSkills(currentSkills.filter((x) => x !== s));

  const handleAnalyze = async () => {
    if (!targetRole) { setError("Please select a target role"); return; }
    setError("");
    setLoading(true);
    try {
      const { data } = await skillsApi.gapAnalysis({ target_role: targetRole, current_skills: currentSkills, experience_level: level });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Skill Gap Analysis</h1>
        <p className="text-gray-400 text-sm">Find exactly which skills you need to reach your target role</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            {/* Target Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Role</label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all appearance-none"
                >
                  <option value="" disabled className="bg-[#08061a]">Select target career...</option>
                  {CAREER_OPTIONS.map((opt) => <option key={opt} value={opt} className="bg-[#08061a]">{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience Level</label>
              <div className="flex gap-2">
                {LEVEL_OPTIONS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-medium border transition-all capitalize",
                      level === l ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Current Skills</label>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="e.g. React, Python..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                </div>
                <button onClick={addSkill} className="px-3 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all text-sm">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {currentSkills.map((s) => (
                  <span key={s} onClick={() => removeSkill(s)} className="skill-badge cursor-pointer hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all text-xs">
                    {s} ×
                  </span>
                ))}
                {currentSkills.length === 0 && <span className="text-xs text-gray-600">No skills added yet. Press Enter to add.</span>}
              </div>
            </div>

            {error && <div className="text-xs text-red-400">{error}</div>}

            <button onClick={handleAnalyze} disabled={loading || !targetRole} className="w-full btn-primary py-3 justify-center text-sm disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Target className="w-4 h-4" /> Analyze Skill Gap</>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">Run a Skill Gap Analysis</h3>
                <p className="text-gray-500 text-sm">Select your target role and add your current skills to see what's missing</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Overview */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Skills You Have", value: result.matching_skills?.length || 0, color: "text-emerald-400" },
                    { label: "Skills Missing", value: result.missing_skills?.length || 0, color: "text-red-400" },
                    { label: "Gap Percentage", value: `${result.gap_percentage || 0}%`, color: "text-amber-400" },
                  ].map((m) => (
                    <div key={m.label} className="glass-card p-4 text-center">
                      <div className={`text-2xl font-bold ${m.color} mb-0.5`}>{m.value}</div>
                      <div className="text-xs text-gray-500">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="glass-card p-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Readiness for <span className="text-white font-medium">{targetRole}</span></span>
                    <span className="text-white font-semibold">{100 - (result.gap_percentage || 0)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (result.gap_percentage || 0)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Missing Skills */}
                {result.missing_skills?.length > 0 && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> Skills to Acquire ({result.missing_skills.length})
                    </h3>
                    <div className="space-y-2">
                      {result.missing_skills.map((skill: any, i: number) => {
                        const skillName = typeof skill === "string" ? skill : skill.name;
                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                            <span className="text-sm text-gray-300">{skillName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">Missing</span>
                              <BookOpen className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Matching Skills */}
                {result.matching_skills?.length > 0 && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Skills You Already Have ({result.matching_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.matching_skills.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">💡 AI Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />{rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
