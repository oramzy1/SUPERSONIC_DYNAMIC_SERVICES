import { useState, useEffect, useRef } from "react";
import { MapPin, Plus, Radio, AlertTriangle, ArrowRight, Image as ImageIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminApi, jobsApi, accountApi } from "@/lib/api";

export const Route = createFileRoute("/_auth/admintracking")({
  component: TrackingDashboard,
});

interface NodeTelemetry {
  route: string;
  eta: string;
  crewName: string;
  detailLabel: string;
  detailValue: string;
  isAlert?: boolean;
}

interface ActiveNode {
  id: string;
  status: "MAINTENANCE" | "EN ROUTE" | "IDLE";
  telemetry: NodeTelemetry;
}

const STATUS_CONFIG = {
  // Repurposed to represent "Overdue" (no maintenance concept exists in the
  // API) — kept the rose color scheme since it fits the semantics.
  MAINTENANCE: {
    dot: "#ef4444",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    label: "Overdue",
  },
  "EN ROUTE": {
    dot: "#e2a54a",
    badge: "bg-[#e2a54a]/10 text-[#e2a54a] border-[#e2a54a]/20",
    label: "En Route",
  },
  IDLE: {
    dot: "#4b5563",
    badge: "bg-slate-800/60 text-slate-500 border-slate-700/40",
    label: "Scheduled",
  },
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "Not scheduled";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function TrackingDashboard() {
  const [filter, setFilter] = useState<"ALL" | "IN TRANSIT" | "ALERTS">("ALL");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const { data: dash } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboard(),
  });
  const { data: allJobs = [] } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: () => jobsApi.list(),
  });
  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });

  const usersById = new Map(users.map((u) => [u.id, u]));
  const overdueIds = new Set((dash?.overdue_jobs ?? []).map((j) => j.id));
  const dashById = new Map(
    [...(dash?.today_jobs ?? []), ...(dash?.upcoming_jobs ?? []), ...(dash?.overdue_jobs ?? [])].map((j) => [j.id, j]),
  );

  // Built entirely from real job data — no coordinates exist anywhere in the
  // API, so there is nothing to plot on an actual map. Status: overdue jobs
  // (per the dashboard bucket) take priority, then in_progress -> "EN
  // ROUTE", everything else scheduled -> "IDLE". Completed/cancelled jobs
  // are excluded — this view is for jobs still in motion.
  const NODES: ActiveNode[] = allJobs
    .filter((j) => j.status !== "completed" && j.status !== "cancelled")
    .map((j) => {
      const status: ActiveNode["status"] = overdueIds.has(j.id)
        ? "MAINTENANCE"
        : j.status === "in_progress"
          ? "EN ROUTE"
          : "IDLE";

      const dashInfo = dashById.get(j.id);
      const crewNames = (j.crew_ids ?? [])
        .map((id) => usersById.get(id)?.full_name)
        .filter(Boolean) as string[];

      return {
        id: `JOB-${j.id}`,
        status,
        telemetry: {
          route: dashInfo?.address_from && dashInfo?.address_to
            ? `${dashInfo.address_from} → ${dashInfo.address_to}`
            : "Route not available",
          eta: formatDateTime(j.scheduled_start),
          crewName: crewNames.length > 0 ? crewNames.join(", ") : "Unassigned",
          detailLabel: "PHOTOS",
          detailValue: String(j.photos?.length ?? 0),
          isAlert: status === "MAINTENANCE",
        },
      };
    });

  const selectedNode = NODES.find((n) => n.id === selectedNodeId);
  const alertCount = NODES.filter((n) => n.status === "MAINTENANCE").length;

  const filteredNodes = NODES.filter((node) => {
    if (filter === "IN TRANSIT") return node.status === "EN ROUTE";
    if (filter === "ALERTS") return node.status === "MAINTENANCE";
    return true;
  });

  // Map is kept for visual context (base tiles only) — there is no
  // coordinate data anywhere in the API to plot markers with, so no
  // markers, no flyTo, no live positions. If a fleet-telemetry endpoint
  // gets added later, this is the natural place to wire markers back in.
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const init = async () => {
      if (!(window as any).L) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }

      const L = (window as any).L;
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [52.3, 5.3],
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);

      mapInstanceRef.current = map;
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative z-0 flex flex-col lg:flex-row h-full w-full bg-[#07090e] text-[#626d7c] font-sans antialiased overflow-hidden">
      <style>{`
        .leaflet-container{background:#07090e!important;}
        .leaflet-pane { z-index: 1 !important; }
        .leaflet-tile-pane { z-index: 1 !important; }
        .node-scroll::-webkit-scrollbar{width:3px;}
        .node-scroll::-webkit-scrollbar-track{background:transparent;}
        .node-scroll::-webkit-scrollbar-thumb{background:#1c2330;border-radius:2px;}
      `}</style>

      {/* ── MAP PANE ── */}
      <div className="relative z-0 h-[42vh] lg:h-full lg:flex-1 shrink-0 overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#07090e]/80 backdrop-blur-sm border border-[#1c2330] rounded-lg px-3 py-1.5">
          <Radio className="h-3 w-3 text-[#e2a54a]" />
          <span className="text-[10px] font-bold text-white tracking-widest font-mono uppercase">
            Job Status Board
          </span>
        </div>

        {/* Zoom controls (kept — map tiles still render for context) */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#0c1017]/90 backdrop-blur-sm border border-[#1c2330] rounded-lg overflow-hidden shadow-2xl">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1c2330] transition-colors text-sm font-medium"
          >
            +
          </button>
          <div className="w-5 h-px bg-[#1c2330] mx-auto" />
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1c2330] transition-colors text-sm font-medium"
          >
            −
          </button>
        </div>

        {/* Honest permanent notice — there is genuinely no GPS/coordinate
            data available from the backend, regardless of how many jobs
            exist. */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6">
          <div className="bg-[#0c1017]/90 backdrop-blur-sm border border-[#1c2330] rounded-xl px-4 py-3 text-center max-w-xs">
            <p className="text-xs font-semibold text-slate-300">Live GPS telemetry isn't available yet</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No vehicle location endpoint exists in the API — the list on the right reflects real job status instead.
            </p>
          </div>
        </div>

        {selectedNode?.telemetry.isAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm border border-rose-500/30 rounded-lg px-3 py-1.5 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0" />
            <span className="text-[10px] font-bold text-rose-400 font-mono">
              {selectedNode.id} — overdue
            </span>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="relative z-1 w-full lg:w-95 xl:w-105 flex flex-col bg-[#0a0c10] border-t lg:border-t-0 lg:border-l border-[#161b22] overflow-hidden shrink-0">
        <div className="px-5 pt-5 pb-4 border-b border-[#161b22] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Jobs</h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {NODES.length} jobs tracked · {alertCount} overdue
              </p>
            </div>
          </div>

          <div className="flex gap-1 mt-4 bg-[#07090e] p-1 rounded-lg border border-[#161b22]">
            {(["ALL", "IN TRANSIT", "ALERTS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wide rounded-md transition-all ${
                  filter === tab ? "bg-[#1c2330] text-white shadow-sm" : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {tab === "ALL" ? `All (${NODES.length})` : tab === "IN TRANSIT" ? "In Progress" : `Overdue (${alertCount})`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto node-scroll p-4 space-y-2.5 min-h-0">
          {filteredNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const cfg = STATUS_CONFIG[node.status];
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                className={`rounded-xl border cursor-pointer select-none transition-all duration-150 overflow-hidden ${
                  isSelected ? "bg-[#111520] border-[#e2a54a]/30 shadow-lg shadow-[#e2a54a]/5" : "bg-[#0c0e14] border-[#161b22] hover:border-[#252c3a]"
                }`}
              >
                <div className="h-px w-full" style={{ background: isSelected ? cfg.dot : "transparent" }} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: cfg.dot, boxShadow: isSelected ? `0 0 6px ${cfg.dot}` : "none" }} />
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white font-mono tracking-wide">{node.id}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{node.telemetry.route}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#07090e] rounded-lg px-2.5 py-2 border border-[#161b22]">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">ETA</p>
                      <p className={`text-[11px] font-bold font-mono truncate ${node.telemetry.isAlert ? "text-rose-400" : "text-white"}`}>
                        {node.telemetry.eta}
                      </p>
                    </div>
                    <div className="bg-[#07090e] rounded-lg px-2.5 py-2 border border-[#161b22] flex items-center gap-1.5">
                      <ImageIcon className="h-2.5 w-2.5 text-slate-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">{node.telemetry.detailLabel}</p>
                        <p className="text-[11px] font-bold text-white truncate">{node.telemetry.detailValue}</p>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#1c2330] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        <span className="text-[10px] text-slate-500 truncate">{node.telemetry.crewName}</span>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] text-[#e2a54a] font-semibold hover:text-[#cb923c] transition-colors shrink-0">
                        Details <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNodes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Radio className="h-8 w-8 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                {NODES.length === 0 ? "No active jobs right now" : "No jobs match this filter"}
              </p>
              <p className="text-xs text-slate-700 mt-1">
                {NODES.length === 0 ? "Jobs appear here once quotes are accepted." : "Try switching to All"}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#161b22] shrink-0">
          <button
            disabled
            title="No backend endpoint exists yet for dispatching a new unit"
            className="w-full bg-white/5 text-slate-500 font-bold text-xs tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 uppercase cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3px]" />
            Dispatch New Unit
          </button>
          <p className="text-[10px] text-slate-600 text-center mt-1.5">Not connected — no backend endpoint yet</p>
        </div>
      </div>
    </div>
  );
}