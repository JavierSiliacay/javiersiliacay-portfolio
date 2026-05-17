"use client";

import { MapPin, Cpu, Code, Server, FileText, Download } from "lucide-react";
import AnimatedCppCode from "../AnimatedCppCode";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto w-full">
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          I&apos;m a passionate developer from the Philippines, currently studying at <strong className="text-primary-400">University of Science and Technology of Southern Philippines (USTP)</strong>, focused on building intelligent systems that combine embedded electronics, full-stack web platforms, and AI-driven automotive solutions.
        </p>
        <p>
          My work spans from Arduino / ESP-based hardware systems to production-grade full-stack applications using Next.js, Supabase, TypeScript, and modern AI integrations.
        </p>
        <p>
          I enjoy designing systems where hardware and software work together — from sensors and real-time diagnostics to complete automotive service platforms deployed on the web.
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4 mt-8">
        <h3 className="text-xl font-semibold text-primary-400">Quick Facts</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-2">
            <MapPin size={16} className="text-primary-400" />
            Cagayan de Oro, Philippines
          </li>
          <li className="flex items-center gap-2">
            <Cpu size={16} className="text-primary-400" />
            B.S. Autotronics, USTP
          </li>
          <li className="flex items-center gap-2">
            <Code size={16} className="text-primary-400" />
            Full-Stack + Embedded
          </li>
          <li className="flex items-center gap-2">
            <Server size={16} className="text-primary-400" />
            IoT & Cloud Integrations
          </li>
        </ul>
        <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
          <AnimatedCppCode speed={50} />
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex flex-wrap gap-4 items-center justify-between">
          <span className="text-sm text-slate-400 font-medium">Looking for my full background?</span>
          <div className="flex gap-3">
            <Link href="/resume" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all hover:scale-105 flex items-center gap-1.5 shadow-md shadow-primary-500/10">
              <FileText size={14} /> View Interactive Resume
            </Link>
            <a href="/Javier_Siliacay_Resume.pdf" download="Javier_Siliacay_Resume.pdf" className="px-4 py-2 text-xs rounded-lg border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-all hover:scale-105 flex items-center gap-1.5">
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
