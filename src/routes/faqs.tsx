import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RequestQuoteBanner } from "./index";

export const Route = createFileRoute("/faqs")({
  component: FAQs,
  head: () => ({
  meta: [
    { title: "Frequently Asked Questions - Supersonic Dynamic Services B.V." },
    {
      name: "description",
      content:
        "Find answers to common questions about our moving services, pricing, booking process, electric fleet and coverage across the Netherlands.",
    },
  ],
}),
});

const FAQS = [
  [
    "What services does SUPERSONIC DYNAMIC SERVICES B.V. provide?",
    "SUPERSONIC DYNAMIC SERVICES B.V. provides professional moving and logistics services across the Netherlands, including student and micro moving, residential moving (local and long-distance), enterprise and commercial moving, and general local and long-distance freight haulage services. We handle a wide range of household goods, equipment, supplies, and commercial items with professionalism, care, and attention to detail.",
  ],
  [
    "Where do you operate?",
    "Our moving services operate across all cities in; the Limburg province, the North Brabant province, the Utrecht province and the North Holland province in the Netherlands, covering both local and long-distance relocations within and between these cities. But, our freight haulage services spans across all regions in the Netherlands and EU countries like Germany, Belgium and Luxembourg.",
  ],
  [
    "What happens after the move is completed?",
    "The client is required to inspect the completed work immediately after the assignment is finished, either in person or through the job completion photos and videos provided by our team. If there are any concerns regarding the service delivered, they must be reported in writing through our contact form within 3 working days of completion so that we can review the issue and provide an appropriate resolution..",
  ],
  [
    "How can I request a quote?",
    "You can request a quote by completing our online quotation form and providing a written description of the job, along with a short video showing the items to be moved and the estimated space they occupy. This allows us to prepare a more accurate and transparent quotation. For large commercial or enterprise relocations, a site visit and pre-project survey may be required before a quote can be issued.",
  ],
  [
    "How long is my quotation valid?",
    "Once issued, your quotation remains valid for 14 days from the date of issue. Your move or service request is confirmed only after you accept the quotation and send us a confirmation by email. Upon confirmation, we will proceed with the next steps required to schedule and execute your assignment.",
  ],
  [
    "When will I receive my invoice?",
    "Once your assignment is marked as Completed in the Assignment Status Tracker, you will be able to view your itemized invoice by clicking the View Invoice Summary button. From there, you can review the invoice details and complete your payment securely through the available payment options. All prices include VAT, and payment must be made within 7 days of the invoice date.",
  ],
];

function FAQs() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="primary" dot>
          Help Center
        </Pill>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-muted-foreground">
          Quick answers about our services, pricing, and operations.
        </p>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQS.map(([q, a], i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-white/5 bg-surface px-5"
            >
              <AccordionTrigger className="text-left font-display text-base">{q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <RequestQuoteBanner />
    </SiteLayout>
  );
}
