import { useState } from "react";
import { Loader2, Save, Eye, EyeOff, Upload, KeyRound } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { cn } from "@/lib/utils";

export function ProfileSettingsPanel() {
  const {
    user, fullName, setFullName, phone, setPhone, avatarUrl,
    uploadingAvatar, handleAvatarFile, savingProfile, saveProfile,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, savingPassword, savePassword,
    toast,
  } = useProfileSettings();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="max-w-2xl">
      {toast && (
        <div className={cn(
          "fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border",
          toast.type === "success" ? "bg-surface border-emerald-500/30 text-emerald-400" : "bg-surface border-rose-500/30 text-rose-400",
        )}>
          {toast.message}
        </div>
      )}

      <div className="rounded-2xl bg-surface p-6 mb-4">
        <h2 className="font-display text-lg font-bold mb-4">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden border border-white/10 bg-black/20 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground font-mono uppercase">
                  {(fullName || user?.full_name || "?").slice(0, 2)}
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 flex items-center gap-2">
              {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploadingAvatar ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingAvatar}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f); }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-white/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-white/25"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full rounded-lg bg-black/10 border border-white/5 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[10px] text-muted-foreground">Email can't be changed here — contact support.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {savingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-surface p-6">
        <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <KeyRound className="h-4 w-4" /> Change Password
        </h2>
        <form onSubmit={savePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 pr-10 text-sm outline-none focus:border-white/25"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 pr-10 text-sm outline-none focus:border-white/25"
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-white/25"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-xs font-bold hover:bg-white/15 disabled:opacity-50"
          >
            {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
            {savingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}