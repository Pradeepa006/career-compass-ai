"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "./toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl",
              t.variant === "destructive"
                ? "bg-red-950/90 border-red-500/30 text-red-200"
                : t.variant === "success"
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
                  : "bg-[#0f0a1e]/90 border-white/15 text-white"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.variant === "destructive" ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : t.variant === "success" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-violet-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-semibold">{t.title}</p>}
              {t.description && <p className="text-xs opacity-80 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
