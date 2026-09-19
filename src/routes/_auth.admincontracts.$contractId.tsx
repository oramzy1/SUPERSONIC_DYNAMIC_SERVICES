import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { contractsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/admincontracts/$contractId")({
  component: ContractDetailPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function errMsg(err: unknown): string {
  return (err as any)?.response?.data?.detail || "Request failed.";
}

function ContractDetailPage() {
  const { contractId } = Route.useParams();
  const id = Number(contractId);
  const queryClient = useQueryClient();

  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ["admin", "contract", id],
    queryFn: () => contractsApi.getById(id),
  });

  const signMutation = useMutation({
    mutationFn: () => contractsApi.companySign(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "contract", id] }),
  });

  if (isLoading) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Contracts", to: "/admincontracts" }, { label: `#${contractId}` }]} />
        <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading contract...</div>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Contracts", to: "/admincontracts" }, { label: `#${contractId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          Contract not found.
          <div className="mt-3"><Link to="/admincontracts" className="text-[#E2A54A] text-xs font-semibold hover:underline">Back</Link></div>
        </div>
      </div>
    );
  }

  const canCompanySign = contract.status === "customer_signed";

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Contracts", to: "/admincontracts" }, { label: contract.contract_number }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{contract.contract_number}</h1>
          <p className="text-sm text-slate-400 mt-1 capitalize">{contract.status.replace("_", " ")} · {contract.customer_name}</p>
        </div>
        {canCompanySign && (
          <button
            onClick={() => signMutation.mutate()}
            disabled={signMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
          >
            {signMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            Sign as Company
          </button>
        )}
      </div>

      {signMutation.isError && (
        <div className="mb-6 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          {errMsg(signMutation.error)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Customer</p><p>{contract.customer_name}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Email</p><p>{contract.customer_email}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Service</p><p className="capitalize">{contract.service_type}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Amount</p><p className="font-mono font-bold">€{contract.amount}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Move Date</p><p>{formatDate(contract.move_date)}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Delivery Date</p><p>{formatDate(contract.delivery_date)}</p></div>
          </div>
          {contract.additional_services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/6">
              {contract.additional_services.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/4 border border-white/6 text-slate-400 text-[10px]">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Signatures</h3>
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-1">Customer</p>
            {contract.customer_signed?.name ? (
              <p className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" /> {contract.customer_signed.name} — {formatDateTime(contract.customer_signed.at)}</p>
            ) : <p className="text-sm text-slate-500">Not signed yet</p>}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-1">Company</p>
            {contract.company_signed?.name ? (
              <p className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" /> {contract.company_signed.name} — {formatDateTime(contract.company_signed.at)}</p>
            ) : <p className="text-sm text-slate-500">{canCompanySign ? "Ready to sign" : "Awaiting customer signature first"}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}