import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CalendarPlus, BarChart3, ArrowLeft, ArrowRight } from "lucide-react";

type BookingSuccessSearch = {
  date?: number;
  time?: string;
  month?: string;
  year?: number;
};

export const Route = createFileRoute("/bookingsuccess")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookingSuccessSearch => {
    return {
      date: Number(search.date) || 12,
      time: (search.time as string) || "10:30 AM",
      month: (search.month as string) || "November",
      year: Number(search.year) || 2024,
    };
  },
});

function RouteComponent() {
  const { date, time, month, year } = Route.useSearch();

  // Helper function to dynamically add 30 minutes to any slot time format
  const getEndTime = (startTime: string) => {
    try {
      const [timePart, modifier] = startTime.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      minutes += 30;
      if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      }

      if (hours > 12) hours -= 12;

      const formattedMinutes = minutes === 0 ? "00" : minutes.toString().padStart(2, "0");
      const formattedHours = hours.toString().padStart(2, "0");

      return `${formattedHours}:${formattedMinutes} ${modifier}`;
    } catch {
      return "UTC";
    }
  };

  const objectives = [
    {
      id: "01",
      title: "Fleet Decarbonization Audit",
      description:
        "Analysis of the Q3 carbon offset metrics and electric vehicle deployment efficiency across the Northern corridor.",
    },
    {
      id: "02",
      title: "Supersonic Route Optimization",
      description:
        "Review of the new AI-driven trajectory models designed to reduce energy consumption by 14% during peak hours.",
    },
    {
      id: "03",
      title: "Resource Allocation",
      description:
        "Strategic planning for the transition to 100% renewable energy at the Amsterdam logistics hub.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between py-12 px-6">
      {/* ── Main Content Container ── */}
      <div className="max-w-210 w-full mx-auto my-auto flex flex-col items-center text-center">
        {/* Animated Checkmark Badge */}
        <div className="h-16 w-16 bg-[#1e293b] border border-gray-700/60 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <div className="h-10 w-10 bg-[#313d4f] rounded-full flex items-center justify-center text-white border border-gray-600/40">
            <Check className="h-5 w-5 stroke-3" />
          </div>
        </div>

        <span className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase block mb-3">
          Transmission Successful
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-12 max-w-xl leading-[1.15]">
          Operational Briefing Confirmed
        </h1>

        {/* ── Info Split Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full text-left items-stretch mb-8">
          {/* Left Panel: Schedule Metadata */}
          <div className="md:col-span-2 bg-[#111622] border border-gray-800/70 rounded-2xl p-6 flex flex-col justify-between min-h-55">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-gray-500 uppercase block mb-1">
                Scheduled Schedule
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {month} {date}, {year}
              </h2>
              <p className="text-sm font-semibold text-gray-400 mt-1">
                {time} - {getEndTime(time || "10:30 AM")}
              </p>
            </div>

            <button className="w-full bg-white hover:bg-gray-100 text-[#0b0f19] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 mt-6">
              <CalendarPlus className="h-4 w-4 stroke-[2.5]" />
              Add to Calendar
            </button>
          </div>

          {/* Right Panel: Briefing Objectives */}
          <div className="md:col-span-3 bg-[#111622] border border-gray-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-4 mb-4">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <h3 className="text-xs font-bold tracking-wider text-white uppercase">
                Briefing Objectives
              </h3>
            </div>

            <div className="space-y-5">
              {objectives.map((obj) => (
                <div key={obj.id} className="flex gap-4 items-start">
                  <span className="text-xs font-bold text-[#dfb15b] tracking-wider pt-0.5">
                    {obj.id}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200 tracking-tight">{obj.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-normal mt-1">
                      {obj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Inline Footer Metadata Row ── */}
        <div className="w-full bg-[#111622]/40 border border-gray-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
              alt="Hillary Nweze"
              className="w-8 h-8 rounded-full object-cover grayscale border border-gray-800"
            />
            <p className="text-xs text-gray-400 text-left">
              <span className="text-gray-500 block text-[10px] font-bold uppercase tracking-wide">
                Briefing Lead
              </span>
              <strong className="text-gray-200 font-semibold">Hillary Nweze</strong> - Director of
              Sustainability
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] font-bold tracking-wide text-gray-500 uppercase block">
                Briefing ID
              </span>
              <span className="text-xs font-mono text-gray-400 font-medium">
                KINETIC-OP-2024-QX
              </span>
            </div>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-300 hover:text-white transition-colors group">
              View Full Agenda
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Global Bottom Navigation Action ── */}
      <div className="w-full text-center mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00e5ff] hover:text-[#00b2c4] transition-colors duration-150 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
