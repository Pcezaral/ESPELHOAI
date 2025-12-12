import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";

export default function Gallery() {
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-white">Galeria de Exemplos</h2>
            <p className="text-slate-300 text-lg">
              Veja algumas transformações incríveis feitas por nossos usuários
            </p>
          </div>

          <Card className="bg-slate-900/50 border-orange-500/30 p-12">
            <div className="text-center space-y-4">
              <p className="text-2xl text-slate-300">
                🎨 Em breve! 🎨
              </p>
              <p className="text-slate-400">
                Estamos preparando uma galeria incrível com exemplos de transformações.
              </p>
              <Button
                onClick={() => setLocation("/generator")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              >
                Criar minha transformação
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
