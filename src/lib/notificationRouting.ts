import type { NotificationResponse } from "@/lib/api-types";

type Role = "admin" | "customer" | "crew";

export function getNotificationRoute(n: NotificationResponse, role: Role) {
  if (!n.entity_type || !n.entity_id) return null;
  const id = String(n.entity_id);

  if (role === "admin") {
    switch (n.entity_type) {
      case "quote_request":
      case "quote": return { to: "/adminquotes/$quoteId", params: { quoteId: id } };
      case "job": return { to: "/adminjobs/$jobId", params: { jobId: id } };
      case "invoice": return { to: "/admininvoices/$invoiceId", params: { invoiceId: id } };
      case "contract": return { to: "/admincontracts/$contractId", params: { contractId: id } };
      default: return null;
    }
  }

  // Placeholders — I don't have the customer/crew route files, adjust paths to match
  if (role === "customer") {
    switch (n.entity_type) {
      case "quote_request":
      case "quote": return { to: "/quotes/$quoteId", params: { quoteId: id } };
      case "job": return { to: "/jobs/$jobId", params: { jobId: id } };
      case "invoice": return { to: "/invoices/$invoiceId", params: { invoiceId: id } };
      default: return null;
    }
  }

  if (role === "crew") {
    if (n.entity_type === "job") return { to: "/crew/jobs/$jobId", params: { jobId: id } };
    return null;
  }

  return null;
}