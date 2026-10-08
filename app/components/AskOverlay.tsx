"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Send,
  Loader2,
  X,
  Bot,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

interface AskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I am Javier Siliacay's AI assistant. Ask me anything about his production web platforms, on-device AI agents & local LLM pipelines, embedded hardware & robotics, or published research in Japan!",
};

const FALLBACK_ANSWER =
  "Javier is a Full-Stack Software Developer & AI Engineer based in Cagayan de Oro, Philippines. He is the Lead Developer of Autoworx Enterprise ERP, creator of the on-device AI tools at Pangly, and a published researcher at the Univ. of Aizu, Japan (2025). You can reach him directly at siliacay.javier@gmail.com.";

const suggestedQuestions = [
  "What production systems has Javier built?",
  "How does Pangly run AI 100% on-device?",
  "Tell me about the Autoworx Enterprise ERP",
  "Tell me about his published IoT thesis in Japan",
];

function getActionChips(content: string) {
  const chips: { label: string; href: string; icon: string }[] = [];
  const lower = content.toLowerCase();

  if (lower.includes("autoworx") || lower.includes("autoworxcagayan.com")) {
    chips.push({
      label: "Autoworx ERP",
      href: "https://autoworxcagayan.com",
      icon: "🌐",
    });
  }
  if (lower.includes("pangly") || lower.includes("pangly.site")) {
    chips.push({
      label: "Pangly AI",
      href: "https://pangly.site",
      icon: "🛡️",
    });
  }
  if (
    lower.includes("siliacay.javier@gmail.com") ||
    lower.includes("email") ||
    lower.includes("reach him")
  ) {
    chips.push({
      label: "Email Javier",
      href: "mailto:siliacay.javier@gmail.com",
      icon: "✉️",
    });
  }
  return chips;
}

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
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isBusy, setIsBusy] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const isBusyRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
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

  // Cleanup pending fetch on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaitingResponse, isBusy]);

  const handleResetChat = () => {
    if (isBusyRef.current) return;
    abortControllerRef.current?.abort();
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const handleCopy = async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSend = async (queryText: string) => {
    const trimmed = queryText.trim();
    // Synchronous guard immediately rejects spamming / double-submission
    if (!trimmed || isBusyRef.current) return;

    isBusyRef.current = true;
    setIsBusy(true);
    setIsWaitingResponse(true);

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      setIsWaitingResponse(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let accumulatedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) {
          accumulatedText += text;
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
              next[lastIdx] = { ...next[lastIdx], content: accumulatedText };
            }
            return next;
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User closed or reset chat
        return;
      }
      setIsWaitingResponse(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: FALLBACK_ANSWER,
        },
      ]);
    } finally {
      setIsWaitingResponse(false);
      setIsBusy(false);
      isBusyRef.current = false;
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
                    {isBusy ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-normal border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-normal border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Trained on verified production projects, stack &amp; research
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetChat}
                  disabled={isBusy || messages.length <= 1}
                  title="Reset chat"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs select-text">
              {messages.map((msg, idx) => {
                const isAssistant = msg.role === "assistant";
                const isCurrentlyStreamingThis =
                  isBusy && !isWaitingResponse && idx === messages.length - 1 && isAssistant;
                const actionChips =
                  isAssistant && !isCurrentlyStreamingThis ? getActionChips(msg.content) : [];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`relative group max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        !isAssistant
                          ? "bg-cyan-600 text-white rounded-tr-none shadow-xs"
                          : "bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/[0.08]"
                      }`}
                    >
                      {renderFormattedContent(msg.content)}
                      {isCurrentlyStreamingThis && (
                        <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-500 animate-pulse align-middle" />
                      )}

                      {/* Copy button for assistant responses */}
                      {isAssistant && msg.content && !isCurrentlyStreamingThis && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.content, idx)}
                          title="Copy message"
                          className="absolute -top-2 -right-2 p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          {copiedIdx === idx ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Quick action chips if mentioned */}
                    {actionChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                        {actionChips.map((chip, cIdx) => (
                          <a
                            key={cIdx}
                            href={chip.href}
                            target={chip.href.startsWith("http") ? "_blank" : undefined}
                            rel={chip.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-[10px] font-mono transition-colors"
                          >
                            <span>{chip.icon}</span>
                            <span>{chip.label}</span>
                            {chip.href.startsWith("http") && (
                              <ExternalLink size={10} className="opacity-70" />
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isWaitingResponse && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/[0.08] flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-cyan-500" />
                    <span className="text-[11px] font-mono italic">
                      Formulating verified answer...
                    </span>
                  </div>
                </div>
              )}

              {/* Suggested Prompts (shown early in conversation) */}
              {messages.length <= 2 && (
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
                        disabled={isBusy}
                        onClick={() => !isBusy && handleSend(prompt)}
                        className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-cyan-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-white/[0.06] hover:border-cyan-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-50 dark:disabled:hover:bg-slate-900/60 disabled:hover:border-slate-200/80 dark:disabled:hover:border-white/[0.06] disabled:hover:text-slate-700 dark:disabled:hover:text-slate-300"
                      >
                        <span className="truncate">{prompt}</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity shrink-0 ml-1"
                        />
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
                if (!isBusy && input.trim()) {
                  handleSend(input);
                }
              }}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-slate-900/40"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  disabled={isBusy}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isBusy
                      ? "AI is generating an answer... Please wait"
                      : "Ask anything about projects, stack, experience..."
                  }
                  className="w-full bg-white dark:bg-[#0c0c0f] border border-slate-200 dark:border-white/10 focus:border-cyan-500 rounded-xl pl-4 pr-11 py-3 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100/70 dark:disabled:bg-slate-900/70"
                />
                <button
                  type="submit"
                  disabled={isBusy || !input.trim()}
                  className="absolute right-2 p-2 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title={isBusy ? "AI is generating an answer" : "Send message"}
                >
                  {isBusy ? (
                    <Loader2 size={15} className="animate-spin text-cyan-500" />
                  ) : (
                    <Send size={15} />
                  )}
                </button>
              </div>
              {isBusy && (
                <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center sm:text-left flex items-center justify-center sm:justify-start gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  AI is generating an answer — inputs temporarily locked to avoid spamming
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

