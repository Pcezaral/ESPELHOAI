import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Zap, TrendingUp, AlertCircle, MessageSquare, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Verificar se é admin
  if (user?.role !== "admin") {
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
          <h1 className="text-xl font-bold text-white">Painel Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`gap-2 ${autoRefresh ? "text-green-400" : "text-slate-400"}`}
          >
            <RefreshCw className="w-4 h-4" />
            {autoRefresh ? "Auto" : "Manual"}
          </Button>
        </div>
      </header>

      <main className="container py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">Total de Usuários</p>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-xs text-slate-400">Carregando...</p>
          </Card>

          {/* Total Transformations */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">Transformações</p>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-xs text-slate-400">Carregando...</p>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">Receita Total</p>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-xs text-slate-400">Carregando...</p>
          </Card>

          {/* Active Users */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">Usuários Ativos (30d)</p>
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">--</p>
            <p className="text-xs text-slate-400">Carregando...</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Alerts */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Alertas Recentes</h2>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-300">Nenhum alerta no momento</p>
              </div>
            </div>
          </Card>

          {/* Support Tickets */}
          <Card className="bg-slate-900/50 border-slate-700 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Tickets de Suporte</h2>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-300">Nenhum ticket no momento</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Message to Admin */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 p-6 mt-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comunicar Problema ou Solicitar Ajuste
            </h2>
            <textarea
              placeholder="Descreva o problema ou solicite um ajuste..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              Enviar Mensagem
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
