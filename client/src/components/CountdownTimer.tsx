import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const targetDate = new Date("2026-01-01T00:00:00-03:00"); // Brasília timezone
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          ⏰ Contagem Regressiva para 2026!
        </h3>
        <p className="text-white/90 text-sm md:text-base">
          Prepare-se para celebrar com transformações incríveis!
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {/* Days */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.days}
          </div>
          <div className="text-xs md:text-sm text-white/90 font-medium">
            Dias
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.hours}
          </div>
          <div className="text-xs md:text-sm text-white/90 font-medium">
            Horas
          </div>
        </div>

        {/* Minutes */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.minutes}
          </div>
          <div className="text-xs md:text-sm text-white/90 font-medium">
            Min
          </div>
        </div>

        {/* Seconds */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
          <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2 animate-pulse">
            {timeLeft.seconds}
          </div>
          <div className="text-xs md:text-sm text-white/90 font-medium">
            Seg
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-white/80 text-xs md:text-sm">
          🎆 Transforme-se para as festas de fim de ano! 🎄
        </p>
      </div>
    </div>
  );
}
