import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="hover:text-slate-200 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-semibold">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700" />}
        </span>
      ))}
    </nav>
  );
}