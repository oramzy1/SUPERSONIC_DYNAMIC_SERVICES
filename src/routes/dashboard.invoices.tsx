import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ChevronLeft, ChevronRight, FileText, Filter, Home, Leaf, ListFilter, TrendingUp, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/dashboard/invoices")({
  component: InvoicesPage,
});

const SUMMARY = [
  { label: "Total Outstanding", value: "€142,500", note: "12%", sub: "Across 14 pending shipments" },
  { label: "Recently Paid", value: "€89,240", note: "4%", sub: "Last 30 days performance" },
  { label: "Next Due Date", value: "Oct 24", badge: "48H LEFT", sub: "Supersonic Express ID: #6772" },
];

const INVOICES = [
  { id: "#INV-8829", date: "Oct 12, 2023", icon: Home, type: "Residential Move", amount: "€4,250.00", status: "PAID" },
  { id: "#INV-8831", date: "Oct 14, 2023", icon: Truck, type: "Industrial Fleet", amount: "€12,100.00", status: "PENDING" },
  { id: "#INV-8792", date: "Sep 28, 2023", icon: TrendingUp, type: "Express Logistics", amount: "€1,840.50", status: "OVERDUE" },
  { id: "#INV-8845", date: "Oct 16, 2023", icon: Leaf, type: "Carbon Offset Delivery", amount: "€950.00", status: "PAID" },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-primary text-primary-foreground",
    PENDING: "bg-[#3B82F6] text-white",
    OVERDUE: "bg-red-500/90 text-white",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", map[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {status}
    </span>
  );
}

function ActionCell({ status }: { status: string }) {
  if (status === "PENDING")
    return (
      <button className="rounded-md bg-[#3B82F6]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9DB4FE] hover:bg-[#3B82F6]/30">
        Pay Now
      </button>
    );
  if (status === "OVERDUE")
    return (
      <button className="rounded-md bg-red-500/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-200 hover:bg-red-500/35">
        Remind
      </button>
    );
  return (
    <button className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-muted-foreground hover:text-foreground">
      <FileText className="h-4 w-4" />
    </button>
  );
}

function InvoicesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Financial Hub</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Invoices</h1>
        </div>
        <div className="flex gap-3">
          <CTAButton variant="outline" className="rounded-lg px-5 py-2.5">Export CSV</CTAButton>
          <CTAButton variant="white" className="rounded-lg px-5 py-2.5">
            <ArrowDownToLine className="mr-1 h-4 w-4" /> Quarterly Report
          </CTAButton>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {SUMMARY.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-surface p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl" />
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-display text-3xl font-bold">{s.value}</p>
              {s.note && <span className="text-xs font-semibold text-primary">~{s.note}</span>}
              {s.badge && (
                <span className="rounded-md bg-[#6FE5FF]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[#6FE5FF]">
                  {s.badge}
                </span>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-surface">
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <h2 className="font-display text-lg font-semibold">Transaction History</h2>
          <div className="flex gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
              <ListFilter className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {INVOICES.map((inv) => {
                const Icon = inv.icon;
                return (
                  <tr key={inv.id} className="text-sm">
                    <td className="px-6 py-5 font-medium text-[#6FE5FF]">{inv.id}</td>
                    <td className="px-6 py-5 text-muted-foreground">{inv.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        {inv.type}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold">{inv.amount}</td>
                    <td className="px-6 py-5"><StatusPill status={inv.status} /></td>
                    <td className="px-6 py-5"><ActionCell status={inv.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-muted-foreground">Showing 4 of 248 invoices</p>
          <div className="flex gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-md text-sm font-medium",
                  n === 1 ? "bg-[#3B82F6] text-white" : "bg-white/5 text-muted-foreground hover:text-foreground",
                )}
              >
                {n}
              </button>
            ))}
            <button className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
