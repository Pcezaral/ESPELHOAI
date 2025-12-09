import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Zap } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleStartApp = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else {
      setLocation("/app");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header com Logo e Créditos */}
      <header className="bg-black text-white py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
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
      <section className="bg-black py-16 md:py-24">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
            {/* Centro: Logo e Textos - Sempre no topo */}
            <div className="flex flex-col items-center space-y-6 text-center w-full md:w-auto">
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
            
            {/* Fotos: 2 de cada lado em desktop, abaixo em mobile */}
            <div className="hidden md:flex flex-row items-center justify-center gap-12 w-full">
              {/* Esquerda: Mulher e Homem Verticais */}
              <div className="flex flex-col gap-4 items-center">
                <img src="/hero-mulher-1.png" alt="Mulher" className="h-40 w-32 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-1.png" alt="Homem" className="h-40 w-32 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
              
              {/* Direita: Mulher e Homem Verticais */}
              <div className="flex flex-col gap-4 items-center">
                <img src="/hero-mulher-2.png" alt="Mulher" className="h-40 w-32 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-2.png" alt="Homem" className="h-40 w-32 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
            </div>
            
            {/* Fotos em mobile: abaixo do logo e apresentação */}
            <div className="md:hidden flex flex-col gap-4 w-full items-center">
              <div className="flex flex-col gap-3 items-center">
                <img src="/hero-mulher-1.png" alt="Mulher" className="h-28 w-20 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-1.png" alt="Homem" className="h-28 w-20 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-3 items-center">
                <img src="/hero-mulher-2.png" alt="Mulher" className="h-28 w-20 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-2.png" alt="Homem" className="h-28 w-20 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Exemplos de Transformações - Antes/Depois */}
      <section className="bg-white py-12 md:py-20">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-center mb-4">Veja a Magia Acontecer</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Transformações incríveis em segundos</p>
          
          {/* Container com scroll horizontal em mobile */}
          <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 lg:px-16 min-w-max md:min-w-full">
              {/* Exemplo 1: Pintura */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0 w-44 md:w-auto">
                <div className="flex gap-0 justify-center items-center">
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-pintura-mulher-antes.jpg" alt="Antes - Pintura" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-pintura-mulher-depois.jpg" alt="Depois - Pintura" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-pink-600">🎨 Pintura</p>
              </div>
              
              {/* Exemplo 2: Monstro */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0 w-44 md:w-auto">
                <div className="flex gap-0 justify-center items-center">
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-monstro-mulher-antes.jpg" alt="Antes - Monstro" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-monstro-mulher-depois.jpg" alt="Depois - Monstro" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-green-600">👾 Monstro</p>
              </div>
              
              {/* Exemplo 3: Épico */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0 w-44 md:w-auto">
                <div className="flex gap-0 justify-center items-center">
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-epico-menina-antes.jpg" alt="Antes - Épico" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Antes</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <img src="/examples/exemplo-epico-menina-depois.jpg" alt="Depois - Épico" className="w-16 h-24 md:w-28 md:h-40 object-cover rounded-lg shadow-md" />
                    <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">Depois</p>
                  </div>
                </div>
                <p className="font-semibold text-base md:text-lg text-orange-600">🏛️ Épico</p>
              </div>
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

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quanto tempo leva para gerar uma transformação?</h3>
              <p className="text-gray-600">Geralmente entre 30 segundos a 2 minutos, dependendo do estilo escolhido.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantos créditos cada transformação custa?</h3>
              <p className="text-gray-600">Cada transformação custa 1 crédito. Novos usuários recebem 5 créditos grátis!</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Posso usar fotos de outras pessoas?</h3>
              <p className="text-gray-600">Sim, mas certifique-se de ter permissão. Respeite a privacidade e direitos autorais.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qual é a qualidade das imagens geradas?</h3>
              <p className="text-gray-600">Nossas transformações usam IA de última geração para máxima qualidade e realismo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para se transformar?</h2>
          <p className="text-lg mb-8 opacity-90">Use seus 5 créditos grátis agora mesmo!</p>
          <Button
            onClick={handleStartApp}
            disabled={loading}
            className="bg-white text-orange-500 hover:bg-gray-100 text-lg h-14 px-12 rounded-full font-semibold"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            {loading ? "Carregando..." : "Começar Agora"}
          </Button>
        </div>
      </section>
    </div>
  );
}
