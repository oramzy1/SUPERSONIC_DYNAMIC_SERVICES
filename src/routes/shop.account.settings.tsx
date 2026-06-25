import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/shop/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/account/settings")({
  component: Settings,
});

function Settings() {
  const { clearCart } = useCart();
  const [name, setName] = useState("Demo Customer");
  const [email, setEmail] = useState("you@example.com");
  const [newsletter, setNewsletter] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </Field>
          <Field label="Email">
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
        <div className="mt-4 space-y-3">
          <Toggle
            label="Newsletter & product updates"
            checked={newsletter}
            onChange={setNewsletter}
          />
          <Toggle
            label="SMS delivery alerts"
            checked={smsAlerts}
            onChange={setSmsAlerts}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => toast.success("Preferences saved")}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Save changes
        </button>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}

const input =
  "h-11 w-full rounded-lg border border-white/10 bg-surface-2 px-3 text-sm focus:border-primary/50 focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-surface-2 p-3 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-primary" : "bg-white/10",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition",
            checked && "translate-x-5",
          )}
        />
      </button>
    </label>
  );
}