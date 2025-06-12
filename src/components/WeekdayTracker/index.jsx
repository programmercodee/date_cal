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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [currentTopQuote, setCurrentTopQuote] = useState(0);
  const [isTopQuoteVisible, setIsTopQuoteVisible] = useState(true);

  const programmerQuotes = [
    {
      text: "Code is like humor. When you have to explain it, it's bad.",
      emoji: "😅"
    },
    {
      text: "First, solve the problem. Then, write the code.",
      emoji: "💡"
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      emoji: "👨‍💻"
    },
    {
      text: "The best way to predict the future is to implement it yourself.",
      emoji: "🚀"
    },
    {
      text: "Talk is cheap. Show me the code.",
      emoji: "💻"
    },
    {
      text: "Programming isn't about what you know; it's about what you can figure out.",
      emoji: "🔍"
    },
    {
      text: "The only way to learn a new programming language is by writing programs in it.",
      emoji: "📚"
    },
    {
      text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
      emoji: "😴"
    },
    {
      text: "It's not a bug – it's an undocumented feature.",
      emoji: "🐛"
    },
    {
      text: "The most damaging phrase in the language is 'We've always done it this way.'",
      emoji: "⚡"
    },
    {
      text: "Good code is like a good joke: it needs no explanation.",
      emoji: "😄"
    },
    {
      text: "The best code is the code you don't have to write.",
      emoji: "🎯"
    },
    {
      text: "Programming is the art of telling another human what one wants the computer to do.",
      emoji: "🎨"
    },
    {
      text: "The only way to do great work is to love what you do.",
      emoji: "❤️"
    },
    {
      text: "Code never lies, comments sometimes do.",
      emoji: "📝"
    },
    {
      text: "The best error message is the one that never shows up.",
      emoji: "✅"
    },
    {
      text: "Programming is thinking, not typing.",
      emoji: "🧠"
    },
    {
      text: "The computer was born to solve problems that did not exist before.",
      emoji: "💭"
    },
    {
      text: "Good programmers write code that humans can understand.",
      emoji: "👥"
    },
    {
      text: "The best way to get a project done faster is to start sooner.",
      emoji: "⏰"
    },
    {
      text: "Code is read much more often than it is written.",
      emoji: "📖"
    },
    {
      text: "The best code is no code at all.",
      emoji: "🎯"
    },
    {
      text: "Programming is the closest thing we have to a superpower.",
      emoji: "🦸‍♂️"
    },
    {
      text: "The best way to learn is to teach.",
      emoji: "👨‍🏫"
    },
    {
      text: "Code is like a joke. If you have to explain it, it's bad.",
      emoji: "😉"
    }
  ];

  const topQuotes = [
    {
      text: "Code with joy, debug with patience",
      emoji: "✨"
    },
    {
      text: "Every day is a coding adventure",
      emoji: "🚀"
    },
    {
      text: "Make it work, make it right, make it fast",
      emoji: "⚡"
    },
    {
      text: "Clean code is happy code",
      emoji: "🎯"
    },
    {
      text: "Code today, smile tomorrow",
      emoji: "😊"
    },
    {
      text: "Debugging is like being a detective",
      emoji: "🔍"
    },
    {
      text: "Keep coding, keep growing",
      emoji: "🌱"
    },
    {
      text: "Small steps, big results",
      emoji: "👣"
    },
    {
      text: "Think twice, code once",
      emoji: "🧠"
    },
    {
      text: "Code is poetry in motion",
      emoji: "📝"
    },
    {
      text: "Every bug is a feature in disguise",
      emoji: "🦋"
    },
    {
      text: "Code smarter, not harder",
      emoji: "💪"
    },
    {
      text: "The best code is the code you don't write",
      emoji: "🎨"
    },
    {
      text: "Debugging is an art form",
      emoji: "🎭"
    },
    {
      text: "Code with confidence, test with care",
      emoji: "🛡️"
    },
    {
      text: "Innovation starts with a single line of code",
      emoji: "💫"
    },
    {
      text: "Code is the language of possibilities",
      emoji: "🌐"
    },
    {
      text: "Every function tells a story",
      emoji: "📚"
    },
    {
      text: "Code with purpose, build with passion",
      emoji: "🎯"
    },
    {
      text: "The best code comes from happy developers",
      emoji: "😊"
    },
    {
      text: "Debug with patience, code with love",
      emoji: "❤️"
    },
    {
      text: "Every commit is a step forward",
      emoji: "👣"
    },
    {
      text: "Code is the bridge between ideas and reality",
      emoji: "🌉"
    },
    {
      text: "Programming is a journey, not a destination",
      emoji: "🗺️"
    },
    {
      text: "The best code is written with a smile",
      emoji: "😄"
    },
    {
      text: "Code is the art of creating possibilities",
      emoji: "🎨"
    },
    {
      text: "Every line of code is a chance to make a difference",
      emoji: "✨"
    },
    {
      text: "Code with clarity, build with confidence",
      emoji: "🔮"
    },
    {
      text: "The best code is like a good story - it flows naturally",
      emoji: "📖"
    },
    {
      text: "Programming is the art of turning coffee into code",
      emoji: "☕"
    }
  ];

  // Rotate quotes every 4 seconds with fade effect
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setIsQuoteVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % programmerQuotes.length);
        setIsQuoteVisible(true);
      }, 500); // Half second for fade out
    }, 4000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Rotate top quotes every 4 seconds
  useEffect(() => {
    const topQuoteInterval = setInterval(() => {
      setIsTopQuoteVisible(false);
      setTimeout(() => {
        setCurrentTopQuote((prev) => (prev + 1) % topQuotes.length);
        setIsTopQuoteVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(topQuoteInterval);
  }, []);

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getDaysUntilLabel = (date) => {
    const today = startOfToday();
    const targetDate = startOfDay(date);
    const daysUntil = differenceInDays(targetDate, today);

    // More natural language labels
    if (daysUntil < 0) return { text: "It's Today!", color: "bg-green-100 text-green-700" };
    if (daysUntil === 0) return { text: "It's Today!", color: "bg-green-100 text-green-700" };
    if (daysUntil === 1) return { text: "Coming Tomorrow", color: "bg-blue-100 text-blue-700" };
    if (daysUntil === 2) return { text: "Day After Tomorrow", color: "bg-purple-100 text-purple-700" };
    if (daysUntil <= 3) return { text: `Just ${daysUntil} days away`, color: "bg-purple-100 text-purple-700" };
    if (daysUntil <= 7) return { text: `Next week (${daysUntil} days)`, color: "bg-orange-100 text-orange-700" };
    if (daysUntil <= 14) return { text: `In ${daysUntil} days (Next week)`, color: "bg-orange-100 text-orange-700" };
    return { text: `${format(date, "MMM d")} (${daysUntil} days)`, color: "bg-slate-100 text-slate-700" };
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col">
      {/* Sticky Top Quote Section */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-2 border-b border-blue-100 shadow-sm transition-shadow duration-300"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-12 flex items-center justify-center">
              <div className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-500
                ${isTopQuoteVisible ? 'opacity-100' : 'opacity-0'}
              `}>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-xl animate-bounce-subtle">
                    {topQuotes[currentTopQuote].emoji}
                  </span>
                  <p className="text-sm sm:text-base font-medium">
                    {topQuotes[currentTopQuote].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add scroll event listener for shadow effect */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', function() {
            const quoteBar = document.querySelector('.sticky');
            if (window.scrollY > 0) {
              quoteBar.classList.add('shadow-md');
            } else {
              quoteBar.classList.remove('shadow-md');
            }
          });
        `
      }} />

      <div className="flex-grow">
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
                <span className="font-medium text-slate-600">When is it?</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">It's Today!</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Coming Tomorrow</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Within 3 days</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Next week</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Later this month</span>
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
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Quote Section with fixed height */}
            <div className="text-center mb-8">
              <div className="relative h-24 sm:h-20 flex items-center justify-center">
                <div className={`
                  absolute inset-0 flex items-center justify-center
                  transition-opacity duration-500
                  ${isQuoteVisible ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="relative px-8">
                    <span className="text-4xl text-blue-400/30 absolute -left-4 -top-4">"</span>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl sm:text-4xl animate-bounce-subtle">
                        {programmerQuotes[currentQuote].emoji}
                      </span>
                      <p className="text-lg sm:text-xl text-slate-200 italic">
                        {programmerQuotes[currentQuote].text}
                      </p>
                    </div>
                    <span className="text-4xl text-blue-400/30 absolute -right-4 -bottom-4">"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Credits */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-lg font-bold">BV</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Brijesh Vishwakarma</h3>
                  <p className="text-slate-400 text-sm">Full Stack Developer</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-slate-500 text-sm mt-6">
              © {new Date().getFullYear()} Weekday Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6 p-3 rounded-full shadow-lg
          bg-gradient-to-br from-blue-500 to-purple-500
          text-white transform transition-all duration-300
          hover:scale-110 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

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

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        button:hover svg {
          animation: float 1s ease-in-out infinite;
        }

        .quote-transition {
          transition: opacity 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
