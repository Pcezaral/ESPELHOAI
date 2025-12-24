import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertTriangle, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

/**
 * Componente que mostra notificação quando há transformações prestes a expirar.
 * Aparece como um banner fixo no topo da página.
 */
export function ExpirationNotification() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  // Query para itens expirando (só executa se autenticado)
  const { data: expiringData } = trpc.history.getExpiring.useQuery(
    undefined,
    { 
      enabled: isAuthenticated && !dismissed,
      refetchInterval: 5 * 60 * 1000, // Verificar a cada 5 minutos
    }
  );

  // Query para contagens
  const { data: counts } = trpc.history.getCounts.useQuery(
    undefined,
    { enabled: isAuthenticated && !dismissed }
  );

  // Mutation para marcar como notificado
  const markNotifiedMutation = trpc.history.markNotified.useMutation();

  // Marcar como notificado quando exibir
  useEffect(() => {
    if (expiringData?.transformations?.length && !hasShownToast) {
      setHasShownToast(true);
      const ids = expiringData.transformations.map(t => t.id);
      markNotifiedMutation.mutate({ transformationIds: ids });
    }
  }, [expiringData, hasShownToast]);

  // Não mostrar se não há itens expirando ou se foi dispensado
  if (!isAuthenticated || dismissed || !counts?.expiringSoon) {
    return null;
  }

  const count = counts.expiringSoon;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg animate-in slide-in-from-top duration-300">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base">
                ⚠️ {count} transformaç{count > 1 ? 'ões vão' : 'ão vai'} expirar em menos de 24 horas!
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Favorite para manter para sempre ⭐
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
              onClick={() => setLocation("/generator")}
            >
              <Star className="w-4 h-4 mr-1" />
              Ver Histórico
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
