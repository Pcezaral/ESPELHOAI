import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

interface GenderRefineFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (genderStyle: "feminine" | "masculine" | "neutral") => Promise<void>;
  isLoading?: boolean;
}

export function GenderRefineFilter({ isOpen, onClose, onRefine, isLoading = false }: GenderRefineFilterProps) {
  const [selectedStyle, setSelectedStyle] = useState<"feminine" | "masculine" | "neutral" | null>(null);

  const handleRefine = async () => {
    if (selectedStyle) {
      await onRefine(selectedStyle);
      setSelectedStyle(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Refinar Transformação</DialogTitle>
          <DialogDescription>
            Escolha um estilo para regenerar a transformação com uma abordagem diferente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="text-sm text-gray-600 mb-4">
            Não gostou do resultado? Regenere com um estilo diferente:
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Feminine Option */}
            <button
              onClick={() => setSelectedStyle("feminine")}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedStyle === "feminine"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="font-semibold text-pink-600">👩 Mais Feminino</div>
              <div className="text-sm text-gray-600">Características e roupas mais femininas</div>
            </button>

            {/* Masculine Option */}
            <button
              onClick={() => setSelectedStyle("masculine")}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedStyle === "masculine"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="font-semibold text-blue-600">👨 Mais Masculino</div>
              <div className="text-sm text-gray-600">Características e roupas mais masculinas</div>
            </button>

            {/* Neutral Option */}
            <button
              onClick={() => setSelectedStyle("neutral")}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedStyle === "neutral"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="font-semibold text-purple-600">🌈 Neutro</div>
              <div className="text-sm text-gray-600">Características e roupas neutras</div>
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRefine}
              disabled={!selectedStyle || isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Refinar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
