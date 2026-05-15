"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[#0a0818]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative glass-card p-12 neon-border"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Start Your AI Career Journey Today
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Dream Career
            <br />
            <span className="gradient-text glow-text">Starts Right Now</span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ professionals who are using AI to navigate their careers smarter.
            No credit card required. Get your first career prediction in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="btn-primary text-base px-10 py-4 glow-purple">
                <Zap className="w-5 h-5" />
                Analyze My Career for Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-secondary text-base px-10 py-4">
                Learn More
              </button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-600">
            Free forever • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
