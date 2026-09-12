"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Loader2, X, Bot, ArrowRight } from "lucide-react";

interface AskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What production systems has Javier built?",
  "Tell me about the Autoworx Enterprise ERP",
  "Tell me about his published IoT thesis in Japan",
  "What is his AI & Embedded tech stack?",
];

function renderFormattedContent(text: string) {
  return text.split("\n").map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const renderedLine = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <span key={lineIdx} className="block min-h-[1.25em]">
        {renderedLine}
      </span>
    );
  });
}

export default function AskOverlay({ isOpen, onClose }: AskOverlayProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am Javier Siliacay's AI assistant. Ask me anything about his production web platforms, in-browser computer vision lab, published research in Japan, or availability!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: ⌘K or Ctrl+K opens, Escape closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: queryText },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              last.content += text;
            }
            return next;
          });
        }
      }
    } catch {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Javier is a Full-Stack Software Developer & AI Engineer based in Cagayan de Oro, Philippines. He is the Lead Developer of Autoworx Enterprise ERP, creator of the in-browser Multimodal Vision Lab, and a published researcher at the Univ. of Aizu, Japan (2025). You can reach him directly at siliacay.javier@gmail.com.",
        },
      ]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xl transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[82vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c0c0f] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Bot size={17} />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Ask Javier Siliacay AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Trained on verified production projects, stack &amp; research
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 hidden sm:inline-block">
                  ESC to close
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-cyan-600 text-white rounded-tr-none shadow-xs"
                        : "bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    {renderFormattedContent(msg.content)}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/[0.08] flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-cyan-500" />
                    <span className="text-[11px] italic">Formulating verified answer...</span>
                  </div>
                </div>
              )}

              {/* Suggested Prompts (shown early in conversation) */}
              {messages.length <= 2 && !isLoading && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Terminal size={11} className="text-cyan-500" />
                    <span>Quick Prompts:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-cyan-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{prompt}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-slate-900/40"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about projects, stack, experience..."
                  className="w-full bg-white dark:bg-[#0c0c0f] border border-slate-200 dark:border-white/10 focus:border-cyan-500 rounded-xl pl-4 pr-11 py-3 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 disabled:opacity-30 transition-all"
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
