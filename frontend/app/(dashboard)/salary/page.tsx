"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ChevronDown, Loader2, TrendingUp, MapPin, Briefcase, GraduationCap, Zap } from "lucide-react";
import { salaryApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ROLES = [
  "Full Stack Developer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer",
  "Cloud Architect", "Cybersecurity Engineer", "UI/UX Designer", "Mobile Developer",
  "Blockchain Developer", "Product Manager",
];

const LOCATIONS = [
  "United States", "United Kingdom", "Germany", "Canada", "Australia",
  "India", "Singapore", "Netherlands", "France", "Japan", "Remote",
];

const EDUCATION_LEVELS = ["high_school", "associate", "bachelor", "master", "phd", "bootcamp"];

export default function SalaryPage() {
  const [form, setForm] = useState({
    job_title: "Full Stack Developer",
    location: "United States",
    experience_years: 3,
    education_level: "bachelor",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
  };

  const handlePredict = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await salaryApi.predict(form);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Prediction failed.");
    } finally { setLoading(false); }
  };

  const benchmarkData = result?.benchmarks
    ? Object.entries(result.benchmarks).map(([exp, val]) => ({ exp: exp.replace("_", " "), salary: Number(val) }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Salary Prediction</h1>
        <p className="text-gray-400 text-sm">Get accurate salary estimates based on your role, location, and experience</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4 h-fit">
          <h2 className="text-sm font-semibold text-white">Your Details</h2>

          {/* Job Title */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Job Title / Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all appearance-none">
                {ROLES.map((r) => <option key={r} value={r} className="bg-[#08061a]">{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all appearance-none">
                {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#08061a]">{l}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500">Years of Experience</label>
              <span className="text-xs font-bold text-violet-400">{form.experience_years} yrs</span>
            </div>
            <input type="range" min={0} max={20} value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>0 (Junior)</span><span>5-8 (Mid)</span><span>15+ (Senior)</span>
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Education Level</label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all appearance-none capitalize">
                {EDUCATION_LEVELS.map((e) => <option key={e} value={e} className="bg-[#08061a] capitalize">{e.replace("_", " ")}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">High-Value Skills (optional)</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g. Kubernetes, Rust..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-violet-500/60 transition-all" />
              <button onClick={addSkill} className="px-3 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s) => (
                <span key={s} onClick={() => setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))}
                  className="skill-badge cursor-pointer hover:bg-red-500/15 hover:text-red-400 text-xs">
                  {s} ×
                </span>
              ))}
            </div>
          </div>

          {error && <div className="text-xs text-red-400">{error}</div>}

          <button onClick={handlePredict} disabled={loading} className="w-full btn-primary py-3 justify-center text-sm disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</> : <><DollarSign className="w-4 h-4" /> Predict Salary</>}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!result ? (
            <div className="glass-card p-16 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-white mb-2">Know Your Worth</h3>
              <p className="text-gray-500 text-sm">Fill in your details and get data-driven salary predictions</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Main salary display */}
              <div className="glass-card p-6 text-center bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                <p className="text-sm text-gray-400 mb-1">Estimated Annual Salary</p>
                <div className="text-5xl font-bold text-emerald-400 mb-2">{formatCurrency(result.predicted_salary || result.median_salary || 0)}</div>
                <p className="text-sm text-gray-500">
                  Range: <span className="text-white font-medium">{formatCurrency(result.salary_range?.min || 0)} – {formatCurrency(result.salary_range?.max || 0)}</span>
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Market percentile: {result.percentile || "75th"}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Location Multiplier", value: result.location_multiplier ? `${result.location_multiplier}x` : "1.0x" },
                  { label: "Experience Bonus", value: result.experience_bonus ? `+${formatCurrency(result.experience_bonus)}` : "Included" },
                  { label: "Education Premium", value: result.education_premium || "Standard" },
                  { label: "Skills Premium", value: result.skills_premium ? `+${formatCurrency(result.skills_premium)}` : "$0" },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-4">
                    <div className="text-sm font-semibold text-white mb-0.5">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Benchmark Chart */}
              {benchmarkData.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Salary by Experience Level</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={benchmarkData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="exp" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: number) => [formatCurrency(v), "Salary"]}
                        contentStyle={{ backgroundColor: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#fff" }}
                      />
                      <Bar dataKey="salary" radius={[6, 6, 0, 0]}>
                        {benchmarkData.map((_, i) => (
                          <Cell key={i} fill={i === Math.floor(benchmarkData.length / 2) ? "#7c3aed" : "#3f3f5f"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top paying skills */}
              {result.top_paying_skills?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Top Skills That Boost Salary
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.top_paying_skills.map((skill: any, i: number) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-amber-500/15 border border-amber-500/25 text-amber-400">
                        {typeof skill === "string" ? skill : skill.name}
                        {skill.premium && <span className="text-emerald-400">+{formatCurrency(skill.premium)}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
