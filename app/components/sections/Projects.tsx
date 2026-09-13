"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  ArrowUpRight,
  Eye,
  X,
  Cpu,
  Globe2,
  BrainCircuit,
  Wrench,
  Shield,
  Layers,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TechLogo from "../TechLogos";

interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: "Production & Web" | "AI & Vision" | "IoT & Hardware";
  status: "In Production" | "Active Development" | "Interactive Lab" | "Published Research";
  problem: string;
  solution: string;
  impactMetric: string;
  tech: string[];
  liveUrl?: string;
  isInternalRoute?: boolean;
  featured?: boolean;
  imagePreview?: string;
  logo?: string;
  architectures: string[];
  keyFeatures: string[];
}

const projectsData: ProjectItem[] = [
  {
    id: "autoworx-system",
    title: "Autoworx Enterprise System",
    tagline: "Production Automotive Workshop ERP & AI Diagnostics Platform",
    category: "Production & Web",
    status: "In Production",
    problem:
      "Automotive repair facilities suffer from fragmented pen-and-paper job orders, unpredictable repair estimates, and lack of real-time status visibility for vehicle owners.",
    solution:
      "Architected a unified operations platform with Next.js 16 App Router and Supabase RLS, integrating automated financial ledgers, real-time repair job tracking, Google OAuth, and AI cost estimation.",
    impactMetric: "Reduced manual reporting overhead by 40% for active workshop operations in Cagayan de Oro.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Google OAuth"],
    liveUrl: "https://autoworxcagayan.com",
    featured: true,
    imagePreview: "/autoworx-mockup.webp",
    logo: "/project-logos/autoworx.png",
    architectures: [
      "Server-rendered Next.js 16 App Router architecture with Supabase Row-Level Security (RLS)",
      "Automated financial ledger, parts quotation, and invoice calculation engine",
      "Role-based authorization for mechanics, service advisors, admins, and vehicle owners",
    ],
    keyFeatures: [
      "Real-time vehicle repair milestone tracking with customer notifications",
      "AI-assisted repair cost estimation and diagnostic summary engine",
      "Comprehensive parts inventory and supplier transaction ledger management",
    ],
  },
  {
    id: "mekanik-ai",
    title: "Mekanik AI",
    tagline: "Hybrid Cloud & On-Device Automotive AI Diagnostic Assistant",
    category: "AI & Vision",
    status: "Active Development",
    problem:
      "Field mechanics and drivers stranded in remote off-grid locations encounter vehicle breakdowns with zero cellular reception, rendering cloud-only AI assistants completely inoperable.",
    solution:
      "Engineered an automotive diagnostic assistant supporting local offline LLM inference on-device, live OBD-II Bluetooth telemetry streaming, and cloud API deep diagnostic synthesis.",
    impactMetric: "Zero-latency diagnostic assistance guaranteed even in off-grid Philippine provincial routes.",
    tech: ["Android / Kotlin", "Offline LLMs", "OBD-II Protocols", "Bluetooth BLE", "Cloud AI API"],
    liveUrl: "https://mekanikai.vercel.app/",
    featured: true,
    imagePreview: "/mekanik-mockup.png",
    logo: "/project-logos/mekanik.png",
    architectures: [
      "Hybrid architecture switching seamlessly between local quantized models and cloud LLMs",
      "OBD-II Bluetooth ELM327 protocol parser for live sensor parameter extraction",
      "Automotive Diagnostic Trouble Code (DTC) lookup engine with mechanical explanations",
    ],
    keyFeatures: [
      "Instant offline Diagnostic Trouble Code (DTC) lookup and plain-English translation",
      "Live engine telemetry HUD streaming (RPM, Coolant Temp, Fuel Trims, Voltage)",
      "Step-by-step mechanical repair checklists and emergency roadside guidance",
    ],
  },
  {
    id: "vision-lab",
    title: "Multimodal AI Vision Lab",
    tagline: "Real-Time In-Browser Computer Vision & Biometric Telemetry Suite",
    category: "AI & Vision",
    status: "Interactive Lab",
    problem:
      "Computer vision applications typically require heavy server GPUs, causing bandwidth latency bottlenecks, cloud infrastructure costs, and serious biometric privacy risks.",
    solution:
      "Engineered a high-performance, client-side vision environment with WebGL hardware acceleration executing MediaPipe Face Mesh (468 3D landmarks), multi-hand tracking, and skeletal pose estimation directly in the browser.",
    impactMetric: "60 FPS local computer vision inference with zero server data transfer, guaranteeing 100% biometric privacy.",
    tech: ["TensorFlow.js", "MediaPipe", "WebGL", "Next.js", "Canvas API", "Computer Vision"],
    liveUrl: "/vision",
    isInternalRoute: true,
    architectures: [
      "Multiplexed client-side pipeline running Face Mesh, Hands, and Pose models in parallel",
      "High-performance Canvas 2D and WebGL rendering overlay with sub-millisecond draw calls",
      "Spatial gesture state machine for non-contact UI control",
    ],
    keyFeatures: [
      "468-point 3D biometric face mesh with real-time emotion telemetry",
      "Multi-hand landmark tracking with gesture velocity estimation",
      "Live FPS and execution latency telemetry benchmarking",
    ],
  },
  {
    id: "oil-monitoring",
    title: "Real-Time Engine Oil Degradation Spectrometer",
    tagline: "IoT Optical Turbidity & Telemetry Web Server for Internal Combustion Engines",
    category: "IoT & Hardware",
    status: "Published Research",
    problem:
      "Internal combustion engines experience catastrophic failures when lubricating oil breaks down unnoticed before standard mileage-based maintenance intervals.",
    solution:
      "Developed an IoT engine oil quality monitoring apparatus using optical turbidity sensors and an ESP32 web server to stream real-time viscosity and soot contamination telemetry.",
    impactMetric: "Published thesis research presented at the 2025 International Conference at the University of Aizu, Japan.",
    tech: ["C++", "ESP32", "Turbidity Sensor", "HTML/CSS Web Server", "Autotronics"],
    architectures: [
      "Optical turbidity voltage-to-contamination calibration algorithm",
      "Embedded asynchronous HTTP server running directly on ESP32 flash memory",
      "Hardware circuit isolating sensor noise from automotive ignition interference",
    ],
    keyFeatures: [
      "Live oil degradation index display with visual status alerts",
      "Published academic methodology for optical automotive fluid analysis",
      "Standalone Wi-Fi access point for direct mechanic dashboard connection",
    ],
  },
  {
    id: "circuito-ai",
    title: "CircuitoAI",
    tagline: "AI-Powered Hardware Diagnostic & Browser Serial Telemetry IDE",
    category: "IoT & Hardware",
    status: "Active Development",
    problem:
      "Debugging microcontrollers and automotive sensor networks requires toggling between oscilloscope windows, terminal serial monitors, and disparate documentation.",
    solution:
      "Built a unified browser-based IDE integrating the Web Serial API for live telemetry streaming with an AI Specialist that decodes serial logs and diagnoses wiring issues in real time.",
    impactMetric: "Live bidirectional serial communication in-browser with automated AI hardware debugging.",
    tech: ["TypeScript", "Next.js", "Web Serial API", "AI Specialist", "IoT Protocols"],
    logo: "/project-logos/circuito.png",
    architectures: [
      "Web Serial API abstraction layer for high-throughput baud rates",
      "Streaming prompt context builder feeding raw hardware logs to LLM reasoning engines",
      "Dynamic waveform graphing for analog sensor outputs",
    ],
    keyFeatures: [
      "Direct browser-to-microcontroller USB serial connection (no drivers required)",
      "Automated baud rate detection and ANSI color log parsing",
      "AI-assisted schematic bug diagnosis and wiring suggestions",
    ],
  },
  {
    id: "tarafix",
    title: "TaraFix",
    tagline: "Real-Time Auto-Shop & Mechanic Geolocation Marketplace in the Philippines",
    category: "Production & Web",
    status: "Active Development",
    problem:
      "Motorists experiencing breakdowns across Philippine roads struggle to locate verified nearby mechanics with transparent pricing and real-time availability.",
    solution:
      "Built a location-aware web platform using Next.js 16 and geospatial routing that connects vehicle owners directly to local certified mechanics with instant navigation.",
    impactMetric: "Real-time mechanic locator connecting vehicle owners with vetted auto-shops across Philippine provinces.",
    tech: ["Next.js 16", "React 19", "Leaflet Maps", "TypeScript", "Tailwind CSS", "Geolocation API"],
    liveUrl: "https://tarafix.vercel.app",
    featured: true,
    imagePreview: "/tarafix-mockup.png",
    logo: "/project-logos/tarafix.png",
    architectures: [
      "Geospatial distance query caching using Upstash Redis and TanStack Query",
      "Interactive map rendering with custom vehicle & workshop pin clusters",
      "Mobile-first responsive interface optimized for roadside cellular connections",
    ],
    keyFeatures: [
      "Live interactive map locator for verified Philippine repair shops and mobile mechanics",
      "Filtered service search (tire repair, engine overhaul, electrical, towing)",
      "Direct one-touch call and instant location sharing for roadside rescue",
    ],
  },
  {
    id: "alk-trucking",
    title: "ALK Trucking Management System",
    tagline: "Fleet Operations, Trip Manifest & Fuel Expense Audit Platform",
    category: "Production & Web",
    status: "In Production",
    problem:
      "Commercial freight and trucking operations lose thousands in unverified fuel reimbursements, lost paper trip receipts, and inefficient driver assignment scheduling.",
    solution:
      "Built an enterprise fleet and logistics portal digitalizing driver trip manifests, cargo destination dispatch, automated diesel consumption auditing, and financial expense verification.",
    impactMetric: "Automated end-to-end trip manifest recording and fuel expense reconciliation for commercial cargo haulers.",
    tech: ["Next.js 16", "Neon Postgres", "Drizzle ORM", "TypeScript", "Tailwind CSS", "NextAuth.js", "Leaflet Maps"],
    liveUrl: "https://alk-trucking.vercel.app",
    featured: true,
    imagePreview: "/alk-trucking-mockup.webp",
    logo: "/project-logos/alk.jpg",
    architectures: [
      "Serverless PostgreSQL persistence layer using Neon Database and Drizzle ORM migrations",
      "Dynamic trip manifest generation with digital waypoint and cargo weight tracking",
      "Automated fuel expense reconciliation engine calculating km/liter efficiency",
      "Role-gated dispatch console with NextAuth.js session security for fleet managers and drivers",
    ],
    keyFeatures: [
      "Live trip dispatch queue and driver assignment scheduling",
      "Automated fuel purchase receipt logging and mileage discrepancy alerts",
      "Exportable financial accounting summaries and cargo delivery verification",
    ],
  },
  {
    id: "autoworx-paintcenter",
    title: "Autoworx Paint Center",
    tagline: "Automotive Paint Formulation, Color Mixing & Job Order Billing Suite",
    category: "Production & Web",
    status: "In Production",
    problem:
      "Automotive paint shops rely on manual swatch records, resulting in incorrect pigment ratios, paint batch waste, and inaccurate repair quotation estimates.",
    solution:
      "Engineered a precision color formulation and workshop billing suite with computerized mixing ratios, materials cost breakdown, and instant job order invoicing.",
    impactMetric: "Computerized paint formulations and automated job costing eliminating mixing discrepancies.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://autoworxpaintcenter.vercel.app/login",
    featured: true,
    imagePreview: "/paintcenter-mockup.webp",
    logo: "/project-logos/paintcenter.png",
    architectures: [
      "Precision paint recipe formula database with automated component volume scaling",
      "Integrated job order costing calculation engine factoring basecoat, clearcoat, and labor",
      "Supabase real-time database tracking inventory levels of pigments and hardeners",
    ],
    keyFeatures: [
      "Digital formula catalog with car model and color code lookup",
      "Real-time materials inventory tracking with low-stock warnings",
      "Instant PDF quotation and invoice generation for paint and body repair jobs",
    ],
  },
  {
    id: "esp32-templates",
    title: "ESP32 IoT & AI Vision Firmware Library",
    tagline: "Modular Production-Ready C++ IoT Architecture for Embedded Engineers",
    category: "IoT & Hardware",
    status: "Active Development",
    problem:
      "Embedded developers repeatedly rewrite boilerplate code for Wi-Fi provisioning, MQTT telemetry, Telegram bots, and cloud sync across every new IoT project.",
    solution:
      "Created an open-source library of modular ESP32 firmware templates featuring Google Gemini AI vision integration, MQTT pub/sub, Telegram bot control, and Firebase real-time sync.",
    impactMetric: "Accelerated IoT hardware prototype bring-up time from days to under 30 minutes for embedded developers.",
    tech: ["C++", "ESP32", "Firebase", "Gemini AI API", "MQTT", "Telegram Bot API"],
    architectures: [
      "Non-blocking asynchronous task scheduling using FreeRTOS primitives on ESP32",
      "Robust automatic Wi-Fi reconnection state machine with exponential backoff",
      "REST and MQTT payload serialization using ArduinoJson",
    ],
    keyFeatures: [
      "Gemini AI vision integration template for ESP32-CAM visual recognition",
      "Two-way Telegram bot command parsing for remote IoT device control",
      "Firebase Realtime Database synchronization with auto-token refresh",
    ],
  },
  {
    id: "sadbai-ai",
    title: "Sadbai AI",
    tagline: "Private Emotional Support & Conversational Companion",
    category: "AI & Vision",
    status: "Active Development",
    problem:
      "Users seeking emotional relief or journaling often face judgment, invasive paywalls, or privacy-invasive sign-up forms.",
    solution:
      "Built a zero-friction, zero-login emotional companion powered by LangChain and LLMs designed to help users unpack stress, heartbreak, and emotional fatigue in complete confidence.",
    impactMetric: "Zero-login private conversational space built in a 24-hour development sprint.",
    tech: ["GenAI", "LangChain", "Next.js", "TypeScript", "Tailwind CSS"],
    architectures: [
      "Session-only transient memory ensuring zero conversation persistence on disk",
      "Empathetic conversational prompting pipelines with crisis intervention routing",
      "Ultra-minimalist distraction-free typography interface",
    ],
    keyFeatures: [
      "Instant launch with no sign-up or profile tracking required",
      "Active listening and reflective question synthesis",
      "Smooth typing responses with calming minimalist dark mode aesthetic",
    ],
  },
];

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filterCategories = [
    { label: "All Projects", value: "All" },
    { label: "Production & Web", value: "Production & Web" },
    { label: "AI & Vision", value: "AI & Vision" },
    { label: "IoT & Hardware", value: "IoT & Hardware" },
  ];

  const flagshipProjects = projectsData.filter((p) => p.featured);
  const labProjects = projectsData.filter((p) => !p.featured);

  const filteredLabProjects =
    selectedFilter === "All"
      ? labProjects
      : labProjects.filter((p) => p.category === selectedFilter);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <FolderGit2 size={13} />
            <span>Selected Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Featured <span className="text-gradient-cyan">Projects</span>
          </h2>
        </div>
      </div>

      {/* ── TIER 1: FLAGSHIP EDITORIAL CASE STUDIES ── */}
      <div className="space-y-8 mb-20">
        {flagshipProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.42, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-6 sm:p-8 lg:p-10 glass-panel border border-slate-200/90 dark:border-white/10 hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden group shadow-lg"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06] blur-3xl rounded-full pointer-events-none" />

            {/* Ambient Background Mockup */}
            {project.imagePreview && (
              <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 overflow-hidden pointer-events-none opacity-15 dark:opacity-20 group-hover:opacity-25 transition-opacity duration-700 z-0">
                <Image
                  src={project.imagePreview}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top filter contrast-125 saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#0c0c0f] dark:via-[#0c0c0f]/90 dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0c0c0f] dark:via-transparent to-transparent" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* Left Overview Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{project.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-cyan-700 dark:text-cyan-400 font-mono mt-1">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.solution}
                </p>

                {/* Tech Stack Pills with Logos */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]"
                    >
                      <TechLogo name={t} size={13} className="w-3.5 h-3.5 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Metrics & Actions Column */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/80 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-5">
                {/* Visual Mockup Device Showcase Frame */}
                {project.imagePreview && (
                  <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 p-2 flex items-center justify-center shadow-xs group/preview">
                    <Image
                      src={project.imagePreview}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-contain p-1.5 filter drop-shadow-xl group-hover/preview:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    <TrendingUp size={12} className="text-cyan-600 dark:text-cyan-400" />
                    <span>Key Result</span>
                  </div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {project.impactMetric}
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye size={14} />
                    <span>Deep Dive</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {project.liveUrl &&
                      (project.isInternalRoute ? (
                        <Link
                          href={project.liveUrl}
                          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 hover:scale-[1.02]"
                        >
                          <span>Launch Live Lab</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 hover:scale-[1.02]"
                        >
                          <span>Visit Production App</span>
                          <ExternalLink size={14} />
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── TIER 2: ENGINEERING LAB & RESEARCH ARCHIVE ── */}
      <div className="pt-10 border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Lab &amp; Experiments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Research prototypes, embedded firmware, and specialized tools.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {filterCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedFilter(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedFilter === cat.value
                    ? "bg-cyan-600 text-white shadow-sm font-bold"
                    : "bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/[0.06]"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Balanced Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLabProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (idx % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between rounded-2xl p-6 glass-card border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/40 transition-all duration-300 group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2.5">
                  {project.logo && (
                    <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900 shadow-xs flex items-center justify-center p-0.5">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        width={24}
                        height={24}
                        className="object-contain w-full h-full rounded-xs"
                      />
                    </div>
                  )}
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {project.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {project.solution}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md text-slate-400">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3.5 border-t border-slate-200/70 dark:border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={13} />
                  <span>Deep Dive</span>
                </button>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target={project.isInternalRoute ? "_self" : "_blank"}
                    rel={project.isInternalRoute ? "" : "noopener noreferrer"}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 transition-colors"
                  >
                    <span>{project.isInternalRoute ? "Launch Lab" : "Live Demo"}</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/20">
                  {activeModalProject.category} &bull; {activeModalProject.status}
                </span>
                <div className="flex items-center gap-3 mt-3">
                  {activeModalProject.logo && (
                    <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 shadow-sm flex items-center justify-center p-1">
                      <Image
                        src={activeModalProject.logo}
                        alt={`${activeModalProject.title} logo`}
                        width={32}
                        height={32}
                        className="object-contain w-full h-full rounded-md"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {activeModalProject.title}
                  </h3>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {activeModalProject.tagline}
                </p>
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1">
                    The Engineering Problem
                  </h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {activeModalProject.problem}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-cyan-700 dark:text-cyan-400 tracking-wider mb-1">
                    Architectural Solution
                  </h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              {/* Key Result */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 tracking-wider block mb-1">
                  Key Result
                </span>
                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-300">
                  {activeModalProject.impactMetric}
                </p>
              </div>

              {/* Architecture & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                    System Architecture
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeModalProject.architectures.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeModalProject.keyFeatures.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal CTAs */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                {activeModalProject.liveUrl &&
                  (activeModalProject.isInternalRoute ? (
                    <Link
                      href={activeModalProject.liveUrl}
                      onClick={() => setActiveModalProject(null)}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Launch Experiment</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <a
                      href={activeModalProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Visit Live Platform</span>
                      <ExternalLink size={14} />
                    </a>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
