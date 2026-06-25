import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  Cpu,
  Save,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  Laptop,
  Upload,
  Copy,
  Check,
  Key,
} from "lucide-react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";

type SettingsTab = "profile" | "security" | "notifications" | "api";

export const Route = createFileRoute("/_auth/adminsettings")({
  component: AdminSettingsDashboard,
  validateSearch: (search: Record<string, unknown>) => {
    const validTabs: SettingsTab[] = ["profile", "security", "notifications", "api"];
    const tab = search.tab as SettingsTab;
    return {
      tab: validTabs.includes(tab) ? tab : ("profile" as SettingsTab),
    };
  },
});

export function AdminSettingsDashboard() {
  const search = useSearch({ from: "/_auth/adminsettings" });
  const navigate = useNavigate();
  const activeTab: SettingsTab = search.tab ?? "profile";

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<"public" | "secret" | null>(null);

  const [profile, setProfile] = useState({
    fullName: "Alex Mercer",
    email: "a.mercer@fleetops.io",
    role: "Senior Operations Admin",
    timezone: "UTC -05:00 (EST)",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    alertCritical: true,
    alertMaintenance: true,
    weeklyReport: false,
    slackWebhook: "https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_CHANNEL/TOKEN",
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    publicKey: "pk_test_configuration_environment_key",
    secretKey: import.meta.env.VITE_STRIPE_KEY_SECRET || "sk_test_fallback_placeholder_key",
    webhookUrl: "https://api.fleetops.io/v1/telemetry/receiver",
    rateLimit: 5000,
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => setCopiedKey(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedKey]);

  // FIXED: use replace + to instead of from + search object mutation
  const handleTabChange = (newTab: SettingsTab) => {
    navigate({
      to: "/adminsettings",
      search: { tab: newTab },
      replace: true,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ type: "error", message: "Image sizing boundary limit exceeded (Max 2MB)." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        setToast({ type: "success", message: "Local profile avatar asset staged successfully." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyClipboard = (text: string, type: "public" | "secret") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setToast({ type: "success", message: "Key copied to secure clipboard wrapper safely." });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (activeTab === "security") {
      if (security.newPassword || security.currentPassword || security.confirmPassword) {
        if (!security.currentPassword) {
          setToast({
            type: "error",
            message: "Current authorization password token missing verification.",
          });
          setIsSaving(false);
          return;
        }
        if (security.newPassword.length < 8) {
          setToast({
            type: "error",
            message: "New Master security string requires 8 characters minimum.",
          });
          setIsSaving(false);
          return;
        }
        if (security.newPassword !== security.confirmPassword) {
          setToast({
            type: "error",
            message: "Input validation mismatch: New credentials do not match.",
          });
          setIsSaving(false);
          return;
        }
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setToast({
        type: "success",
        message: "System configuration matrix safely compiled and active.",
      });
      if (activeTab === "security") {
        setSecurity((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    }, 1000);
  };

  const regenerateApiKeys = () => {
    if (
      window.confirm(
        "Regenerating keys will immediately invalidate current production integrations. Proceed?",
      )
    ) {
      const generatedHex = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
      setApiConfig((prev) => ({ ...prev, secretKey: `sk_test_${generatedHex}` }));
      setToast({ type: "success", message: "New encryption client gateway secrets compiled." });
    }
  };

  return (
    <div className="w-full min-h-full text-[#626d7c] font-sans antialiased px-0 py-4 sm:p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border transition-all ${
            toast.type === "success"
              ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400"
              : "bg-[#0c1017] border-rose-500/30 text-rose-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 px-4 sm:px-0 border-b border-[#161b22]">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage administrative credentials, data nodes, and gateway authorizations.
            </p>
          </div>
          <button
            type="submit"
            form="settings-matrix-form"
            disabled={isSaving}
            className="bg-[#e2a54a] hover:bg-[#cb923c] disabled:bg-slate-800 text-[#07090e] disabled:text-slate-500 font-bold text-xs tracking-wide px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 uppercase disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isSaving ? "Syncing..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Sidebar Tabs */}
          <div className="flex flex-col space-y-1 bg-[#0c1017] p-2 sm:rounded-xl border-y sm:border border-[#161b22]">
            {(["profile", "security", "notifications", "api"] as SettingsTab[]).map((t) => {
              const icons = { profile: User, security: Shield, notifications: Bell, api: Cpu };
              const labels = {
                profile: "Admin Profile",
                security: "Authentication",
                notifications: "Routing Alerts",
                api: "API Interfacing",
              };
              const Icon = icons[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTabChange(t)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-lg transition-all tracking-wide text-left ${
                    activeTab === t
                      ? "bg-[#1c2330] text-[#e2a54a]"
                      : "hover:text-white text-[#626d7c]"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Form Panel */}
          <div className="md:col-span-3 bg-[#0c1017] sm:border border-[#161b22] sm:rounded-xl p-4 sm:p-6 min-h-105">
            <form id="settings-matrix-form" onSubmit={handleSaveSettings} className="space-y-6">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-mono">
                      Admin Configuration
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configure corporate structural mapping rules.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#07090e]/50 border border-[#161b22] rounded-xl">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-600 font-mono text-xl uppercase">
                          {profile.fullName.substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 items-center sm:items-start text-center sm:text-left">
                      <label className="cursor-pointer bg-[#16191c] hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-2">
                        <Upload className="h-3.5 w-3.5 text-slate-400" />
                        Upload New Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500">Supports PNG or JPEG up to 2MB.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        Account Handle
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e2a54a]/60 font-medium transition"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        System Routing Address
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e2a54a]/60 font-medium transition"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#2d3643] tracking-wider">
                        Assigned Infrastructure Role
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="bg-[#07090e]/50 border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-slate-500 font-mono cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        Operational Timezone Matrix
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e2a54a]/60 font-medium transition appearance-none cursor-pointer"
                      >
                        <option value="UTC -05:00 (EST)">UTC -05:00 (EST)</option>
                        <option value="UTC +00:00 (GMT)">UTC +00:00 (GMT)</option>
                        <option value="UTC +01:00 (WAT)">UTC +01:00 (WAT)</option>
                        <option value="UTC -08:00 (PST)">UTC -08:00 (PST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-mono">
                      Cryptographic Credentials
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Rotate security profile authorization parameters below.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                      Current Encryption Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity({ ...security, currentPassword: e.target.value })
                        }
                        className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#e2a54a]/60 pr-10 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d3643] hover:text-[#626d7c] transition"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        New Master Password
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={security.newPassword}
                          onChange={(e) =>
                            setSecurity({ ...security, newPassword: e.target.value })
                          }
                          className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#e2a54a]/60 pr-10 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d3643] hover:text-[#626d7c] transition"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        Confirm Master Token
                      </label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity({ ...security, confirmPassword: e.target.value })
                        }
                        className="bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#e2a54a]/60 transition"
                      />
                    </div>
                  </div>
                  <div className="h-px bg-[#161b22]" />
                  <div className="flex items-center justify-between p-4 bg-[#07090e] border border-[#161b22] rounded-xl gap-4">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-[#e2a54a] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">
                          Two-Factor Authentication Core (2FA)
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Enforce hardware/TOTP cryptographic challenges on core operations resets.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
                      <input
                        type="checkbox"
                        checked={security.twoFactorEnabled}
                        onChange={(e) =>
                          setSecurity({ ...security, twoFactorEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#161b22] border border-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-[#626d7c] peer-checked:after:bg-[#07090e] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e2a54a] peer-checked:border-transparent" />
                    </label>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider block">
                      Active Platform Terminals
                    </label>
                    <div className="flex items-center justify-between p-3.5 bg-[#07090e]/40 border border-[#161b22] rounded-lg text-xs gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Laptop className="h-4 w-4 text-slate-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-mono text-white text-[11px] truncate">
                            Macintosh - Chrome Core Module
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                            197.210.44.12 - Lagos, Nigeria
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide">
                        THIS UNIT
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 font-mono">
                      Event Threshold Routing
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configure system diagnostic monitoring endpoints.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        key: "alertCritical" as const,
                        title: "Critical Telemetry Violations",
                        desc: "Broadcast active warnings when metrics breach threshold zones.",
                      },
                      {
                        key: "alertMaintenance" as const,
                        title: "Scheduled Maintenance Flags",
                        desc: "Receive pushes when micro-nodes disconnect for maintenance pipelines.",
                      },
                      {
                        key: "weeklyReport" as const,
                        title: "Weekly Fleet Compilation Matrix",
                        desc: "Compile logistical optimization summaries into encrypted emails.",
                      },
                    ].map(({ key, title, desc }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3.5 bg-[#07090e]/60 rounded-lg border border-[#161b22] gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white">{title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications[key]}
                          onChange={(e) =>
                            setNotifications({ ...notifications, [key]: e.target.checked })
                          }
                          className="accent-[#e2a54a] h-4 w-4 rounded bg-[#07090e] border-[#161b22] shrink-0 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                      Slack Infrastructure Webhook Pipe
                    </label>
                    <input
                      type="url"
                      value={notifications.slackWebhook}
                      onChange={(e) =>
                        setNotifications({ ...notifications, slackWebhook: e.target.value })
                      }
                      className="bg-[#07090e] border border-[#161b22] rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#e2a54a]/60 transition"
                    />
                  </div>
                </div>
              )}

              {/* API TAB */}
              {activeTab === "api" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 border-b border-[#161b22] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Gateway API Authorization
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Control web services token signatures securely.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={regenerateApiKeys}
                      className="text-[10px] bg-slate-900 border border-[#161b22] hover:border-[#e2a54a] text-white font-bold px-3 py-1.5 rounded transition-colors font-mono flex items-center gap-1.5 shrink-0"
                    >
                      <Key className="h-3.5 w-3.5" /> RECOMPILE KEYS
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        Live Client Identifiers (Public Key)
                      </label>
                      <div className="relative flex items-center bg-[#07090e] border border-[#161b22] rounded-lg focus-within:border-[#e2a54a]/60 overflow-hidden pr-2 transition">
                        <input
                          type="text"
                          readOnly
                          value={apiConfig.publicKey}
                          className="w-full bg-transparent px-4 py-2.5 text-xs text-white font-mono focus:outline-none select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyClipboard(apiConfig.publicKey, "public")}
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition shrink-0"
                        >
                          {copiedKey === "public" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#626d7c] tracking-wider">
                        Live Client Secret Key
                      </label>
                      <div className="relative flex items-center bg-[#07090e] border border-[#161b22] rounded-lg focus-within:border-[#e2a54a]/60 overflow-hidden pr-2 transition">
                        <input
                          type={showApiKey ? "text" : "password"}
                          readOnly
                          value={apiConfig.secretKey}
                          className="w-full bg-transparent px-4 py-2.5 text-xs text-white font-mono focus:outline-none select-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition shrink-0 mr-1"
                        >
                          {showApiKey ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyClipboard(apiConfig.secretKey, "secret")}
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition shrink-0"
                        >
                          {copiedKey === "secret" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
