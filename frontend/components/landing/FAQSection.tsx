"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How accurate is the career prediction AI?", a: "Our ML model achieves 98% accuracy on our validation dataset, tested against 50,000+ real career transitions. It uses skill similarity matching, NLP analysis, and industry demand data to provide highly reliable predictions." },
  { q: "Can I use CareerCompass AI with no technical background?", a: "Absolutely! CareerCompass AI works for anyone - from complete beginners to senior professionals. The platform adapts its recommendations based on your current skill level and experience." },
  { q: "How does the resume analysis work?", a: "Upload your PDF or DOCX resume and our AI instantly extracts skills, calculates an ATS compatibility score (0-100), identifies missing keywords, and provides specific improvement suggestions to maximize your chances." },
  { q: "Is my data secure and private?", a: "Yes. We use end-to-end encryption, never sell your data, and are fully GDPR compliant. Your resume and career data are stored securely and you can delete everything at any time." },
  { q: "Which AI model powers the chatbot?", a: "The AI Mentor is powered by GPT-4 (Pro plan) or a fine-tuned model on our free tier. It's specifically trained on career guidance, interview prep, and tech industry knowledge." },
  { q: "How long until I see results?", a: "Career predictions and skill gap analysis are instant. Most users report feeling significantly more clarity within the first session. Career transitions typically take 3-12 months following the personalized roadmap." },
  { q: "Can I connect my GitHub and LinkedIn?", a: "Yes! Connect your GitHub username for automatic profile analysis - we detect your tech stack, evaluate repositories, and factor contributions into career recommendations. LinkedIn integration coming soon." },
  { q: "Is there a free trial for Pro features?", a: "Yes! We offer a 14-day free trial of all Pro features with no credit card required. After the trial, you can continue on the free plan or upgrade." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[#080612]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-gray-400">Everything you need to know about CareerCompass AI.</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "glass-card overflow-hidden transition-all duration-200",
                open === i && "border-violet-500/30"
              )}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200", open === i && "rotate-180 text-violet-400")} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
