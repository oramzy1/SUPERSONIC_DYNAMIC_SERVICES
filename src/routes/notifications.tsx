import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ArrowLeft,
  Check,
  CheckSquare,
  Trash2,
  Truck,
  CreditCard,
  ShieldAlert,
  Inbox,
  Layers,
  FileText,
  RefreshCw,
  MessageSquare,
  X,
} from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: RouteComponent,
});

// Expanded strict categories to match your request
type CategoryType = "all" | "quotes" | "security" | "fleet" | "updates" | "messages";

interface Notification {
  id: string;
  category: Exclude<CategoryType, "all">;
  title: string;
  message: string;
  detailedContent?: string; // Additional contextual data for the right drawer
  time: string;
  unread: boolean;
}

const INITIAL_LOGS: Notification[] = [
  {
    id: "ntf-101",
    category: "fleet",
    title: "Moving Crew En Route",
    message: "Your primary moving truck for order #SDS-9821 has left the Amsterdam hub.",
    detailedContent:
      "Driver: Lars Bakker\nVehicle: Mercedes-Benz Actros (License: V-391-XX)\nETA: 08:30 CEST\nRoute Note: Moving crew has collected all heavy-duty packing crates and is navigating via the A4 highway detour.",
    time: "4 mins ago",
    unread: true,
  },
  {
    id: "ntf-102",
    category: "quotes",
    title: "New Custom Moving Quote Ready",
    message: "Your relocation request from Rotterdam to Utrecht has been itemized.",
    detailedContent:
      "Quote Reference: #Q-2026-892\nEstimated volume: 42 m³\nPremium Packing: Included\nTotal Calculated Fee: €1,450.00 (incl. BTW)\nThis rate is locked until June 25th, 2026.",
    time: "25 mins ago",
    unread: true,
  },
  {
    id: "ntf-103",
    category: "updates",
    title: "iDEAL Invoice Settlement Verified",
    message: "Payment confirmation successful for order balance #INV-004821.",
    detailedContent:
      "Transaction ID: TRX-99210481\nAmount Received: €850.00\nPayment Method: iDEAL (Rabobank)\nStatus: Fully settled. Digital transport clearance token pushed to driver manifest.",
    time: "42 mins ago",
    unread: true,
  },
  {
    id: "ntf-104",
    category: "messages",
    title: "Support Chat: Packing Assistance",
    message: "Support agent Sophie added a comment regarding fragile antique handling.",
    detailedContent:
      'Message text:\n"Hi! I\'ve updated your booking profile to flag the 19th-century grandfather clock. Our specialized fine-arts packing team will bring custom timber bracing on Friday morning."',
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "ntf-105",
    category: "fleet",
    title: "Route Optimization Completed",
    message: "Our routing system has updated your cross-provincial transit schedule.",
    detailedContent:
      "Operational update: Rerouted from A2 highway due to multi-vehicle collision near Den Bosch. New route planned via the A27 corridor. Transit duration variance: +12 minutes total.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: "ntf-106",
    category: "security",
    title: "Account Authorized via New Device",
    message: "A successful session login was processed from an unknown terminal near Utrecht.",
    detailedContent:
      "IP Address: 145.15.22.109\nBrowser: Chrome v144 / Windows 11\nTimestamp: 2026-06-17 00:14:11 CEST\nIf this was not you, please immediately cycle your access tokens in the Profile Settings.",
    time: "1 day ago",
    unread: false,
  },
];

