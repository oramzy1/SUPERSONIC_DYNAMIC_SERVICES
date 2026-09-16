import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/payment/success")({
  component: PaymentSuccessPage,
  // Mollie's redirect query params aren't documented in the OpenAPI spec, so
  // this stays permissive rather than asserting a shape it might not match.
  validateSearch: (search: Record<string, unknown>) => search,
});

function PaymentSuccessPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-6">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Payment Received</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thanks — your payment has gone through. A receipt will be emailed to you shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/jobs" className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-90">
            View My Jobs
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}