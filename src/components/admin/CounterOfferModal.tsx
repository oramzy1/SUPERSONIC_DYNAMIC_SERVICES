import { useState } from "react";
import { Loader2 } from "lucide-react";

export function CounterOfferModal({
  currentAmount,
  busy,
  onClose,
  onSubmit,
}: {
  currentAmount?: string;
  busy: boolean;
  onClose: () => void;
  onSubmit: (amount: string, message?: string) => void;
}) {
  const [amount, setAmount] = useState(currentAmount ?? "");
  const [message, setMessage] = useState("");
  const valid = /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0c1017] p-6">
        <h2 className="text-sm font-bold text-white">Counter Offer</h2>
        <p className="mt-1 text-xs text-slate-500">
          Responds on the existing negotiation — the customer can accept, reject or counter again.
        </p>

        <label className="mt-5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Your amount (€)
        </label>
        <input
          autoFocus
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#E2A54A]/40"
        />

        <label className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Message (optional)
        </label>
        <textarea
          rows={3}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200 outline-none focus:border-[#E2A54A]/40"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={busy}
            className="rounded-md px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(amount, message.trim() || undefined)}
            disabled={busy || !valid}
            className="flex items-center gap-1.5 rounded-md bg-[#E2A54A] px-3 py-1.5 text-[10px] font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50">
            {busy && <Loader2 className="h-3 w-3 animate-spin" />} Send Counter
          </button>
        </div>
      </div>
    </div>
  );
}