import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 md:p-6 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">🍪 Cookies e Privacidade</h3>
            <p className="text-slate-300 text-sm">
              Usamos cookies apenas para autenticação e melhorar sua experiência. Não rastreamos seu comportamento para publicidade. Ao continuar, você concorda com nossa{" "}
              <a href="/privacidade" className="text-orange-400 hover:text-orange-300 underline">
                Política de Privacidade
              </a>
              {" "}e{" "}
              <a href="/termos" className="text-orange-400 hover:text-orange-300 underline">
                Termos de Uso
              </a>
              .
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 md:flex-none border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Rejeitar
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 md:flex-none bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Aceitar
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 md:relative text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
