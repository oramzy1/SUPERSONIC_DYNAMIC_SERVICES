import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import type { QuoteLineItem, QuoteRequestResponse } from "@/lib/api-types";
import { showErrorText } from "@/lib/toast";

type DraftItem = { description: string; quantity: string; amount: string };

export function GenerateQuoteModal({
  quote,
  busy,
  title = "Generate Quote",
  initialAmount,
  initialLineItems, 
  onClose,
  onSubmit,
}: {
  quote: QuoteRequestResponse;
  busy: boolean;
  title?: string;
  initialAmount?: string;
  initialLineItems?: QuoteLineItem[] | null;
  onClose: () => void;
  onSubmit: (amount: number, validUntilDays: number, lineItems?: QuoteLineItem[]) => void;
}) {
  const [amount, setAmount] = useState(initialAmount ?? "");
  const [validDays, setValidDays] = useState(14);
   const [lineItems, setLineItems] = useState<DraftItem[]>(
    (initialLineItems ?? []).map((li) => ({
      description: li.description,
      quantity: String(li.quantity ?? 1),
      amount: String(li.amount),
    })),
  );


const VAT_RATE = 0.21;
 const itemsSubtotal = lineItems.reduce(
     (sum, li) => sum + (Number(li.quantity) || 0) * (Number(li.amount) || 0),
     0,
   );
const subtotalCents = Math.round(itemsSubtotal * 100);
const vatCents = Math.round(subtotalCents * VAT_RATE);
const totalWithVat = (subtotalCents + vatCents) / 100;
const effectiveAmount = lineItems.length > 0 ? totalWithVat.toFixed(2) : amount;

  const addItem = () => setLineItems((p) => [...p, { description: "", quantity: "1", amount: "" }]);
   const updateItem = (i: number, patch: Partial<DraftItem>) =>
    setLineItems((p) => p.map((li, idx) => (idx === i ? { ...li, ...patch } : li)));
  const removeItem = (i: number) => setLineItems((p) => p.filter((_, idx) => idx !== i));

  const handleConfirm = () => {
    const parsed = Number(effectiveAmount);
    if (!effectiveAmount || Number.isNaN(parsed) || parsed <= 0) {
      showErrorText("Enter a valid amount greater than 0.");
      return;
    }
if (
      lineItems.some(
        (li) =>
          !li.description.trim() || !(Number(li.amount) > 0) || !(Number(li.quantity) >= 1),
      )
    ) {
      showErrorText("Every line item needs a description, a quantity of at least 1, and an amount greater than 0.");
      return;
    }
    if (validDays < 1 || validDays > 90) {
      showErrorText("Validity must be between 1 and 90 days.");
      return;
    }
    onSubmit(
      parsed,
      validDays,
      lineItems.length > 0
        ? lineItems.map((li) => ({
            description: li.description.trim(),
            quantity: Number(li.quantity),
            amount: Number(li.amount),
          }))
        : undefined,
    );
    console.log("[GenerateQuoteModal] submit", { effectiveAmount, validDays, lineItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">
          {title} #{quote.id}
        </h3>
        <p className="mt-1 text-xs text-slate-400 capitalize">
          {quote.move_type.replace("-", " ")}
        </p>
        <p className="mt-1 text-xs text-slate-400">From: {quote.address_from}</p>
        {quote.move_type !== "smart-storage" && (
          <p className="mt-1 text-xs text-slate-400">To: {quote.address_to}</p>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground/60">
              Price (€)
            </label>
            <input
              value={effectiveAmount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={lineItems.length > 0}
              placeholder="e.g. 1250.00"
              inputMode="decimal"
              className="w-full rounded-xs border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#E2A54A]/50 disabled:opacity-60"
            />
            {lineItems.length > 0 && (
              <p className="mt-1 text-[10px] text-foreground/60">
                Subtotal €{(subtotalCents / 100).toFixed(2)} + 21% VAT €
                {(vatCents / 100).toFixed(2)}.
                {initialAmount ? ` Customer countered at €${initialAmount}.` : ""}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground/60">
              Valid for (days)
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full rounded-xs border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#E2A54A]/50"
            />
            <p className="mt-1 text-[10px] text-foreground/60">Max 90 days.</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                Line Items (optional)
              </label>
              <button
                onClick={addItem}
                type="button"
                className="text-[10px] font-bold text-[#E2A54A] hover:underline"
              >
                + Add item
              </button>
            </div>
            <div className="space-y-2">
              {lineItems.map((li, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={li.description}
                    onChange={(e) => updateItem(i, { description: e.target.value })}
                    placeholder="Description"
                    className="flex-1 rounded-xs border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-[#E2A54A]/50"
                  />
                   <input
                    value={li.quantity}
                    onChange={(e) => updateItem(i, { quantity: e.target.value })}
                    placeholder="Qty"
                    inputMode="numeric"
                    className="w-16 rounded-xs border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-[#E2A54A]/50"
                  />
                  <input
                    value={li.amount}
                    onChange={(e) => updateItem(i, { amount: e.target.value })}
                    placeholder="€"
                    inputMode="decimal"
                    className="w-24 rounded-xs border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-[#E2A54A]/50"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    type="button"
                    className="text-foreground/60 hover:text-rose-400 px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-xs px-4 py-2 text-xs font-semibold text-slate-400 hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            className="flex items-center gap-2 rounded-xs bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
            {busy ? "Sending…" : title}
          </button>
        </div>
      </div>
    </div>
  );
}
