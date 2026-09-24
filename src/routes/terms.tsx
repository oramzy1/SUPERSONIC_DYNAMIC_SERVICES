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
        <p><span className="font-semibold text-foreground">1.1 Supersonic:</span> Supersonic Dynamic Services B.V., the service provider, specializing in the services mentioned</p>
        <p><span className="font-semibold text-foreground">1.2 Client:</span> Any natural or legal person who enters into an agreement with Supersonic for the execution of a job or an assignments.</p>
        <p><span className="font-semibold text-foreground">1.3 Assignment:</span> The specific request for services as defined in the confirmed quotation or digital service agreement.</p>
      </div>
    ),
  },
  { n: "02", title: "Article 2: Quotation Request", body: <p className="text-sm text-muted-foreground">All quotation requests are handled via the Supersonic digital interface. The Client is responsible for the accuracy of the data provided. Any discrepancy in information provided may lead to immediate adjustment and delay in response.</p> },
  {
    n: "03",
    title: "Article 3: Quotation and assignment execution",
    body: (
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-foreground">3.1 Validation</p>
          <p className="mt-1 text-xs text-muted-foreground">Quotations remain valid for a period of 14 business days, after which technical availability cannot be guaranteed.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-foreground">3.2 Execution</p>
          <p className="mt-1 text-xs text-muted-foreground">Supersonic reserves the right to employ third-party specialist partners to fulfil specific segments of a job.</p>
        </div>
      </div>
    ),
  },
  { n: "04", title: "Article 4: Price Quote and Timeframe", body: <p className="text-sm text-muted-foreground">Upon requesting a quote, 
  the client will receive a price quote for the work and the timeframe within which the work will be completed. The quoted price and timeframe are fixed. 
  If the approximate price and timeframe is at risk of being exceeded by more than 10%, SUPERSONIC DYNAMIC SERVICES B.V. will contact the client to discuss the additional costs.</p> },
  {
    n: "05",
    title: "Article 5: Cancelling an appointment",
    body: (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-red-800">Cancellation fees are structured based on notice period:</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The client has the right to cancel an appointment free of charge 48 hours to the scheduled date and time for the assignment execution. This cancellation can only be made in writing by email.
        </p>
        <p className="text-sm mt-4 text-muted-foreground">
          In case of cancellation 24 hours to the execution of the assignment SUPERSONIC DYNAMIC SERVICES B.V. will charge a fee of 15% of the total price quoted for the assignment.
        </p>
      </div>
    ),
  },
  { n: "06", title: "Article 6: Inspection after delivery", body: <p className="text-sm text-muted-foreground">The client is obligated to inspect the work performed immediately upon completion either in person 
  physically or digitally via videos of job completion sent to the client depending on preference. If it appears that the agreed-upon assignment has been performed incorrectly or incompletely, the client must immediately 
  within a maximum of 3 working days from the completion of the assignment report the situation in writing via the contact form to SUPERSONIC DYNAMIC SERVICES B.V. A suitable solution will be agreed upon in consultation with SUPERSONIC DYNAMIC SERVICES B.V.</p> },
  {
    n: "07",
    title: "Article 7: Liability",
    body: (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground">
        <p className="">SUPERSONIC DYNAMIC SERVICES B.V. liability is limited to direct damage caused by us during execution of the assignment for a client, up to a maximum as stipulated in SUPERSONIC DYNAMIC SERVICES B.V.  All-in Movers Verhuizerspolis=full mover coverage for all handling + transport + Temp. Storage.</p>
      </div>
    ),
  },
  { n: "08", title: "Article 8: Invoicing", body: <p className="text-sm text-muted-foreground">Via the assignment status tracker page,  you will be able to view your itemized invoice and make payments by clicking the view invoice summary button as soon as the assignment status tracker shows assignment completed. All prices include VAT and payment of invoices must be made within 7 days from the date recorded on the invoice.</p> },
  { n: "09", title: "Article 9: Final provision", body: <p className="text-sm text-muted-foreground">In all cases not provided for in these General Terms and Conditions, the decision rests solely with SUPERSONIC DYNAMIC SERVICES B.V.</p> },
];

function Terms() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
          <Pill variant="primary" dot>Regulatory Compliance</Pill>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">General Terms <br /> & Conditions</h1>
          <div className="mt-4 h-1 w-32 rounded-full bg-primary" />

          <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-1 rounded-2xl border border-border bg-surface p-3 shadow-sm lg:sticky lg:top-24 lg:self-start">
              {ARTICLES.map((a) => (
                <a key={a.n} href={`#a${a.n}`} className="block rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary">
                  {a.title}
                </a>
              ))}
            </aside>
            <div className="space-y-6">
              {ARTICLES.map((a) => (
                <div key={a.n} id={`a${a.n}`} className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                  <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">{a.n}</span>
                    <h2 className="font-display text-xl font-semibold text-foreground">{a.title}</h2>
                  </div>
                  {a.body}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-xl shadow-primary/20 md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold">Need a Portable Version?</h3>
                <p className="mt-1 text-sm text-white/85">Download the full General Terms and Conditions in PDF format for your records.</p>
              </div>
              <CTAButton variant="secondary" className="rounded-xl bg-white! text-primary! hover:bg-white/90!">
                <Download className="h-4 w-4" /> Download Terms
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}