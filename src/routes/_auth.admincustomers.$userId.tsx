import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Save, ShieldAlert } from "lucide-react";
import { accountApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/admincustomers/$userId")({
  component: UserDetailPage,
});

const ROLE_OPTIONS = ["customer", "crew", "admin"];

function errMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
    (err as Error)?.message ||
    "Request failed."
  );
}

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function UserDetailPage() {
  const { userId } = Route.useParams();
  const id = Number(userId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => accountApi.getUserAdmin(id),
  });

  const roleMutation = useMutation({
    mutationFn: (newRole: string) => accountApi.updateUserRole(id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setToast({ type: "success", message: "Role updated." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => accountApi.deleteUserAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      navigate({ to: "/admincustomers" });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const handleDelete = () => {
    // Uncertain whether this hard-deletes or anonymizes the account (the
    // presence of `is_anonymized` on ProfileResponse suggests it may
    // soft-delete) — worth confirming with the backend team.
    if (window.confirm(`Delete/anonymize ${user?.full_name}'s account? This cannot be undone from here.`)) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Customers", to: "/admincustomers" }, { label: `User #${userId}` }]} />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading account...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Customers", to: "/admincustomers" }, { label: `User #${userId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          Account not found.
          <div className="mt-3">
            <Link to="/admincustomers" className="text-[#E2A54A] text-xs font-semibold hover:underline">Back to Customers</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Customers", to: "/admincustomers" }, { label: user.full_name }]} />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border ${
          toast.type === "success" ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400" : "bg-[#0c1017] border-rose-500/30 text-rose-400"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user.profile_image_url ? (
            <img src={user.profile_image_url} className="w-12 h-12 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-400">
              {user.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{user.full_name}</h1>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md hover:bg-rose-500/10 transition disabled:opacity-50 self-start sm:self-auto"
        >
          {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          Delete Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0d111a]/40 border border-white/6 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Account Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Phone</p><p className="text-slate-200">{user.phone || "-"}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Joined</p><p className="text-slate-200">{formatDate(user.created_at)}</p></div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">Status</p>
              <p className={user.is_anonymized ? "text-slate-500" : user.is_active ? "text-emerald-400" : "text-rose-400"}>
                {user.is_anonymized ? "Anonymized" : user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div><p className="text-[10px] text-slate-500 uppercase mb-1">User ID</p><p className="text-slate-200 font-mono">#{user.id}</p></div>
          </div>
          {user.is_anonymized && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              This account has been anonymized — some fields above may be redacted by the backend rather than reflecting live data.
            </div>
          )}
        </div>

        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Change Role</h3>
          <select
            value={role ?? user.role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-[#E2A54A]/60 mb-3"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={() => roleMutation.mutate(role ?? user.role)}
            disabled={roleMutation.isPending || (role ?? user.role) === user.role}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E2A54A] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#d4963b] disabled:opacity-50"
          >
            {roleMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save Role
          </button>
          <p className="mt-2 text-[10px] text-slate-500">
            Role options are inferred from this codebase, not an explicit backend enum — adjust if your actual roles differ.
          </p>
        </div>
      </div>
    </div>
  );
}