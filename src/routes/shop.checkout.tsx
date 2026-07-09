import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, CreditCard, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/shop/cart";
import { computeLineTotal, formatEUR } from "@/lib/shop/format";
import type { Address } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({ meta: [{ title: "Checkout - Supersonic Shop" }] }),
  component: CheckoutPage,
});

const STEPS = ["Customer", "Delivery", "Shipping", "Payment", "Review"] as const;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totals, shippingMethod, setShippingMethod, placeOrder, saveAddress } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "Netherlands",
    saveAddr: true,
    payment: "card",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  });

  const update = (k: keyof typeof form, v: string | boolean) => setForm((s) => ({ ...s, [k]: v }));

  const valid = useMemo(() => {
    const e = /\S+@\S+\.\S+/.test(form.email);
    return {
      0: e && form.firstName.length > 1 && form.phone.length >= 6,
      1: form.line1.length > 2 && form.city.length > 1 && form.postcode.length >= 4,
      2: !!shippingMethod,
      3:
        form.payment === "card"
          ? form.cardName.length > 2 &&
            form.cardNumber.replace(/\s/g, "").length >= 12 &&
            form.cardExp.length >= 4 &&
            form.cardCvc.length >= 3
          : true,
      4: true,
    } as Record<number, boolean>;
  }, [form, shippingMethod]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a product before checking out.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const next = () => {
    if (!valid[step]) {
      toast.error("Please complete the required fields");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onPlace = () => {
    const address: Address = {
      id: crypto.randomUUID(),
      label: "Delivery",
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      postcode: form.postcode,
      country: form.country,
      phone: form.phone,
      isDefault: true,
    };
    if (form.saveAddr) saveAddress(address);
    const order = placeOrder({
      address,
      email: form.email,
      shippingMethod:
        shippingMethod === "standard"
          ? "Standard delivery"
          : shippingMethod === "express"
            ? "Express delivery"
            : "Pickup",
      paymentMethod: form.payment === "card" ? "Card" : "iDEAL",
    });
    toast.success(`Order ${order.number} placed`);
    navigate({
      to: "/shop/account/orders/$id",
      params: { id: order.id },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/shop/cart"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back to cart
      </Link>

      <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Checkout</h1>

      {/* Stepper */}
      <ol className="mt-6 grid gap-2 sm:grid-cols-5">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : done
                    ? "border-[#79FF5B]/40 bg-[#79FF5B]/10 text-[#79FF5B]"
                    : "border-white/8 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full text-[10px]",
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-[#79FF5B] text-background"
                      : "bg-white/10",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {s}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/8 bg-surface p-6">
          {step === 0 && (
            <Section title="Customer information">
              <Grid>
                <Field label="Email address" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={input}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={input}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="First name" required>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className={input}
                    autoComplete="given-name"
                  />
                </Field>
                <Field label="Last name">
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className={input}
                    autoComplete="family-name"
                  />
                </Field>
              </Grid>
            </Section>
          )}

          {step === 1 && (
            <Section title="Delivery information">
              <Grid>
                <Field label="Address line 1" required full>
                  <input
                    value={form.line1}
                    onChange={(e) => update("line1", e.target.value)}
                    className={input}
                    autoComplete="address-line1"
                  />
                </Field>
                <Field label="Address line 2" full>
                  <input
                    value={form.line2}
                    onChange={(e) => update("line2", e.target.value)}
                    className={input}
                    autoComplete="address-line2"
                  />
                </Field>
                <Field label="Postcode" required>
                  <input
                    value={form.postcode}
                    onChange={(e) => update("postcode", e.target.value)}
                    className={input}
                    autoComplete="postal-code"
                  />
                </Field>
                <Field label="City" required>
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={input}
                    autoComplete="address-level2"
                  />
                </Field>
                <Field label="Country" required>
                  <select
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className={input}
                  >
                    <option>Netherlands</option>
                    <option>Belgium</option>
                    <option>Germany</option>
                    <option>Luxembourg</option>
                  </select>
                </Field>
                <label className="col-span-full mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={form.saveAddr}
                    onChange={(e) => update("saveAddr", e.target.checked)}
                    className="accent-primary"
                  />
                  Save this address to my account
                </label>
              </Grid>
            </Section>
          )}

          {step === 2 && (
            <Section title="Shipping method">
              <div className="space-y-2">
                {(
                  [
                    {
                      id: "standard",
                      label: "Standard delivery",
                      hint: "2-3 business days · Free over €75",
                      price: 7.95,
                    },
                    {
                      id: "express",
                      label: "Express delivery",
                      hint: "Next business day",
                      price: 19.95,
                    },
                    {
                      id: "pickup",
                      label: "Pickup at business address",
                      hint: "Always free",
                      price: 0,
                    },
                  ] as const
                ).map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm",
                      shippingMethod === m.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-white/8 hover:border-white/20",
                    )}
                  >
                    <input
                      type="radio"
                      name="ship"
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                      className="accent-primary"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.hint}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {m.price === 0 ? "Free" : formatEUR(m.price)}
                    </span>
                  </label>
                ))}
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Payment method">
              <div className="space-y-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm",
                    form.payment === "card" ? "border-primary/40 bg-primary/5" : "border-white/8",
                  )}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={form.payment === "card"}
                    onChange={() => update("payment", "card")}
                    className="accent-primary"
                  />
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Credit / debit card</span>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm",
                    form.payment === "ideal" ? "border-primary/40 bg-primary/5" : "border-white/8",
                  )}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={form.payment === "ideal"}
                    onChange={() => update("payment", "ideal")}
                    className="accent-primary"
                  />
                  <span className="grid h-4 w-6 place-items-center rounded bg-secondary text-[8px] font-bold">
                    iD
                  </span>
                  <span className="font-semibold">iDEAL</span>
                </label>

                {form.payment === "card" && (
                  <Grid className="pt-2">
                    <Field label="Name on card" required full>
                      <input
                        value={form.cardName}
                        onChange={(e) => update("cardName", e.target.value)}
                        className={input}
                        autoComplete="cc-name"
                      />
                    </Field>
                    <Field label="Card number" required full>
                      <input
                        value={form.cardNumber}
                        onChange={(e) => update("cardNumber", e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className={input}
                        autoComplete="cc-number"
                      />
                    </Field>
                    <Field label="Expiry" required>
                      <input
                        value={form.cardExp}
                        onChange={(e) => update("cardExp", e.target.value)}
                        placeholder="MM/YY"
                        className={input}
                        autoComplete="cc-exp"
                      />
                    </Field>
                    <Field label="CVC" required>
                      <input
                        value={form.cardCvc}
                        onChange={(e) => update("cardCvc", e.target.value)}
                        placeholder="123"
                        className={input}
                        autoComplete="cc-csc"
                      />
                    </Field>
                  </Grid>
                )}

                <p className="flex items-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" /> Payments are encrypted in transit and processed by
                  our PCI-DSS compliant provider.
                </p>
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section title="Review your order">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Contact
                  </p>
                  <p className="mt-1">{form.email}</p>
                  <p className="text-muted-foreground">{form.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Delivery
                  </p>
                  <p className="mt-1 font-medium">
                    {form.firstName} {form.lastName}
                  </p>
                  <p className="text-muted-foreground">
                    {form.line1}
                    {form.line2 && `, ${form.line2}`}, {form.postcode} {form.city}, {form.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Items
                  </p>
                  <ul className="mt-2 divide-y divide-white/8">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-center justify-between gap-3 py-2">
                        <span className="min-w-0 truncate">
                          {i.quantity} × {i.name}
                          {i.rental && ` (${i.durationDays}d)`}
                        </span>
                        <span className="font-semibold">{formatEUR(computeLineTotal(i))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={onPlace}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Place order · {formatEUR(totals.total)}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-3 rounded-2xl border border-white/8 bg-surface p-5">
          <h2 className="font-display text-base font-semibold">Order summary</h2>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Qty {i.quantity}
                    {i.rental && ` · ${i.durationDays}d`}
                  </p>
                </div>
                <span className="text-xs font-semibold">{formatEUR(computeLineTotal(i))}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-white/8 pt-3 text-sm">
            <Row label="Subtotal" value={formatEUR(totals.subtotal)} />
            {totals.discount > 0 && (
              <Row label="Promo" value={`−${formatEUR(totals.discount)}`} accent />
            )}
            <Row
              label="Shipping"
              value={totals.shipping === 0 ? "Free" : formatEUR(totals.shipping)}
            />
            <Row label="VAT (21%)" value={formatEUR(totals.vat)} />
            <div className="mt-2 flex justify-between border-t border-white/8 pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatEUR(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const input =
  "h-11 w-full rounded-lg border border-white/10 bg-surface-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={cn(accent && "text-[#79FF5B]")}>{value}</span>
    </div>
  );
}
