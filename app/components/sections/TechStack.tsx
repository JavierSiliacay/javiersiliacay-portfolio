"use client";

import { useState } from "react";
import { 
  Globe2, 
  BrainCircuit, 
  Cpu, 
  Car, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Terminal
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
      "Supabase (RLS)",
      "Prisma ORM",
      "Firebase",
      "Node.js",
      "Tailwind CSS v4",
      "Vercel Edge"
    ],
    capabilities: [
      "Server-rendered Next.js App Router architecture with streaming SSR",
      "PostgreSQL schemas with Row-Level Security (RLS) & Prisma ORM",
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
      "MediaPipe (Face, Hands, Pose)",
      "OpenCV",
      "TensorFlow / TensorFlow.js",
      "Python",
      "LangChain",
      "OpenAI APIs",
      "WebGL Acceleration",
      "Google Gemini APIs"
    ],
    capabilities: [
      "Client-side 468-point 3D face mesh, skeletal pose, and dual-hand tracking",
      "Real-time 60 FPS gesture classification running 100% in-browser",
      "Hybrid offline-capable LLM pipelines and RAG query structures",
      "Automated vehicle diagnostic and fault identification reasoning"
    ],
    realWorldImpact: "Creator of the Multimodal AI Vision Lab (/vision) and Mekanik AI diagnostic assistant (mekanikai.vercel.app).",
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

const hardwareBench = [
  { name: "ESP32-C3 Super Mini", desc: "RISC-V 160MHz SoC with Wi-Fi & BLE 5.0", badge: "Low-Power IoT" },
  { name: "Realtek BW16 (RTL8720DN)", desc: "Dual-band 2.4G/5G Wi-Fi & BLE combo module", badge: "Dual-Band RF" },
  { name: "Arduino Mega 2560 & Uno", desc: "54 digital I/O pins, 16 analog inputs, AVR core", badge: "Hardware Bench" },
  { name: "ESP32 Dual-Core", desc: "240MHz Xtensa LX6, Wi-Fi web server & telemetry", badge: "IoT Core" },
];

export default function TechStack() {
  const [activeTab, setActiveTab] = useState<string>("fullstack");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hardwareBench.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <TechLogo name={item.name} size={14} className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{item.desc}</p>
              </div>
              <span className="mt-3 text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 w-fit">
                {item.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

