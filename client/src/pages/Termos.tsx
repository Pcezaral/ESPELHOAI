import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Termos() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}\n      <header className="bg-slate-900 border-b border-slate-700 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Termos & Política de Cancelamento</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* Seção 1: Política de Cancelamento */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">🚪 Política de Cancelamento</h2>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 mb-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">✅ Você Pode Cancelar a Qualquer Momento</h3>
              <p className="text-slate-300 mb-4">
                No ESPELHO AI, você tem total liberdade para cancelar sua assinatura quando quiser. Não há contratos de longa duração, sem compromissos e sem taxas de cancelamento. Sua satisfação é nossa prioridade.
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-4">Como Cancelar Sua Assinatura</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 mb-6">
              <li>Acesse sua conta clicando no botão de perfil no canto superior direito</li>
              <li>Clique em "Minha Assinatura"</li>
              <li>Procure pela seção "Cancelar Assinatura"</li>
              <li>Clique no botão "Cancelar Assinatura"</li>
              <li>Confirme sua decisão na janela de confirmação</li>
              <li>Pronto! Seu cancelamento foi processado</li>
            </ol>

            <h3 className="text-2xl font-bold mb-4">O Que Acontece Após Cancelar</h3>
            <ul className="list-disc list-inside space-y-3 text-slate-300 mb-6">
              <li><strong>Acesso Mantido:</strong> Você continuará tendo acesso até o final do período que já pagou</li>
              <li><strong>Sem Reembolso Imediato:</strong> Não oferecemos reembolsos pro-rata (parciais) para períodos não utilizados</li>
              <li><strong>Sem Cobrança Futura:</strong> Você não será cobrado novamente após o cancelamento</li>
              <li><strong>Dados Preservados:</strong> Suas transformações e histórico permanecerão acessíveis</li>
              <li><strong>Reativação Possível:</strong> Você pode reativar sua assinatura a qualquer momento</li>
            </ul>
          </section>

          {/* Seção 2: Direitos do Consumidor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">⚖️ Direitos do Consumidor (Lei Brasileira)</h2>
            
            <p className="text-slate-300 mb-6">
              O ESPELHO AI está em conformidade total com a Lei nº 8.078/1990 (Código de Defesa do Consumidor) e a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>

            <h3 className="text-2xl font-bold mb-4">Seus Direitos Como Consumidor</h3>
            <div className="space-y-4 text-slate-300 mb-6">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">1. Direito ao Arrependimento (7 dias)</h4>
                <p>Você tem 7 dias a contar da data da compra para se arrepender e solicitar o reembolso total, sem necessidade de justificativa.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">2. Direito à Informação Clara</h4>
                <p>Todas as condições de contratação, preços e termos devem ser apresentados de forma clara e acessível antes da compra.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">3. Direito à Proteção de Dados</h4>
                <p>Seus dados pessoais são protegidos conforme a LGPD. Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">4. Direito a Suporte</h4>
                <p>Você tem direito a atendimento de qualidade e resposta em até 48 horas para qualquer dúvida ou reclamação.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">5. Direito a Reembolso</h4>
                <p>Em caso de falha no serviço ou produto defeituoso, você tem direito a reembolso integral ou substituição.</p>
              </div>
            </div>
          </section>

          {/* Seção 3: Processo de Reembolso */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">💰 Processo de Reembolso</h2>
            
            <h3 className="text-2xl font-bold mb-4">Quando Você Tem Direito a Reembolso</h3>
            <ul className="list-disc list-inside space-y-3 text-slate-300 mb-6">
              <li>Dentro de 7 dias da compra (direito de arrependimento)</li>
              <li>Se o serviço não funcionar conforme descrito</li>
              <li>Se houver cobrança duplicada ou não autorizada</li>
              <li>Em caso de erro técnico que impedir o uso do serviço</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">Como Solicitar Reembolso</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 mb-6">
              <li>Envie um email para suporte@espelhoai.com.br com seu pedido</li>
              <li>Inclua seu ID de transação e motivo do reembolso</li>
              <li>Aguarde confirmação em até 48 horas</li>
              <li>O reembolso será processado em 5-10 dias úteis</li>
              <li>Você receberá uma confirmação por email</li>
            </ol>

            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6 mb-6">
              <p className="text-green-300">
                <strong>✅ Garantia de Satisfação 30 Dias:</strong> Se não gostar do ESPELHO AI nos primeiros 30 dias, devolvemos 100% do seu dinheiro, sem perguntas.
              </p>
            </div>
          </section>

          {/* Seção 4: Perguntas Frequentes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">❓ Perguntas Frequentes</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-2">P: Posso cancelar no meio do mês?</h4>
                <p className="text-slate-300">R: Sim! Você pode cancelar a qualquer momento. Seu acesso continuará até o final do período pago.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-2">P: Vou receber reembolso ao cancelar?</h4>
                <p className="text-slate-300">R: Não oferecemos reembolso pro-rata para períodos não utilizados. Você pagou por um período e pode usar até o final.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-2">P: Posso reativar minha assinatura depois?</h4>
                <p className="text-slate-300">R: Sim! Você pode reativar sua assinatura a qualquer momento. Basta fazer login e escolher um novo plano.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-2">P: E se eu tiver problemas técnicos?</h4>
                <p className="text-slate-300">R: Entre em contato com nosso suporte em suporte@espelhoai.com.br. Vamos resolver em até 48 horas.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-2">P: Há alguma taxa de cancelamento?</h4>
                <p className="text-slate-300">R: Não! Cancelar é 100% gratuito. Sem taxas, sem multas, sem compromissos.</p>
              </div>
            </div>
          </section>

          {/* Seção 5: Contato */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">📞 Entre em Contato</h2>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
              <p className="text-slate-300 mb-6">
                Tem dúvidas sobre cancelamento ou precisa de ajuda? Estamos aqui para você!
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-white mb-1">📧 Email</p>
                  <p className="text-slate-300">suporte@espelhoai.com.br</p>
                </div>
                
                <div>
                  <p className="font-bold text-white mb-1">💬 Chat ao Vivo</p>
                  <p className="text-slate-300">Disponível 24/7 no app</p>
                </div>
                
                <div>
                  <p className="font-bold text-white mb-1">📱 WhatsApp</p>
                  <p className="text-slate-300">+55 (11) 99999-9999</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 6: Última Atualização */}
          <section className="text-center text-slate-400 text-sm">
            <p>Última atualização: 10 de dezembro de 2025</p>
            <p>Versão: 1.0</p>
          </section>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-12">
          <Button
            onClick={() => setLocation("/")}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
          >
            Voltar para Home
          </Button>
          <Button
            onClick={() => setLocation("/planos")}
            variant="outline"
            className="flex-1"
          >
            Ver Planos
          </Button>
        </div>
      </main>
    </div>
  );
}
