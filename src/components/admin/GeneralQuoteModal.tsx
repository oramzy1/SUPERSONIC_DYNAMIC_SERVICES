import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import type { QuoteRequestResponse } from "@/lib/api-types";

export function GenerateQuoteModal({
  quote,
  busy,
  title = "Generate Quote",
  initialAmount,
  onClose,
  onSubmit,
}: {
  quote: QuoteRequestResponse;
  busy: boolean;
  title?: string;
  initialAmount?: string;
  onClose: () => void;
  onSubmit: (amount: string, validUntilDays: number) => void;
}) {
  const [amount, setAmount] = useState(initialAmount ?? "");
  const [validDays, setValidDays] = useState(14);
  const [formError, setFormError] = useState<string | null>(null);

  const handleConfirm = () => {
    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setFormError("Enter a valid amount greater than 0.");
      return;
    }
    if (validDays < 1 || validDays > 90) {
      setFormError("Validity must be between 1 and 90 days.");
      return;
    }
    setFormError(null);
    onSubmit(amount, validDays);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{title} #{quote.id}</h3>
        <p className="mt-1 text-xs text-slate-400">
          {quote.move_type.replace("-", " ")} · {quote.address_from} → {quote.address_to}
        </p>

        {formError && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {formError}
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Price (€)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1250.00"
              inputMode="decimal"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#E2A54A]/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Valid for (days)
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#E2A54A]/50"
            />
            <p className="mt-1 text-[10px] text-slate-500">Max 90 days.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
            {busy ? "Sending…" : title}
          </button>
        </div>
      </div>
    </div>
  );
}