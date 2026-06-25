import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Fuel,
  Plus,
  Radio,
  AlertTriangle,
  ArrowRight,
  Gauge,
  CheckCircle,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

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
  lat: number;
  lng: number;
}

interface ActiveNode {
  id: string;
  status: "MAINTENANCE" | "EN ROUTE" | "IDLE";
  label: string;
  telemetry: NodeTelemetry;
}

const NODES: ActiveNode[] = [
  {
    id: "AMS-442",
    status: "MAINTENANCE",
    label: "ALERT",
    telemetry: {
      route: "RTM Hub → AMS Port",
      eta: "Delayed 45m",
      crewName: "V. van Dijk",
      detailLabel: "Engine Temp",
      detailValue: "104°C",
      isAlert: true,
      lat: 52.3676,
      lng: 4.9041,
    },
  },
  {
    id: "TRK-711B",
    status: "EN ROUTE",
    label: "85 km/h",
    telemetry: {
      route: "UTC City → EHV Campus",
      eta: "14:30 On Time",
      crewName: "D. de Jong",
      detailLabel: "Vehicle Health",
      detailValue: "Optimal",
      lat: 52.0907,
      lng: 5.1214,
    },
  },
  {
    id: "VHT-309X",
    status: "IDLE",
    label: "Depot",
    telemetry: {
      route: "APD Depot Center",
      eta: "ETA: N/A",
      crewName: "Unassigned",
      detailLabel: "Fuel Level",
      detailValue: "98%",
      lat: 52.2112,
      lng: 5.9699,
    },
  },
];

const STATUS_CONFIG = {
  MAINTENANCE: {
    dot: "#ef4444",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    label: "Maintenance",
  },
  "EN ROUTE": {
    dot: "#e2a54a",
    badge: "bg-[#e2a54a]/10 text-[#e2a54a] border-[#e2a54a]/20",
    label: "En Route",
  },
  IDLE: {
    dot: "#4b5563",
    badge: "bg-slate-800/60 text-slate-500 border-slate-700/40",
    label: "Idle",
  },
};

