// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Calendar,
//   MapPin,
//   UserCog,
//   Loader2,
//   CheckCircle2,
//   XCircle,
//   Image as ImageIcon,
//   Clock,
//   FileSignature,
//   Receipt,
//   ShieldAlert,
// } from "lucide-react";
// import { adminApi, jobsApi, accountApi } from "@/lib/api";
// import type { DashboardJob } from "@/lib/api-types";
// import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

// export const Route = createFileRoute("/_auth/adminjobs/$jobId")({
//   component: JobDetailPage,
// });

// function errMsg(err: unknown): string {
//   return (
//     (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
//     (err as Error)?.message ||
//     "Request failed. Please try again."
//   );
// }

// function formatDate(iso?: string | null): string {
//   if (!iso) return "-";
//   return new Date(iso).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function toLocalInputValue(iso?: string | null): string {
//   if (!iso) return "";
//   const d = new Date(iso);
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }

// function JobDetailPage() {
//   const { jobId } = Route.useParams();
//   const id = Number(jobId);
//   const queryClient = useQueryClient();
//   const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

//   // No GET /jobs/{id} exists on the backend - reuse the shared list query
//   // (same key as the index page) and find this job in it.
//   const { data: jobs = [], isLoading: jobsLoading } = useQuery({
//     queryKey: ["admin", "jobs"],
//     queryFn: () => jobsApi.list(),
//   });
//   const job = jobs.find((j) => j.id === id);
//   const completedJob = job?.status === "completed";

//   const { data: users = [] } = useQuery({
//     queryKey: ["admin", "users"],
//     queryFn: () => accountApi.listUsers(),
//   });
//   const crewMembers = users.filter((u) => u.role === "crew");
//   // Guessing "dispatcher" as the role name for dispatch staff - adjust if your
//   // backend uses a different role string.
//   const dispatchers = users.filter((u) => u.role === "dispatcher" || u.role === "admin");
//   const usersById = new Map(users.map((u) => [u.id, u]));

//   const { data: dash } = useQuery({
//     queryKey: ["admin", "dashboard"],
//     queryFn: () => adminApi.dashboard(),
//   });
//   const dashInfo: DashboardJob | undefined = [
//     ...(dash?.today_jobs ?? []),
//     ...(dash?.upcoming_jobs ?? []),
//     ...(dash?.overdue_jobs ?? []),
//   ].find((j) => j.id === id);

//   // Real status history, straight from the public tracking endpoint -
//   // it's the only place this exists.
//   const { data: tracking } = useQuery({
//     queryKey: ["job-tracking", job?.tracking_token],
//     queryFn: () => jobsApi.track(job!.tracking_token),
//     enabled: !!job?.tracking_token,
//   });

//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");
//   const [crew, setCrew] = useState<number[]>([]);
//   const [dispatcherId, setDispatcherId] = useState<number | "">("");
//   const [formInitialized, setFormInitialized] = useState(false);

//   if (job && !formInitialized) {
//     setStart(toLocalInputValue(job.scheduled_start));
//     setEnd(toLocalInputValue(job.scheduled_end));
//     setCrew(job.crew_ids ?? []);
//     setDispatcherId(job.dispatcher_id ?? "");
//     setFormInitialized(true);
//   }

//   const toggleCrew = (uid: number) =>
//     setCrew((prev) => (prev.includes(uid) ? prev.filter((c) => c !== uid) : [...prev, uid]));

//   const invalidateAll = () => {
//     queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
//     queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
//     if (job?.tracking_token) {
//       queryClient.invalidateQueries({ queryKey: ["job-tracking", job.tracking_token] });
//     }
//   };

//   const scheduleMutation = useMutation({
//     mutationFn: () =>
//       jobsApi.schedule(id, {
//         scheduled_start: new Date(start).toISOString(),
//         scheduled_end: new Date(end).toISOString(),
//         crew_ids: crew,
//       }),
//     onSuccess: () => {
//       invalidateAll();
//       setToast({ type: "success", message: "Schedule and crew updated." });
//     },
//     onError: (err) => setToast({ type: "error", message: errMsg(err) }),
//   });

