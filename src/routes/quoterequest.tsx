import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CTAButton } from "@/components/shared/CTAButton";
import { useLoading } from "@/contexts/LoadingContext";
import vanHero from "@/assets/images/hero-van.png";
import newVan5 from "@/assets/images/newVan5.jpg"
import ecoVan from "@/assets/images/home-eco.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { quotesApi } from "@/lib/api";

const quoteSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/quoterequest")({
  validateSearch: quoteSearchSchema,
  component: QuoteRequest,
});

const schema = z
  .object({
    serviceType: z.enum([
      "student-moving",
      "residential-moving",
      "enterprise-moving",
      "smart-storage",
      "sustainable-waste",
      "freight-haulage",
    ]),
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
    additionalServices: z.array(z.string()).optional(),
    deliveryDate: z.string().optional(),
    description: z.string().min(15, "Please add at least 15 characters describing your request."),
  })
  .superRefine((data, ctx) => {
    const isMoving = ["student-moving", "residential-moving", "enterprise-moving"].includes(
      data.serviceType,
    );
    const isFreight = data.serviceType === "freight-haulage";
    const isStorage = data.serviceType === "smart-storage";
    const isWaste = data.serviceType === "sustainable-waste";

    const addrFrom = [data.residentAddress, data.currentPostCode].filter(Boolean).join(", ");
    if ((isMoving || isFreight || isStorage || isWaste) && addrFrom.length < 10) {
      ctx.addIssue({
        path: ["residentAddress"],
        code: z.ZodIssueCode.custom,
        message: "Please enter a more complete address (min 10 characters).",
      });
    }

    const addrTo = [data.destinationAddress, data.destinationPostCode].filter(Boolean).join(", ");
    if ((isMoving || isFreight) && addrTo.length < 10) {
      ctx.addIssue({
        path: ["destinationAddress"],
        code: z.ZodIssueCode.custom,
        message: "Please enter a more complete destination address (min 10 characters).",
      });
    }
  });

type QuoteFormData = z.infer<typeof schema>;

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
    title: "Student Moving and Micro-Moving With Supersonic",
    features: [],
    specs: "",
  },
  "residential-moving": {
    title: "Residential Moving Local and Long Range",
    features: [],
    specs: "",
  },
  "enterprise-moving": {
    title: "Enterprise and Commercial Asset Moving",
    features: [],
    specs: "",
  },
  "smart-storage": {
    title: "Dynamic Smart Storage Solutions",
    features: [],
    specs: "",
  },
  "sustainable-waste": {
    title: "Sustainable Waste Removal Services",
    features: [],
    specs: "",
  },
  "freight-haulage": {
    title: "Reliable Freight Haulage Services",
    features: [],
    specs: "",
  },
};

