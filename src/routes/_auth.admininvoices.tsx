import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  CircleDollarSign,
  Receipt,
  FileSearch,
} from "lucide-react";

export const Route = createFileRoute("/_auth/admininvoices")({
  component: RouteComponent,
});

// ── Types ────────────────────────────────────────────────────────────────
// Mirrors what the backend is expected to return once it's wired up.

interface InvoiceMetric {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext: string;
  isAlert?: boolean;
  icon: React.ElementType;
}

interface InvoiceRow {
  id: string;
  customer: string;
  amount: string;
  dueDate: string;
  method: string;
  status: "Paid" | "Overdue" | "Processing";
}

// ── Placeholder data (all zeroed / empty until backend is connected) ──────

const invoiceMetrics: InvoiceMetric[] = [
  {
    title: "TOTAL OUTSTANDING",
    value: "$0",
    change: "0%",
    isPositive: true,
    subtext: "vs last month",
    icon: Wallet,
  },
  {
    title: "REVENUE THIS MONTH",
    value: "$0",
    change: "0%",
    isPositive: true,
    subtext: "vs last month",
    icon: TrendingUp,
  },
  {
    title: "FAILED PAYMENTS",
    value: "0",
    subtext: "$0 total value",
    isAlert: false,
    icon: AlertTriangle,
  },
];

const invoicesList: InvoiceRow[] = [];

const rangeStart = 0;
const rangeEnd = 0;
const totalEntries = 0;
const nextPayoutAmount = "$0.00";
const remindersSentToday = 0;

function RouteComponent() {
  return (
    <div className="w-full text-slate-200 select-none pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Financial Tracking</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage invoices, track payments, and monitor revenue.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 transition">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#d4963b] transition">
            + New Invoice
          </button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {invoiceMetrics.map((card, idx) => {
          const Icon = card.icon;
          const isNeutral = card.change === "0%";
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-34"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </span>
                <div className="text-slate-600">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex flex-col">
                <h3
                  className={`text-2xl font-bold tracking-tight font-mono ${card.isAlert ? "text-rose-400" : "text-white"}`}
                >
                  {card.value}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {card.change && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isNeutral
                          ? "text-slate-500 bg-white/4"
                          : "text-emerald-400 bg-emerald-500/5"
                      }`}
                    >
                      {isNeutral ? card.change : `${card.isPositive ? "↗" : "↘"} ${card.change}`}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-medium ${card.isAlert ? "text-rose-400/70" : "text-slate-500"}`}
                  >
                    {card.subtext}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INVOICES DATASHEET TABLE */}
      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col mb-6">
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Invoices</h2>
          <button className="text-slate-500 hover:text-slate-300">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <th className="py-4 px-6">INVOICE #</th>
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6">DUE DATE</th>
                <th className="py-4 px-6">METHOD</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-xs">
              {invoicesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                        <FileSearch className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No invoices yet</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Invoices will show up here as soon as jobs are billed.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoicesList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-300">{row.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-300">{row.customer}</td>
                    <td className="py-4 px-6 font-mono font-bold text-white">{row.amount}</td>
                    <td
                      className={`py-4 px-6 font-medium ${row.status === "Overdue" ? "text-rose-400" : "text-slate-400"}`}
                    >
                      {row.dueDate}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-600" /> {row.method}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold ${
                          row.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : row.status === "Overdue"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-amber-500/10 text-[#E2A54A]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="px-2.5 py-1 bg-white/1 border border-white/6 text-[9px] font-bold tracking-wider uppercase rounded text-slate-400 hover:text-white transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/1">
          <span className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-400 font-medium">
              {rangeStart} to {rangeEnd}
            </span>{" "}
            of <span className="text-slate-400 font-medium">{totalEntries}</span> entries
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded border border-white/6 text-slate-600" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 text-xs font-bold font-mono rounded bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/20">
              1
            </button>
            <button className="p-1.5 rounded border border-white/6 text-slate-600" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MEANINGFUL DETAIL METRICS BELOW TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center gap-3">
          <CircleDollarSign className="w-5 h-5 text-slate-500" />
          <div>
            <h4 className="text-xs font-bold text-white">Next Payout Cycle</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Estimated {nextPayoutAmount} clear value once a payout is scheduled.
            </p>
          </div>
        </div>
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center gap-3">
          <Receipt className="w-5 h-5 text-slate-500" />
          <div>
            <h4 className="text-xs font-bold text-white">Automated Reminders</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {remindersSentToday} collection reminders routed to overdue accounts today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
