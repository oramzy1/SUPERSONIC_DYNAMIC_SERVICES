import React, { useState, useEffect, useRef } from "react";
import { MapPin, Gauge, Fuel, Plus, CheckCircle } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardSidebar } from "@/components/admin/AdminDashboardSidebar";
import { AdminDashboardTopbar } from "@/components/admin/AdminDashboardTopbar";

export const Route = createFileRoute("/admintracking")({
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
      route: "RTM Hub ➔ AMS Port",
      eta: "Delayed 45m",
      crewName: "V. van Dijk",
      detailLabel: "Engine Temp",
      detailValue: "High (104°C)",
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
      route: "UTC City ➔ EHV Campus",
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
      route: "Loc: APD Depot Center",
      eta: "ETA: N/A",
      crewName: "None Assigned",
      detailLabel: "Fuel Level",
      detailValue: "98%",
      lat: 52.2112,
      lng: 5.9699,
    },
  },
];

export function TrackingDashboard() {
  const [filter, setFilter] = useState<"ALL" | "IN TRANSIT" | "ALERTS">("ALL");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("AMS-442");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const filteredNodes = NODES.filter((node) => {
    if (filter === "IN TRANSIT") return node.status === "EN ROUTE";
    if (filter === "ALERTS") return node.status === "MAINTENANCE" || node.telemetry.isAlert;
    return true;
  });

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // Inject Leaflet CSS once
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
        const color =
          node.status === "MAINTENANCE"
            ? "#ef4444"
            : node.status === "IDLE"
              ? "#626d7c"
              : "#e2a54a";

        const icon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #0c1017;box-shadow:0 0 0 3px ${color}44;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([node.telemetry.lat, node.telemetry.lng], { icon })
          .addTo(map)
          .bindTooltip(
            `<div style="background:#0c1017;border:1px solid #1c2330;color:#e5e7eb;padding:3px 8px;border-radius:5px;font-size:11px;font-family:monospace;white-space:nowrap;">${node.id}</div>`,
            { permanent: true, direction: "right", offset: [10, 0], className: "leaflet-node-tip" },
          );
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

  // Fly to node on card click
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const node = NODES.find((n) => n.id === selectedNodeId);
    if (node) {
      mapInstanceRef.current.flyTo([node.telemetry.lat, node.telemetry.lng], 11, { duration: 1 });
    }
  }, [selectedNodeId]);

  return (
    <div className="flex h-screen w-full bg-[#07090e] text-[#626d7c] font-sans antialiased overflow-hidden">
      <style>{`
        .leaflet-node-tip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip-right::before { display: none; }
        .leaflet-container { background: #07090e !important; }
      `}</style>

      {/* Sidebar — z-50, fully above everything */}
      <div className="relative z-50 h-full shrink-0">
        <AdminDashboardSidebar />
      </div>

      {/* Page body — z-10, never overlaps sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-full" style={{ zIndex: 10 }}>
        <AdminDashboardTopbar />

        <div className="flex-1 flex w-full overflow-hidden">
          {/* MAP AREA */}
          <div className="flex-1 h-full relative">
            {/* Leaflet mount target — pointer events isolated here */}
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

            {/* Custom zoom controls */}
            <div
              className="absolute bottom-6 left-6 bg-[#0c1017] border border-[#161b22] rounded-lg p-1 flex flex-col shadow-2xl"
              style={{ zIndex: 999 }}
            >
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#1c2330] rounded transition-colors text-base font-medium"
              >
                +
              </button>
              <div className="w-4 h-px bg-[#161b22] mx-auto" />
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#1c2330] rounded transition-colors text-base font-medium"
              >
                -
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-96 h-full bg-[#0c1017] border-l border-[#161b22] flex flex-col p-6 overflow-hidden shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Active Nodes</h1>
                <p className="text-xs text-[#2d3643] mt-0.5">Live fleet telemetry systems</p>
              </div>
              <span className="text-[10px] bg-[#e2a54a]/10 text-[#e2a54a] font-semibold border border-[#e2a54a]/20 px-2 py-0.5 rounded tracking-wider font-mono">
                LIVE
              </span>
            </div>

            {/* Filter tabs */}
            <div className="grid grid-cols-3 bg-[#07090e] p-1 rounded-md border border-[#161b22] mb-5 shrink-0">
              {(["ALL", "IN TRANSIT", "ALERTS"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`py-1.5 text-[10px] font-bold tracking-wide rounded transition-all ${
                    filter === tab ? "bg-[#1c2330] text-white" : "text-[#626d7c] hover:text-white"
                  }`}
                >
                  {tab === "ALL"
                    ? `ALL (${NODES.length})`
                    : tab === "IN TRANSIT"
                      ? "TRANSIT"
                      : "ALERTS (1)"}
                </button>
              ))}
            </div>

            {/* Node cards */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#1c2330] border-[#e2a54a]/40 shadow-xl"
                        : "bg-[#0c1017] border-[#161b22] hover:border-[#2d3643]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white tracking-tight font-mono">
                            {node.id}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-px rounded tracking-wide ${
                              node.status === "MAINTENANCE"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : node.status === "IDLE"
                                  ? "bg-[#626d7c]/10 text-[#626d7c] border border-[#626d7c]/20"
                                  : "bg-[#e2a54a]/10 text-[#e2a54a] border border-[#e2a54a]/20"
                            }`}
                          >
                            {node.status}
                          </span>
                        </div>
                        <p className="text-xs text-white font-medium mt-2 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-[#2d3643]" />
                          {node.telemetry.route}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-mono font-bold block ${node.telemetry.isAlert ? "text-rose-400" : "text-[#e2a54a]"}`}
                        >
                          {node.telemetry.eta.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-[#2d3643] block mt-0.5">
                          {node.telemetry.eta.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-[#161b22] my-3" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase text-[#2d3643] font-bold tracking-wider block">
                          Crew Status
                        </span>
                        <span className="text-xs text-[#626d7c] font-medium mt-1 flex items-center gap-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              node.status === "MAINTENANCE"
                                ? "bg-[#e2a54a]"
                                : node.status === "IDLE"
                                  ? "bg-[#626d7c]"
                                  : "bg-[#4ade80]"
                            }`}
                          />
                          {node.telemetry.crewName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#2d3643] font-bold tracking-wider flex items-center gap-1">
                          {node.id === "AMS-442" ? (
                            <Gauge className="h-3 w-3 stroke-2" />
                          ) : node.id === "VHT-309X" ? (
                            <Fuel className="h-3 w-3 stroke-2" />
                          ) : (
                            <CheckCircle className="h-3 w-3 stroke-2" />
                          )}
                          {node.telemetry.detailLabel}
                        </span>
                        <span
                          className={`text-xs font-bold block mt-1 font-mono ${node.telemetry.isAlert ? "text-rose-400" : "text-white"}`}
                        >
                          {node.telemetry.detailValue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button className="w-full bg-[#e2a54a] hover:bg-[#cb923c] text-[#07090e] font-bold text-xs tracking-wide py-3.5 rounded-xl transition-all shadow-xl shadow-[#e2a54a]/5 mt-4 flex items-center justify-center gap-2 uppercase shrink-0">
              <Plus className="h-4 w-4 stroke-[3px]" />
              Dispatch New Unit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
