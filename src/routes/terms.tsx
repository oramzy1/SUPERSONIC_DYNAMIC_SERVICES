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
        <div className="rounded-xl bg-black/30 p-4">
          <p className="text-sm font-semibold">3.1 Validation</p>
          <p className="mt-1 text-xs text-muted-foreground">Quotations remain valid for a period of 14 business days, after which technical availability cannot be guaranteed.</p>
        </div>
        <div className="rounded-xl bg-black/30 p-4">
          <p className="text-sm font-semibold">3.2 Execution</p>
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
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-muted-foreground">
        <p>Cancellation fees are structured based on notice period:</p>
        <p className="text-sm text-muted-foreground">
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
      <div className="rounded-xl bg-black/30 p-4 text-sm text-muted-foreground">
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
