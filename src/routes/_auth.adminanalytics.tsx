import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  BarChart3,
  Leaf,
  Download,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_auth/adminanalytics")({
  component: AnalyticsDashboard,
});

interface TopCrew {
  id: string;
  region: string;
  efficiency: string;
  onTime: string;
  statusColor: string;
  onTimeColor: string;
}

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "YTD">("30D");
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Trigger dynamic line draw and progress fill upon mounting
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const mainChartData = [
    { label: "May 1", value: "$1.1M", x: 50, y: 140 },
    { label: "May 3", value: "$2.4M", x: 130, y: 100 },
    { label: "May 5", value: "$1.8M", x: 210, y: 115 },
    { label: "May 8", value: "$3.1M", x: 290, y: 75 },
    { label: "May 11", value: "$1.5M", x: 370, y: 125 },
    { label: "May 15", value: "$3.8M", x: 450, y: 55 },
    { label: "May 20", value: "$4.2M", x: 530, y: 40 },
  ];

  const topCrews: TopCrew[] = [
    {
      id: "Alpha-09",
      region: "NA-East",
      efficiency: "98.4%",
      onTime: "99.1%",
      statusColor: "bg-[#e2a54a]",
      onTimeColor: "text-[#4ade80]",
    },
    {
      id: "Delta-42",
      region: "EU-Central",
      efficiency: "96.7%",
      onTime: "98.2%",
      statusColor: "bg-[#e2a54a]",
      onTimeColor: "text-[#4ade80]",
    },
    {
      id: "Bravo-11",
      region: "APAC-South",
      efficiency: "94.2%",
      onTime: "95.5%",
      statusColor: "bg-[#e2a54a]",
      onTimeColor: "text-[#4ade80]",
    },
    {
      id: "Echo-03",
      region: "NA-West",
      efficiency: "92.8%",
      onTime: "91.0%",
      statusColor: "bg-[#626d7c]",
      onTimeColor: "text-[#e2a54a]",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto text-[#626d7c] font-sans antialiased space-y-6">
      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes revealArea {
          from { opacity: 0; transform: scaleY(0.9); }
          to { opacity: 0.12; transform: scaleY(1); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-draw-line {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-area-fade {
          transform-origin: bottom;
          animation: revealArea 1.6s ease-out 0.4s forwards;
        }
        .animate-stat-pop {
          opacity: 0;
          animation: countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* TOP CONTEXT BAR - Fixed cross-axis alignment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Overview</h1>
          <p className="text-xs text-[#626d7c] mt-1">
            Comprehensive performance metrics for Q3 2024
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex bg-[#0c1017] p-1 rounded-md border border-[#161b22]">
            {(["7D", "30D", "YTD"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeframe(tab)}
                className={`px-3 py-1 text-[11px] font-medium tracking-wide rounded transition-all ${
                  timeframe === tab ? "bg-[#1c2330] text-white" : "text-[#626d7c] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 bg-[#e2a54a] hover:bg-[#cb923c] text-[#07090e] font-bold text-[11px] tracking-wide px-3 py-1.5 rounded transition-all uppercase whitespace-nowrap">
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            Export Report
          </button>
        </div>
      </div>

      {/* GRID ROW 1: REVENUE GROWTH GRAPH & ACQUISITION FUNNEL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Dynamic Area Spline Card */}
        <div className="xl:col-span-2 bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between relative min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Revenue Growth</h2>
              <p className="text-xs text-[#626d7c] mt-0.5">Cumulative Gross Value (USD)</p>
            </div>
            <div className="text-right">
              <div
                className="text-3xl font-bold text-[#e2a54a] tracking-tight animate-stat-pop"
                style={{ animationDelay: "0.1s" }}
              >
                $4.2M
              </div>
              <div className="text-[11px] text-[#e2a54a] flex items-center justify-end gap-1 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 inline" />
                <span>+12.4%</span>
                <span className="text-[#626d7c]">vs last quarter</span>
              </div>
            </div>
          </div>

          {/* Custom Scaled SVG Area Vector Engine */}
          <div className="w-full h-48 mt-6 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 580 180" preserveAspectRatio="none">
              {/* Horizontal Grid Guidelines */}
              {[30, 60, 90, 120, 150, 170].map((yVal, idx) => (
                <line
                  key={idx}
                  x1="45"
                  y1={yVal}
                  x2="565"
                  y2={yVal}
                  stroke="#161b22"
                  strokeWidth="1"
                />
              ))}

              {/* Chart Left Data Boundary Labels */}
              <text x="5" y="34" fill="#2d3643" className="text-[10px] font-medium font-mono">
                4.22M
              </text>
              <text x="5" y="64" fill="#2d3643" className="text-[10px] font-medium font-mono">
                2.22M
              </text>
              <text x="5" y="94" fill="#2d3643" className="text-[10px] font-medium font-mono">
                1.55M
              </text>
              <text x="5" y="124" fill="#2d3643" className="text-[10px] font-medium font-mono">
                700k
              </text>
              <text x="5" y="154" fill="#2d3643" className="text-[10px] font-medium font-mono">
                500k
              </text>
              <text x="5" y="174" fill="#2d3643" className="text-[10px] font-medium font-mono">
                50k
              </text>

              {/* Gradient-Filled Area Spline Component */}
              <path
                d="M 50,170 Q 90,130 130,100 Q 170,80 210,115 Q 250,165 290,75 Q 330,15 370,125 Q 410,175 450,55 Q 490,15 530,40 L 530,170 Z"
                fill="url(#revenue-gradient)"
                className="opacity-0 animate-area-fade"
              />

              {/* Master SVG Stroked Vector Path Line */}
              <path
                d="M 50,170 Q 90,130 130,100 Q 170,80 210,115 Q 250,165 290,75 Q 330,15 370,125 Q 410,175 450,55 Q 490,15 530,40"
                fill="none"
                stroke="#e2a54a"
                strokeWidth="1.5"
                className="animate-draw-line"
              />

              {/* High Precision Interactive Hover Anchor Point System */}
              {mainChartData.map((pt, index) => (
                <g
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDataIndex(index)}
                  onMouseLeave={() => setHoveredDataIndex(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredDataIndex === index ? "5" : "2.5"}
                    className={`fill-[#e2a54a] transition-all duration-150 ${hoveredDataIndex === index ? "stroke-white stroke-2 shadow-lg" : "opacity-40 hover:opacity-100"}`}
                  />
                </g>
              ))}

              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2a54a" />
                  <stop offset="100%" stopColor="#e2a54a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Micro HUD Overlay Interactive Component Tooltip */}
            {hoveredDataIndex !== null && (
              <div
                className="absolute bg-[#1c2330] border border-[#161b22] rounded px-2.5 py-1 text-[11px] text-white font-mono shadow-xl pointer-events-none transition-all duration-150"
                style={{
                  left: `${(mainChartData[hoveredDataIndex].x / 580) * 100}%`,
                  top: `${(mainChartData[hoveredDataIndex].y / 180) * 100 - 15}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {mainChartData[hoveredDataIndex].value}
              </div>
            )}
          </div>

          {/* X Axis Bottom Timestamps Label Metrics Row */}
          <div className="flex justify-between items-center pl-10 pr-4 mt-2 pt-2">
            {mainChartData.map((pt, idx) => (
              <span key={idx} className="text-[10px] font-medium font-sans text-[#2d3643]">
                {pt.label}
              </span>
            ))}
          </div>
        </div>

        {/* Client Acquisition Horizontal Funnel Segment Stack Card */}
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Acquisition</h2>
              <p className="text-xs text-[#626d7c] mt-0.5">NEW ENTERPRISE CLIENTS</p>
            </div>
            <Users className="h-4 w-4 text-[#626d7c]" />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <div
              className="text-4xl font-bold text-white tracking-tight animate-stat-pop"
              style={{ animationDelay: "0.2s" }}
            >
              128
            </div>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] bg-[#4ade80]/10 text-[#4ade80] font-bold mt-1 font-mono">
              <ArrowUpRight className="h-2.5 w-2.5 stroke-3" /> 8%
            </span>
          </div>

          {/* Horizontal Funnel Segment Stack */}
          <div className="space-y-4 mt-6">
            {[
              { segment: "Leads (Top)", qty: "4,500", width: "100%", delay: "0.3s" },
              { segment: "Qualified (Mid)", qty: "1,200", width: "45%", delay: "0.4s" },
              { segment: "Closed (Bottom)", qty: "128", width: "15%", delay: "0.5s" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-[11px] font-medium mb-1.5">
                  <span className="text-[#626d7c]">{item.segment}</span>
                  <span className="text-white font-mono">{item.qty}</span>
                </div>
                <div className="h-2 bg-[#07090e] rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#e2a54a] rounded-sm transition-all cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{
                      width: isLoaded ? item.width : "0%",
                      transitionDuration: "1.4s",
                      transitionDelay: item.delay,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRID ROW 2: SERVICE VOLUME AND TOP PERFORMANCE MATRIX LEADERBOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Service Volume Horizontal Block Data Bars */}
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">
                Volume by Service Type
              </h2>
            </div>
            <BarChart3 className="h-4 w-4 text-[#626d7c]" />
          </div>

          <div className="space-y-4">
            {[
              { label: "Freight Forwarding", value: "8,420 jobs", pct: "85%", delay: "0.2s" },
              { label: "Last Mile Delivery", value: "6,105 jobs", pct: "62%", delay: "0.3s" },
              { label: "Warehousing", value: "3,890 jobs", pct: "38%", delay: "0.4s" },
              { label: "Customs Clearance", value: "1,240 jobs", pct: "18%", delay: "0.5s" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[11px] font-medium mb-1.5">
                  <span className="text-white">{item.label}</span>
                  <span className="text-[#626d7c] font-mono">{item.value}</span>
                </div>
                <div className="h-2 bg-[#07090e] rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#e2a54a] rounded-sm transition-all cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{
                      width: isLoaded ? item.pct : "0%",
                      transitionDuration: "1.2s",
                      transitionDelay: item.delay,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crew Performance Table Matrix Ledger View */}
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">
                Top Performing Crews
              </h2>
            </div>
            <button className="text-[11px] text-[#e2a54a] hover:underline font-bold tracking-wider flex items-center gap-0.5 uppercase">
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto w-full hidden-scrollbar">
            <table className="w-full text-left border-collapse min-w-100">
              <thead>
                <tr className="border-b border-[#161b22] text-[10px] uppercase font-bold tracking-wider text-[#2d3643]">
                  <th className="pb-3 font-semibold">Crew ID</th>
                  <th className="pb-3 font-semibold">Region</th>
                  <th className="pb-3 font-semibold text-right">Efficiency</th>
                  <th className="pb-3 font-semibold text-right">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161b22]/40">
                {topCrews.map((crew, idx) => (
                  <tr
                    key={idx}
                    className="text-xs hover:bg-[#1c2330]/20 transition-colors duration-150"
                  >
                    <td className="py-3.5 font-bold text-white font-mono flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${crew.statusColor}`}></span>
                      {crew.id}
                    </td>
                    <td className="py-3.5 text-[#626d7c] font-medium">{crew.region}</td>
                    <td className="py-3.5 text-right text-white font-bold font-mono">
                      {crew.efficiency}
                    </td>
                    <td className={`py-3.5 text-right font-bold font-mono ${crew.onTimeColor}`}>
                      {crew.onTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DYNAMIC CARBON OFFSET SUSTAINABILITY ROW CARD BAR */}
      <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#4ade80]/5 border border-[#4ade80]/10 flex items-center justify-center text-[#4ade80]">
            <Leaf className="h-5 w-5 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Carbon Offset Tracking
            </h3>
            <p className="text-xs text-[#626d7c] mt-0.5">Enterprise sustainability goals Q3</p>
          </div>
        </div>

        <div className="flex items-center gap-8 text-right self-end md:self-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">
              CO2 Reduced
            </span>
            <span
              className="text-base font-bold text-[#4ade80] font-mono mt-0.5 block animate-stat-pop"
              style={{ animationDelay: "0.4s" }}
            >
              4,250 MT
            </span>
          </div>
          <div className="h-8 w-px bg-[#161b22]"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">
              EV Fleet Usage
            </span>
            <span
              className="text-base font-bold text-white font-mono mt-0.5 block animate-stat-pop"
              style={{ animationDelay: "0.5s" }}
            >
              34.2%
            </span>
          </div>
          <div className="h-8 w-px bg-[#161b22]"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">
              Goal Progress
            </span>
            <span
              className="text-base font-bold text-[#e2a54a] font-mono mt-0.5 block animate-stat-pop"
              style={{ animationDelay: "0.6s" }}
            >
              85%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}