function RouteComponent() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<CategoryType>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Filter core logic
  const displayedNotifications = notifications.filter(
    (n) => activeTab === "all" || n.category === activeTab,
  );

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop row click trigger
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    if (selectedNotification?.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, unread: false } : null));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (selectedNotification) {
      setSelectedNotification((prev) => (prev ? { ...prev, unread: false } : null));
    }
  };

  const deleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop row click trigger
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleRowClick = (log: Notification) => {
    setSelectedNotification(log);
    if (log.unread) {
      markAsRead(log.id);
    }
  };

  const getCategoryMeta = (category: Notification["category"]) => {
    switch (category) {
      case "fleet":
        return {
          icon: <Truck className="h-4 w-4" />,
          bg: "bg-[#8EA7FF]/10 text-[#8EA7FF]",
          label: "Fleet",
        };
      case "quotes":
        return {
          icon: <FileText className="h-4 w-4" />,
          bg: "bg-emerald-500/10 text-emerald-400",
          label: "Quotes",
        };
      case "updates":
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          bg: "bg-amber-500/10 text-amber-400",
          label: "Updates",
        };
      case "messages":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          bg: "bg-blue-500/10 text-blue-400",
          label: "Messages",
        };
      case "security":
        return {
          icon: <ShieldAlert className="h-4 w-4" />,
          bg: "bg-purple-500/10 text-purple-400",
          label: "Security",
        };
    }
  };

  const tabList: { id: CategoryType; label: string }[] = [
    { id: "all", label: "All Logs" },
    { id: "quotes", label: "Quotes" },
    { id: "security", label: "Security" },
    { id: "fleet", label: "Fleet" },
    { id: "updates", label: "Updates" },
    { id: "messages", label: "Messages" },
  ];

  return (
    <div className="min-h-dvh w-screen bg-[#0B0F14] text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b fixed top-0 border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-xs font-black tracking-tight text-white uppercase leading-tight">
            Supersonic <span className="text-[#8EA7FF]">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-slate-500 tracking-wide uppercase hidden xs:block mt-0.5">
            Operations Terminal • Live Customer Updates
          </span>
        </div>

        <Link
          to={"/" as any}
          className="text-xs font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* CORE WRAPPER - Splitting list and slide drawer view */}
      <div className="flex-1 w-full mt-14 flex overflow-hidden relative">
        {/* LEFT WORKSPACE: NOTIFICATION LIST */}
        <div
          className={`flex-1 overflow-y-auto px-4 py-8 flex justify-center items-start transition-all duration-300 ${selectedNotification ? "lg:mr-105" : ""}`}
        >
          <div className="w-full max-w-2xl bg-[#0F151C] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Context Heading */}
            <div className="p-5 sm:p-6 border-b border-white/5 bg-[#131A23] space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
                  <Bell className="h-4 w-4 text-[#8EA7FF]" />
                  Control Terminal Notifications
                  {unreadCount > 0 && (
                    <span className="bg-[#8EA7FF]/10 text-[#8EA7FF] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {unreadCount} New
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 max-w-md">
                  Review real-time status shifts, dispatch tracking, receipts, and user account
                  actions.
                </p>
              </div>

              {/* HORIZONTAL SWIPEABLE TABS FOR MOBILE & DESKTOP */}
              <div className="w-full overflow-x-auto scrollbar-none border-b border-white/5 flex items-center gap-1 pb-1">
                {tabList.map((tab) => {
                  const count =
                    tab.id === "all"
                      ? notifications.length
                      : notifications.filter((n) => n.category === tab.id).length;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedNotification(null); // Clear selected on tab change
                      }}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? "bg-[#8EA7FF]/10 text-[#8EA7FF] border border-[#8EA7FF]/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/2 border border-transparent"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isActive ? "bg-[#8EA7FF]/20" : "bg-white/5 text-slate-500"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Operations Row */}
            {displayedNotifications.length > 0 && (
              <div className="px-6 py-2 bg-[#090F15]/40 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-medium tracking-wide">
                <span>Showing {displayedNotifications.length} filter results</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 hover:text-[#8EA7FF] text-slate-400 transition"
                  >
                    <CheckSquare className="h-3 w-3" />
                    Mark all as read
                  </button>
                )}
              </div>
            )}

            {/* Notification Stream Feed */}
            <div className="divide-y divide-white/5 min-h-80 bg-[#0F151C]">
              {displayedNotifications.length > 0 ? (
                displayedNotifications.map((log) => {
                  const meta = getCategoryMeta(log.category);
                  const isFocused = selectedNotification?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => handleRowClick(log)}
                      className={`p-5 flex items-start gap-4 transition-all relative group cursor-pointer ${
                        isFocused
                          ? "bg-[#8EA7FF]/5"
                          : log.unread
                            ? "bg-[#8EA7FF]/2 hover:bg-[#8EA7FF]/4"
                            : "hover:bg-white/1"
                      }`}
                    >
                      {log.unread && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8EA7FF]" />
                      )}

                      <div className={`p-2 rounded-lg shrink-0 ${meta?.bg}`}>{meta?.icon}</div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3
                            className={`text-xs font-bold leading-snug tracking-tight ${log.unread ? "text-white" : "text-slate-300"}`}
                          >
                            {log.title}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap shrink-0">
                            {log.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 max-w-xl">
                          {log.message}
                        </p>
                      </div>

                      {/* Explicit Interactive Actions */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        {log.unread && (
                          <button
                            type="button"
                            onClick={(e) => markAsRead(log.id, e)}
                            title="Mark as read"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-white/10 rounded-md transition"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => deleteNotification(log.id, e)}
                          title="Dismiss record"
                          className="p-1.5 text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-white/10 rounded-md transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-300">Category Feed Clear</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      No matching events logged under the current category layer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT DRAWER: SEAMLESS RESPONSIVE SLIDE-IN SLOT */}
        <div
          className={`fixed lg:absolute top-14 lg:top-0 right-0 h-[calc(100vh-56px)] lg:h-full w-full sm:w-105 bg-[#111822] border-l border-white/10 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
            selectedNotification ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedNotification && (
            <>
              {/* Drawer Top Branding */}
              <div className="p-5 border-b border-white/5 bg-[#151D29] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md text-xs font-semibold ${getCategoryMeta(selectedNotification.category)?.bg}`}
                  >
                    {getCategoryMeta(selectedNotification.category)?.icon}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    {getCategoryMeta(selectedNotification.category)?.label} Protocol
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Text Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8EA7FF] font-semibold tracking-wide font-mono bg-[#8EA7FF]/10 px-2 py-0.5 rounded">
                    {selectedNotification.id.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Logged event: {selectedNotification.time}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#0B0F14] border border-white/5 text-xs text-slate-300 leading-relaxed">
                  {selectedNotification.message}
                </div>

                {selectedNotification.detailedContent && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                      Manifest & Detailed Context
                    </h4>
                    <pre className="p-4 rounded-lg bg-[#141C28] text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap border border-white/5 overflow-x-auto">
                      {selectedNotification.detailedContent}
                    </pre>
                  </div>
                )}
              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="p-4 bg-[#151D29] border-t border-white/5 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => deleteNotification(selectedNotification.id, e)}
                  className="flex-1 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Dismiss Record
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
