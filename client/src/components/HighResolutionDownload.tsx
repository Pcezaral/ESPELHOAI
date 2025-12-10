import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, Shirt, Coffee, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface HighResolutionDownloadProps {
  imageUrl: string;
  theme: string;
  onDownload?: (resolution: "hd" | "4k") => void;
}

export default function HighResolutionDownload({
  imageUrl,
  theme,
  onDownload,
}: HighResolutionDownloadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<"hd" | "4k" | null>(null);

  const resolutions = [
    {
      id: "hd",
      name: "HD - 2400x2400",
      dpi: "300 DPI",
      credits: 10,
      price: "R$ 10,00",
      description: "Perfeito para camisetas e canecas",
      icon: Shirt,
    },
    {
      id: "4k",
      name: "4K - 4800x4800",
      dpi: "600 DPI",
      credits: 25,
      price: "R$ 25,00",
      description: "Ideal para posters e impressão profissional",
      icon: ImageIcon,
    },
  ];

  const handleDownload = (resolution: "hd" | "4k") => {
    setSelectedResolution(resolution);
    const res = resolutions.find((r) => r.id === resolution);
    
    toast.success(`Download iniciado! ${res?.credits} créditos debitados.`);
    
    if (onDownload) {
      onDownload(resolution);
    }
    
    setIsOpen(false);
    setSelectedResolution(null);
  };

  return (
    <>
      {/* Botão de Download Premium */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-orange-600 mb-1">🎁 Não perca a chance!</h3>
            <p className="text-sm text-gray-700">
              Baixe sua imagem transformada em alta resolução!
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Para impressão em camisetas, canecas, fotos e posters
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Premium
          </Button>
        </div>
      </div>

      {/* Modal de Seleção de Resolução */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Baixe em Alta Resolução</DialogTitle>
            <DialogDescription>
              Escolha a resolução ideal para seu projeto
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {resolutions.map((res) => {
              const Icon = res.icon;
              return (
                <Card
                  key={res.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedResolution === res.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => handleDownload(res.id as "hd" | "4k")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{res.name}</h3>
                      <p className="text-sm text-gray-600">{res.dpi}</p>
                    </div>
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{res.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Custo:</p>
                      <p className="font-bold text-orange-600">{res.credits} créditos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Preço:</p>
                      <p className="font-bold text-gray-900">{res.price}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleDownload(res.id as "hd" | "4k")}
                  >
                    Baixar Agora
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Exemplos de Uso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Dicas de uso:</p>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>HD (300 DPI):</strong> Camisetas, canecas, fotos 10x15cm</li>
                  <li>• <strong>4K (600 DPI):</strong> Posters, quadros, impressão profissional</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mockups de Produtos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <img src="/mockup-camiseta-crianca.png" alt="Camiseta" className="w-full h-32 object-cover rounded-lg mb-2" />
              <p className="text-xs font-semibold">Camiseta</p>
            </div>
            <div className="text-center">
              <img src="/mockup-caneca-crianca.png" alt="Caneca" className="w-full h-32 object-cover rounded-lg mb-2" />
              <p className="text-xs font-semibold">Caneca</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
