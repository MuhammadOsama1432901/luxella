"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
    "Hello, gorgeous! 💎 I'm Lexa, your personal Luxella stylist. I'm here to help you find the perfect jewelry — whether it's for yourself or a special celebration. What style are you looking for today?",
};

const quickReplies = [
  "Show me necklaces",
  "Rings collection",
  "Anniversary gifts",
  "Return & shipping policy",
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
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Email us at osamaafzal1432901@gmail.com 💎" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Parses markdown links like [Text](/url) into React Next.js Link components
  function parseMessageContent(content: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, text, url] = match;
      const index = match.index;

      if (index > lastIndex) {
        parts.push(content.substring(lastIndex, index));
      }

      const isInternal = url.startsWith("/");
      if (isInternal) {
        parts.push(
          <Link
            key={index}
            href={url}
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsOpen(false);
              }
            }}
            className="text-[#C8A96A] hover:underline font-bold transition-colors duration-300"
          >
            {text}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C8A96A] hover:underline font-bold transition-colors duration-300"
          >
            {text}
          </a>
        );
      }

      lastIndex = index + fullMatch.length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  }

  return (
    <>
      {/* ── Floating Button ────────────────────────────────────────── */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open Lexa AI Chat"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #C8A96A 0%, #8B6914 100%)",
          boxShadow: "0 10px 30px rgba(200, 169, 106, 0.35)",
        }}
      >
        {/* Outer glow ring */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-[#C8A96A] opacity-25 animate-ping" />
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
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-[#111] flex items-center justify-center text-white text-[9px] font-bold">
            !
          </span>
        )}
      </button>

      {/* ── Chat Panel (Glassmorphic dark luxury redesign) ─────────────── */}
      <div
        className={[
          "fixed bottom-28 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden border",
          "transition-all duration-300 origin-bottom-right",
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none",
        ].join(" ")}
        style={{
          maxHeight: "580px",
          background: "rgba(18, 18, 18, 0.85)",
          borderColor: "rgba(200, 169, 106, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4.5 flex items-center justify-between border-b"
          style={{
            background: "linear-gradient(135deg, rgba(13,13,13,0.95) 0%, rgba(28,18,5,0.95) 100%)",
            borderColor: "rgba(200, 169, 106, 0.15)",
          }}
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
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                Lexa
              </p>
              <p className="text-[#C8A96A] text-[9px] uppercase tracking-widest font-semibold">
                Luxella AI Stylist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Active
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#C8A96A] hover:bg-white/5 transition-all"
              aria-label="Minimize"
            >
              <MinimizeIcon size={13} />
            </button>
          </div>
        </div>

        {/* Messages list (Dark themed viewport) */}
        <div
          className="flex flex-col gap-4 p-4 overflow-y-auto"
          style={{
            height: "330px",
            background: "linear-gradient(to bottom, rgba(10, 10, 10, 0.98), rgba(6, 6, 6, 0.99))",
          }}
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
                  "max-w-[78%] px-4 py-3 text-xs leading-relaxed shadow-lg border",
                  msg.role === "user"
                    ? "text-black rounded-2xl rounded-br-none font-medium"
                    : "text-gray-300 rounded-2xl rounded-bl-none",
                ].join(" ")}
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, #C8A96A, #E2C97E)",
                        borderColor: "transparent",
                      }
                    : {
                        background: "rgba(255, 255, 255, 0.03)",
                        borderColor: "rgba(200, 169, 106, 0.1)",
                      }
                }
              >
                {parseMessageContent(msg.content)}
              </div>

              {msg.role === "user" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[9px] font-bold border"
                  style={{
                    background: "rgba(200, 169, 106, 0.05)",
                    borderColor: "rgba(200, 169, 106, 0.2)",
                    color: "#C8A96A",
                  }}
                >
                  Me
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
              <div
                className="rounded-2xl rounded-bl-none px-4 py-3.5 flex gap-1.5 items-center shadow-lg border"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(200, 169, 106, 0.1)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies (Dark gold buttons) */}
        {messages.length <= 2 && (
          <div
            className="px-4 py-3 flex flex-wrap gap-2 border-t"
            style={{
              background: "rgba(8, 8, 8, 0.99)",
              borderColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[10px] rounded-xl px-3.5 py-2 transition-all duration-300 font-bold border cursor-pointer hover:scale-[1.03] active:scale-100"
                style={{
                  background: "rgba(200, 169, 106, 0.04)",
                  borderColor: "rgba(200, 169, 106, 0.18)",
                  color: "#C8A96A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C8A96A";
                  e.currentTarget.style.background = "linear-gradient(135deg, #C8A96A, #8B6914)";
                  e.currentTarget.style.color = "#000000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.18)";
                  e.currentTarget.style.background = "rgba(200, 169, 106, 0.04)";
                  e.currentTarget.style.color = "#C8A96A";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div
          className="px-4 py-3 flex items-center gap-2 border-t"
          style={{
            background: "rgba(13, 13, 13, 0.99)",
            borderColor: "rgba(200, 169, 106, 0.15)",
          }}
        >
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask Lexa anything..."
            disabled={loading}
            className="flex-1 text-xs rounded-xl px-4 py-3 outline-none border transition-all duration-300 disabled:opacity-50"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.4)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #C8A96A, #8B6914)",
              boxShadow: "0 4px 12px rgba(200, 169, 106, 0.2)",
            }}
            aria-label="Send"
          >
            <SendIcon size={14} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