//   const reassignMutation = useMutation({
//     mutationFn: () =>
//       jobsApi.assignCrew(id, {
//         crew_ids: crew,
//         dispatcher_id: dispatcherId === "" ? undefined : dispatcherId,
//       }),
//     onSuccess: () => {
//       invalidateAll();
//       setToast({ type: "success", message: "Crew reassigned." });
//     },
//     onError: (err) => setToast({ type: "error", message: errMsg(err) }),
//   });

//   const unassignMutation = useMutation({
//     mutationFn: (uid: number) => jobsApi.unassign(id, { user_id: uid }),
//     onSuccess: () => {
//       invalidateAll();
//       setToast({ type: "success", message: "Crew member removed from job." });
//     },
//     onError: (err) => setToast({ type: "error", message: errMsg(err) }),
//   });

//   const updateStatusMutation = useMutation({
//     mutationFn: (status: "in_progress" | "completed") => jobsApi.updateStatus(id, { status }),
//     onSuccess: () => {
//       invalidateAll();
//       setToast({ type: "success", message: "Job status updated." });
//     },
//     onError: (err) => setToast({ type: "error", message: errMsg(err) }),
//   });

//   const cancelMutation = useMutation({
//     mutationFn: () => jobsApi.cancel(id),
//     onSuccess: () => {
//       invalidateAll();
//       setToast({ type: "success", message: "Job cancelled." });
//     },
//     onError: (err) => setToast({ type: "error", message: errMsg(err) }),
//   });

//   if (jobsLoading) {
//     return (
//       <div className="w-full text-slate-200">
//         <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
//         <div className="flex items-center gap-2 text-sm text-slate-500">
//           <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
//         </div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="w-full text-slate-200">
//         <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
//         <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
//           Job #{jobId} wasn't found in the current job list.
//           <div className="mt-3">
//             <Link to="/adminjobs" className="text-[#E2A54A] text-xs font-semibold hover:underline">
//               Back to Jobs
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const isSchedulingFirstTime = !job.scheduled_start;
//   const anyMutationBusy =
//     scheduleMutation.isPending ||
//     reassignMutation.isPending ||
//     unassignMutation.isPending ||
//     updateStatusMutation.isPending ||
//     cancelMutation.isPending;

//   return (
//     <div className="w-full text-slate-200 select-none pb-12">
//       <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${job.id}` }]} />

//       {toast && (
//         <div
//           className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border transition-all ${
//             toast.type === "success"
//               ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400"
//               : "bg-[#0c1017] border-rose-500/30 text-rose-400"
//           }`}
//         >
//           {toast.message}
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold tracking-tight text-white">Job #{job.id}</h1>
//             <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-extrabold tracking-wider uppercase bg-white/6 text-slate-400 border-white/4">
//               {job.status.replace("_", " ")}
//             </span>
//           </div>
//           <p className="text-sm text-slate-400 mt-1">
//             {dashInfo?.customer_name || "Customer info unavailable for this job"}
//           </p>
//         </div>

//         <div className="flex items-center gap-2 self-start sm:self-auto">
//           {job.status !== "completed" && job.status !== "cancelled" && (
//             <button
//               onClick={() =>
//                 updateStatusMutation.mutate(
//                   job.status === "in_progress" ? "completed" : "in_progress",
//                 )
//               }
//               disabled={anyMutationBusy}
//               className="px-3 py-1.5 bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-[10px] font-bold rounded-md hover:bg-[#E2A54A]/20 transition duration-150 disabled:opacity-50"
//             >
//               {job.status === "in_progress" ? "Mark Completed" : "Start Job"}
//             </button>
//           )}
//           {job.status !== "completed" && job.status !== "cancelled" && (
//             <button
//               onClick={() => cancelMutation.mutate()}
//               disabled={anyMutationBusy}
//               className="flex items-center gap-1 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md hover:bg-rose-500/10 transition duration-150 disabled:opacity-50"
//             >
//               <XCircle className="w-3 h-3" /> Cancel Job
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left column: job facts */}
//         <div className="lg:col-span-1 space-y-4">
//           <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
//             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Route</h3>
//             <div className="flex items-start gap-2 text-sm text-slate-200">
//               <MapPin className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
//               <div>
//                 <p>{dashInfo?.address_from || "- (not available for this job)"}</p>
//                 <p className="text-slate-600 my-1">↓</p>
//                 <p>{dashInfo?.address_to || "-"}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
//             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Schedule</h3>
//             <div className="flex items-center gap-2 text-sm text-slate-200">
//               <Calendar className="w-3.5 h-3.5 text-slate-600" />
//               {formatDate(job.scheduled_start)} - {formatDate(job.scheduled_end)}
//             </div>
//           </div>

