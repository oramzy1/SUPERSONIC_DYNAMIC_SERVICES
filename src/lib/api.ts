// import axios from "axios";
// import type {
//   LoginRequest,
//   LoginResponse,
//   RegisterRequest,
//   RegisterResponse,
//   RefreshRequest,
//   RefreshResponse,
//   ForgotPasswordRequest,
//   ForgotPasswordResponse,
//   ResetPasswordRequest,
//   ResetPasswordResponse,
//   ProfileResponse,
//   ProfileUpdateRequest,
//   PasswordChangeRequest,
//   PersonalDataExport,
//   DeleteResponse,
//   PresignedUrlResponse,
//   QuoteRequestCreate,
//   QuoteRequestResponse,
//   QuoteResponse,
//   QuoteAcceptResponse,
//   QuoteRejectResponse,
//   JobResponse,
//   StatusUpdateRequest,
//   ScheduleRequest,
//   TrackingResponse,
//   InvoiceResponse,
//   PayResponse,
//   DashboardResponse,
//   TicketCreate,
//   TicketResponse,
// } from "./api-types";

// const BASE = import.meta.env.VITE_API_BASE_URL as string;

// // ─── Token helpers ──────────────────────────────────
// const ACCESS_KEY = "sds_access_token";
// const REFRESH_KEY = "sds_refresh_token";

// export function getAccessToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem(ACCESS_KEY);
// }

// export function getRefreshToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem(REFRESH_KEY);
// }

// export function setTokens(access: string, refresh: string) {
//   localStorage.setItem(ACCESS_KEY, access);
//   localStorage.setItem(REFRESH_KEY, refresh);
// }

// export function clearTokens() {
//   localStorage.removeItem(ACCESS_KEY);
//   localStorage.removeItem(REFRESH_KEY);
// }

// // ─── Axios instance ─────────────────────────────────
// const api = axios.create({
//   baseURL: BASE,
//   headers: { "Content-Type": "application/json" },
// });

// // Request interceptor – attach Bearer token
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor – auto-refresh on 401
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (err: unknown) => void;
// }> = [];

// function processQueue(error: unknown, token: string | null) {
//   failedQueue.forEach((prom) => {
//     if (error || !token) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// }

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const original = err.config;
//     if (err.response?.status !== 401 || original._retry) {
//       return Promise.reject(err);
//     }

//     if (isRefreshing) {
//       return new Promise<string>((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then((token) => {
//         original.headers.Authorization = `Bearer ${token}`;
//         return api(original);
//       });
//     }

//     original._retry = true;
//     isRefreshing = true;

//     const refresh = getRefreshToken();
//     if (!refresh) {
//       clearTokens();
//       isRefreshing = false;
//       if (typeof window !== "undefined") window.location.href = "/login";
//       return Promise.reject(err);
//     }

//     try {
//       const { data } = await axios.post<RefreshResponse>(
//         `${BASE}/auth/refresh`,
//         { refresh_token: refresh } satisfies RefreshRequest,
//       );
//       setTokens(data.access_token, data.refresh_token);
//       processQueue(null, data.access_token);
//       original.headers.Authorization = `Bearer ${data.access_token}`;
//       return api(original);
//     } catch (refreshErr) {
//       clearTokens();
//       processQueue(refreshErr, null);
//       if (typeof window !== "undefined") window.location.href = "/login";
//       return Promise.reject(refreshErr);
//     } finally {
//       isRefreshing = false;
//     }
//   },
// );

// // ─── Auth endpoints ─────────────────────────────────
// export const authApi = {
//   register: (body: RegisterRequest) =>
//     api.post<RegisterResponse>("/auth/register", body).then((r) => r.data),

//   login: (body: LoginRequest) =>
//     api.post<LoginResponse>("/auth/login", body).then((r) => r.data),

//   refresh: (body: RefreshRequest) =>
//     api.post<RefreshResponse>("/auth/refresh", body).then((r) => r.data),

//   logout: () => api.post("/auth/logout").then((r) => r.data),

//   forgotPassword: (body: ForgotPasswordRequest) =>
//     api.post<ForgotPasswordResponse>("/auth/password/forgot", body).then((r) => r.data),

//   resetPassword: (body: ResetPasswordRequest) =>
//     api.post<ResetPasswordResponse>("/auth/password/reset", body).then((r) => r.data),
// };

// // ─── Account endpoints ──────────────────────────────
// export const accountApi = {
//   getProfile: () =>
//     api.get<ProfileResponse>("/account/me").then((r) => r.data),

//   listUsers: () =>
//     api.get<ProfileResponse[]>("/account/users").then((r) => r.data),

