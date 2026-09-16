import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle2, Clock, Users, Image as ImageIcon, AlertTriangle, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { jobsApi } from "@/lib/api";

export const Route = createFileRoute("/jobs/track/$token")({
  component: JobTrackPage,
});

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function JobTrackPage() {
  const { token } = Route.useParams();

  const { data: tracking, isLoading, isError } = useQuery({
    queryKey: ["public-track", token],
    queryFn: () => jobsApi.track(token),
    retry: false,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" /> Loading your job...
        </div>
      </SiteLayout>
    );
  }

  if (isError || !tracking) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-sm text-muted-foreground">
            This tracking link is invalid. If you believe this is an error, please contact support.
          </p>
        </div>
      </SiteLayout>
    );
  }

  const photos = (tracking.photos ?? []) as Array<string | { url?: string }>;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-16">
        <h1 className="font-display text-3xl font-bold mb-1">Track Your Move</h1>
        <p className="text-sm text-muted-foreground mb-8 capitalize">Status: {tracking.status.replace("_", " ")}</p>

        <div className="rounded-2xl bg-surface p-6 mb-4">
          <p className="text-[10px] uppercase text-muted-foreground mb-1 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Schedule</p>
          <p className="text-sm">{formatDateTime(tracking.scheduled_start)} — {formatDateTime(tracking.scheduled_end)}</p>
        </div>

        {tracking.crew_members.length > 0 && (
          <div className="rounded-2xl bg-surface p-6 mb-4">
            <p className="text-[10px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5"><Users className="h-3 w-3" /> Your Crew</p>
            <div className="flex flex-wrap gap-3">
              {tracking.crew_members.map((c) => (
                <div key={c.id} className="flex items-center gap-2.5 rounded-lg bg-black/20 border border-white/10 px-3 py-2">
                  {c.profile_image_url ? (
                    <img src={c.profile_image_url} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {c.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold">{c.full_name}</p>
                    {c.phone && <p className="text-[10px] text-muted-foreground">{c.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="rounded-2xl bg-surface p-6 mb-4">
            <p className="text-[10px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Photos From The Crew</p>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => {
                const url = typeof p === "string" ? p : p?.url;
                return url ? (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} className="rounded-md border border-white/10 aspect-square object-cover" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-surface p-6">
          <p className="text-[10px] uppercase text-muted-foreground mb-3 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Status Timeline</p>
          <div className="space-y-2">
            {tracking.history.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium capitalize">{h.status.replace("_", " ")}</p>
                  <p className="text-muted-foreground">{formatDateTime(h.created_at)}</p>
                  {h.notes && <p className="text-muted-foreground mt-0.5">{h.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}