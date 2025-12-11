import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ImageFiltersProps {
  imageUrl: string;
  onApplyFilters: (filters: FilterValues) => void;
  isLoading?: boolean;
}

export interface FilterValues {
  saturation: number; // 0-200 (100 = normal)
  brightness: number; // 0-200 (100 = normal)
  contrast: number;   // 0-200 (100 = normal)
}

const DEFAULT_FILTERS: FilterValues = {
  saturation: 100,
  brightness: 100,
  contrast: 100,
};

export function ImageFilters({ imageUrl, onApplyFilters, isLoading }: ImageFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterValues, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const filterStyle = {
    filter: `saturate(${filters.saturation}%) brightness(${filters.brightness}%) contrast(${filters.contrast}%)`,
  };

  return (
    <div className="w-full space-y-4">
      {/* Preview da imagem com filtros aplicados */}
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt="Preview com filtros"
          style={filterStyle}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Botão para expandir/recolher filtros */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full"
      >
        {showFilters ? "▼ Ocultar Filtros" : "▶ Mostrar Filtros"}
      </Button>

      {/* Painel de filtros */}
      {showFilters && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Saturação */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Saturação
              </label>
              <span className="text-sm font-semibold text-orange-600">
                {filters.saturation}%
              </span>
            </div>
            <Slider
              value={[filters.saturation]}
              onValueChange={(value) => handleFilterChange("saturation", value[0])}
              min={0}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Menos</span>
              <span>Normal</span>
              <span>Mais</span>
            </div>
          </div>

          {/* Brilho */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Brilho
              </label>
              <span className="text-sm font-semibold text-orange-600">
                {filters.brightness}%
              </span>
            </div>
            <Slider
              value={[filters.brightness]}
              onValueChange={(value) => handleFilterChange("brightness", value[0])}
              min={0}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Escuro</span>
              <span>Normal</span>
              <span>Claro</span>
            </div>
          </div>

          {/* Contraste */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Contraste
              </label>
              <span className="text-sm font-semibold text-orange-600">
                {filters.contrast}%
              </span>
            </div>
            <Slider
              value={[filters.contrast]}
              onValueChange={(value) => handleFilterChange("contrast", value[0])}
              min={0}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Baixo</span>
              <span>Normal</span>
              <span>Alto</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? "Aplicando..." : "Aplicar Filtros"}
            </Button>
          </div>
        </div>
      )}

      {/* Informação sobre filtros */}
      <p className="text-xs text-gray-500 text-center">
        💡 Use os filtros para ajustar saturação, brilho e contraste da sua imagem
      </p>
    </div>
  );
}
