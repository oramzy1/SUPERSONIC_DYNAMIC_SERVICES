import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

export const Route = createFileRoute("/_auth/admindashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - Supersonic Dynamic Services" },
      {
        name: "description",
        content: "Administrative controls and live operational systems monitoring console.",
      },
    ],
  }),
  component: RouteComponent,
});

const metrics = [
  { title: "Total Quotes", value: "1,248", change: "+12%", isPositive: true, icon: FileText },
  { title: "Active Jobs", value: "342", change: "+8%", isPositive: true, icon: Truck },
  { title: "Completed", value: "8,901", change: "-0%", isPositive: false, icon: CheckCircle2 },
  { title: "Pending Pay", value: "45", change: "-3%", isPositive: false, icon: Clock },
  { title: "Revenue", value: "$1.2M", change: "+24%", isPositive: true, icon: DollarSign },
  { title: "Customers", value: "12.4k", change: "+5%", isPositive: true, icon: Users },
];

const liveTrackingData = [
  {
    id: "TRK-8829",
    client: "Acme Corp Logistics",
    origin: "NY Terminal",
    dest: "Chicago Hub",
    crew: "Team Alpha",
    crewInitials: "TA",
    status: "In Progress",
    eta: "14:30 EST",
  },
  {
    id: "TRK-8830",
    client: "Global Tech Supplies",
    origin: "Seattle Port",
    dest: "Denver WH",
    crew: "Team Bravo",
    crewInitials: "TB",
    status: "Accepted",
    eta: "Tomorrow",
  },
  {
    id: "TRK-8825",
    client: "Stark Industries",
    origin: "LA Docks",
    dest: "Vegas Storage",
    crew: "Team Charlie",
    crewInitials: "TC",
    status: "Delayed",
    eta: "Update Required",
  },
];

const recentQuotes = [
  { id: "QT-1092", company: "Horizon Partners", type: "LTL Freight", amount: "$4,250" },
  { id: "QT-1091", company: "Vertex Corp", type: "Full Truckload", amount: "$12,800" },
  { id: "QT-1090", company: "Nexus Logistics", type: "Express Air", amount: "$8,900" },
  { id: "QT-1089", company: "Omni Consumer", type: "LTL Freight", amount: "$1,150" },
  { id: "QT-1088", company: "Sirius Cyber", type: "Specialty Haul", amount: "$24,000" },
];

function RouteComponent() {
  return (
    <div className="w-full text-slate-200 select-none pb-12">
      {/* HEADER CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">System status and live operational metrics.</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-full text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            System Operational
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-semibold text-xs rounded-lg hover:bg-[#d4963b] transition duration-200">
            <span className="text-base font-normal leading-none">+</span> New Action
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex flex-col justify-between group hover:border-white/15 transition duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2 bg-white/2 rounded-lg border border-white/6 text-[#E2A54A]">
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                    item.isPositive
                      ? "text-emerald-400 bg-emerald-500/5"
                      : "text-rose-400 bg-rose-500/5"
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {item.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-400 tracking-wide">{item.title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE OPERATIONS TRACKING */}
      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Live Operations Tracking
          </h2>
          <button className="text-xs font-medium text-[#E2A54A] hover:underline flex items-center gap-1">
            View All Map
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-200 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="py-4 px-6">Move ID / Client</th>
                <th className="py-4 px-6">
                  Route Origin <span className="inline-block mx-1 text-slate-600">→</span> Dest
                </th>
                <th className="py-4 px-6">Crew Assigned</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {liveTrackingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/2 transition duration-150">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-200 text-sm">{row.id}</span>
                      <span className="text-xs text-slate-500 mt-0.5 font-medium">
                        {row.client}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span>{row.origin}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      <span>{row.dest}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {row.crewInitials}
                      </div>
                      <span className="text-xs font-medium text-slate-300">{row.crew}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                        row.status === "In Progress"
                          ? "bg-[#E2A54A]/5 border-[#E2A54A]/20 text-[#E2A54A]"
                          : row.status === "Delayed"
                            ? "bg-rose-500/5 border-rose-500/20 text-rose-400"
                            : "bg-white/4 border-white/8 text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          row.status === "In Progress"
                            ? "bg-[#E2A54A]"
                            : row.status === "Delayed"
                              ? "bg-rose-400"
                              : "bg-slate-400"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`text-xs font-mono font-medium ${row.status === "Delayed" ? "text-rose-400 font-sans font-semibold" : "text-slate-300"}`}
                    >
                      {row.eta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPLIT SUB-PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white tracking-tight">Recent Quotes</h2>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-white/2 overflow-x-auto">
            <div className="min-w-100 md:min-w-0">
              {recentQuotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono font-bold text-slate-400">{quote.id}</span>
                  </div>
                  <div className="w-1/3 text-slate-300 font-medium truncate">{quote.company}</div>
                  <div className="text-slate-500 font-medium">{quote.type}</div>
                  <div className="font-mono font-bold text-[#E2A54A] text-right">
                    {quote.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white tracking-tight">Revenue Analytics</h2>
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/6 text-[10px] font-bold uppercase tracking-wider">
              <button className="px-2.5 py-1 text-slate-500 hover:text-slate-300">1W</button>
              <button className="px-2.5 py-1 bg-[#E2A54A]/10 text-[#E2A54A] rounded-md border border-[#E2A54A]/20">
                1M
              </button>
              <button className="px-2.5 py-1 text-slate-500 hover:text-slate-300">1Y</button>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide">
              Total Volume (30d)
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <h3 className="text-3xl font-bold text-white tracking-tight">$245,890</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> 18.2%
              </span>
            </div>
          </div>

          <div className="h-28 w-full mt-6 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E2A54A" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#E2A54A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,90 Q 50,85 100,55 T 200,65 T 300,45 T 400,95 L 400,100 L 0,100 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0,90 Q 50,85 100,55 T 200,65 T 300,45 T 400,95"
                fill="none"
                stroke="#E2A54A"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </svg>
            <span className="absolute bottom-10.5 left-[24%] w-2 h-2 bg-[#E2A54A] rounded-full shadow-[0_0_8px_#E2A54A] border-2 border-[#111315]" />
            <span className="absolute bottom-8 left-[49%] w-2 h-2 bg-[#E2A54A] rounded-full shadow-[0_0_8px_#E2A54A] border-2 border-[#111315]" />
            <span className="absolute bottom-13 left-[74%] w-2 h-2 bg-[#E2A54A] rounded-full shadow-[0_0_8px_#E2A54A] border-2 border-[#111315]" />
            <span className="absolute bottom-0.5 right-[2%] w-2 h-2 bg-white rounded-full shadow-[0_0_8px_fff] border-2 border-[#111315]" />
          </div>

          <div className="absolute left-6 bottom-4 flex flex-col justify-between h-20 text-[9px] font-mono font-bold text-slate-700 pointer-events-none">
            <span>200k</span>
            <span>100k</span>
            <span>0k</span>
          </div>
        </div>
      </div>
    </div>
  );
}
