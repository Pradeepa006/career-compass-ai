"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, Loader2, Eye, EyeOff, Plus, X, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/lib/api";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    github_username: user?.github_username || "",
    linkedin_url: user?.linkedin_url || "",
    skills: user?.skills || [] as string[],
    career_goals: user?.career_goals || "",
    years_of_experience: user?.years_of_experience || 0,
  });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await userApi.updateProfile(form);
      updateUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save profile.");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Profile Settings</h1>
        <p className="text-gray-400 text-sm">Manage your personal information and preferences</p>
      </div>

      {/* Avatar section */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
            {user ? getInitials(user.full_name || user.username) : "?"}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{user?.full_name || user?.username}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${user?.plan === "pro" ? "text-violet-400 bg-violet-500/15 border-violet-500/25" : "text-gray-400 bg-white/5 border-white/10"}`}>
                {user?.plan || "Free"} Plan
              </span>
              {user?.is_admin && (
                <span className="text-xs px-2.5 py-1 rounded-full border text-amber-400 bg-amber-500/15 border-amber-500/25 font-medium">Admin</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form sections */}
      <div className="glass-card p-5 space-y-5">
        <h3 className="text-sm font-semibold text-white">Personal Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Full Name</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, Country"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">GitHub Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
              <input type="text" value={form.github_username} onChange={(e) => setForm({ ...form, github_username: e.target.value })}
                placeholder="your-github"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">LinkedIn URL</label>
            <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3} placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500">Years of Experience</label>
              <span className="text-xs font-bold text-violet-400">{form.years_of_experience} yrs</span>
            </div>
            <input type="range" min={0} max={20} value={form.years_of_experience}
              onChange={(e) => setForm({ ...form, years_of_experience: Number(e.target.value) })}
              className="w-full accent-violet-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Career Goal</label>
            <input type="text" value={form.career_goals} onChange={(e) => setForm({ ...form, career_goals: e.target.value })}
              placeholder="e.g. Become a Senior AI Engineer"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Skills</h3>
        <div className="flex gap-2">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add a skill..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
          <button onClick={addSkill} className="px-4 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-500/30 transition-all">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.skills.map((s) => (
            <span key={s} className="skill-badge flex items-center gap-1.5">
              {s}
              <button onClick={() => setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {form.skills.length === 0 && <p className="text-xs text-gray-600">No skills added yet</p>}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-3 px-8 disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
            saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> :
              <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
