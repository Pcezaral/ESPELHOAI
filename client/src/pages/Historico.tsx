import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function Historico() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-2xl font-bold">Histórico de Transformações</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card className="bg-slate-900 border-slate-700 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma Transformação Ainda</h2>
          <p className="text-slate-400 mb-6">
            Suas transformações aparecerão aqui. Comece a transformar suas fotos agora!
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
          >
            Ir para Transformador
          </Button>
        </Card>

        {/* Dica */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            💡 <strong>Dica:</strong> Você pode baixar e compartilhar suas transformações diretamente da página do gerador
          </p>
        </div>
      </main>
    </div>
  );
}
