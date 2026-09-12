"use client";

import { useState } from "react";
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Linkedin, 
  Facebook, 
  Instagram,
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare
} from "lucide-react";

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "Full-Stack Web App",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailAddress = "siliacay.javier@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    // Construct mailto link
    const subject = encodeURIComponent(`[Project Inquiry: ${formState.projectType}] from ${formState.name}`);
    const body = encodeURIComponent(
      `Hello Javier,\n\nName: ${formState.name}\nEmail: ${formState.email}\nProject Type: ${formState.projectType}\n\nProject Scope & Details:\n${formState.message}\n\nSent from Portfolio Contact Form`
    );
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, "_blank");
    setFormSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <MessageSquare size={13} />
            <span>Direct Inquiries &amp; Collaboration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Let&apos;s Build Something <span className="text-gradient-cyan">Exceptional</span>
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
          Available for contract engineering, full-stack web platforms, AI integration, and technical leadership roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Inquiries & Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Contact Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/[0.08] space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Direct Contact Channels</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Have a project scope, contract opportunity, or architectural question? Reach out directly:
              </p>
            </div>

            {/* Email Copy Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Primary Email</p>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-200 truncate">{emailAddress}</p>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check size={16} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Availability & Turnaround Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                <Clock size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Typical response time: <strong>&lt; 24 hours</strong></span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                <MapPin size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Cagayan de Oro, Philippines &bull; <strong>Remote Worldwide</strong></span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                <Phone size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>+63 997 837 9342</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Verified Profiles</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href="https://www.linkedin.com/in/javier-siliacay-37910b3bb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.facebook.com/siliacayjavier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Facebook size={14} />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/itsyaboi_vier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Instagram size={14} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/[0.08] shadow-xl dark:shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send an Inquiry</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
              Fill in your project requirements below to initiate a direct conversation.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Project Domain / Focus Area
                </label>
                <select
                  value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none transition-colors shadow-xs"
                >
                  <option value="Full-Stack Web App">Full-Stack Web Platform (Next.js / Supabase / Cloud)</option>
                  <option value="AI & Computer Vision">AI / Computer Vision Solution (TensorFlow / MediaPipe)</option>
                  <option value="IoT & Hardware Telemetry">Embedded Systems / IoT Diagnostics (ESP32 / Serial)</option>
                  <option value="Automotive Software ERP">Automotive ERP / Diagnostics Software</option>
                  <option value="Engineering Consultation">Consultation or Full-Time Opportunity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Project Scope &amp; Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Describe what you want to build, timelines, and technical goals..."
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors resize-none shadow-xs"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail size={12} className="text-cyan-600 dark:text-cyan-400" />
                  <span>Opens direct pre-filled email client</span>
                </p>

                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 hover:from-cyan-500 hover:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-500 text-white dark:text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Send size={14} />
                  <span>Send Project Inquiry</span>
                </button>
              </div>

              {formSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center">
                  Email client opened! You can also copy my email directly if you prefer.
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

