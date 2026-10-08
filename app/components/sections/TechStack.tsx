"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { 
  Globe2, 
  BrainCircuit, 
  Cpu, 
  Car, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Terminal,
  Play,
  ExternalLink,
  Maximize2,
  X,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TechLogo from "../TechLogos";

interface CapabilityPillar {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  description: string;
  coreTech: string[];
  capabilities: string[];
  realWorldImpact: string;
  accentColor: string;
}

const capabilityPillars: CapabilityPillar[] = [
  {
    id: "fullstack",
    title: "Full-Stack & Cloud Architecture",
    category: "Web & Enterprise",
    icon: Globe2,
    description: "Architecting responsive, high-concurrency web systems with modern React Server Components, secure relational schemas, and automated transactional workflows.",
    coreTech: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Neon Postgres",
      "Supabase (RLS)",
      "Drizzle ORM",
      "Prisma ORM",
      "Firebase",
      "Node.js",
      "Tailwind CSS v4",
      "Vercel Edge"
    ],
    capabilities: [
      "Server-rendered Next.js App Router architecture with streaming SSR",
      "Serverless PostgreSQL (Neon) & Supabase with Row-Level Security (RLS)",
      "Type-safe relational schema modeling & migrations with Drizzle & Prisma",
      "Real-time database subscriptions, webhooks, and state caching",
      "Automated invoice, billing ledger, and financial reporting modules"
    ],
    realWorldImpact: "Lead Developer of the Autoworx production ERP platform (autoworxcagayan.com), servicing live vehicle maintenance operations in Cagayan de Oro.",
    accentColor: "amber",
  },
  {
    id: "ai-vision",
    title: "AI & Computer Vision Systems",
    category: "Machine Learning & Vision",
    icon: BrainCircuit,
    description: "Engineering local and hybrid AI systems combining client-side WebGL computer vision, multi-point landmark estimation, and streaming LLM pipelines.",
    coreTech: [
      "Local LLMs (llama.rn / GGUF)",
      "LangGraph / ReAct Agents",
      "React Native & Expo",
      "MediaPipe (Face, Hands, Pose)",
      "TensorFlow.js",
      "Python",
      "LangChain",
      "WebGL Acceleration",
      "Google Gemini APIs"
    ],
    capabilities: [
      "100% on-device quantized LLM inference and cyclic ReAct agent tool execution",
      "Client-side 468-point 3D face mesh, skeletal pose, and dual-hand tracking",
      "Real-time 60 FPS gesture classification running 100% in-browser",
      "Hybrid offline-capable LLM pipelines, OCR gating, and biometric vault encryption",
      "Automated vehicle diagnostic and fault identification reasoning"
    ],
    realWorldImpact: "Creator of Pangly (100% on-device AI agent & vault, pangly.site), Multimodal AI Vision Lab (/vision), and Mekanik AI (mekanikai.vercel.app).",
    accentColor: "cyan",
  },
  {
    id: "embedded-iot",
    title: "Embedded Systems & IoT Telemetry",
    category: "Hardware & Firmware",
    icon: Cpu,
    description: "Developing bare-metal firmware, sensor acquisition networks, and bidirectional browser-hardware serial communication pipelines for low-power SoCs.",
    coreTech: [
      "ESP32 & ESP8266",
      "ESP32-C3 Super Mini",
      "Realtek BW16 (RTL8720DN)",
      "Arduino (Uno, Nano, Mega)",
      "Raspberry Pi & Linux",
      "Embedded C++",
      "Web Serial API",
      "MQTT & WebSockets",
      "nRF24L01+ RF"
    ],
    capabilities: [
      "Custom C++ firmware for Espressif and AVR microcontroller architectures",
      "Sensor telemetry acquisition (optical turbidity, ultrasonic, hall effect, pH)",
      "Real-time browser-to-hardware telemetry streaming via Web Serial",
      "2.4GHz RF wireless resilience analysis and low-power mesh links"
    ],
    realWorldImpact: "Published Lead Developer for ESP32 optical turbidity engine oil research presented at the 2025 International Conference in Japan.",
    accentColor: "emerald",
  },
  {
    id: "automotive",
    title: "Vehicle Tech & Workshop Systems",
    category: "Software & Diagnostics",
    icon: Car,
    description: "Developing specialized workshop management platforms, OBD-II diagnostic integrations, and sensor telemetry tools for automotive operations.",
    coreTech: [
      "OBD-II Protocols (ELM327)",
      "CAN Bus Architecture",
      "Optical Turbidity Sensing",
      "Automotive Sensor Arrays",
      "Workshop ERP Workflows",
      "Android Diagnostic Apps"
    ],
    capabilities: [
      "Workshop operations, job orders, inventory, and billing workflows",
      "OBD-II diagnostic trouble code (DTC) parsing and live telemetry",
      "Optical sensor telemetry for fluid degradation monitoring",
      "Preventive maintenance scheduling and digital service records"
    ],
    realWorldImpact: "Architected the Autoworx workshop management platform and created Mekanik AI for guided automotive troubleshooting.",
    accentColor: "purple",
  }
];

