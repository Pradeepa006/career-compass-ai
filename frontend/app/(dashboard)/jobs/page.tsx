"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, Filter, Loader2, Building2, Star } from "lucide-react";
import { jobsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Remote"];
const EXPERIENCE_LEVELS = ["All", "Entry", "Mid", "Senior", "Lead"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [level, setLevel] = useState("All");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async (query?: string, loc?: string, type?: string, lvl?: string) => {
    setLoading(true);
    try {
      const params: any = {};
      if (query) params.query = query;
      if (loc) params.location = loc;
      if (type && type !== "All") params.job_type = type;
      if (lvl && lvl !== "All") params.experience_level = lvl.toLowerCase();
      const { data } = await jobsApi.search(params);
      setJobs(data.jobs || data || []);
      if ((data.jobs || data || []).length > 0) setSelectedJob((data.jobs || data)[0]);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(search, location, jobType, level);
  };

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 bg-emerald-500/15 border-emerald-500/25";
    if (score >= 70) return "text-amber-400 bg-amber-500/15 border-amber-500/25";
    return "text-gray-400 bg-white/5 border-white/10";
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Job Recommendations</h1>
        <p className="text-gray-400 text-sm">AI-matched jobs based on your profile and skills</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, keyword, company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all w-40"
            />
          </div>
          <div className="flex gap-2">
            {JOB_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => { setJobType(t); fetchJobs(search, location, t, level); }}
                className={cn("px-3 py-2 rounded-xl text-xs border transition-all",
                  jobType === t ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "border-white/10 text-gray-500 hover:border-white/20")}>
                {t}
              </button>
            ))}
          </div>
          <button type="submit" className="btn-primary text-sm py-2.5 px-4">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </form>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <div className="text-4xl mb-3">💼</div>
              <p className="text-gray-400 text-sm">No jobs found. Try different search terms.</p>
            </div>
          ) : jobs.map((job, i) => (
            <motion.div
              key={job.id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedJob(job)}
              className={cn(
                "glass-card p-4 cursor-pointer transition-all hover:-translate-y-0.5",
                selectedJob?.id === job.id ? "border-violet-500/40 bg-violet-500/8" : ""
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Building2 className="w-3 h-3" />{job.company}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {job.match_score && (
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", getMatchColor(job.match_score))}>
                      {job.match_score}% match
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                    className={cn("p-1 rounded-lg transition-all", savedJobs.includes(job.id) ? "text-amber-400" : "text-gray-600 hover:text-amber-400")}>
                    <Star className={cn("w-4 h-4", savedJobs.includes(job.id) ? "fill-current" : "")} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.job_type || "Full-time"}</span>
                {job.salary_range && <span className="flex items-center gap-1 text-emerald-500"><DollarSign className="w-3 h-3" />{job.salary_range}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job Detail */}
        <div className="lg:col-span-3">
          {selectedJob ? (
            <motion.div key={selectedJob.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedJob.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{selectedJob.company}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedJob.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{selectedJob.job_type || "Full-time"}</span>
                  </div>
                </div>
                <button className="btn-primary text-sm px-4 py-2 flex-shrink-0 whitespace-nowrap">
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedJob.salary_range && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15 w-fit">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">{selectedJob.salary_range}</span>
                </div>
              )}

              {selectedJob.description && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Job Description</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{selectedJob.description}</p>
                </div>
              )}

              {selectedJob.required_skills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.map((skill: string) => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.benefits?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Benefits</h3>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {selectedJob.benefits.map((b: string, i: number) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card p-16 text-center h-full flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-lg font-semibold text-white mb-2">Select a Job</h3>
              <p className="text-gray-500 text-sm">Click on a job to see the full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
