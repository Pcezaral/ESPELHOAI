import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2, Zap, Sparkles, Crown, Infinity as InfinityIcon, Check, MessageSquare } from "lucide-react";
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
                <img src="/hero-mulher-1.png" alt="Mulher" className="h-48 w-40 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-1.png" alt="Homem" className="h-48 w-40 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
              
              {/* Direita: Mulher e Homem Verticais */}
              <div className="flex flex-col gap-4 items-center">
                <img src="/hero-mulher-2.png" alt="Mulher" className="h-48 w-40 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-2.png" alt="Homem" className="h-48 w-40 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
            </div>
            
            {/* Fotos em mobile: abaixo do logo e apresentação */}
            <div className="md:hidden flex flex-row gap-2 w-full justify-center">
              <div className="flex flex-col gap-1 items-center">
                <img src="/hero-mulher-1.png" alt="Mulher" className="h-40 w-36 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-1.png" alt="Homem" className="h-40 w-36 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <img src="/hero-mulher-2.png" alt="Mulher" className="h-40 w-36 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
                <img src="/hero-homem-2.png" alt="Homem" className="h-40 w-36 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer" />
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
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-8 lg:px-16 min-w-max md:min-w-full">
              {/* Exemplo 1: Bichinho */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-bichinho.png" alt="Brad Pitt transformado em cachorro" className="w-64 h-32 md:w-80 md:h-40 object-contain rounded-lg shadow-lg" />
                <p className="font-semibold text-base md:text-lg text-pink-600">🐶 Bichinho</p>
              </div>
              
              {/* Exemplo 2: Épico */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-epico.png" alt="Homem transformado em imperador romano" className="w-64 h-32 md:w-80 md:h-40 object-contain rounded-lg shadow-lg" />
                <p className="font-semibold text-base md:text-lg text-orange-600">🏛️ Épico</p>
              </div>
              
              {/* Exemplo 3: Monstro */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-monstro.png" alt="Homem transformado em monstro colorido" className="w-64 h-32 md:w-80 md:h-40 object-contain rounded-lg shadow-lg" />
                <p className="font-semibold text-base md:text-lg text-green-600">👾 Monstro</p>
              </div>
              
              {/* Exemplo 4: Pintura */}
              <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <img src="/example-pintura.png" alt="Homem transformado em pintura militar" className="w-64 h-32 md:w-80 md:h-40 object-contain rounded-lg shadow-lg" />
                <p className="font-semibold text-base md:text-lg text-purple-600">🎨 Pintura</p>
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

      {/* Planos Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Escolha Seu Pacote</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Transformações ilimitadas ou pacotes de créditos</p>
          
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
                  <span className="text-sm">Compartilhamento ilimitado</span>
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
                <p className="text-gray-600">200 Créditos + Extras</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">200 transformações</span>
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

            {/* Ilimitado Mensal */}
            <Card className="p-6 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-xl">
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ilimitado Mensal</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">R$ 29,90</div>
                <p className="text-gray-600">por mês</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Transformações ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Todos os 6 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Download em alta qualidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Renovação automática</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Cancele quando quiser</span>
                </li>
              </ul>
              <Button onClick={() => setLocation("/planos")} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Escolher Mensal
              </Button>
            </Card>

            {/* Ilimitado Anual */}
            <Card className="p-6 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all hover:shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MELHOR CUSTO
              </div>
              <div className="text-center mb-4">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white mb-3">
                  <InfinityIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ilimitado Anual</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">R$ 119,90</div>
                <p className="text-gray-600">por ano</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Transformações ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Todos os 6 estilos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Download em alta qualidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Economize R$ 238,90/ano</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Cancele quando quiser</span>
                </li>
              </ul>
              <Button onClick={() => setLocation("/planos")} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                Escolher Anual
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
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
          </div>
        </div>
      </section>
    </div>
  );
}
