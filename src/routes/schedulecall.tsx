import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const [selectedDate, setSelectedDate] = useState<number>(12);
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Track selected calendar target year and month index dynamically
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(10); // November
  const [currentYear, setCurrentYear] = useState<number>(2024);

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

  const calendarDays = [
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 31, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
  ];

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
    <div className="min-h-screen text-[#f8fafc] font-sans selection:bg-blue-500 selection:text-white">
      <main className="max-w-300 mx-auto px-6 py-12">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors duration-150 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <header className="mb-10">
          <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
            Supersonic Operations
          </span>
          <h1 className="text-4xl font-bold tracking-tight mt-1 text-white">Schedule a Meeting</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Left Column: Details & Calendar Combo Card ── */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-surface border border-gray-800/70 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-800/70 flex flex-col justify-between min-h-115">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Live Consultation
                </span>

                <h2 className="text-2xl font-bold leading-tight mb-4 tracking-tight">
                  Schedule Your Free Consultation
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-normal mb-5">
                  Meet with our experienced team to plan your move, explore the best options for
                  your relocation, and get a personalized solution that fits your needs.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800/50 border border-gray-700/40 rounded-lg text-gray-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                        Duration
                      </p>
                      <p className="text-sm font-medium text-gray-200">30 Minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800/50 border border-gray-700/40 rounded-lg text-gray-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                        Zone
                      </p>
                      <p className="text-sm font-medium text-gray-200">
                        Central European Time (GMT+1)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Profile */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-800/60">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
                  alt="Hillary Nweze"
                  className="w-10 h-10 rounded-full object-cover grayscale border border-gray-700"
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Hillary Nweze</h4>
                  <p className="text-xs text-gray-500">Lead Logistics Architect</p>
                </div>
              </div>
            </div>

            {/* Interactive Calendar Grid */}
            <div className="p-8 bg-surface">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-bold text-gray-200">
                  {monthsList[currentMonthIndex]} {currentYear}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800/60 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800/60 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
                {daysOfWeek.map((day) => (
                  <span key={day} className="text-[10px] font-bold tracking-wider text-gray-500">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {calendarDays.map((item, index) => {
                  const isSelected = item.currentMonth && item.day === selectedDate;
                  return (
                    <button
                      key={index}
                      disabled={!item.currentMonth || isSubmitting}
                      onClick={() => item.currentMonth && setSelectedDate(item.day)}
                      className={`
                        py-2 text-xs font-medium rounded-lg transition-all mx-auto w-8 h-8 flex items-center justify-center
                        ${!item.currentMonth ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                        ${isSelected ? "bg-[#dfb15b] text-[#0b0f19] font-bold hover:bg-[#dfb15b] hover:text-[#0b0f19]" : ""}
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
          <div className="bg-surface border border-gray-800/70 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-115">
            <div>
              <header className="mb-6">
                <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase block">
                  Step 02
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Available Slots</h3>
                <p className="text-xs text-gray-400 mt-1">
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
                        w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-150
                        ${
                          isTimeSelected
                            ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-400"
                            : "bg-transparent border-gray-800 hover:border-gray-700 hover:bg-gray-800/20 text-gray-300"
                        }
                        ${isSubmitting ? "pointer-events-none opacity-50" : ""}
                      `}
                    >
                      <span>{slot}</span>
                      {isTimeSelected ? (
                        <span className="p-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleConfirmBriefing}
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 text-[#0b0f19] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest mt-6 transition-all duration-150 transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#0b0f19]/30 border-t-[#0b0f19] rounded-full animate-spin" />
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
