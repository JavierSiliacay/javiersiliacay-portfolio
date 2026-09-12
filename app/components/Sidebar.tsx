"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import {
  FolderGit2,
  Briefcase,
  Layers,
  User,
  Eye,
  Search,
  Mail,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  FileText,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";

interface SidebarProps {
  onOpenAsk: () => void;
}

const navItems = [
  { name: "Projects", href: "#projects", icon: FolderGit2 },
  { name: "Capabilities", href: "#capabilities", icon: Layers },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "About", href: "#about", icon: User },
  { name: "Vision Lab", href: "/vision", icon: Eye, badge: "Lab" },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Sidebar({ onOpenAsk }: SidebarProps) {
  const { themeMode, setThemeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent));
  }, []);

  return (
    <>
      {/* ─────────────── Desktop Fixed Left Sidebar (lg+) ─────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0c0c0f]/95 backdrop-blur-md px-6 py-7 lg:flex justify-between select-none">
        <div>
          {/* Brand Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono font-bold text-sm tracking-tight text-slate-900 dark:text-white hover:opacity-75 transition-opacity"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Javier Siliacay</span>
          </Link>
          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Software Dev &bull; AI Engineer
          </p>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-1.5 font-mono text-[13px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith("/");
              return isExternal ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={15} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    <span>{item.name}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={15} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    <span>{item.name}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="my-5 h-px bg-slate-200 dark:bg-white/[0.08]" />

          {/* Quick Actions: Ask Anything ⌘K */}
          <button
            type="button"
            onClick={onOpenAsk}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors font-mono text-[12px] group"
          >
            <span className="flex items-center gap-2">
              <Search size={14} className="text-cyan-500" />
              <span>Ask anything</span>
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded">
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <span>+</span>
              <kbd>K</kbd>
            </span>
          </button>

          {/* Resume link */}
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors font-mono text-[12px] group"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
              <span>Resume / CV</span>
            </span>
            <ArrowUpRight size={13} className="text-slate-400" />
          </Link>

          {/* Live Work Availability Pill */}
          <div className="mt-5 border-y border-slate-200 dark:border-white/[0.08] py-3.5">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Available</strong> for contracts &amp; new roles
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Theme Capsule & Email */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            {/* 3-way Theme Capsule */}
            <div className="theme-switch-capsule" role="group" aria-label="Theme mode switcher">
              <button
                type="button"
                onClick={() => setThemeMode("system")}
                className={`theme-opt-btn ${themeMode === "system" ? "is-active" : ""}`}
                title="System theme"
              >
                <Monitor size={12} />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`theme-opt-btn ${themeMode === "light" ? "is-active" : ""}`}
                title="Light theme"
              >
                <Sun size={12} />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`theme-opt-btn ${themeMode === "dark" ? "is-active" : ""}`}
                title="Dark theme"
              >
                <Moon size={12} />
              </button>
            </div>

            {/* LinkedIn icon link */}
            <a
              href="https://www.linkedin.com/in/javier-siliacay-37910b3bb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin size={15} />
            </a>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            For work, contracts &amp; inquiries:
          </p>
          <a
            href="mailto:siliacay.javier@gmail.com"
            className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate w-full"
          >
            <Mail size={13} className="shrink-0 text-cyan-500" />
            <span className="truncate">siliacay.javier@gmail.com</span>
          </a>
        </div>
      </aside>

      {/* ─────────────── Mobile Top Bar (below lg) ─────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c0c0f]/90 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="font-mono font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Javier Siliacay</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAsk}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ask AI"
            >
              <Search size={16} className="text-cyan-500" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0f] px-6 py-6 font-mono text-sm space-y-4">
            <div className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors py-1 flex items-center gap-2"
                >
                  <item.icon size={15} className="text-slate-400" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/[0.08]" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Theme</span>
              <div className="theme-switch-capsule">
                <button
                  onClick={() => setThemeMode("system")}
                  className={`theme-opt-btn ${themeMode === "system" ? "is-active" : ""}`}
                >
                  <Monitor size={12} />
                </button>
                <button
                  onClick={() => setThemeMode("light")}
                  className={`theme-opt-btn ${themeMode === "light" ? "is-active" : ""}`}
                >
                  <Sun size={12} />
                </button>
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`theme-opt-btn ${themeMode === "dark" ? "is-active" : ""}`}
                >
                  <Moon size={12} />
                </button>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              <a href="mailto:siliacay.javier@gmail.com" className="text-slate-900 dark:text-white font-mono">
                siliacay.javier@gmail.com
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
