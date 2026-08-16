import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Building2,
  UserCheck,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

export const Route = createFileRoute("/_auth/admincustomers")({
  component: RouteComponent,
});

// ── Types ────────────────────────────────────────────────────────────────
// Mirrors what the backend is expected to return once it's wired up.

interface CustomerMetric {
  title: string;
  value: string;
  change?: string;
  subtext?: string;
  isAlert?: boolean;
  icon: React.ElementType;
}

interface CustomerRecord {
  name: string;
  email: string;
  avatarType: "initials" | "image";
  avatarText: string;
  imageUrl?: string;
  totalJobs: string;
  lastActive: string;
  accountType: "Corporate" | "Individual";
}

// ── Placeholder data (all zeroed / empty until backend is connected) ──────

const customerMetrics: CustomerMetric[] = [
  {
    title: "TOTAL ACTIVE CUSTOMERS",
    value: "0",
    change: "0%",
    icon: Users,
  },
  {
    title: "CORPORATE ACCOUNTS",
    value: "0",
    subtext: "accounts",
    icon: Building2,
  },
  {
    title: "PENDING APPROVALS",
    value: "0",
    subtext: "Requires attention",
    isAlert: false,
    icon: UserCheck,
  },
];

const customerRecords: CustomerRecord[] = [];

const rangeStart = 0;
const rangeEnd = 0;
const totalEntries = 0;
const pendingVerifications = 0;

function RouteComponent() {
  return (
    <div className="w-full text-slate-200 select-none pb-12">
      {/* CONTENT SECTION TITLE AND UTILITY HOOKS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customer Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and monitor all enterprise and individual accounts.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Export Data Secondary Action */}
          <button className="flex items-center gap-2 px-3.5 py-2 bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:bg-white/5 transition duration-150">
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Data
          </button>

          {/* Add Customer Main Action CTA */}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#E2A54A] text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg hover:bg-[#d4963b] transition duration-200">
            <span className="text-sm font-normal leading-none">+</span> Add Customer
          </button>
        </div>
      </div>

      {/* SYSTEM SUMMARY CARD MATRIX CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {customerMetrics.map((card, idx) => {
          const Icon = card.icon;
          const isNeutral = card.change === "0%";
          return (
            <div
              key={idx}
              className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-32"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </span>
                <div className="text-slate-600">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <h3
                  className={`text-3xl font-bold tracking-tight font-mono ${card.isAlert ? "text-rose-400" : "text-white"}`}
                >
                  {card.value}
                </h3>
                {card.change && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-0.5 ${
                      isNeutral ? "text-slate-500 bg-white/4" : "text-emerald-400 bg-emerald-500/5"
                    }`}
                  >
                    {isNeutral ? card.change : `↗ ${card.change}`}
                  </span>
                )}
                {card.subtext && (
                  <span
                    className={`text-xs font-medium ml-0.5 ${card.isAlert ? "text-rose-400/70" : "text-slate-500"}`}
                  >
                    {card.subtext}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN DATASHEET INTERFACE WRAPPER */}
      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col mb-6">
        {/* DATA VIEW FILTERS HUB BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-white/6">
          {/* Segmentation Sorting Segment Pills */}
          <div className="flex items-center bg-black/20 p-1 rounded-lg border border-white/6 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-fit">
            <button className="px-3 py-1 bg-[#E2A54A]/10 text-[#E2A54A] rounded-md border border-[#E2A54A]/10">
              All
            </button>
            <button className="px-3 py-1 hover:text-slate-200 transition-colors">Corporate</button>
            <button className="px-3 py-1 hover:text-slate-200 transition-colors">Individual</button>
          </div>

          {/* Layout Dropdown Sequencer */}
          <div className="flex items-center justify-end">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/6 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" /> Sort by: Last Active
            </button>
          </div>
        </div>

        {/* CORE TABLE MATRIX ENGINE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">CONTACT</th>
                <th className="py-4 px-6">TOTAL JOBS</th>
                <th className="py-4 px-6">LAST ACTIVE</th>
                <th className="py-4 px-6 text-right">TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {customerRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                        <UsersRound className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No customers yet</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        New accounts will show up here as soon as customers sign up.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customerRecords.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition duration-150">
                    {/* Name Label and Node Mark */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {row.avatarType === "image" ? (
                          <img
                            src={row.imageUrl}
                            alt={row.name}
                            className="w-7 h-7 rounded-full object-cover border border-white/6 shadow-inner"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/4 border border-white/6 flex items-center justify-center text-[11px] font-bold text-slate-400 font-sans">
                            {row.avatarText}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-200 tracking-tight">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Contact Communications Route Channels */}
                    <td className="py-4 px-6 text-xs font-mono font-medium text-slate-400">
                      {row.email}
                    </td>

                    {/* Activity Density Track Metrics */}
                    <td className="py-4 px-6 text-xs font-mono font-bold text-slate-300">
                      {row.totalJobs}
                    </td>

                    {/* Chronological Active Timestamps */}
                    <td className="py-4 px-6 text-xs font-medium text-slate-400">
                      {row.lastActive}
                    </td>

                    {/* Functional Account Tier Badging */}
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${
                          row.accountType === "Corporate"
                            ? "bg-blue-500/5 border border-blue-500/10 text-blue-400/90"
                            : "bg-white/4 border border-white/6 text-slate-400"
                        }`}
                      >
                        {row.accountType}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DIRECTORY PAGINATION DATA ENGINE FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-400 font-semibold">{rangeStart} to {rangeEnd}</span> of{" "}
            <span className="text-slate-400 font-semibold">{totalEntries}</span> entries
          </span>

          {/* Data controls indexes layout */}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-md border border-white/6 text-slate-600 hover:text-slate-400 disabled:opacity-20 transition-colors"
              disabled
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 text-xs font-bold font-mono rounded bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/20">
              1
            </button>
            <button
              className="p-1.5 rounded-md border border-white/6 text-slate-600 hover:text-slate-400 disabled:opacity-20 transition-colors"
              disabled
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SYSTEM EXTENSION: MEANINGFUL SUB-TABLE SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-white/2 text-slate-500 rounded-lg border border-white/6">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">
              VIP Client Velocity Boost
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Standout account trends will appear here once activity data comes in.
            </p>
          </div>
        </div>

        <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-white/2 text-slate-500 rounded-lg border border-white/6">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">
              Verification Check Required
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pendingVerifications} individual accounts are pending business credential
              verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}