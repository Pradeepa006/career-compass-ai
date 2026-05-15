"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "ML Engineer @ Google",
    avatar: "SC",
    content: "CareerCompass AI completely changed my career trajectory. The skill gap analysis was spot-on and the roadmap helped me land my dream job at Google in just 8 months.",
    stars: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Johnson",
    role: "Senior DevOps @ AWS",
    avatar: "MJ",
    content: "The AI mentor chatbot is incredible. It's like having a senior engineer available 24/7. The resume roast mode was brutal but honest - and it worked!",
    stars: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Priya Sharma",
    role: "Full Stack Dev @ Stripe",
    avatar: "PS",
    content: "I went from knowing just HTML/CSS to a $140k full stack role in 10 months following the personalized roadmap. The salary prediction was accurate to within $5k.",
    stars: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Alex Rodriguez",
    role: "Data Scientist @ Netflix",
    avatar: "AR",
    content: "The GitHub analyzer revealed I was spending time on the wrong projects. After following the recommendations, my profile strength jumped from 45 to 92/100.",
    stars: 5,
    gradient: "from-orange-500 to-amber-600",
  },
  {
    name: "Emma Williams",
    role: "Cloud Architect @ Microsoft",
    avatar: "EW",
    content: "Best investment in my career. The career prediction AI was eerily accurate. It suggested Cloud Architecture when I was still a sysadmin - now I'm a certified architect.",
    stars: 5,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "David Kim",
    role: "Product Manager @ Airbnb",
    avatar: "DK",
    content: "Coming from a non-tech background, the roadmap gave me clear, actionable steps. The AI mentor helped me prep for 20+ PM interviews. Got 3 offers!",
    stars: 5,
    gradient: "from-indigo-500 to-violet-600",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[#080612]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-gray-400">
            Join professionals who transformed their careers with AI guidance.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card p-6 hover:border-violet-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-violet-500/40 mb-3" />
              <p className="text-sm text-gray-300 leading-relaxed mb-5">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
