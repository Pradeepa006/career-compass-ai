"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, Upload, Brain, Rocket } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and tell us about your skills, experience, interests, and career goals. Connect your GitHub and LinkedIn for deeper insights.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    step: "02",
    icon: Upload,
    title: "Upload Your Resume",
    description: "Upload your PDF or DOCX resume. Our AI parses it instantly, extracts skills, scores your ATS compatibility, and identifies improvement areas.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    step: "03",
    icon: Brain,
    title: "Get AI Analysis",
    description: "Our ML models analyze everything and predict your top career matches, identify skill gaps, and estimate salary ranges with confidence scores.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Follow Your Roadmap",
    description: "Receive a personalized learning roadmap with curated resources, milestones, and timelines. Chat with your AI mentor anytime for guidance.",
    gradient: "from-orange-500 to-amber-600",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0818] via-[#080612] to-[#0a0818]" />
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            From zero to career clarity in minutes. Our AI does the heavy lifting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-orange-500/30" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl mx-auto relative z-10`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#080612] border-2 border-violet-500/50 flex items-center justify-center">
                    <span className="text-[10px] font-bold gradient-text">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
