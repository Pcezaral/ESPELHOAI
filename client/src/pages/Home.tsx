import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import DownloadButtons from "@/components/DownloadButtons";

import React from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Wand2, Zap, Sparkles, Crown, Infinity as InfinityIcon, Check, MessageSquare, Share2, Gift, Download } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Modal de boas-vindas desabilitado - não mostrar automaticamente
  useEffect(() => {
    // Apenas marcar como visto para evitar mostrar no futuro
    if (isAuthenticated && user && user.credits && user.credits >= 5 && !hasSeenWelcome) {
      setHasSeenWelcome(true);
      sessionStorage.setItem('welcomeModalSeen', 'true');
    }
  }, [isAuthenticated, user, hasSeenWelcome]);

  const handleStartFromModal = () => {
    setShowWelcomeModal(false);
    setLocation("/generator");
  };

  const handleStartApp = (theme?: string | React.MouseEvent) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else {
      if (theme && typeof theme === 'string') {
        setLocation(`/generator?theme=${theme}`);
      } else {
        setLocation("/generator");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header com Logo e Créditos */}
      <header className="bg-black text-white py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">Surpreenda sua Família e Amigos!</span>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full">
              <span className="text-orange-400">⚡</span>
              <span className="font-semibold">{user?.credits || 0} créditos</span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl animate-float-slow">🏛️</div>
          <div className="absolute top-20 right-20 text-5xl animate-float-medium">🗽</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-fast">🏛️</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-float-slow">🗾</div>
          <div className="absolute top-1/3 left-1/4 text-5xl animate-float-medium">🏯</div>
          <div className="absolute top-2/3 right-1/3 text-6xl animate-float-fast">🗼</div>
          <div className="absolute top-1/2 left-1/2 text-7xl animate-float-slow">🏯</div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
            {/* Centro: Logo e Textos - Sempre no topo */}
            <div className="flex flex-col items-center space-y-6 text-center w-full md:w-auto">
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
                  <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                    🎄 + ESPECIAL FINAL DE ANO: Natal e Réveillon! 🎆
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
                  {loading ? "Carregando..." : "Use seus 5 créditos agora!"}
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
            
            {/* Fotos: 4 exemplos antes/depois - Vertical mobile, 2 colunas desktop */}
            <div className="w-full max-w-4xl">
              {/* Mobile: 4 imagens verticais com gap mínimo */}
              <div className="flex flex-col gap-1 items-center md:hidden">
                <img src="/hero-exemplo-1.png" alt="Exemplo Pintura" className="w-full max-w-md object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-2.png" alt="Exemplo Monstro" className="w-full max-w-md object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-3.png" alt="Exemplo Épico" className="w-full max-w-md object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-4.png" alt="Exemplo Bichinho" className="w-full max-w-md object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
              </div>
              
              {/* Desktop: 2 colunas com 2 imagens cada */}
              <div className="hidden md:grid md:grid-cols-2 gap-6">
                <img src="/hero-exemplo-1.png" alt="Exemplo Pintura" className="w-full object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-2.png" alt="Exemplo Monstro" className="w-full object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-3.png" alt="Exemplo Épico" className="w-full object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
                <img src="/hero-exemplo-4.png" alt="Exemplo Bichinho" className="w-full object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Seção FINAL DE ANO ESPECIAL */}
      <section className="bg-gradient-to-br from-red-50 via-white to-blue-50 py-12 md:py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl animate-float-slow">🎄</div>
          <div className="absolute top-20 right-20 text-5xl animate-float-medium">🎆</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-fast">🎅</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-float-slow">🎇</div>
          <div className="absolute top-1/3 left-1/4 text-5xl animate-float-medium">❄️</div>
          <div className="absolute top-2/3 right-1/3 text-6xl animate-float-fast">🎉</div>
        </div>
        
        <div className="w-full">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">🎄 ESPECIAL FINAL DE ANO 🎆</span>
            <h2 className="text-4xl font-bold mb-4">Celebre com Estilo!</h2>
            <p className="text-gray-600 text-lg">Transforme-se para o Natal e Réveillon</p>
          </div>
          

          {/* Container com scroll horizontal em mobile */}
          <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0">
            <div className="flex md:grid md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-8 lg:px-16 min-w-max md:min-w-full justify-center">
              {/* Exemplo 1: Natal */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-natal-mamae-noel.png" alt="Transformação Natal" className="w-64 h-32 md:w-80 md:h-40 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer border-2 border-red-200" />
                <p className="font-semibold text-base md:text-lg text-red-600">🎄 Natal</p>
              </div>
              
              {/* Exemplo 2: Réveillon - Praia */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-reveillon-praia.png" alt="Transformação Réveillon" className="w-64 h-32 md:w-80 md:h-40 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer border-2 border-blue-200" />
                <p className="font-semibold text-base md:text-lg text-blue-600">🎆 Réveillon</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/generator?theme=natal')}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-lg h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              🎄 Natal
            </Button>
            <Button
              onClick={() => setLocation('/generator?theme=reveillon')}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white text-lg h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              🎆 Réveillon
            </Button>
          </div>
        </div>
      </section>



{/* Planos Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Botão Download App */}
          <div className="text-center mb-12">
            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://play.google.com/store/apps/details?id=com.espelhoai';
                link.target = '_blank';
                link.click();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixe o app Aqui
            </Button>
          </div>

          <h2 className="text-4xl font-bold text-center mb-4">Escolha Seu Pacote</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Escolha o pacote de créditos ideal para você</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Pacote Light */}
            <Card className="p-6 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-xl">
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pacote Light</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">R$ 9,90</div>
                <p className="text-gray-600">50 Créditos</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">50 transformações</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Todos os 6 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Download em alta qualidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Compartilhe suas criações</span>
                </li>
              </ul>
              <Button onClick={() => setLocation("/planos")} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Escolher Light
              </Button>
            </Card>

            {/* Pacote Premium */}
            <Card className="p-6 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all hover:shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white mb-3">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pacote Premium</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">R$ 19,90</div>
                <p className="text-gray-600">150 Créditos + Extras</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">150 transformações</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Todos os 6 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Download em alta qualidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Recursos e cursos extras</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Suporte prioritário</span>
                </li>
              </ul>
              <Button onClick={() => setLocation("/planos")} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Escolher Premium
              </Button>
            </Card>


          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          {/* Disclaimer Destaque */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">✨</span>
              <h3 className="text-xl font-bold text-green-700">Cancele a Qualquer Momento!</h3>
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-green-600 text-sm">Sem compromisso. Sem surpresas. Sem taxas ocultas. Porque confiamos que você vai amar o ESPELHO AI! 💚</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Como funciona o app?</h3>
              <p className="text-gray-600">Você carrega uma foto e o app cria versões engraçadas e criativas dela.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quais estilos estão disponíveis?</h3>
              <p className="text-gray-600">Temos bonequinhos, monstrinhos, pinturas antigas e personagens históricos para escolher.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Posso usar as imagens geradas?</h3>
              <p className="text-gray-600">Sim! As imagens são suas para compartilhar nas redes sociais ou guardar como quiser.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">O app é gratuito?</h3>
              <p className="text-gray-600">Você recebe créditos para gerar 1ª5 imagens, após isso, você pode escolher entre os três planos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Minhas fotos ficam salvas?</h3>
              <p className="text-gray-600">Não, respeitamos sua privacidade e não armazenamos suas fotos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✨ Posso cancelar a qualquer momento?</h3>
              <p className="text-green-700">Sim! Sem compromisso, sem taxas de cancelamento. Você é livre para cancelar sua assinatura quando quiser, diretamente na sua conta.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 mb-2">💚 Como faço para cancelar?</h3>
              <p className="text-green-700">Muito fácil! Acesse sua conta, vá em 'Minha Assinatura' e clique em 'Cancelar'. Seu acesso continua até o final do período pago.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compartilhe nas Redes Sociais */}
      <section className="bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Share2 className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Compartilhe com seus amigos!</h2>
          </div>
          <p className="text-gray-600 mb-8">Mostre suas transformações incríveis nas redes sociais</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="font-semibold">TikTok</span>
            </a>
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-semibold">Instagram</span>
            </a>
            
            {/* Facebook */}
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://descubraeu.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold">Facebook</span>
            </a>
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/?text=Descubra%20seu%20verdadeiro%20eu!%20https://descubraeu.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="font-semibold">WhatsApp</span>
            </a>
            
            {/* Twitter/X */}
            <a
              href="https://twitter.com/intent/tweet?text=Descubra%20seu%20verdadeiro%20eu!&url=https://descubraeu.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="font-semibold">Twitter</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para se transformar?</h2>
          <p className="text-lg mb-8 opacity-90">Use seus 5 créditos grátis agora mesmo!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleStartApp}
              disabled={loading}
              className="bg-white text-orange-500 hover:bg-gray-100 text-lg h-14 px-12 rounded-full font-semibold"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              {loading ? "Carregando..." : "Começar Agora"}
            </Button>
            <Button
              onClick={() => setLocation("/contato")}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg h-14 px-12 rounded-full font-semibold"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contato
            </Button>
            <Button
              onClick={() => setLocation("/suporte")}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg h-14 px-12 rounded-full font-semibold"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Suporte
            </Button>
          </div>
        </div>
      </section>

      {/* Footer com Links */}
      <footer className="bg-black text-slate-400 py-12 border-t border-slate-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">App</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setLocation("/")} className="hover:text-white transition">Home</a></li>
                <li><a href="#" onClick={() => setLocation("/planos")} className="hover:text-white transition">Planos</a></li>
                <li><a href="#" onClick={() => setLocation("/gallery")} className="hover:text-white transition">Galeria</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Comunidade</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setLocation("/leaderboard")} className="hover:text-white transition">Leaderboard</a></li>
                <li><a href="#" onClick={() => setLocation("/analytics")} className="hover:text-white transition">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setLocation("/suporte")} className="hover:text-white transition">Suporte</a></li>
                <li><a href="#" onClick={() => setLocation("/contato")} className="hover:text-white transition">Contato</a></li>
                <li><a href="#" onClick={() => setLocation("/about")} className="hover:text-white transition">Sobre</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setLocation("/privacidade")} className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" onClick={() => setLocation("/termos")} className="hover:text-white transition">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Boas-vindas com 5 Créditos */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Gift className="w-16 h-16 text-orange-500 animate-bounce" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">🎉 Parabéns!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Você ganhou <span className="font-bold text-orange-500">5 créditos grátis</span> por instalar o app!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Créditos Disponíveis */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">{user?.credits || 0}</div>
              <div className="text-sm text-orange-700">Créditos disponíveis</div>
            </div>

            {/* Benefícios */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Rápido</div>
                  <div className="text-sm text-gray-600">Transforme suas fotos em segundos</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wand2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Fácil</div>
                  <div className="text-sm text-gray-600">Escolha um estilo e pronto!</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Divertido</div>
                  <div className="text-sm text-gray-600">Compartilhe com seus amigos!</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowWelcomeModal(false)}
              variant="outline"
              className="flex-1"
            >
              Depois
            </Button>
            <Button
              onClick={handleStartFromModal}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Começar Agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
