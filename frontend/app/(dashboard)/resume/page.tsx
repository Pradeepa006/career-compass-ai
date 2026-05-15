"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2,
  Star, Target, Zap, TrendingUp, Download, Trash2, RefreshCw
} from "lucide-react";
import { resumeApi } from "@/lib/api";
import { cn, getScoreColor, getScoreGradient } from "@/lib/utils";

export default function ResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [roastMode, setRoastMode] = useState(false);
  const [roastText, setRoastText] = useState("");
  const [loadingRoast, setLoadingRoast] = useState(false);
  const [error, setError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const { data } = await resumeApi.upload(file);
      setResumes((prev) => [data, ...prev]);
      setSelectedResume(data);
      // Poll for completion
      pollResumeStatus(data.id);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const pollResumeStatus = async (resumeId: string) => {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const { data } = await resumeApi.get(resumeId);
        if (data.analysis_status === "completed" || data.analysis_status === "failed") {
          setSelectedResume(data);
          setResumes((prev) => prev.map((r) => r.id === resumeId ? data : r));
          break;
        }
      } catch { break; }
    }
  };


  const handleRoast = async () => {
    if (!selectedResume) return;
    setLoadingRoast(true);
    try {
      const { data } = await resumeApi.roast(selectedResume.id);
      setRoastText(data.roast_feedback);
      setRoastMode(true);
    } catch { setError("Roast failed. Try again."); }
    finally { setLoadingRoast(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Resume Analysis</h1>
        <p className="text-gray-400 text-sm">Upload your resume for AI-powered ATS scoring and improvement suggestions</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dropzone */}
          <div
            className={cn(
              "glass-card p-8 border-2 border-dashed cursor-pointer text-center transition-all duration-200",
              isDragActive ? "border-violet-400 bg-violet-500/10" : "border-white/15 hover:border-violet-500/40 hover:bg-white/5"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragActive(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }}
            />
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-violet-400" />
                </div>
              )}
              <div>
                <p className="text-white font-medium text-sm">
                  {isDragActive ? "Drop your resume here" : uploading ? "Analyzing your resume..." : "Drop your resume or click to upload"}
                </p>
                <p className="text-gray-500 text-xs mt-1">PDF or DOCX · Max 10MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Resume list */}
          {resumes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Resumes</p>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => setSelectedResume(resume)}
                  className={cn(
                    "p-3.5 rounded-xl border cursor-pointer transition-all",
                    selectedResume?.id === resume.id
                      ? "border-violet-500/40 bg-violet-500/8"
                      : "border-white/8 glass-card hover:border-white/15"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{resume.filename}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {resume.analysis_status === "completed" && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Analyzed
                          </span>
                        )}
                        {resume.analysis_status === "processing" && (
                          <span className="text-xs text-amber-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                          </span>
                        )}
                        {resume.ats_score && <span className="text-xs text-gray-500">ATS: {resume.ats_score}/100</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!selectedResume ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-16 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-white mb-2">No Resume Selected</h3>
                <p className="text-gray-500 text-sm">Upload your resume to see the AI analysis</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedResume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "ATS Score", value: selectedResume.ats_score, icon: Target, color: "from-violet-500 to-purple-600" },
                    { label: "Quality Score", value: selectedResume.quality_score, icon: Star, color: "from-cyan-500 to-blue-600" },
                    { label: "Skills Found", value: selectedResume.extracted_skills?.length, icon: Zap, color: "from-emerald-500 to-teal-600", suffix: "" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="glass-card p-4 text-center">
                        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2", item.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className={cn("text-2xl font-bold mb-0.5", item.value ? getScoreColor(item.value) : "text-gray-400")}>
                          {item.value ?? (selectedResume.analysis_status === "processing" ? "..." : "--")}
                          {item.value && !item.suffix?.length ? "/100" : ""}
                        </div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Roast Mode Toggle */}
                <div className="flex gap-3">
                  <button
                    onClick={handleRoast}
                    disabled={!selectedResume.raw_text || loadingRoast}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingRoast ? <Loader2 className="w-4 h-4 animate-spin" /> : "🔥"}
                    Resume Roast Mode
                  </button>
                  {roastMode && (
                    <button onClick={() => setRoastMode(false)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm">
                      Show Regular Analysis
                    </button>
                  )}
                </div>

                {/* Roast / Regular content */}
                {roastMode && roastText ? (
                  <div className="glass-card p-5 border-orange-500/20 bg-orange-500/5">
                    <h3 className="text-sm font-semibold text-orange-400 mb-3">🔥 Resume Roast</h3>
                    <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{roastText}</p>
                  </div>
                ) : (
                  <>
                    {/* AI Feedback */}
                    {selectedResume.ai_feedback && (
                      <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-2">AI Analysis</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{selectedResume.ai_feedback}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedResume.extracted_skills?.length > 0 && (
                      <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-3">Detected Skills ({selectedResume.extracted_skills.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.extracted_skills.map((skill: string) => (
                            <span key={skill} className="skill-badge">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvements */}
                    {selectedResume.weaknesses?.length > 0 && (
                      <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-violet-400" /> Improvement Suggestions
                        </h3>
                        <ul className="space-y-2">
                          {selectedResume.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedResume.analysis_status === "processing" && (
                      <div className="glass-card p-8 text-center">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Analyzing your resume with AI... This takes ~30 seconds</p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
