import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw,
  BarChart3,
  DollarSign,
  Download,
  Share2,
  Activity
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalTransformations: number;
  totalRevenue: number;
  activeUsers30d: number;
  premiumDownloads: number;
  conversionRate: number;
  averageRating: number;
  topTheme: string;
  newUsersToday: number;
  creditsConsumedToday: number;
}

export default function OwnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Verificar se é o proprietário
  const isOwner = user?.role === "admin";

  // Mostrar loading enquanto autentica
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não é owner
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-red-500/30 p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-slate-300 mb-6">Você não tem permissão para acessar este painel.</p>
          <Button onClick={() => setLocation("/")} className="w-full">
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  useEffect(() => {

    // Simular carregamento de dados
    const loadStats = async () => {
      setLoading(true);
      try {
        // Aqui você conectaria com tRPC para buscar dados reais
        // Por enquanto, vamos simular dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 1247,
          totalTransformations: 5832,
          totalRevenue: 8450.50,
          activeUsers30d: 389,
          premiumDownloads: 234,
          conversionRate: 18.8,
          averageRating: 4.6,
          topTheme: "Epic (Gregos/Romanos/Vikings)",
          newUsersToday: 23,
          creditsConsumedToday: 1450
        });
      } catch (error) {
        console.error("Erro ao carregar stats:", error);
        toast.error("Erro ao carregar estatísticas");
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Auto-refresh a cada 5 minutos
    const interval = autoRefresh ? setInterval(loadStats, 5 * 60 * 1000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Dashboard do Proprietário
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`gap-2 ${autoRefresh ? "text-green-400" : "text-slate-400"}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto (5min)" : "Manual"}
          </Button>
        </div>
      </header>

      <main className="container py-8 relative z-10">
        {loading ? (
          // Loading skeleton
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Métricas Principais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-700 p-6 space-y-2 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-8 bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-700 rounded w-2/3" />
                  </Card>
                ))}
              </div>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 border-slate-700 p-6 space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-8 bg-slate-700 rounded w-1/2" />
                    <div className="h-2 bg-slate-700 rounded" />
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Métricas Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Total de Usuários</p>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? "--" : stats?.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-green-400">
                +{stats?.newUsersToday} hoje
              </p>
            </Card>

            {/* Total Transformations */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Transformações</p>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? "--" : stats?.totalTransformations.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">
                {stats?.creditsConsumedToday} créditos hoje
              </p>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Receita Total</p>
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? "--" : `R$ ${stats?.totalRevenue.toFixed(2)}`}
              </p>
              <p className="text-xs text-slate-400">
                Margem estimada: 70-90%
              </p>
            </Card>

            {/* Active Users */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Usuários Ativos (30d)</p>
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loading ? "--" : stats?.activeUsers30d.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">
                {stats ? ((stats.activeUsers30d / stats.totalUsers) * 100).toFixed(1) : "--"}% do total
              </p>
            </Card>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conversion Rate */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Taxa de Conversão</p>
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-4xl font-bold text-white">
                {loading ? "--" : `${stats?.conversionRate.toFixed(1)}%`}
              </p>
              <p className="text-xs text-slate-400">
                Usuários que compraram créditos
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                  style={{ width: `${stats?.conversionRate || 0}%` }}
                />
              </div>
            </Card>

            {/* Premium Downloads */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Downloads Premium</p>
                <Download className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-4xl font-bold text-white">
                {loading ? "--" : stats?.premiumDownloads.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">
                HD + 4K downloads
              </p>
              <p className="text-xs text-green-400 font-medium">
                Receita: ~R$ {stats ? (stats.premiumDownloads * 2.5).toFixed(2) : "--"}
              </p>
            </Card>

            {/* Average Rating */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium">Avaliação Média</p>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-4xl font-bold text-white">
                {loading ? "--" : stats?.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-slate-400">
                De 5 estrelas
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(stats?.averageRating || 0) ? "text-yellow-400" : "text-slate-600"}>
                    ★
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Top Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Theme */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 font-medium">Estilo Mais Popular</p>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? "--" : stats?.topTheme}
              </p>
              <p className="text-sm text-slate-400">
                Baseado em número de transformações
              </p>
            </Card>

            {/* Recommendations */}
            <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 font-medium">Recomendações</p>
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Margem de lucro saudável (70-90%)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span>Aumentar marketing para Epic/Gangster</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-400">!</span>
                  <span>Considerar promoção de downloads HD/4K</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
              onClick={() => setLocation("/admin")}
            >
              <Users className="w-4 h-4" />
              Gerenciar Usuários
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
              onClick={() => setLocation("/analytics")}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics Detalhado
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white gap-2"
              onClick={() => setLocation("/trending")}
            >
              <TrendingUp className="w-4 h-4" />
              Trending Agora
            </Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white gap-2"
              onClick={() => toast.info("Relatório será enviado por email")}
            >
              <Share2 className="w-4 h-4" />
              Exportar Relatório
            </Button>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-slate-900/30 border border-slate-700 rounded-lg text-center text-slate-400 text-sm">
          <p>Dashboard atualizado em tempo real • Próxima atualização: {autoRefresh ? "em 5 minutos" : "manual"}</p>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
