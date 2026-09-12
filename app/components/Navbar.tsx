"use client";

import { useState, useEffect } from "react";
import { Linkedin, Facebook, Mail, Menu, X, FileText, Eye, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "Capabilities", href: "#capabilities" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/javier-siliacay-37910b3bb", name: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/siliacayjavier/", name: "Facebook" },
  { icon: Mail, href: "mailto:siliacay.javier@gmail.com", name: "Email" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-3.5 ${
        scrolled 
          ? "bg-white/85 dark:bg-[#030712]/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] shadow-lg shadow-black/5 dark:shadow-black/40 py-3" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Status */}
        <div className="flex items-center gap-3">
          <a href="#" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 group">
            <span>JAVIER</span>
            <span className="text-cyan-600 dark:text-cyan-400 group-hover:scale-125 transition-transform inline-block">.</span>
            <span className="text-xs font-mono font-normal text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-2 py-0.5 rounded-full ml-2 hidden sm:inline-block">
              Software Dev &bull; AI
            </span>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wider uppercase"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/vision"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all"
          >
            <Eye size={12} />
            <span>Vision Lab</span>
          </Link>
        </div>

        {/* Socials, Theme Toggle & CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3">
            {socials.map((social) => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg"
                title={social.name}
              >
                <social.icon size={17} />
              </a>
            ))}
          </div>

          <ThemeToggle />

          <div className="flex items-center gap-2.5">
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-lg transition-all flex items-center gap-1.5"
            >
              <FileText size={13} className="text-cyan-600 dark:text-cyan-400" />
              <span>Resume</span>
            </Link>
            <a
              href="#contact"
              className="px-4 py-1.5 text-xs font-bold text-white dark:text-slate-950 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 hover:from-cyan-500 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-blue-400 rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Send size={12} />
              <span>Let&apos;s Talk</span>
            </a>
          </div>
        </div>

        {/* Mobile Toggle & Theme switcher */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="/vision"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20"
          >
            <Eye size={11} />
            <span>Vision</span>
          </Link>
          <button 
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 rounded-2xl bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800/80 my-1" />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} className="text-cyan-600 dark:text-cyan-400" />
                  <span>Resume</span>
                </Link>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-xs font-bold text-center text-white dark:text-slate-950 bg-cyan-600 dark:bg-cyan-400 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Contact Me</span>
                </a>
              </div>

              <div className="flex items-center justify-around pt-3 border-t border-slate-200 dark:border-slate-800/80">
                {socials.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 text-xs p-1.5"
                  >
                    <social.icon size={16} />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

