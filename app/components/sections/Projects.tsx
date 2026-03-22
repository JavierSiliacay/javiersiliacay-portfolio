"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "autoworx-system",
    description: "Vehicle repair appointment booking and management system with real-time tracking, cost management, and admin dashboard.",
    tech: ["TypeScript", "Next.js", "Supabase"],
    link: "https://github.com/JavierSiliacay/autoworx-system",
    stars: 0,
  },
  {
    title: "Circuito-AI",
    description: "A browser-based hardware development environment featuring an Automotive Diagnostic Station, real-time serial telemetry, and an AI Specialist for advanced vehicle and IoT debugging.",
    tech: ["TypeScript", "Next.js", "AI", "IoT"],
    link: "https://github.com/JavierSiliacay/Circuito-AI",
    stars: 0,
  },
  {
    title: "Mini-Solar-and-Wind-Hybrid-Charging-System",
    description: "Hybrid renewable-energy monitoring system powered by solar and wind sources with infrared sensors, lithium-ion battery storage, and real-time monitoring.",
    tech: ["Arduino", "Sensors", "Energy"],
    link: "https://github.com/JavierSiliacay/Mini-Solar-and-Wind-Hybrid-Charging-System",
    stars: 0,
  },
  {
    title: "Fire-Gas-Detection-with-Automated-Bin-Level-Alert",
    description: "Smart multi-sensor system that detects fire, gas levels, and bin capacity in real time. Automatic safety responses with alerts.",
    tech: ["Arduino", "Sensors", "IoT"],
    link: "https://github.com/JavierSiliacay/Fire-Gas-Detection-with-Automated-Bin-Level-Alert",
    stars: 1,
  },
  {
    title: "TFT-WebServer-RPMGauge",
    description: "ESP32-based Honda Civic RPM gauge using ultrasonic sensor and 2.4\" TFT display. Features real-time RPM visualization and WiFi web interface.",
    tech: ["ESP32", "Arduino C++", "WebServer"],
    link: "https://github.com/JavierSiliacay/TFT-WebServer-RPMGauge",
    stars: 0,
  },
  {
    title: "EMF-Detector",
    description: "Arduino-based EMF detector visualizing EMF levels on an OLED as a dynamic wave. Includes LED and buzzer alerts for low/medium/high readings.",
    tech: ["Arduino", "OLED", "Sensors"],
    link: "https://github.com/JavierSiliacay/EMF-Detector",
    stars: 2,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
        <span className="w-1 h-8 bg-primary-500 rounded-full" /> Featured Projects
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative flex flex-col p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-primary-500/50 transition-all hover:shadow-xl hover:shadow-primary-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex-1">
              <h3 className="text-xl font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mt-6 flex items-center justify-between">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium text-sm"
              >
                View Project <ExternalLink size={14} />
              </a>
              {project.stars > 0 && (
                <span className="text-slate-500 text-sm flex items-center gap-1">
                  ★ {project.stars}
                </span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
