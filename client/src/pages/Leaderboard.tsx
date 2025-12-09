import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Star, Zap, Share2, Award } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const BADGES = {
  transformations_10: {
    name: "Iniciante",
    description: "10 transformações realizadas",
    icon: "🎯",
    color: "from-blue-500 to-blue-600",
  },
  transformations_50: {
    name: "Explorador",
    description: "50 transformações realizadas",
    icon: "🚀",
    color: "from-purple-500 to-purple-600",
  },
  transformations_100: {
    name: "Mestre",
    description: "100 transformações realizadas",
    icon: "👑",
    color: "from-yellow-500 to-yellow-600",
  },
  social_sharer: {
    name: "Compartilhador Social",
    description: "Compartilhou 10 transformações",
    icon: "📱",
    color: "from-pink-500 to-pink-600",
  },
  early_adopter: {
    name: "Pioneiro",
    description: "Um dos primeiros usuários",
    icon: "⭐",
    color: "from-indigo-500 to-indigo-600",
  },
  power_user: {
    name: "Usuário Power",
    description: "Usuário muito ativo",
    icon: "⚡",
    color: "from-orange-500 to-orange-600",
  },
  collector: {
    name: "Colecionador",
    description: "Experimentou todos os 9 estilos",
    icon: "🎨",
    color: "from-green-500 to-green-600",
  },
};

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  if (!isAuthenticated || !user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-white">Badges & Leaderboard</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-12 relative z-10">
        {/* Badges Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Seus Badges</h2>
            <p className="text-slate-300">Desbloqueie badges completando desafios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(BADGES).map(([key, badge]) => (
              <Card
                key={key}
                className={`bg-gradient-to-br ${badge.color} border-0 p-6 text-white space-y-3 hover:shadow-lg hover:shadow-orange-500/20 transition-all`}
              >
                <div className="text-5xl">{badge.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{badge.name}</h3>
                  <p className="text-sm opacity-90">{badge.description}</p>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs opacity-75">Desbloqueado</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Leaderboard
            </h2>
            <p className="text-slate-300">Top usuários mais ativos</p>
          </div>

          <div className="space-y-3">
            {/* Example leaderboard entries */}
            {[1, 2, 3, 4, 5].map((rank) => (
              <Card
                key={rank}
                className="bg-slate-900/50 border-slate-700 p-4 flex items-center justify-between hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                    {rank === 1 && <Trophy className="w-6 h-6 text-yellow-300" />}
                    {rank === 2 && <Award className="w-6 h-6 text-gray-300" />}
                    {rank === 3 && <Star className="w-6 h-6 text-orange-300" />}
                    {rank > 3 && <span className="text-white font-bold">{rank}</span>}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Usuário #{rank}</p>
                    <p className="text-slate-400 text-sm">{rank * 25} transformações</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{rank * 250} pontos</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Your Rank */}
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 p-6 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Sua Posição</p>
                <p className="text-2xl font-bold text-white">#42</p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm">Suas Transformações</p>
                <p className="text-2xl font-bold text-orange-400">125</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
