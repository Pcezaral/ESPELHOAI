import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, X, Smartphone, Apple, Monitor } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    // Detectar plataforma
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
      setPlatform("android");
    } else if (/iphone|ipad|ipod/.test(ua)) {
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
      // Mostrar prompt automaticamente após 3 segundos
      setTimeout(() => {
        setIsOpen(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listener para app installed
    const handleAppInstalled = () => {
      console.log("[PWA] App installed successfully");
      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
      toast.success("✅ App instalado com sucesso! Acesse a partir da tela inicial.");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

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
        toast.success("✅ App instalado com sucesso!");
      } else {
        console.log("[PWA] User dismissed install");
        toast.info("Você pode instalar o app a qualquer momento pelo menu do navegador");
      }
      
      setDeferredPrompt(null);
      setIsOpen(false);
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
    }
  };

  // Não mostrar se já instalado
  if (isInstalled) {
    return null;
  }

  // Renderizar apenas se houver prompt disponível (Android/Desktop) ou se for iOS
  if (!deferredPrompt && platform !== "ios") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Download className="w-6 h-6 text-orange-500" />
            Instale o ESPELHO AI
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Acesse o app rapidamente da sua tela inicial
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {/* Benefícios */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Acesso Rápido</div>
                <div className="text-sm text-slate-400">Abra o app direto da tela inicial</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-pink-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Sem Navegador</div>
                <div className="text-sm text-slate-400">Interface limpa sem barras do navegador</div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold text-white">Funciona Offline</div>
                <div className="text-sm text-slate-400">Use mesmo sem conexão com a internet</div>
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
                    1. Toque em Compartilhar (ícone de seta)
                    <br />
                    2. Selecione "Adicionar à Tela Inicial"
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
                    Clique em "Instalar" abaixo para adicionar o app à sua tela inicial
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
                    Clique em "Instalar" ou use o menu do navegador (3 pontinhos) → Instalar app
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="flex-1 border-slate-600 hover:bg-slate-800"
          >
            <X className="w-4 h-4 mr-2" />
            Depois
          </Button>

          {platform === "ios" ? (
            <Button
              onClick={handleIOSInstall}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 gap-2"
            >
              <Apple className="w-4 h-4" />
              Instruções
            </Button>
          ) : (
            <Button
              onClick={platform === "android" ? handleInstallClick : handleDesktopInstall}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 gap-2"
            >
              <Download className="w-4 h-4" />
              Instalar
            </Button>
          )}
        </div>

        <div className="text-xs text-slate-500 text-center mt-4">
          Você pode instalar o app a qualquer momento pelo menu do navegador
        </div>
      </DialogContent>
    </Dialog>
  );
}
