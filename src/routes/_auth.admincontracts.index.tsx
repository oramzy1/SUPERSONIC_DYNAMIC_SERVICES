import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/admincontracts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(idInput);
    if (!id || Number.isNaN(id)) return;
    navigate({ to: "/admincontracts/$contractId", params: { contractId: String(id) } });
  };

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Contracts" }]} />
      <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Contracts</h1>
      <p className="text-sm text-slate-400 mb-8">
        There's no contract listing endpoint yet — open a specific contract by its ID (from the
        "customer signed" internal notification email) to review and countersign it.
      </p>

      <form onSubmit={go} className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 max-w-md">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
          Contract ID
        </label>
        <div className="flex gap-2">
          <input
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            placeholder="e.g. 14"
            className="flex-1 bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#E2A54A]/60"
          />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-[#E2A54A] px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-[#d4963b]">
            <Search className="w-3.5 h-3.5" /> Open
          </button>
        </div>
      </form>
    </div>
  );
}