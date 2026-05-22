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
    "How do I request a moving quote?",
    "Use our Request a Quote form - fill in details, upload a short video or description, and we'll get back to you within 24 hours.",
  ],
  [
    "Do you operate across the entire Netherlands?",
    "Yes. We provide local and long-distance moving services across every province in the Netherlands.",
  ],
  [
    "Is your fleet really 100% electric?",
    "Yes - our entire delivery fleet runs on electric power, certified for zero-emission operations.",
  ],
  [
    "What does pricing include?",
    "All quotes are transparent and all-inclusive: labour, packing materials, transport, and fuel. No hidden fees.",
  ],
  [
    "Can I reschedule or cancel?",
    "Yes. Cancellations more than 48 hours in advance are free. See our Terms for full details.",
  ],
  [
    "Do you offer storage?",
    "We offer secure, monitored short-term and long-term storage facilities.",
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
