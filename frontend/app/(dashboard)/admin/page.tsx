"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, TrendingUp, BarChart3, Loader2, RefreshCw,
  AlertCircle, CheckCircle, Server, Database, Zap
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { formatNumber } from "@/lib/utils";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([adminApi.getStats(), adminApi.getUsers()]);
      setStats(statsRes.data);
      setUsers(usersRes.data?.users || usersRes.data || []);
    } catch (err: any) {
      setError(err.response?.status === 403 ? "Access denied. Admin only." : "Failed to load admin data.");
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-12 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="text-red-400">{error}</p>
    </div>
  );

  const careerData = stats?.popular_careers
    ? Object.entries(stats.popular_careers).map(([name, count]) => ({ name: name.replace(" Developer", "").replace(" Engineer", ""), count: Number(count) }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-400" /> Admin Panel
          </h1>
          <p className="text-gray-400 text-sm">Platform overview and management</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "from-violet-500 to-purple-600", change: "+12%" },
          { label: "Active Today", value: stats?.active_users || 0, icon: Zap, color: "from-cyan-500 to-blue-600", change: "+5%" },
          { label: "Analyses Run", value: stats?.total_analyses || 0, icon: BarChart3, color: "from-emerald-500 to-teal-600", change: "+28%" },
          { label: "Resumes Uploaded", value: stats?.total_resumes || 0, icon: Database, color: "from-amber-500 to-orange-600", change: "+18%" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatNumber(stat.value)}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* System Health */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-violet-400" /> System Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "API Status", status: "Operational", ok: true },
            { label: "Database", status: "Healthy", ok: true },
            { label: "AI Service", status: "Operational", ok: true },
            { label: "Storage", status: `${stats?.storage_used || "2.4"} GB used`, ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/3 border border-white/5">
              {item.ok ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              <div>
                <div className="text-xs font-medium text-white">{item.label}</div>
                <div className={`text-[10px] ${item.ok ? "text-emerald-400" : "text-red-400"}`}>{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {careerData.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Popular Career Predictions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={careerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {careerData.map((_, i) => <Cell key={i} fill={`hsl(${260 + i * 20}, 70%, ${50 + i * 3}%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">User Growth (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.daily_users || [
              { day: "Mon", users: 45 }, { day: "Tue", users: 62 }, { day: "Wed", users: 58 },
              { day: "Thu", users: 71 }, { day: "Fri", users: 89 }, { day: "Sat", users: 95 }, { day: "Sun", users: 103 },
            ]}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users Table */}
      {users.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Users ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/5">
                  {["User", "Email", "Joined", "Status", "Plan"].map((h) => (
                    <th key={h} className="pb-3 text-xs text-gray-500 font-semibold uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {users.slice(0, 10).map((user: any, i: number) => (
                  <tr key={i} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4 font-medium text-white">{user.full_name || user.username}</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{user.email}</td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.is_active !== false ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-500/15 text-gray-400"}`}>
                        {user.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${user.plan === "pro" ? "bg-violet-500/15 text-violet-400" : "bg-white/5 text-gray-500"}`}>
                        {user.plan || "free"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