export function TrackingDashboard() {
  const [filter, setFilter] = useState<"ALL" | "IN TRANSIT" | "ALERTS">("ALL");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("AMS-442");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const selectedNode = NODES.find((n) => n.id === selectedNodeId);

  const filteredNodes = NODES.filter((node) => {
    if (filter === "IN TRANSIT") return node.status === "EN ROUTE";
    if (filter === "ALERTS") return node.status === "MAINTENANCE" || node.telemetry.isAlert;
    return true;
  });

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

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      NODES.forEach((node) => {
        const cfg = STATUS_CONFIG[node.status];
        const icon = L.divIcon({
          className: "",
          html: `<div style="position:relative;width:14px;height:14px;">
            <div style="width:14px;height:14px;border-radius:50%;background:${cfg.dot};border:2px solid #07090e;box-shadow:0 0 0 3px ${cfg.dot}33;"></div>
            ${node.telemetry.isAlert ? `<div style="position:absolute;inset:0;border-radius:50%;background:${cfg.dot};opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>` : ""}
          </div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([node.telemetry.lat, node.telemetry.lng], { icon })
          .addTo(map)
          .bindTooltip(
            `<div style="background:#0c1017;border:1px solid #1c2330;color:#e5e7eb;padding:4px 10px;border-radius:6px;font-size:11px;font-family:monospace;white-space:nowrap;letter-spacing:0.05em;">${node.id}</div>`,
            { permanent: true, direction: "right", offset: [12, 0], className: "leaflet-node-tip" },
          );

        marker.on("click", () => setSelectedNodeId(node.id));
      });

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

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const node = NODES.find((n) => n.id === selectedNodeId);
    if (node) {
      mapInstanceRef.current.flyTo([node.telemetry.lat, node.telemetry.lng], 11, { duration: 1 });
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 300);
    }
  }, [selectedNodeId]);

  return (
    // z-0 here creates a NEW stacking context at a low level so
    // the sidebar at z-[200] in the layout always renders on top
    <div className="relative z-0 flex flex-col lg:flex-row h-full w-full bg-[#07090e] text-[#626d7c] font-sans antialiased overflow-hidden">
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        .leaflet-node-tip{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;}
        .leaflet-tooltip-right::before{display:none;}
        .leaflet-container{background:#07090e!important;}
        /* Leaflet internal panes - keep them BELOW the app sidebar */
        .leaflet-pane { z-index: 1 !important; }
        .leaflet-tile-pane { z-index: 1 !important; }
        .leaflet-overlay-pane { z-index: 2 !important; }
        .leaflet-marker-pane { z-index: 3 !important; }
        .leaflet-tooltip-pane { z-index: 4 !important; }
        .leaflet-popup-pane { z-index: 5 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 6 !important; }
        .node-scroll::-webkit-scrollbar{width:3px;}
        .node-scroll::-webkit-scrollbar-track{background:transparent;}
        .node-scroll::-webkit-scrollbar-thumb{background:#1c2330;border-radius:2px;}
      `}</style>

      {/* ── MAP PANE - z-0 so it never escapes its stacking context ── */}
      <div className="relative z-0 h-[42vh] lg:h-full lg:flex-1 shrink-0 overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Map overlays sit above the map tiles but well below the sidebar */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#07090e]/80 backdrop-blur-sm border border-[#1c2330] rounded-lg px-3 py-1.5">
          <Radio className="h-3 w-3 text-[#e2a54a]" />
          <span className="text-[10px] font-bold text-white tracking-widest font-mono uppercase">
            Live Telemetry
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {selectedNode?.telemetry.isAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm border border-rose-500/30 rounded-lg px-3 py-1.5 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0" />
            <span className="text-[10px] font-bold text-rose-400 font-mono">
              {selectedNode.id} - {selectedNode.telemetry.detailValue}
            </span>
          </div>
        )}

        {/* Zoom controls */}
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

        {/* Selected node mini-card */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 z-10 bg-[#0c1017]/90 backdrop-blur-sm border border-[#1c2330] rounded-xl p-3 min-w-45 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: STATUS_CONFIG[selectedNode.status].dot }}
              />
              <span className="text-xs font-bold text-white font-mono tracking-wide">
                {selectedNode.id}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              {selectedNode.telemetry.route}
            </p>
            <div className="mt-2 pt-2 border-t border-[#1c2330] flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 truncate">
                {selectedNode.telemetry.eta}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-px rounded border shrink-0 ${STATUS_CONFIG[selectedNode.status].badge}`}
              >
                {STATUS_CONFIG[selectedNode.status].label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="relative z-1 w-full lg:w-95 xl:w-105 flex flex-col bg-[#0a0c10] border-t lg:border-t-0 lg:border-l border-[#161b22] overflow-hidden shrink-0">
        {/* Panel header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#161b22] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Fleet Nodes</h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {NODES.length} units tracked · 1 alert
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider font-mono">
                LIVE
              </span>
            </div>
          </div>

          <div className="flex gap-1 mt-4 bg-[#07090e] p-1 rounded-lg border border-[#161b22]">
            {(["ALL", "IN TRANSIT", "ALERTS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-wide rounded-md transition-all ${
                  filter === tab
                    ? "bg-[#1c2330] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {tab === "ALL"
                  ? `All (${NODES.length})`
                  : tab === "IN TRANSIT"
                    ? "Transit"
                    : "Alerts (1)"}
              </button>
            ))}
          </div>
        </div>

        {/* Node list */}
        <div className="flex-1 overflow-y-auto node-scroll p-4 space-y-2.5 min-h-0">
          {filteredNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const cfg = STATUS_CONFIG[node.status];
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`rounded-xl border cursor-pointer select-none transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? "bg-[#111520] border-[#e2a54a]/30 shadow-lg shadow-[#e2a54a]/5"
                    : "bg-[#0c0e14] border-[#161b22] hover:border-[#252c3a]"
                }`}
              >
                <div
                  className="h-px w-full"
                  style={{ background: isSelected ? cfg.dot : "transparent" }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                        style={{
                          background: cfg.dot,
                          boxShadow: isSelected ? `0 0 6px ${cfg.dot}` : "none",
                        }}
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white font-mono tracking-wide">
                          {node.id}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{node.telemetry.route}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#07090e] rounded-lg px-2.5 py-2 border border-[#161b22]">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">
                        ETA
                      </p>
                      <p
                        className={`text-[11px] font-bold font-mono truncate ${node.telemetry.isAlert ? "text-rose-400" : "text-white"}`}
                      >
                        {node.telemetry.eta.split(" ")[0]}
                      </p>
                    </div>
                    <div className="bg-[#07090e] rounded-lg px-2.5 py-2 border border-[#161b22]">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">
                        Crew
                      </p>
                      <p className="text-[11px] font-bold text-white truncate">
                        {node.telemetry.crewName.split(" ").pop()}
                      </p>
                    </div>
                    <div className="bg-[#07090e] rounded-lg px-2.5 py-2 border border-[#161b22]">
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5 truncate">
                        {node.telemetry.detailLabel}
                      </p>
                      <p
                        className={`text-[11px] font-bold font-mono truncate ${node.telemetry.isAlert ? "text-rose-400" : "text-white"}`}
                      >
                        {node.telemetry.detailValue}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#1c2330] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        <span className="text-[10px] text-slate-500">
                          {node.telemetry.crewName}
                        </span>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] text-[#e2a54a] font-semibold hover:text-[#cb923c] transition-colors">
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
              <p className="text-sm text-slate-500 font-medium">No units match this filter</p>
              <p className="text-xs text-slate-700 mt-1">Try switching to All</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#161b22] shrink-0">
          <button className="w-full bg-[#e2a54a] hover:bg-[#d4953e] active:bg-[#c4852e] text-[#07090e] font-bold text-xs tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-[#e2a54a]/10 flex items-center justify-center gap-2 uppercase">
            <Plus className="h-3.5 w-3.5 stroke-[3px]" />
            Dispatch New Unit
          </button>
        </div>
      </div>
    </div>
  );
}
