import { useEffect, useState } from "react";
import { Sparkles, PartyPopper, Gift, Star } from "lucide-react";

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

  // Pad numbers with leading zero
  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="relative overflow-hidden">
      {/* Background black */}
      <div className="absolute inset-0 bg-black rounded-3xl"></div>
      
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 text-4xl animate-bounce-slow">🎄</div>
        <div className="absolute top-6 right-6 text-3xl animate-float-medium">🎆</div>
        <div className="absolute bottom-4 left-8 text-3xl animate-float-slow">🎁</div>
        <div className="absolute bottom-6 right-4 text-4xl animate-bounce-slow">🥂</div>
        <div className="absolute top-1/2 left-2 text-2xl animate-float-fast">✨</div>
        <div className="absolute top-1/3 right-2 text-2xl animate-float-medium">🌟</div>
        <Sparkles className="absolute top-8 left-1/4 w-6 h-6 text-yellow-300 animate-pulse" />
        <Star className="absolute bottom-8 right-1/4 w-5 h-5 text-yellow-200 animate-spin-slow" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <PartyPopper className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-sm">CONTAGEM REGRESSIVA</span>
            <PartyPopper className="w-5 h-5 text-yellow-300 transform scale-x-[-1]" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
            🎉 Faltam poucos dias para <span className="text-yellow-300">2026!</span> 🎉
          </h3>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Prepare sua transformação de Réveillon agora!
          </p>
        </div>

        {/* Countdown boxes */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
          {/* Days */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 md:p-5 text-center shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-4 border-yellow-400">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                {pad(timeLeft.days)}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                Dias
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 md:p-5 text-center shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-4 border-pink-400">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-pink-600 to-orange-500 bg-clip-text text-transparent mb-1">
                {pad(timeLeft.hours)}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                Horas
              </div>
            </div>
          </div>

          {/* Minutes */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 md:p-5 text-center shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-4 border-orange-400">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-1">
                {pad(timeLeft.minutes)}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                Min
              </div>
            </div>
          </div>

          {/* Seconds */}
          <div className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 md:p-5 text-center shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border-4 border-red-400 animate-pulse-border">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-red-500 to-pink-500 bg-clip-text text-transparent mb-1 animate-pulse">
                {pad(timeLeft.seconds)}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                Seg
              </div>
            </div>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
            <span className="text-white font-bold text-sm md:text-base">
              Transforme-se em personagem de Natal ou Réveillon! 
            </span>
            <span className="text-2xl">🎅🥳</span>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-5deg); }
        }
        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-fast {
          animation: float-fast 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgb(248, 113, 113); }
          50% { border-color: rgb(239, 68, 68); box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
        }
        .animate-pulse-border {
          animation: pulse-border 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
