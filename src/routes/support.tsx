import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  Paperclip,
  ArrowLeft,
  Circle,
  Truck,
  Bot,
  User,
  CheckCheck,
  Zap,
  Menu,
  SlidersHorizontal,
  X,
  LogOut,
  Inbox,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/support")({
  component: SupportChatPage,
});

interface Message {
  id: string;
  sender: "user" | "agent" | "system";
  text: string;
  timestamp: string;
  isRead?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  subtitle: string;
  type: "fleet" | "billing" | "ai";
  status: "active" | "resolved";
  time: string;
  agentName?: string;
  agentRole?: string;
}

function SupportChatPage() {
  // No sessions yet — wire this up to your support/chat API and populate on load.
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<"ALL" | "fleet" | "ai" | "billing">("ALL");
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // No messages yet — load the active session's thread from your backend here.
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // No session picked yet — start one on the fly so the person can message
    // support directly instead of being forced to select from the sidebar first.
    // Replace this with a real "create conversation" call to your backend.
    let sessionId = activeSession;
    if (!sessionId) {
      sessionId = `session-${Date.now()}`;
      const newSession: ChatSession = {
        id: sessionId,
        title: "New conversation",
        subtitle: "Direct message",
        type: "ai",
        status: "active",
        time: "Just now",
        agentName: "Support Agent",
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(sessionId);
    }

    const newMessage: Message = {
      id: `m-user-${Date.now()}`,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Placeholder response flow — replace with your real-time channel (websocket, polling, etc.)
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
    }, 1500);
  };

  const handleConfirmCloseChat = () => {
    setShowCloseModal(false);
    // Hook up session-close call to your backend here.
  };

  const filteredSessions = sessions.filter(
    (s) => selectedChannel === "ALL" || s.type === selectedChannel,
  );

  const activeSessionData = sessions.find((s) => s.id === activeSession);

  const channelIcon = (type: ChatSession["type"], className: string) => {
    if (type === "fleet") return <Truck className={className} />;
    if (type === "ai") return <Bot className={className} />;
    return <Zap className={className} />;
  };

  return (
    <div className="h-dvh w-screen bg-[#0B0F14] text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* BRAND MASTER TOPBAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-3 sm:px-4 shrink-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile sidebar toggle - visible only on small screens */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white border border-white/5 rounded-lg bg-white/3 shrink-0 mr-1"
            aria-label="Open channels"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex flex-col min-w-0">
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-white uppercase leading-tight truncate">
              Supersonic <span className="text-primary">Dynamic Services B.V.</span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono tracking-wider uppercase hidden xs:block">
              Support &amp; Operations
            </span>
          </div>
        </div>

        {/* Support Channel Meta Badge Indicators */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 border-r border-white/5 pr-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">System status: Nominal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowCloseModal(true)}
            className="text-[10px] sm:text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 sm:px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition flex items-center gap-1 sm:gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Close chat</span>
          </button>

          <Link
            to="/dashboard"
            className="text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1 sm:gap-1.5 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* CORE CHAT WRAPPER SPACE */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        {/* MOBILE SIDEBAR BACKGROUND OVERLAY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-14 bg-black/70 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* LEFT COLUMN: MULTI-CHANNEL TRAFFIC SIDEBAR */}
        <aside
          className={`
            w-72 sm:w-64 shrink-0 border-r border-white/10 bg-[#0F151C] flex flex-col h-full
            fixed md:static top-14 bottom-0 left-0 z-25 md:z-auto transition-transform duration-300 transform
            ${isSidebarOpen ? "translate-x-0 shadow-2xl shadow-black/60" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Header Controls */}
          <div className="p-3 sm:p-4 border-b border-white/5 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Channels
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-1 text-slate-400 hover:text-white bg-white/5 rounded-lg transition"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
              <input
                type="text"
                disabled
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-white/5 bg-white/4 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Quick Filter Channel Pill Selectors */}
          <div className="px-3 sm:px-4 py-2.5 border-b border-white/5 flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
            {[
              {
                key: "ALL",
                label: "All",
                icon: null,
                activeClass: "bg-primary text-primary-foreground",
              },
              {
                key: "fleet",
                label: "Fleet",
                icon: <Truck className="h-2.5 w-2.5" />,
                activeClass: "bg-primary text-primary-foreground",
              },
              {
                key: "ai",
                label: "AI",
                icon: <Bot className="h-2.5 w-2.5" />,
                activeClass: "bg-purple-500 text-white",
              },
              {
                key: "billing",
                label: "Billing",
                icon: <Zap className="h-2.5 w-2.5" />,
                activeClass: "bg-amber-500 text-slate-900",
              },
            ].map(({ key, label, icon, activeClass }) => (
              <button
                key={key}
                onClick={() => setSelectedChannel(key as typeof selectedChannel)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md transition flex items-center gap-1 shrink-0 ${
                  selectedChannel === key ? activeClass : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Session Threads Queue */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const isActive = activeSession === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSession(session.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 relative ${
                      isActive
                        ? "bg-white/5 border border-white/10 text-white"
                        : "border border-transparent text-slate-400 hover:bg-white/3 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {channelIcon(
                          session.type,
                          `h-3.5 w-3.5 shrink-0 ${
                            session.type === "fleet"
                              ? "text-primary"
                              : session.type === "ai"
                                ? "text-purple-400"
                                : "text-amber-400"
                          }`,
                        )}
                        <span className="text-xs font-semibold truncate">{session.title}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium shrink-0">
                        {session.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 pl-5">
                      {session.subtitle}
                    </p>

                    {session.status === "active" && (
                      <span className="absolute top-3 right-3 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-2.5 py-14 px-6 text-center">
                <div className="w-9 h-9 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center text-slate-500">
                  <Inbox className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-slate-500 max-w-40">
                  No conversations yet. New sessions will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Security Compliance Badge */}
          <div className="p-3 border-t border-white/5 bg-[#090F15] flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">End-to-end encrypted connection</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: FULL-HEIGHT PRIMARY CHAT WORKSPACE */}
        <main className="flex-1 flex flex-col h-full bg-[#0B1015]/20 overflow-hidden min-w-0">
          {/* Active Conversation Topbar */}
          <div className="px-3 sm:px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#0F151C]/40 backdrop-blur-md shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono text-xs sm:text-sm font-bold border border-white/5 shrink-0">
                SD
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 flex-wrap leading-tight">
                  {activeSessionData?.agentName ?? "Support"}
                  {activeSessionData?.agentRole && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium uppercase tracking-wider">
                      {activeSessionData.agentRole}
                    </span>
                  )}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {activeSessionData?.title ?? "Send a message to start a conversation"}
                  </span>
                </p>
              </div>
            </div>

            <Link
              to="/ticket"
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 bg-white/4 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition text-slate-300 hover:text-white shrink-0 whitespace-nowrap"
            >
              File ticket
            </Link>
          </div>

          {/* Scrolling Messages Stream */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    } max-w-[90%] sm:max-w-[75%] md:max-w-xl`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center border ${
                        isUser
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-primary/10 border-white/5 text-primary"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Truck className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                          isUser
                            ? "bg-white/5 border border-white/10 text-white rounded-tr-none"
                            : "bg-[#141C25] border border-white/5 text-slate-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-[9px] text-slate-500 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <span>{msg.timestamp}</span>
                        {isUser && <CheckCheck className="h-3 w-3 text-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2.5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-semibold text-slate-300">Start a conversation</p>
                <p className="text-[11px] text-slate-500 max-w-56">
                  Type a message below to reach support directly, or pick an existing conversation
                  from the sidebar.
                </p>
              </div>
            )}

            {/* Typing Indicator */}
            {isAgentTyping && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-9">
                <span className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1 w-1 bg-slate-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
                <span className="font-mono italic">Agent is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Secure Message Submission Console Dock — always available */}
          <div className="px-3 sm:px-4 py-3 border-t border-white/10 bg-[#0F151C]/60 backdrop-blur-md shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 max-w-5xl mx-auto w-full"
            >
              <button
                type="button"
                className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl border border-white/5 bg-white/4 text-slate-400 hover:text-white transition"
                aria-label="Attach documents"
              >
                <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                required
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/4 py-2.5 sm:py-3 px-3 sm:px-4 text-xs text-white placeholder-slate-600 outline-none transition focus:border-primary focus:bg-white/6"
              />

              <CTAButton
                variant="primary"
                type="submit"
                className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl text-primary-foreground transition hover:opacity-95 active:scale-95"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </CTAButton>
            </form>

            <div className="mt-1.5 text-center text-[8px] sm:text-[9px] text-slate-600 uppercase tracking-wider font-mono hidden sm:block">
              Supersonic Dynamic Services · Secure support channel
            </div>
          </div>
        </main>
      </div>

      {/* POPUP CONFIRMATION MODAL CARD */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#0F151C] border border-white/15 rounded-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                  Close this conversation?
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-white/2 border border-white/5 rounded-xl p-3 leading-relaxed">
              Closing this session confirms your issue has been resolved. You can always start a new
              conversation later.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={() => setShowCloseModal(false)}
                className="w-full sm:flex-1 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 py-2.5 rounded-xl transition"
              >
                Stay in chat
              </button>
              <button
                onClick={handleConfirmCloseChat}
                className="w-full sm:flex-1 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl transition shadow-lg shadow-rose-500/10"
              >
                Confirm & close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
