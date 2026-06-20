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
}

function SupportChatPage() {
  const [activeSession, setActiveSession] = useState<string>("session-1");
  const [selectedChannel, setSelectedChannel] = useState<"ALL" | "fleet" | "ai" | "billing">("ALL");
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "Active Fleet Dispatch #041",
      subtitle: "Route optimization check near Amsterdam",
      type: "fleet",
      status: "active",
      time: "Just now",
    },
    {
      id: "session-2",
      title: "Supersonic Virtual Assistant",
      subtitle: "Automated instant quote calculation help",
      type: "ai",
      status: "active",
      time: "20 min ago",
    },
    {
      id: "session-3",
      title: "Invoice settlement (NL804...)",
      subtitle: "iDEAL transaction compliance verify",
      type: "billing",
      status: "resolved",
      time: "Yesterday",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "agent",
      text: "Goedemorgen! This is Lars from Supersonic Ground Control. I have your active cargo telemetry open on my console. Are you looking to update the offloading times for your Amsterdam route tomorrow?",
      timestamp: "10:43 AM",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: `m-user-${Date.now()}`,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-auto-${Date.now()}`,
          sender: "agent",
          text: "Acknowledged. Updating route telemetry profiles now. Please hold steady.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const handleConfirmCloseChat = () => {
    setShowCloseModal(false);
    console.log("Chat connection securely terminated by user request.");
  };

  const filteredSessions = sessions.filter(
    (s) => selectedChannel === "ALL" || s.type === selectedChannel,
  );

  const activeSessionData = sessions.find((s) => s.id === activeSession);

  return (
    <div className="h-dvh w-screen bg-[#0B0F14] text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* BRAND MASTER TOPBAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-3 sm:px-4 shrink-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile sidebar toggle — visible only on small screens */}
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
              Global Operations Control Panel
            </span>
          </div>
        </div>

        {/* Support Channel Meta Badge Indicators */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 border-r border-white/5 pr-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[11px]">System Status: Nominal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Node:</span>
            <span className="font-mono text-[11px] text-slate-300">AMS-CORE-01</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowCloseModal(true)}
            className="text-[10px] sm:text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 sm:px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition flex items-center gap-1 sm:gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Close Chat</span>
          </button>

          <Link
            to="/dashboard"
            className="text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1 sm:gap-1.5 transition"
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
                <MessageSquare className="h-4 w-4 text-[#8EA7FF]" />
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
                placeholder="Search tags..."
                className="w-full rounded-xl border border-white/5 bg-white/4 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Quick Filter Channel Pill Selectors */}
          <div className="px-3 sm:px-4 py-2.5 border-b border-white/5 flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
            {[
              { key: "ALL", label: "All", icon: null, activeClass: "bg-[#8EA7FF] text-slate-900" },
              {
                key: "fleet",
                label: "Fleet",
                icon: <Truck className="h-2.5 w-2.5" />,
                activeClass: "bg-[#8EA7FF] text-slate-900",
              },
              {
                key: "ai",
                label: "AI",
                icon: <Bot className="h-2.5 w-2.5" />,
                activeClass: "bg-purple-500 text-white",
              },
              {
                key: "billing",
                label: "Bills",
                icon: <Zap className="h-2.5 w-2.5" />,
                activeClass: "bg-amber-500 text-slate-900",
              },
            ].map(({ key, label, icon, activeClass }) => (
              <button
                key={key}
                onClick={() => setSelectedChannel(key as typeof selectedChannel)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md transition flex items-center gap-1 shrink-0 ${
                  selectedChannel === key
                    ? activeClass
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Session Threads Queue */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.map((session) => {
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
                      {session.type === "fleet" && (
                        <Truck className="h-3.5 w-3.5 text-[#8EA7FF] shrink-0" />
                      )}
                      {session.type === "ai" && (
                        <Bot className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      )}
                      {session.type === "billing" && (
                        <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold truncate">{session.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium shrink-0">
                      {session.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 pl-5">{session.subtitle}</p>

                  {session.status === "active" && (
                    <span className="absolute top-3 right-3 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Security Compliance Badge */}
          <div className="p-3 border-t border-white/5 bg-[#090F15] flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-[#8EA7FF] shrink-0" />
            <span className="truncate">SLS E2EE Link Active</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: FULL-HEIGHT PRIMARY CHAT WORKSPACE */}
        <main className="flex-1 flex flex-col h-full bg-[#0B1015]/20 overflow-hidden min-w-0">
          {/* Active Conversation Topbar */}
          <div className="px-3 sm:px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#0F151C]/40 backdrop-blur-md shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#8EA7FF]/10 text-[#8EA7FF] flex items-center justify-center font-mono text-xs sm:text-sm font-bold border border-white/5 shrink-0">
                SD
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 flex-wrap leading-tight">
                  Lars van der Meer
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium uppercase tracking-wider">
                    Dispatch Expert
                  </span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400 shrink-0" />
                  <span className="truncate">Ground Operations Queue</span>
                </p>
              </div>
            </div>

            <Link
              to="/ticket"
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 bg-white/4 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition text-slate-300 hover:text-white shrink-0 whitespace-nowrap"
            >
              File Ticket
            </Link>
          </div>

          {/* Scrolling Messages Stream */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 space-y-4">
            {messages.map((msg) => {
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
                        : "bg-[#8EA7FF]/10 border-white/5 text-[#8EA7FF]"
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
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
                      {isUser && <CheckCheck className="h-3 w-3 text-[#8EA7FF]" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
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
              <span className="font-mono italic">Lars is parsing route payloads...</span>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Secure Message Submission Console Dock */}
          <div className="px-3 sm:px-4 py-3 border-t border-white/10 bg-[#0F151C]/60 backdrop-blur-md shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 max-w-5xl mx-auto w-full"
            >
              <button
                type="button"
                onClick={() => console.log("Invoking attachment protocols...")}
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
                placeholder="Send a response..."
                className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/4 py-2.5 sm:py-3 px-3 sm:px-4 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
              />

              <CTAButton
                variant="primary"
                type="submit"
                style={{ backgroundColor: "var(--primary)" }}
                className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl text-slate-900 transition hover:opacity-95 active:scale-95"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" />
              </CTAButton>
            </form>

            <div className="mt-1.5 text-center text-[8px] sm:text-[9px] text-slate-600 uppercase tracking-wider font-mono hidden sm:block">
              Supersonic Systems Operations Division • Telemetry Node Connected
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
                  Closing Support Connection?
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Action requires absolute confirmation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-white/2 border border-white/5 rounded-xl p-3 leading-relaxed">
              By closing this support session, you agree that all details and dispatch logistics
              regarding this route setup have been fully resolved.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={() => setShowCloseModal(false)}
                className="w-full sm:flex-1 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 py-2.5 rounded-xl transition"
              >
                Stay / Continue Chatting
              </button>
              <Link to="/" className="w-full sm:flex-1">
              <button
                onClick={handleConfirmCloseChat}
                className="w-full sm:flex-1 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl transition shadow-lg shadow-rose-500/10"
              >
                Confirm & Close
              </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
