"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import AskOverlay from "./AskOverlay";

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="min-h-screen relative bg-[rgb(var(--bg))] text-[rgb(var(--ink))] transition-colors duration-400">
      {/* Page-wide Halftone Backdrop (Bryl Lim signature texture) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[75vh] w-[65vw] opacity-15 dark:opacity-20" />
        <div className="halftone mask-bl absolute bottom-0 left-0 h-[65vh] w-[55vw] opacity-15 dark:opacity-15" />
      </div>

      {/* Fixed Left Sidebar (Desktop) + Mobile Top Bar */}
      <Sidebar onOpenAsk={() => setAskOpen(true)} />

      {/* Global ⌘K Ask Anything Modal */}
      <AskOverlay isOpen={askOpen} onClose={() => setAskOpen(false)} />

      {/* Main Content Area (Offset for Desktop Left Sidebar) */}
      <main className="relative z-10 lg:pl-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
