import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, BarChart3, Leaf, Download, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { accountApi, invoicesApi, jobsApi, quotesApi } from "@/lib/api";

export const Route = createFileRoute("/_auth/adminanalytics")({
  component: AnalyticsDashboard,
});

interface RevenueBucket {
  label: string;
  total: number;
}

interface FunnelSegment {
  segment: string;
  qty: string;
  width: string;
  delay: string;
}

interface ServiceVolume {
  label: string;
  value: string;
  pct: string;
  delay: string;
}

interface TopCrew {
  name: string;
  completedJobs: number;
}

function pctChangeLabel(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
}

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "YTD">("30D");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const { data: invoices = [] } = useQuery({
    queryKey: ["admin", "invoices"],
    queryFn: () => invoicesApi.list(),
  });
  const { data: quotes = [] } = useQuery({
    queryKey: ["admin", "quotes", "all"],
    queryFn: () => quotesApi.listRequests(),
  });
  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });
  const { data: allJobs = [] } = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: () => jobsApi.list(),
  });

  const now = new Date();
  const periodStart =
    timeframe === "7D"
      ? (() => {
          const d = new Date(now);
          d.setDate(d.getDate() - 6);
          d.setHours(0, 0, 0, 0);
          return d;
        })()
      : timeframe === "30D"
        ? (() => {
            const d = new Date(now);
            d.setDate(d.getDate() - 29);
            d.setHours(0, 0, 0, 0);
            return d;
          })()
        : new Date(now.getFullYear(), 0, 1);

  const periodLengthMs = now.getTime() - periodStart.getTime();
  const prevPeriodStart = new Date(periodStart.getTime() - periodLengthMs);
  const prevPeriodEnd = periodStart;

  // ── Revenue ──────────────────────────────────────────────────────────
  const paidInvoices = invoices.filter((i) => i.status.toLowerCase() === "sent");
  const paidInPeriod = paidInvoices.filter((i) => new Date(i.created_at) >= periodStart);
  const paidInPrevPeriod = paidInvoices.filter(
    (i) => new Date(i.created_at) >= prevPeriodStart && new Date(i.created_at) < prevPeriodEnd,
  );

  const revenueTotalNum = paidInPeriod.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);
  const prevRevenueTotalNum = paidInPrevPeriod.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);
  const revenueTotal = `€${revenueTotalNum.toFixed(2)}`;
  const revenueChange = pctChangeLabel(revenueTotalNum, prevRevenueTotalNum);

  const revenueBuckets: RevenueBucket[] = (() => {
    if (timeframe === "YTD") {
      const months: RevenueBucket[] = [];
      const cur = new Date(periodStart);
      while (cur <= now) {
        months.push({ label: cur.toLocaleDateString("en-GB", { month: "short" }), total: 0 });
        cur.setMonth(cur.getMonth() + 1);
      }
      paidInPeriod.forEach((inv) => {
        const d = new Date(inv.created_at);
        const idx = (d.getFullYear() - periodStart.getFullYear()) * 12 + (d.getMonth() - periodStart.getMonth());
        if (months[idx]) months[idx].total += parseFloat(inv.total_amount || "0");
      });
      return months;
    }
    const days: RevenueBucket[] = [];
    const cur = new Date(periodStart);
    while (cur <= now) {
      days.push({ label: cur.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), total: 0 });
      cur.setDate(cur.getDate() + 1);
    }
    paidInPeriod.forEach((inv) => {
      const d = new Date(inv.created_at);
      d.setHours(0, 0, 0, 0);
      const idx = Math.round((d.getTime() - periodStart.getTime()) / (24 * 60 * 60 * 1000));
      if (days[idx]) days[idx].total += parseFloat(inv.total_amount || "0");
    });
    return days;
  })();

  const maxBucket = Math.max(1, ...revenueBuckets.map((b) => b.total));
  const labelStep = Math.max(1, Math.ceil(revenueBuckets.length / 7));

  // ── Acquisition ──────────────────────────────────────────────────────
  const quotesInPeriod = quotes.filter((q) => new Date(q.created_at) >= periodStart);
  const leads = quotesInPeriod.length;
  const qualified = quotesInPeriod.filter((q) =>
    ["quoted", "accepted", "counter_offered"].includes(q.status),
  ).length;
  const closed = quotesInPeriod.filter((q) => q.status === "accepted").length;

  const acquisitionFunnel: FunnelSegment[] = [
    { segment: "Leads (Quote Requests)", qty: String(leads), width: "100%", delay: "0.3s" },
    {
      segment: "Qualified (Quoted+)",
      qty: String(qualified),
      width: `${leads > 0 ? Math.min(100, (qualified / leads) * 100) : 0}%`,
      delay: "0.4s",
    },
    {
      segment: "Closed (Accepted)",
      qty: String(closed),
      width: `${leads > 0 ? Math.min(100, (closed / leads) * 100) : 0}%`,
      delay: "0.5s",
    },
  ];

  const customersInPeriod = users.filter((u) => u.role === "customer" && new Date(u.created_at) >= periodStart);
  const customersInPrevPeriod = users.filter(
    (u) =>
      u.role === "customer" &&
      new Date(u.created_at) >= prevPeriodStart &&
      new Date(u.created_at) < prevPeriodEnd,
  );
  const newClients = customersInPeriod.length;
  const newClientsChange = pctChangeLabel(newClients, customersInPrevPeriod.length);

  // ── Service volume ───────────────────────────────────────────────────
  const volumeMap = new Map<string, number>();
  quotesInPeriod.forEach((q) => volumeMap.set(q.move_type, (volumeMap.get(q.move_type) ?? 0) + 1));
  const volumeEntries = [...volumeMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxVolume = Math.max(1, ...volumeEntries.map(([, v]) => v));
  const serviceVolume: ServiceVolume[] = volumeEntries.map(([label, value], idx) => ({
    label: label.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${value} request${value === 1 ? "" : "s"}`,
    pct: `${(value / maxVolume) * 100}%`,
    delay: `${0.2 + idx * 0.1}s`,
  }));

  // ── Crew leaderboard (all-time completed jobs) ──────────────────────
  const crewCounts = new Map<number, TopCrew>();
  allJobs
    .filter((j) => j.status === "completed")
    .forEach((j) => {
      (j.crew_members ?? []).forEach((c) => {
        const entry = crewCounts.get(c.id) ?? { name: c.full_name, completedJobs: 0 };
        entry.completedJobs += 1;
        crewCounts.set(c.id, entry);
      });
    });
  const topCrews = [...crewCounts.values()].sort((a, b) => b.completedJobs - a.completedJobs).slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto text-[#626d7c] font-sans antialiased space-y-6">
      <style>{`
        @keyframes countUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stat-pop {
          opacity: 0;
          animation: countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* TOP CONTEXT BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Overview</h1>
          <p className="text-xs text-[#626d7c] mt-1">Performance metrics for the current period</p>
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

          <button
            disabled
            title="No export endpoint exists in the API yet"
            className="flex items-center gap-1.5 bg-white/5 text-slate-500 font-bold text-[11px] tracking-wide px-3 py-1.5 rounded transition-all uppercase whitespace-nowrap cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            Export Report
          </button>
        </div>
      </div>

      {/* GRID ROW 1: REVENUE GROWTH GRAPH & ACQUISITION FUNNEL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between relative min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Revenue Growth</h2>
              <p className="text-xs text-[#626d7c] mt-0.5">
                Paid invoices, {timeframe === "YTD" ? "year to date" : `last ${timeframe.toLowerCase()}`}
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-3xl font-bold text-[#e2a54a] tracking-tight animate-stat-pop"
                style={{ animationDelay: "0.1s" }}
              >
                {revenueTotal}
              </div>
              <div className="text-[11px] text-[#626d7c] flex items-center justify-end gap-1 mt-1 font-medium">
                <span>{revenueChange}</span>
                <span className="text-[#626d7c]">vs previous period</span>
              </div>
            </div>
          </div>

          <div className="w-full h-48 mt-6 flex items-end gap-1">
            {revenueBuckets.map((b, idx) => (
              <div key={idx} className="flex-1 h-full flex flex-col items-center justify-end group">
                <div
                  className="w-full bg-[#e2a54a]/70 group-hover:bg-[#e2a54a] rounded-sm transition-all"
                  style={{
                    height: isLoaded ? `${Math.max(2, (b.total / maxBucket) * 100)}%` : "0%",
                    transitionDuration: "1s",
                    transitionDelay: `${idx * 0.02}s`,
                  }}
                  title={`${b.label}: €${b.total.toFixed(2)}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pl-1 pr-1 mt-2 pt-2">
            {revenueBuckets
              .filter((_, idx) => idx % labelStep === 0)
              .map((b, idx) => (
                <span key={idx} className="text-[10px] font-medium font-sans text-[#2d3643]">
                  {b.label}
                </span>
              ))}
          </div>

          {paidInPeriod.length === 0 && (
            <p className="text-[11px] font-medium text-[#2d3643] text-center mt-2">
              No paid invoices in this window yet
            </p>
          )}
        </div>

        {/* Client Acquisition */}
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Acquisition</h2>
              <p className="text-xs text-[#626d7c] mt-0.5">NEW CUSTOMER ACCOUNTS</p>
            </div>
            <Users className="h-4 w-4 text-[#626d7c]" />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <div
              className="text-4xl font-bold text-white tracking-tight animate-stat-pop"
              style={{ animationDelay: "0.2s" }}
            >
              {newClients}
            </div>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] bg-white/5 text-[#626d7c] font-bold mt-1 font-mono">
              {newClientsChange}
            </span>
          </div>

          <div className="space-y-4 mt-6">
            {acquisitionFunnel.map((item, index) => (
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

      {/* GRID ROW 2: SERVICE VOLUME AND CREW LEADERBOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Volume by Service Type</h2>
            </div>
            <BarChart3 className="h-4 w-4 text-[#626d7c]" />
          </div>

          <div className="space-y-4">
            {serviceVolume.length === 0 ? (
              <p className="text-[11px] text-[#626d7c] text-center py-8">No quote requests in this window yet</p>
            ) : (
              serviceVolume.map((item, idx) => (
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
              ))
            )}
          </div>
        </div>

        {/* Crew leaderboard */}
        <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-6 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">Top Performing Crews</h2>
              <p className="text-[11px] text-[#626d7c] mt-0.5">All-time completed jobs</p>
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
                  <th className="pb-3 font-semibold">Crew Member</th>
                  <th className="pb-3 font-semibold text-right">Completed Jobs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161b22]/40">
                {topCrews.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="p-2.5 bg-white/2 rounded-lg border border-[#161b22] text-[#626d7c] mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium text-white">No crew data yet</p>
                        <p className="text-[11px] text-[#626d7c] max-w-2xs">
                          Rankings will appear once jobs start completing.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  topCrews.map((crew, idx) => (
                    <tr key={idx} className="text-xs hover:bg-[#1c2330]/20 transition-colors duration-150">
                      <td className="py-3.5 font-bold text-white font-mono">{crew.name}</td>
                      <td className="py-3.5 text-right text-white font-bold font-mono">{crew.completedJobs}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SUSTAINABILITY ROW */}
      <div className="bg-[#0c1017] border border-[#161b22] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#4ade80]/5 border border-[#4ade80]/10 flex items-center justify-center text-[#4ade80]">
            <Leaf className="h-5 w-5 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">Carbon Offset Tracking</h3>
            <p className="text-xs text-[#626d7c] mt-0.5">
              Not tracked by the API yet — no sustainability endpoint exists
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 text-right self-end md:self-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">CO2 Reduced</span>
            <span className="text-base font-bold text-slate-600 font-mono mt-0.5 block">—</span>
          </div>
          <div className="h-8 w-px bg-[#161b22]"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">
              EV Fleet Usage
            </span>
            <span className="text-base font-bold text-slate-600 font-mono mt-0.5 block">—</span>
          </div>
          <div className="h-8 w-px bg-[#161b22]"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#2d3643] tracking-wider block">
              Goal Progress
            </span>
            <span className="text-base font-bold text-slate-600 font-mono mt-0.5 block">—</span>
          </div>
        </div>
      </div>
    </div>
  );
}