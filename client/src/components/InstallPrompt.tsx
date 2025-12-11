import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, X, Smartphone, Apple, Monitor, Zap, Gift } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    // Detectar plataforma
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
      setPlatform("android");
    } else if (/iphone|ipad|ipot/.test(ua)) {
      setPlatform("ios");
    } else {
      setPlatform("desktop");
    }

    // Verificar se app já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listener para beforeinstallprompt (Android, Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log("[PWA] Install prompt available");
      // Mostrar IMEDIATAMENTE (0 segundos)
      setShowBanner(true);
      setTimeout(() => {
        setIsOpen(true);
      }, 500); // Pequeno delay para UX
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listener para app installed
    const handleAppInstalled = () => {
      console.log("[PWA] App installed successfully");
      setIsInstalled(true);
      setIsOpen(false);
      setShowBanner(false);
      setDeferredPrompt(null);
      toast.success("✅ App instalado! Você ganhou 5 créditos grátis! 🎉");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Se não houver prompt nativo mas for iOS, mostrar banner
    setTimeout(() => {
      if (!deferredPrompt && platform === "ios" && !isInstalled) {
        setShowBanner(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [deferredPrompt, platform, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("Instalação não disponível neste momento");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        console.log("[PWA] User accepted install");
        toast.success("✅ App instalado com sucesso! 🎉");
      } else {
        console.log("[PWA] User dismissed install");
      }
      
      setDeferredPrompt(null);
      setIsOpen(false);
      setShowBanner(false);
    } catch (error) {
      console.error("[PWA] Install error:", error);
      toast.error("Erro ao instalar o app");
    }
  };

  const handleIOSInstall = () => {
    toast.info(
      "📱 No iOS, toque em Compartilhar → Adicionar à Tela Inicial para instalar",
      { duration: 5000 }
    );
    setIsOpen(false);
    setShowBanner(false);
  };

  const handleDesktopInstall = async () => {
    if (deferredPrompt) {
      await handleInstallClick();
    } else {
      toast.info(
        "💻 Clique nos 3 pontinhos do navegador → Instalar app ou Adicionar à tela inicial",
        { duration: 5000 }
      );
      setIsOpen(false);
      setShowBanner(false);
    }
  };

  // Não mostrar se já instalado
  if (isInstalled) {
    return null;
  }

  // Banner fixo no topo (SUPER VISÍVEL)
  if (showBanner && (deferredPrompt || platform === "ios")) {
    return (
      <>
        {/* Banner fixo no topo */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg animate-pulse">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 animate-bounce" />
              <div>
                <div className="font-bold text-sm">🎁 Instale Agora e Ganhe 5 Créditos Grátis!</div>
                <div className="text-xs opacity-90">Transforme fotos em estilos incríveis</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}
                size="sm"
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold"
              >
                <Download className="w-4 h-4 mr-1" />
                Instalar
              </Button>
              <Button
                onClick={() => setShowBanner(false)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Modal detalhado */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Gift className="w-6 h-6 text-orange-500" />
                Instale e Ganhe 5 Créditos!
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Transforme suas fotos em estilos incríveis
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              {/* Destaque do bônus */}
              <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white text-lg">5 Créditos Grátis</div>
                    <div className="text-sm text-slate-300">Ao instalar o app agora</div>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Acesso Rápido</div>
                    <div className="text-sm text-slate-400">Abra direto da tela inicial</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-pink-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Mais Rápido</div>
                    <div className="text-sm text-slate-400">Sem barras do navegador</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Download className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Funciona Offline</div>
                    <div className="text-sm text-slate-400">Use sem conexão</div>
                  </div>
                </div>
              </div>

              {/* Instruções por plataforma */}
              {platform === "ios" && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Apple className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white text-sm">Para iPhone/iPad:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        1. Toque em Compartilhar (↗️)
                        <br />
                        2. "Adicionar à Tela Inicial"
                        <br />
                        3. Toque em "Adicionar"
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {platform === "android" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Smartphone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white text-sm">Para Android:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Clique em "Instalar Agora" para adicionar à tela inicial
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {platform === "desktop" && (
                <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Monitor className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white text-sm">Para Desktop:</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Clique em "Instalar Agora" ou use o menu (3 pontinhos) → Instalar app
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  setShowBanner(false);
                }}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-800"
              >
                <X className="w-4 h-4 mr-2" />
                Depois
              </Button>

              {platform === "ios" ? (
                <Button
                  onClick={handleIOSInstall}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 gap-2 font-bold"
                >
                  <Apple className="w-4 h-4" />
                  Instruções
                </Button>
              ) : (
                <Button
                  onClick={platform === "android" ? handleInstallClick : handleDesktopInstall}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 gap-2 font-bold"
                >
                  <Download className="w-4 h-4" />
                  Instalar Agora
                </Button>
              )}
            </div>

            <div className="text-xs text-slate-500 text-center mt-4">
              ✨ Ganhe 5 créditos ao instalar!
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}
