import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";

export default function About() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {APP_TITLE}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-white">Sobre o Projeto</h2>
            <p className="text-slate-300 text-lg">
              Descubra quem você seria em outro mundo
            </p>
          </div>

          <Card className="bg-slate-900/50 border-orange-500/30 p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">O que é o {APP_TITLE}?</h3>
              <p className="text-slate-300 leading-relaxed">
                O {APP_TITLE} é uma aplicação divertida que usa inteligência artificial para transformar suas fotos em diferentes estilos e personagens. Envie uma foto e descubra como você seria como um monstrinho fofo, um animal adorável, um super-herói, uma obra de arte ou um personagem de cinema!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Como funciona?</h3>
              <p className="text-slate-300 leading-relaxed">
                Nossa tecnologia de IA analisa suas características faciais e as preserva enquanto aplica transformações criativas. O resultado é uma imagem única que mantém sua identidade enquanto te coloca em um mundo completamente novo!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Privacidade</h3>
              <p className="text-slate-300 leading-relaxed">
                Levamos sua privacidade a sério. Suas fotos são processadas de forma segura e não são compartilhadas com terceiros. Você tem controle total sobre suas imagens e pode baixá-las ou compartilhá-las quando quiser.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Desenvolvedor</h3>
              <p className="text-slate-300 leading-relaxed">
                Desenvolvido por <span className="font-bold text-orange-400">Paulo Barboni</span> com ❤️ usando tecnologias modernas de IA e web.
              </p>
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => setLocation("/generator")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            >
              Experimentar agora
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
