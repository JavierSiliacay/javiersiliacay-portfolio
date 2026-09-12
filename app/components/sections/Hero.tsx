"use client";

import { ChevronRight, FileText, ArrowUpRight, Award, Shield, Cpu, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroAvatar from "../HeroAvatar";

const credibilityHighlights = [
  {
    icon: Award,
    title: "Production Lead Developer",
    detail: "Autoworx Enterprise ERP",
  },
  {
    icon: Shield,
    title: "Published IoT Researcher",
    detail: "Univ. of Aizu, Japan (2025)",
  },
  {
    icon: Cpu,
    title: "Full-Stack to Silicon",
    detail: "Next.js 16 • AI Vision • ESP32",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-dot-grid">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/[0.06] dark:bg-cyan-500/[0.05] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/[0.04] dark:bg-amber-500/[0.03] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 text-left"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-cyan-500/30 text-slate-800 dark:text-slate-200 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-cyan-700 dark:text-cyan-400 font-mono text-[11px]">
              Available for contracts &amp; new roles
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.08]">
            Javier <span className="text-gradient-cyan">Siliacay</span>
          </h1>

          {/* Professional Role Headline */}
          <div className="flex flex-wrap items-center gap-2 text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            <span className="text-cyan-600 dark:text-cyan-400">Software Developer</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-slate-900 dark:text-white">AI Engineer</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-cyan-600 dark:text-cyan-400">IoT Enthusiast</span>
          </div>

          {/* Value Proposition */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Architecting high-reliability software from low-level silicon firmware to high-concurrency cloud applications. Lead developer of production automotive ERP platforms, creator of browser-accelerated computer vision tools, and published international IoT researcher.
          </p>

          {/* Streamlined Action CTAs (2 clear high-conversion buttons) */}
          <div className="flex flex-wrap gap-3.5 mb-10 items-center">
            <a
              href="#projects"
              className="px-7 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20 hover:scale-[1.02] flex items-center gap-2 text-sm"
            >
              <span>Explore Featured Work</span>
              <ChevronRight size={18} />
            </a>

            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2 text-sm"
            >
              <FileText size={16} />
              <span>Resume</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </Link>

            <a
              href="#contact"
              className="px-5 py-3.5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1.5 text-sm"
            >
              <Mail size={16} />
              <span>Contact</span>
            </a>
          </div>

          {/* Quiet Social-Proof Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 dark:border-white/[0.08]">
            {credibilityHighlights.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/[0.06] hover:border-cyan-500/40 shadow-2xs transition-all flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                      {stat.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {stat.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Portrait Column with Interactive Moving Sunglasses */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col items-center justify-center relative"
        >
          <HeroAvatar />
        </motion.div>
      </div>
    </section>
  );
}
