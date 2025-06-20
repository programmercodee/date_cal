import { useState, useEffect } from "react";
import { eachDayOfInterval, isWeekend, format, getMonth, getYear, isToday, isSaturday, isSunday, addDays, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes, startOfDay, isAfter, isSameDay, startOfToday } from "date-fns";
import HijriDate from 'hijri-date';

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

// Add Indian calendar helper function
const getIndianCalendarInfo = (date) => {
  const hijriDate = new HijriDate(date);
  const monthNames = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika',
    'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
  ];

  // Get Indian month and day
  const indianMonth = monthNames[hijriDate.getMonth()];
  const indianDay = hijriDate.getDate();

  // Get day of week in Hindi
  const hindiDays = {
    0: 'रविवार',
    1: 'सोमवार',
    2: 'मंगलवार',
    3: 'बुधवार',
    4: 'गुरुवार',
    5: 'शुक्रवार',
    6: 'शनिवार'
  };

  const hindiDay = hindiDays[date.getDay()];

  return {
    indianDate: `${indianDay} ${indianMonth}`,
    hindiDay: hindiDay
  };
};

// Add Hindu calendar helper function
const getHinduCalendarInfo = (date) => {
  // Hindu month names
  const hinduMonths = [
    'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़',
    'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक',
    'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'
  ];

  // Hindu day names
  const hinduDays = {
    0: 'रविवार',
    1: 'सोमवार',
    2: 'मंगलवार',
    3: 'बुधवार',
    4: 'गुरुवार',
    5: 'शुक्रवार',
    6: 'शनिवार'
  };

  // Get the day of week in Hindi
  const hindiDay = hinduDays[date.getDay()];

  // Calculate approximate Hindu date (this is a simplified version)
  // Note: This is an approximation and may not be 100% accurate
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  // Approximate Hindu month based on Gregorian month
  // This is a simplified mapping and may need adjustment
  const hinduMonthIndex = (month + 2) % 12; // Approximate offset
  const hinduMonth = hinduMonths[hinduMonthIndex];

  // Special days and festivals (simplified list)

  const dateKey = `${day}-${month + 1}`;
  const specialDay = specialDays[dateKey];

  return {
    hinduDate: `${day} ${hinduMonth}`,
    hindiDay: hindiDay,
    specialDay: specialDay
  };
};

// Add helper function for day info
const getDayInfo = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  // Interesting facts and events for each day
  const dayInfo = {
    // Special days
    '1-1': '🎉 New Year\'s Day',
    '14-2': '❤️ Valentine\'s Day',
    '8-3': '👩 Women\'s Day',
    '1-4': '😄 April Fools\' Day',
    '22-4': '🌍 Earth Day',
    '1-5': '👷 Labour Day',
    '5-6': '🌍 Environment Day',
    '21-6': '☀️ Summer Solstice',
    '15-8': '🇮🇳 Independence Day',
    '2-10': '🕊️ Gandhi Jayanti',
    '31-10': '🎃 Halloween',
    '25-12': '🎄 Christmas',

    // Day of week specific info
    // '0': '🌅 Sunday - Relaxation Day',
    // '1': '💼 Monday - Fresh Start',
    // '2': '🚀 Tuesday - Momentum Day',
    // '3': '📊 Wednesday - Midweek',
    // '4': '🎯 Thursday - Almost Weekend',
    // '5': '🎉 Friday - Weekend Near',
    // '6': '🌟 Saturday - Weekend'
    '0': '☕ Sun - Chill bhai, sofa + chai!',
    '1': '😵 Mon - Uth ja Brijesh!',
    '2': '🏃 Tue - Thoda tez chal!',
    '3': '😓 Wed - Beech ka bojh!',
    '4': '👀 Thu - Weekend nazdeek h!',
    '5': '🍻 Fri - Kaam khatam, vibe on!',
    '6': '😎 Sat - Full to masti!'
  };

  // Check for special day
  const dateKey = `${day}-${month}`;
  if (dayInfo[dateKey]) {
    return dayInfo[dateKey];
  }

  // Return day of week info if no special day
  return dayInfo[dayOfWeek];
};

