"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const STATS = [
  { value: 50000, suffix: "+", label: "Careers Analyzed", description: "Professionals guided to their dream careers" },
  { value: 98, suffix: "%", label: "Prediction Accuracy", description: "Industry-leading AI model precision" },
  { value: 500, suffix: "+", label: "Skills Mapped", description: "Comprehensive skill taxonomy database" },
  { value: 15, suffix: "k+", label: "Roadmaps Generated", description: "Personalized learning paths created" },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080612] via-[#0d0a1e] to-[#080612]" />

      {/* Separator line with glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 tabular-nums">
                {isInView ? (
                  <CountUp end={stat.value} duration={2} delay={0.3 + i * 0.1} separator="," />
                ) : "0"}
                {stat.suffix}
              </div>
              <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500 leading-snug">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
