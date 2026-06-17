import { createFileRoute } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Truck,
  User,
  Zap,
  Shield,
  Leaf,
  Layers,
  Upload,
  FileText,
  CheckCircle,
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

const SERVICE_DETAILS: Record<string, { title: string; features: string[]; specs: string }> = {
  "student-moving": {
    title: "Micro-Logistics & Student Moving Framework",
    features: [
      "Flexible room-to-room loading setups",
      "Optimized micro-van transit patterns",
      "Affordable modular pricing scales",
    ],
    specs: "Ideal for swift single-room apartments, flatshares, and fast campus relocations.",
  },
  "residential-moving": {
    title: "Full-Scale Family Residential Relocation",
    features: [
      "All-inclusive heavy furniture wrapping",
      "Tailgate lift loading mechanisms",
      "Multi-room routing options",
    ],
    specs:
      "Full transit coverage for detached houses, complex family estates, and high-floor apartments.",
  },
  "enterprise-moving": {
    title: "Commercial Asset & Office Migration",
    features: [
      "Server array and IT asset protective cages",
      "Off-hours operations minimize downtime",
      "Detailed workspace item tagging",
    ],
    specs:
      "Tailored to high-value equipment, document management, and fast corporate facility transitions.",
  },
  "smart-storage": {
    title: "Dynamic Smart Storage Container Vaults",
    features: [
      "24/7 climate-controlled environments",
      "Full digital asset inventory logging",
      "Seamless pickup and return routing",
    ],
    specs:
      "Perfect secure holding framework for seasonal assets, dynamic stock overflows, or interim transit items.",
  },
  "sustainable-waste": {
    title: "Eco-Responsible & Certified Waste Clearance",
    features: [
      "Validated sorting and recycling protocols",
      "Green municipal landfill diversion goals",
      "Heavy breakdown handling arrays",
    ],
    specs:
      "Comprehensive processing of broken fixtures, old office furniture, and non-hazardous building debris.",
  },
  "freight-haulage": {
    title: "Heavy Haulage & Industrial Freight Solutions",
    features: [
      "Palletized cross-docking tracking systems",
      "High-capacity payload transport options",
      "Strict deadline-focused delivery frameworks",
    ],
    specs:
      "Engineered specifically for high-volume commercial items, material handling supplies, and distribution networks.",
  },
};

