"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, Plus, X, TrendingUp, DollarSign, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { careerApi } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";

const SUGGESTED_SKILLS = [
  "JavaScript", "TypeScript", "Python", "React", "Node.js", "SQL", "Docker",
  "AWS", "Machine Learning", "TensorFlow", "MongoDB", "Git", "Kubernetes",
  "GraphQL", "Swift", "Kotlin", "Go", "Rust", "Vue.js", "Angular",
];

const INTEREST_OPTIONS = [
  "Web Development", "AI/ML", "Data Science", "Mobile Development", "DevOps",
  "Cloud Computing", "Cybersecurity", "UI/UX Design", "Blockchain", "Product Management"
];

export default function CareerPredictionPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState(2);
  const [education, setEducation] = useState("bachelor");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<any>(null);

  const addSkill = (s?: string) => {
    const val = (s || skillInput).trim();
    if (val && !skills.includes(val)) setSkills([...skills, val]);
    if (!s) setSkillInput("");
  };

  const toggleInterest = (i: string) => {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const handlePredict = async () => {
    if (skills.length === 0) { setError("Add at least one skill"); return; }
    setError("");
    setLoading(true);
    try {
      const { data } = await careerApi.predict({ skills, interests, experience_years: experience, education_level: education });
      setResult(data);
      setSelectedCareer(data.predictions?.[0] || null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Prediction failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Career Prediction</h1>
          <p className="text-gray-400 text-sm">Tell us about your skills and get AI-powered career path predictions</p>
        </div>
        {result && (
          <button onClick={() => setResult(null)} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Skills Input */}
              <div className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-white">Your Skills</h2>

                {/* Custom input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button onClick={() => addSkill()} className="px-3.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 text-sm transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick-add suggested skills */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">Quick-add popular skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 12).map((s) => (
                      <button key={s} onClick={() => addSkill(s)} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current skills */}
                {skills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Added skills ({skills.length}):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="skill-badge cursor-pointer hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                          {s} ×
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-white">Preferences</h2>

                {/* Experience */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-gray-400">Years of Experience</label>
                    <span className="text-sm font-bold text-violet-400">{experience} years</span>
                  </div>
                  <input
                    type="range" min={0} max={15} value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0 (Student)</span><span>5 (Mid)</span><span>10+ (Senior)</span>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Education Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["high_school", "associate", "bachelor", "master", "phd", "bootcamp"].map((edu) => (
                      <button
                        key={edu}
                        onClick={() => setEducation(edu)}
                        className={cn("py-2 rounded-xl text-xs font-medium border transition-all capitalize",
                          education === edu ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "border-white/10 text-gray-500 hover:border-white/20"
                        )}
                      >
                        {edu.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Career Interests (optional)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={cn("px-2.5 py-1 rounded-full text-xs border transition-all",
                          interests.includes(opt) ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "border-white/10 text-gray-500 hover:border-white/20"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-sm text-red-400 mt-2">{error}</div>}

            <button
              onClick={handlePredict}
              disabled={loading || skills.length === 0}
              className="mt-4 btn-primary px-8 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting careers...</> : <><Sparkles className="w-4 h-4" /> Predict My Career Path</>}
            </button>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Top 3 Predictions */}
            <div className="grid md:grid-cols-3 gap-4">
              {result.predictions?.slice(0, 3).map((pred: any, i: number) => (
                <motion.div
                  key={pred.career_path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedCareer(pred)}
                  className={cn(
                    "glass-card p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1",
                    selectedCareer?.career_path === pred.career_path ? "border-violet-500/40 bg-violet-500/8" : "",
                    i === 0 ? "lg:ring-1 ring-violet-500/30" : ""
                  )}
                >
                  {i === 0 && <div className="text-[10px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full inline-block mb-2">🏆 Best Match</div>}
                  <h3 className="font-semibold text-white text-sm mb-1">{pred.career_path}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${pred.match_percentage}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
                    </div>
                    <span className="text-xs font-bold text-violet-400">{pred.match_percentage}%</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Salary Range</span>
                      <span className="text-emerald-400 font-medium">{formatCurrency(pred.salary_range?.min)} – {formatCurrency(pred.salary_range?.max)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Demand</span>
                      <span className="text-amber-400 font-medium">{pred.demand_level}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Career Details */}
            {selectedCareer && (
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="glass-card p-5 space-y-4">
                  <h2 className="text-base font-bold text-white">{selectedCareer.career_path} — Deep Dive</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedCareer.description || "This career path aligns well with your skills and interests."}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Readiness Score", value: `${selectedCareer.readiness_score}/100`, icon: "🎯" },
                      { label: "Growth Rate", value: selectedCareer.growth_rate || "High", icon: "📈" },
                      { label: "Remote Friendly", value: selectedCareer.remote_friendly ? "Yes" : "Moderate", icon: "🏠" },
                      { label: "Time to Ready", value: selectedCareer.time_to_ready || "3-6 months", icon: "⏱️" },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className="text-base mb-0.5">{item.icon}</div>
                        <div className="text-sm font-semibold text-white">{item.value}</div>
                        <div className="text-xs text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5 space-y-4">
                  {/* Skills to acquire */}
                  {selectedCareer.skills_to_acquire?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">Skills to Learn</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCareer.skills_to_acquire.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-amber-500/15 border border-amber-500/25 text-amber-400">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roadmap next steps */}
                  {selectedCareer.immediate_actions?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">Immediate Actions</h3>
                      <ul className="space-y-1.5">
                        {selectedCareer.immediate_actions.map((action: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <ArrowRight className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />{action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setSelectedCareer(null); }} className="btn-secondary text-sm py-2.5 px-5">
                ← Try Different Skills
              </button>
              <a href={`/dashboard/roadmap?career=${encodeURIComponent(selectedCareer?.career_path || "")}`} className="btn-primary text-sm py-2.5 px-5">
                <Map className="w-4 h-4" /> View Full Roadmap <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Map({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  );
}
