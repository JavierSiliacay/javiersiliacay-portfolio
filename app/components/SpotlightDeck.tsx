"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowUpRight, Layers, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import TechLogo from "./TechLogos";

interface DeckProject {
  id: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  impact: string;
  tech: string[];
  liveUrl?: string;
  isInternal?: boolean;
  bgImage?: string;
  logo?: string;
}

const deckItems: DeckProject[] = [
  {
    id: "autoworx",
    title: "Autoworx Enterprise",
    tagline: "Automotive Workshop ERP & AI Estimation",
    category: "Production System",
    status: "In Production",
    impact: "-40% manual reporting overhead in CDO",
    tech: ["Next.js 16", "Supabase", "PostgreSQL", "Google OAuth"],
    liveUrl: "https://autoworxcagayan.com",
    bgImage: "/autoworx-mockup.webp",
    logo: "/project-logos/autoworx.png",
  },
  {
    id: "mekanik",
    title: "Mekanik AI",
    tagline: "Hybrid Cloud & On-Device Vehicle Diagnostics",
    category: "AI & Mobile",
    status: "Active Dev",
    impact: "Zero-latency offline DTC mechanical lookup",
    tech: ["Android / Kotlin", "Offline LLMs", "OBD-II", "BLE"],
    liveUrl: "https://mekanikai.vercel.app/",
    bgImage: "/mekanik-mockup.png",
    logo: "/project-logos/mekanik.png",
  },
  {
    id: "tarafix",
    title: "TaraFix",
    tagline: "Real-Time Auto-Shop & Mechanic Geolocation Marketplace",
    category: "Web App & Freelance Mechanics",
    status: "Active Dev",
    impact: "Sub-second mechanic matching with geospatial caching",
    tech: ["Next.js 16", "Leaflet Maps", "Upstash Redis", "TypeScript"],
    liveUrl: "https://tarafix.vercel.app",
    bgImage: "/tarafix-mockup.png",
    logo: "/project-logos/tarafix.png",
  },
  {
    id: "alk-trucking",
    title: "ALK Trucking Logistics",
    tagline: "Fleet Operations & Trip Manifest Management",
    category: "Logistics & Fleet",
    status: "In Production",
    impact: "Digitalized trip manifests, driver dispatch & expense audits",
    tech: ["Next.js 16", "Neon Postgres", "Drizzle ORM", "TypeScript"],
    liveUrl: "https://alk-trucking.vercel.app",
    bgImage: "/alk-trucking-mockup.webp",
    logo: "/project-logos/alk.jpg",
  },
  {
    id: "autoworx-paintcenter",
    title: "Autoworx Paint Center",
    tagline: "Automotive Color Formulation & Job Costing Suite",
    category: "Production System",
    status: "In Production",
    impact: "Computerized paint mixing formulas & automated job order invoicing",
    tech: ["Next.js 16", "Supabase", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://autoworxpaintcenter.vercel.app/login",
    bgImage: "/paintcenter-mockup.webp",
    logo: "/project-logos/paintcenter.png",
  },
];

export default function SpotlightDeck() {
  const [centerIndex, setCenterIndex] = useState(0);

  const prevCard = () => {
    setCenterIndex((prev) => (prev - 1 + deckItems.length) % deckItems.length);
  };

  const nextCard = () => {
    setCenterIndex((prev) => (prev + 1) % deckItems.length);
  };

  const getPositionClass = (idx: number) => {
    const diff = (idx - centerIndex + deckItems.length) % deckItems.length;
    if (diff === 0) return "is-center";
    if (diff === 1) return "is-right";
    if (diff === 2) return "is-far-right";
    if (diff === 3) return "is-far-left";
    if (diff === 4) return "is-left";
    return "";
  };

  return (
    <div className="w-full my-12 select-none">
      <div className="text-center mb-6">
        <p className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Layers size={12} className="text-cyan-500" />
          <span>Interactive Spotlight Deck &bull; Click to swap</span>
        </p>
      </div>

      <div className="deck">
        {deckItems.map((item, idx) => {
          const posClass = getPositionClass(idx);
          const isCenter = posClass === "is-center";

          return (
            <div
              key={item.id}
              onClick={() => !isCenter && setCenterIndex(idx)}
              className={`deck-card ${posClass} p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121216] border border-slate-200 dark:border-white/10 flex flex-col justify-between relative overflow-hidden group shadow-xl`}
            >
              {/* Subtle ambient light aura */}
              {item.bgImage && (
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Title with Logo Beside it & Tagline */}
                <div className="flex items-center gap-2.5 mb-1">
                  {item.logo && (
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900 shadow-sm flex items-center justify-center p-0.5">
                      <Image
                        src={item.logo}
                        alt={`${item.title} logo`}
                        width={28}
                        height={28}
                        className="object-contain w-full h-full rounded"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {item.title}
                  </h3>
                </div>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-2.5 line-clamp-1">
                  {item.tagline}
                </p>

                {/* Prominent Visual Device Mockup Display Showcase */}
                {item.bgImage && (
                  <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 my-2.5 flex items-center justify-center p-2 group-hover:border-cyan-500/40 transition-colors">
                    <Image
                      src={item.bgImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 340px, 420px"
                      className="object-contain p-1 filter drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                      priority={idx === 0}
                    />
                  </div>
                )}

                {/* Impact Metric */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c0c0f] border border-slate-200/80 dark:border-white/[0.06] mb-3 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
                    {item.impact}
                  </p>
                </div>

                {/* Tech Pills with Vector Logos */}
                <div className="flex flex-wrap gap-1">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.04]"
                    >
                      <TechLogo name={t} size={11} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions (Active only on center card) */}
              <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-2 mt-3">
                <span className="font-mono text-[10px] text-slate-400">
                  {isCenter ? "Active Case" : "Click to view"}
                </span>

                {isCenter && (
                  <div className="flex items-center gap-2">
                    {item.liveUrl ? (
                      item.isInternal ? (
                        <Link
                          href={item.liveUrl}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>Launch</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      ) : (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1 shadow-sm hover:opacity-90"
                        >
                          <span>Live</span>
                          <ExternalLink size={13} />
                        </a>
                      )
                    ) : (
                      <Link
                        href="#projects"
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>Explore</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deck Controls: Prev/Next & Direct Project Switcher */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={prevCard}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Previous project"
          title="Previous project"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
          {deckItems.map((item, idx) => {
            const isActive = idx === centerIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCenterIndex(idx)}
                className={`transition-all duration-300 rounded-full flex items-center gap-1.5 ${isActive
                    ? "px-2.5 py-0.5 bg-cyan-500 text-white font-mono text-[10px] font-bold shadow-sm shadow-cyan-500/50"
                    : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
                aria-label={`Jump to ${item.title}`}
                title={item.title}
              >
                {isActive && <span>{item.title.split(" ")[0]}</span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={nextCard}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Next project"
          title="Next project"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
