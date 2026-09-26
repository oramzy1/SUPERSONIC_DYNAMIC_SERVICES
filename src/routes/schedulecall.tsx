import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/schedulecall")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  // Initialize with current date & time
  const today = useMemo(() => new Date(), []);

  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number>(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const timeSlots = ["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM", "04:30 PM"];
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Dynamically compute grid for the calendar with Monday-first week start
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);

    // Get day index relative to Monday (0=Mon, ..., 6=Sun)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonthIndex, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        isWeekend: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const dateObj = new Date(currentYear, currentMonthIndex, d);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

      days.push({
        day: d,
        currentMonth: true,
        isWeekend,
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remainingGridSlots = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingGridSlots; i++) {
      days.push({
        day: i,
        currentMonth: false,
        isWeekend: false,
      });
    }

    return days;
  }, [currentMonthIndex, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleConfirmBriefing = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate({
        to: "/bookingsuccess",
        search: {
          date: selectedDate,
          time: selectedTime,
          month: monthsList[currentMonthIndex],
          year: currentYear,
        },
      });
    }, 1800);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <header className="mb-10">
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
            Supersonic Operations
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight mt-1 text-foreground">
            Schedule a Meeting
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Left Column: Details & Calendar Combo Card ── */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-8 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between min-h-115">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Live Consultation
                </span>

                <h2 className="font-display text-2xl font-bold leading-tight mb-4 tracking-tight text-foreground">
                  Schedule Your Free Consultation
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-5">
                  Meet with our experienced team to plan your move, explore the best options for
                  your relocation, and get a personalized solution that fits your needs.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background border border-border rounded-xl text-muted-foreground">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        Duration
                      </p>
                      <p className="text-sm font-semibold text-foreground">30 Minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background border border-border rounded-xl text-muted-foreground">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        Zone
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        Central European Time (GMT+1)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Profile */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
                  alt="Hillary Nweze"
                  className="w-10 h-10 rounded-full object-cover border border-border shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Hillary Nweze</h4>
                  <p className="text-xs text-muted-foreground">Lead Logistics Architect</p>
                </div>
              </div>
            </div>

            {/* Interactive Calendar Grid */}
            <div className="p-8 bg-surface">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-bold text-foreground">
                  {monthsList[currentMonthIndex]} {currentYear}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-all border border-transparent hover:border-border"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-all border border-transparent hover:border-border"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
                {daysOfWeek.map((day) => (
                  <span key={day} className="text-[10px] font-bold tracking-wider text-muted-foreground">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {calendarDays.map((item, index) => {
                  const isSelected =
                    item.currentMonth && item.day === selectedDate && !item.isWeekend;
                  const isDisabled = !item.currentMonth || item.isWeekend || isSubmitting;

                  return (
                    <button
                      key={index}
                      disabled={isDisabled}
                      onClick={() =>
                        item.currentMonth && !item.isWeekend && setSelectedDate(item.day)
                      }
                      title={item.isWeekend ? "Non-working day" : ""}
                      className={`
                        py-2 text-xs font-semibold rounded-lg transition-all mx-auto w-8 h-8 flex items-center justify-center
                        ${!item.currentMonth ? "text-muted-foreground/40 cursor-not-allowed" : ""}
                        ${item.currentMonth && !item.isWeekend ? "text-foreground hover:bg-background" : ""}
                        ${item.isWeekend && item.currentMonth ? "text-muted-foreground/40 bg-background/50 cursor-not-allowed line-through" : ""}
                        ${isSelected ? "bg-primary text-primary-foreground font-bold shadow-md" : ""}
                        ${isSubmitting ? "pointer-events-none opacity-50" : ""}
                      `}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Column: Slots Container ── */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-115">
            <div>
              <header className="mb-6">
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase block">
                  Step 02
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">Available Slots</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {monthsList[currentMonthIndex]} {selectedDate}, {currentYear}
                </p>
              </header>

              <div className="space-y-2.5">
                {timeSlots.map((slot) => {
                  const isTimeSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isSubmitting}
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-150 group
                        ${
                          isTimeSelected
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-sm"
                            : "bg-surface border-border hover:border-primary/30 hover:bg-background text-foreground"
                        }
                        ${isSubmitting ? "pointer-events-none opacity-50" : ""}
                      `}
                    >
                      <span>{slot}</span>
                      {isTimeSelected ? (
                        <span className="p-0.5 bg-emerald-500 rounded-full text-white shadow-sm">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleConfirmBriefing}
              disabled={isSubmitting}
              className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-widest mt-6 transition-all duration-150 shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Briefing"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
