import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Menu,
  Search,
  UserCircle2,
  X,
  UserPlus,
  LogIn,
  MapPin,
  HelpCircle,
  Sun,
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CTAButton } from "@/components/shared/CTAButton";
import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Shop Materials", to: "/shop" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faqs" },
];

export function Header() {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // DEV TOGGLE: Change to true to preview the Logged User Dropdown from your Figma file
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Smart Scroll Mechanics
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the very top of the page
      if (currentScrollY < 10) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // If mobile menu or profile dropdown is currently open, don't auto-hide the navbar
      if (open || profileDropdownOpen) {
        setVisible(true);
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Professional Debounce Timer: Force reveal the navbar as soon as user scrolling stops entirely
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setVisible(true);
      }, 150); // Fires exactly 150ms after scroll action ceases
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [open, profileDropdownOpen]);

  // Close dropdowns on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchExpanded(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 right-0 top-0 z-40 border-b border-white/5 bg-[#0E141A]/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8 md:py-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Supersonic Dynamic Services" className="h-10 w-auto" />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground relative pb-1",
                  active ? "text-primary font-semibold" : "text-foreground/80",
                )}
              >
                {n.label}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* UTILITY ACTIONS CONTAINER */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* EXPANDABLE SEARCH COMPONENT */}
          <div ref={searchRef} className="relative flex items-center">
            <AnimatePresence>
              {searchExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "240px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden z-10 hidden md:block"
                >
                  <input
                    autoFocus
                    placeholder="Search services..."
                    className="w-full rounded-full border border-white/10 bg-[#0E141A] py-2 pl-4 pr-10 text-sm text-foreground outline-none focus:border-(--primary)/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className={cn(
                "z-20 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5",
                searchExpanded && "text-primary hover:text-primary bg-white/5",
              )}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* NOTIFICATION LINK */}
          <Link
            to="/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
          >
            <Bell className="h-5 w-5" />
          </Link>

          {/* USER MENU & PROFILE DROPDOWN WRAPPER */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5",
                profileDropdownOpen && "text-primary bg-white/5",
              )}
            >
              <UserCircle2 className="h-6 w-6" />
            </button>

            {/* FIGMA ACCURATE DROPDOWNS */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/5 bg-[#12181F] p-4 shadow-2xl z-50 hidden md:block"
                >
                  {/* Close Cross Trigger */}
                  <button
                    onClick={() => setProfileDropdownOpen(false)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {!isLoggedIn ? (
                    /* LEFT FIGMA CARD: GUEST MENU */
                    <div className="space-y-2 mt-6">
                      <DropdownItem
                        to="/register"
                        icon={<UserPlus />}
                        title="Create An Account"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/login"
                        icon={<LogIn />}
                        title="Sign In"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/"
                        icon={<MapPin />}
                        title="Track Request"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/contact"
                        icon={<HelpCircle />}
                        title="Help & Contact"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/"
                        icon={<Sun />}
                        title="Theme"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                    </div>
                  ) : (
                    /* RIGHT FIGMA CARD: LOGGED USER MENU */
                    <div className="space-y-2 mt-6">
                      <DropdownItem
                        to="/dashboard"
                        icon={<LayoutDashboard />}
                        title="Dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/quotes"
                        icon={<FileText />}
                        title="My Quotes"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/jobs"
                        icon={<Briefcase />}
                        title="My Jobs"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/invoices"
                        icon={<FileText />}
                        title="Invoices"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/settings"
                        icon={<Settings />}
                        title="Profile Settings"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/theme"
                        icon={<Sun />}
                        title="Theme"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <DropdownItem
                        to="/support"
                        icon={<HelpCircle />}
                        title="Help & Support"
                        onClick={() => setProfileDropdownOpen(false)}
                      />

                      {/* Premium Figma Custom Gold/Yellow styled Logout action button */}
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setProfileDropdownOpen(false);
                        }}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors py-3 text-sm font-semibold text-zinc-950"
                      >
                        Logout <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* REQUEST QUOTE CTA BUTTON */}
          <Link to="/quote" className="hidden md:block">
            <CTAButton
              variant="primary"
              className="rounded-xl px-5 py-2 text-sm tracking-wide shadow-lg shadow-(--primary)/10"
            >
              Request Quote
            </CTAButton>
          </Link>

          {/* MOBILE BURGER ACTION BUTTON */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground lg:hidden hover:bg-white/5 transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            ) : (
              <Menu className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE FULL INTERACTIVE MENU OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5 bg-[#0E141A] lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 px-4 py-5">
              {/* Native Fluid Search inside Mobile Dropdown View */}
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search services..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Core Links */}
              <nav className="flex flex-col gap-1">
                {NAV.map((n, idx) => (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    key={n.to}
                  >
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5",
                        location.pathname === n.to
                          ? "text-primary bg-primary/5"
                          : "text-foreground/85",
                      )}
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="h-px bg-white/5 my-1" />

              {/* Quick profile redirect links for mobile layout stack */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={isLoggedIn ? "/dashboard" : "/login"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2.5 text-xs font-medium text-foreground"
                >
                  <UserCircle2 className="h-4 w-4" /> {isLoggedIn ? "Dashboard" : "Sign In"}
                </Link>
                <Link to="/quote" onClick={() => setOpen(false)}>
                  <CTAButton
                    variant="primary"
                    className="w-full rounded-xl py-2.5 text-xs font-semibold"
                  >
                    Request Quote
                  </CTAButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* HELPER ELEMENT SUBCOMPONENT TO CONSTRUCT THE FIGMA OPTIONS LAYER */
function DropdownItem({
  to,
  icon,
  title,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-foreground/90 transition-all duration-200 hover:bg-white/10 hover:border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground group-hover:text-primary transition-colors [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
        <span className="font-medium tracking-tight">{title}</span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
