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

const schema = z.object({
  serviceType: z
    .enum([
      "",
      "student-moving",
      "residential-moving",
      "enterprise-moving",
      "smart-storage",
      "sustainable-waste",
      "freight-haulage",
    ])
    .refine((val) => val !== "", {
      message: "Please select a service type",
    }),
  name: z.string().min(2, "Required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  residentAddress: z.string().optional(),
  destinationAddress: z.string().optional(),
  currentPostCode: z.string().optional(),
  destinationPostCode: z.string().optional(),
  date: z.string().optional(),
  storageSize: z.string().optional(),
  freightWeight: z.string().optional(),
  freightType: z.string().optional(),
  additionalServices: z.string().optional(),
  deliveryDate: z.string().optional(),
  description: z.string().optional(),
  videoNote: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
  { v: "student-moving", label: "Student Moving & Micro Moving With Supersonic" },
  { v: "residential-moving", label: "Residential Moving Local & Long Distance" },
  { v: "enterprise-moving", label: "Enterprise & Commercial Moving" },
  { v: "smart-storage", label: "Smart Storage Solution" },
  { v: "sustainable-waste", label: "Sustainable Waste Removal Services" },
  { v: "freight-haulage", label: "Reliable Freight Haulage Services" },
];

// FIX 1: Dedicated processing route component to avoid route conflicts
export const ProcessingRoute = createFileRoute("/quote/processing")({
  component: QuoteProcessing,
});

function QuoteProcessing() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:px-8 md:py-20 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Zap className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Quote Submitted!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you. Your quote request has been received. Our team will review your details and
            get back to you as soon as possible.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition"
          >
            Return to Home
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

function Quote() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { show, hide } = useLoading();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    // FIX 2: Corrected defaultValues indentation — was misaligned causing potential parse issues
    defaultValues: {
      serviceType: "student-moving",
      name: "",
      company: "",
      email: "",
      phone: "",
      residentAddress: "",
      destinationAddress: "",
      currentPostCode: "",
      destinationPostCode: "",
      date: "",
      storageSize: "",
      freightWeight: "",
      freightType: "",
      additionalServices: "",
      deliveryDate: "",
      description: "",
      videoNote: "",
    },
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

  const selectedService = watch("serviceType");

  const isMovingSelected = ["student-moving", "residential-moving", "enterprise-moving"].includes(
    selectedService,
  );
  const isStorageSelected = selectedService === "smart-storage";
  const isWasteSelected = selectedService === "sustainable-waste";
  const isFreightSelected = selectedService === "freight-haulage";
  const isAnyServiceSelected = selectedService !== "";

  const next = async () => {
    let ok = true;
    if (step === 1) {
      const fieldsToValidate: (keyof FormData)[] = ["serviceType", "name"];
      if (isMovingSelected) {
        fieldsToValidate.push(
          "email", "phone", "residentAddress", "destinationAddress",
          "currentPostCode", "destinationPostCode", "date",
        );
      } else if (isStorageSelected) {
        fieldsToValidate.push("email", "phone", "residentAddress", "currentPostCode", "date", "storageSize");
      } else if (isWasteSelected) {
        fieldsToValidate.push("email", "residentAddress", "currentPostCode", "date");
      } else if (isFreightSelected) {
        fieldsToValidate.push(
          "phone", "residentAddress", "destinationAddress",
          "currentPostCode", "destinationPostCode", "date", "deliveryDate",
        );
      }
      ok = await trigger(fieldsToValidate);
    }
    if (ok) setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };

  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const onSubmit = async () => {
    show("Submitting your quote…");
    await new Promise((r) => setTimeout(r, 600));
    hide();
    // FIX 3: Navigate to a properly registered route, not a non-existent path
    navigate({ to: "/quote/processing" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:px-8 md:py-20">
        <Pill variant="cyan" dot>
          Supersonic Dynamic Services B.V
        </Pill>

        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-6xl">
          {step === 3 ? "Review & Confirm Quote" : "Request a Quote"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Curious about the digital and eco-responsible driven moving services we provide? Fill out
          the form below and we will get in touch as soon as possible.
        </p>

        {/* Progress Bar */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
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

        {/* Main Grid — stacks on mobile, side-by-side on md+ */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr]">

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-white/5 bg-surface p-4 sm:p-6 md:p-8 relative"
          >
            <AnimatePresence mode="wait">

              {/* ─── STEP 1 ─── */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Service Type Dropdown */}
                  <Field
                    label="Select Service Type"
                    error={errors.serviceType?.message}
                    icon={<Truck className="h-4 w-4" />}
                  >
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-left rounded-lg pl-9 pr-10 py-3 text-xs sm:text-sm bg-black text-foreground border border-white/10 hover:border-white/20 focus:border-primary focus:outline-none flex items-center justify-between transition-all relative z-20"
                    >
                      <span className="truncate">
                        {SERVICE_OPTIONS.find((o) => o.v === selectedService)?.label ||
                          "Choose a service..."}
                      </span>
                      <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-muted-foreground text-[10px] absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        ▼
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-surface p-1 shadow-2xl backdrop-blur-md"
                          >
                            {SERVICE_OPTIONS.map((o) => (
                              <li key={o.v}>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setValue("serviceType", o.v as any);
                                    await trigger("serviceType");
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full text-left rounded-lg px-4 py-2.5 my-0.5 text-xs sm:text-sm transition-colors flex items-center ${
                                    selectedService === o.v
                                      ? "bg-primary text-primary-foreground font-medium"
                                      : "text-foreground/90 hover:bg-white/5"
                                  }`}
                                >
                                  {o.label}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        </>
                      )}
                    </AnimatePresence>
                  </Field>

                  {/* Moving Services Form */}
                  <AnimatePresence>
                    {isMovingSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 overflow-hidden"
                      >
                        <Field icon={<User className="h-4 w-4" />} label="Name" error={errors.name?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Johndoe Alenn" {...register("name")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Company name" {...register("company")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="E-mail address" error={errors.email?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="johndoe@email.com" {...register("email")} />
                        </Field>
                        <Field icon={<Phone className="h-4 w-4" />} label="Telephone" error={errors.phone?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="+31 (123) 456 789" {...register("phone")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Resident Address" error={errors.residentAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Moving out of address" {...register("residentAddress")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Destination Address" error={errors.destinationAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Moving into address" {...register("destinationAddress")} />
                        </Field>
                        <Field label="Current Post Code" error={errors.currentPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="1234AB" {...register("currentPostCode")} />
                        </Field>
                        <Field label="Destination Post Code" error={errors.destinationPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="5678CD" {...register("destinationPostCode")} />
                        </Field>
                        <Field icon={<Calendar className="h-4 w-4" />} label="Desired Date of Moving" error={errors.date?.message}>
                          <input type="date" className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" {...register("date")} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Additional Services Required (Optional)">
                            <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="e.g. Packing service, Assembly setup, Extra hand loader" {...register("additionalServices")} />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Smart Storage Form */}
                  <AnimatePresence>
                    {isStorageSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 overflow-hidden"
                      >
                        <Field icon={<User className="h-4 w-4" />} label="Name" error={errors.name?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Johndoe Alenn" {...register("name")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Company name" {...register("company")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="E-mail address" error={errors.email?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="johndoe@email.com" {...register("email")} />
                        </Field>
                        <Field icon={<Phone className="h-4 w-4" />} label="Telephone" error={errors.phone?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="+31 (123) 456 789" {...register("phone")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Address" error={errors.residentAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Storage Address" {...register("residentAddress")} />
                        </Field>
                        <Field label="Post Code" error={errors.currentPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="1234AB" {...register("currentPostCode")} />
                        </Field>
                        <Field icon={<Calendar className="h-4 w-4" />} label="Desired Start Date of Storage Access" error={errors.date?.message}>
                          <input type="date" className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" {...register("date")} />
                        </Field>
                        <Field label="Storage Unit Size (DDB)" error={errors.storageSize?.message}>
                          <select className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm bg-black text-white border border-white/10 focus:outline-none" {...register("storageSize")}>
                            <option value="">Select storage unit size...</option>
                            <option value="small">Small Container Unit</option>
                            <option value="medium">Medium Container Unit</option>
                            <option value="large">Large Warehouse Suite Container</option>
                          </select>
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Additional Services Required (Optional)">
                            <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="e.g. Climate control monitoring, Inventory listing, Collection logistics" {...register("additionalServices")} />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sustainable Waste Removal Form */}
                  <AnimatePresence>
                    {isWasteSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 overflow-hidden"
                      >
                        <Field icon={<User className="h-4 w-4" />} label="Name" error={errors.name?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Johndoe Alenn" {...register("name")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Company name" {...register("company")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="E-mail address" error={errors.email?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="johndoe@email.com" {...register("email")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Waste Pick-up Address" error={errors.residentAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Collection address location" {...register("residentAddress")} />
                        </Field>
                        <Field label="Waste Pick-up Post Code" error={errors.currentPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="1234AB" {...register("currentPostCode")} />
                        </Field>
                        <Field icon={<Calendar className="h-4 w-4" />} label="Desired Date of Waste Pick-Up" error={errors.date?.message}>
                          <input type="date" className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" {...register("date")} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Additional Services Required (Optional)">
                            <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="e.g. Heavy item dismantling, Deep eco-cleaning, Recycling sorting" {...register("additionalServices")} />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Freight Haulage Form */}
                  <AnimatePresence>
                    {isFreightSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 overflow-hidden"
                      >
                        <Field icon={<User className="h-4 w-4" />} label="Name" error={errors.name?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Johndoe Alenn" {...register("name")} />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Company name" {...register("company")} />
                        </Field>
                        <Field icon={<Phone className="h-4 w-4" />} label="Telephone" error={errors.phone?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="+31 (123) 456 789" {...register("phone")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Freight Pick-up Address" error={errors.residentAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Pick up origin address" {...register("residentAddress")} />
                        </Field>
                        <Field icon={<MapPin className="h-4 w-4" />} label="Freight Delivery Address" error={errors.destinationAddress?.message}>
                          <input className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" placeholder="Drop off arrival address" {...register("destinationAddress")} />
                        </Field>
                        <Field label="Freight Pick-up Post Code" error={errors.currentPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="1234AB" {...register("currentPostCode")} />
                        </Field>
                        <Field label="Freight Delivery Post Code" error={errors.destinationPostCode?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="5678CD" {...register("destinationPostCode")} />
                        </Field>
                        <Field icon={<Calendar className="h-4 w-4" />} label="Desired Date of Freight Pick-Up" error={errors.date?.message}>
                          <input type="date" className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" {...register("date")} />
                        </Field>
                        <Field icon={<Calendar className="h-4 w-4" />} label="Desired Date of Freight Delivery" error={errors.deliveryDate?.message}>
                          <input type="date" className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm" {...register("deliveryDate")} />
                        </Field>
                        <Field label="Total Weight of Freight" error={errors.freightWeight?.message}>
                          <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="e.g. 1500 kg" {...register("freightWeight")} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Additional Services Required (Optional)">
                            <input className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm" placeholder="e.g. Tailgate lift routing, Express custom verification clearings" {...register("additionalServices")} />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 2 Preview Cards */}
                  {isAnyServiceSelected && (
                    <div className="mt-8">
                      <h3 className="font-display text-base sm:text-lg">Preview: Step 2 Documentation</h3>
                      <div className="mt-3 grid gap-3 grid-cols-1 xs:grid-cols-2">
                        <PreviewBox
                          icon={<Upload className="h-5 w-5" />}
                          title={
                            isStorageSelected
                              ? "Upload a short video of the items to be stored"
                              : "Upload a short video of the items to be moved"
                          }
                          body="Show us the items for a precision quote"
                        />
                        <PreviewBox
                          icon={<FileText className="h-5 w-5" />}
                          title="Upload a detailed assignment description of the job"
                          body="Provide specific service instruction parameters"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── STEP 2 ─── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-lg sm:text-xl font-semibold">Documentation</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Help us understand your setup requirements accurately with files and written
                    instructions.
                  </p>
                  <div className="mt-5 sm:mt-6 space-y-4">
                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-6 sm:p-8 text-center">
                      <Upload className="mx-auto h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      <p className="mt-3 font-medium uppercase tracking-wide text-[10px] sm:text-xs px-2 text-foreground">
                        {isStorageSelected
                          ? "Upload a short detailed video of the items to be stored"
                          : "Upload a short detailed video of the items to be moved"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">MP4 / MOV up to 200MB</p>
                      <input type="file" className="mt-4 mx-auto block text-xs text-muted-foreground w-full max-w-xs" />
                    </div>

                    <Field label="Detailed Assignment Description of the Job">
                      {isWasteSelected && (
                        <div className="mb-3">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                            Description of the type of waste requiring removal
                          </span>
                        </div>
                      )}
                      {isFreightSelected && (
                        <div className="mb-3">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                            Description of the type of freight
                          </span>
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm mb-3 bg-black/40"
                            placeholder="Describe freight category and item types safely..."
                            {...register("freightType")}
                          />
                        </div>
                      )}
                      <textarea
                        rows={5}
                        className="field w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm resize-none"
                        placeholder="Provide details corresponding with your targeted service requirements..."
                        {...register("description")}
                      />
                    </Field>
                  </div>
                </motion.div>
              )}

              {/* ─── STEP 3 ─── */}
              {step === 3 && <ReviewStep values={getValues()} />}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <CTAButton type="button" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={back}>
                  Back
                </CTAButton>
              ) : (
                <span className="hidden sm:block" />
              )}
              {step < 3 ? (
                <CTAButton
                  type="button"
                  variant="white"
                  className="rounded-xl w-full sm:w-auto"
                  onClick={next}
                  disabled={!isAnyServiceSelected}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </CTAButton>
              ) : (
                <CTAButton type="submit" variant="white" className="rounded-xl w-full sm:w-auto">
                  Confirm & Submit Quote
                </CTAButton>
              )}
            </div>
          </form>

          {/* Sidebar — hidden on step 3 */}
          {step < 3 && (
            <aside className="space-y-3 sm:space-y-4">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
                <div className="relative">
                  <img src={vanHero} alt="Supersonic Services Van" className="h-40 sm:h-44 w-full object-cover" loading="lazy" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-xs leading-tight">
                      <p className="uppercase tracking-[0.18em] text-muted-foreground">Efficiency Rate</p>
                      <p className="font-semibold">99.8%</p>
                    </div>
                  </div>
                </div>
              </div>

              <ContactStrip icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />} label="Call us" value="+31 (06) 84 336 600" />
              <ContactStrip icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />} label="Email us" value="info@supersonic_dynamicservices.nl" />
              <ContactStrip icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />} label="Address" value="De Lingestraat 23, 6467 BK Kerkrade" />
            </aside>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    <div className="block w-full mb-3 sm:mb-4">
      <span className="mb-1.5 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-foreground/80 leading-snug">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </div>
  );
}

function PreviewBox({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4 sm:p-6 text-center flex flex-col justify-center items-center">
      <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/5 text-foreground mb-2">
        {icon}
      </div>
      <p className="font-display text-[10px] sm:text-[11px] font-bold uppercase text-primary tracking-wide leading-tight px-1">
        {title}
      </p>
      <p className="text-[10px] text-muted-foreground mt-1">{body}</p>
    </div>
  );
}

function ContactStrip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#9DB1E6]/90 p-3 sm:p-4 text-[#0E141A]">
      <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0E141A]/60">
          {label}
        </p>
        <p className="truncate font-display text-xs sm:text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ReviewStep({ values }: { values: FormData }) {
  const matchedService = SERVICE_OPTIONS.find((s) => s.v === values.serviceType);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-display text-xl sm:text-2xl font-semibold">Final Review</h3>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
        Verify your logistics assignment parameters before final submission.
      </p>

      {/* Route summary — stacks cleanly on mobile */}
      <div className="mt-5 sm:mt-6 rounded-2xl bg-black/30 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center">
          <div>
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Setup Location / Pickup
            </p>
            <p className="mt-1.5 font-display text-base sm:text-lg font-semibold">{values.residentAddress || "—"}</p>
            <p className="text-xs text-muted-foreground">Post code {values.currentPostCode || "—"}</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0E141A] mx-auto sm:mx-0">
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="sm:text-left">
            <p className="flex items-center gap-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Destination / Dropoff
            </p>
            <p className="mt-1.5 font-display text-base sm:text-lg font-semibold">
              {values.destinationAddress || "N/A (Single Point)"}
            </p>
            <p className="text-xs text-muted-foreground">
              Post code {values.destinationPostCode || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      <div className="mt-4 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        <Row label="Client Name" value={values.name} />
        <Row label="Company Reference" value={values.company || "—"} />
        <Row label="Contact" value={values.phone || values.email || "—"} />
        <Row label="Target Operational Date" value={values.date} />
        <Row label="Selected Service" value={matchedService ? matchedService.label : values.serviceType} />
        {values.storageSize && <Row label="Storage Sizing (DDB)" value={values.storageSize} />}
        {values.freightWeight && <Row label="Freight Weight" value={values.freightWeight} />}
        {values.additionalServices && <Row label="Requested Add-ons" value={values.additionalServices} />}
      </div>

      <div className="mt-4 sm:mt-5 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:p-4 text-xs text-muted-foreground leading-relaxed">
        By choosing Supersonic Dynamic Services, you are offsetting carbon outputs dynamically for
        this specific route execution path.
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    // FIX 4: Replaced invalid `max-w-50` with valid Tailwind class `max-w-[200px]`
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium truncate max-w-45 sm:max-w-50 text-right">{value || "—"}</span>
    </div>
  );
}