import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface HighResolutionDownloadProps {
  imageUrl: string;
  theme?: string;
}

type ResolutionType = "hd" | "4k";

export function HighResolutionDownload({ imageUrl, theme }: HighResolutionDownloadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<"camiseta" | "caneca" | "poster" | null>(null);

  const downloadMutation = trpc.generation.downloadHighResolution.useMutation();

  const resolutions = [
    {
      id: "hd" as ResolutionType,
      name: "HD (300 DPI)",
      size: "2400x2400px",
      description: "Perfeito para camisetas e canecas",
      credits: 5,
      price: "R$ 5",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "4k" as ResolutionType,
      name: "Premium 4K (600 DPI)",
      size: "4800x6000px",
      description: "Qualidade máxima para fotos e posters",
      credits: 10,
      price: "R$ 10",
      color: "from-purple-500 to-pink-500",
      badge: "MELHOR QUALIDADE",
    },
  ];

  const products = [
    { id: "camiseta", name: "👕 Camiseta", description: "Estampa em camiseta de qualidade" },
    { id: "caneca", name: "☕ Caneca", description: "Impressão em caneca cerâmica" },
    { id: "poster", name: "🖼️ Poster", description: "Impressão em papel fotográfico" },
  ];

  const handleDownload = async () => {
    if (!selectedResolution || !selectedProduct) {
      toast.error("Selecione a resolução e o produto");
      return;
    }

    try {
      downloadMutation.mutate(
        {
          imageUrl,
          resolution: selectedResolution,
          product: selectedProduct as "camiseta" | "caneca" | "poster",
          theme: theme || "unknown",
        },
        {
          onSuccess: () => {
            toast.success("Download iniciado! Você será redirecionado em breve.");
            setIsOpen(false);
            setSelectedResolution(null);
            setSelectedProduct(null);
          },
          onError: (error: any) => {
            toast.error(error.message || "Erro ao processar download");
          },
        }
      );
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao processar download");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Não perca a chance!
            </h3>
            <p className="text-slate-300">
              Baixe suas imagens transformadas em alta resolução para impressão em produtos físicos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resolutions.map((res) => (
            <button
              key={res.id}
              onClick={() => setSelectedResolution(res.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedResolution === res.id
                  ? `border-${res.id === "hd" ? "blue" : "purple"}-500 bg-slate-800/50`
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <p className="font-semibold text-white">{res.name}</p>
              <p className="text-sm text-slate-400">{res.size}</p>
              <p className="text-sm text-slate-300 mt-1">{res.credits} créditos • {res.price}</p>
            </button>
          ))}
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          disabled={downloadMutation.isPending}
          className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          {downloadMutation.isPending ? "Processando..." : "Baixar em Alta Resolução"}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Escolha seu Produto</DialogTitle>
            <DialogDescription className="text-slate-400">
              Selecione o produto onde deseja imprimir sua transformação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Seleção de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.id as "camiseta" | "caneca" | "poster")}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedProduct === product.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <p className="text-2xl mb-2">{product.name.split(" ")[0]}</p>
                  <p className="text-sm text-slate-300">{product.name}</p>
                  <p className="text-xs text-slate-400 mt-2">{product.description}</p>
                </button>
              ))}
            </div>

            {/* Mockup Preview com Imagem Gerada */}
            {selectedProduct && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <p className="text-white font-semibold text-center">Prévia do Produto</p>
                <div className="bg-slate-800 rounded-lg p-8 flex items-center justify-center min-h-80">
                  <div className="text-center space-y-4 w-full">
                    {/* Mockup Camiseta */}
                    {selectedProduct === "camiseta" && (
                      <div className="flex justify-center">
                        <div className="relative w-48 h-64">
                          {/* Corpo da camiseta */}
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 rounded-b-3xl rounded-t-2xl shadow-2xl"></div>
                          {/* Gola */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-blue-700 rounded-b-lg"></div>
                          {/* Área de impressão com imagem */}
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-36 h-36 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
                            <img
                              src={imageUrl}
                              alt="Transformação"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mockup Caneca */}
                    {selectedProduct === "caneca" && (
                      <div className="flex justify-center">
                        <div className="relative w-44 h-56">
                          {/* Corpo da caneca */}
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-50 rounded-b-3xl rounded-t-lg shadow-2xl border-4 border-amber-200"></div>
                          {/* Alça */}
                          <div className="absolute right-0 top-8 w-8 h-20 border-4 border-amber-200 rounded-r-full"></div>
                          {/* Área de impressão */}
                          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-white rounded shadow-lg overflow-hidden border border-amber-300">
                            <img
                              src={imageUrl}
                              alt="Transformação"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mockup Poster */}
                    {selectedProduct === "poster" && (
                      <div className="flex justify-center">
                        <div className="relative w-40 h-56">
                          {/* Moldura do poster */}
                          <div className="absolute inset-0 bg-white rounded-lg shadow-2xl border-8 border-gray-400"></div>
                          {/* Imagem do poster */}
                          <img
                            src={imageUrl}
                            alt="Transformação"
                            className="absolute inset-2 rounded object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-slate-400 text-sm mt-4">
                      {selectedProduct === "camiseta" && "👕 Sua transformação em uma camiseta premium"}
                      {selectedProduct === "caneca" && "☕ Sua transformação em uma caneca cerâmica"}
                      {selectedProduct === "poster" && "🖼️ Sua transformação em um poster fotográfico"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo */}
            {selectedResolution && selectedProduct && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Resolução:</span>
                  <span className="text-white font-semibold">
                    {resolutions.find((r) => r.id === selectedResolution)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Produto:</span>
                  <span className="text-white font-semibold">
                    {products.find((p) => p.id === selectedProduct)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-slate-300">Créditos:</span>
                  <span className="text-orange-400 font-bold text-lg">
                    {resolutions.find((r) => r.id === selectedResolution)?.credits}
                  </span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1 border-slate-700 text-white hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!selectedResolution || !selectedProduct || downloadMutation.isPending}
                className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Sparkles className="w-4 h-4" />
                {downloadMutation.isPending ? "Processando..." : "Confirmar Compra"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
