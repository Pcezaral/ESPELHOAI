import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Contato() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const sendContactMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso! Responderemos em breve.");
      setMessage("");
      setWordCount(0);
    },
    onError: (error) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error(error);
    },
  });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length <= 100) {
      setMessage(text);
      setWordCount(words.length);
    } else {
      toast.error("Limite de 100 palavras atingido!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (wordCount === 0) {
      toast.error("Por favor, escreva uma mensagem.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    sendContactMutation.mutate({
      title: `Contato de ${name} (${email})`,
      content: message,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-white font-bold text-xl">Espelho AI</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-gray-600 text-lg">Tem dúvidas ou sugestões? Envie sua mensagem!</p>
          </div>

          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Nome *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold flex items-center justify-between">
                  <span>Mensagem *</span>
                  <span className={`text-sm ${wordCount > 90 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {wordCount}/100 palavras
                  </span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Escreva sua mensagem aqui... (máximo 100 palavras)"
                  value={message}
                  onChange={handleMessageChange}
                  className="min-h-[200px] text-base resize-none"
                  required
                />
              </div>

              {/* Botão Enviar */}
              <Button
                type="submit"
                disabled={sendContactMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg h-14 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                {sendContactMutation.isPending ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Info adicional */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Responderemos sua mensagem em até 24 horas úteis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
