import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Share2, Download } from "lucide-react";
import { useLocation } from "wouter";

export default function Analytics() {
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
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-12 relative z-10">
        {/* Key Metrics */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Métricas Gerais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Transformations */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Transformações Totais</p>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-white">1,234</p>
              <p className="text-sm text-green-400">+12% vs semana passada</p>
            </Card>

            {/* Active Users */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Usuários Ativos</p>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">567</p>
              <p className="text-sm text-green-400">+8% vs semana passada</p>
            </Card>

            {/* Total Shares */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Compartilhamentos</p>
                <Share2 className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-3xl font-bold text-white">892</p>
              <p className="text-sm text-green-400">+15% vs semana passada</p>
            </Card>

            {/* Total Downloads */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Downloads</p>
                <Download className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white">445</p>
              <p className="text-sm text-green-400">+5% vs semana passada</p>
            </Card>
          </div>
        </section>

        {/* Top Themes */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Estilos Mais Populares</h2>
          
          <div className="space-y-3">
            {[
              { theme: "🎄 Natal", count: 234, percentage: 25 },
              { theme: "🐾 Bichinho", count: 189, percentage: 20 },
              { theme: "👾 Monstro", count: 156, percentage: 17 },
              { theme: "⚔️ Épico", count: 145, percentage: 15 },
              { theme: "🎨 Pintura", count: 123, percentage: 13 },
              { theme: "🎆 Réveillon", count: 98, percentage: 10 },
            ].map((item) => (
              <Card key={item.theme} className="bg-slate-900/50 border-slate-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{item.theme}</span>
                  <span className="text-orange-400 font-bold">{item.count} transformações</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage * 10}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Conversion Rates */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Taxa de Conversão</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-white font-semibold mb-4">Visitantes → Usuários</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-green-400">12.5%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Visitantes Únicos</p>
                  <p className="text-2xl font-bold text-white">4,536</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-white font-semibold mb-4">Usuários → Pagantes</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-green-400">8.3%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-white">567</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
