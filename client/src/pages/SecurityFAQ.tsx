import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "segurança" | "copyright" | "dados";
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    category: "segurança",
    question: "Minha foto é armazenada nos servidores?",
    answer:
      "Não. Suas fotos originais são processadas temporariamente e deletadas automaticamente após 24 horas. Nós não armazenamos suas imagens pessoais em nossos servidores.",
  },
  {
    id: "2",
    category: "segurança",
    question: "Como meus dados são protegidos?",
    answer:
      "Usamos criptografia SSL/TLS para proteger todos os dados em trânsito. Suas senhas são armazenadas com hash bcrypt. Todos os servidores possuem firewalls e são monitorados 24/7.",
  },
  {
    id: "3",
    category: "segurança",
    question: "Vocês compartilham meus dados com terceiros?",
    answer:
      "Não. Seus dados pessoais nunca são compartilhados com terceiros, exceto quando exigido por lei. Apenas processadores de pagamento (Stripe) recebem informações de pagamento, e apenas para processar transações.",
  },
  {
    id: "4",
    category: "segurança",
    question: "Vocês usam cookies para rastreamento?",
    answer:
      "Não. Usamos cookies apenas para autenticação e melhorar sua experiência. Não rastreamos seu comportamento para publicidade ou análise de terceiros.",
  },
  {
    id: "5",
    category: "copyright",
    question: "Quem é o dono da imagem gerada?",
    answer:
      "Você é o proprietário total da imagem gerada. Pode usar, compartilhar, modificar e distribuir a imagem como quiser - para fins pessoais ou comerciais.",
  },
  {
    id: "6",
    category: "copyright",
    question: "Posso vender a imagem gerada?",
    answer:
      "Sim! A imagem gerada é sua propriedade. Você pode vender, usar em produtos comerciais, ou fazer qualquer coisa que desejar com ela.",
  },
  {
    id: "7",
    category: "copyright",
    question: "Vocês usam minhas imagens para treinar IA?",
    answer:
      "Não. Suas imagens originais são deletadas após 24 horas e nunca são usadas para treinar nossos modelos de IA. Respeitamos sua privacidade completamente.",
  },
  {
    id: "8",
    category: "copyright",
    question: "Posso usar a imagem em redes sociais?",
    answer:
      "Absolutamente! Você pode compartilhar a imagem gerada em qualquer rede social (Instagram, TikTok, Facebook, etc.) sem restrições.",
  },
  {
    id: "9",
    category: "dados",
    question: "Como posso deletar minha conta e dados?",
    answer:
      "Você pode solicitar a exclusão de sua conta a qualquer momento através da página de Configurações. Todos os seus dados serão deletados permanentemente em 30 dias.",
  },
  {
    id: "10",
    category: "dados",
    question: "Posso acessar meus dados pessoais?",
    answer:
      "Sim. De acordo com a LGPD, você tem o direito de acessar todos os seus dados. Entre em contato conosco através da página de Suporte e processaremos sua solicitação em até 15 dias.",
  },
  {
    id: "11",
    category: "dados",
    question: "Por quanto tempo vocês mantêm meus dados?",
    answer:
      "Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão, todos os dados são deletados permanentemente em 30 dias.",
  },
  {
    id: "12",
    category: "dados",
    question: "Qual é a política de reembolso?",
    answer:
      "Créditos são não-reembolsáveis. No entanto, se você tiver problemas com a qualidade do serviço, entre em contato conosco e faremos o possível para resolver.",
  },
];

export default function SecurityFAQ() {
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"segurança" | "copyright" | "dados" | "todas">("todas");

  const filteredItems = selectedCategory === "todas" ? faqItems : faqItems.filter((item) => item.category === selectedCategory);

  const categories = [
    { id: "todas", label: "Todas as Perguntas", icon: "📋" },
    { id: "segurança", label: "Segurança", icon: "🔒" },
    { id: "copyright", label: "Copyright", icon: "©️" },
    { id: "dados", label: "Seus Dados", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Segurança & Copyright</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-slate-600 text-center mb-8">
            Perguntas frequentes sobre segurança, privacidade e direitos autorais
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-left font-semibold text-slate-900">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform ${
                    expandedId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedId === item.id && (
                <div className="px-6 py-4 bg-white border-t border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Ainda tem dúvidas?</h3>
          <p className="text-blue-800 mb-4">
            Se sua pergunta não foi respondida, entre em contato conosco através da página de Suporte.
          </p>
          <Button
            onClick={() => setLocation("/suporte")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ir para Suporte
          </Button>
        </div>

        {/* Links to Legal Pages */}
        <div className="mt-8 p-6 bg-slate-100 rounded-lg">
          <p className="text-slate-700 mb-4">
            Para mais detalhes, consulte nossa documentação completa:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setLocation("/privacidade")}
              variant="outline"
              className="border-slate-300"
            >
              📋 Política de Privacidade
            </Button>
            <Button
              onClick={() => setLocation("/termos")}
              variant="outline"
              className="border-slate-300"
            >
              ⚖️ Termos de Uso
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-400 py-8 mt-16 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 Descubra seu Verdadeiro Eu. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
