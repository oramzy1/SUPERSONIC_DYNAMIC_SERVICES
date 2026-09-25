import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Truck,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Loader2,
  FileText,
  X,
  Clock,
  Headphones,
  Check,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { supportApi } from "@/lib/api";

export const Route = createFileRoute("/ticket")({
  component: RouteComponent,
});

type DepartmentType = "fleet" | "ai" | "billing";
type PriorityType = "low" | "medium" | "high" | "critical";

interface TicketForm {
  subject: string;
  department: DepartmentType;
  priority: PriorityType;
  description: string;
  nodeIdentifier: string;
}

function RouteComponent() {
  const [form, setForm] = useState<TicketForm>({
    subject: "",
    department: "fleet",
    priority: "medium",
    description: "",
    nodeIdentifier: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectDepartment = (dept: DepartmentType) => {
    setForm((prev) => ({ ...prev, department: dept }));
  };

  const handleSelectPriority = (priority: PriorityType) => {
    setForm((prev) => ({ ...prev, priority: priority }));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setAttachments((prev) => [...prev, ...files].slice(0, 3));
    e.target.value = "";
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.subject || !form.description) {
      setErrorMsg("Subject and description are required.");
      return;
    }
    if (form.description.length < 10) {
      setErrorMsg("Description must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supportApi.createTicket({
        email: form.nodeIdentifier || "anonymous@supersonicdynamic.com",
        subject: form.subject,
        message: `[${form.department.toUpperCase()}] [${form.priority.toUpperCase()}] ${form.description}`,
      });
      setTicketId(String(res.id));
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to submit ticket. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DEPARTMENTS: {
    key: DepartmentType;
    label: string;
    sub: string;
    Icon: typeof Truck;
  }[] = [
    {
      key: "fleet",
      label: "Moving & Delivery",
      sub: "Track trucks, updates & schedule adjustments",
      Icon: Truck,
    },
    {
      key: "ai",
      label: "App & Account",
      sub: "Help with your online account or login",
      Icon: Bot,
    },
    {
      key: "billing",
      label: "Billing & Receipts",
      sub: "Invoices, iDEAL payments & cost questions",
      Icon: Zap,
    },
  ];

  return (
    <div className="min-h-dvh w-full bg-background text-foreground flex flex-col font-sans select-none">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-black tracking-wide text-foreground uppercase leading-tight">
            Supersonic <span className="text-primary">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-muted-foreground tracking-wider uppercase hidden xs:block mt-0.5">
            Customer Support Center
          </span>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden xs:inline">Back to Home</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN CONTENT AREA: tinted backdrop so the card stands apart from the page background */}
      <div className="flex-1 w-full px-4 py-8 sm:py-12 flex items-center justify-center overflow-y-auto bg-linear-to-br from-primary/10 via-primary/5 to-emerald-500/5">
        <div className="w-full max-w-6xl bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-150">
          
          {/* LEFT PANEL: HERO IMAGE & HIGHLIGHTS (dark, high-contrast) */}
          <div className="lg:col-span-5 relative bg-linear-to-br from-slate-950 via-slate-900 to-primary p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
            {/* Background Decorative Graphic / Image */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay grayscale">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                alt="Support background"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Soft glow accents */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/25 text-white text-xs font-semibold backdrop-blur">
                <Headphones className="h-3.5 w-3.5" />
                <span>We're here to help</span>
              </div>

              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  How can we assist your move today?
                </h1>
                <p className="text-xs sm:text-sm text-white/85 mt-2 leading-relaxed">
                  Send us a message and our support team will get right on it to make your experience smooth and hassle-free.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-xs text-white">
                  <div className="p-2 rounded-lg bg-emerald-400/15 border border-emerald-300/30 text-emerald-300 mt-0.5 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-sm">Fast Response Times</span>
                    <span className="text-white/80 leading-relaxed">Most inquiries receive a reply within 2 hours.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-white">
                  <div className="p-2 rounded-lg bg-white/10 border border-white/25 text-white mt-0.5 shrink-0">
                    <Headphones className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-sm">Dedicated Support Agents</span>
                    <span className="text-white/80 leading-relaxed">Direct assistance tailored to your moving order.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
              <span>Supersonic Support System</span>
              <span className="text-emerald-300 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Agents Active
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: FORM OR SUCCESS DISPLAY */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white">
            {isSuccess ? (
              /* SUCCESS SCREEN */
              <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 my-auto w-full">
                <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Submitted successfully
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                    Request Received!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out. We've logged your request and our team will get back to you shortly.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-slate-600 space-y-2.5">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600 font-medium">Ticket Reference</span>
                    <span className="text-primary font-mono font-semibold">#SR-{ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Assigned Team</span>
                    <span className="text-slate-900 font-semibold">
                      {DEPARTMENTS.find((d) => d.key === form.department)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Priority</span>
                    <span
                      className={`font-semibold capitalize ${
                        form.priority === "critical" || form.priority === "high"
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {form.priority === "critical" ? "Urgent" : form.priority}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        subject: "",
                        department: "fleet",
                        priority: "medium",
                        description: "",
                        nodeIdentifier: "",
                      });
                      setAttachments([]);
                      setTicketId(null);
                      setIsSuccess(false);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold hover:bg-primary/5 hover:border-primary/50 text-slate-800 transition"
                  >
                    Send another message
                  </button>
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-90 text-center transition"
                  >
                    Done
                  </Link>
                </div>
              </div>
            ) : (
              /* TICKET INTAKE FORM */
              <form onSubmit={handleSubmitTicket} className="flex flex-col h-full justify-between">
                <div>
                  {/* Form Header */}
                  <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <FileText className="h-4 w-4" />
                      </span>
                      Submit Support Request
                    </h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Please select a category and fill in the details below.
                    </p>
                  </div>

                  {/* Form Body Inputs */}
                  <div className="p-6 space-y-5">
                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Team Selection Cards */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wide text-slate-900 block">
                        Select a category
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {DEPARTMENTS.map(({ key, label, sub, Icon }) => {
                          const isActive = form.department === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleSelectDepartment(key)}
                              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                isActive
                                  ? "bg-primary/5 border-primary text-slate-900 shadow-sm ring-1 ring-primary/25"
                                  : "bg-white border-slate-300 text-slate-600 hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-2">
                                <div
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isActive ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-900 tracking-tight leading-snug">
                                  {label}
                                </h4>
                                <p className="text-[10px] text-slate-600 mt-0.5 leading-normal line-clamp-2">
                                  {sub}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subject & Optional Reference Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label htmlFor="subject" className="text-xs font-semibold text-slate-900 block">
                          Subject / Topic
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={form.subject}
                          onChange={handleInputChange}
                          placeholder="e.g., Update delivery address"
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 px-3 text-xs text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="nodeIdentifier"
                          className="text-xs font-semibold text-slate-900 block"
                        >
                          Booking or Move ID <span className="text-slate-500 font-normal">(optional)</span>
                        </label>
                        <input
                          id="nodeIdentifier"
                          name="nodeIdentifier"
                          type="text"
                          disabled={isSubmitting}
                          value={form.nodeIdentifier}
                          onChange={handleInputChange}
                          placeholder="e.g., BRK-90210"
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 px-3 text-xs text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-60 uppercase"
                        />
                      </div>
                    </div>

                    {/* Urgency Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-900 block">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(["low", "medium", "high", "critical"] as PriorityType[]).map((prio) => {
                          const isSelected = form.priority === prio;
                          let styleClass =
                            "border-slate-300 bg-white text-slate-700 hover:border-primary/50 hover:bg-primary/5";

                          if (isSelected) {
                            if (prio === "low")
                              styleClass = "border-slate-500 bg-slate-100 text-slate-900 font-semibold";
                            if (prio === "medium")
                              styleClass = "border-primary bg-primary/10 text-primary font-semibold";
                            if (prio === "high")
                              styleClass =
                                "border-amber-500 bg-amber-50 text-amber-700 font-semibold";
                            if (prio === "critical")
                              styleClass =
                                "border-rose-500 bg-rose-50 text-rose-700 font-semibold";
                          }

                          return (
                            <button
                              key={prio}
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleSelectPriority(prio)}
                              className={`py-1.5 px-3 border text-center rounded-lg text-[11px] capitalize transition ${styleClass}`}
                            >
                              {prio === "critical" ? "Urgent" : prio}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="description"
                        className="text-xs font-semibold text-slate-900 block"
                      >
                        How can we help?
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        disabled={isSubmitting}
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="Please provide details about your issue or question..."
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-60 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-900 block">
                        Attachments <span className="text-slate-500 font-normal">(optional, max 3)</span>
                      </label>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.csv,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFilesSelected}
                      />

                      <div className="flex flex-wrap gap-2.5 items-center">
                        <button
                          type="button"
                          disabled={isSubmitting || attachments.length >= 3}
                          onClick={handleAttachClick}
                          className="flex items-center gap-2 border border-dashed border-slate-400 hover:border-primary/60 bg-slate-50 hover:bg-primary/5 px-3 py-1.5 rounded-lg text-xs text-slate-800 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>Attach File</span>
                        </button>

                        <span className="text-[11px] text-slate-600">
                          {attachments.length === 3
                            ? "Limit reached"
                            : "PDF, CSV, JPEG, or PNG"}
                        </span>
                      </div>

                      {attachments.length > 0 && (
                        <div className="pt-1 flex flex-col gap-1.5">
                          {attachments.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 animate-in slide-in-from-top-1 duration-150"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="truncate text-xs text-slate-800">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleRemoveAttachment(index)}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded transition shrink-0 ml-2"
                                aria-label="Remove uploaded file"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Your information is safe and secure</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/"
                      className="flex-1 sm:flex-none px-4 py-3 text-center text-xs font-semibold border border-slate-300 hover:border-primary/50 bg-white text-slate-700 hover:text-slate-900 rounded-lg transition"
                    >
                      Cancel
                    </Link>

                    <CTAButton
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-primary-foreground text-xs font-semibold transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Submit Request</span>
                      )}
                    </CTAButton>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}