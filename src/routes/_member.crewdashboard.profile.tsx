import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProfileSettingsPanel } from "@/components/shared/ProfileSettingsPanel";

export const Route = createFileRoute("/_member/crewdashboard/profile")({
  component: CrewProfilePage,
});

function CrewProfilePage() {
  return (
    <div className="mx-auto max-w-3xl w-full text-slate-200 pb-12">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Profile Settings</h1>
      <p className="text-sm text-slate-400 mb-6">Update your details and password.</p>
      <ProfileSettingsPanel />
    </div>
  );
}