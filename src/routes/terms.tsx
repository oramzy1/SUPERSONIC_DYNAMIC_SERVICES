import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { CTAButton } from "@/components/shared/CTAButton";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
  meta: [
    { title: "General Terms and Conditions - Supersonic Dynamic Services B.V." },
    {
      name: "description",
      content:
        "Read the general terms and conditions of Supersonic Dynamic Services B.V. governing our moving and freight haulage services across the Netherlands.",
    },
  ],
}),
});

const ARTICLES = [
  {
    n: "01",
    title: "Article 1: Definitions",
    body: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>In these General Terms and Conditions, the following definitions apply:</p>
        <p><span className="font-semibold text-foreground">1.1 Supersonic:</span> Supersonic Dynamic Services B.V., the service provider specializing in precision engineered logistics and dynamic distribution solutions.</p>
        <p><span className="font-semibold text-foreground">1.2 Client:</span> Any natural or legal person who enters into an agreement with Supersonic for the execution of logistics or technical assignments.</p>
        <p><span className="font-semibold text-foreground">1.3 Assignment:</span> The specific request for services as defined in the confirmed quotation or digital service agreement.</p>
      </div>
    ),
  },
  { n: "02", title: "Article 2: Quotation Request", body: <p className="text-sm text-muted-foreground">All quotation requests are handled via the Supersonic digital interface. The Client is responsible for the accuracy of the data provided. Any discrepancy in weight, volume, or technical requirements may lead to immediate adjustment of the quotation or refusal of the assignment.</p> },
  {
    n: "03",
    title: "Article 3: Quotation and assignment execution",
    body: (
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-black/30 p-4">
          <p className="text-sm font-semibold">3.1 Validation</p>
          <p className="mt-1 text-xs text-muted-foreground">Quotations remain valid for a period of 14 business days, after which technical availability cannot be guaranteed.</p>
        </div>
        <div className="rounded-xl bg-black/30 p-4">
          <p className="text-sm font-semibold">3.2 Execution</p>
          <p className="mt-1 text-xs text-muted-foreground">Supersonic reserves the right to employ third-party specialist partners to fulfil specific segments of the kinetic pulse logistics chain.</p>
        </div>
      </div>
    ),
  },
  { n: "04", title: "Article 4: Price Quote and Timeframe", body: <p className="text-sm text-muted-foreground">Prices are calculated based on current energy costs and dynamic network utilization. Timeframes are provided as high-probability estimates. While Supersonic strives for "Supersonic Speed", external factors like infrastructure failure or force majeure may alter delivery windows.</p> },
  {
    n: "05",
    title: "Article 5: Cancelling an appointment",
    body: (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-muted-foreground">
        <p>Cancellation fees are structured based on notice period:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>&gt; 48 hours: No fee applicable.</li>
          <li>24–48 hours: 50% of the scheduled service value.</li>
          <li>&lt; 24 hours: 100% of the scheduled service value.</li>
        </ul>
      </div>
    ),
  },
  { n: "06", title: "Article 6: Inspection after delivery", body: <p className="text-sm text-muted-foreground">The Client is required to inspect the delivered goods or executed service immediately upon arrival. Claims regarding visible defects must be logged digitally within 2 hours of delivery receipt.</p> },
  {
    n: "07",
    title: "Article 7: Liability",
    body: (
      <div className="rounded-xl bg-black/30 p-4 text-sm text-muted-foreground">
        <p className="italic">Supersonic Dynamic Services B.V. maintains industry-leading insurance coverage for all logistical operations.</p>
        <p className="mt-3">Liability for indirect or consequential loss, including loss of profit or missed savings, is explicitly excluded. Supersonic's total liability is limited to the amount paid by the insurance provider or the total value of the specific assignment invoice.</p>
      </div>
    ),
  },
  { n: "08", title: "Article 8: Invoicing", body: <p className="text-sm text-muted-foreground">Payment terms are strictly 14 days from the date of invoice unless otherwise agreed in writing. Automated late fees will be applied to the kinetic tracking system for any overdue balances.</p> },
  { n: "09", title: "Article 9: Final provision", body: <p className="text-sm text-muted-foreground">Dutch law applies to all legal relationships between Supersonic and the Client. The District Court of Amsterdam has exclusive jurisdiction over disputes.</p> },
];

function Terms() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="primary" dot>Regulatory Compliance</Pill>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">General Terms <br /> & Conditions</h1>
        <div className="mt-4 h-1 w-32 rounded-full bg-primary" />

        <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2 lg:sticky lg:top-24 lg:self-start">
            {ARTICLES.map((a) => (
              <a key={a.n} href={`#a${a.n}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
                {a.title}
              </a>
            ))}
          </aside>
          <div className="space-y-6">
            {ARTICLES.map((a) => (
              <div key={a.n} id={`a${a.n}`} className="rounded-2xl bg-surface p-6 md:p-8 border border-white/5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-display text-2xl text-primary">{a.n}</span>
                  <h2 className="font-display text-xl font-semibold">{a.title}</h2>
                </div>
                {a.body}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-[#9DB1E6]/90 p-8 text-[#0E141A] md:p-10">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold">Need a Portable Version?</h3>
              <p className="mt-1 text-sm text-[#0E141A]/80">Download the full General Terms and Conditions in PDF format for your records.</p>
            </div>
            <CTAButton variant="secondary" className="rounded-xl bg-[#0E141A] text-white hover:bg-black">
              <Download className="h-4 w-4" /> Download Terms
            </CTAButton>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