//   updateProfile: (body: ProfileUpdateRequest) =>
//     api.put<ProfileResponse>("/account/me", body).then((r) => r.data),

//   changePassword: (body: PasswordChangeRequest) =>
//     api.put("/account/me/password", body).then((r) => r.data),

//   exportData: () =>
//     api.get<PersonalDataExport>("/account/export").then((r) => r.data),

//   deleteAccount: () =>
//     api.delete<DeleteResponse>("/account/delete").then((r) => r.data),
// };

// // ─── Quotes endpoints ───────────────────────────────
// export const quotesApi = {
//   getPresignedUrl: (filename: string, contentType = "video/mp4") =>
//   api
//     .post<PresignedUrlResponse>("/quotes/presigned-url", null, {
//       params: { filename, content_type: contentType },
//     })
//     .then((r) => r.data),

//   createRequest: (body: QuoteRequestCreate) =>
//     api.post<QuoteRequestResponse>("/quotes/request", body).then((r) => r.data),

//   // Customer-facing quote history (kept as-is)
//   list: () => api.get<QuoteResponse[]>("/quotes").then((r) => r.data),

//   // Admin-facing QuoteRequest list filtered by status (e.g. "pending")
//   listRequests: (status?: string) =>
//     api
//       .get<QuoteRequestResponse[]>("/quotes", {
//         params: status ? { status } : undefined,
//       })
//       .then((r) => r.data),

//   get: (quoteId: number) =>
//     api.get<QuoteResponse>(`/quotes/${quoteId}`).then((r) => r.data),

//   generateQuote: (quoteId: number) =>
//     api.post<QuoteResponse>(`/quotes/${quoteId}/generate-quote`).then((r) => r.data),

//   accept: (quoteId: number) =>
//     api.post<QuoteAcceptResponse>(`/quotes/${quoteId}/accept`).then((r) => r.data),
//    counterOffer: (quoteId: number, body: { amount: number | string; message?: string }) =>
//     api.post<QuoteResponse>(`/quotes/${quoteId}/counter-offer`, body).then((r) => r.data),

//   downloadPdf: (quoteId: number) =>
//     api.get(`/quotes/${quoteId}/pdf`, { responseType: "blob" }).then((r) => r.data as Blob),

//   reject: (quoteId: number) =>
//     api.post<QuoteRejectResponse>(`/quotes/${quoteId}/reject`).then((r) => r.data),
// };

// // ─── Jobs endpoints ─────────────────────────────────
// export const jobsApi = {
//   list: (status?: string) =>
//     api
//       .get<JobResponse[]>("/jobs", { params: status ? { status } : undefined })
//       .then((r) => r.data),

//   track: (token: string) =>
//     api.get<TrackingResponse>(`/jobs/track/${token}`).then((r) => r.data),

//   updateStatus: (jobId: number, body: StatusUpdateRequest) =>
//     api.put(`/jobs/${jobId}/status`, body).then((r) => r.data),

//   schedule: (jobId: number, body: ScheduleRequest) =>
//     api.put<JobResponse>(`/jobs/${jobId}/schedule`, body).then((r) => r.data),

//   getPhotoPresignedUrl: (jobId: number, filename: string, contentType = "image/jpeg") =>
//     api
//       .post(`/jobs/${jobId}/photos-presigned`, null, {
//         params: { filename, content_type: contentType },
//       })
//       .then((r) => r.data as { url: string; fields?: Record<string, unknown> | null }),

//   attachPhotos: (jobId: number, photoUrls: string[]) =>
//     api.post(`/jobs/${jobId}/photos`, photoUrls).then((r) => r.data),

//   cancel: (jobId: number) =>
//     api.post(`/jobs/${jobId}/cancel`).then((r) => r.data),
// };

// // ─── Invoices endpoints ─────────────────────────────
// export const invoicesApi = {
//   list: (status?: string) =>
//     api
//       .get<InvoiceResponse[]>("/invoices", { params: status ? { status } : undefined })
//       .then((r) => r.data),

//   get: (invoiceId: number) =>
//     api.get<InvoiceResponse>(`/invoices/${invoiceId}`).then((r) => r.data),

//   pay: (invoiceId: number, redirectUrl?: string) =>
//     api
//       .post<PayResponse>(`/invoices/${invoiceId}/pay`, null, {
//         params: redirectUrl ? { redirect_url: redirectUrl } : undefined,
//       })
//       .then((r) => r.data),
// };

// // ─── Admin endpoints ────────────────────────────────
// export const adminApi = {
//   dashboard: () =>
//     api.get<DashboardResponse>("/admin/dashboard").then((r) => r.data),

