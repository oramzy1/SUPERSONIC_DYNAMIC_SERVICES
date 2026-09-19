import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProfileSettingsPanel } from "@/components/shared/ProfileSettingsPanel";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <h1 className="font-display text-3xl font-bold md:text-5xl">Account Settings</h1>
      <p className="mt-3 text-sm text-muted-foreground mb-8">
        Update your profile details and password.
      </p>
      <ProfileSettingsPanel />
    </div>
  );
}