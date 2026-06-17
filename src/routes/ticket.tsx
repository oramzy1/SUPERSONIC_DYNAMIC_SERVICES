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
    const mockFiles = ["moving_receipt.pdf", "address_confirmation.pdf", "damage_photo.jpg"];
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
      setErrorMsg("Please fill out both the summary and explanation fields.");
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
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0">
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-black tracking-wide text-white uppercase leading-tight">
            Supersonic <span className="text-[#8EA7FF]">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-slate-500 tracking-wider uppercase hidden xs:block mt-0.5">
            Customer Help Desk • Contact Support Team
          </span>
        </div>

        <Link
          to="/support"
          className="text-xs font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1.5 transition shrink-0 ml-3"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden xs:inline">Return to Help Center</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full bg-[#0B1015]/20 px-4 py-8 flex items-start justify-center overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#0F151C] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {isSuccess ? (
            /* SUCCESS SCREEN */
            <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto h-16 w-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Help Request Received Successfully
                </h2>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your request has been logged. Our customer operations support team is reviewing
                  your details and will reply shortly.
                </p>
              </div>

              <div className="bg-[#141C25] border border-white/5 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-slate-400 space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-medium">REQUEST ID:</span>
                  <span className="text-[#8EA7FF] font-mono">#SR-{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">TEAM ASSIGNED:</span>
                  <span className="text-white uppercase font-medium">{form.department} Group</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">URGENCY:</span>
                  <span
                    className={`font-bold uppercase ${
                      form.priority === "critical" || form.priority === "high"
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {form.priority}
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
                    setIsSuccess(false);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold hover:bg-white/10 text-slate-200 transition"
                >
                  Send Another Request
                </button>
                <Link
                  to="/support"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-slate-900 text-xs font-bold hover:opacity-90 text-center transition"
                >
                  Back to Help Center
                </Link>
              </div>
            </div>
          ) : (
            /* TICKET INTAKE FORM */
            <form onSubmit={handleSubmitTicket} className="flex flex-col">
              {/* Form Header with Captions */}
              <div className="px-6 py-6 border-b border-white/5 bg-[#131A23]">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#8EA7FF] shrink-0" />
                  Submit a Support Request
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Experiencing an issue with your ongoing move, booking details, or invoice
                  verification? Share the specifics here, and our customer operations group will
                  resolve it promptly.
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
                    Which support team do you need assistance from?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        key: "fleet" as DepartmentType,
                        label: "Moving & Fleet Operations",
                        sub: "Route tracking, delays & delivery details",
                        Icon: Truck,
                        activeCard: "bg-[#8EA7FF]/5 border-[#8EA7FF] shadow-[#8EA7FF]/5",
                        activeIcon: "bg-[#8EA7FF]/20 text-[#8EA7FF]",
                      },
                      {
                        key: "ai" as DepartmentType,
                        label: "Automated Support",
                        sub: "Digital platform & account access help",
                        Icon: Bot,
                        activeCard: "bg-purple-500/5 border-purple-500 shadow-purple-500/5",
                        activeIcon: "bg-purple-500/20 text-purple-400",
                      },
                      {
                        key: "billing" as DepartmentType,
                        label: "Invoices & Payments",
                        sub: "Billing statements, iDEAL & receipts",
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
                          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                            isActive
                              ? `${activeCard} text-white shadow-md`
                              : "bg-[#11161D] border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#151B24]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors mt-0.5 ${
                              isActive ? activeIcon : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white tracking-tight leading-snug">
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
                      Short Summary of Issue
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
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="nodeIdentifier"
                      className="text-xs font-semibold text-slate-400 block"
                    >
                      Order / Move Reference ID{" "}
                      <span className="text-slate-600 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="nodeIdentifier"
                      name="nodeIdentifier"
                      type="text"
                      disabled={isSubmitting}
                      value={form.nodeIdentifier}
                      onChange={handleInputChange}
                      placeholder="e.g., BRK-90210"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/10 uppercase"
                    />
                  </div>
                </div>

                {/* Urgency Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">
                    Select Urgency Level
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
                          className={`py-2 px-3 border text-center rounded-lg text-xs uppercase tracking-wide transition ${styleClass}`}
                        >
                          {prio === "critical" ? "Urgent/Critical" : prio}
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
                    Detailed Explanation
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about your query here so our staff can give you an accurate resolution..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-[#8EA7FF] focus:bg-white/10 resize-none leading-relaxed"
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block">
                    Supporting Documents & Uploads{" "}
                    <span className="text-slate-600 font-normal">
                      (Optional, up to 3 attachments)
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      type="button"
                      disabled={isSubmitting || attachments.length >= 3}
                      onClick={handleSimulateAttachment}
                      className="flex items-center gap-2 border border-dashed border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-300 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <span>Attach Invoice, Bill or Document</span>
                    </button>

                    <span className="text-[11px] text-slate-500 italic">
                      {attachments.length === 3
                        ? "Maximum file threshold met"
                        : "PDF, CSV, or Image formats allowed"}
                    </span>
                  </div>

                  {attachments.length > 0 && (
                    <div className="pt-1 flex flex-col gap-2">
                      {attachments.map((fileName, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-[#11161D] border border-white/5 rounded-lg px-3 py-2 animate-in slide-in-from-top-1 duration-150"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-[#8EA7FF] shrink-0" />
                            <span className="truncate text-xs font-mono text-slate-400">
                              {fileName}
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
                  <ShieldCheck className="h-4 w-4 text-[#8EA7FF] shrink-0" />
                  <span>Secure Submission Platform</span>
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
                    style={{ backgroundColor: "var(--primary)" }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-slate-900 font-bold transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-900 shrink-0" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Send Request</span>
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
