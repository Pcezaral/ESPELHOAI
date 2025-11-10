import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2, Play, Facebook, Instagram, Youtube, Send, Crown, Zap, InfinityIcon, Check } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { CreditBadge } from "@/components/CreditBadge";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [contactName, setContactName] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleStartApp = () => {
    if (isAuthenticated) {
      setLocation("/generator");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    if (!contactMessage.trim()) {
      toast.error("Por favor, escreva uma mensagem");
      return;
    }
    
    // Simular envio (pode integrar com backend depois)
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setContactName("");
    setContactMessage("");
  };

  const plans = [
    {
      id: "light",
      name: "Pacote Light",
      price: "R$ 9,90",
      credits: 50,
      description: "50 Créditos",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30",
      features: ["50 transformações", "Todos os 5 temas", "Download em alta qualidade"],
    },
    {
      id: "premium",
      name: "Pacote Premium",
      price: "R$ 19,90",
      credits: 200,
      description: "200 Créditos + Extras",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/30",
      popular: true,
      features: ["200 transformações", "Todos os 5 temas", "Recursos extras", "Suporte prioritário"],
    },
    {
      id: "monthly_unlimited",
      name: "Ilimitado Mensal",
      price: "R$ 29,90/mês",
      credits: -1,
      description: "Créditos Ilimitados",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30",
      features: ["Transformações ilimitadas", "Todos os 5 temas", "Renovação mensal"],
    },
    {
      id: "annual_unlimited",
      name: "Ilimitado Anual",
      price: "R$ 119,90/ano",
      credits: -1,
      description: "Economize!",
      color: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-500/30",
      badge: "Melhor Custo-Benefício",
      features: ["Transformações ilimitadas", "Todos os 5 temas", "Economize R$ 238,90/ano"],
    },
  ];

  const faqs = [
    {
      question: "Como funciona o app?",
      answer: "Você envia uma foto, escolhe um tema (Bichinho, Monstro, Pintura, etc.) e a IA transforma sua imagem mantendo suas características faciais reconhecíveis."
    },
    {
      question: "Posso usar as imagens geradas?",
      answer: "Sim! Todas as imagens geradas são suas. Você pode baixar, compartilhar nas redes sociais e usar como quiser."
    },
    {
      question: "Quais estilos estão disponíveis?",
      answer: "Temos 5 categorias: Bichinho (animais fofos), Monstro (criaturas divertidas), Pintura (7 épocas históricas), Se tivesse nascido... (mudança de gênero) e Romanos, Gregos e Vikings (guerreiros épicos)."
    },
    {
      question: "O app é gratuito?",
      answer: "Você recebe 5 créditos gratuitos ao se cadastrar. Depois, pode comprar pacotes de créditos ou assinar planos ilimitados mensais/anuais."
    },
    {
      question: "Minhas fotos ficam salvas?",
      answer: "Suas fotos são processadas de forma segura e não são compartilhadas. Você pode baixar os resultados e eles ficam disponíveis no seu histórico."
    },
    {
      question: "Como posso enviar feedback ou sugestões?",
      answer: "Use o formulário de contato no final desta página ou envie um email para contato@espelhoai.com.br. Adoramos ouvir nossos usuários!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/espelho-ai-logo-transp.png" alt="ESPELHO AI" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-white">
              ESPELHO <span className="text-orange-500">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && <CreditBadge />}
            <div className="text-sm font-medium text-orange-400">
              Por <span className="font-bold text-orange-500">Paulo Barboni</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text & CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-300">
                  Powered by IA Generativa
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">ESPELHO</span> <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  AI
                </span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Envie uma foto e deixe a IA revelar quem você seria em outro mundo. Bichinho? Monstro? Personagem histórico? Ou do outro gênero? Descubra de forma divertida e compartilhe com seus amigos!
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleStartApp}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {loading ? "Carregando..." : "Enviar minha foto"}
              </Button>
              <Button
                onClick={() => setLocation("/gallery")}
                variant="outline"
                size="lg"
                className="text-lg h-14 px-8 rounded-full border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                <Play className="w-4 h-4 mr-2" />
                Ver exemplos
              </Button>
            </div>

            {/* Features - 5 CATEGORIAS FINAIS */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-orange-500/30 transition-colors">
                <div className="text-3xl font-bold text-orange-400">🐾</div>
                <p className="font-semibold text-white">Bichinho</p>
                <p className="text-sm text-slate-400">Animal adorável</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors">
                <div className="text-3xl font-bold text-purple-400">👾</div>
                <p className="font-semibold text-white">Monstro</p>
                <p className="text-sm text-slate-400">Criatura fofa</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="text-3xl font-bold text-amber-400">🎨</div>
                <p className="font-semibold text-white">Pintura</p>
                <p className="text-sm text-slate-400">Várias épocas</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-pink-500/30 transition-colors">
                <div className="text-3xl font-bold text-pink-400">⚧️</div>
                <p className="font-semibold text-white">Se tivesse nascido...</p>
                <p className="text-sm text-slate-400">Outro gênero</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-yellow-600/30 transition-colors col-span-2">
                <div className="text-3xl font-bold text-yellow-600">⚔️</div>
                <p className="font-semibold text-white">Romanos, Gregos e Vikings</p>
                <p className="text-sm text-slate-400">Guerreiro/deusa épico</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-3xl blur-3xl" />
            <Card className="relative border-orange-500/30 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 p-8 flex flex-col items-center justify-center space-y-6">
                <div className="text-8xl animate-bounce">✨</div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-white">
                    Transformação Mágica
                  </p>
                  <p className="text-slate-300">
                    Sua foto + IA = Resultado Hilariante
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 text-center border border-slate-700">
                    <p className="text-3xl">📸</p>
                    <p className="text-xs font-medium text-slate-300 mt-2">Sua Foto</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur rounded-lg p-4 text-center border border-orange-500/30">
                    <p className="text-3xl">🎭</p>
                    <p className="text-xs font-medium text-orange-300 mt-2">Sua Versão</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Social Proof / Stats - ATUALIZADO PARA 5 TEMAS */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-800">
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              10K+
            </p>
            <p className="text-slate-400 mt-2">Transformações realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              98%
            </p>
            <p className="text-slate-400 mt-2">Compartilharam o resultado</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              5 Temas
            </p>
            <p className="text-slate-400 mt-2">Para explorar</p>
          </div>
        </div>

        {/* Seção de Planos de Créditos */}
        <section className="mt-20 pt-12 border-t border-slate-800">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Planos de Créditos</h3>
            <p className="text-xl text-slate-400">Escolha o melhor plano para você e comece a transformar suas fotos!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative bg-slate-900/50 ${plan.borderColor} border-2 p-6 space-y-4 hover:scale-105 transition-transform`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    {plan.price}
                  </div>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setLocation("/planos")}
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold`}
                >
                  Adquirir Agora
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Dúvidas Frequentes */}
        <section className="mt-20 pt-12 border-t border-slate-800">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Dúvidas Frequentes</h3>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-800 p-6 space-y-3">
                <h4 className="text-lg font-semibold text-orange-400">{faq.question}</h4>
                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Contato */}
        <section className="mt-20 pt-12 border-t border-slate-800">
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 rounded-3xl border border-purple-500/30 p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-white mb-4">Contato</h3>
              <p className="text-xl text-slate-300">Fale conosco para dúvidas ou sugestões</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Informações de Contato */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 rounded-full bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                      <Youtube className="w-6 h-6 text-white" />
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                  <a href="mailto:contato@espelhoai.com.br" className="text-orange-400 hover:text-orange-300 transition-colors">
                    contato@espelhoai.com.br
                  </a>
                </div>
              </div>

              {/* Formulário de Contato */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Seu nome, por favor"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Sua mensagem..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar agora
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm mt-20">
        <div className="container py-8 space-y-4">
          <div className="text-center text-slate-400">
            <p>
              Desenvolvido por <span className="font-bold text-orange-400">Paulo Barboni</span>
            </p>
            <p className="text-sm mt-2">
              Transformando fotos em diversão desde 2025 ✨
            </p>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-4">
            <p>© 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
