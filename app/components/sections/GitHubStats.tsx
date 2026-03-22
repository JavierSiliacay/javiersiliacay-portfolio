"use client";

import { Github } from "lucide-react";

const stats = [
  { label: "Repositories", value: "20+" },
  { label: "Commits (2025)", value: "500+" },
  { label: "Languages", value: "C++, TypeScript, Python" },
  { label: "Focus", value: "Embedded + Full-Stack" },
];

export default function GitHubStats() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
        <span className="w-1 h-8 bg-primary-500 rounded-full" /> GitHub Activity
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
      <a
        href="https://github.com/javiersiliacay"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 text-slate-200 rounded-full font-medium transition-colors"
      >
        <Github size={20} /> View Full Profile
      </a>
    </section>
  );
}
