"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChatGemIcon, SparkleIcon, SendIcon, CloseIcon, MinimizeIcon,
} from "@/components/ui/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello, gorgeous! 💎 I'm Lexa, your personal Luxella stylist. I'm here to help you find the perfect jewelry — whether it's for yourself or as a gift. What are you looking for today?",
};

const quickReplies = [
  "Show me necklaces",
  "Best earrings for a wedding?",
  "Return policy?",
  "Shipping info",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen]               = useState(false);
  const [messages, setMessages]           = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef                    = useRef<HTMLDivElement>(null);
  const inputRef                          = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMsg: Message       = { role: "user", content: text };
    const updatedMessages        = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const bot: Message = {
        role: "assistant",
        content: data.message || "I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, bot]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble. Email us at support@luxella.com 💎" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Floating Button ────────────────────────────────────────── */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open Lexa AI Chat"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #C8A96A 0%, #8B6914 100%)" }}
      >
        {/* Outer glow ring */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-[#C8A96A] opacity-20 animate-ping" />
            <span className="absolute -inset-1 rounded-3xl border border-[#C8A96A]/30 animate-pulse" />
          </>
        )}

        {/* Icon */}
        <span className="relative z-10 transition-transform duration-300">
          {isOpen ? (
            <CloseIcon size={20} className="text-white" />
          ) : (
            <ChatGemIcon size={22} className="text-white" />
          )}
        </span>

        {/* New message badge */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
            !
          </span>
        )}
      </button>

      {/* ── Chat Panel ─────────────────────────────────────────────── */}
      <div
        className={[
          "fixed bottom-28 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none",
        ].join(" ")}
        style={{ maxHeight: "580px" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1c1205 100%)" }}
        >
          <div className="flex items-center gap-3">
            {/* Lexa avatar */}
            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
              >
                <SparkleIcon size={18} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#111]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">Lexa</p>
              <p className="text-[#C8A96A] text-[10px] uppercase tracking-widest">Luxella AI Stylist</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Online
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Minimize"
            >
              <MinimizeIcon size={13} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex flex-col gap-3 p-4 overflow-y-auto bg-[#F8F5F2]"
          style={{ height: "330px" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={["flex gap-2 items-end", msg.role === "user" ? "justify-end" : "justify-start"].join(" ")}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  <SparkleIcon size={12} className="text-white" />
                </div>
              )}

              <div
                className={[
                  "max-w-[78%] px-4 py-3 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-[#111] text-white rounded-2xl rounded-br-sm"
                    : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100",
                ].join(" ")}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-500">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2 items-end">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
              >
                <SparkleIcon size={12} className="text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && (
          <div className="px-4 py-2.5 bg-[#F8F5F2] flex flex-wrap gap-2 border-t border-gray-100">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[11px] bg-white border border-[#C8A96A]/40 text-[#8B6914] rounded-full px-3 py-1.5 hover:bg-gradient-to-r hover:from-[#C8A96A] hover:to-[#8B6914] hover:text-white hover:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask Lexa anything…"
            disabled={loading}
            className="flex-1 text-sm bg-gray-50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] border border-gray-200 placeholder-gray-400 transition-all duration-200 disabled:opacity-60"
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            aria-label="Send"
          >
            <SendIcon size={15} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
