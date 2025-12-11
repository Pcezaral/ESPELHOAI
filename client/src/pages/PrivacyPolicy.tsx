import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-2xl font-bold">Política de Privacidade</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-slate-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Introdução</h2>
            <p className="text-slate-700 mb-4">
              A Descubra seu Verdadeiro Eu ("nós", "nosso" ou "Aplicativo") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Informações que Coletamos</h2>
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-black mb-2">Informações Pessoais:</h3>
              <ul className="text-slate-700 space-y-2 list-disc list-inside">
                <li>Nome e email (fornecidos durante o registro)</li>
                <li>Informações de pagamento (processadas com segurança)</li>
                <li>Histórico de uso e créditos consumidos</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-black mb-2">Dados de Imagens:</h3>
              <ul className="text-slate-700 space-y-2 list-disc list-inside">
                <li>Fotos que você faz upload são processadas temporariamente</li>
                <li>As imagens originais são deletadas após 24 horas</li>
                <li>Imagens geradas são armazenadas apenas enquanto você estiver logado</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-bold text-black mb-2">Dados Técnicos:</h3>
              <ul className="text-slate-700 space-y-2 list-disc list-inside">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Cookies de sessão</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Como Usamos Suas Informações</h2>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Fornecer e melhorar o serviço do Aplicativo</li>
              <li>Processar pagamentos e gerenciar sua conta</li>
              <li>Enviar notificações sobre sua conta (atualizações, segurança)</li>
              <li>Analisar uso do Aplicativo para melhorias</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-slate-700 mb-4">
              <strong>Nós NÃO compartilhamos seus dados pessoais com terceiros</strong>, exceto:
            </p>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Com processadores de pagamento (Stripe) - apenas informações de pagamento</li>
              <li>Com provedores de hospedagem - para manter o serviço funcionando</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger direitos, privacidade, segurança ou propriedade</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Segurança de Dados</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h3 className="font-bold text-green-900 mb-2">🔐 Medidas de Segurança</h3>
              <ul className="text-slate-700 space-y-2">
                <li><strong>Criptografia SSL/TLS:</strong> Todos os dados em trânsito são criptografados</li>
                <li><strong>Senhas com Hash:</strong> Suas senhas são armazenadas com hash seguro (bcrypt)</li>
                <li><strong>Firewalls:</strong> Proteção contra acessos não autorizados</li>
                <li><strong>Backups Regulares:</strong> Seus dados são feitos backup regularmente</li>
                <li><strong>Acesso Restrito:</strong> Apenas funcionários autorizados têm acesso aos dados</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Retenção de Dados</h2>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li><strong>Fotos Originais:</strong> Deletadas após 24 horas do upload</li>
              <li><strong>Imagens Geradas:</strong> Disponíveis enquanto sua conta estiver ativa</li>
              <li><strong>Dados de Conta:</strong> Retidos enquanto sua conta estiver ativa</li>
              <li><strong>Após Exclusão:</strong> Todos os dados são deletados permanentemente em 30 dias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Seus Direitos</h2>
            <p className="text-slate-700 mb-4">
              De acordo com a LGPD, você tem o direito de:
            </p>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimento para processamento de dados</li>
              <li>Receber uma cópia de seus dados em formato portável</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Cookies</h2>
            <p className="text-slate-700 mb-4">
              Usamos cookies apenas para:
            </p>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Manter você logado na sua sessão</li>
              <li>Lembrar suas preferências</li>
              <li>Melhorar a experiência do usuário</li>
            </ul>
            <p className="text-slate-700 mt-4">
              Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade do Aplicativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Contato</h2>
            <p className="text-slate-700 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou deseja exercer seus direitos, entre em contato conosco através da página de Suporte no Aplicativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">10. Alterações nesta Política</h2>
            <p className="text-slate-700 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas por email ou através do Aplicativo.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Voltar para Home
          </Button>
        </div>
      </main>
    </div>
  );
}
