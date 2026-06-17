import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarCheck, CalendarClock, CreditCard, Download, Leaf } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const STATS = [
  { icon: CalendarCheck, label: "Active Moves", value: "12", note: "+2 today" },
  { icon: Leaf, label: "Total Carbon Saved", value: "142.8", unit: "TONNES", note: "Global Top 5%" },
  { icon: CalendarClock, label: "Upcoming Appointments", value: "04", note: "Next: 2h 40m" },
  { icon: CreditCard, label: "Credit Balance", value: "€8,450.00", note: "Auto-refill on" },
];

const MOVES = [
  { id: "#VL-88201", dest: "Paris Hub", sub: "Electronic Components", date: "Oct 12, 2023", status: "delivered" },
  { id: "#VL-88194", dest: "London Dock", sub: "Sustainable Textiles", date: "Oct 08, 2023", status: "delivered" },
  { id: "#VL-87520", dest: "Warsaw Rail", sub: "Medical Equipment", date: "Oct 02, 2023", status: "cancelled" },
  { id: "#VL-87520", dest: "Warsaw Rail", sub: "Medical Equipment", date: "Oct 02, 2023", status: "cancelled" },
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "delivered"
      ? "bg-primary/20 text-primary border-primary/40"
      : "bg-red-500/15 text-red-400 border-red-500/40";
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

function DashboardHome() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Status Report</p>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">Welcome back, Clinton</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4 text-foreground/80" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{s.note}</p>
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold">
                {s.value}
                {s.unit && <span className="ml-2 text-[10px] tracking-[0.2em] text-muted-foreground">{s.unit}</span>}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Move History</h2>
          <button className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6FE5FF] hover:opacity-80">
            View All Archive
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-170">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <th className="pb-4">Assignment ID</th>
                <th className="pb-4">Destination</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOVES.map((m, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-5 font-medium">{m.id}</td>
                  <td className="py-5">
                    <p className="font-medium">{m.dest}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </td>
                  <td className="py-5 text-muted-foreground">{m.date}</td>
                  <td className="py-5"><StatusBadge status={m.status} /></td>
                  <td className="py-5 text-right">
                    <button
                      className={`inline-grid h-8 w-8 place-items-center rounded-lg bg-[#002B73]/40 text-[#6FE5FF] transition hover:bg-[#002B73]/70 ${m.status === "cancelled" ? "opacity-40" : ""}`}
                      disabled={m.status === "cancelled"}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