interface HardwareItem {
  name: string;
  desc: string;
  badge: string;
  imageUrl: string;
  videoUrl?: string;
  disclaimer?: string;
}

const hardwareBench: HardwareItem[] = [
  {
    name: "ESP32-C3 2.4GHz RF Jammer",
    desc: "2.4GHz ISM-band RF signal disruption & carrier flooding using nRF24L01+ via high-speed SPI",
    badge: "2.4GHz Pen-Testing",
    imageUrl: "/hardware/rf-jammer.webp",
    videoUrl: "https://vt.tiktok.com/ZSbgGek5q/",
    disclaimer: "Strictly for educational RF resilience testing in a controlled lab sandbox. RF jamming in public airspace is prohibited by telecommunications law.",
  },
  {
    name: "Realtek BW16 Dual-Band Deauther",
    desc: "2.4GHz & 5GHz 802.11 deauth frame injection with on-chip web GUI & LED attack telemetry",
    badge: "Wi-Fi Pen-Testing",
    imageUrl: "/hardware/wifi-deauther.webp",
    videoUrl: "https://vt.tiktok.com/ZSbgGXS3Y/",
    disclaimer: "For educational security research & 802.11w PMF defense testing only. Unauthorized frame injection on third-party networks is prohibited.",
  },
  {
    name: "ESP32 STT-to-TTS Voice Chatbot",
    desc: "Real-time speech-to-text (STT) and voice synthesis (TTS) conversational AI chatbot on ESP32 with OLED/TFT display",
    badge: "Voice AI Hardware",
    imageUrl: "/hardware/voice-chatbot.webp",
    videoUrl: "https://vt.tiktok.com/ZSbgGsXdr/",
  },
  {
    name: "AI-Assisted Robot Car (MCP)",
    desc: "Autonomous robotics platform controlled via Model Context Protocol (MCP) WebSockets with dual-motor PWM & ultrasonic sensing",
    badge: "MCP Robotics",
    imageUrl: "/hardware/robot-car.webp",
    videoUrl: "https://vt.tiktok.com/ZSbgGmPhp/",
  },
];

