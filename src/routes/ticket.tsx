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
    nodeIdentifier: "AMS-CORE-01",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [ticketId] = useState(() => Math.floor(Math.random() * 90000) + 10000);

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

  const handleSimulateAttachment = () => {
    const mockFiles = ["error_log_041.json", "payment_receipt.pdf", "shipping_manifest.csv"];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (attachments.length < 3) {
      setAttachments((prev) => [...prev, `${Date.now().toString().slice(-4)}_${randomFile}`]);
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      setErrorMsg("Please fill out both the subject and description fields.");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-dvh w-screen bg-[#0B0F14] text-white flex flex-col font-sans select-none">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 sticky top-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] sm:text-xs font-black tracking-widest text-white uppercase leading-tight">
            Supersonic <span className="text-[#8EA7FF]">Dynamic Services B.V.</span>
          </span>
          <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono tracking-wider uppercase hidden xs:block">
            Support Center • Create New Ticket
          </span>
        </div>

        <Link
          to="/support"
          className="text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1 sm:gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="hidden xs:inline">Back to Help Console</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 w-full bg-[#0B1015]/20 px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-[#0F151C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* SUCCESS SCREEN */}
          {isSuccess ? (
            <div className="p-5 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                  Ticket Submitted Successfully
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your support request has been recorded. Our ground operations team has been
                  notified and will look into this shortly.
                </p>
              </div>

              <div className="bg-[#141C25] border border-white/5 rounded-xl p-4 text-left max-w-xs sm:max-w-md mx-auto font-mono text-[11px] text-slate-400 space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500">TICKET ID:</span>
                  <span className="text-[#8EA7FF]">#TK-{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DEPARTMENT:</span>
                  <span className="text-white uppercase">{form.department} Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PRIORITY:</span>
                  <span
                    className={`${
                      form.priority === "critical" || form.priority === "high"
                        ? "text-rose-400"
                        : "text-emerald-400"
                    } uppercase`}
                  >
                    {form.priority}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      subject: "",
                      department: "fleet",
                      priority: "medium",
                      description: "",
                      nodeIdentifier: "AMS-CORE-01",
                    });
                    setAttachments([]);
                    setIsSuccess(false);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 bg-white/4 text-xs font-semibold hover:bg-white/8 text-slate-200 transition"
                >
                  Submit Another Ticket
                </button>
                <Link
                  to="/support"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8EA7FF] text-slate-900 text-xs font-bold hover:opacity-95 text-center transition"
                >
                  Return to Support Workspace
                </Link>
              </div>
            </div>
          ) : (
            /* TICKET INTAKE FORM */
            <form onSubmit={handleSubmitTicket} className="divide-y divide-white/5">
              {/* Form Header */}
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#8EA7FF] shrink-0" />
                  Submit a Support Ticket
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                  Need help with routing issues, system updates, or billing discrepancies? Let us
                  know the details below.
                </p>
              </div>

              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 space-y-5 sm:space-y-6">
                {/* Error Output */}
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* DEPARTMENT CARDS */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    Which department do you need help from?
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                    {[
                      {
                        key: "fleet" as DepartmentType,
                        label: "Fleet Operations",
                        sub: "Route updates & map tracking",
                        Icon: Truck,
                        activeCard: "bg-[#8EA7FF]/5 border-[#8EA7FF] shadow-[#8EA7FF]/5",
                        activeIcon: "bg-[#8EA7FF]/20 text-[#8EA7FF]",
                      },
                      {
                        key: "ai" as DepartmentType,
                        label: "AI & Autopilot",
                        sub: "Automation & system guidance",
                        Icon: Bot,
                        activeCard: "bg-purple-500/5 border-purple-500 shadow-purple-500/5",
                        activeIcon: "bg-purple-500/20 text-purple-400",
                      },
                      {
                        key: "billing" as DepartmentType,
                        label: "Billing & iDEAL",
                        sub: "Invoices & payment verification",
                        Icon: Zap,
                        activeCard: "bg-amber-500/5 border-amber-500 shadow-amber-500/5",
                        activeIcon: "bg-amber-500/20 text-amber-400",
                      },
                    ].map(({ key, label, sub, Icon, activeCard, activeIcon }) => {
                      const isActive = form.department === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSelectDepartment(key)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center xs:items-start gap-3 ${
                            isActive
                              ? `${activeCard} text-white shadow-lg`
                              : "bg-[#11161D] border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#151B24]"
                          }`}
                        >
                          <div
                            className={`p-1.5 sm:p-2 rounded-lg shrink-0 transition-colors ${
                              isActive ? activeIcon : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                              {label}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 hidden xs:block line-clamp-1">
                              {sub}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block"
                    >
                      Ticket Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={form.subject}
                      onChange={handleInputChange}
                      placeholder="Brief summary of the issue..."
                      className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 px-3.5 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="nodeIdentifier"
                      className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block"
                    >
                      System Location Identifier
                    </label>
                    <input
                      id="nodeIdentifier"
                      name="nodeIdentifier"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={form.nodeIdentifier}
                      onChange={handleInputChange}
                      placeholder="AMS-CORE-01"
                      className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 px-3.5 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] font-mono"
                    />
                  </div>
                </div>

                {/* PRIORITY PACK */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    Select Priority Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["low", "medium", "high", "critical"] as PriorityType[]).map((prio) => {
                      const isSelected = form.priority === prio;
                      let styleClass =
                        "border-white/5 bg-[#11161D] text-slate-400 hover:border-white/10 hover:bg-[#151B24]";

                      if (isSelected) {
                        if (prio === "low")
                          styleClass = "border-slate-400 bg-white/5 text-white font-bold";
                        if (prio === "medium")
                          styleClass = "border-[#8EA7FF] bg-[#8EA7FF]/5 text-white font-bold";
                        if (prio === "high")
                          styleClass = "border-amber-500 bg-amber-500/5 text-amber-300 font-bold";
                        if (prio === "critical")
                          styleClass =
                            "border-rose-500 bg-rose-500/5 text-rose-400 font-bold tracking-wide";
                      }

                      return (
                        <button
                          key={prio}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSelectPriority(prio)}
                          className={`py-2.5 px-3 border text-center rounded-xl text-[10px] sm:text-xs uppercase tracking-wider transition ${styleClass}`}
                        >
                          {prio}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DESCRIPTION TEXTAREA */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="description"
                    className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block"
                  >
                    Detailed Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Please describe your issue or question in detail so our team can best assist you..."
                    className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 px-3.5 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/6 resize-none leading-relaxed"
                  />
                </div>

                {/* ATTACHMENTS */}
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                    Attachments{" "}
                    <span className="normal-case font-normal text-slate-600">
                      (Optional, up to 3 files)
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      type="button"
                      disabled={isSubmitting || attachments.length >= 3}
                      onClick={handleSimulateAttachment}
                      className="flex items-center gap-2 border border-dashed border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/4 px-3 sm:px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-300 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Paperclip className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">Attach Error Log or Document</span>
                      <span className="sm:hidden">Attach File</span>
                    </button>

                    <span className="text-[10px] text-slate-600 font-mono italic">
                      {attachments.length === 3 ? "Max file count reached" : "JSON, CSV, or PDF"}
                    </span>
                  </div>

                  {attachments.length > 0 && (
                    <div className="pt-1 flex flex-col gap-1.5">
                      {attachments.map((fileName, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-[#11161D] border border-white/5 rounded-lg px-3 py-2 animate-in slide-in-from-top-1 duration-150"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-3.5 w-3.5 text-[#8EA7FF] shrink-0" />
                            <span className="truncate text-[11px] font-mono text-slate-400">
                              {fileName}
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleRemoveAttachment(index)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition shrink-0 ml-2"
                            aria-label="Remove attached document"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="px-4 sm:px-6 md:px-8 py-4 bg-[#090F15]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8EA7FF] shrink-0" />
                  <span>Secure Connection • Identity Verified</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    to="/support"
                    className="flex-1 sm:flex-none px-4 py-2.5 text-center text-xs font-semibold border border-white/8 hover:border-white/15 text-slate-400 hover:text-white rounded-xl transition"
                  >
                    Cancel
                  </Link>

                  <CTAButton
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: "var(--primary)" }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-slate-900 font-bold transition hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-900 shrink-0" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Ticket</span>
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
