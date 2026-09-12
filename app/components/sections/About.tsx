"use client";

import {
  GraduationCap,
  Award,
  FileText,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Cpu,
  Globe2,
  BrainCircuit,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  description: string;
  highlights: string[];
}

const experienceData: ExperienceItem[] = [
  {
    period: "2025 — PRESENT",
    role: "Full-Stack Lead Developer & Systems Architect",
    organization: "Autoworx & Partner Companies",
    description:
      "Architecting, deploying, and managing the core software ecosystem across multiple commercial companies—including enterprise automotive ERP platforms, logistics dispatch suites, and AI diagnostic tools.",
    highlights: [
      "Architect and scale multi-tenant web platforms (Next.js, TypeScript, PostgreSQL, REST APIs) powering automotive shop operations and freight logistics",
      "Integrated custom AI Diagnostics Engine & automated financial pipelines, accelerating reporting and troubleshooting turnaround by 40%",
      "Engineered 20+ responsive web interfaces & role-based portals for dispatchers, mechanics, drivers, and enterprise admins",
      "Oversee database reliability, secure access policies (RLS), and real-time state sync across live commercial business workflows",
    ],
  },
  {
    period: "2025 (PUBLISHED)",
    role: "Lead Developer & Published Researcher",
    organization: "Univ. of Aizu, Japan (ICFSS-DLIIMST-ICSES-ICSSE 2025)",
    description:
      "Authored and presented thesis research on real-time automotive engine oil contamination monitoring using an ESP32 web server and optical turbidity sensing.",
    highlights: [
      "Engineered IoT firmware and telemetry streaming on ESP32 microcontroller",
      "Published in international peer-reviewed conference proceedings in Japan",
    ],
  },
  {
    period: "2024 — 2025",
    role: "Robotics Mentor & Hardware Trainer",
    organization: "USTP College of Technology Extension",
    description:
      "Mentored 20+ student teams in mechanical design, Arduino/ESP32 programming, and algorithmic navigation for the National Robotics Competition (NRC 2025).",
    highlights: [
      "Optimized sensor feedback and line-tracking PID control algorithms",
      "Led hardware assembly, schematic reading, and embedded systems bootcamps",
    ],
  },
];

const pillars = [
  {
    icon: Globe2,
    title: "Enterprise Full-Stack",
    desc: "Next.js 16 App Router, React 19, TypeScript, Supabase RLS, PostgreSQL, Prisma ORM, and high-concurrency cloud deployments.",
  },
  {
    icon: BrainCircuit,
    title: "AI & Computer Vision",
    desc: "Client-side WebGL acceleration, MediaPipe 3D Landmark estimation, on-device offline LLM inference, and streaming LangChain pipelines.",
  },
  {
    icon: Cpu,
    title: "Embedded Systems & IoT",
    desc: "Embedded C++, ESP32/ESP8266 architectures, Web Serial API, FreeRTOS task scheduling, optical spectrometry, and OBD-II diagnostics.",
  },
];

export default function About() {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <GraduationCap size={13} />
            <span>Background &amp; Verified Credibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineering <span className="text-gradient-cyan">Profile</span>
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed">
          Bridging the physical-digital divide with deep Autotronics foundation, full-stack software development, and AI engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Story & Career Timeline */}
        <div className="lg:col-span-7 space-y-8">
          {/* Engineering Narrative */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/[0.08] space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>The Intersection of Code, Hardware &amp; Intelligence</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Based in Cagayan de Oro, Philippines, I study{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                B.S. in Autotronics at USTP
              </strong>{" "}
              while architecting production full-stack software and AI systems.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              My engineering philosophy centers on{" "}
              <strong className="text-cyan-700 dark:text-cyan-400 font-semibold">
                real-world reliability
              </strong>
              . Rather than building isolated toy apps, I build systems that interface with physical reality—from embedded telemetry sensors and serial communication to production ERP web platforms and on-device computer vision models.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <MapPin size={14} className="text-cyan-600 dark:text-cyan-400" />
                <span>Cagayan de Oro, Philippines</span>
              </div>

              {/* USTP & Autotronics Program Logos */}
              <div className="flex items-center gap-2">
                <a
                  href="https://www.ustp.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-500/50 shadow-xs transition-all hover:scale-[1.03] group/ustp cursor-pointer"
                  title="University of Science and Technology of Southern Philippines (USTP)"
                >
                  <Image
                    src="/ustp.png"
                    alt="USTP Logo"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover/ustp:text-cyan-600 dark:group-hover/ustp:text-cyan-400 transition-colors">
                    USTP
                  </span>
                  <ExternalLink size={10} className="text-slate-400 group-hover/ustp:text-cyan-500 transition-colors" />
                </a>

                <a
                  href="https://www.ustp.edu.ph/cdeo/cot/bsautotronics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-500/50 shadow-xs transition-all hover:scale-[1.03] group/at cursor-pointer"
                  title="USTP College of Technology - B.S. in Autotronics"
                >
                  <Image
                    src="/at_logo.png"
                    alt="Autotronics Logo"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 tracking-tight group-hover/at:text-cyan-500 transition-colors">
                    Autotronics
                  </span>
                  <ExternalLink size={10} className="text-cyan-500/70 group-hover/at:text-cyan-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Career Milestones Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Career Timeline &amp; Experience
            </h4>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {experienceData.map((item, idx) => (
                <div key={idx} className="relative pl-9 group">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-500 group-hover:scale-125 transition-transform" />

                  <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/40 transition-all space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10">
                        {item.period}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.organization}
                      </span>
                    </div>

                    <h5 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <ul className="pt-2 space-y-1">
                      {item.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Pillars & Verified Credentials */}
        <div className="lg:col-span-5 space-y-6">
          {/* Engineering Pillars */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/[0.08] space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Core Engineering Pillars
            </h4>

            <div className="space-y-4">
              {pillars.map((pillar, pIdx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/[0.06] space-y-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <Icon size={16} />
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pillar.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic & Research Credentials */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <BookOpen size={18} />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Published Academic Thesis
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400 block">
                Presented in Japan &bull; June 2025
              </span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                &ldquo;Real-Time Monitoring of Engine Oil Contamination Using an ESP32-Based Web Server and Turbidity Sensing System&rdquo;
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Presented at the International Conference (ICFSS-DLIIMST-ICSES-ICSSE 2025), University of Aizu, Fukushima, Japan.
              </p>
            </div>

            {/* Resume Access Card */}
            <div className="pt-2">
              <Link
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md"
              >
                <FileText size={15} />
                <span>View Verified Resume &amp; Transcripts</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