export default function WeekdayTracker() {
  const [weekdayDates, setWeekdayDates] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [totalWeekdays, setTotalWeekdays] = useState(0);
  const [weekdaysTillToday, setWeekdaysTillToday] = useState(0);
  const [remainingWeekdays, setRemainingWeekdays] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Add this state
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
  const [isWeekendMode, setIsWeekendMode] = useState(false);

  // Add topQuotes array
  const topQuotes = [
    { text: "Code likhna easy nahi re bhai, Brijesh bhai kar ke dikhata hai!", emoji: "💻" },
    { text: "Har din naya bug, har raat Brijesh bhai ka jugaad!", emoji: "🔧" },
    { text: "Pehle chalana, phir sudharna — Brijesh bhai ka coding mantra!", emoji: "⚡" },
    { text: "Clean code matlab Brijesh bhai ki pehchaan!", emoji: "🧼" },
    { text: "Aaj code kar, kal Brijesh bhai ke naam ka danka bajega!", emoji: "😎" },
    { text: "Debugging detective ka kaam hai — Brijesh bhai full CID mode mein!", emoji: "🔍" },
    { text: "Code likhte ja, growth apne aap ho jaayegi — Brijesh bhai ka funda!", emoji: "🌱" },
    { text: "Chhoti chhoti commits, bade bade kaam — Brijesh bhai style!", emoji: "👣" },
    { text: "Soch samajh ke likh bhai, code ek baar likhna hota hai!", emoji: "🧠" },
    { text: "Code toh poetry hai re, aur Brijesh bhai toh asli shayar!", emoji: "📝" }
  ];

  // Add programmerQuotes array
  const programmerQuotes = [
    { text: "Code agar samjhana pad gaya na bhai, toh joke hi samajh le usko!", emoji: "😅" },
    { text: "Pehle problem ka dahi karo, fir code ka tadka maaro!", emoji: "💡" },
    { text: "Machine ke liye toh koi bhi likh lega, Brijesh bhai insaan ke liye likhta hai!", emoji: "👨‍💻" },
    { text: "Future banana hai? Khud hi code likh re bhai!", emoji: "🚀" },
    { text: "Bakwaas band, code dikhana start kar!", emoji: "💻" },
    { text: "Jo nahi aata, wahi seekhna padta hai. Jugaadu coder banna re!", emoji: "🔍" },
    { text: "Naya language? Bas likhne lag ja, seekh jayega!", emoji: "📚" },
    { text: "Monday ko chill kar le bhai, warna poora hafta code ka dard rahega!", emoji: "😴" },
    { text: "Bug nahi re baba, undocumented feature hai!", emoji: "🐛" },
    { text: "'Hamesha aise hi kiya hai' — sabse badi barbaadi!", emoji: "⚡" },
    { text: "Acha code aur acha joke — dono explain nahi hote bhai!", emoji: "😄" },
    { text: "Jo code likhna hi na pade, wahi best code hota hai!", emoji: "🎯" },
    { text: "Code matlab doosre ko bolna, 'boss, system ko yeh karwana hai!'", emoji: "🎨" },
    { text: "Coding mein mazza tabhi aata hai, jab dil se karein — Brijesh bhai style!", emoji: "❤️" },
    { text: "Code kabhi jhooth nahi bolta, par comments? Kabhi kabhi kaafi confusing!", emoji: "📝" },
    { text: "Best error wahi hota hai jo kabhi dikhta hi nahi!", emoji: "✅" },
    { text: "Soch zyada, likhna kam — asli programmer ka style!", emoji: "🧠" },
    { text: "Computer ki dikkat kya hai? Problem bana deta hai jahan problem hoti hi nahi!", emoji: "💭" },
    { text: "Code samjhe insaan, tabhi toh bole Brijesh bhai, 'yeh hai asli kaam!'", emoji: "👥" },
    { text: "Tez kaam chahiye? Jaldi shuru kar bhai!", emoji: "⏰" }
  ];

  // Update weekend mode based on current day
  const updateWeekendMode = () => {
    const today = new Date();
    const day = today.getDay();
    setIsWeekendMode(day === 0 || day === 6); // 0 is Sunday, 6 is Saturday
  };

  // Update weekend mode on mount and every minute
  useEffect(() => {
    updateWeekendMode();
    const interval = setInterval(updateWeekendMode, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Weekend messages
  const weekendMessages = {
    saturday: {
      emoji: '🎉',
      text: 'Weekend Mode: Saturday Vibes!',
      subtext: 'Time to relax and enjoy your day!'
    },
    sunday: {
      emoji: '🌟',
      text: 'Weekend Mode: Sunday Special!',
      subtext: 'Make the most of your last weekend day!'
    }
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setIsQuoteVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % programmerQuotes.length);
        setIsQuoteVisible(true);
      }, 500); // Half second for fade out
    }, 5000);

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
    }, 5000);

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

  // Add function to generate month options
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    // Generate options for current month and next 12 months
    for (let i = 0; i < 13; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      options.push({
        value: date,
        label: format(date, "MMMM yyyy")
      });
    }
    return options;
  };

  // Function to count weekends in a month
  const getWeekendCount = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let saturdays = 0;
    let sundays = 0;
    let pastSaturdays = 0;
    let pastSundays = 0;
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0) {
        sundays++;
        if (currentDate < today) pastSundays++;
      }
      if (dayOfWeek === 6) {
        saturdays++;
        if (currentDate < today) pastSaturdays++;
      }
    }

    return {
      saturdays,
      sundays,
      total: saturdays + sundays,
      pastSaturdays,
      pastSundays,
      pastTotal: pastSaturdays + pastSundays,
      remainingSaturdays: saturdays - pastSaturdays,
      remainingSundays: sundays - pastSundays,
      remainingTotal: (saturdays + sundays) - (pastSaturdays + pastSundays)
    };
  };

  // Update the useEffect for calculating dates to use selectedMonth
  useEffect(() => {
    const startOfMonth = new Date(getYear(selectedMonth), getMonth(selectedMonth), 1);
    const endOfMonth = new Date(getYear(selectedMonth), getMonth(selectedMonth) + 1, 0);

    const allDays = eachDayOfInterval({ start: startOfMonth, end: endOfMonth });
    const weekdays = allDays.filter((day) => !isWeekend(day));
    const today = new Date();
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
  }, [selectedMonth, currentTime]); // Add selectedMonth to dependencies

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
          {/* Weekend Label */}
          {isWeekendMode && (
            <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 shadow-lg animate-bounce-subtle">
              <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl animate-bounce">
                    {new Date().getDay() === 0 ? weekendMessages.sunday.emoji : weekendMessages.saturday.emoji}
                  </span>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">
                      {new Date().getDay() === 0 ? weekendMessages.sunday.text : weekendMessages.saturday.text}
                    </h2>
                    <p className="text-sm opacity-90">
                      {new Date().getDay() === 0 ? weekendMessages.sunday.subtext : weekendMessages.saturday.subtext}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Top Quote Section - Keep existing code */}
          <div className={`sticky ${isWeekendMode ? 'top-20' : 'top-0'} z-40 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 py-3 border-b border-blue-200/50 shadow-sm transition-all duration-300`}
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
                            My Weekday Calendar
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
                  {(() => {
                    const {
                      saturdays,
                      sundays,
                      total,
                      pastSaturdays,
                      pastSundays,
                      pastTotal,
                      remainingSaturdays,
                      remainingSundays,
                      remainingTotal
                    } = getWeekendCount(selectedMonth);

                    return [
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
                        gradient: "from-teal-500 to-teal-600",
                        textGradient: "from-teal-600 to-teal-700",
                        delay: "0.3s"
                      },
                      {
                        icon: "🎯",
                        value: total,
                        title: "Weekend Stats",
                        description: (
                          <div className="mt-2 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-2 py-1.5 rounded-lg border border-blue-100">
                                <span className="text-base">😎</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-slate-700">Sat: {saturdays}</span>
                                  <span className="text-xs text-slate-500">Past: {pastSaturdays} | Left: {remainingSaturdays}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-1.5 rounded-lg border border-purple-100">
                                <span className="text-base">☕</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-slate-700">Sun: {sundays}</span>
                                  <span className="text-xs text-slate-500">Past: {pastSundays} | Left: {remainingSundays}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs px-1">
                              <span className="text-emerald-600 font-medium">Past: {pastTotal} weekends</span>
                              <span className="text-indigo-600 font-medium">Left: {remainingTotal} weekends</span>
                            </div>
                          </div>
                        ),
                        gradient: "from-indigo-500 to-purple-500",
                        textGradient: "from-indigo-600 to-purple-600",
                        delay: "0.4s"
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
                        {typeof stat.description === 'string' ? (
                          <p className="text-slate-500 mt-2 text-sm">
                            {stat.description}
                          </p>
                        ) : (
                          stat.description
                        )}
                      </div>
                    ));
                  })()}
                </div>

                {/* Calendar Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                  {/* Header - Fixed */}
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg shadow-sm">📆</span>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                            Monthly Calendar View
                          </h2>
                          {/* Add Month Selector Dropdown */}
                          <div className="relative">
                            <select
                              value={selectedMonth.toISOString()}
                              onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-8 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-blue-300 transition-colors"
                            >
                              {getMonthOptions().map((option) => (
                                <option key={option.value.toISOString()} value={option.value.toISOString()}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
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
                        const isSelectedMonth = getMonth(day) === getMonth(selectedMonth);
                        const daysUntil = getDaysUntilLabel(day);
                        const timeUntil = getTimeUntil(day);
                        const sectionCountdown = getSectionCountdown(day);

                        return (
                          <div
                            key={idx}
                            className={`
                              p-3 rounded-lg relative
                              ${!isSelectedMonth ? 'opacity-50' : ''}
                          ${isWeekendDay
                                ? isPastDay
                                  ? 'bg-red-100/50'
                                  : 'bg-red-50 hover:bg-red-100/50'
                                : isPastDay
                                  ? 'bg-slate-100/50'
                                  : 'bg-slate-50 hover:bg-slate-100/50'
                              }
                              ${isCurrentDay ? 'border-2 border-blue-500 bg-blue-50' : 'border border-transparent'}
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

                                {/* Add Day Info */}
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-emerald-600">💡</span>
                                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                      {getDayInfo(day)}
                                    </span>
                                  </div>
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
                          <span className="text-2xl">{programmerQuotes[currentQuote].emoji}</span>
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
                  © {new Date().getFullYear()} My Weekday Calendar. Made with ❤️ for better time management.
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

            .animate-bounce-subtle {
              animation: bounce-subtle 2s infinite;
            }
            @keyframes bounce-subtle {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }

            .animate-bounce {
              animation: bounce 1s infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
      `}</style>
        </div>
      </div>
    </div>
  );
}
