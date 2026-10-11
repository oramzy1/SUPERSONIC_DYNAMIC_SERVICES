import { toast } from "sonner";

type ApiErrorShape = {
  response?: { data?: { detail?: unknown }; status?: number };
};

export const SESSION_EXPIRED_KEY = "sds_session_expired";

export function apiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const detail = (err as ApiErrorShape)?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: unknown };
    if (typeof first?.msg === "string" && first.msg.trim()) return first.msg;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function showError(err: unknown, fallback?: string): void {
  toast.error(apiErrorMessage(err, fallback));
}

export function showErrorText(message: string): void {
  toast.error(message);
}

export function showSuccess(message: string): void {
  toast.success(message);
}

export function showInfo(message: string): void {
  toast.info(message);
}

export function flagSessionExpired(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
  } catch {
    return;
  }
}

export function consumeSessionExpired(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const flagged = sessionStorage.getItem(SESSION_EXPIRED_KEY) === "1";
    if (flagged) sessionStorage.removeItem(SESSION_EXPIRED_KEY);
    return flagged;
  } catch {
    return false;
  }
}
