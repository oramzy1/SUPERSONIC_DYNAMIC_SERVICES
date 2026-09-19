import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api";
import { MapPin, Clock, CheckCircle2, Circle, Loader2, Image } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking/$token")({
  component: TrackingPage,
});

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  confirmed: Clock,
  in_progress: Loader2,
  completed: CheckCircle2,
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-[#6FE5FF] border-[#6FE5FF]/40 bg-[#6FE5FF]/10",
  in_progress: "text-[#3B82F6] border-[#3B82F6]/40 bg-[#3B82F6]/10",
  completed: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
};

function TrackingPage() {
  const { token } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tracking", token],
    queryFn: () => jobsApi.track(token),
    refetchInterval: 30000, // auto-refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
        <Loader2 className="h-8 w-8 text-[#8EA7FF] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F14] text-white p-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold">Tracking Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">
            This tracking link is invalid or has expired. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  const Icon = STATUS_ICONS[data.status] || Circle;
  const colorCls = STATUS_COLORS[data.status] || "text-slate-400 border-slate-400/40 bg-slate-400/10";

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">Move Tracking</h1>
          <p className="mt-2 text-sm text-slate-400">Track your move in real time</p>
        </div>

        {/* Current Status Card */}
        <div className={cn("rounded-2xl border p-6 mb-8", colorCls)}>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl">
              <Icon className={cn("h-6 w-6", data.status === "in_progress" && "animate-spin")} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Current Status</p>
              <p className="text-xl font-display font-bold capitalize">{data.status.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        {(data.scheduled_start || data.scheduled_end) && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Scheduled Window</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.scheduled_start && (
                <div>
                  <p className="text-xs text-slate-500">Start</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(data.scheduled_start).toLocaleString("nl-NL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              )}
              {data.scheduled_end && (
                <div>
                  <p className="text-xs text-slate-500">End</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(data.scheduled_end).toLocaleString("nl-NL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Status History</h2>
          <div className="space-y-4">
            {data.history.map((item, i) => {
              const HIcon = STATUS_ICONS[item.status] || Circle;
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className={cn("grid h-8 w-8 place-items-center rounded-full border", STATUS_COLORS[item.status] || "border-slate-600")}>
                      <HIcon className="h-4 w-4" />
                    </div>
                    {i < data.history.length - 1 && <div className="w-px h-6 bg-white/10 mt-1" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium capitalize">{item.status.replace("_", " ")}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(item.created_at).toLocaleString("nl-NL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    {item.notes && <p className="text-xs text-slate-400 mt-1">{item.notes}</p>}
                  </div>
                </div>
              );
            })}
            {data.history.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No status updates yet.</p>
            )}
          </div>
        </div>

        {/* Photos */}
        {data.photos && data.photos.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              <Image className="inline h-4 w-4 mr-1" /> Move Photos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
{data.photos.map((photo, i) => (
  <img
    key={i}
    src={photo as string}
    alt={`Move photo ${i + 1}`}
    className="rounded-lg w-full h-32 object-cover"
  />
))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}