"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Search, Loader2, Star, GitFork, Code2, TrendingUp, ExternalLink, AlertCircle } from "lucide-react";
import { githubApi } from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Java: "#007396",
  Go: "#00add8",
  Rust: "#ce422b",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4f5d95",
  Ruby: "#cc342d",
  Swift: "#fa7343",
  Kotlin: "#7f52ff",
};

export default function GitHubAnalysisPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError("");
    setLoading(true);
    try {
      const { data } = await githubApi.analyze(username.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "GitHub profile not found or API limit exceeded.");
      setResult(null);
    } finally { setLoading(false); }
  };

  const langData = result?.languages
    ? Object.entries(result.languages).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">GitHub Profile Analyzer</h1>
        <p className="text-gray-400 text-sm">Analyze your GitHub activity and get career insights</p>
      </div>

      {/* Search */}
      <form onSubmit={handleAnalyze} className="glass-card p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
            />
          </div>
          <button type="submit" disabled={loading || !username.trim()} className="btn-primary text-sm px-6 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Analyze</>}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}
      </form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Profile Header */}
          <div className="glass-card p-5">
            <div className="flex items-start gap-4">
              {result.avatar_url && (
                <img src={result.avatar_url} alt={username} className="w-16 h-16 rounded-full border-2 border-violet-500/30" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-white">{result.name || username}</h2>
                  <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-500 hover:text-violet-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {result.bio && <p className="text-sm text-gray-400 mb-2">{result.bio}</p>}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>{result.public_repos || 0} repos</span>
                  <span>{result.followers || 0} followers</span>
                  <span>{result.following || 0} following</span>
                  {result.location && <span>📍 {result.location}</span>}
                </div>
              </div>
              {/* Profile Strength */}
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{result.profile_strength || result.contribution_score || 75}</div>
                <div className="text-xs text-gray-500">Profile Score</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Stars", value: result.total_stars || 0, icon: Star, color: "from-amber-500 to-yellow-600" },
              { label: "Total Forks", value: result.total_forks || 0, icon: GitFork, color: "from-cyan-500 to-blue-600" },
              { label: "Languages", value: Object.keys(result.languages || {}).length, icon: Code2, color: "from-violet-500 to-purple-600" },
              { label: "Contribution Score", value: result.contribution_score || 0, icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-card p-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Language Distribution */}
            {langData.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Language Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={langData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {langData.map((entry, i) => (
                        <Cell key={i} fill={LANG_COLORS[entry.name] || `hsl(${i * 45},70%,60%)`} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val.toFixed(1)}%`, "Usage"]}
                      contentStyle={{ backgroundColor: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8 }}
                    />
                    <Legend formatter={(val) => <span className="text-xs text-gray-400">{val}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Career Matches */}
            {result.career_matches?.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Career Matches from GitHub</h3>
                <div className="space-y-3">
                  {result.career_matches.map((match: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{match.career || match}</span>
                        <span className="text-violet-400 font-semibold">{match.score || (85 - i * 8)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${match.score || (85 - i * 8)}%` }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">💡 AI Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Repos */}
          {result.top_repositories?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Top Repositories</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.top_repositories.slice(0, 6).map((repo: any, i: number) => (
                  <a key={i} href={repo.url} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/3 border border-white/8 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate">{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
                      {repo.language && <span className="text-violet-400">{repo.language}</span>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!result && !loading && !error && (
        <div className="glass-card p-16 text-center">
          <div className="text-6xl mb-4">🐙</div>
          <h3 className="text-lg font-semibold text-white mb-2">Analyze Your GitHub Profile</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">Enter your GitHub username to get AI-powered insights about your coding activity and career matches</p>
        </div>
      )}
    </div>
  );
}
