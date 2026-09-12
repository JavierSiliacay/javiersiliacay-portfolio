"use client";

import { ArrowUp, Linkedin, Facebook, Instagram, Mail, Eye } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#02050c] text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Tagline */}
        <div className="text-center md:text-left space-y-1">
          <a href="#" className="text-lg font-black tracking-tight text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            JAVIER<span className="text-cyan-600 dark:text-cyan-400">.</span>
          </a>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Software Developer &bull; AI Engineer &bull; IoT Enthusiast &bull; USTP Autotronics
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <a href="#capabilities" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Capabilities</a>
          <a href="#projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#experience" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Experience</a>
          <a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</a>
          <Link href="/vision" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Eye size={11} className="text-cyan-600 dark:text-cyan-400" />
            <span>Vision Lab</span>
          </Link>
          <Link href="/resume" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Resume</Link>
          <a href="#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        {/* Back to top & Socials */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a 
              href="https://www.linkedin.com/in/javier-siliacay-37910b3bb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent shadow-xs"
              title="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
            <a 
              href="https://www.facebook.com/siliacayjavier/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent shadow-xs"
              title="Facebook"
            >
              <Facebook size={15} />
            </a>
            <a 
              href="https://www.instagram.com/itsyaboi_vier" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent shadow-xs"
              title="Instagram"
            >
              <Instagram size={15} />
            </a>
            <a 
              href="mailto:siliacay.javier@gmail.com" 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent shadow-xs"
              title="Email"
            >
              <Mail size={15} />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center gap-1 text-xs font-semibold shadow-xs"
            title="Scroll to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {currentYear} Javier Siliacay. All rights reserved.</p>
      </div>
    </footer>
  );
}

