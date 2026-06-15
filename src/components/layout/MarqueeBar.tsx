const TEXT = "SUPERSONIC DYNAMIC SERVICES B.V IS THE NEXT LEVEL GAME CHANGER IN THE DUTCH MOVING SERVICES MARKET.";

export function MarqueeBar() {
  return (
    /* mt-[56px] pushes the bar down on small screens to prevent the mobile navbar from covering it */
    <div className="overflow-hidden border-y border-white/5 bg-[#0B1117] py-3 mt-14 sm:mt-0">
      {/* text-foreground ensures the typography is bright, clear, and perfectly readable on mobile */}
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-xs font-semibold tracking-[0.18em] text-foreground sm:text-foreground/85">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="flex items-center gap-12">
            {TEXT}
            <span className="text-primary">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}