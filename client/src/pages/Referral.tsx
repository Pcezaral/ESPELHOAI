import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Share2, Users, Gift, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Referral() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      setReferralLink(`${baseUrl}/?ref=${user.id}`);
    }
  }, [user?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `Vem transformar suas fotos com o ESPELHO AI! 🎭 Ganhe 5 créditos grátis ao se cadastrar com meu link: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareTikTok = () => {
    const message = `Vem transformar suas fotos com o ESPELHO AI! 🎭 Ganhe 5 créditos grátis ao se cadastrar com meu link: ${referralLink}`;
    toast.info("Copie o link e compartilhe no TikTok!");
    navigator.clipboard.writeText(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-md text-center space-y-4">
          <p className="text-white text-lg">Você precisa estar logado para acessar o programa de referral.</p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">
            Programa de <span className="text-orange-500">Referral</span>
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-white">
            Ganhe Créditos Indicando Amigos
          </h2>
          <p className="text-xl text-slate-300">
            Compartilhe seu link único e ganhe 5 créditos para cada amigo que se cadastrar!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 p-6 text-center space-y-2">
            <Users className="w-8 h-8 text-orange-400 mx-auto" />
            <p className="text-slate-400">Amigos Indicados</p>
            <p className="text-3xl font-bold text-white">0</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 p-6 text-center space-y-2">
            <Gift className="w-8 h-8 text-green-400 mx-auto" />
            <p className="text-slate-400">Créditos Ganhos</p>
            <p className="text-3xl font-bold text-white">0</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 p-6 text-center space-y-2">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-slate-400">Posição no Ranking</p>
            <p className="text-3xl font-bold text-white">-</p>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 space-y-6 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Seu Link de Referral</h3>
            <p className="text-slate-300">
              Compartilhe este link com seus amigos. Quando eles se cadastrarem usando seu link,
              ambos ganharão 5 créditos grátis!
            </p>
          </div>

          {/* Link Display */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between gap-4">
            <code className="text-orange-400 font-mono text-sm break-all flex-1">
              {referralLink}
            </code>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-shrink-0 gap-2 border-slate-600 text-white hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">Compartilhe em suas redes sociais:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleShareWhatsApp}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar no WhatsApp
              </Button>
              <Button
                onClick={handleShareTikTok}
                className="gap-2 bg-black hover:bg-slate-900 text-white font-semibold border border-slate-700"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar no TikTok
              </Button>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">Como Funciona?</h3>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Compartilhe seu link",
                description: "Copie seu link único de referral e compartilhe com amigos no WhatsApp, TikTok, Instagram ou qualquer rede social.",
              },
              {
                step: 2,
                title: "Amigos se cadastram",
                description: "Quando seus amigos clicam no link e se cadastram no ESPELHO AI, ambos ganham 5 créditos grátis automaticamente.",
              },
              {
                step: 3,
                title: "Acumule créditos",
                description: "Quanto mais amigos você indicar, mais créditos você ganha! Sem limite de referrals.",
              },
              {
                step: 4,
                title: "Use seus créditos",
                description: "Use seus créditos para fazer transformações ou comprar imagens em alta resolução.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bonus Info */}
        <div className="mt-12 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Bônus Especial! 🎉</h3>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Indique 10 amigos e ganhe um bônus extra de 25 créditos! Indique 20 amigos e ganhe
            50 créditos extras! Não há limite - quanto mais você indicar, mais você ganha!
          </p>
        </div>
      </main>
    </div>
  );
}
