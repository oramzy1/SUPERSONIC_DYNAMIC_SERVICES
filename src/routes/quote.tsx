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

  // Smart Storage Fields
  storageSize: z.string().optional(),

  // Freight Haulage Fields
  freightWeight: z.string().optional(),
  freightType: z.string().optional(),
  additionalServices: z.string().optional(),
  deliveryDate: z.string().optional(),

  // Step 2 uploads logic hooks
  description: z.string().optional(),
  videoNote: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
  { v: "student-moving", label: "Student Moving & Micro Moving With Supersonic" },
  { v: "residential-moving", label: "Residential Moving Local & Long Distance" },
  { v: "enterprise-moving", label: "Enterprise & Commercial Moving" },
  { v: "smart-storage", label: "SMART STORAGE SOLUTION" },
  { v: "sustainable-waste", label: "SUSTAINABLE WASTE REMOVAL SERVICES" },
  {
    v: "freight-haulage",
    label: "RELIABLE FREIGHT HAULAGE SERVICES - Safe, Efficient & On-Time Delivery",
  },
];

function Quote() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { show, hide } = useLoading();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      serviceType: "",
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
      const fieldsToValidate: any[] = ["serviceType", "name"];
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
      ok = await trigger(fieldsToValidate);
    }
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

        {/* Progress Bar */}
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-white/5 bg-surface p-6 md:p-8 relative"
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
                  {/* Premium Upgraded Custom Animated Dropdown Field */}
                  <Field
                    label="Select Service Type"
                    error={errors.serviceType?.message}
                    icon={<Truck className="h-4 w-4" />}
                  >
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full text-left rounded-lg pl-9 pr-10 py-3 text-sm bg-black text-foreground border border-white/10 hover:border-white/20 focus:border-primary focus:outline-none flex items-center justify-between transition-all relative z-20"
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
                          {/* Full screen invisible overlay backplate to safely close menu on clickaway */}
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
                                  className={`w-full text-left rounded-lg px-4 py-2.5 my-0.5 text-xs md:text-sm transition-colors flex items-center ${
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <input
                              className="field w-full rounded-lg px-3 py-2.5 text-sm"
                              placeholder="e.g. Packing service, Assembly setup, Extra hand loader"
                              {...register("additionalServices")}
                            />
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            {...register("date")}
                          />
                        </Field>
                        <Field
                          label="Select size of storage unit (DDB)"
                          error={errors.storageSize?.message}
                        >
                          <select
                            className="field w-full rounded-lg px-3 py-2.5 text-sm bg-black text-white border border-white/10 focus:outline-none animate-none"
                            {...register("storageSize")}
                          >
                            <option value="">Select storage sizing unit...</option>
                            <option value="small">Small Container Unit</option>
                            <option value="medium">Medium Container Unit</option>
                            <option value="large">Large Warehouse Suite Container</option>
                          </select>
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <input
                              className="field w-full rounded-lg px-3 py-2.5 text-sm"
                              placeholder="e.g. Climate control monitoring, Inventory listing, Collection logistics"
                              {...register("additionalServices")}
                            />
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            {...register("date")}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="DO YOU NEED ANY OF THE FOLLOWING ADDITIONAL SERVICES? CHOOSE AS MANY ADDITIONAL SERVICES YOU DESIRE FROM THE LIST.(Optional)">
                            <input
                              className="field w-full rounded-lg px-3 py-2.5 text-sm"
                              placeholder="e.g. Heavy item dismantling, Deep eco-cleaning recycling sorting"
                              {...register("additionalServices")}
                            />
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
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
                            className="field w-full rounded-lg pl-9 pr-3 py-2.5 text-sm"
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
                            <input
                              className="field w-full rounded-lg px-3 py-2.5 text-sm"
                              placeholder="e.g. Tailgate lift routing, Express custom verification clearings"
                              {...register("additionalServices")}
                            />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                      />
                      <PreviewBox
                        icon={<FileText className="h-5 w-5" />}
                        title="CLICK HERE TO UPLOAD( A DETAILED ASSIGNMENT DESCRIPTION OF THE JOB):"
                        body="Provide the specific dynamic service instructions parameters"
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
                    Help us understand your setup requirements accurately with files and written
                    instructions.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center">
                      <Upload className="mx-auto h-7 w-7 text-primary" />
                      <p className="mt-3 font-medium uppercase tracking-wide text-xs px-2 text-foreground">
                        {isStorageSelected
                          ? "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS TO BE STORED):"
                          : "CLICK HERE TO UPLOAD( A SHORT DETAILED VIDEO OF THE ITEMS WE NEED TO MOVE):"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">MP4 / MOV up to 200MB</p>
                      <input
                        type="file"
                        className="mt-4 mx-auto block text-xs text-muted-foreground"
                      />
                    </div>

                    <Field label="CLICK HERE TO UPLOAD( A DETAILED ASSIGNMENT DESCRIPTION OF THE JOB):">
                      {isWasteSelected && (
                        <div className="mb-3">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                            DESCRIPTION OF THE TYPE OF WASTE REQUIRING REMOVAL
                          </span>
                        </div>
                      )}
                      {isFreightSelected && (
                        <div className="mb-3">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                            DESCRIPTION OF THE TYPE OF FREIGHT
                          </span>
                          <input
                            className="field w-full rounded-lg px-3 py-2 text-sm mb-3 bg-black/40"
                            placeholder="Describe layout category items type safely..."
                            {...register("freightType")}
                          />
                        </div>
                      )}
                      <textarea
                        rows={5}
                        className="field w-full rounded-lg px-3 py-2.5 text-sm"
                        placeholder="Provide details corresponding with your targeted digital workflow..."
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
                <CTAButton
                  type="button"
                  variant="white"
                  className="rounded-xl"
                  onClick={next}
                  disabled={!isAnyServiceSelected}
                >
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
    <div className="block w-full mb-4">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/80">
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
    <div className="rounded-xl border border-white/5 bg-black/20 p-6 text-center flex flex-col justify-center items-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-foreground mb-2">
        {icon}
      </div>
      <p className="font-display text-[11px] font-bold uppercase text-primary tracking-wide leading-tight px-1">
        {title}
      </p>
      <p className="text-[10px] text-muted-foreground mt-1">{body}</p>
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
  const matchedService = SERVICE_OPTIONS.find((s) => s.v === values.serviceType);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-display text-2xl font-semibold">Final Review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Verify your logistics assignment parameters before final submission.
      </p>

      <div className="mt-6 grid items-center gap-4 rounded-2xl bg-black/30 p-5 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3 w-3" /> Setup Location / Pickup
          </p>
          <p className="mt-2 font-display text-lg font-semibold">{values.residentAddress || "-"}</p>
          <p className="text-xs text-muted-foreground">Post code {values.currentPostCode || "-"}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0E141A]">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="text-right md:text-left">
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:justify-start">
            <MapPin className="h-3 w-3" /> Destination / Dropoff
          </p>
          <p className="mt-2 font-display text-lg font-semibold">
            {values.destinationAddress || "N/A (Single Point)"}
          </p>
          <p className="text-xs text-muted-foreground">
            Post code {values.destinationPostCode || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Row label="Client Name" value={values.name} />
        <Row label="Company Reference" value={values.company || "-"} />
        <Row label="Contact Identification" value={values.phone || values.email || "-"} />
        <Row label="Target Operational Date" value={values.date} />
        <Row
          label="Selected Category"
          value={matchedService ? matchedService.label : values.serviceType}
        />
        {values.storageSize && <Row label="Storage Sizing (DDB)" value={values.storageSize} />}
        {values.freightWeight && <Row label="Freight Weight" value={values.freightWeight} />}
        {values.additionalServices && (
          <Row label="Requested Add-ons" value={values.additionalServices} />
        )}
      </div>

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
        By choosing Supersonic Dynamic Services, you are offsetting carbon outputs dynamically for
        this specific route execution path.
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium truncate max-w-50">{value || "-"}</span>
    </div>
  );
}
