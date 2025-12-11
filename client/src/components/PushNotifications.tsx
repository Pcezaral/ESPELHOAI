import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "trending" | "download_ready" | "promotion" | "general";
  timestamp: Date;
}

export function PushNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar se o navegador suporta Web Push API
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(() => {
        Notification.requestPermission().then((permission) => {
          setHasPermission(permission === "granted");
        });
      });
    }

    // Simular notificações de teste
    const timer = setTimeout(() => {
      addNotification({
        id: "1",
        title: "Transformação em Trending!",
        message: "Sua transformação no estilo 'Epic' entrou para trending!",
        type: "trending",
        timestamp: new Date(),
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "trending":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "download_ready":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "promotion":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notificações em Toast */}
      <div className="space-y-2 mb-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${getNotificationColor(notification.type)} text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 opacity-75 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Notificações */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-background border border-border rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Notificações</h2>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação no momento
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp.toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 opacity-50 hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
