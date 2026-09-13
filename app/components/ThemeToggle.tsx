"use client";

import { useTheme, ThemeMode } from "../context/ThemeContext";
import { Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, themeMode, toggleTheme, setThemeMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popup menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center ${className}`}>
        <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
    { mode: "light", label: "Studio Light", icon: Sun, desc: "Crisp architectural contrast" },
    { mode: "dark", label: "Cyber Dark", icon: Moon, desc: "Deep OLED & neon telemetry" },
    { mode: "system", label: "System Sync", icon: Monitor, desc: "Mirrors OS daylight cycle" },
  ];

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Primary Trigger Button */}
      <button
        onClick={(e) => toggleTheme(e)}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
        aria-label={`Toggle theme (currently ${themeMode})`}
        title={`Click to switch theme, right-click/chevron for options (${isDark ? "Dark" : "Light"})`}
        className={`relative p-2 rounded-xl border transition-all duration-300 flex items-center justify-center overflow-hidden group cursor-pointer ${
          isDark
            ? "bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-slate-700/80 hover:border-cyan-400/50 shadow-sm shadow-cyan-500/5"
            : "bg-white hover:bg-slate-50 text-sky-600 border-slate-200 hover:border-sky-400/50 shadow-sm shadow-slate-900/5"
        } ${className}`}
      >
        <motion.div
          key={theme}
          initial={{ y: -12, opacity: 0, rotate: -45, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: 12, opacity: 0, rotate: 45, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={17} className="text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon size={17} className="text-slate-800 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </motion.div>
      </button>

      {/* Mini Options Trigger Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        aria-label="Theme mode options"
        className={`p-1 -ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-r-md`}
      >
        <ChevronDown size={11} className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 3-Way Theme Switcher Popover */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-2xl p-2 z-50 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xl"
          >
            <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Theme Profile
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                {themeMode}
              </span>
            </div>

            <div className="space-y-1">
              {themeOptions.map((opt) => {
                const isSelected = themeMode === opt.mode;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.mode}
                    onClick={(e) => {
                      setThemeMode(opt.mode, e);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"} />
                      <div>
                        <div className="text-xs">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal leading-tight">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-cyan-600 dark:text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
