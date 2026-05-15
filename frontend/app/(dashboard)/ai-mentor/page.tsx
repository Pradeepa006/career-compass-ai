"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2, Bot, User, Plus, Trash2, Sparkles } from "lucide-react";
import { chatbotApi } from "@/lib/api";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What career path is best for a React developer?",
  "How do I transition into AI/ML engineering?",
  "What skills should I learn to increase my salary by 30%?",
  "How do I prepare for a system design interview?",
  "What certifications are most valuable for cloud computing?",
  "How do I negotiate a higher salary?",
];

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content?: string) => {
    const text = (content || input).trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await chatbotApi.sendMessage({ message: text, session_id: sessionId });
      setSessionId(data.session_id);
      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I apologize, I'm having trouble responding right now. Please try again in a moment.", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => { setMessages([]); setSessionId(null); };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Career Mentor</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-gray-400 text-sm">GPT-4 powered · Always available · Career expertise</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your AI Career Mentor</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">Ask me anything about careers, skills, interviews, salary negotiations, or learning paths.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-left p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:border-violet-500/30 hover:text-violet-300 hover:bg-violet-500/5 text-xs transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      msg.role === "user" ? "bg-violet-500/30" : "bg-gradient-to-br from-violet-500 to-purple-600"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-violet-300" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>

                    {/* Bubble */}
                    <div className={cn("max-w-[75%] space-y-1", msg.role === "user" ? "items-end" : "items-start")}>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-violet-600/30 border border-violet-500/30 text-white rounded-tr-sm"
                          : "bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm"
                      )}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      <div className={cn("text-[10px] text-gray-600 px-1", msg.role === "user" ? "text-right" : "text-left")}>
                        {formatRelativeTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-violet-500/40 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your career mentor anything... (Press Enter to send)"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder-gray-600 outline-none max-h-32"
              style={{ height: "auto", minHeight: "20px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/30"
            >
              {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
          <p className="text-[10px] text-gray-700 text-center mt-2">AI responses are for guidance only. Always verify important career decisions.</p>
        </div>
      </div>
    </div>
  );
}
