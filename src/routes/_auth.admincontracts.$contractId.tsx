import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { contractsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { showError, showSuccess } from "@/lib/toast";

export const Route = createFileRoute("/_auth/admincontracts/$contractId")({
  component: ContractDetailPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function ContractDetailPage() {
  const { contractId } = Route.useParams();
  const id = Number(contractId);
  const queryClient = useQueryClient();

  const {
    data: contract,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "contract", id],
    queryFn: () => contractsApi.getById(id),
  });

  const signMutation = useMutation({
    mutationFn: () => contractsApi.companySign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contract", id] });
      showSuccess("Contract signed as company.");
    },
    onError: (err) => showError(err, "Failed to sign the contract."),
  });

  if (isLoading) {
    return (
      <div className="w-full text-foreground/80">
        <Breadcrumbs
          items={[{ label: "Contracts", to: "/admincontracts" }, { label: `#${contractId}` }]}
        />
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading contract...
        </div>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="w-full text-foreground/80">
        <Breadcrumbs
          items={[{ label: "Contracts", to: "/admincontracts" }, { label: `#${contractId}` }]}
        />
        <div className="bg-surface border border-white/6 rounded-xs p-8 text-center text-sm text-foreground/60">
          Contract not found.
          <div className="mt-3">
            <Link
              to="/admincontracts"
              className="text-[#E2A54A] text-xs font-semibold hover:underline"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canCompanySign = contract.status === "customer_signed";
  const canViewContract = !!contract.customer_signed?.name;

  return (
    <div className="w-full text-foreground/80 select-none pb-12">
      <Breadcrumbs
        items={[{ label: "Contracts", to: "/admincontracts" }, { label: contract.contract_number }]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
            {contract.contract_number}
          </h1>
          <p className="text-sm text-foreground/60 mt-1 capitalize">
            {contract.status.replace("_", " ")} · {contract.customer_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canViewContract && (
            <a
              href={contract.contract_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xs bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/15"
            >
              <FileText className="w-3.5 h-3.5" />
              View Contract
            </a>
          )}
          {canCompanySign && (
            <button
              onClick={() => signMutation.mutate()}
              disabled={signMutation.isPending}
              className="flex items-center gap-2 rounded-xs bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
            >
              {signMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              Sign as Company
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-white/6 rounded-xs p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">
            Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Customer</p>
              <p>{contract.customer_name}</p>
            </div>
            <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Email</p>
              <p>{contract.customer_email}</p>
            </div>
            <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Service</p>
              <p className="capitalize">{contract.service_type}</p>
            </div>
            <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Amount</p>
              <p className="font-mono font-bold">€{contract.amount}</p>
            </div>
            <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Move Date</p>
              <p>{formatDate(contract.move_date)}</p>
            </div>
          {
            contract.delivery_date && (
                          <div>
              <p className="text-[10px] text-foreground/60 uppercase mb-1">Delivery Date</p>
              <p>{formatDate(contract.delivery_date)}</p>
            </div>
            )
          }
          </div>
          {contract.additional_services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/6">
              {contract.additional_services.map((s: any, i: any) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-white/4 border border-white/6 text-slate-400 text-[10px] capitalize"
                >
                  {s.replace("_", " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-white/6 rounded-xs p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60">
            Signatures
          </h3>
          <div>
            <p className="text-[10px] text-foreground/60 uppercase mb-1">Customer</p>
            {contract.customer_signed?.name ? (
              <p className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {contract.customer_signed.name} -{" "}
                {formatDateTime(contract.customer_signed.at)}
              </p>
            ) : (
              <p className="text-sm text-foreground/60">Not signed yet</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-foreground/60 uppercase mb-1">Company</p>
            {contract.company_signed?.name ? (
              <p className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {contract.company_signed.name} -{" "}
                {formatDateTime(contract.company_signed.at)}
              </p>
            ) : (
              <p className="text-sm text-foreground/60">
                {canCompanySign ? "Ready to sign" : "Awaiting customer signature first"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
