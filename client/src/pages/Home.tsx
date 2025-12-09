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
      features: [
        "50 transformações",
        "Todos os 5 temas",
        "Download em alta resolução",
        "Suporte por email"
      ]
    },
    {
      id: "premium",
      name: "Pacote Premium",
      price: "R$ 19,90",
      credits: 200,
      description: "200 Créditos",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/50",
      popular: true,
      features: [
        "200 transformações",
        "Todos os 5 temas",
        "Download em alta resolução",
        "Suporte prioritário",
        "Acesso antecipado a novos temas"
      ]
    },
    {
      id: "monthly",
      name: "Ilimitado Mensal",
      price: "R$ 29,90/mês",
      credits: Infinity,
      description: "Transformações Ilimitadas",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30",
      features: [
        "Transformações ilimitadas",
        "Todos os 5 temas",
        "Download em alta resolução",
        "Suporte prioritário",
        "Acesso antecipado a novos temas",
        "Cancele quando quiser"
      ]
    },
    {
      id: "yearly",
      name: "Ilimitado Anual",
      price: "R$ 119,90/ano",
      credits: Infinity,
      description: "Transformações Ilimitadas + Economia",
      color: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-500/30",
      badge: "Melhor Custo-Benefício",
      features: [
        "Transformações ilimitadas",
        "Todos os 5 temas",
        "Download em alta resolução",
        "Suporte VIP",
        "Acesso antecipado a novos temas",
        "Economize 66% vs mensal"
      ]
    }
  ];

  const faqs = [
    {
      question: "Como funciona o ESPELHO AI?",
      answer: "Você envia uma foto, escolhe um tema (Bichinho, Monstro, Pintura, Épico, Gênero, Gangster ou Circo) e nossa IA generativa cria uma transformação única e divertida mantendo suas características!"
    },
    {
      question: "Quantos créditos preciso para gerar uma imagem?",
      answer: "Cada transformação consome 1 crédito. Você recebe 5 créditos gratuitos ao se cadastrar e pode comprar mais ou assinar planos ilimitados."
    },
    {
      question: "Posso usar as imagens comercialmente?",
      answer: "As imagens geradas são para uso pessoal e compartilhamento em redes sociais. Para uso comercial, entre em contato conosco."
    },
    {
      question: "Quanto tempo leva para gerar uma transformação?",
      answer: "Geralmente entre 10-30 segundos, dependendo da complexidade do tema escolhido e da demanda do servidor."
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
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-black backdrop-blur-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-3 min-h-[64px]">
            <div className="flex items-center gap-3">
              <img src="/espelho-ai-logo-transp.png" alt="ESPELHO AI" className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0" />
              <h1 className="text-2xl sm:text-4xl font-bold text-white whitespace-nowrap">
                ESPELHO <span className="text-orange-500">AI</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {isAuthenticated && <CreditBadge />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Seção Hero - FUNDO PRETO COM IMAGENS */}
        <section className="bg-black py-16 md:py-24">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Esquerda: Mulher e Homem Verticais */}
              <div className="flex flex-col gap-3 items-center">
                <img src="/hero-mulher-1.png" alt="Mulher" className="h-28 w-20 md:h-36 md:w-28 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-1.png" alt="Homem" className="h-28 w-20 md:h-36 md:w-28 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
              
              {/* Centro: Logo e Textos */}
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="flex justify-center">
                  <img src="/espelho-ai-logo-transp.png" alt="ESPELHO AI" className="h-32 w-32 md:h-40 md:w-40" />
                </div>
                
                <div className="space-y-4 max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    <span className="text-white">Você</span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">em Outro Mundo!</span>
                  </h2>
                  
                  <div className="space-y-2 pt-4">
                    <p className="text-lg md:text-xl text-white font-medium">
                      Transforme suas fotos em estilos incríveis
                    </p>
                    <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      Épico, Gangster, Pintura, Circo, Bichinho ou Monstro!
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleStartApp}
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {loading ? "Carregando..." : "Comece Agora"}
                  </Button>
                  <Button
                    onClick={() => setLocation("/planos")}
                    variant="outline"
                    size="lg"
                    className="border-orange-500 text-orange-400 hover:bg-orange-500/10 text-lg h-14 px-8 rounded-full font-semibold"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Comprar Créditos
                  </Button>
                </div>
              </div>
              
              {/* Direita: Mulher e Homem Verticais */}
              <div className="flex flex-col gap-3 items-center">
                <img src="/hero-mulher-2.png" alt="Mulher" className="h-28 w-20 md:h-36 md:w-28 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-2.png" alt="Homem" className="h-28 w-20 md:h-36 md:w-28 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        {/* Seção Exemplos de Transformações - Antes/Depois */}
        <section className="bg-white py-12 md:py-20">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Veja a Magia Acontecer</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">Transformações incríveis em segundos</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              {/* Exemplo 1: Pintura */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex gap-2 md:gap-4 w-full justify-center flex-wrap">
                  <div className="text-center">
                    <img src="/examples/exemplo-pintura-mulher-antes.jpg" alt="Antes - Pintura" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center">
                    <img src="/examples/exemplo-pintura-mulher-depois.jpg" alt="Depois - Pintura" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-pink-600">🎨 Pintura</p>
              </div>
              
              {/* Exemplo 2: Monstro */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex gap-2 md:gap-4 w-full justify-center flex-wrap">
                  <div className="text-center">
                    <img src="/examples/exemplo-monstro-mulher-antes.jpg" alt="Antes - Monstro" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center">
                    <img src="/examples/exemplo-monstro-mulher-depois.jpg" alt="Depois - Monstro" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-green-600">👾 Monstro</p>
              </div>
              
              {/* Exemplo 3: Épico */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex gap-2 md:gap-4 w-full justify-center flex-wrap">
                  <div className="text-center">
                    <img src="/examples/exemplo-epico-menina-antes.jpg" alt="Antes - Épico" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center">
                    <img src="/examples/exemplo-epico-menina-depois.jpg" alt="Depois - Épico" className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-orange-600">🏛️ Épico</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button
                onClick={handleStartApp}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Crie Sua Transformação
              </Button>
            </div>
          </div>
        </section>

        {/* Seção Hero - FUNDO BRANCO */}
        <section className="bg-white py-12 md:py-20">
          <div className="container max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">
                    Powered by IA Generativa
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-black">ESPELHO</span> <br />
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    AI
                  </span>
                </h2>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Transforme suas fotos com IA! Seja um guerreiro grego, rainha viking ou imperador romano. Vire um crime boss dos anos 1920 ou uma femme fatale moderna. Veja-se como uma obra de Van Gogh, Picasso ou Monet. Ou brilhe como um artista de circo! 7 estilos incríveis para descobrir.
                </p>
                
                <div className="bg-blue-900 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm font-medium text-blue-100">
                    💡 <strong>Dica:</strong> O ESPELHO AI oferece melhores resultados com fotos individuais ou até duas pessoas.
                  </p>
                </div>
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
                  className="text-lg h-14 px-8 rounded-full border-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ver exemplos
                </Button>
              </div>

              {/* Features - 6 CATEGORIAS FINAIS - CLICÁVEIS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {/* DESTAQUE: Épico */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border-2 border-yellow-500/50 hover:border-yellow-500 hover:bg-yellow-50 transition-all cursor-pointer text-left shadow-md"
                >
                  <div className="text-3xl font-bold text-yellow-600">⚔️</div>
                  <p className="font-semibold text-black">Épico</p>
                  <p className="text-sm text-gray-600">Romanos, Gregos, Vikings</p>
                </button>
                {/* DESTAQUE: Gangster */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border-2 border-gray-700/50 hover:border-gray-700 hover:bg-gray-100 transition-all cursor-pointer text-left shadow-md"
                >
                  <div className="text-3xl font-bold text-gray-700">🎩</div>
                  <p className="font-semibold text-black">Gangster 1920s</p>
                  <p className="text-sm text-gray-600">Era da Lei Seca</p>
                </button>
                {/* DESTAQUE: Pintura */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-left shadow-md"
                >
                  <div className="text-3xl font-bold text-blue-400">🎨</div>
                  <p className="font-semibold text-black">Pintura</p>
                  <p className="text-sm text-gray-600">Van Gogh, Picasso, Monet...</p>
                </button>
                {/* DESTAQUE: Circo */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border-2 border-red-500/50 hover:border-red-500 hover:bg-red-50 transition-all cursor-pointer text-left shadow-md"
                >
                  <div className="text-3xl font-bold text-red-500">🎪</div>
                  <p className="font-semibold text-black">Circo</p>
                  <p className="text-sm text-gray-600">Acrobatas, Palhaços, Mágicos...</p>
                </button>
                {/* SECUNDÁRIO: Gênero */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-pink-500/50 hover:bg-gray-100 transition-all cursor-pointer text-left"
                >
                  <div className="text-3xl font-bold text-pink-400">⚧️</div>
                  <p className="font-semibold text-black">Gênero</p>
                  <p className="text-sm text-gray-600">Se tivesse nascido...</p>
                </button>
                {/* SECUNDÁRIO: Bichinho */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-orange-500/50 hover:bg-gray-100 transition-all cursor-pointer text-left"
                >
                  <div className="text-3xl font-bold text-orange-400">🐾</div>
                  <p className="font-semibold text-black">Bichinho</p>
                  <p className="text-sm text-gray-600">Animal adorável</p>
                </button>
                {/* SECUNDÁRIO: Monstro */}
                <button
                  onClick={handleStartApp}
                  className="space-y-2 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-purple-500/50 hover:bg-gray-100 transition-all cursor-pointer text-left"
                >
                  <div className="text-3xl font-bold text-purple-400">👾</div>
                  <p className="font-semibold text-black">Monstro</p>
                  <p className="text-sm text-gray-600">Criatura fofa</p>
                </button>
              </div>
            </div>

            {/* Social Proof / Stats */}
            <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  10K+
                </p>
                <p className="text-gray-600 mt-2">Transformações realizadas</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  98%
                </p>
                <p className="text-gray-600 mt-2">Compartilharam o resultado</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  7 Temas
                </p>
                <p className="text-gray-600 mt-2">Para explorar</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Planos de Créditos - FUNDO PRETO */}
        <section className="bg-black py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white mb-4">Planos de Créditos</h3>
              <p className="text-xl text-gray-400">Escolha o melhor plano para você e comece a transformar suas fotos!</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative bg-gray-900 ${plan.borderColor} border-2 p-6 space-y-4 hover:scale-105 transition-transform`}
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
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
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
          </div>
        </section>

        {/* Seção de Dúvidas Frequentes - FUNDO BRANCO */}
        <section className="bg-white py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-black mb-4">Dúvidas Frequentes</h3>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-gray-50 border-gray-200 p-6 space-y-3">
                  <h4 className="text-lg font-semibold text-orange-500">{faq.question}</h4>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Contato - FUNDO PRETO */}
        <section className="bg-black py-20">
          <div className="container">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-800 p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold text-white mb-4">Contato</h3>
                <p className="text-xl text-gray-300">Fale conosco para dúvidas ou sugestões</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Informações de Contato */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
                    <div className="flex gap-4">
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                        <Facebook className="w-6 h-6 text-white" />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                        <Youtube className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                    <p className="text-gray-400">contato@espelhoai.com.br</p>
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
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Sua mensagem..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
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
          </div>
        </section>
      </main>

      {/* Footer - FUNDO PRETO */}
      <footer className="border-t border-gray-800 bg-black backdrop-blur-sm">
        <div className="container py-8 space-y-4">
          <div className="text-center text-gray-400">
            <p>
              Desenvolvido por <span className="font-bold text-orange-400">Paulo Barboni</span>
            </p>
            <p className="text-sm mt-2">
              Transformando fotos em diversão desde 2025 ✨
            </p>
          </div>
          <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-4">
            <p>© 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
