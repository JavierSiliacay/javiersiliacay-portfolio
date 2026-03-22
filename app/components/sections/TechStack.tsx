"use client";

import { Code, Cpu, Server } from "lucide-react";

const techStack = [
  { name: "TypeScript", icon: Code },
  { name: "Next.js", icon: Server },
  { name: "Supabase", icon: Server },
  { name: "Arduino", icon: Cpu },
  { name: "ESP32", icon: Cpu },
  { name: "C/C++", icon: Code },
  { name: "Python", icon: Code },
  { name: "MQTT", icon: Code },
  { name: "Tailwind CSS", icon: Code },
  { name: "OpenCV", icon: Code },
  { name: "TensorFlow Lite", icon: Code },
  { name: "Raspberry Pi", icon: Cpu },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
        <span className="w-1 h-8 bg-primary-500 rounded-full" /> Tech Arsenal
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {techStack.map((tech) => {
          const Icon = tech.icon;
          return (
            <div
              key={tech.name}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary-500/50 transition-colors"
            >
              <Icon size={20} className="text-primary-400" />
              <span className="text-slate-200">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
