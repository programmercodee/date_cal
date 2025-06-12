import { useState, useEffect } from "react";
import { eachDayOfInterval, isWeekend, format, getMonth, getYear, isToday, isSaturday, isSunday, addDays, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes, startOfDay, isAfter, isSameDay, startOfToday } from "date-fns";

// Add AnimatedBackground component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
        </div>
      </div>
    </div>
  );
};

const AnimatedClock = ({ size = 16 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5); // 30 degrees per hour, 0.5 degrees per minute
  const minuteDegrees = minutes * 6; // 6 degrees per minute
  const secondDegrees = seconds * 6; // 6 degrees per second

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="text-blue-500"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Clock face */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-20"
      />
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="12"
          y1="2"
          x2="12"
          y2="3"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-40"
          style={{
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: '12px 12px'
          }}
        />
      ))}
      {/* Hour hand */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transform: `rotate(${hourDegrees}deg)`,
          transformOrigin: '12px 12px'
        }}
      />
      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          transform: `rotate(${minuteDegrees}deg)`,
          transformOrigin: '12px 12px'
        }}
      />
      {/* Second hand */}
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        className="text-blue-600"
        style={{
          transform: `rotate(${secondDegrees}deg)`,
          transformOrigin: '12px 12px'
        }}
      />
      {/* Center dot */}
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
};

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
  const [activeWeek, setActiveWeek] = useState(0);

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

    if (daysUntil < 0) return { text: "Past", color: "bg-slate-100 text-slate-500" };
    if (daysUntil === 0) return { text: "Today", color: "bg-blue-100 text-blue-600" };
    if (daysUntil === 1) return { text: "Tomorrow", color: "bg-green-100 text-green-600" };
    if (daysUntil <= 3) return { text: `In ${daysUntil} days`, color: "bg-purple-100 text-purple-600" };
    if (daysUntil <= 7) return { text: `Next week (${daysUntil}d)`, color: "bg-orange-100 text-orange-600" };
    if (daysUntil <= 14) return { text: `In ${daysUntil} days`, color: "bg-amber-100 text-amber-600" };
    return { text: `${format(date, "MMM d")} (${daysUntil}d)`, color: "bg-slate-100 text-slate-600" };
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

  // Add this function to group dates by weeks
  const getWeeksFromDates = (dates) => {
    const weeks = [];
    let currentWeek = [];

    dates.forEach((date, index) => {
      currentWeek.push(date);
      if (currentWeek.length === 7 || index === dates.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeks;
  };

  // Update the getCurrentDayProgress function to be more precise
  const getCurrentDayProgress = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const totalMilliseconds = endOfDay - startOfDay;
    const elapsedMilliseconds = now - startOfDay;
    return (elapsedMilliseconds / totalMilliseconds) * 100;
  };

  // Add useEffect to force smooth updates
  useEffect(() => {
    const updateProgress = () => {
      // Force a re-render every second for smooth animation
      setCurrentTime(new Date());
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add these new functions after the existing state declarations
  const getTimeUntil = (targetDate) => {
    const now = new Date();
    const diff = differenceInSeconds(targetDate, now);

    if (diff <= 0) return null;

    const days = Math.floor(diff / (24 * 60 * 60));
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = diff % 60;

    return { days, hours, minutes, seconds };
  };

  const getSectionCountdown = (date) => {
    const now = new Date();
    const targetDate = startOfDay(date);
    const diff = differenceInSeconds(targetDate, now);

    if (diff <= 0) return null;

    if (diff < 24 * 60 * 60) {
      // Less than a day
      const hours = Math.floor(diff / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      return `${hours}h ${minutes}m`;
    } else if (diff < 7 * 24 * 60 * 60) {
      // Less than a week
      const days = Math.floor(diff / (24 * 60 * 60));
      return `${days}d left`;
    } else {
      // More than a week
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60));
      const days = Math.floor((diff % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
      return `${weeks}w ${days}d`;
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="min-h-screen bg-transparent flex flex-col">
          {/* Sticky Top Quote Section - Enhanced with better gradient and glow */}
          <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 py-3 border-b border-blue-200/50 shadow-sm transition-all duration-300"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative h-14 flex items-center justify-center">
                  <div className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-500
                    ${isTopQuoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  `}>
                    <div className="flex items-center gap-3 text-slate-700 bg-white/50 px-6 py-2 rounded-full shadow-sm">
                      <span className="text-2xl animate-bounce-subtle">
                        {topQuotes[currentTopQuote].emoji}
                      </span>
                      <p className="text-base sm:text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                {/* Header Section with Clock - Enhanced with better gradient and glow */}
                <div className="bg-gradient-to-br from-white/95 to-blue-50/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
                        <span className="text-3xl sm:text-4xl animate-bounce-subtle bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg ring-2 ring-blue-100">📅</span>
                        <div>
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                            Your Weekday Calendar
                          </h1>
                          <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl shadow-sm border border-blue-100/50 inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <p className="text-slate-700 font-semibold text-lg sm:text-xl flex items-center gap-2">
                              <span className="text-blue-500 animate-pulse-subtle">●</span>
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {format(currentTime, "MMMM yyyy")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <div className="bg-gradient-to-br from-slate-100 to-blue-50 px-6 py-4 rounded-xl shadow-md border border-blue-100/50 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col items-center sm:items-end gap-1">
                          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <AnimatedClock size={16} />
                              Current Time
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl sm:text-2xl font-mono font-semibold text-slate-700 animate-pulse-subtle">
                              {format(currentTime, "hh:mm:ss")}
                            </span>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              {format(currentTime, "a")}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {format(currentTime, "EEEE, MMMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Dynamic Working Hours Section */}
                <div className="bg-gradient-to-br from-white/95 to-emerald-50/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-emerald-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-3xl sm:text-4xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg ring-2 ring-emerald-100 animate-bounce-subtle">⏰</span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          Working Hours Status
                        </h2>
                        <p className="text-slate-600 mt-1 text-sm sm:text-base">
                          {format(currentTime, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Status Display */}
                    <div className="w-full sm:w-auto">
                      {(() => {
                        const currentDay = currentTime.getDay();
                        const currentHour = currentTime.getHours();
                        const currentMinute = currentTime.getMinutes();
                        const isWeekend = currentDay === 0 || currentDay === 6;
                        const isWorkingDay = currentDay >= 1 && currentDay <= 5;
                        const isWorkingHours = currentHour >= 10 && (currentHour < 18 || (currentHour === 18 && currentMinute <= 30));

                        // Calculate time until next work period
                        const getTimeUntilNextWork = () => {
                          const now = new Date();
                          let nextWorkTime = new Date(now);

                          if (isWeekend) {
                            // If weekend, calculate time until Monday 10 AM
                            const daysUntilMonday = (8 - currentDay) % 7;
                            nextWorkTime.setDate(now.getDate() + daysUntilMonday);
                            nextWorkTime.setHours(10, 0, 0, 0);
                          } else if (!isWorkingHours) {
                            // If after work hours, calculate time until next day 10 AM
                            if (currentHour >= 18 || (currentHour === 18 && currentMinute > 30)) {
                              nextWorkTime.setDate(now.getDate() + 1);
                              nextWorkTime.setHours(10, 0, 0, 0);
                            } else {
                              // Before work hours
                              nextWorkTime.setHours(10, 0, 0, 0);
                            }
                          }

                          const diff = differenceInSeconds(nextWorkTime, now);
                          const days = Math.floor(diff / (24 * 60 * 60));
                          const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
                          const minutes = Math.floor((diff % (60 * 60)) / 60);
                          const seconds = diff % 60;

                          return { days, hours, minutes, seconds };
                        };

                        // Calculate remaining work time
                        const getRemainingWorkTime = () => {
                          const now = new Date();
                          const endTime = new Date(now);
                          endTime.setHours(18, 30, 0, 0);

                          const diff = differenceInSeconds(endTime, now);
                          const hours = Math.floor(diff / (60 * 60));
                          const minutes = Math.floor((diff % (60 * 60)) / 60);
                          const seconds = diff % 60;

                          return { hours, minutes, seconds };
                        };

                        if (isWeekend) {
                          const timeUntil = getTimeUntilNextWork();
                          return (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">🏖️</span>
                                <div className="text-red-600 font-semibold">Weekend Holiday</div>
                              </div>
                              <div className="text-slate-600 text-sm mb-2">Next work day starts in:</div>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  { value: timeUntil.days, label: 'Days', color: 'from-red-500 to-red-600' },
                                  { value: timeUntil.hours, label: 'Hours', color: 'from-pink-500 to-pink-600' },
                                  { value: timeUntil.minutes, label: 'Mins', color: 'from-rose-500 to-rose-600' },
                                  { value: timeUntil.seconds, label: 'Secs', color: 'from-orange-500 to-orange-600' }
                                ].map((item, index) => (
                                  <div key={index} className="bg-white/80 rounded-lg p-2 text-center">
                                    <div className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                      {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-slate-500">{item.label}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        if (isWorkingHours) {
                          const remaining = getRemainingWorkTime();
                          return (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">💼</span>
                                <div className="text-emerald-600 font-semibold">Working Hours</div>
                              </div>
                              <div className="text-slate-600 text-sm mb-2">Time remaining today:</div>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: remaining.hours, label: 'Hours', color: 'from-emerald-500 to-emerald-600' },
                                  { value: remaining.minutes, label: 'Mins', color: 'from-teal-500 to-teal-600' },
                                  { value: remaining.seconds, label: 'Secs', color: 'from-cyan-500 to-cyan-600' }
                                ].map((item, index) => (
                                  <div key={index} className="bg-white/80 rounded-lg p-2 text-center">
                                    <div className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                      {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-slate-500">{item.label}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // Before or after work hours on weekdays
                        const timeUntil = getTimeUntilNextWork();
                        return (
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">🌙</span>
                              <div className="text-amber-600 font-semibold">
                                {currentHour < 10 ? 'Before Work Hours' : 'After Work Hours'}
                              </div>
                            </div>
                            <div className="text-slate-600 text-sm mb-2">Next work period starts in:</div>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { value: timeUntil.days, label: 'Days', color: 'from-amber-500 to-amber-600' },
                                { value: timeUntil.hours, label: 'Hours', color: 'from-orange-500 to-orange-600' },
                                { value: timeUntil.minutes, label: 'Mins', color: 'from-yellow-500 to-yellow-600' },
                                { value: timeUntil.seconds, label: 'Secs', color: 'from-red-500 to-red-600' }
                              ].map((item, index) => (
                                <div key={index} className="bg-white/80 rounded-lg p-2 text-center">
                                  <div className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                    {String(item.value).padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-slate-500">{item.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>




                {/* Next Saturday Countdown Section - Enhanced with better gradient and glow */}
                <div className="bg-gradient-to-br from-white/95 to-purple-50/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-3xl sm:text-4xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg ring-2 ring-purple-100 animate-bounce-subtle">⏰</span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Time Until Weekend
                        </h2>
                        <p className="text-slate-600 mt-1 text-sm sm:text-base">
                          Next Saturday: {format(addDays(currentTime, (6 - currentTime.getDay() + 7) % 7), "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full sm:w-auto">
                      {[
                        { value: timeToNextSaturday.days, label: "Days" },
                        { value: timeToNextSaturday.hours, label: "Hours" },
                        { value: timeToNextSaturday.minutes, label: "Minutes" },
                        { value: timeToNextSaturday.seconds, label: "Seconds" }
                      ].map((item, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md border border-purple-100/50">
                          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-subtle">
                            {String(item.value).padStart(2, '0')}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Remaining Weekends Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <span className="text-3xl sm:text-4xl bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg ring-2 ring-orange-100 animate-bounce-subtle">🌅</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                      Upcoming Weekends This Month
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
                          const timeUntil = getTimeUntil(date);
                          const sectionCountdown = getSectionCountdown(date);

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
                          const timeUntil = getTimeUntil(date);
                          const sectionCountdown = getSectionCountdown(date);

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
                    <span className="font-medium text-slate-600">Time Until:</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Today</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Tomorrow</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Within 3 days</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Next week</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Later this month</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid - Enhanced with better gradients and hover effects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {[
                    {
                      icon: "📅",
                      value: totalWeekdays,
                      title: "Working Days This Month",
                      description: `Total number of weekdays in ${format(currentTime, "MMMM")}`,
                      gradient: "from-blue-500 to-blue-600",
                      textGradient: "from-blue-600 to-blue-700",
                      delay: "0.1s"
                    },
                    {
                      icon: "✅",
                      value: weekdaysTillToday,
                      title: "Days Completed",
                      description: "Working days that have passed",
                      gradient: "from-emerald-500 to-emerald-600",
                      textGradient: "from-emerald-600 to-emerald-700",
                      delay: "0.2s"
                    },
                    {
                      icon: "⏳",
                      value: remainingWeekdays,
                      title: "Days Left",
                      description: "Working days remaining this month",
                      gradient: "from-indigo-500 to-indigo-600",
                      textGradient: "from-indigo-600 to-indigo-700",
                      delay: "0.3s"
                    }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-br from-white/95 to-${stat.gradient.split('-')[1]}-50/50 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up group border border-${stat.gradient.split('-')[1]}-100/50`}
                      style={{ animationDelay: stat.delay }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className={`text-3xl sm:text-4xl bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg ring-2 ring-${stat.gradient.split('-')[1]}-100 animate-bounce-subtle`}>
                            {stat.icon}
                          </span>
                          <span className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent`}>
                            {stat.value}
                          </span>
                        </div>
                      </div>
                      <h3 className={`text-lg sm:text-xl font-medium bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent group-hover:scale-105 transition-all`}>
                        {stat.title}
                      </h3>
                      <p className="text-slate-500 mt-2 text-sm">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Calendar Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                  {/* Header - Fixed */}
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg shadow-sm">📆</span>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                          Monthly Calendar View
                        </h2>
                      </div>

                      {/* Scrollable Labels Container */}
                      <div className="w-full sm:w-auto overflow-x-auto pb-2 -mb-2 sm:pb-0 sm:mb-0">
                        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-max px-1">
                          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-slate-700">Today</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-slate-700">Tomorrow</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            <span className="text-slate-700">This Week</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-slate-700">Weekend</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            <span className="text-slate-700">Past Days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid - Scrollable */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                      {allDates.map((day, idx) => {
                        const isWeekendDay = isSaturday(day) || isSunday(day);
                        const isCurrentDay = isToday(day);
                        const isPastDay = isAfter(startOfToday(), day);
                        const daysUntil = getDaysUntilLabel(day);
                        const timeUntil = getTimeUntil(day);
                        const sectionCountdown = getSectionCountdown(day);

                        return (
                          <div
                            key={idx}
                            className={`
                              p-3 rounded-lg relative group
                              ${isWeekendDay
                                ? isPastDay
                                  ? 'bg-red-100/50'
                                  : 'bg-red-50 hover:bg-red-100/50'
                                : isPastDay
                                  ? 'bg-slate-100/50'
                                  : 'bg-slate-50 hover:bg-slate-100/50'
                              }
                              ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                              ${isPastDay ? 'opacity-75' : ''}
                              transition-all duration-200
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-grow">
                                <div className={`
                                  font-medium
                                  ${isWeekendDay ? 'text-red-600' : 'text-slate-700'}
                                  ${isCurrentDay ? 'text-blue-600' : ''}
                                  ${isPastDay ? 'line-through' : ''}
                                `}>
                                  {format(day, "EEEE")}
                                </div>
                                <div className={`
                                  text-sm
                                  ${isPastDay ? 'text-slate-400' : 'text-slate-500'}
                                `}>
                                  {format(day, "MMM d")}
                                </div>

                                {/* Countdown Section */}
                                {!isPastDay && !isCurrentDay && timeUntil && (
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                      <span className="animate-pulse">⏳</span>
                                      <span>{sectionCountdown}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                      {[
                                        { value: timeUntil.days, label: 'D', color: 'from-blue-500 to-blue-600' },
                                        { value: timeUntil.hours, label: 'H', color: 'from-purple-500 to-purple-600' },
                                        { value: timeUntil.minutes, label: 'M', color: 'from-pink-500 to-pink-600' },
                                        { value: timeUntil.seconds, label: 'S', color: 'from-orange-500 to-orange-600' }
                                      ].map((item, index) => (
                                        <div key={index} className="relative">
                                          <div className={`
                                            text-[10px] font-medium text-center
                                            bg-gradient-to-br ${item.color} bg-clip-text text-transparent
                                          `}>
                                            {String(item.value).padStart(2, '0')}
                                          </div>
                                          <div className="text-[8px] text-center text-slate-500">
                                            {item.label}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {isCurrentDay && (
                                  <div className="mt-2">
                                    <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-1">
                                      <span className="animate-pulse">●</span>
                                      <span>{format(currentTime, "hh:mm:ss a")}</span>
                                    </div>
                                    <div className="relative w-full h-4 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                                      {/* Wave animation container */}
                                      <div
                                        className="absolute inset-0 transition-all duration-1000 ease-linear"
                                        style={{
                                          width: `${getCurrentDayProgress()}%`,
                                          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                                        }}
                                      >
                                        {/* Wave effect */}
                                        <div className="absolute inset-0 overflow-hidden">
                                          <div className="absolute inset-0 wave-animation" style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                            transform: 'translateX(-100%)',
                                            animation: 'wave 2s linear infinite'
                                          }}></div>
                                          <div className="absolute inset-0 wave-animation" style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            transform: 'translateX(-100%)',
                                            animation: 'wave 3s linear infinite 0.5s'
                                          }}></div>
                                        </div>
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 shine-animation"></div>
                                      </div>
                                      {/* Time markers */}
                                      <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                                        <div className="h-full w-px bg-blue-100"></div>
                                        <div className="h-full w-px bg-blue-100"></div>
                                        <div className="h-full w-px bg-blue-100"></div>
                                      </div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 px-0.5">
                                      <span>12 AM</span>
                                      <span>12 PM</span>
                                      <span>12 AM</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Status Labels */}
                              <div className="flex flex-col items-end gap-1 ml-2">
                                <div className="flex flex-col items-end gap-1">
                                  {isCurrentDay ? (
                                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded text-xs font-medium text-blue-600">
                                      Today
                                    </div>
                                  ) : (
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${daysUntil.color}`}>
                                      {daysUntil.text}
                                    </div>
                                  )}
                                  {isWeekendDay && !isPastDay && (
                                    <div className="flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded text-xs font-medium text-red-600">
                                      Weekend
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Hover effect for future days */}
                            {!isPastDay && !isCurrentDay && (
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                              </div>
                            )}

                            {isPastDay && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30 rounded-lg"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
                      <div className="relative px-8 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border border-slate-700/50">
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-lg sm:text-xl text-slate-200 italic">
                            {programmerQuotes[currentQuote].text}
                          </p>
                        </div>
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

                  <div className="flex items-center gap-4">
                    {/* Download Resume Button */}
                    <a
                      href="/resume.pdf"
                      download="Brijesh_Vishwakarma_Resume.pdf"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Download Resume</span>
                      <span className="sm:hidden">Resume</span>
                    </a>

                    {/* Social Links */}
                    <div className="flex items-center gap-4 text-slate-400">
                      <a
                        href="https://github.com/programmercodee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/brijesh-vishwakarma-813128276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
                </div>

                {/* Copyright */}
                <div className="text-center text-slate-500 text-sm mt-6">
                  © {new Date().getFullYear()} Your Weekday Calendar. Made with ❤️ for better time management.
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

            .custom-scrollbar {
              -webkit-overflow-scrolling: touch;
            }

            @media (max-width: 640px) {
              .custom-scrollbar {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
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

            @keyframes progressPulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }

            .progress-bar {
              animation: progressPulse 2s infinite;
            }

            @keyframes wave {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }

            @keyframes shine {
              0% {
                background-position: -100% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }

            .wave-animation {
              will-change: transform;
            }

            .shine-animation {
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
              );
              background-size: 200% 100%;
              animation: shine 3s linear infinite;
              will-change: background-position;
            }

            /* Add a subtle pulse to the progress bar container */
            .progress-container {
              animation: containerPulse 2s ease-in-out infinite;
            }

            @keyframes containerPulse {
              0%, 100% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.1);
              }
              50% {
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
              }
            }

            /* Custom scrollbar for the labels container */
            .overflow-x-auto {
              scrollbar-width: thin;
              scrollbar-color: rgba(203, 213, 225, 0.5) transparent;
            }

            .overflow-x-auto::-webkit-scrollbar {
              height: 4px;
            }

            .overflow-x-auto::-webkit-scrollbar-track {
              background: transparent;
            }

            .overflow-x-auto::-webkit-scrollbar-thumb {
              background-color: rgba(203, 213, 225, 0.5);
              border-radius: 20px;
            }

            .overflow-x-auto::-webkit-scrollbar-thumb:hover {
              background-color: rgba(203, 213, 225, 0.7);
            }

            /* Add a subtle gradient fade on the sides */
            .overflow-x-auto::after {
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: linear-gradient(to right, transparent, white);
              pointer-events: none;
            }

            .overflow-x-auto::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: linear-gradient(to left, transparent, white);
              pointer-events: none;
            }

            /* Ensure smooth scrolling on mobile */
            @media (max-width: 640px) {
              .overflow-x-auto {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
                overscroll-behavior-x: contain;
              }
            }

            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }

            .animate-blob {
              animation: blob 7s infinite;
            }

            .animation-delay-2000 {
              animation-delay: 2s;
            }

            .animation-delay-4000 {
              animation-delay: 4s;
            }

            .animation-delay-6000 {
              animation-delay: 6s;
            }

            /* Add backdrop blur to cards for better readability */
            .bg-white\/90, .bg-gradient-to-br {
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
            }

            /* Enhance card shadows for better depth */
            .shadow-lg {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05);
            }

            .hover\:shadow-xl:hover {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
