import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, ChevronLeft, ChevronRight, GraduationCap, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/quotes")({
  component: QuotesPage,
});

const TABS = ["All", "Active", "Completed", "Past"] as const;

const STATS = [
  { label: "Total Quotes", value: "42", note: "+12%" },
  { label: "Active Missions", value: "08" },
  { label: "Carbon Saved", value: "1.2", unit: "tn" },
  { label: "Avg. Estimate", value: "$2,450", highlight: true },
];

const QUOTES = [
  { id: "#VL-89021", icon: Truck, service: "Enterprise Logistics", date: "Oct 24, 2023", status: "Active", estimate: "$4,200.00" },
  { id: "#VL-88942", icon: GraduationCap, service: "Student Moving", date: "Oct 21, 2023", status: "Completed", estimate: "$850.00" },
  { id: "#VL-88711", icon: Zap, service: "Flash Delivery", date: "Oct 18, 2023", status: "Pending", estimate: "$1,240.00" },
  { id: "#VL-88600", icon: Briefcase, service: "Corporate Relocation", date: "Oct 12, 2023", status: "Completed", estimate: "$12,800.00" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-primary/20 text-primary",
    Completed: "bg-white/10 text-foreground/80",
    Pending: "bg-[#6FE5FF]/15 text-[#6FE5FF]",
  };
  return (
    <span className={cn("rounded-md px-3 py-1 text-xs font-semibold", map[status])}>{status}</span>
  );
}

function QuotesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Quote History</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Track your logistic efficiency and manage upcoming supersonic fleet deployments.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition",
                tab === t ? "bg-white text-[#0E141A]" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl p-5",
              s.highlight ? "bg-primary text-primary-foreground" : "bg-surface",
            )}
          >
            <p className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", s.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {s.label}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-display text-3xl font-bold">
                {s.value}
                {s.unit && <span className="ml-1 text-sm">{s.unit}</span>}
              </p>
              {s.note && <span className="text-xs font-semibold text-primary">{s.note}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-4">Quote ID</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Deployment Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Estimate</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {QUOTES.map((q) => {
                const Icon = q.icon;
                return (
                  <tr key={q.id} className="text-sm">
                    <td className="px-6 py-5 font-medium">{q.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
                          <Icon className="h-4 w-4" />
                        </span>
                        {q.service}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">{q.date}</td>
                    <td className="px-6 py-5"><StatusBadge status={q.status} /></td>
                    <td className="px-6 py-5 text-right font-semibold">{q.estimate}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[#6FE5FF] hover:opacity-80">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-muted-foreground">Showing 4 of 42 results</p>
          <div className="flex gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
