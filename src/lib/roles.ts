export type AppRole = "customer" | "crew" | "admin" | "dispatcher" | "finance" | string;

export function dashboardPathForRole(role?: AppRole): string {
  if (role === "crew") return "/crewdashboard";
  if (role && ["admin", "dispatcher", "finance"].includes(role)) return "/admindashboard";
  return "/dashboard";
}

export function isStaffRole(role?: AppRole): boolean {
  return !!role && ["admin", "dispatcher", "finance"].includes(role);
}