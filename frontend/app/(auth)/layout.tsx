import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080612] flex">
      {/* Left: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Career<span className="gradient-text">Compass</span>
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-3 h-3" /> AI
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-[#080612]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[60px]" />

        <div className="relative flex items-center justify-center w-full p-16">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🧭</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Navigate Your <span className="gradient-text">Career</span> with AI
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Join 50,000+ professionals who use AI to predict career paths, analyze skill gaps,
              and accelerate their growth.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { icon: "🎯", label: "Career Prediction", val: "98% accurate" },
                { icon: "📊", label: "Skill Analysis", val: "500+ skills mapped" },
                { icon: "🤖", label: "AI Mentor", val: "GPT-4 powered" },
                { icon: "💰", label: "Salary Insights", val: "Real market data" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-3 rounded-xl">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
