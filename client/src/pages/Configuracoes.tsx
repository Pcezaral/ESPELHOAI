import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Lock, Eye } from "lucide-react";
import { useState } from "react";

export default function Configuracoes() {
  const [, setLocation] = useLocation();
  const [notificacoes, setNotificacoes] = useState(true);
  const [emailNewsletter, setEmailNewsletter] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Notificações */}
        <Card className="bg-slate-900 border-slate-700 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold">Notificações</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-semibold">Notificações de Transformação</p>
                <p className="text-sm text-slate-400">Receba alertas quando suas transformações estiverem prontas</p>
              </div>
              <input
                type="checkbox"
                checked={notificacoes}
                onChange={(e) => setNotificacoes(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-semibold">Newsletter & Promoções</p>
                <p className="text-sm text-slate-400">Receba novos estilos e ofertas especiais</p>
              </div>
              <input
                type="checkbox"
                checked={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Privacidade */}
        <Card className="bg-slate-900 border-slate-700 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Eye className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold">Privacidade</h2>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              📄 Ver Política de Privacidade
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              📋 Ver Termos de Serviço
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              🚫 Ver Política de Cancelamento
            </Button>
          </div>
        </Card>

        {/* Segurança */}
        <Card className="bg-slate-900 border-slate-700 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold">Segurança</h2>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              🔐 Alterar Senha
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              📱 Autenticação em Dois Fatores
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              🖥️ Gerenciar Sessões Ativas
            </Button>
          </div>
        </Card>

        {/* Dados */}
        <Card className="bg-slate-900 border-slate-700 p-8">
          <h2 className="text-xl font-bold mb-6">Dados</h2>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              📥 Baixar Meus Dados
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-400 border-red-700/50 hover:bg-red-900/20"
            >
              🗑️ Deletar Minha Conta
            </Button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Ao deletar sua conta, todos os seus dados serão permanentemente removidos. Esta ação é irreversível.
          </p>
        </Card>
      </main>
    </div>
  );
}
