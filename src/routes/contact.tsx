import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { CTAButton } from "@/components/shared/CTAButton";
import { useLoading } from "@/contexts/LoadingContext";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us - Supersonic Dynamic Services B.V." },
      {
        name: "description",
        content:
          "Get in touch with Supersonic Dynamic Services B.V. Call +31 (06) 84 336 600 or email us. We're available Monday to Friday, 8:30–17:30.",
      },
    ],
  }),
});

const schema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1),
  message: z.string().min(10, "Tell us a bit more"),
});
type FormData = z.infer<typeof schema>;

function Contact() {
  const { show, hide } = useLoading();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "General Inquiry" },
  });

  const onSubmit = async (data: FormData) => {
    show("Sending your message…");
    await new Promise((r) => setTimeout(r, 1100));
    hide();
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="primary">Global Operations</Pill>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
          Need Help? <br /> Contact Us Now.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Are you having trouble with any of our services or you have a question and would you like
          to know more information about a potential collaboration? Please contact us using the
          contact form below. We'll do our best to respond as quickly as possible.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-surface p-6 border border-white/5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                <p className="font-display text-lg font-semibold">Email Us</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                info@supersonicdynamicservices.nl
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-6 border border-white/5">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                <p className="font-display text-lg font-semibold">Call Center</p>
              </div>
              <p className="mt-3 font-display text-lg">+31 (06) 84 336 600</p>
            </div>
            <div className="overflow-hidden rounded-2xl bg-surface border border-white/5">
              <iframe
                title="map"
                className="h-72 w-full"
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.45,51.91,4.55,51.96&layer=mapnik"
              />
              <div className="p-4">
                <p className="font-display text-base font-semibold">Netherlands</p>
                <p className="text-xs text-muted-foreground">Dynamic Hub Delta-7, 3011 Rotterdam</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl bg-surface p-6 md:p-8 border border-white/5"
          >
            <h3 className="font-display text-2xl font-semibold">Send Us Messages</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full Name" error={errors.fullName?.message}>
                <input
                  className="field w-full rounded-lg px-3 py-2.5 text-sm"
                  placeholder="e.g. Alex Chen"
                  {...register("fullName")}
                />
              </Field>
              <Field label="Company">
                <input
                  className="field w-full rounded-lg px-3 py-2.5 text-sm"
                  placeholder="Global Logistics Inc."
                  {...register("company")}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Email Address" error={errors.email?.message}>
                <input
                  className="field w-full rounded-lg px-3 py-2.5 text-sm"
                  placeholder="alex@company.com"
                  {...register("email")}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Subject of Inquiry">
                <select
                  className="field w-full rounded-lg px-3 py-2.5 text-sm"
                  {...register("subject")}
                >
                  <option>General Inquiry</option>
                  <option>Quote Request</option>
                  <option>Partnership</option>
                  <option>Support</option>
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Your Message" error={errors.message?.message}>
                <textarea
                  rows={5}
                  className="field w-full rounded-lg px-3 py-2.5 text-sm"
                  placeholder="How can we accelerate your dynamic growth?"
                  {...register("message")}
                />
              </Field>
            </div>
            <CTAButton variant="primary" className="mt-6 w-full rounded-xl py-3.5" type="submit">
              Send Now <Send className="h-4 w-4" />
            </CTAButton>
            {sent && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm text-primary"
              >
                Message sent - we'll be in touch shortly.
              </motion.p>
            )}
          </form>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl bg-surface p-6 md:flex-row md:items-center md:p-10">
          <div>
            <h3 className="font-display text-2xl font-semibold">Have Any Issues?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our support team are ready to assist with help
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/schedulecall">
              <CTAButton variant="white" className="rounded-xl px-6">
                Schedule a Call
              </CTAButton>
            </Link>

            <Link to="/support">
              <CTAButton variant="outline" className="rounded-xl px-6">
                Chat with our Support
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/80">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
