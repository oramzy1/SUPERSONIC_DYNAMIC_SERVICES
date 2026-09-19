import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthGuardProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AdminAuthGuard({ children, onSuccess }: AdminAuthGuardProps) {
  const { isAuthenticated, user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If authenticated and user is admin/staff, show children
  if (isAuthenticated && user && ["admin", "dispatcher", "crew", "finance"].includes(user.role)) {
    return <>{children}</>;
  }

  // If authenticated but not staff, show unauthorized
  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] text-[#94A3B8] font-sans antialiased px-4">
        <div className="w-full max-w-md bg-[#111622] border border-[#1E293B] rounded-2xl p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access Denied</h1>
          <p className="text-xs text-[#64748B] mt-2">
            You do not have administrator privileges. Your role is: {user.role}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
 
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid credentials.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] text-[#94A3B8] font-sans antialiased px-4">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-[#111622] border border-[#1E293B] rounded-2xl p-8 shadow-1xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-[#C8A24A]/10 border border-[#C8A24A]/20 flex items-center justify-center text-[#C8A24A] mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Supersonic Admin Portal</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Please log in with your staff credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@supersonicdynamic.com"
                className="w-full bg-[#080B11] border border-[#262F45] focus:border-[#C8A24A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••••••"
                className="w-full bg-[#080B11] border border-[#262F45] focus:border-[#C8A24A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: "#C8A24A" }}
            className="w-full text-[#0B0F17] hover:brightness-110 font-bold text-xs tracking-wider py-3 rounded-xl transition-all shadow-xl shadow-[#C8A24A]/5 flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Unlock Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}