//           <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
//             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
//               Currently Assigned
//             </h3>
//             <div className="space-y-2">
//               {(job.crew_ids ?? []).length === 0 && (
//                 <p className="text-xs text-slate-600">No crew assigned yet.</p>
//               )}
//               {(job.crew_ids ?? []).map((uid) => (
//                 <div
//                   key={uid}
//                   className="flex items-center justify-between rounded-lg border border-white/6 bg-black/20 px-3 py-2"
//                 >
//                   <span className="text-xs font-medium text-slate-200">
//                     {usersById.get(uid)?.full_name || `User #${uid}`}
//                   </span>
//                   <button
//                     onClick={() => unassignMutation.mutate(uid)}
//                     disabled={anyMutationBusy}
//                     className="text-[10px] font-bold text-rose-400 hover:underline disabled:opacity-50"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               {job.dispatcher_id && (
//                 <div className="flex items-center justify-between rounded-lg border border-white/6 bg-black/20 px-3 py-2">
//                   <span className="text-xs font-medium text-slate-200">
//                     {usersById.get(job.dispatcher_id)?.full_name || `User #${job.dispatcher_id}`}{" "}
//                     <span className="text-slate-500">(dispatcher)</span>
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {job.photos && job.photos.length > 0 && (
//             <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
//               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
//                 <ImageIcon className="w-3.5 h-3.5" /> Job Photos
//               </h3>
//               <div className="grid grid-cols-3 gap-2">
//                 {job.photos.map((p, i) => {
//                   const url = typeof p === "string" ? p : (p as { url?: string })?.url;
//                   return url ? (
//                     <a key={i} href={url} target="_blank" rel="noopener noreferrer">
//                       <img
//                         src={url}
//                         className="rounded-md border border-white/6 aspect-square object-cover"
//                       />
//                     </a>
//                   ) : null;
//                 })}
//               </div>
//             </div>
//           )}

//           {tracking?.history && tracking.history.length > 0 && (
//             <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
//               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
//                 <Clock className="w-3.5 h-3.5" /> Status Timeline
//               </h3>
//               <div className="space-y-2">
//                 {tracking.history.map((h, i) => (
//                   <div key={i} className="flex items-start gap-2 text-xs">
//                     <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
//                     <div>
//                       <p className="text-slate-200 font-medium">{h.status.replace("_", " ")}</p>
//                       <p className="text-slate-600">{formatDate(h.created_at)}</p>
//                       {h.notes && <p className="text-slate-500 mt-0.5">{h.notes}</p>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right column: assign / reassign / schedule */}
//         <div className="lg:col-span-2">
//           {!completedJob ? (
//             <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <UserCog className="w-4 h-4 text-[#E2A54A]" />
//                 <h3 className="text-sm font-bold text-white">
//                   {isSchedulingFirstTime ? "Schedule & Assign Crew" : "Reassign Crew"}
//                 </h3>
//               </div>
//               <p className="text-xs text-slate-500 mb-5">
//                 {isSchedulingFirstTime
//                   ? "This job hasn't been scheduled yet - set a start/end time and assign crew."
//                   : "Change crew or dispatcher without altering the existing schedule, or update the schedule below."}
//               </p>

//               <div className="grid grid-cols-2 gap-4 mb-5">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Scheduled Start
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={start}
//                     onChange={(e) => setStart(e.target.value)}
//                     className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Scheduled End
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={end}
//                     onChange={(e) => setEnd(e.target.value)}
//                     className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2 mb-5">
//                 <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Dispatcher
//                 </label>
//                 <select
//                   value={dispatcherId}
//                   onChange={(e) => setDispatcherId(e.target.value ? Number(e.target.value) : "")}
//                   className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60"
//                 >
//                   <option value="">No dispatcher</option>
//                   {dispatchers.map((d) => (
//                     <option key={d.id} value={d.id}>
//                       {d.full_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-2 mb-6">
//                 <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Crew Members ({crew.length} selected)
//                 </label>
//                 <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
//                   {crewMembers.length === 0 ? (
//                     <p className="text-xs text-slate-600 py-3 text-center">
//                       No crew members found. Add users with the "crew" role first.
//                     </p>
//                   ) : (
//                     crewMembers.map((member) => (
//                       <label
//                         key={member.id}
//                         className={`flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded-lg border transition ${
//                           crew.includes(member.id)
//                             ? "bg-[#E2A54A]/10 border-[#E2A54A]/30"
//                             : "bg-[#07090e] border-[#161b22] hover:border-[#252c3a]"
//                         }`}
//                       >
//                         <span className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
//                           <span className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[9px] font-bold text-slate-400">
//                             {member.full_name
//                               .split(" ")
//                               .map((p) => p[0])
//                               .slice(0, 2)
//                               .join("")
//                               .toUpperCase()}
//                           </span>
//                           {member.full_name}
//                         </span>
//                         <input
//                           type="checkbox"
//                           checked={crew.includes(member.id)}
//                           onChange={() => toggleCrew(member.id)}
//                           className="accent-[#E2A54A] h-4 w-4 rounded cursor-pointer"
//                         />
//                       </label>
//                     ))
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3">
//                 {!isSchedulingFirstTime && (
//                   <button
//                     onClick={() => reassignMutation.mutate()}
//                     disabled={anyMutationBusy}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-200 text-xs font-bold hover:bg-white/5 transition disabled:opacity-50"
//                   >
//                     {reassignMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
//                     Save Crew Only
//                   </button>
//                 )}
//                 <button
//                   onClick={() => scheduleMutation.mutate()}
//                   disabled={anyMutationBusy || !start || !end}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E2A54A] text-slate-950 text-xs font-bold hover:bg-[#d4963b] transition disabled:opacity-50"
//                 >
//                   {scheduleMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
//                   {isSchedulingFirstTime ? "Schedule & Assign" : "Update Schedule & Crew"}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-[#0d111a]/40 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                 <h3 className="text-sm font-bold text-white">Job Completed</h3>
//               </div>
//               <p className="text-xs text-slate-500 mb-5">
//                 This job was carried out as scheduled. Reopen it from the status controls above if
//                 changes are needed.
//               </p>

//               <div className="grid grid-cols-2 gap-4 mb-5">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Scheduled Start
//                   </label>
//                   <p className="text-xs text-slate-200 flex items-center gap-1.5">
//                     <Calendar className="w-3.5 h-3.5 text-slate-500" />
//                     {formatDate(job.scheduled_start)}
//                   </p>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Scheduled End
//                   </label>
//                   <p className="text-xs text-slate-200 flex items-center gap-1.5">
//                     <Calendar className="w-3.5 h-3.5 text-slate-500" />
//                     {formatDate(job.scheduled_end)}
//                   </p>
//                 </div>
//               </div>

//               {job.dispatcher_id && (
//                 <div className="space-y-1.5 mb-5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Dispatcher
//                   </label>
//                   <p className="text-xs text-slate-200">
//                     {dispatchers.find((d) => d.id === job.dispatcher_id)?.full_name ?? "-"}
//                   </p>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Crew ({(job.crew_members ?? []).length})
//                 </label>
//                 <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
//                   {(job.crew_members ?? []).length === 0 ? (
//                     <p className="text-xs text-slate-600 py-3 text-center">
//                       No crew was recorded on this job.
//                     </p>
//                   ) : (
//                     job.crew_members.map((member) => (
//                       <div
//                         key={member.id}
//                         className="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-[#07090e] border-[#161b22]"
//                       >
//                         <span className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[9px] font-bold text-slate-400">
//                           {member.full_name
//                             .split(" ")
//                             .map((p) => p[0])
//                             .slice(0, 2)
//                             .join("")
//                             .toUpperCase()}
//                         </span>
//                         <span className="text-xs font-medium text-slate-200">
//                           {member.full_name}
//                         </span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar, MapPin, UserCog, Loader2, CheckCircle2, XCircle,
  Image as ImageIcon, Clock, FileSignature, Receipt, ShieldAlert, Truck,
} from "lucide-react";
import { jobsApi, accountApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const Route = createFileRoute("/_auth/adminjobs/$jobId")({
  component: JobDetailPage,
});

function errMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
    (err as Error)?.message ||
    "Request failed. Please try again."
  );
}
function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function toLocalInputValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const id = Number(jobId);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["admin", "job", id],
    queryFn: () => jobsApi.get(id),
  });

  const completedJob = job?.status === "completed";


  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => accountApi.listUsers(),
  });
  const crewMembers = users.filter((u) => u.role === "crew");
  const dispatchers = users.filter((u) => u.role === "dispatcher" || u.role === "admin");
  const usersById = new Map(users.map((u) => [u.id, u]));

  const { data: tracking } = useQuery({
    queryKey: ["job-tracking", job?.tracking_token],
    queryFn: () => jobsApi.track(job!.tracking_token),
    enabled: !!job?.tracking_token,
  });

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [crew, setCrew] = useState<number[]>([]);
  const [dispatcherId, setDispatcherId] = useState<number | "">("");
  const [formInitialized, setFormInitialized] = useState(false);

  if (job && !formInitialized) {
    setStart(toLocalInputValue(job.scheduled_start));
    setEnd(toLocalInputValue(job.scheduled_end));
    setCrew(job.crew_ids ?? []);
    setDispatcherId(job.dispatcher_id ?? "");
    setFormInitialized(true);
  }

  const toggleCrew = (uid: number) =>
    setCrew((prev) => (prev.includes(uid) ? prev.filter((c) => c !== uid) : [...prev, uid]));

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "job", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    if (job?.tracking_token) queryClient.invalidateQueries({ queryKey: ["job-tracking", job.tracking_token] });
  };

  const scheduleMutation = useMutation({
    mutationFn: () =>
      jobsApi.schedule(id, {
        scheduled_start: new Date(start).toISOString(),
        scheduled_end: new Date(end).toISOString(),
        crew_ids: crew,
      }),
    onSuccess: () => { invalidateAll(); setToast({ type: "success", message: "Schedule and crew updated." }); },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const reassignMutation = useMutation({
    mutationFn: () => jobsApi.assignCrew(id, { crew_ids: crew, dispatcher_id: dispatcherId === "" ? undefined : dispatcherId }),
    onSuccess: () => { invalidateAll(); setToast({ type: "success", message: "Crew reassigned." }); },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const unassignMutation = useMutation({
    mutationFn: (uid: number) => jobsApi.unassign(id, { user_id: uid }),
    onSuccess: () => { invalidateAll(); setToast({ type: "success", message: "Crew member removed from job." }); },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: "in_progress" | "completed") => jobsApi.updateStatus(id, { status }),
    onSuccess: () => { invalidateAll(); setToast({ type: "success", message: "Job status updated." }); },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => jobsApi.cancel(id),
    onSuccess: () => { invalidateAll(); setToast({ type: "success", message: "Job cancelled." }); },
    onError: (err) => setToast({ type: "error", message: errMsg(err) }),
  });

  if (isLoading) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
        <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading job...</div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="w-full text-slate-200">
        <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${jobId}` }]} />
        <div className="bg-[#0d111a]/40 border border-white/6 rounded-xl p-8 text-center text-sm text-slate-400">
          Job #{jobId} wasn't found.
          <div className="mt-3"><Link to="/adminjobs" className="text-[#E2A54A] text-xs font-semibold hover:underline">Back to Jobs</Link></div>
        </div>
      </div>
    );
  }

  const isSchedulingFirstTime = !job.scheduled_start;
  const contractSigned = job.contract_status === "signed";
  const anyMutationBusy = scheduleMutation.isPending || reassignMutation.isPending || unassignMutation.isPending || updateStatusMutation.isPending || cancelMutation.isPending;

  return (
    <div className="w-full text-slate-200 select-none pb-12">
      <Breadcrumbs items={[{ label: "Jobs", to: "/adminjobs" }, { label: `Job #${job.id}` }]} />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border transition-all ${
          toast.type === "success" ? "bg-[#0c1017] border-emerald-500/30 text-emerald-400" : "bg-[#0c1017] border-rose-500/30 text-rose-400"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Job #{job.id}</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-extrabold tracking-wider uppercase bg-white/6 text-slate-400 border-white/4">
              {job.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {job.customer_contact?.full_name || "Customer info unavailable"}
            {job.quote_number ? ` · Quote ${job.quote_number}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {job.status === "completed" && job.invoice_id && (
            <Link
              to="/admininvoices/$invoiceId"
              params={{ invoiceId: String(job.invoice_id) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-[10px] font-bold rounded-md hover:bg-[#E2A54A]/20 transition"
            >
              <Receipt className="w-3 h-3" /> View Invoice{job.invoice_number ? ` ${job.invoice_number}` : ""}
            </Link>
          )}
          {job.status !== "completed" && job.status !== "cancelled" && (
            <button
              onClick={() => updateStatusMutation.mutate(job.status === "in_progress" ? "completed" : "in_progress")}
              disabled={anyMutationBusy || (job.status !== "in_progress" && !contractSigned)}
              title={job.status !== "in_progress" && !contractSigned ? "Both parties must sign the contract before this job can start." : undefined}
              className="px-3 py-1.5 bg-[#E2A54A]/10 border border-[#E2A54A]/20 text-[#E2A54A] text-[10px] font-bold rounded-md hover:bg-[#E2A54A]/20 transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {job.status === "in_progress" ? "Mark Completed" : "Start Job"}
            </button>
          )}
          {job.status !== "completed" && job.status !== "cancelled" && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={anyMutationBusy}
              className="flex items-center gap-1 px-3 py-1.5 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md hover:bg-rose-500/10 transition duration-150 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" /> Cancel Job
            </button>
          )}
        </div>
      </div>

      {job.contract_id && !contractSigned && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-400">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Crew assignment and job start are locked until both parties have signed the contract
            (currently: {(job.contract_status ?? "unknown").replace("_", " ")}).
          </span>
        </div>
      )}
      {!job.contract_id && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-400">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>No contract is linked to this job yet — crew assignment is locked until one exists and is fully signed.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Route</h3>
            <div className="flex items-start gap-2 text-sm text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
              <div>
                <p>{job.move_from || "—"}</p>
                <p className="text-slate-600 my-1">↓</p>
                <p>{job.move_to || "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Schedule</h3>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-600" /> {formatDate(job.scheduled_start)} — {formatDate(job.scheduled_end)}
            </div>
          </div>

          <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5" /> Contract
            </h3>
            {job.contract_id ? (
              <>
                <p className="text-sm text-slate-200 capitalize">{(job.contract_status ?? "unknown").replace("_", " ")}</p>
                <div className="flex flex-col gap-1.5 pt-1">
                  <Link
                    to="/admincontracts/$contractId"
                    params={{ contractId: String(job.contract_id) }}
                    className="text-xs font-semibold text-[#E2A54A] hover:underline"
                  >
                    Review / Countersign →
                  </Link>
                  {job.contract_url && (
                    <a href={job.contract_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-300 hover:underline">
                      Open signing page
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-600">No contract yet.</p>
            )}
          </div>

          <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Currently Assigned</h3>
            <div className="space-y-2">
              {(job.crew_ids ?? []).length === 0 && <p className="text-xs text-slate-600">No crew assigned yet.</p>}
              {(job.crew_ids ?? []).map((uid) => (
                <div key={uid} className="flex items-center justify-between rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                  <span className="text-xs font-medium text-slate-200">{usersById.get(uid)?.full_name || `User #${uid}`}</span>
                  <button
                    onClick={() => unassignMutation.mutate(uid)}
                    disabled={anyMutationBusy}
                    className="text-[10px] font-bold text-rose-400 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {job.dispatcher_id && (
                <div className="flex items-center justify-between rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                  <span className="text-xs font-medium text-slate-200">
                    {usersById.get(job.dispatcher_id)?.full_name || `User #${job.dispatcher_id}`} <span className="text-slate-500">(dispatcher)</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {job.photos && job.photos.length > 0 && (
            <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Job Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {job.photos.map((p, i) => {
                  const url = typeof p === "string" ? p : (p as { url?: string })?.url;
                  return url ? (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} className="rounded-md border border-white/6 aspect-square object-cover" />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {tracking?.history && tracking.history.length > 0 && (
            <div className="bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Status Timeline</h3>
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
        </div>

        <div className="lg:col-span-2">
          <div className={`bg-[#0d111a]/40 backdrop-blur-md border border-white/6 rounded-xl p-6 ${!contractSigned ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-2 mb-1">
              <UserCog className="w-4 h-4 text-[#E2A54A]" />
              <h3 className="text-sm font-bold text-white">{isSchedulingFirstTime ? "Schedule & Assign Crew" : "Reassign Crew"}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              {!contractSigned
                ? "Locked until both parties have signed the contract."
                : isSchedulingFirstTime
                  ? "This job hasn't been scheduled yet — set a start/end time and assign crew."
                  : "Change crew or dispatcher without altering the existing schedule, or update the schedule below."}
            </p>

            <fieldset disabled={!contractSigned} className="contents">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Scheduled Start</label>
                  <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Scheduled End</label>
                  <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)}
                    className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50" />
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dispatcher</label>
                <select value={dispatcherId} onChange={(e) => setDispatcherId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-[#07090e] border border-[#161b22] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E2A54A]/60 disabled:opacity-50">
                  <option value="">No dispatcher</option>
                  {dispatchers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                </select>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Crew Members ({crew.length} selected)</label>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {crewMembers.length === 0 ? (
                    <p className="text-xs text-slate-600 py-3 text-center">No crew members found. Add users with the "crew" role first.</p>
                  ) : (
                    crewMembers.map((member) => (
                      <label key={member.id} className={`flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded-lg border transition ${
                        crew.includes(member.id) ? "bg-[#E2A54A]/10 border-[#E2A54A]/30" : "bg-[#07090e] border-[#161b22] hover:border-[#252c3a]"
                      }`}>
                        <span className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                          <span className="w-6 h-6 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-[9px] font-bold text-slate-400">
                            {member.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                          </span>
                          {member.full_name}
                        </span>
                        <input type="checkbox" checked={crew.includes(member.id)} onChange={() => toggleCrew(member.id)} className="accent-[#E2A54A] h-4 w-4 rounded cursor-pointer" />
                      </label>
                    ))
                  )}
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end gap-3">
              {!isSchedulingFirstTime && (
                <button
                  onClick={() => reassignMutation.mutate()}
                  disabled={anyMutationBusy || !contractSigned}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-200 text-xs font-bold hover:bg-white/5 transition disabled:opacity-50"
                >
                  {reassignMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Save Crew Only
                </button>
              )}
              <button
                onClick={() => scheduleMutation.mutate()}
                disabled={anyMutationBusy || !start || !end || !contractSigned}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E2A54A] text-slate-950 text-xs font-bold hover:bg-[#d4963b] transition disabled:opacity-50"
              >
                {scheduleMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                {isSchedulingFirstTime ? "Schedule & Assign" : "Update Schedule & Crew"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}