import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MarqueeBar } from "./MarqueeBar";

export function SiteLayout({
  children,
  marquee = true,
}: {
  children: ReactNode;
  marquee?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {marquee && <MarqueeBar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
