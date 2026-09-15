import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Loader2, Upload, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { jobsApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_member/crewdashboard/$jobId")({
  component: CrewJobDetail,
});

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function errMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
    "Something went wrong. Please try again."
  );
}

function CrewJobDetail() {
  const { jobId } = Route.useParams();
  const id = Number(jobId);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  // No GET /jobs/{id} exists - reuse the shared "crew jobs" list query (same
  // key as the index page) and find this job in it.
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["crew", "jobs"],
    queryFn: () => jobsApi.list(),
  });
  const job = jobs.find((j) => j.id === id);
  const completedJob = job?.status === "completed";

  const { data: tracking } = useQuery({
    queryKey: ["job-track", job?.tracking_token],
    queryFn: () => jobsApi.track(job!.tracking_token),
    enabled: !!job?.tracking_token,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["crew", "jobs"] });
    if (job?.tracking_token)
      queryClient.invalidateQueries({ queryKey: ["job-track", job.tracking_token] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: "in_progress" | "completed") =>
      jobsApi.updateStatus(id, { status, notes: notes || undefined }),
    onSuccess: () => {
      invalidate();
      setNotes("");
      setToast({ type: "success", message: "Job status updated." });
    },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  // const handlePhotoUpload = async (file: File) => {
  //   setUploading(true);
  //   try {
  //     const presigned = await jobsApi.getPhotoPresignedUrl(
  //       id,
  //       file.name,
  //       file.type || "image/jpeg",
  //     );
  //     const putRes = await fetch(presigned.url, {
  //       method: "PUT",
  //       body: file,
  //       headers: { "Content-Type": file.type || "image/jpeg" },
  //     });
  //     if (!putRes.ok) throw new Error(`Upload failed with status ${putRes.status}`);
  //     const cleanUrl = presigned.url.split("?")[0];
  //     // Assumes POST /jobs/{id}/photos ADDS to existing photos rather than
  //     // replacing the array - confirm with the backend if photos start
  //     // disappearing after multiple uploads.
  //     await jobsApi.attachPhotos(id, [cleanUrl]);
  //     invalidate();
  //     setToast({ type: "success", message: "Photo uploaded." });
  //   } catch (err) {
  //     setToast({ type: "error", message: errMsg(err) });
  //   } finally {
  //     setUploading(false);
  //   }
  // };
const handlePhotoUpload = async (file: File) => {
  setUploading(true);

  try {
    // 1. Get presigned upload URL
    const presigned = await jobsApi.getPhotoPresignedUrl(
      id,
      file.name,
      file.type || "image/jpeg"
    );

    console.log("Presigned URL response:", presigned);

    // 2. Upload the actual file
    const putRes = await fetch(presigned.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
    });

    console.log("Photo upload response:", {
      status: putRes.status,
      statusText: putRes.statusText,
      ok: putRes.ok,
    });

    if (!putRes.ok) {
      const responseText = await putRes.text();

      console.error("Photo upload failed:", {
        status: putRes.status,
        statusText: putRes.statusText,
        body: responseText,
      });

      throw new Error(
        `Photo upload failed (${putRes.status}): ${responseText || putRes.statusText}`
      );
    }

    // 3. Get the uploaded file URL
    const cleanUrl = presigned.url.split("?")[0];

    console.log("Uploaded photo URL:", cleanUrl);

    // 4. Attach the photo to the job
    const attachResponse = await jobsApi.attachPhotos(id, [cleanUrl]);

    console.log("Attach photo response:", attachResponse);

    // 5. Refresh job data
    invalidate();

    setToast({
      type: "success",
      message: "Photo uploaded successfully.",
    });

    // Optional: inspect the final response
    console.log("PHOTO UPLOAD SUCCESS:", {
      presigned,
      uploadStatus: putRes.status,
      uploadStatusText: putRes.statusText,
      photoUrl: cleanUrl,
      attachResponse,
    });

  } catch (err) {
    console.error("PHOTO UPLOAD ERROR:", err);

    setToast({
      type: "error",
      message: errMsg(err),
    });
  } finally {
    setUploading(false);
  }
};


  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl w-full text-slate-200">
        <Breadcrumbs
          items={[{ label: "My Assignments", to: "/crewdashboard" }, { label: `Job #${jobId}` }]}
        />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl w-full text-slate-200">
        <Breadcrumbs
          items={[{ label: "My Assignments", to: "/crewdashboard" }, { label: `Job #${jobId}` }]}
        />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          This job isn't assigned to you (or doesn't exist).
          <div className="mt-3">
            <Link
              to="/crewdashboard"
              className="text-[#E2A54A] text-xs font-semibold hover:underline"
            >
              Back to My Assignments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const photos = (job.photos ?? []) as Array<string | { url?: string }>;

  return (
    <div className="mx-auto max-w-3xl w-full text-slate-200 pb-12">
      <Breadcrumbs
        items={[{ label: "My Assignments", to: "/crewdashboard" }, { label: `Job #${job.id}` }]}
      />

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border ${
            toast.type === "success"
              ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400"
              : "bg-[#0c1017] border-rose-500/30 text-rose-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Job #{job.id}</h1>
        <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-extrabold tracking-wider uppercase bg-white/6 text-slate-400 border-white/4">
          {job.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" /> {formatDate(job.scheduled_start)} -{" "}
        {formatDate(job.scheduled_end)}
      </p>

      <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-5 mb-4 text-xs text-slate-500">
        Route and customer details aren't exposed to crew accounts by the current API - check your
        dispatch instructions for pickup/drop-off info.
      </div>

     {
      completedJob ? (
         <div className="space-y-4">

    {/* Completed Banner */}
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <div className="flex flex-col items-center text-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>

        <h2 className="text-xl font-bold text-white">
          Job Completed
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-400">
          This job has been successfully completed. Your submission
          has been recorded and is now available for review.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </div>

      </div>
    </div>

    {/* Completion Summary */}
    <div className="rounded-xl border border-white/6 bg-[#0d111a]/40 p-5">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
        Completion Summary
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-[11px] text-slate-600">Job ID</p>
          <p className="mt-1 text-sm font-semibold text-white">
            #{job.id}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-600">Photos Submitted</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {photos.length}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-600">Scheduled Start</p>
          <p className="mt-1 text-sm text-slate-300">
            {formatDate(job.scheduled_start)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-600">Scheduled End</p>
          <p className="mt-1 text-sm text-slate-300">
            {formatDate(job.scheduled_end)}
          </p>
        </div>

      </div>
    </div>

    {/* Photo Evidence */}
    <div className="rounded-xl border border-white/6 bg-[#0d111a]/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <ImageIcon className="h-3.5 w-3.5" />
          Photo Evidence
        </h3>

        <span className="text-[11px] text-slate-600">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((p, i) => {
            const url = typeof p === "string" ? p : p?.url;

            return url ? (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg"
              >
                <img
                  src={url}
                  alt={`Job evidence ${i + 1}`}
                  className="aspect-square w-full object-cover transition duration-200 group-hover:scale-105"
                />
              </a>
            ) : null;
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/10 py-8 text-center">
          <ImageIcon className="mx-auto mb-2 h-6 w-6 text-slate-700" />
          <p className="text-xs text-slate-500">
            No photo evidence submitted.
          </p>
        </div>
      )}
    </div>

    {/* Status Timeline */}
    {tracking?.history && tracking.history.length > 0 && (
      <div className="rounded-xl border border-white/6 bg-[#0d111a]/40 p-5">
        <h3 className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Job Timeline
        </h3>

        <div className="space-y-3">
          {tracking.history.map((h, i) => (
            <div key={i} className="flex items-start gap-3">

              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-medium capitalize text-slate-200">
                  {h.status.replace("_", " ")}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  {formatDate(h.created_at)}
                </p>

                {h.notes && (
                  <p className="mt-1 text-xs text-slate-500">
                    {h.notes}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    )}

  </div>
      ):(
        <>
         <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Update Status
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes for this update..."
          rows={2}
          className="w-full mb-3 bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#E2A54A]/60"
        />
        <div className="flex gap-2">
          {job.status !== "in_progress" && job.status !== "completed" && (
            <button
              onClick={() => statusMutation.mutate("in_progress")}
              disabled={statusMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-xs font-bold hover:bg-[#E2A54A]/20 transition disabled:opacity-50"
            >
              {statusMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Start Job
            </button>
          )}
          {job.status === "in_progress" && (
            <button
              onClick={() => statusMutation.mutate("completed")}
              disabled={statusMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition disabled:opacity-50"
            >
              {statusMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Mark
              Completed
            </button>
          )}
          {job.status === "completed" && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> This job is complete.
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-5 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" /> Photo Evidence
        </h3>
        <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-black/20 py-6 cursor-pointer hover:border-white/30 transition text-xs text-slate-400 mb-3">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading..." : "Tap to upload a photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
          />
        </label>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => {
              const url = typeof p === "string" ? p : p?.url;
              return url ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    className="rounded-md border border-white/6 aspect-square object-cover"
                  />
                </a>
              ) : null;
            })}
          </div>
        )}
      </div>

      {tracking?.history && tracking.history.length > 0 && (
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Status Timeline
          </h3>
          <div className="space-y-2">
            {tracking.history.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">{h.status.replace("_", " ")}</p>
                  <p className="text-slate-600">{formatDate(h.created_at)}</p>
                  {h.notes && <p className="text-slate-500 mt-0.5">{h.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )
     }
    </div>
  );
}
