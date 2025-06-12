import { useState, useEffect } from "react";
import { eachDayOfInterval, isWeekend, format, getMonth, getYear, isToday, isSaturday, isSunday, addDays, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes, startOfDay, isAfter, isSameDay, startOfToday } from "date-fns";

export default function WeekdayTracker() {
  const [weekdayDates, setWeekdayDates] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [totalWeekdays, setTotalWeekdays] = useState(0);
  const [weekdaysTillToday, setWeekdaysTillToday] = useState(0);
  const [remainingWeekdays, setRemainingWeekdays] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [timeToNextSaturday, setTimeToNextSaturday] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [remainingWeekends, setRemainingWeekends] = useState({
    saturdays: [],
    sundays: []
  });

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getDaysUntilLabel = (date) => {
    const today = startOfToday();
    const targetDate = startOfDay(date);
    const daysUntil = differenceInDays(targetDate, today);

    // Ensure we're not showing negative days
    if (daysUntil < 0) return { text: "Today", color: "bg-green-100 text-green-700" };
    if (daysUntil === 0) return { text: "Today", color: "bg-green-100 text-green-700" };
    if (daysUntil === 1) return { text: "Tomorrow", color: "bg-blue-100 text-blue-700" };
    if (daysUntil <= 3) return { text: `In ${daysUntil} days`, color: "bg-purple-100 text-purple-700" };
    if (daysUntil <= 7) return { text: `In ${daysUntil} days`, color: "bg-orange-100 text-orange-700" };
    return { text: `In ${daysUntil} days`, color: "bg-slate-100 text-slate-700" };
  };

  // Calculate dates for the month
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(getYear(today), getMonth(today), 1);
    const endOfMonth = new Date(getYear(today), getMonth(today) + 1, 0);

    const allDays = eachDayOfInterval({ start: startOfMonth, end: endOfMonth });
    const weekdays = allDays.filter((day) => !isWeekend(day));
    const passedWeekdays = weekdays.filter((day) => day <= today);

    // Calculate remaining weekends with proper date comparison
    const remainingSaturdays = allDays.filter(day =>
      isSaturday(day) && (isAfter(startOfDay(day), startOfToday()) || isSameDay(day, today))
    );
    const remainingSundays = allDays.filter(day =>
      isSunday(day) && (isAfter(startOfDay(day), startOfToday()) || isSameDay(day, today))
    );

    setAllDates(allDays);
    setWeekdayDates(weekdays);
    setTotalWeekdays(weekdays.length);
    setWeekdaysTillToday(passedWeekdays.length);
    setRemainingWeekdays(weekdays.length - passedWeekdays.length);
    setRemainingWeekends({
      saturdays: remainingSaturdays,
      sundays: remainingSundays
    });
  }, [currentTime]);

  // Update time and countdown every second
  useEffect(() => {
    const updateTimeAndCountdown = () => {
      const now = new Date();
      setCurrentTime(now);

      // Calculate next Saturday with proper date handling
      let nextSat = new Date(now);
      const currentDay = now.getDay();

      if (currentDay === 6) {
        // If today is Saturday, get next Saturday
        nextSat = startOfDay(addDays(now, 7));
      } else {
        // Calculate days until next Saturday (0-6)
        const daysUntilSaturday = (6 - currentDay + 7) % 7;
        nextSat = startOfDay(addDays(now, daysUntilSaturday));
      }

      // Calculate time difference using startOfDay for accurate day counting
      const totalSeconds = Math.max(0, differenceInSeconds(nextSat, now));
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeToNextSaturday({
        days,
        hours,
        minutes,
        seconds
      });
    };

    // Initial update
    updateTimeAndCountdown();

    // Update every second
    const timer = setInterval(updateTimeAndCountdown, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto transform transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          {/* Header Section with Clock */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
                  <span className="text-3xl sm:text-4xl animate-bounce-subtle bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl shadow-md">📊</span>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in">
                      Weekday Tracker
                    </h1>
                    <p className="text-slate-600 mt-2 flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg">
                      <span className="text-xl sm:text-2xl animate-spin-slow">📅</span>
                      {format(currentTime, "MMMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto bg-gradient-to-br from-slate-100 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl animate-pulse">⏰</span>
                <span className="text-xl sm:text-2xl font-mono text-slate-700 animate-pulse-subtle">
                  {format(currentTime, "hh:mm:ss a")}
                </span>
              </div>
            </div>
          </div>

          {/* Next Saturday Countdown Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl shadow-md animate-bounce-subtle">🎉</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Next Weekend Countdown
                  </h2>
                  <p className="text-slate-600 mt-1 text-sm sm:text-base">
                    {format(addDays(currentTime, (6 - currentTime.getDay() + 7) % 7), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 animate-pulse-subtle">
                    {String(timeToNextSaturday.days).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Days</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 animate-pulse-subtle">
                    {String(timeToNextSaturday.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Hours</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 animate-pulse-subtle">
                    {String(timeToNextSaturday.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Minutes</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 animate-pulse-subtle">
                    {String(timeToNextSaturday.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Weekends Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <span className="text-3xl sm:text-4xl bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-xl shadow-md animate-bounce-subtle">🌅</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Remaining Weekends This Month
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Saturdays */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl">🌞</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-orange-800">
                    Saturdays ({remainingWeekends.saturdays.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {remainingWeekends.saturdays.map((date, idx) => {
                    const daysUntil = getDaysUntilLabel(date);
                    return (
                      <div
                        key={idx}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          ${isToday(date) ? 'bg-orange-100' : 'bg-white/80'}
                          transform transition-all duration-300 hover:scale-[1.02]
                          relative overflow-hidden
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">🌞</span>
                          <div>
                            <div className="font-medium text-slate-700">
                              {format(date, "EEEE")}
                            </div>
                            <div className="text-sm text-slate-500">
                              {format(date, "MMMM d")}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`${daysUntil.color} text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap`}>
                            {daysUntil.text}
                          </span>
                          {isToday(date) && (
                            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sundays */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl">🌙</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800">
                    Sundays ({remainingWeekends.sundays.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {remainingWeekends.sundays.map((date, idx) => {
                    const daysUntil = getDaysUntilLabel(date);
                    return (
                      <div
                        key={idx}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          ${isToday(date) ? 'bg-blue-100' : 'bg-white/80'}
                          transform transition-all duration-300 hover:scale-[1.02]
                          relative overflow-hidden
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">🌙</span>
                          <div>
                            <div className="font-medium text-slate-700">
                              {format(date, "EEEE")}
                            </div>
                            <div className="text-sm text-slate-500">
                              {format(date, "MMMM d")}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`${daysUntil.color} text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap`}>
                            {daysUntil.text}
                          </span>
                          {isToday(date) && (
                            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend for countdown labels */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium text-slate-600">Time indicators:</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Today</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Tomorrow</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Within 3 days</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Within a week</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">More than a week</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-md animate-bounce-subtle">✅</span>
                  <span className="text-3xl sm:text-4xl font-bold text-slate-800">{totalWeekdays}</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📋</span>
                Total Weekdays
              </h3>
              <p className="text-slate-500 mt-2 text-sm flex items-center gap-2">
                <span className="animate-pulse-subtle">📈</span>
                Total working days this month
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl shadow-md animate-bounce-subtle">📅</span>
                  <span className="text-3xl sm:text-4xl font-bold text-slate-800">{weekdaysTillToday}</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-700 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎯</span>
                Weekdays Till Today
              </h3>
              <p className="text-slate-500 mt-2 text-sm flex items-center gap-2">
                <span className="animate-pulse-subtle">📊</span>
                Days completed so far
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up group sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-xl shadow-md animate-bounce-subtle">⏳</span>
                  <span className="text-3xl sm:text-4xl font-bold text-slate-800">{remainingWeekdays}</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-700 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎪</span>
                Remaining Weekdays
              </h3>
              <p className="text-slate-500 mt-2 text-sm flex items-center gap-2">
                <span className="animate-pulse-subtle">📉</span>
                Days left this month
              </p>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl shadow-md animate-bounce-subtle">📆</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Weekday Details
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500"></span>
                  <span className="text-slate-600 font-medium">Today</span>
                </div>
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-400"></span>
                  <span className="text-slate-600 font-medium">Weekend</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 sm:pr-4">
              {allDates.map((day, idx) => {
                const isWeekendDay = isSaturday(day) || isSunday(day);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={idx}
                    className={`
                      p-3 sm:p-4 rounded-xl shadow-sm transform transition-all duration-300
                      ${isWeekendDay ? 'bg-red-50/80 hover:bg-red-100/80' : 'bg-slate-50/80 hover:bg-slate-100/80'}
                      ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50/80' : ''}
                      hover:shadow-md hover:-translate-y-0.5
                      animate-slide-in group backdrop-blur-sm
                    `}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className={`
                          text-xl sm:text-2xl p-2 rounded-lg shadow-sm flex-shrink-0
                          ${isWeekendDay ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}
                          ${isCurrentDay ? 'bg-blue-100 text-blue-500' : ''}
                          animate-pulse-subtle
                        `}>
                          {isWeekendDay ? '🌅' : '📌'}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className={`
                            font-medium text-base sm:text-lg truncate
                            ${isWeekendDay ? 'text-red-600' : 'text-slate-600'}
                            ${isCurrentDay ? 'text-blue-600' : ''}
                            group-hover:text-slate-800 transition-colors
                          `}>
                            {format(day, "EEEE")}
                          </span>
                          <span className={`
                            text-sm truncate
                            ${isWeekendDay ? 'text-red-500' : 'text-slate-500'}
                            ${isCurrentDay ? 'text-blue-500' : ''}
                          `}>
                            {format(day, "MMM d")}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {isCurrentDay && (
                          <div className="flex items-center gap-1.5 bg-blue-100 px-2 py-1 rounded-lg">
                            <span className="text-blue-500 animate-pulse text-xs">●</span>
                            <span className="text-xs font-medium text-blue-600">Today</span>
                          </div>
                        )}
                        {isWeekendDay && (
                          <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded-lg">Weekend</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSubtle {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulseSubtle 1s infinite;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 2s infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }

        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
        }
      `}</style>
    </div>
  );
}