//   generateQuote: (quoteId: number) =>
//     api.post<QuoteResponse>(`/quotes/${quoteId}/generate-quote`).then((r) => r.data),
// };

// // ─── Support endpoints ──────────────────────────────
// export const supportApi = {
//   createTicket: (body: TicketCreate) =>
//     api.post<TicketResponse>("/support/ticket", body).then((r) => r.data),
// };

// export default api;

import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshRequest,
  RefreshResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ProfileResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  PersonalDataExport,
  DeleteResponse,
  PresignedUrlResponse,
  QuoteRequestCreate,
  QuoteRequestResponse,
  QuoteResponse,
  QuoteAcceptResponse,
  QuoteRejectResponse,
  JobResponse,
  StatusUpdateRequest,
  ScheduleRequest,
  TrackingResponse,
  InvoiceResponse,
  PayResponse,
  DashboardResponse,
  TicketCreate,
  TicketResponse,
} from "./api-types";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

// ─── Token helpers ──────────────────────────────────
const ACCESS_KEY = "sds_access_token";
const REFRESH_KEY = "sds_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Axios instance ─────────────────────────────────
const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor – attach Bearer token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error || !token) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      isRefreshing = false;
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(err);
    }

    try {
      const { data } = await axios.post<RefreshResponse>(`${BASE}/auth/refresh`, {
        refresh_token: refresh,
      } satisfies RefreshRequest);
      setTokens(data.access_token, data.refresh_token);
      processQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch (refreshErr) {
      clearTokens();
      processQueue(refreshErr, null);
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── PDF helpers ─────────────────────────────────────
// The /quotes/{id}/pdf and /invoices/{id}/pdf endpoints require a Bearer
// token, so they can't be opened as a plain <a href>. Fetch as a blob
// (auth header attached by the interceptor above), then hand the caller
// an object URL to open/download.
export function mapPdfError(err: unknown): string {
  const status = (err as { response?: { status?: number } })?.response?.status;
  if (status === 401 || status === 403)
    return "You're not signed in as the owner of this document.";
  if (status === 404) return "This PDF hasn't been generated yet.";
  if (status === 502) return "Couldn't generate the PDF right now - please try again in a moment.";
  return "Failed to download the PDF. Please try again.";
}

export async function openBlobInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  // Give the new tab time to load the blob before revoking it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ─── Auth endpoints ─────────────────────────────────
export const authApi = {
  register: (body: RegisterRequest) =>
    api.post<RegisterResponse>("/auth/register", body).then((r) => r.data),

  login: (body: LoginRequest) => api.post<LoginResponse>("/auth/login", body).then((r) => r.data),

  refresh: (body: RefreshRequest) =>
    api.post<RefreshResponse>("/auth/refresh", body).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  forgotPassword: (body: ForgotPasswordRequest) =>
    api.post<ForgotPasswordResponse>("/auth/password/forgot", body).then((r) => r.data),

  resetPassword: (body: ResetPasswordRequest) =>
    api.post<ResetPasswordResponse>("/auth/password/reset", body).then((r) => r.data),
};

// ─── Account endpoints ──────────────────────────────
export const accountApi = {
  getProfile: () => api.get<ProfileResponse>("/account/me").then((r) => r.data),

  listUsers: () => api.get<ProfileResponse[]>("/account/users").then((r) => r.data),

  updateProfile: (body: ProfileUpdateRequest) =>
    api.put<ProfileResponse>("/account/me", body).then((r) => r.data),

  changePassword: (body: PasswordChangeRequest) =>
    api.put("/account/me/password", body).then((r) => r.data),

  getUserAdmin: (userId: number) =>
    api.get<ProfileResponse>(`/account/users/${userId}`).then((r) => r.data),

  updateUserAdmin: (userId: number, body: ProfileUpdateRequest) =>
    api.patch<ProfileResponse>(`/account/users/${userId}`, body).then((r) => r.data),

  updateUserRole: (userId: number, role: string) =>
    api
      .patch<ProfileResponse>(`/account/users/${userId}/role`, { role } satisfies RoleUpdateRequest)
      .then((r) => r.data),

  deleteUserAdmin: (userId: number) =>
    api.delete(`/account/users/${userId}`).then((r) => r.data),

  exportData: () => api.get<PersonalDataExport>("/account/export").then((r) => r.data),

  deleteAccount: () => api.delete<DeleteResponse>("/account/delete").then((r) => r.data),
};

// ─── Quotes endpoints ───────────────────────────────
export const quotesApi = {
  getPresignedUrl: (filename: string, contentType = "video/mp4") =>
    api
      .post<PresignedUrlResponse>("/quotes/presigned-url", null, {
        params: { filename, content_type: contentType },
      })
      .then((r) => r.data),

  createRequest: (body: QuoteRequestCreate) =>
    api.post<QuoteRequestResponse>("/quotes/request", body).then((r) => r.data),

  // Customer-facing priced quotes (QuoteResponse - has total_price, valid_until, etc.)
  list: () => api.get<QuoteResponse[]>("/quotes").then((r) => r.data),

  // Admin-facing QuoteRequest list, filterable by status ("pending" | "quoted" | "accepted" | "rejected")
  listRequests: (status?: string) =>
    api
      .get<QuoteRequestResponse[]>("/quotes", {
        params: status ? { status } : undefined,
      })
      .then((r) => r.data),

  get: (quoteId: number) => api.get<QuoteResponse>(`/quotes/${quoteId}`).then((r) => r.data),

  generateQuote: (quoteId: number, body: { amount: number | string; valid_until_days?: number }) =>
    api.post<QuoteResponse>(`/quotes/${quoteId}/generate-quote`, body).then((r) => r.data),

  counterOffer: (quoteId: number, body: { amount: number | string; message?: string }) =>
    api.post<QuoteResponse>(`/quotes/${quoteId}/counter-offer`, body).then((r) => r.data),

  accept: (quoteId: number) =>
    api.post<QuoteAcceptResponse>(`/quotes/${quoteId}/accept`).then((r) => r.data),

  reject: (quoteId: number, reason?: string) =>
    api
      .post<QuoteRejectResponse>(`/quotes/${quoteId}/reject`, reason ? { reason } : undefined)
      .then((r) => r.data),

  downloadPdf: (quoteId: number) =>
    api.get(`/quotes/${quoteId}/pdf`, { responseType: "blob" }).then((r) => r.data as Blob),
};

// ─── Jobs endpoints ─────────────────────────────────
export const jobsApi = {
  list: (status?: string) =>
    api
      .get<JobResponse[]>("/jobs", { params: status ? { status } : undefined })
      .then((r) => r.data),

  assignCrew: (jobId: number, body: JobAssignmentRequest) => 
    api.put<JobResponse>(`/jobs/${jobId}/assign`, body).then((r) => r.data),

  unassign: (jobId: number, body: JobUnassignRequest) =>
    api.post<JobResponse>(`/jobs/${jobId}/unassign`, body).then((r) => r.data),

  track: (token: string) => api.get<TrackingResponse>(`/jobs/track/${token}`).then((r) => r.data),

  updateStatus: (jobId: number, body: StatusUpdateRequest) =>
    api.put(`/jobs/${jobId}/status`, body).then((r) => r.data),

  schedule: (jobId: number, body: ScheduleRequest) =>
    api.put<JobResponse>(`/jobs/${jobId}/schedule`, body).then((r) => r.data),

  getPhotoPresignedUrl: (jobId: number, filename: string, contentType = "image/jpeg") =>
    api
      .post(`/jobs/${jobId}/photos-presigned`, null, {
        params: { filename, content_type: contentType },
      })
      .then((r) => r.data as { url: string; fields?: Record<string, unknown> | null }),

  attachPhotos: (jobId: number, photoUrls: string[]) =>
    api.post(`/jobs/${jobId}/photos`, photoUrls).then((r) => r.data),

  cancel: (jobId: number) => api.post(`/jobs/${jobId}/cancel`).then((r) => r.data),
};

// ─── Invoices endpoints ─────────────────────────────
export const invoicesApi = {
  list: (status?: string) =>
    api
      .get<InvoiceResponse[]>("/invoices", { params: status ? { status } : undefined })
      .then((r) => r.data),

  get: (invoiceId: number) =>
    api.get<InvoiceResponse>(`/invoices/${invoiceId}`).then((r) => r.data),

  pay: (invoiceId: number, redirectUrl?: string) =>
    api
      .post<PayResponse>(`/invoices/${invoiceId}/pay`, null, {
        params: redirectUrl ? { redirect_url: redirectUrl } : undefined,
      })
      .then((r) => r.data),

  downloadPdf: (invoiceId: number) =>
    api.get(`/invoices/${invoiceId}/pdf`, { responseType: "blob" }).then((r) => r.data as Blob),
};

// ─── Admin endpoints ────────────────────────────────
export const adminApi = {
  dashboard: () => api.get<DashboardResponse>("/admin/dashboard").then((r) => r.data),
};

// ─── Support endpoints ──────────────────────────────
export const supportApi = {
  createTicket: (body: TicketCreate) =>
    api.post<TicketResponse>("/support/ticket", body).then((r) => r.data),
};

export default api;
