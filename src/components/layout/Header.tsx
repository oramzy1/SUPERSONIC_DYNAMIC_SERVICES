import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Search, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { CTAButton } from "@/components/shared/CTAButton";
import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faqs" },
];

export function Header() {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0E141A]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8 md:py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Supersonic Dynamic Services" className="h-10 w-auto" />
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-primary border-b-2 border-primary pb-1" : "text-foreground/80",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-surface px-4 py-2 md:flex w-65">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search services..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground md:flex">
            <Bell className="h-5 w-5" />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground md:flex">
            <UserCircle2 className="h-6 w-6" />
          </button>
          <Link to="/quote" className="hidden md:block">
            <CTAButton variant="primary" className="rounded-md px-5 py-2.5 text-sm">
              Request Quote
            </CTAButton>
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#0E141A] lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-foreground/85 hover:bg-white/5"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/quote" onClick={() => setOpen(false)} className="mt-2">
              <CTAButton variant="primary" className="w-full rounded-full">
                Request Quote
              </CTAButton>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
