import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Exemplos de produtos com transformações
  const products = [
    {
      id: 1,
      type: "camiseta",
      title: "Camiseta Épica - Guerreiro",
      description: "Transformação Épico em camiseta branca",
      image: "/mockup-camiseta-jovem.png",
      audience: "Jovens e Adultos",
      price: 10,
      credits: 10,
    },
    {
      id: 2,
      type: "caneca",
      title: "Caneca Pintura - Renascença",
      description: "Transformação Pintura em caneca cerâmica premium",
      image: "/mockup-caneca-adulto.png",
      audience: "Adultos",
      price: 10,
      credits: 10,
    },
    {
      id: 3,
      type: "camiseta",
      title: "Camiseta Bichinho - Cachorro",
      description: "Transformação Bichinho em camiseta infantil",
      image: "/mockup-camiseta-crianca.png",
      audience: "Crianças",
      price: 10,
      credits: 10,
    },
    {
      id: 4,
      type: "poster",
      title: "Poster Premium - Pintura Clássica",
      description: "Transformação em poster 4K de qualidade museu",
      image: "/mockup-caneca-crianca.png",
      audience: "Todos",
      price: 25,
      credits: 25,
    },
    {
      id: 5,
      type: "camiseta",
      title: "Camiseta Gangster - 1920s",
      description: "Transformação Gangster em camiseta preta",
      image: "/mockup-camiseta-adulto.png",
      audience: "Adultos",
      price: 10,
      credits: 10,
    },
    {
      id: 6,
      type: "caneca",
      title: "Caneca Monstro - Colorida",
      description: "Transformação Monstro em caneca personalizada",
      image: "/mockup-caneca-crianca.png",
      audience: "Crianças e Jovens",
      price: 10,
      credits: 10,
    },
  ];

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateProduct = () => {
    setLocation("/generator");
  };

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
            Galeria de <span className="text-orange-500">Produtos</span>
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Seção Hero */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-white">
            Inspire-se com Produtos Personalizados
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Veja como outras pessoas transformaram suas fotos em camisetas, canecas e posters únicos.
            Você também pode criar o seu!
          </p>
          <Button
            onClick={handleCreateProduct}
            className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Criar Meu Produto Agora
          </Button>
        </div>

        {/* Grid de Produtos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900/50 rounded-lg h-96 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-slate-900/50 border-slate-800 overflow-hidden hover:border-orange-500/50 transition-all group"
              >
                {/* Imagem do Produto */}
                <div className="relative h-64 bg-slate-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.type === "camiseta" && "👕"}
                      {product.type === "caneca" && "☕"}
                      {product.type === "poster" && "🖼️"}
                      {" "}
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                    <p className="text-slate-400 text-sm">{product.description}</p>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Público:</span>
                      <span className="text-white font-semibold">{product.audience}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Preço:</span>
                      <span className="text-orange-400 font-bold text-lg">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Créditos:</span>
                      <span className="text-orange-400 font-bold">
                        ⚡ {product.credits}
                      </span>
                    </div>
                  </div>

                  {/* Botão */}
                  <Button
                    onClick={handleCreateProduct}
                    className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Criar Produto Similar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Seção CTA Final */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-3xl font-bold text-white">
            Pronto para criar seu próprio produto?
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Escolha um dos 9 estilos incríveis e transforme sua foto em um produto único para você
            ou como presente para alguém especial.
          </p>
          <Button
            onClick={handleCreateProduct}
            size="lg"
            className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Começar Agora
          </Button>
        </div>
      </main>
    </div>
  );
}
