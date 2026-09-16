import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, FileText, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { contractsApi } from "@/lib/api";

export const Route = createFileRoute("/contracts/sign/$token")({
  component: ContractSignPage,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function errMsg(err: unknown, fallback: string): string {
  const status = (err as any)?.response?.status;
  const detail = (err as any)?.response?.data?.detail;
  if (status === 404) return "This contract link is invalid or has expired.";
  if (status === 409) return "This contract has already been fully signed.";
  if (typeof detail === "string") return detail;
  return fallback;
}

function ContractSignPage() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [consent, setConsent] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ["contract", token],
    queryFn: () => contractsApi.getByToken(token),
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["contract", token] });

  const signMutation = useMutation({
    mutationFn: () => contractsApi.sign(token, { full_name: fullName, consent }),
    onSuccess: () => { invalidate(); setError(null); },
    onError: (err) => setError(errMsg(err, "Failed to sign the contract. Please try again.")),
  });

  const declineMutation = useMutation({
    mutationFn: () => contractsApi.decline(token, { reason: declineReason || undefined }),
    onSuccess: () => { invalidate(); setError(null); setDeclining(false); },
    onError: (err) => setError(errMsg(err, "Failed to decline the contract. Please try again.")),
  });

  const loadPdf = async () => {
    setLoadingPdf(true);
    try {
      const blob = await contractsApi.downloadPdf(token);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(errMsg(err, "Failed to load the contract PDF."));
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) { setError("Enter your full legal name."); return; }
    if (!consent) { setError("You must confirm consent to sign."); return; }
    setError(null);
    signMutation.mutate();
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" /> Loading your contract...
        </div>
      </SiteLayout>
    );
  }

  if (isError || !contract) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-sm text-muted-foreground">
            This contract link is invalid or has expired. If you believe this is an error, please contact support.
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-16">
        <h1 className="font-display text-3xl font-bold mb-1">Contract {contract.contract_number}</h1>
        <p className="text-sm text-muted-foreground mb-8 capitalize">
          {contract.service_type.replace("-", " ")} · Prepared {formatDate(contract.created_at)}
        </p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 font-medium">
            {error}
          </div>
        )}

        <div className="rounded-2xl bg-surface p-6 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Amount</p><p className="font-bold text-lg">€{contract.amount}</p></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Valid Until</p><p>{formatDate(contract.valid_until)}</p></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Move Date</p><p>{formatDate(contract.move_date)}</p></div>
            <div><p className="text-[10px] uppercase text-muted-foreground mb-1">Delivery Date</p><p>{formatDate(contract.delivery_date)}</p></div>
          </div>
          {contract.additional_services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
              {contract.additional_services.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground text-[10px]">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-surface p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Contract Document</h3>
            {!pdfUrl && (
              <button onClick={loadPdf} disabled={loadingPdf} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                {loadingPdf ? "Loading..." : "View PDF"}
              </button>
            )}
          </div>
          {pdfUrl && <iframe src={pdfUrl} title="Contract PDF" className="w-full h-125 rounded-lg border border-white/10" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-surface p-5">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Your Signature</p>
            {contract.customer_signed?.name ? (
              <>
                <p className="text-sm font-semibold flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> {contract.customer_signed.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDateTime(contract.customer_signed.at)}</p>
              </>
            ) : <p className="text-sm text-muted-foreground">Not signed yet</p>}
          </div>
          <div className="rounded-2xl bg-surface p-5">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Company Signature</p>
            {contract.company_signed?.name ? (
              <>
                <p className="text-sm font-semibold flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> {contract.company_signed.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDateTime(contract.company_signed.at)}</p>
              </>
            ) : <p className="text-sm text-muted-foreground">Awaiting company signature</p>}
          </div>
        </div>

        {contract.status === "signed" && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-emerald-400">This contract is fully executed.</p>
          </div>
        )}
        {contract.status === "declined" && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <XCircle className="h-6 w-6 text-rose-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rose-400">This contract has been declined.</p>
          </div>
        )}
        {contract.status === "expired" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">This contract has expired. Please contact us for a new one.</p>
          </div>
        )}
        {contract.status === "customer_signed" && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
            <p className="text-sm font-semibold text-blue-400">You've signed — awaiting our countersignature.</p>
          </div>
        )}

        {contract.status === "sent" && !declining && (
          <form onSubmit={handleSign} className="rounded-2xl bg-surface p-6 space-y-4">
            <h3 className="text-sm font-bold">Sign This Contract</h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Legal Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As it should appear on the contract"
                className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-white/25"
              />
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded" />
              <span className="text-xs text-muted-foreground">
                I have reviewed the contract above and consent to sign it electronically, agreeing to its terms.
              </span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={signMutation.isPending}
                className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {signMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Sign Contract
              </button>
              <button
                type="button"
                onClick={() => setDeclining(true)}
                className="rounded-xl border border-rose-500/20 text-rose-400 py-3 px-6 text-sm font-bold hover:bg-rose-500/10"
              >
                Decline
              </button>
            </div>
          </form>
        )}

        {contract.status === "sent" && declining && (
          <div className="rounded-2xl bg-surface p-6 space-y-4">
            <h3 className="text-sm font-bold text-rose-400">Decline This Contract</h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Optional — let us know why"
              rows={3}
              className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-white/25"
            />
            <div className="flex gap-3">
              <button onClick={() => setDeclining(false)} className="rounded-xl border border-white/10 py-2.5 px-5 text-xs font-semibold hover:bg-white/5">
                Back
              </button>
              <button
                onClick={() => declineMutation.mutate()}
                disabled={declineMutation.isPending}
                className="flex-1 rounded-xl bg-rose-500/20 text-rose-400 py-2.5 text-sm font-bold hover:bg-rose-500/30 disabled:opacity-50"
              >
                {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}