export default function TechStack() {
  const [activeTab, setActiveTab] = useState<string>("fullstack");
  const [inspectItem, setInspectItem] = useState<HardwareItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectItem(null);
    };
    if (inspectItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [inspectItem]);

  const selectedPillar = capabilityPillars.find(p => p.id === activeTab) || capabilityPillars[0];
  const Icon = selectedPillar.icon;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Layers size={13} />
            <span>Tech Stack &amp; Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Technical <span className="text-gradient-cyan">Capabilities</span>
          </h2>
        </div>
      </div>

      {/* Interactive Pillar Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {capabilityPillars.map((pillar, idx) => {
          const TabIcon = pillar.icon;
          const isActive = activeTab === pillar.id;
          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveTab(pillar.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden border ${
                isActive 
                  ? "bg-white dark:bg-slate-900/90 border-cyan-500/50 shadow-md dark:shadow-lg shadow-cyan-500/10" 
                  : "bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-amber-500" />
              )}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${isActive ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                  <TabIcon size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  {pillar.category}
                </span>
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-snug ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                  {pillar.title}
                </h3>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detailed Pillar Inspection Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPillar.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-200/80 dark:border-white/[0.08] shadow-xl dark:shadow-2xl relative overflow-hidden mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Pillar Deep Dive */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Icon size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">Focus Area</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedPillar.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {selectedPillar.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Competencies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPillar.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80">
                      <CheckCircle2 size={15} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 dark:text-slate-200 leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Application Badge */}
              <div className="p-4 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/20 flex items-start gap-3">
                <span className="text-cyan-700 dark:text-cyan-400 font-bold text-xs shrink-0 mt-0.5 uppercase tracking-wide">Practical Application:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedPillar.realWorldImpact}
                </p>
              </div>
            </div>

            {/* Right Tech Pill Grid */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <Terminal size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>Technologies &amp; Tools</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPillar.coreTech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
                    >
                      <TechLogo name={tech} size={15} className="w-4 h-4 shrink-0" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <a 
                  href="#projects" 
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors group"
                >
                  <span>View related projects</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Microcontroller & Hardware Bench Strip */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Hardware &amp; Prototyping Platforms
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {hardwareBench.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors group/hw"
            >
              <div>
                {/* Physical Workbench Thumbnail */}
                <button
                  type="button"
                  onClick={() => setInspectItem(item)}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-200/80 dark:border-white/[0.08] cursor-pointer group/img block text-left"
                  title={`Inspect workbench photo: ${item.name}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                  />
                  {/* Educational Warning Chip */}
                  {item.disclaimer && (
                    <div className="absolute top-2 left-2 z-10 text-[9px] font-bold text-amber-900 dark:text-amber-200 bg-amber-50/90 dark:bg-slate-950/85 backdrop-blur-xs px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-xs">
                      <ShieldAlert size={10} className="text-amber-600 dark:text-amber-400" />
                      <span>Educational Lab Only</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <span className="text-[10px] font-medium text-white flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      <Maximize2 size={10} />
                      <span>Inspect Photo</span>
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-2 mb-1.5">
                  <TechLogo name={item.name} size={14} className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">{item.desc}</p>
                {item.disclaimer && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400/90 font-medium">
                    <AlertTriangle size={10} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="truncate">For educational purposes only</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 w-fit shrink-0">
                  {item.badge}
                </span>
                {item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors shrink-0 group/video"
                    title={`Watch workbench demo: ${item.name}`}
                  >
                    <Play size={9} className="fill-current text-cyan-600 dark:text-cyan-400" />
                    <span>Watch Demo</span>
                    <ExternalLink size={9} className="opacity-60 group-hover/video:opacity-100" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hardware Photo Inspection Modal mounted via React Portal to document.body */}
      {mounted && createPortal(
        <AnimatePresence>
          {inspectItem && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              {/* Fullscreen Backdrop Blur covering entire window including sidebar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setInspectItem(null)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header - Always pinned at top */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TechLogo name={inspectItem.name} size={18} className="shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {inspectItem.name}
                      </h3>
                      <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                        {inspectItem.badge} • Physical Prototype Verification
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectItem(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                    aria-label="Close dialog"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="p-5 overflow-y-auto space-y-4">
                  {/* High-res Image Preview */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[42vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/[0.08] shrink-0">
                    <Image
                      src={inspectItem.imageUrl}
                      alt={inspectItem.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 520px"
                      className="object-cover object-center"
                      priority
                    />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {inspectItem.desc}
                  </p>

                  {/* Compliance / Educational Warning in Modal */}
                  {inspectItem.disclaimer && (
                    <div className="p-3.5 rounded-xl bg-amber-500/[0.08] dark:bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
                      <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          Research &amp; Legal Notice
                        </span>
                        <p className="text-[11px] text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">
                          {inspectItem.disclaimer}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Demo Action */}
                  {inspectItem.videoUrl && (
                    <div className="pt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Live bench test available
                      </span>
                      <a
                        href={inspectItem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                      >
                        <Play size={11} className="fill-current" />
                        <span>Watch Video Demo</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

