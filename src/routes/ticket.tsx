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
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";

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
    if (!form.subject.trim() || !form.description.trim()) {
      setErrorMsg("Please fill out both the summary and explanation fields.");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    // Replace this with your real ticket-creation API call.
    // Send `form` and `attachments` (as FormData) to your backend, then use
    // the returned ticket ID below instead of this placeholder.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setTicketId(String(Math.floor(Math.random() * 90000) + 10000));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const DEPARTMENTS: {
    key: DepartmentType;
    label: string;
    sub: string;
    Icon: typeof Truck;
  }[] = [
    {
      key: "fleet",
      label: "Moving & fleet operations",
      sub: "Route tracking, delays & delivery details",
      Icon: Truck,
    },
    {
      key: "ai",
      label: "Automated support",
      sub: "Digital platform & account access help",
      Icon: Bot,
    },
    {
      key: "billing",
      label: "Invoices & payments",
      sub: "Billing statements, iDEAL & receipts",
      Icon: Zap,
    },
  ];

  return (
    <div className="min-h-dvh w-screen bg-[#0B0F14] text-white flex flex-col font-sans select-none">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-black tracking-wide text-white uppercase leading-tight">
            Supersonic <span className="text-primary">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-slate-500 tracking-wider uppercase hidden xs:block mt-0.5">
            Customer help desk
          </span>
        </div>

        <Link
          to="/support"
          className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden xs:inline">Return to help center</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full bg-[#0B1015]/20 px-4 py-8 sm:py-12 flex items-start justify-center overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#0F151C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {isSuccess ? (
            /* SUCCESS SCREEN */
            <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto h-16 w-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Your request has been received
                </h2>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  We've logged your request. Our support team is reviewing the details and will get
                  back to you shortly.
                </p>
              </div>

              <div className="bg-[#141C25] border border-white/5 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-slate-400 space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-medium">Request ID</span>
                  <span className="text-primary font-mono">#SR-{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Team assigned</span>
                  <span className="text-white font-medium">
                    {DEPARTMENTS.find((d) => d.key === form.department)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Priority</span>
                  <span
                    className={`font-semibold capitalize ${
                      form.priority === "critical" || form.priority === "high"
                        ? "text-rose-400"
                        : "text-emerald-400"
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
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold hover:bg-white/10 text-slate-200 transition"
                >
                  Send another request
                </button>
                <Link
                  to="/support"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 text-center transition"
                >
                  Back to help center
                </Link>
              </div>
            </div>
          ) : (
            /* TICKET INTAKE FORM */
            <form onSubmit={handleSubmitTicket} className="flex flex-col">
              {/* Form Header with Captions */}
              <div className="px-6 py-6 border-b border-white/5 bg-[#131A23]">
                <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  Submit a support request
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Having an issue with a booking, an ongoing move, or an invoice? Share the details
                  below and our team will follow up shortly.
                </p>
              </div>

              {/* Form Body Inputs */}
              <div className="p-6 space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Team Selection Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wide text-slate-400 block">
                    Which team do you need help from?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {DEPARTMENTS.map(({ key, label, sub, Icon }) => {
                      const isActive = form.department === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSelectDepartment(key)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                            isActive
                              ? "bg-primary/5 border-primary text-white shadow-sm"
                              : "bg-[#11161D] border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#151B24]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors mt-0.5 ${
                              isActive ? "bg-primary/15 text-primary" : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                              {label}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                              {sub}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject & Optional ID Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-400 block">
                      Short summary of your issue
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={form.subject}
                      onChange={handleInputChange}
                      placeholder="e.g., Update delivery destination address"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-primary focus:bg-white/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="nodeIdentifier"
                      className="text-xs font-semibold text-slate-400 block"
                    >
                      Order / move reference{" "}
                      <span className="text-slate-600 font-normal">(optional)</span>
                    </label>
                    <input
                      id="nodeIdentifier"
                      name="nodeIdentifier"
                      type="text"
                      disabled={isSubmitting}
                      value={form.nodeIdentifier}
                      onChange={handleInputChange}
                      placeholder="e.g., BRK-90210"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-primary focus:bg-white/10 uppercase"
                    />
                  </div>
                </div>

                {/* Urgency Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">
                    How urgent is this?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["low", "medium", "high", "critical"] as PriorityType[]).map((prio) => {
                      const isSelected = form.priority === prio;
                      let styleClass =
                        "border-white/5 bg-[#11161D] text-slate-400 hover:border-white/10 hover:bg-[#151B24]";

                      if (isSelected) {
                        if (prio === "low")
                          styleClass = "border-slate-400 bg-white/5 text-white font-semibold";
                        if (prio === "medium")
                          styleClass = "border-primary bg-primary/5 text-white font-semibold";
                        if (prio === "high")
                          styleClass =
                            "border-amber-500 bg-amber-500/5 text-amber-300 font-semibold";
                        if (prio === "critical")
                          styleClass =
                            "border-rose-500 bg-rose-500/5 text-rose-400 font-semibold tracking-wide";
                      }

                      return (
                        <button
                          key={prio}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSelectPriority(prio)}
                          className={`py-2 px-3 border text-center rounded-lg text-xs uppercase tracking-wide transition ${styleClass}`}
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
                    className="text-xs font-semibold text-slate-400 block"
                  >
                    Detailed explanation
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Share as much detail as you can so our team can help quickly..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-primary focus:bg-white/10 resize-none leading-relaxed"
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block">
                    Supporting documents{" "}
                    <span className="text-slate-600 font-normal">(optional, up to 3 files)</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.csv,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFilesSelected}
                  />

                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      type="button"
                      disabled={isSubmitting || attachments.length >= 3}
                      onClick={handleAttachClick}
                      className="flex items-center gap-2 border border-dashed border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-300 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <span>Attach invoice, bill, or document</span>
                    </button>

                    <span className="text-[11px] text-slate-500 italic">
                      {attachments.length === 3
                        ? "Maximum of 3 files reached"
                        : "PDF, CSV, or image files"}
                    </span>
                  </div>

                  {attachments.length > 0 && (
                    <div className="pt-1 flex flex-col gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between bg-[#11161D] border border-white/5 rounded-lg px-3 py-2 animate-in slide-in-from-top-1 duration-150"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate text-xs font-mono text-slate-400">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleRemoveAttachment(index)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition shrink-0 ml-2"
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

              {/* Action Footer */}
              <div className="px-6 py-4 border-t border-white/5 bg-[#090F15]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Secure submission</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    to="/support"
                    className="flex-1 sm:flex-none px-4 py-2.5 text-center text-xs font-semibold border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-lg transition"
                  >
                    Cancel
                  </Link>

                  <CTAButton
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-primary-foreground font-semibold transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Sending request...</span>
                      </>
                    ) : (
                      <span>Send request</span>
                    )}
                  </CTAButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
