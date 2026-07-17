import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfile } from "../types";
import { MessageSquareCode, Send, X, Loader2, Sparkles, Smile, Bot, Compass } from "lucide-react";

interface FloatingMentorProps {
  userProfile: UserProfile | null;
  localizationLanguage: string;
}

export default function FloatingMentor({ userProfile, localizationLanguage }: FloatingMentorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        localizationLanguage === "Spanish"
          ? `¡Hola! Soy tu Mentor Ascend AI. Estoy aquí para resolver tus dudas sobre tu hoja de ruta, darte consejos para entrevistas o sugerirte trucos para tus proyectos de portafolio. ¿En qué te puedo asesorar hoy?`
          : `Hello! I am your Ascend AI Career Mentor. I'm here to answer questions about your study roadmap, give resume tips, or review code structures for your portfolio challenges. How can I guide you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatHistory: messages.slice(-10), // Send last 10 messages for context
          userMessage: userMsg.content,
          userProfile,
          localizationLanguage
        })
      });

      if (!response.ok) throw new Error("Failed to consult AI Mentor");
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Fallback response
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: "I'm processing your active goals. To successfully bridge that skill gap, focus on building small deliverables weekly. Is there any specific concept in your roadmap you'd like me to explain?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Expanded chat drawer */}
      {isOpen ? (
        <div className="w-85 sm:w-96 h-[480px] bg-[#0F0F0F] border border-white/15 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-up">
          {/* Header */}
          <header className="bg-[#0A0A0A] border-b border-white/5 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif italic text-xs text-white">Ascend AI Career Mentor</h3>
                <span className="text-[9px] text-[#D4AF37] flex items-center gap-1 font-mono">
                  ● Active Advisor (Gemini)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/40 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isAssistant ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}
                >
                  {isAssistant && (
                    <div className="p-1 bg-white/5 border border-white/10 rounded-lg text-[#D4AF37] h-fit text-xs shrink-0 mt-0.5">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <div
                      className={`text-xs p-3 rounded-2xl leading-relaxed break-words ${
                        isAssistant
                          ? "bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-sm font-medium"
                          : "bg-[#D4AF37] text-[#0A0A0A] rounded-tr-sm font-semibold"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[8px] font-mono text-white/30 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto text-left">
                <div className="p-1 bg-white/5 border border-white/10 rounded-lg text-[#D4AF37] h-fit text-xs shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-3 rounded-2xl rounded-tl-sm text-white/40 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-xs italic font-sans">Consulting career agents...</span>
                </div>
              </div>
            )}
            <div ref={endOfChatRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-[#0F0F0F] flex gap-2">
            <input
              type="text"
              required
              disabled={loading}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={localizationLanguage === "Spanish" ? "Haz una pregunta a tu mentor..." : "Ask your mentor any career query..."}
              className="flex-1 text-xs px-3 py-2 border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/[0.01] text-white rounded-xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-white/5 disabled:text-white/40 text-[#0A0A0A] rounded-xl transition-all shadow-lg shadow-[#D4AF37]/5 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4 text-[#0A0A0A]" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Button trigger */
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-[#0F0F0F] hover:bg-[#D4AF37] border border-white/10 text-white hover:text-[#0A0A0A] rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] rounded-full border-2 border-[#0A0A0A] animate-pulse" />
          <MessageSquareCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold pr-1">Ask AI Mentor</span>
        </button>
      )}
    </div>
  );
}
