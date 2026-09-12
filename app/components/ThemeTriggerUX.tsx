"use client";

import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Monitor, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ThemeTriggerUX() {
  const { theme, themeMode, triggerInfo, clearTriggerInfo } = useTheme();
  const [toastVisible, setToastVisible] = useState(false);
  const [activeInfo, setActiveInfo] = useState(triggerInfo);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number; isDark: boolean } | null>(null);

  useEffect(() => {
    if (triggerInfo) {
      setActiveInfo(triggerInfo);
      setToastVisible(true);

      // Create radial ripple trigger
      setRipple({
        x: triggerInfo.originX,
        y: triggerInfo.originY,
        id: triggerInfo.timestamp,
        isDark: triggerInfo.theme === "dark",
      });

      // Auto dismiss HUD toast after 2.6 seconds
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 2600);

      return () => clearTimeout(timer);
    }
  }, [triggerInfo]);

  const isDark = (activeInfo?.theme || theme) === "dark";

  return (
    <>
      {/* 1. Subtle Ambient Vignette Flash on Trigger */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed inset-0 pointer-events-none z-[9998] transition-colors duration-300 ${
              ripple.isDark 
                ? "bg-cyan-950/20 mix-blend-color-dodge" 
                : "bg-amber-100/30 mix-blend-soft-light"
            }`}
          />
        )}
      </AnimatePresence>

      {/* 2. HUD Mode Activation Glass Toast */}
      <AnimatePresence>
        {toastVisible && activeInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, scale: 0.94, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="fixed top-20 right-4 sm:right-6 z-[9999] max-w-sm w-full pointer-events-auto"
          >
            <div
              className={`relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
                isDark
                  ? "bg-[#0b1120]/90 border-cyan-500/30 text-white shadow-cyan-500/10"
                  : "bg-white/95 border-amber-500/30 text-slate-900 shadow-slate-900/10"
              }`}
            >
              {/* Top ambient highlight line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isDark
                    ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                {/* Mode Icon & Visual Equalizer */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isDark
                        ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                        : "bg-amber-500/15 border-amber-500/30 text-amber-600"
                    }`}
                  >
                    {activeInfo.themeMode === "system" ? (
                      <Monitor size={20} className="animate-pulse" />
                    ) : isDark ? (
                      <Moon size={20} className="rotate-0 transition-transform" />
                    ) : (
                      <Sun size={20} className="rotate-45 transition-transform" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        Theme Engine
                      </span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeInfo.label}
                    </h4>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setToastVisible(false)}
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Telemetry Metrics & Specs */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Activity size={12} className="text-cyan-600 dark:text-cyan-400" />
                  <span>
                    {isDark ? "OLED Deep Slate (#030712)" : "Crisp Studio White (#F8FAFC)"}
                  </span>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {isDark ? "Contrast 14.8:1" : "Contrast 16.2:1"}
                </div>
              </div>

              {/* Auto-dismiss countdown bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2.6, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[2px] ${
                  isDark ? "bg-cyan-500" : "bg-amber-500"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
