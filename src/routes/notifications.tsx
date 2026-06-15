import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-dvh w-screen bg-[#0B0F14] text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* HEADER BAR */}
      <header className="h-14 w-full bg-[#0F151C] border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black tracking-widest text-white uppercase leading-tight">
            Supersonic <span className="text-[#8EA7FF]">Dynamic Services B.V.</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">
            Notification Center • Live Updates
          </span>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-[#8EA7FF] flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </header>

      {/* COMING SOON CONTENT PANEL */}
      <div className="flex-1 w-full overflow-y-auto bg-[#0B1015]/20 p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-[#0F151C] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-1xl text-center space-y-6">
          {/* Icon Context */}
          <div className="relative mx-auto h-16 w-16 bg-[#8EA7FF]/5 border border-[#8EA7FF]/20 rounded-2xl flex items-center justify-center text-[#8EA7FF]">
            <Bell className="h-8 w-8 animate-pulse" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Typography */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Notification Hub Coming Soon
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              We are building a real-time notification terminal. Soon you will be able to monitor
              live moving updates, vehicle ETAs, and urgent service logs from this control window.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 bg-white/4 border border-white/5 rounded-full px-4 py-1.5 text-[11px] font-mono text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin text-[#8EA7FF]" />
            <span>Deployment in Progress</span>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Link
              to="/"
              className="block w-full sm:w-auto mx-auto px-5 py-2.5 rounded-xl bg-primary text-slate-900 text-xs font-bold hover:opacity-95 text-center transition"
            >
              Return to Control Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
