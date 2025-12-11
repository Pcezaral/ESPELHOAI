import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, AlertCircle, Zap, Wifi, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Category = "generation" | "connection" | "credits" | "payment" | "other";

interface SupportCategory {
  id: Category;
  title: string;
  icon: React.ReactNode;
  description: string;
  autoResponse: string;
  questions: string[];
}

const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "generation",
    title: "Problema de Geração",
    icon: <AlertCircle className="w-6 h-6" />,
    description: "A transformação não está funcionando corretamente",
    autoResponse: "Desculpe pelos problemas! Aqui estão algumas soluções:\n\n1. Tente fazer upload de uma foto diferente\n2. Verifique se a foto tem boa iluminação\n3. Tente outro estilo de transformação\n4. Limpe o cache do navegador e tente novamente\n\nSe o problema persistir, vamos investigar para você!",
    questions: [
      "A imagem não está sendo processada",
      "Erro ao gerar transformação",
      "Resultado de má qualidade",
      "Transformação incompleta",
    ],
  },
  {
    id: "connection",
    title: "Problema de Conexão",
    icon: <Wifi className="w-6 h-6" />,
    description: "Problemas de conectividade ou carregamento",
    autoResponse: "Parece que há um problema de conexão. Tente:\n\n1. Verifique sua conexão de internet\n2. Atualize a página\n3. Tente em outro navegador\n4. Desabilite VPN ou proxy se estiver usando\n5. Limpe cookies e cache\n\nSe continuar com problemas, nos avise!",
    questions: [
      "Página não carrega",
      "Conexão instável",
      "Timeout ao enviar foto",
      "Erro de rede",
    ],
  },
  {
    id: "credits",
    title: "Problemas com Créditos",
    icon: <Zap className="w-6 h-6" />,
    description: "Questões sobre saldo, consumo ou compra de créditos",
    autoResponse: "Sobre seus créditos:\n\n• Cada transformação consome 1 crédito\n• Você recebe 5 créditos grátis ao se registrar\n• Planos disponíveis: Light (50 créditos), Premium (150 créditos)\n• Créditos não expiram\n• Você pode consultar seu saldo no topo da página\n\nSe há uma discrepância, vamos verificar sua conta!",
    questions: [
      "Créditos desapareceram",
      "Cobrança incorreta",
      "Não recebi créditos após compra",
      "Plano não ativou",
    ],
  },
  {
    id: "payment",
    title: "Problemas de Pagamento",
    icon: <Zap className="w-6 h-6" />,
    description: "Questões sobre pagamento ou faturamento",
    autoResponse: "Sobre pagamentos:\n\n• Aceitamos cartão de crédito via Stripe\n• Pagamento é processado instantaneamente\n• Você receberá um comprovante por email\n• Seu plano ativa imediatamente após confirmação\n• Pode cancelar planos recorrentes a qualquer momento\n\nSe o pagamento falhou, tente novamente ou entre em contato!",
    questions: [
      "Pagamento recusado",
      "Não recebi confirmação",
      "Cobrança duplicada",
      "Como cancelar plano?",
    ],
  },
  {
    id: "other",
    title: "Outro Assunto",
    icon: <HelpCircle className="w-6 h-6" />,
    description: "Dúvidas, sugestões ou outros assuntos",
    autoResponse: "Obrigado por entrar em contato! Vamos analisar sua mensagem e responder em breve.",
    questions: [
      "Sugestão de melhoria",
      "Dúvida geral",
      "Feedback",
      "Outro",
    ],
  },
];

export default function Support() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const createTicketMutation = trpc.support.createTicket.useMutation({
    onSuccess: () => {
      toast.success("Ticket criado com sucesso! Vamos responder em breve.");
      setSelectedCategory(null);
      setSelectedQuestion(null);
      setCustomMessage("");
      setShowForm(false);
    },
    onError: (error) => {
      toast.error("Erro ao criar ticket: " + error.message);
    },
  });

  const handleSubmitTicket = async () => {
    if (!selectedCategory) return;

    const category = SUPPORT_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;

    const message = customMessage || selectedQuestion || category.description;

    createTicketMutation.mutate({
      subject: `${category.title}: ${selectedQuestion || "Consulta"}`,
      message: message,
      category: selectedCategory,
    });
  };

  const currentCategory = selectedCategory
    ? SUPPORT_CATEGORIES.find(c => c.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-white">Central de Suporte</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-12 relative z-10">
        {!selectedCategory ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">Como podemos ajudar?</h2>
              <p className="text-slate-300 text-lg">
                Selecione uma categoria para encontrar soluções rápidas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPORT_CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="cursor-pointer border-2 border-slate-700 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 bg-slate-900/50 p-6 space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl text-orange-500 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <p className="text-sm text-slate-300">{category.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedQuestion(null);
                setShowForm(false);
              }}
              className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar às categorias
            </Button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{currentCategory?.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{currentCategory?.title}</h2>
                  <p className="text-slate-300">{currentCategory?.description}</p>
                </div>
              </div>
            </div>

            {!showForm ? (
              <Card className="bg-slate-900/50 border-orange-500/30 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Selecione sua dúvida:
                  </h3>
                  <div className="space-y-2">
                    {currentCategory?.questions.map((question) => (
                      <Button
                        key={question}
                        onClick={() => setSelectedQuestion(question)}
                        variant={selectedQuestion === question ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-3 px-4"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedQuestion && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-orange-400">
                        Resposta Automática:
                      </h4>
                      <p className="text-slate-200 whitespace-pre-line text-sm">
                        {currentCategory?.autoResponse}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          toast.success("Problema resolvido! Obrigado por usar nosso suporte.");
                          setSelectedCategory(null);
                          setSelectedQuestion(null);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Problema Resolvido
                      </Button>
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="outline"
                        className="flex-1"
                      >
                        Ainda preciso de ajuda
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="bg-slate-900/50 border-orange-500/30 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Descreva seu problema com mais detalhes:
                </h3>

                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite aqui qualquer informação adicional que possa nos ajudar..."
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmitTicket}
                    disabled={createTicketMutation.isPending}
                    className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Send className="w-4 h-4" />
                    {createTicketMutation.isPending ? "Enviando..." : "Enviar Ticket"}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
