import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck2, ShieldCheck, ChevronRight, UsersRound } from "lucide-react";
import { accountApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/admincustomers/")({
  component: RouteComponent,
});

function initials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const ROLE_STYLES: Record<string, string> = {
  customer: "bg-white/4 border-white/6 text-slate-400",
  crew: "bg-blue-500/5 border-blue-500/10 text-blue-400/90",
  dispatcher: "bg-violet-500/5 border-violet-500/10 text-violet-400/90",
  admin: "bg-[#E2A54A]/10 border-[#E2A54A]/20 text-[#E2A54A]",
  finance: "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/90",
};

function RouteComponent() {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("All");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });

  const roleOptions = ["All", ...Array.from(new Set(users.map((u) => u.role)))];
  const visible = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);

  const activeCount = users.filter((u) => u.is_active).length;
  const customerCount = users.filter((u) => u.role === "customer").length;

  const customerMetrics = [
    { title: "TOTAL ACCOUNTS", value: String(users.length), icon: Users },
    { title: "ACTIVE ACCOUNTS", value: String(activeCount), icon: UserCheck2 },
    { title: "CUSTOMERS", value: String(customerCount), icon: ShieldCheck },
  ];

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Customers" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customer Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and monitor all accounts across every role.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {customerMetrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 flex flex-col justify-between h-32">
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{card.title}</span>
                <div className="text-slate-600"><Icon className="w-4 h-4" /></div>
              </div>
              <h3 className="text-3xl font-bold tracking-tight font-mono text-white mt-2">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl overflow-hidden flex flex-col mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-white/6">
          <div className="flex items-center bg-black/20 p-1 rounded-lg border border-white/6 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-fit overflow-x-auto">
            {roleOptions.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                  roleFilter === r
                    ? "bg-[#E2A54A]/10 text-[#E2A54A] border border-[#E2A54A]/10"
                    : "hover:text-slate-200"
                }`}
              >
                {r === "All" ? "All" : r}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                <th className="py-4 px-6">ACCOUNT</th>
                <th className="py-4 px-6">CONTACT</th>
                <th className="py-4 px-6">ROLE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">JOINED</th>
                <th className="py-4 px-6 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2">
              {isLoading ? (
                <tr><td colSpan={6} className="py-14 px-6 text-center text-xs text-slate-500">Loading accounts...</td></tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-2.5 bg-white/2 rounded-lg border border-white/6 text-slate-500 mb-1">
                        <UsersRound className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">No accounts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navigate({ to: "/admincustomers/$userId", params: { userId: String(u.id) } })}
                    className="hover:bg-white/2 transition duration-150 cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.profile_image_url ? (
                          <img src={u.profile_image_url} className="w-7 h-7 rounded-full object-cover border border-white/6" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/4 border border-white/6 flex items-center justify-center text-[11px] font-bold text-slate-400">
                            {initials(u.full_name)}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-200 tracking-tight">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs font-mono font-medium text-slate-400">
                      {u.email}
                      {u.phone && <span className="block text-slate-600">{u.phone}</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border ${ROLE_STYLES[u.role] || "bg-white/4 border-white/6 text-slate-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {u.is_anonymized ? (
                        <span className="text-[9px] font-bold uppercase text-slate-500">Anonymized</span>
                      ) : u.is_active ? (
                        <span className="text-[9px] font-bold uppercase text-emerald-400">Active</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-rose-400">Inactive</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-400">{formatDate(u.created_at)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-[#E2A54A] text-[10px] font-bold uppercase">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-400 font-semibold">{visible.length}</span> of{" "}
            <span className="text-slate-400 font-semibold">{users.length}</span> accounts
          </span>
        </div>
      </div>
    </div>
  );
}