import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/shop/cart";
import type { Address } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/accounts/addresses")({
  component: Addresses,
});

function Addresses() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress } =
    useCart();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Address>({
    id: "",
    label: "Home",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "Netherlands",
    phone: "",
    isDefault: addresses.length === 0,
  });

  const submit = () => {
    if (!draft.fullName || !draft.line1 || !draft.city || !draft.postcode) {
      toast.error("Please complete the required fields");
      return;
    }
    saveAddress({ ...draft, id: crypto.randomUUID() });
    toast.success("Address saved");
    setAdding(false);
    setDraft({
      id: "",
      label: "Home",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      postcode: "",
      country: "Netherlands",
      phone: "",
      isDefault: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Saved addresses</h2>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add address
        </button>
      </div>

      {addresses.length === 0 && !adding && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-surface/40 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">
            No saved addresses
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add an address to speed up checkout next time.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={cn(
              "rounded-2xl border bg-surface p-5",
              a.isDefault ? "border-primary/40" : "border-white/8",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-sm font-semibold">{a.label}</p>
              {a.isDefault ? (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                  Default
                </span>
              ) : (
                <button
                  onClick={() => setDefaultAddress(a.id)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  Set default
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {a.fullName}
              <br />
              {a.line1}
              {a.line2 && `, ${a.line2}`}
              <br />
              {a.postcode} {a.city}, {a.country}
              <br />
              {a.phone}
            </p>
            <button
              onClick={() => removeAddress(a.id)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="rounded-2xl border border-white/8 bg-surface p-5">
          <h3 className="font-display text-base font-semibold">New address</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input
              label="Label"
              value={draft.label}
              onChange={(v) => setDraft({ ...draft, label: v })}
            />
            <Input
              label="Full name"
              value={draft.fullName}
              onChange={(v) => setDraft({ ...draft, fullName: v })}
            />
            <Input
              full
              label="Street address"
              value={draft.line1}
              onChange={(v) => setDraft({ ...draft, line1: v })}
            />
            <Input
              full
              label="Apartment / suite"
              value={draft.line2 ?? ""}
              onChange={(v) => setDraft({ ...draft, line2: v })}
            />
            <Input
              label="Postcode"
              value={draft.postcode}
              onChange={(v) => setDraft({ ...draft, postcode: v })}
            />
            <Input
              label="City"
              value={draft.city}
              onChange={(v) => setDraft({ ...draft, city: v })}
            />
            <Input
              label="Phone"
              value={draft.phone}
              onChange={(v) => setDraft({ ...draft, phone: v })}
            />
            <Input
              label="Country"
              value={draft.country}
              onChange={(v) => setDraft({ ...draft, country: v })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setAdding(false)}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Save address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1 block text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-white/10 bg-surface-2 px-3 text-sm focus:border-primary/50 focus:outline-none"
      />
    </label>
  );
}