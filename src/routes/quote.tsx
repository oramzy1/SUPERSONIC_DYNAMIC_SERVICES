import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  FileText,
  MapPin,
  Phone,
  Truck,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Pill } from "@/components/shared/Pill";
import { CTAButton } from "@/components/shared/CTAButton";
import { useLoading } from "@/contexts/LoadingContext";
import vanHero from "@/assets/images/hero-van.jpg";

export const Route = createFileRoute("/quote")({
  component: Quote,
});

const step1 = z.object({
  serviceType: z.enum(["service-1", "service-2"]),
  name: z.string().min(2, "Required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Required"),
  residentAddress: z.string().min(2),
  destinationAddress: z.string().min(2),
  currentPostCode: z.string().min(2),
  destinationPostCode: z.string().min(2),
  date: z.string().min(1),
});

const step2 = z.object({
  videoNote: z.string().optional(),
  description: z.string().optional(),
});

const schema = step1.merge(step2);
type FormData = z.infer<typeof schema>;

function Quote() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const navigate = useNavigate();
  const { show, hide } = useLoading();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { serviceType: "service-1" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
    setValue,
  } = form;
  const service = watch("serviceType");

  const next = async () => {
    let ok = true;
    if (step === 1)
      ok = await trigger([
        "name",
        "email",
        "phone",
        "residentAddress",
        "destinationAddress",
        "currentPostCode",
        "destinationPostCode",
        "date",
      ]);
    if (ok) setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };
  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const onSubmit = async () => {
    show("Submitting your quote…");
    await new Promise((r) => setTimeout(r, 600));
    hide();
    navigate({ to: "/quote/processing" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        <Pill variant="cyan" dot>
          Supersonic Dynamic Services B.V
        </Pill>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
          {step === 3 ? "Review & Confirm Quote" : "Request a Quote"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Curious about the digital and eco-responsible driven moving services we provide? Fill out
          the form below and we will get in touch as soon as possible.
        </p>

        {/* Progress */}
        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-primary font-semibold">Step {step} of 3</span>
            <span className="text-muted-foreground">
              {step === 1 ? "Service Details" : step === 2 ? "Documentation" : "Assignment Details"}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-white/5 bg-surface p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
                    Select Service Type
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: "service-1", label: "Service Type-1" },
                      { v: "service-2", label: "Service Type-2" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setValue("serviceType", o.v as any)}
                        className={`rounded-xl border px-4 py-3 text-sm transition ${
                          service === o.v
                            ? "border-primary text-primary"
                            : "border-white/10 text-foreground/80 hover:border-white/20"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field
                      icon={<User className="h-4 w-4" />}
                      label="Name"
                      error={errors.name?.message}
                    >
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="Johndoe Alenn"
                        {...register("name")}
                      />
                    </Field>
                    <Field icon={<User className="h-4 w-4" />} label="Company Name">
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="Company name (optional)"
                        {...register("company")}
                      />
                    </Field>
                    <Field
                      icon={<User className="h-4 w-4" />}
                      label="Email Address"
                      error={errors.email?.message}
                    >
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="johndoe@email.com"
                        {...register("email")}
                      />
                    </Field>
                    <Field
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone Number"
                      error={errors.phone?.message}
                    >
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="+31 (123) 456 789"
                        {...register("phone")}
                      />
                    </Field>
                    <Field
                      icon={<MapPin className="h-4 w-4" />}
                      label="Resident Address"
                      error={errors.residentAddress?.message}
                    >
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="Moving out of"
                        {...register("residentAddress")}
                      />
                    </Field>
                    <Field
                      icon={<MapPin className="h-4 w-4" />}
                      label="Destination Address"
                      error={errors.destinationAddress?.message}
                    >
                      <input
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        placeholder="Moving into"
                        {...register("destinationAddress")}
                      />
                    </Field>
                    <Field label="Current Post Code" error={errors.currentPostCode?.message}>
                      <input
                        className="field w-full rounded-lg px-3 py-2.5 text-sm"
                        placeholder="123456"
                        {...register("currentPostCode")}
                      />
                    </Field>
                    <Field
                      label="Destination Post Code"
                      error={errors.destinationPostCode?.message}
                    >
                      <input
                        className="field w-full rounded-lg px-3 py-2.5 text-sm"
                        placeholder="123456"
                        {...register("destinationPostCode")}
                      />
                    </Field>
                    <Field
                      icon={<Calendar className="h-4 w-4" />}
                      label="Desired Date of Moving"
                      error={errors.date?.message}
                    >
                      <input
                        type="date"
                        className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                        {...register("date")}
                      />
                    </Field>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-display text-lg">Preview: Step 2 Documentation</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <PreviewBox
                        icon={<Upload className="h-5 w-5" />}
                        title="Upload Short Video"
                        body="Show us the items for a precision quote"
                      />
                      <PreviewBox
                        icon={<FileText className="h-5 w-5" />}
                        title="Written Description"
                        body="List any fragile or oversized items"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-xl font-semibold">Documentation</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Help us understand your move with a video and a quick written description.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center">
                      <Upload className="mx-auto h-7 w-7 text-primary" />
                      <p className="mt-3 font-medium">Drop your short video here</p>
                      <p className="text-xs text-muted-foreground">MP4 / MOV up to 200MB</p>
                      <input
                        type="file"
                        className="mt-4 mx-auto block text-xs text-muted-foreground"
                      />
                    </div>
                    <Field label="Written Description">
                      <textarea
                        rows={5}
                        className="field w-full rounded-lg px-3 py-2.5 text-sm"
                        placeholder="List fragile items, large furniture, parking access, elevator availability…"
                        {...register("description")}
                      />
                    </Field>
                  </div>
                </motion.div>
              )}

              {step === 3 && <ReviewStep values={getValues()} />}
            </AnimatePresence>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <CTAButton type="button" variant="outline" className="rounded-xl" onClick={back}>
                  Back
                </CTAButton>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <CTAButton type="button" variant="white" className="rounded-xl" onClick={next}>
                  Next <ArrowRight className="h-4 w-4" />
                </CTAButton>
              ) : (
                <CTAButton type="submit" variant="white" className="rounded-xl">
                  Confirm & Submit Quote
                </CTAButton>
              )}
            </div>
          </form>

          {step < 3 && (
            <aside className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
                <div className="relative">
                  <img src={vanHero} alt="" className="h-44 w-full object-cover" loading="lazy" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-xs leading-tight">
                      <p className="uppercase tracking-[0.18em] text-muted-foreground">
                        Efficiency Rate
                      </p>
                      <p className="font-semibold">99.8%</p>
                    </div>
                  </div>
                </div>
              </div>

              <ContactStrip
                icon={<Phone className="h-5 w-5" />}
                label="Call us"
                value="+31 (06) 84 336 600"
              />
              <ContactStrip
                icon={<User className="h-5 w-5" />}
                label="Email us"
                value="info@supersonic_dynamicservices.nl"
              />
              <ContactStrip
                icon={<MapPin className="h-5 w-5" />}
                label="Address"
                value="De Lingestraat 23, 6467 BK Kerkrade"
              />
            </aside>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/80">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function PreviewBox({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-6 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/5 text-foreground">
        {icon}
      </div>
      <p className="mt-3 font-display text-sm font-semibold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{body}</p>
    </div>
  );
}

function ContactStrip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#9DB1E6]/90 p-4 text-[#0E141A]">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-white">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0E141A]/60">
          {label}
        </p>
        <p className="truncate font-display text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ReviewStep({ values }: { values: FormData }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-display text-2xl font-semibold">Final Review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Verify your shipment details before we finalize the quote.
      </p>

      <div className="mt-6 grid items-center gap-4 rounded-2xl bg-black/30 p-5 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3 w-3" /> Origin
          </p>
          <p className="mt-2 font-display text-lg font-semibold">{values.residentAddress || "-"}</p>
          <p className="text-xs text-muted-foreground">Post code {values.currentPostCode || "-"}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0E141A]">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="text-right md:text-left">
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:justify-start">
            <MapPin className="h-3 w-3" /> Destination
          </p>
          <p className="mt-2 font-display text-lg font-semibold">
            {values.destinationAddress || "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            Post code {values.destinationPostCode || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Row label="Name" value={values.name} />
        <Row label="Company" value={values.company || "-"} />
        <Row label="Email" value={values.email} />
        <Row label="Phone" value={values.phone} />
        <Row label="Date of Moving" value={values.date} />
        <Row
          label="Service Type"
          value={values.serviceType === "service-1" ? "Service Type-1" : "Service Type-2"}
        />
      </div>

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
        By choosing Supersonic Dynamic Services, you are offsetting approximately 14.2kg of CO₂ for
        this specific logistics route.
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