function Quote() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [videoFile, setVideoFile] = useState<string>("");
  const [descFile, setDescFile] = useState<string>("");
  const { show, hide } = useLoading();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
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

  const handleNextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Safeguard any unexpected bubbles
    if (step === 1) {
      const fieldsToValidate: (keyof FormData)[] = ["serviceType", "name"];
      if (isMovingSelected) {
        fieldsToValidate.push(
          "email",
          "phone",
          "residentAddress",
          "destinationAddress",
          "currentPostCode",
          "destinationPostCode",
          "date",
        );
      } else if (isStorageSelected) {
        fieldsToValidate.push(
          "email",
          "phone",
          "residentAddress",
          "currentPostCode",
          "date",
          "storageSize",
        );
      } else if (isWasteSelected) {
        fieldsToValidate.push("email", "residentAddress", "currentPostCode", "date");
      } else if (isFreightSelected) {
        fieldsToValidate.push(
          "phone",
          "residentAddress",
          "destinationAddress",
          "currentPostCode",
          "destinationPostCode",
          "date",
          "deliveryDate",
        );
      }

      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setStep(2);
      }
    }
  };

  const handleBackStep = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (step === 2) {
      setStep(1);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Only execute submission when on step 2
    if (step !== 2) return;

    show("Processing your parameters…");
    await new Promise((r) => setTimeout(r, 1200));
    hide();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-30 py-14 md:px-8 md:py-20 text-center">
          <div className="mx-auto max-w-md space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Quote Request Received!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your configurations and verified assignment documentation assets have been
              successfully routed through our production pipeline.
            </p>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition shadow-lg"
            >
              Return to Home
            </a>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:px-8 md:py-20">
        <Pill variant="cyan" dot>
          Supersonic Dynamic Services B.V
        </Pill>

        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-6xl">
          {step === 2 ? "Review & Confirm Details" : "Request a Quote"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Fill out the functional operations configuration data parameters below and accurately
          evaluate your submission metrics before final commitment.
        </p>

        {/* Progress Timeline Tracker */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-primary font-semibold">Step {step} of 2</span>
            <span className="text-muted-foreground">
              {step === 1 ? "Information Collection" : "Final Verification Dashboard"}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Structural Form Layout Core */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr]">
          {/* Core Layout Data Engine */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-white/5 bg-surface p-4 sm:p-6 md:p-8 relative h-fit"
          >
            <AnimatePresence mode="wait">
              {/* STEP 1: PARSING SELECTIONS AND TARGET INPUT CONFIGS */}
              {step === 1 && (
                <motion.div
                  key="step-capture"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Service Dropdown Picker Section */}
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

                  {/* Operational Core Service Breakdown Display Panel */}
                  <AnimatePresence mode="wait">
                    {selectedService && SERVICE_DETAILS[selectedService] && (
                      <motion.div
                        key={selectedService}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-primary">
                          <Layers className="h-4 w-4" />
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                            {SERVICE_DETAILS[selectedService].title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {SERVICE_DETAILS[selectedService].specs}
                        </p>
                        <div className="pt-1 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                          {SERVICE_DETAILS[selectedService].features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-1.5 text-[10px] text-foreground/80 bg-black/30 p-2 rounded-md"
                            >
                              <span className="text-primary font-bold">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM TYPE 1: Core Moving Services */}
                  <AnimatePresence>
                    {isMovingSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 grid gap-4 md:grid-cols-2 overflow-hidden"
                      >
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
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Company name"
                            {...register("company")}
                          />
                        </Field>
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="E-mail address"
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
                          label="Telephone"
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
                            placeholder="Moving out of address"
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
                            placeholder="Moving into address"
                            {...register("destinationAddress")}
                          />
                        </Field>
                        <Field label="Current Post Code" error={errors.currentPostCode?.message}>
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          label="Destination Post Code"
                          error={errors.destinationPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="5678CD"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              {/* Responsive grid: 1 column on mobile, 2 columns on desktop */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Option 1 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="waste_removal"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Waste removal/recycling
                                  </span>
                                </label>

                                {/* Option 2 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="storage_short_long_term"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Storage short-term/long-term
                                  </span>
                                </label>

                                {/* Option 3 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="after_hour_holiday_weekend_move"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    After hours/weekend/holiday move
                                  </span>
                                </label>

                                {/* Option 4 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="disasembling_assembling"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Disassembling/Assembling
                                  </span>
                                </label>
                              </div>
                            </div>
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM TYPE 2: Smart Storage Solution */}
                  <AnimatePresence>
                    {isStorageSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 grid gap-4 md:grid-cols-2 overflow-hidden"
                      >
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
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Company name"
                            {...register("company")}
                          />
                        </Field>
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="E-mail address"
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
                          label="Telephone"
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
                          label="Address"
                          error={errors.residentAddress?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Storage Address"
                            {...register("residentAddress")}
                          />
                        </Field>
                        <Field label="Post Code" error={errors.currentPostCode?.message}>
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          icon={<Calendar className="h-4 w-4" />}
                          label="Desired start-date of storage access."
                          error={errors.date?.message}
                        >
                          <input
                            type="date"
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <Field
                          icon={<Calendar className="h-4 w-4" />}
                          label="Desired end-date of storage access."
                          error={errors.date?.message}
                        >
                          <input
                            type="date"
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <Field
                          label="Select size of storage unit"
                          error={errors.storageSize?.message}
                        >
                          <div className="relative w-full">
                            <select
                              className="field w-full rounded-lg px-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none appearance-none cursor-pointer pr-10"
                              {...register("storageSize")}
                            >
                              <option value="" className="bg-[#0E141A] text-muted-foreground">
                                Select storage sizing unit...
                              </option>
                              <option value="1x1x2_3m3" className="bg-[#0E141A] text-white py-2">
                                1 m x 1 m x 2 m = 3 m³
                              </option>
                              <option value="2x1x3_6m3" className="bg-[#0E141A] text-white py-2">
                                2 m x 1 m x 3 m = 6 m³
                              </option>
                              <option value="2x2x3_12m3" className="bg-[#0E141A] text-white py-2">
                                2 m x 2 m x 3 m = 12 m³
                              </option>
                              <option value="3x2x3_18m3" className="bg-[#0E141A] text-white py-2">
                                3 m x 2 m x 3 m = 18 m³
                              </option>
                              <option value="3x3x3_27m3" className="bg-[#0E141A] text-white py-2">
                                3 m x 3 m x 3 m = 27 m³
                              </option>
                              <option value="3x4x3_36m3" className="bg-[#0E141A] text-white py-2">
                                3 m x 4 m x 3 m = 36 m³
                              </option>
                              <option value="4x4x3_48m3" className="bg-[#0E141A] text-white py-2">
                                4 m x 4 m x 3 m = 48 m³
                              </option>
                            </select>

                            {/* Custom Dropdown Chevron Icon Overlay */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              {/* Responsive grid: 1 column on mobile, 2 columns on desktop */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Option 1 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="packing_support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Packing Support
                                  </span>
                                </label>

                                {/* Option 2 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="disassembling_support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Disassembling Support
                                  </span>
                                </label>

                                {/* Option 3 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="hours_weekend_holiday_move"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Work hours/weekdays collection support
                                  </span>
                                </label>

                                {/* Option 4 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="hours_weekend_holiday_move"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    After hours/weekend/holiday collection support
                                  </span>
                                </label>
                              </div>
                            </div>
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM TYPE 3: Sustainable Waste Removal Services */}
                  <AnimatePresence>
                    {isWasteSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 grid gap-4 md:grid-cols-2 overflow-hidden"
                      >
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
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Company name"
                            {...register("company")}
                          />
                        </Field>
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="E-mail address"
                          error={errors.email?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="johndoe@email.com"
                            {...register("email")}
                          />
                        </Field>
                        <Field
                          icon={<MapPin className="h-4 w-4" />}
                          label="Waste pick-up Address"
                          error={errors.residentAddress?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Collection address location"
                            {...register("residentAddress")}
                          />
                        </Field>
                        <Field
                          label="Waste Pick-up Post Code"
                          error={errors.currentPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          icon={<Calendar className="h-4 w-4" />}
                          label="Desired date of waste Pick-Up."
                          error={errors.date?.message}
                        >
                          <input
                            type="date"
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              {/* Responsive grid: 1 column on mobile, 2 columns on desktop */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Option 1 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="waste_sorting_support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Waste sorting support
                                  </span>
                                </label>

                                {/* Option 2 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="disassembling_support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Disassembling support
                                  </span>
                                </label>

                                {/* Option 3 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    After hours/weekend/holiday removal support
                                  </span>
                                </label>
                              </div>
                            </div>
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FORM TYPE 4: Reliable Freight Haulage Services */}
                  <AnimatePresence>
                    {isFreightSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 grid gap-4 md:grid-cols-2 overflow-hidden"
                      >
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
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Company name"
                            {...register("company")}
                          />
                        </Field>
                        <Field
                          icon={<Phone className="h-4 w-4" />}
                          label="Telephone"
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
                          label="Freight pick-up Address"
                          error={errors.residentAddress?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Pick up origin address"
                            {...register("residentAddress")}
                          />
                        </Field>
                        <Field
                          icon={<MapPin className="h-4 w-4" />}
                          label="Freight Delivery Address"
                          error={errors.destinationAddress?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="Drop off arrival address"
                            {...register("destinationAddress")}
                          />
                        </Field>
                        <Field
                          label="Freight Pick-up Post Code"
                          error={errors.currentPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          label="Freight Delivery Post Code"
                          error={errors.destinationPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="5678CD"
                            {...register("destinationPostCode")}
                          />
                        </Field>
                        <Field
                          icon={<Calendar className="h-4 w-4" />}
                          label="Desired date of Freight Pick-Up."
                          error={errors.date?.message}
                        >
                          <input
                            type="date"
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <Field
                          icon={<Calendar className="h-4 w-4" />}
                          label="Desired date of Freight Delivery."
                          error={errors.deliveryDate?.message}
                        >
                          <input
                            type="date"
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("deliveryDate")}
                          />
                        </Field>
                        <Field
                          label="Total weight of Freight."
                          error={errors.freightWeight?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-2.5 text-sm"
                            placeholder="e.g. 1500 kg"
                            {...register("freightWeight")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              {/* Responsive grid: 1 column on mobile, 2 columns on desktop */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Option 1 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="Loading_Support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Loading Support
                                  </span>
                                </label>

                                {/* Option 2 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="Unloading_Support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Unloading Support
                                  </span>
                                </label>

                                {/* Option 3 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="transport"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    After hours/weekend/holiday transport support
                                  </span>
                                </label>

                                {/* Option 4 */}
                                <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-blend-color p-3.5 cursor-pointer hover:border-white/20 transition-colors group">
                                  <input
                                    type="checkbox"
                                    value="storage_support"
                                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0E141A] text-white accent-white focus:ring-0 cursor-pointer"
                                    {...register("additionalServices")}
                                  />
                                  <span className="text-xs text-white font-small select-none">
                                    Overnight freight storage support
                                  </span>
                                </label>
                              </div>
                            </div>
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 1 Visual Upload Prompts */}
                  <div className="mt-8">
                    <h3 className="font-display text-lg">Preview: Step 2 Documentation</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <PreviewBox
                        icon={<Upload className="h-5 w-5" />}
                        title={
                          isStorageSelected
                            ? "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS TO BE STORED):"
                            : "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS WE NEED TO MOVE):"
                        }
                        body="Show us the items for a precision quote"
                        fileState={videoFile}
                        onFileChange={(name) => setVideoFile(name)}
                      />
                      <PreviewBox
                        icon={<FileText className="h-5 w-5" />}
                        title="CLICK HERE TO UPLOAD( A DETAILED ASSIGNMENT DESCRIPTION OF THE JOB):"
                        body="Provide the specific dynamic service instructions parameters"
                        fileState={descFile}
                        onFileChange={(name) => setDescFile(name)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: STANDALONE FULL PREVIEW & VERIFICATION INTERFACE BEFORE CONFIRMATION */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-xl font-semibold">Documentation & Preview</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Help us understand your setup requirements accurately with files and written
                    instructions.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center relative">
                      <Upload className="mx-auto h-7 w-7 text-primary" />
                      <p className="mt-3 font-medium uppercase tracking-wide text-xs px-2 text-foreground">
                        {isStorageSelected
                          ? "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS TO BE STORED):"
                          : "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS WE NEED TO MOVE):"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">MP4 / MOV up to 200MB</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          e.target.files?.[0] && setVideoFile(e.target.files[0].name)
                        }
                        className="mt-4 mx-auto block text-xs text-muted-foreground"
                      />
                      {videoFile && (
                        <p className="mt-2 text-xs text-primary font-mono truncate">
                          Attached Video: {videoFile}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center relative">
                      <FileText className="mx-auto h-7 w-7 text-primary" />
                      <p className="mt-3 font-medium uppercase tracking-wide text-xs px-2 text-foreground">
                        CLICK HERE TO UPLOAD( A DETAILED ASSIGNMENT DESCRIPTION OF THE JOB):
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF / DOCX up to 20MB</p>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={(e) => e.target.files?.[0] && setDescFile(e.target.files[0].name)}
                        className="mt-4 mx-auto block text-xs text-muted-foreground"
                      />
                      {descFile && (
                        <p className="mt-2 text-xs text-primary font-mono truncate">
                          Attached Description File: {descFile}
                        </p>
                      )}
                    </div>

                    {isWasteSelected && (
                      <div className="mb-3">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                          DESCRIPTION OF THE TYPE OF WASTE REQUIRING REMOVAL
                        </span>
                      </div>
                    )}

                    {/* COMPLETE DETAILED PREVIEW MATRIX SECTION */}
                    <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Shield className="h-4 w-4" />
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                          PREVIEW OF ALL INPUTTED INFORMATION
                        </h4>
                      </div>

                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                        <Row label="Name" value={getValues("name")} />
                        <Row label="Company Name" value={getValues("company") || "—"} />
                        <Row label="E-mail address" value={getValues("email") || "—"} />
                        <Row label="Telephone" value={getValues("phone") || "—"} />

                        {getValues("residentAddress") && (
                          <Row
                            label={
                              isWasteSelected
                                ? "Waste pick-up Address"
                                : isFreightSelected
                                  ? "Freight pick-up Address"
                                  : isStorageSelected
                                    ? "Address"
                                    : "Resident Address"
                            }
                            value={getValues("residentAddress")}
                          />
                        )}
                        {getValues("destinationAddress") && (
                          <Row
                            label={
                              isFreightSelected ? "Freight Delivery Address" : "Destination Address"
                            }
                            value={getValues("destinationAddress")}
                          />
                        )}

                        {getValues("currentPostCode") && (
                          <Row
                            label={
                              isWasteSelected
                                ? "Waste Pick-up Post Code"
                                : isFreightSelected
                                  ? "Freight Pick-up Post Code"
                                  : isStorageSelected
                                    ? "Post Code"
                                    : "Current Post Code"
                            }
                            value={getValues("currentPostCode")}
                          />
                        )}
                        {getValues("destinationPostCode") && (
                          <Row
                            label={
                              isFreightSelected
                                ? "Freight Delivery Post Code"
                                : "Destination Post Code"
                            }
                            value={getValues("destinationPostCode")}
                          />
                        )}

                        <Row
                          label={
                            isStorageSelected
                              ? "Desired start-date of storage access."
                              : isWasteSelected
                                ? "Desired date of waste Pick-Up."
                                : isFreightSelected
                                  ? "Desired date of Freight Pick-Up."
                                  : "Desired Date of Moving"
                          }
                          value={getValues("date") || "—"}
                        />

                        {isFreightSelected && getValues("deliveryDate") && (
                          <Row
                            label="Desired date of Freight Delivery."
                            value={getValues("deliveryDate")}
                          />
                        )}
                        {getValues("storageSize") && (
                          <Row
                            label="Select size of storage unit (DDB)"
                            value={
                              getValues("storageSize") === "small"
                                ? "Small Container Unit"
                                : getValues("storageSize") === "medium"
                                  ? "Medium Container Unit"
                                  : "Large Warehouse Suite Container"
                            }
                          />
                        )}
                        {getValues("freightWeight") && (
                          <Row
                            label="Total weight of Freight."
                            value={getValues("freightWeight")}
                          />
                        )}
                        {getValues("additionalServices") && (
                          <Row
                            label="Additional Services Selected"
                            value={getValues("additionalServices")}
                          />
                        )}
                      </div>

                      {getValues("description") && (
                        <div className="rounded-lg bg-black/40 p-3 border border-white/5 text-xs">
                          <p className="text-foreground leading-relaxed font-normal">
                            {getValues("description")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepped Progressive Controller Strip */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <CTAButton
                  type="button"
                  variant="outline"
                  className="rounded-xl w-full sm:w-auto"
                  onClick={handleBackStep}
                >
                  Modify Information
                </CTAButton>
              ) : (
                <span className="hidden sm:block" />
              )}
              {step === 1 ? (
                <CTAButton
                  type="button"
                  variant="white"
                  className="rounded-xl w-full sm:w-auto"
                  onClick={handleNextStep}
                  disabled={!isAnyServiceSelected}
                >
                  Preview Parameters <ArrowRight className="h-4 w-4" />
                </CTAButton>
              ) : (
                <CTAButton type="submit" variant="white" className="rounded-xl w-full sm:w-auto">
                  Confirm & Submit Quote
                </CTAButton>
              )}
            </div>
          </form>

          {/* Core Content Branding Sidebar */}
          {step === 1 && (
            <aside className="space-y-3 sm:space-y-4">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
                <div className="relative">
                  <img
                    src={vanHero}
                    alt="Supersonic Services Van"
                    className="h-40 sm:h-44 w-full object-cover"
                    loading="lazy"
                  />
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
                icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="Call us"
                value="+31 (06) 84 336 600"
              />
              <ContactStrip
                icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
                label="Email us"
                value="info@supersonicdynamicservices.nl"
              />
              <ContactStrip
                icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />}
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

// ─── Component Extensions & Sub-components ───────────────────────────────────

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
      <span className="mb-1.5 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80 leading-snug">
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

function PreviewBox({
  icon,
  title,
  body,
  fileState,
  onFileChange,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  fileState: string;
  onFileChange: (name: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/40 p-4 flex flex-col justify-between text-left relative overflow-hidden min-h-35">
      <div className="text-primary mb-2 shrink-0">{icon}</div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wide text-foreground/90 leading-tight">
          {title}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{body}</p>
      </div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0].name)}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      {fileState && (
        <div className="mt-2 text-[10px] text-primary font-mono truncate bg-primary/5 px-2 py-1 rounded border border-primary/10">
          Loaded: {fileState}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2.5 text-xs gap-3 border border-white/2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium truncate max-w-45 text-right text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}
