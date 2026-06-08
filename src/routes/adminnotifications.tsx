import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  MessageSquare,
  Search,
  Filter,
  CheckSquare,
  Trash2,
  Circle,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";

export const Route = createFileRoute("/adminnotifications")({
  component: RouteComponent,
});

interface NotificationItem {
  id: string;
  type: "alert" | "message" | "info";
  title: string;
  sender: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  metaId?: string;
}

function RouteComponent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "NT-8942",
      type: "alert",
      title: "High Priority Moving Request",
      sender: "System Dispatcher",
      preview:
        "New residential moving quote request submitted for Route ID #9082. Dispatched to regional operators.",
      timestamp: "5 mins ago",
      isRead: false,
      priority: "high",
      metaId: "REQ-9082",
    },
    {
      id: "MSG-1049",
      type: "message",
      title: "Client Route Alteration Note",
      sender: "Marcus Vance",
      preview:
        "Can we adjust the drop-off time window for tomorrow's assignment to 2:00 PM instead of noon?",
      timestamp: "24 mins ago",
      isRead: false,
      priority: "medium",
      metaId: "QUOTE-4410",
    },
    {
      id: "NT-8940",
      type: "info",
      title: "System Update Complete",
      sender: "DevOps Automated",
      preview:
        "Geofencing tracking databases successfully re-indexed. Zero latency abnormalities recorded.",
      timestamp: "1 hour ago",
      isRead: true,
      priority: "low",
    },
    {
      id: "MSG-1042",
      type: "message",
      title: "Corporate Account Inquiry",
      sender: "Sarah Jenkins (Logistics Corp)",
      preview: "Requested dynamic pricing models for multi-state continuous operations contracts.",
      timestamp: "3 hours ago",
      isRead: true,
      priority: "high",
      metaId: "CORP-981",
    },
    {
      id: "NT-8931",
      type: "alert",
      title: "Driver Delay Warning",
      sender: "Fleet Telematics",
      preview:
        "Vehicle #12 reports heavy route delays due to flash accident on Interstate 95 North.",
      timestamp: "Yesterday",
      isRead: true,
      priority: "medium",
      metaId: "VEH-12",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts" | "messages">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectingItem, setInspectingItem] = useState<NotificationItem | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "unread" && item.isRead) return false;
      if (activeTab === "alerts" && item.type !== "alert") return false;
      if (activeTab === "messages" && item.type !== "message") return false;

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.metaId && item.metaId.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [notifications, activeTab, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const markBulkAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => (selectedIds.includes(item.id) ? { ...item, isRead: true } : item)),
    );
    setSelectedIds([]);
  };

  const deleteBulkNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    if (inspectingItem && selectedIds.includes(inspectingItem.id)) {
      setInspectingItem(null);
    }
  };

  const handleRowClick = (item: NotificationItem) => {
    setInspectingItem(item);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div className="min-h-screen bg-[#111315] text-slate-100 p-4 md:p-8 font-sans relative overflow-x-hidden">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1e21] pb-6 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#E2A54A]" />
            Notification Communications Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time system alerts, operations activity dispatch streams, and user
            logistics messages.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#16191c] border border-slate-800/60 rounded-xl px-4 py-2 text-center min-w-20">
            <span className="block text-xs text-slate-500 font-medium">Total</span>
            <span className="text-lg font-bold text-white">{notifications.length}</span>
          </div>
          <div className="bg-[#16191c] border border-slate-800/60 rounded-xl px-4 py-2 text-center min-w-20">
            <span className="block text-xs text-slate-500 font-medium">Unread</span>
            <span className="text-lg font-bold text-[#E2A54A]">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          </div>
        </div>
      </div>

      {/* TABS + SEARCH */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center overflow-x-auto gap-1 bg-[#16191c]/60 p-1 rounded-xl w-fit border border-slate-800/40 shrink-0 scrollbar-none">
          {(["all", "unread", "alerts", "messages"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds([]);
              }}
              className={`px-4 py-2 text-xs font-semibold capitalize rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#1c1e21] text-[#E2A54A] border border-slate-800 shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "all" ? "All Communications" : tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="flex items-center gap-2.5 bg-[#16191c] border border-slate-800/50 rounded-xl px-3 py-2 w-full sm:max-w-md focus-within:border-[#E2A54A]/60 transition-colors">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, title, name, or metadata tag..."
              className="bg-transparent text-xs sm:text-sm text-slate-200 w-full outline-none placeholder:text-slate-500"
            />
            {searchQuery && (
              <X
                className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-[#E2A54A]/5 border border-[#E2A54A]/20 px-3 py-1.5 rounded-xl w-full sm:w-auto">
              <span className="text-[11px] font-bold text-[#E2A54A] px-1 whitespace-nowrap">
                {selectedIds.length} Selected
              </span>
              <div className="h-4 w-px bg-slate-800 mx-1" />
              <button
                type="button"
                onClick={markBulkAsRead}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#1c1e21] px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                Mark Read
              </button>
              <button
                type="button"
                onClick={deleteBulkNotifications}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#16191c]/40 border border-[#1c1e21] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-b border-[#1c1e21] bg-[#16191c]/80 text-slate-400 text-[11px] uppercase font-bold tracking-wider select-none">
                <th className="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredNotifications.length > 0 &&
                      selectedIds.length === filteredNotifications.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-800 bg-[#111315] accent-[#E2A54A] h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-3 w-32">Channel Type</th>
                <th className="py-4 px-4 w-44">Sender Node</th>
                <th className="py-4 px-4">Subject & Context Preview</th>
                <th className="py-4 px-4 w-28 text-right">Registered</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1c1e21]/60 text-xs sm:text-sm">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center justify-center">
                      <div className="p-3.5 bg-slate-900/60 rounded-full border border-slate-800/40 text-slate-600 mb-3">
                        <Filter className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">
                        No communication data found
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try modifying your filter query or clearing the selected tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={`group hover:bg-[#1c1e21]/40 transition-colors duration-100 cursor-pointer border-l-2 select-none ${
                      item.isRead
                        ? "border-transparent opacity-75"
                        : "border-[#E2A54A] bg-[#E2A54A]/1"
                    }`}
                  >
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => toggleSelectOne(item.id, e)}
                        className="rounded border-slate-800 bg-[#111315] accent-[#E2A54A] h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          item.type === "alert"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            : item.type === "message"
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/10"
                              : "bg-slate-800 text-slate-300 border border-slate-700/30"
                        }`}
                      >
                        {item.type === "alert" ? (
                          <AlertTriangle className="w-2.5 h-2.5" />
                        ) : item.type === "message" ? (
                          <MessageSquare className="w-2.5 h-2.5" />
                        ) : (
                          <Info className="w-2.5 h-2.5" />
                        )}
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white truncate max-w-37.5">
                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <Circle className="w-1.5 h-1.5 fill-[#E2A54A] text-[#E2A54A] shrink-0" />
                        )}
                        <span className="truncate">{item.sender}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-60">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${!item.isRead ? "text-white" : "text-slate-300"}`}
                          >
                            {item.title}
                          </span>
                          {item.metaId && (
                            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {item.metaId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate max-w-85 md:max-w-md lg:max-w-xl">
                          {item.preview}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-500 font-medium text-xs">
                      <div className="flex items-center justify-end gap-1.5 group-hover:text-slate-300 transition-colors">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {item.timestamp}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 ml-1 transition-all" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-99998 transition-opacity duration-200 ${
          inspectingItem ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setInspectingItem(null)}
      />

      {/* SLIDE-OVER DETAIL PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-[#111315] border-l border-slate-800/80 shadow-2xl z-99999 transition-transform duration-300 transform ${
          inspectingItem ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {inspectingItem && (
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60 bg-[#16191c]/40">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-slate-500">
                  ID Reference: {inspectingItem.id}
                </span>
                <h2 className="text-base font-semibold text-white">Transmission Details</h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Type + Timestamp */}
              <div className="bg-[#16191c] border border-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      inspectingItem.type === "alert"
                        ? "bg-amber-500/10 text-amber-400"
                        : inspectingItem.type === "message"
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {inspectingItem.type === "alert" ? (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    ) : inspectingItem.type === "message" ? (
                      <MessageSquare className="w-2.5 h-2.5" />
                    ) : (
                      <Info className="w-2.5 h-2.5" />
                    )}
                    {inspectingItem.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {inspectingItem.timestamp}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {inspectingItem.title}
                </h3>
              </div>

              {/* Sender */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
                  Sender Origin
                </span>
                <div className="bg-[#16191c]/40 border border-slate-800/40 px-4 py-3 rounded-xl text-sm font-semibold text-white">
                  {inspectingItem.sender}
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
                  Message Content Payload
                </span>
                <div className="bg-[#16191c]/40 border border-slate-800/40 p-4 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans min-h-30 whitespace-pre-wrap">
                  {inspectingItem.preview}
                </div>
              </div>

              {/* Linked Meta */}
              {inspectingItem.metaId && (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
                    Linked System Assets
                  </span>
                  <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-4 py-3 rounded-xl">
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {inspectingItem.metaId}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Navigating to internal object track node: ${inspectingItem.metaId}`,
                        )
                      }
                      className="text-[11px] font-bold text-[#E2A54A] hover:underline"
                    >
                      Inspect File Record →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-4 bg-[#16191c]/80 border-t border-slate-800/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== inspectingItem.id),
                  );
                  setInspectingItem(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/10 rounded-xl text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Transmission
              </button>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}