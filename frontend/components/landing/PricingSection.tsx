"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Crown, Building } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with AI career insights",
    icon: Zap,
    gradient: "from-gray-500 to-slate-600",
    features: [
      "1 Career Prediction per month",
      "Basic Skill Gap Analysis",
      "Resume Upload (1 file)",
      "ATS Score Check",
      "5 AI Mentor messages/day",
      "Job Recommendations",
    ],
    cta: "Get Started Free",
    ctaHref: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "month",
    description: "Full access for serious professionals",
    icon: Crown,
    gradient: "from-violet-500 to-purple-600",
    features: [
      "Unlimited Career Predictions",
      "Advanced Skill Gap Analysis",
      "Unlimited Resume Uploads",
      "Resume Roast + ATS Deep Analysis",
      "Unlimited AI Mentor Chat (GPT-4)",
      "GitHub Profile Analysis",
      "Salary Prediction Engine",
      "Personalized Learning Roadmap",
      "Interview Question Generator",
      "Priority Support",
    ],
    cta: "Start Pro Trial",
    ctaHref: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and organizations",
    icon: Building,
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "Everything in Pro",
      "Up to 50 team members",
      "Admin analytics dashboard",
      "Custom skill frameworks",
      "API access",
      "White-label option",
      "Dedicated account manager",
      "SLA guarantee",
      "SSO / SAML",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[#0a0818]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-gray-400">
            Start free. Upgrade when you're ready for the full AI experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={cn(
                  "relative glass-card p-8 transition-all duration-300",
                  plan.popular && "border-violet-500/40 bg-violet-500/5 scale-105 glow-purple"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-1">/{plan.period}</span>
                </div>

                <Link href={plan.ctaHref}>
                  <button className={cn(
                    "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-6",
                    plan.popular
                      ? "btn-primary justify-center"
                      : "bg-white/8 text-white border border-white/15 hover:bg-white/15"
                  )}>
                    {plan.cta}
                  </button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
