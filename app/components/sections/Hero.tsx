"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, FileText, ArrowUpRight, Award, Shield, Cpu, Mail } from "lucide-react";
import { motion, type Variants } from "framer-motion";
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

const GLYPHS = "0101XYZ_#<>/*+~&!";

function useScrambleText(targetText: string, delayMs = 0) {
  const [text, setText] = useState(targetText);
  const [triggerCount, setTriggerCount] = useState(0);

  const trigger = useCallback(() => {
    setTriggerCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let iteration = 0;
    let interval: NodeJS.Timeout;

    timer = setTimeout(() => {
      interval = setInterval(() => {
        setText(
          targetText
            .split("")
            .map((letter, idx) => {
              if (letter === " ") return " ";
              if (idx < iteration) return targetText[idx];
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("")
        );

        if (iteration >= targetText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 26);
    }, delayMs);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [targetText, delayMs, triggerCount]);

  return { text, trigger };
}

const roleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.35,
    },
  },
};

const roleItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 24,
    },
  },
};

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const proofVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  const firstName = useScrambleText("Javier", 80);
  const lastName = useScrambleText("Siliacay", 220);

  const handleNameReplay = () => {
    firstName.trigger();
    lastName.trigger();
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-dot-grid">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/[0.06] dark:bg-cyan-500/[0.05] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/[0.04] dark:bg-amber-500/[0.03] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-7 text-left">
          {/* Main Title with Tech Scramble Decrypt & Interactive Hover Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2"
          >
            <h1
              onClick={handleNameReplay}
              onMouseEnter={handleNameReplay}
              title="Click or hover to replay tech decrypt"
              className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] cursor-pointer inline-block select-none group"
            >
              <span>{firstName.text}</span>{" "}
              <span className="text-gradient-cyan drop-shadow-sm group-hover:brightness-110 transition-all">
                {lastName.text}
              </span>
            </h1>
          </motion.div>

          {/* Eye-catching Animated Neon Laser Beam Underline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="origin-left h-[3.5px] w-40 sm:w-60 rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-transparent shadow-[0_0_14px_rgba(6,182,212,0.7)] mb-5"
          />

          {/* Professional Role Headline with Spring Stagger */}
          <motion.div
            variants={roleContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-2 text-lg sm:text-2xl font-bold mb-6"
          >
            <motion.span variants={roleItemVariants} className="text-cyan-600 dark:text-cyan-400">
              Software Developer
            </motion.span>
            <motion.span variants={roleItemVariants} className="text-slate-300 dark:text-slate-700">
              &bull;
            </motion.span>
            <motion.span variants={roleItemVariants} className="text-slate-900 dark:text-white">
              AI Engineer
            </motion.span>
            <motion.span variants={roleItemVariants} className="text-slate-300 dark:text-slate-700">
              &bull;
            </motion.span>
            <motion.span variants={roleItemVariants} className="text-cyan-600 dark:text-cyan-400">
              IoT Enthusiast
            </motion.span>
          </motion.div>

          {/* Value Proposition with Soft Focus Reveal */}
          <motion.p
            variants={paragraphVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed"
          >
            Hey, I&apos;m <strong className="text-slate-900 dark:text-white font-bold">Javier</strong>! I&apos;m a software developer and AI engineer building production-grade web platforms and intelligent applications. I currently lead engineering for Autoworx and its partner companies, develop real-time computer vision tools, and occasionally tinker with IoT hardware on the side.
          </motion.p>

          {/* Streamlined Action CTAs */}
          <motion.div
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3.5 mb-10 items-center"
          >
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
              className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-xs flex items-center gap-2 text-sm"
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
          </motion.div>

          {/* Quiet Social-Proof Ribbon */}
          <motion.div
            variants={proofVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 dark:border-white/[0.08]"
          >
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
          </motion.div>
        </div>

        {/* Right Portrait Column */}
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