function QuoteRequest() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string>("");
  const [descFile, setDescFile] = useState<string>("");
  const { show, hide } = useLoading();
  const navigate = useNavigate();
  const [error, setErrors] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      sessionStorage.setItem("sds_quote_draft", JSON.stringify(getValues()));
      navigate({ to: "/login" as any, search: { redirect: "/quoterequest" } });
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const draft = sessionStorage.getItem("sds_quote_draft");
    if (draft) {
      form.reset(JSON.parse(draft));
      sessionStorage.removeItem("sds_quote_draft");
    }
  }, []);

  useEffect(() => {
    if (user) {
      setValue("name", user.full_name);
      setValue("email", user.email);
    }
  }, [user]);

  useEffect(() => {
    const err = sessionStorage.getItem("sds_quote_error");
    if (err) {
      setErrors(err);
      sessionStorage.removeItem("sds_quote_error");
    }
  }, []);

  const form = useForm<QuoteFormData>({
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
      additionalServices: [],
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
  const descriptionValue = watch("description") || "";

  const isMovingSelected = ["student-moving", "residential-moving", "enterprise-moving"].includes(
    selectedService,
  );
  const isStorageSelected = selectedService === "smart-storage";
  const isWasteSelected = selectedService === "sustainable-waste";
  const isFreightSelected = selectedService === "freight-haulage";
  const isAnyServiceSelected = Boolean(selectedService);

  const handleNextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (step === 1) {
      const fieldsToValidate: (keyof QuoteFormData)[] = ["serviceType", "name", "description"];
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
          "email",
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBackStep = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (step === 2) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const presigned = await quotesApi.getPresignedUrl(file.name, file.type || "video/mp4");
      const putRes = await fetch(presigned.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "video/mp4" },
      });
      if (!putRes.ok) {
        throw new Error(`Upload failed with status ${putRes.status}`);
      }
      const cleanUrl = presigned.url.split("?")[0];
      setVideoUrl(cleanUrl);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data
        ?.detail;
      console.error("video upload failed:", detail ?? err);
      setErrors(
        Array.isArray(detail)
          ? detail
              .map((d: { msg?: string }) => d.msg)
              .filter(Boolean)
              .join(", ")
          : "Failed to upload video. Please try again.",
      );
    }
  };
  //   const onSubmit: SubmitHandler<QuoteFormData> = async (data) => {
  //     if (step !== 2) return;
  //     if (!isAuthenticated) {
  //     sessionStorage.setItem("sds_quote_draft", JSON.stringify(data));
  //     navigate({ to: "/login" as any, search: { redirect: "/quoterequest" } });
  //     return;
  //   }
  //     try {
  //       setIsSubmitting(true);
  //       show("Processing your parameters…");

  //       const moveType = data.serviceType;
  //       const addressFrom = [data.residentAddress, data.currentPostCode].filter(Boolean).join(", ");
  //       const addressTo = [data.destinationAddress, data.destinationPostCode].filter(Boolean).join(", ");
  //       const description = [
  //   data.description,
  //   data.additionalServices,
  //   data.company ? `Company: ${data.company}` : "",
  //   docUrl ? `Assignment document: ${docUrl}` : "",
  // ].filter(Boolean).join(". ") || `Quote request for ${moveType}`;

  //       await quotesApi.createRequest({
  //         move_type: moveType,
  //         address_from: addressFrom,
  //         address_to: addressTo || addressFrom,
  //         description,
  //         video_url: videoUrl || undefined,
  //       });

  //       navigate({ to: "/quotesuccess" });
  //     } catch (err: unknown) {
  //       const msg =
  //         (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
  //         "Failed to submit quote request. Please try again.";
  //       setErrors(msg);
  //     } finally {
  //       hide();
  //       setIsSubmitting(false);
  //     }
  //   };

  const onSubmit: SubmitHandler<QuoteFormData> = async (data) => {
    if (step !== 2) return;
    if (!isAuthenticated) {
      sessionStorage.setItem("sds_quote_draft", JSON.stringify(data));
      navigate({ to: "/login" as any, search: { redirect: "/quoterequest" } });
      return;
    }

    setIsSubmitting(true); // only set once we're actually proceeding
    try {
      const moveType = data.serviceType;
      const addressFrom = [data.residentAddress, data.currentPostCode].filter(Boolean).join(", ");
      const addressTo = [data.destinationAddress, data.destinationPostCode]
        .filter(Boolean)
        .join(", ");

      sessionStorage.setItem(
        "sds_quote_payload",
        JSON.stringify({
          move_type: moveType,
          address_from: addressFrom,
          address_to: addressTo || addressFrom,
          description: data.description,
          video_url: videoUrl || undefined,
          contact_name: data.name || undefined,
          company: data.company || undefined,
          contact_email: data.email || undefined,
          contact_phone: data.phone || undefined,
          move_date: data.date || undefined,
          delivery_date: data.deliveryDate || undefined,
          storage_size: data.storageSize || undefined,
          freight_weight: data.freightWeight || undefined,
          additional_services: data.additionalServices?.length
            ? data.additionalServices
            : undefined,
        }),
      );

      navigate({ to: "/quoteprocessing" });
    } catch (err) {
      setErrors("Something went wrong preparing your quote. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:px-8 md:py-20">
        {/* <Pill variant="cyan" dot>
          Supersonic Dynamic Services B.V
        </Pill> */}

        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-6xl">
          {step === 2 ? "Review & Confirm Details" : "Request a Quote"}
        </h1>
        <p className="mt-3 mb-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-5">
          Fill out the quote form below to get your journey started with supersonic dynamic services
        </p>

        {/* Sticky progress bar - sticks just below the navbar */}
        <div className="sticky top-(--navbar-height,64px) z-30 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-4 bg-background/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 border border-primary/25 text-[10px] font-semibold text-primary tabular-nums">
                  {step}
                </span>
                <span className="text-xs sm:text-sm font-medium text-white tracking-tight">
                  {step === 1 ? "Information Collection" : "Final Verification"}
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                Step {step} of 2
              </span>
            </div>

            <div className="relative h-0.75 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary/60 to-primary"
                initial={false}
                animate={{ width: `${(step / 2) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr] items-start">
          {/* Form column (scrolls freely) */}
          <form
            onSubmit={handleSubmit(onSubmit, (formErrors) => {
              const firstMessage = Object.values(formErrors)[0]?.message as string | undefined;
              setErrors(
                firstMessage
                  ? `Please fix: ${firstMessage}`
                  : "Some fields need attention. Go back to Step 1 to review.",
              );
            })}
            className="rounded-2xl border border-border bg-surface p-4 sm:p-6 md:p-8 relative h-fit"
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
                    <input type="hidden" {...register("serviceType")} />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-left rounded-lg pl-9 pr-10 py-3 text-xs sm:text-sm text-foreground border border-border focus:border-primary focus:outline-none flex items-center justify-between transition-all relative z-20"
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
                        <ChevronDown className="h-3 w-3" />
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
                            className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-surface p-1 shadow-md backdrop-blur-md"
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
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                      >
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="Name"
                          error={errors.name?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm opacity-60 cursor-not-allowed"
                            placeholder="Johndoe Alenn"
                            disabled
                            {...register("name")}
                          />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm opacity-60 cursor-not-allowed"
                            placeholder="johndoe@email.com"
                            disabled
                            {...register("email")}
                          />
                        </Field>
                        <Field
                          icon={<Phone className="h-4 w-4" />}
                          label="Telephone"
                          error={errors.phone?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Moving into address"
                            {...register("destinationAddress")}
                          />
                        </Field>
                        <Field label="Current Post Code" error={errors.currentPostCode?.message}>
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          label="Destination Post Code"
                          error={errors.destinationPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="relative flex items-start gap-3 rounded-lg border border-border p-3.5 cursor-pointer transition-colors group hover:border-white/20 has-checked:border-primary has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-black/40">
                                  <input
                                    type="checkbox"
                                    value="waste_removal"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Waste removal/recycling
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-black/10 bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-black/40">
                                  <input
                                    type="checkbox"
                                    value="storage_short_long_term"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Storage short-term/long-term
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-black/10 bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-black/40">
                                  <input
                                    type="checkbox"
                                    value="after_hour_holiday_weekend_move"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    After hours/weekend/holiday move
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-black/10 bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-black/40">
                                  <input
                                    type="checkbox"
                                    value="disasembling_assembling"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-black/20 bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
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
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                      >
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="Name"
                          error={errors.name?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Johndoe Alenn"
                            {...register("name")}
                          />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Storage Address"
                            {...register("residentAddress")}
                          />
                        </Field>
                        <Field label="Post Code" error={errors.currentPostCode?.message}>
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-black border border-border focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-black border border-border focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <Field
                          label="Select size of storage unit"
                          error={errors.storageSize?.message}
                        >
                          <div className="relative w-full">
                            <select
                              className="field w-full rounded-lg px-3 py-3.5 text-sm bg-black text-black border border-border focus:outline-none appearance-none cursor-pointer pr-10"
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-white/10 has-checked:ring-1 has-checked:ring-black/40">
                                  <input
                                    type="checkbox"
                                    value="packing_support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Packing Support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="disassembling_support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Disassembling Support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-white/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="hours_weekend_holiday_move"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Work hours/weekdays collection support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-white/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="hours_weekend_holiday_move"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-black/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
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
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                      >
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="Name"
                          error={errors.name?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Johndoe Alenn"
                            {...register("name")}
                          />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Collection address location"
                            {...register("residentAddress")}
                          />
                        </Field>
                        <Field
                          label="Waste Pick-up Post Code"
                          error={errors.currentPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-black border border-border focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="waste_sorting_support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Waste sorting support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-white/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="disassembling_support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Disassembling support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
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
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                      >
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="Name"
                          error={errors.name?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Johndoe Alenn"
                            {...register("name")}
                          />
                        </Field>
                        <Field
                          icon={<User className="h-4 w-4" />}
                          label="E-mail address"
                          error={errors.email?.message}
                        >
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="johndoe@email.com"
                            {...register("email")}
                          />
                        </Field>
                        <Field icon={<User className="h-4 w-4" />} label="Company Name (Optional)">
                          <input
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm"
                            placeholder="Drop off arrival address"
                            {...register("destinationAddress")}
                          />
                        </Field>
                        <Field
                          label="Freight Pick-up Post Code"
                          error={errors.currentPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
                            placeholder="1234AB"
                            {...register("currentPostCode")}
                          />
                        </Field>
                        <Field
                          label="Freight Delivery Post Code"
                          error={errors.destinationPostCode?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-black border border-border focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-3.5 text-sm bg-black text-white border border-white/10 focus:outline-none focus:border-white/20 scheme-dark cursor-pointer transition-colors"
                            {...register("deliveryDate")}
                          />
                        </Field>
                        <Field
                          label="Total weight of Freight."
                          error={errors.freightWeight?.message}
                        >
                          <input
                            className="field w-full rounded-lg px-3 py-3.5 text-sm"
                            placeholder="e.g. 1500 kg"
                            {...register("freightWeight")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <div className="relative w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-white/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="Loading_Support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Loading Support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="Unloading_Support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Unloading Support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-white/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="transport"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    After hours/weekend/holiday transport support
                                  </span>
                                </label>

                                <label className="relative flex items-start gap-3 rounded-lg border border-border bg-blend-color p-3.5 cursor-pointer transition-colors group hover:border-black/20 has-checked:border-black has-checked:bg-black/10 has-checked:ring-1 has-checked:ring-white/40">
                                  <input
                                    type="checkbox"
                                    value="storage_support"
                                    className="peer sr-only"
                                    {...register("additionalServices")}
                                  />
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-[#0E141A] peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 transition-colors">
                                    <svg
                                      className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  </span>
                                  <span className="text-xs text-black font-small select-none">
                                    Overnight freight storage support
                                  </span>
                                </label>
                              </div>
                            </div>
                          </Field>{" "}
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
                        inputId="quote-video-upload"
                        accept="video/*"
                        fileState={videoFile}
                        onFileChange={setVideoFile}
                        onFileSelect={handleFileSelect}
                      />
                      <Field label="Describe your request" error={errors.description?.message}>
                        <textarea
                          rows={5}
                          placeholder="Tell us more about what needs to move, any special handling, access constraints, or timing notes..."
                          className="field w-full rounded-lg px-3 py-3 text-sm resize-none"
                          {...register("description")}
                        />
                        <div className="mt-1 flex justify-end">
                          <span
                            className={`text-[10px] font-mono ${
                              descriptionValue.length < 15
                                ? "text-red-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {descriptionValue.length}/15 characters minimum
                          </span>
                        </div>
                      </Field>
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
                  {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 font-medium">
                      {error}
                    </div>
                  )}
                  <h3 className="font-display text-xl font-semibold">Final Preview</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    preview all inputed information
                  </p>

                  <div className="mt-6 space-y-4">
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
                        <Row label="Company Name" value={getValues("company") || "-"} />
                        <Row label="E-mail address" value={getValues("email") || "-"} />
                        <Row label="Telephone" value={getValues("phone") || "-"} />

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
                          value={getValues("date") || "-"}
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
                        {getValues("additionalServices")?.length > 0 && (
                          <Row
                            label="Additional Services Selected"
                            value={getValues("additionalServices")!.join(", ")}
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
                  Next Steps <ArrowRight className="h-4 w-4" />
                </CTAButton>
              ) : (
                <CTAButton
                  type="submit"
                  variant="white"
                  className="rounded-xl w-full inline-flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Submit Quote"}
                </CTAButton>
              )}
            </div>
          </form>

          {/* Sticky sidebar - image + contact strips */}
          {step === 1 && (
            <aside className="self-start sticky top-[calc(var(--navbar-height,64px)+52px+8px)] h-fit w-full space-y-3 sm:space-y-4 max-h-[calc(100vh-var(--navbar-height,64px)-52px-24px)]">
              <div className="overflow-hidden rounded-lg border border-white/5 bg-surface shadow-xl">
                <div className="relative">
                  <img
                    src={newVan5}
                    alt="Supersonic Services Van"
                    className="h-40 sm:h-65 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl bg-black/60 px-6 py-3 backdrop-blur">
                    <span className="grid h-6 w-6 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-sm text-white leading-tight">
                      <p className="uppercase tracking-[0.18em]">Efficiency Rate</p>
                      <p className="font-semibold">100%</p>
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
                value="117 Ganzeweide, 6413 GC, Heerlen, The Netherlands"
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
  inputId,
  fileState,
  accept,
  onFileChange,
  onFileSelect,
}: {
  icon: React.ReactNode;
  title: string;
  inputId: string;
  fileState: string;
  accept: string;
  onFileChange: (name: string) => void;
  onFileSelect: (file: File) => void | Promise<void>;
}) {
  return (
    <label
      htmlFor={inputId}
      className="rounded-xl border border-white/5 bg-black/40 p-4 flex flex-col justify-between text-left relative overflow-hidden min-h-35 cursor-pointer"
    >
      <div className="text-primary mb-2 shrink-0">{icon}</div>
      <h4 className="text-[10px] font-bold uppercase tracking-wide text-foreground/90 leading-tight">
        {title}
      </h4>
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileChange(file.name);
            onFileSelect(file);
          }
        }}
      />
      {fileState && (
        <div className="mt-2 text-[10px] text-primary font-mono truncate bg-primary/5 px-2 py-1 rounded border border-primary/10">
          Loaded: {fileState}
        </div>
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2.5 text-xs gap-3 border border-white/2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium truncate max-w-45 text-right text-foreground">
        {value || "-"}
      </span>
    </div>
  );
}
