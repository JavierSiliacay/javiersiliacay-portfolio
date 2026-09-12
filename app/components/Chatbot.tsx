"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot, Terminal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "What production systems has Javier built?",
  "Tell me about the Autoworx Enterprise ERP",
  "Tell me about his published IoT thesis in Japan",
  "What is his AI & Embedded tech stack?"
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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hi! I am Javier Siliacay's AI assistant. Feel free to ask me anything about his production platforms, in-browser vision lab, published research in Japan, or availability!" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: queryText }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API response status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream error");

      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        if (textChunk) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            const last = updated[lastIdx];
            if (last && last.role === "assistant") {
              updated[lastIdx] = { ...last, content: last.content + textChunk };
            }
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I'm currently unable to connect to the live AI endpoint. Please feel free to email Javier directly at siliacay.javier@gmail.com!" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 group font-bold"
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <MessageSquare size={19} />
            <span className="text-xs hidden sm:inline-block pr-1">Ask AI</span>
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] max-h-[80vh] flex flex-col bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/[0.12] shadow-2xl rounded-3xl overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
                  <Bot size={19} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Javier Siliacay AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Interactive Knowledge Assistant</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/70 dark:bg-[#030712]/90 text-xs">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-medium rounded-tr-none shadow-xs" 
                        : "bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/[0.08] shadow-xs"
                    }`}
                  >
                    {renderFormattedContent(msg.content)}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xs">
                    <Loader2 size={14} className="animate-spin text-amber-500 dark:text-amber-400" />
                    <span className="text-[11px] italic">Formulating verified response...</span>
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <Terminal size={11} className="text-cyan-500 dark:text-cyan-400" />
                    <span>Suggested Questions</span>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendQuery(prompt)}
                        className="text-left p-2 rounded-xl bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-xs"
                      >
                        &rarr; {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-900/90">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my projects, stack, research..."
                  className="w-full bg-white dark:bg-[#030712] border border-slate-200 dark:border-slate-800 focus:border-amber-500/60 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 p-1.5 rounded-lg text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 disabled:opacity-40 transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

