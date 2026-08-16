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
      setErrorMsg("Please tell us what you need help with and provide a short description.");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

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
    <div className="min-h-dvh w-screen bg-[#0B0F14] text-white flex flex-col font-sans select-none">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-black tracking-wide text-white uppercase leading-tight">
            Supersonic <span className="text-primary">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-slate-500 tracking-wider uppercase hidden xs:block mt-0.5">
            Customer Support Center
          </span>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-primary flex items-center gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden xs:inline">Back to Home</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full bg-[#0B1015]/20 px-4 py-8 sm:py-12 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-6xl bg-[#0F151C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-150">
          
          {/* LEFT PANEL: HERO IMAGE & HIGHLIGHTS */}
          <div className="lg:col-span-5 relative bg-linear-to-b from-[#131A23] to-[#0A0E13] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
            {/* Background Decorative Graphic / Image */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                alt="Support background"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Headphones className="h-3.5 w-3.5" />
                <span>We're here to help</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  How can we assist your move today?
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Send us a message and our support team will get right on it to make your experience smooth and hassle-free.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Fast Response Times</span>
                    <span className="text-slate-400">Most inquiries receive a reply within 2 hours.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="p-1 rounded bg-primary/10 text-primary mt-0.5 shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Dedicated Support Agents</span>
                    <span className="text-slate-400">Direct assistance tailored to your moving order.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Supersonic Support System</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Agents Active
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: FORM OR SUCCESS DISPLAY */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#0F151C]">
            {isSuccess ? (
              /* SUCCESS SCREEN */
              <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 my-auto">
                <div className="mx-auto h-16 w-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    Request Received!
                  </h2>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out. We've logged your request and our team will get back to you shortly.
                  </p>
                </div>

                <div className="bg-[#141C25] border border-white/5 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-slate-400 space-y-2.5">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 font-medium">Ticket Reference</span>
                    <span className="text-primary font-mono font-semibold">#SR-{ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Assigned Team</span>
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
                    Send another message
                  </button>
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 text-center transition"
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
                  <div className="px-6 py-5 border-b border-white/5 bg-[#131A23]/60">
                    <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      Submit Support Request
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Please select a category and fill in the details below.
                    </p>
                  </div>

                  {/* Form Body Inputs */}
                  <div className="p-6 space-y-5">
                    {errorMsg && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Team Selection Cards */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wide text-slate-300 block">
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
                                  ? "bg-primary/10 border-primary text-white shadow-sm"
                                  : "bg-[#11161D] border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#151B24]"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-2">
                                <div
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isActive ? "bg-primary text-primary-foreground" : "bg-white/5 text-slate-400"
                                  }`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                                  {label}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal line-clamp-2">
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
                        <label htmlFor="subject" className="text-xs font-semibold text-slate-300 block">
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
                          className="w-full rounded-lg border border-white/10 bg-white/5 py-3 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-primary focus:bg-white/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="nodeIdentifier"
                          className="text-xs font-semibold text-slate-300 block"
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
                          className="w-full rounded-lg border border-white/10 bg-white/5 py-3 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-primary focus:bg-white/10 uppercase"
                        />
                      </div>
                    </div>

                    {/* Urgency Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(["low", "medium", "high", "critical"] as PriorityType[]).map((prio) => {
                          const isSelected = form.priority === prio;
                          let styleClass =
                            "border-white/5 bg-[#11161D] text-slate-400 hover:border-white/10 hover:bg-[#151B24]";

                          if (isSelected) {
                            if (prio === "low")
                              styleClass = "border-slate-400 bg-white/10 text-white font-semibold";
                            if (prio === "medium")
                              styleClass = "border-primary bg-primary/10 text-white font-semibold";
                            if (prio === "high")
                              styleClass =
                                "border-amber-500 bg-amber-500/10 text-amber-300 font-semibold";
                            if (prio === "critical")
                              styleClass =
                                "border-rose-500 bg-rose-500/10 text-rose-400 font-semibold";
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
                        className="text-xs font-semibold text-slate-300 block"
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
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-primary focus:bg-white/10 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">
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
                          className="flex items-center gap-2 border border-dashed border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs text-slate-300 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>Attach File</span>
                        </button>

                        <span className="text-[11px] text-slate-500">
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
                              className="flex items-center justify-between bg-[#11161D] border border-white/5 rounded-lg px-3 py-1.5 animate-in slide-in-from-top-1 duration-150"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="truncate text-xs text-slate-300">
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
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#090F15]/60 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Your information is safe and secure</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/"
                      className="flex-1 sm:flex-none px-4 py-2 text-center text-xs font-semibold border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-lg transition"
                    >
                      Cancel
                    </Link>

                    <CTAButton
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-primary-foreground text-xs font-semibold transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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