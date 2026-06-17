import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ArrowLeft,
  Check,
  CheckSquare,
  Trash2,
  Truck,
  ShieldAlert,
  Inbox,
  FileText,
  RefreshCw,
  MessageSquare,
  X,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: RouteComponent,
});

type CategoryType = "all" | "quotes" | "security" | "fleet" | "updates" | "messages";

interface Notification {
  id: string;
  category: Exclude<CategoryType, "all">;
  title: string;
  message: string;
  detailedContent?: string;
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

  const displayedNotifications = notifications.filter(
    (n) => activeTab === "all" || n.category === activeTab,
  );

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  const handleRowClick = (log: Notification) => {
    setSelectedNotification(log);
    if (log.unread) markAsRead(log.id);
  };

  const getCategoryMeta = (category: Notification["category"]) => {
    switch (category) {
      case "fleet":
        return {
          icon: <Truck className="h-3.5 w-3.5" />,
          bg: "bg-[#8EA7FF]/10 text-[#8EA7FF]",
          dot: "bg-[#8EA7FF]",
          label: "Fleet",
        };
      case "quotes":
        return {
          icon: <FileText className="h-3.5 w-3.5" />,
          bg: "bg-emerald-500/10 text-emerald-400",
          dot: "bg-emerald-400",
          label: "Quotes",
        };
      case "updates":
        return {
          icon: <RefreshCw className="h-3.5 w-3.5" />,
          bg: "bg-amber-500/10 text-amber-400",
          dot: "bg-amber-400",
          label: "Updates",
        };
      case "messages":
        return {
          icon: <MessageSquare className="h-3.5 w-3.5" />,
          bg: "bg-blue-500/10 text-blue-400",
          dot: "bg-blue-400",
          label: "Messages",
        };
      case "security":
        return {
          icon: <ShieldAlert className="h-3.5 w-3.5" />,
          bg: "bg-violet-500/10 text-violet-400",
          dot: "bg-violet-400",
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
    <div className="min-h-dvh w-screen bg-[#080C12] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* ── TOPBAR ── */}
      <header className="h-14 w-full fixed top-0 z-30 bg-[#0C1218]/90 backdrop-blur-md border-b border-white/6 flex items-center justify-between px-5 sm:px-7 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black tracking-tight text-white uppercase leading-tight">
              Supersonic <span>Dynamic Services B.V.</span>
            </span>
            <span className="text-[9px] text-slate-500 tracking-widest uppercase hidden sm:block mt-0.5">
              Operations Terminal · Live Customer Updates
            </span>
          </div>
        </div>
        <Link
          to={"/" as any}
          className="text-[11px] font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1.5 transition-colors shrink-0 ml-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </header>

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="flex flex-1 mt-14 overflow-hidden">
        {/* ── LEFT: FEED ── */}
        <div
          className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
            selectedNotification ? "lg:mr-95" : ""
          }`}
        >
          {/* Panel header */}
          <div className=" border-b border-white/6 px-5 pt-5 pb-0 shrink-0">
            <div className="flex items-center gap-2.5 mb-1">
              <Bell className="h-4 w-4 text-[#8EA7FF]" />
              <h1 className="text-sm font-bold text-white tracking-tight">
                Control Terminal Notifications
              </h1>
              {unreadCount > 0 && (
                <span className=" border border-[#8EA7FF]/20 text-[#8EA7FF] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono tracking-wide">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Real-time status shifts, dispatch tracking, receipts, and account actions.
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0">
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
                      setSelectedNotification(null);
                    }}
                    className={`relative px-3 py-2 text-[11px] font-semibold rounded-t-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? "bg-[#8EA7FF]/10 text-[#8EA7FF] border-t border-x border-[#8EA7FF]/20 border-b-transparent -mb-px pb-2.25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/3 border border-transparent"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[10px] px-1.5 py-px rounded font-mono ${
                        isActive ? "bg-[#8EA7FF]/20 text-[#8EA7FF]" : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolbar row */}
          {displayedNotifications.length > 0 && (
            <div className="px-5 py-2 bg-[#060A10]/60 border-b border-white/4 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">
                Showing {displayedNotifications.length} results
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-[#8EA7FF] transition-colors"
                >
                  <CheckSquare className="h-3 w-3" />
                  Mark all as read
                </button>
              )}
            </div>
          )}

          {/* Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/4">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((log) => {
                const meta = getCategoryMeta(log.category);
                const isFocused = selectedNotification?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className={`group relative flex items-start gap-3.5 px-5 py-4 cursor-pointer transition-all duration-100 ${
                      isFocused
                        ? "bg-[#8EA7FF]/6"
                        : log.unread
                          ? "bg-[#8EA7FF]/2 hover:bg-[#8EA7FF]/4"
                          : "hover:bg-white/1.5"
                    }`}
                  >
                    {/* Unread accent */}
                    {log.unread && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8EA7FF] rounded-r" />
                    )}

                    {/* Icon */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${meta?.bg}`}
                    >
                      {meta?.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span
                          className={`text-[12px] font-semibold leading-snug tracking-tight ${
                            log.unread ? "text-white" : "text-slate-400"
                          }`}
                        >
                          {log.title}
                        </span>
                        <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0 mt-0.5">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {log.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                      {log.unread && (
                        <button
                          type="button"
                          onClick={(e) => markAsRead(log.id, e)}
                          title="Mark as read"
                          className="w-6.5 h-6.5 flex items-center justify-center rounded-sm border border-white/[0.07] bg-white/3 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/8 transition-all"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => deleteNotification(log.id, e)}
                        title="Dismiss"
                        className="w-6.5 h-6.5 flex items-center justify-center rounded-sm border border-white/[0.07] bg-white/3 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/8 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-center">
                <div className="w-11 h-11 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center text-slate-500">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Category Feed Clear</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    No matching events logged under the current category layer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: DETAIL SIDEBAR ── */}
        <div
          className={`fixed lg:absolute right-0 top-14 lg:top-0 h-[calc(100dvh-56px)] lg:h-full w-full sm:w-95 bg-[#0A0F17] border-l border-white/6 z-40 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
            selectedNotification ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedNotification ? (
            <>
              {/* Drawer header */}
              <div className="h-12 px-4 flex items-center justify-between border-b border-white/6 bg-[#0C1320] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6.5 h-6.5 rounded-sm flex items-center justify-center ${getCategoryMeta(selectedNotification.category)?.bg}`}
                  >
                    {getCategoryMeta(selectedNotification.category)?.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    {getCategoryMeta(selectedNotification.category)?.label} Protocol
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="w-6.5 h-6.5 flex items-center justify-center rounded-sm border border-white/[0.07] bg-white/3 text-slate-400 hover:text-white hover:bg-white/8 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* ID + Title block */}
                <div className="space-y-2">
                  <span className="inline-block bg-[#8EA7FF]/10 border border-[#8EA7FF]/20 text-[#8EA7FF] text-[10px] font-bold tracking-[0.08em] px-2 py-0.5 rounded-[5px] font-mono uppercase">
                    {selectedNotification.id}
                  </span>
                  <h2 className="text-[15px] font-bold text-white leading-snug tracking-tight">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Logged event · {selectedNotification.time}
                  </p>
                </div>

                <div className="h-px bg-white/5" />

                {/* Summary */}
                <div className="rounded-[10px] bg-[#060A10] border border-white/5 p-4">
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    {selectedNotification.message}
                  </p>
                </div>

                {/* Manifest */}
                {selectedNotification.detailedContent && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Manifest &amp; Detailed Context
                    </p>
                    <pre className="rounded-[10px] bg-[#050810] border border-white/5 p-4 text-[11px] font-mono text-slate-400 leading-[1.7] whitespace-pre-wrap overflow-x-auto">
                      {selectedNotification.detailedContent}
                    </pre>
                  </div>
                )}
              </div>

              {/* Drawer footer */}
              <div className="shrink-0 p-4 border-t border-white/6 bg-[#0C1320]">
                <button
                  type="button"
                  onClick={(e) => deleteNotification(selectedNotification.id, e)}
                  className="w-full py-2.5 rounded-[9px] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[12px] font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Dismiss Record
                </button>
              </div>
            </>
          ) : (
            /* Empty state when nothing selected — only visible on mobile if somehow open */
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#8EA7FF]/10 border border-[#8EA7FF]/20 flex items-center justify-center text-[#8EA7FF]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1">Select a notification</p>
                <p className="text-[11px] text-slate-500 max-w-50">
                  Click any item in the feed to view its full details here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
