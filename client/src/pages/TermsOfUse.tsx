import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsOfUse() {
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
          <h1 className="text-2xl font-bold">Termos de Uso</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-slate-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Aceitação dos Termos</h2>
            <p className="text-slate-700 mb-4">
              Ao acessar e usar o Descubra seu Verdadeiro Eu (doravante "Aplicativo"), você concorda em cumprir estes Termos de Uso. Se não concordar com qualquer parte destes termos, você não deve usar o Aplicativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Descrição do Serviço</h2>
            <p className="text-slate-700 mb-4">
              O Aplicativo fornece um serviço de transformação de imagens usando inteligência artificial. Os usuários podem fazer upload de fotos e gerar versões transformadas em diferentes estilos temáticos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Direitos Autorais e Propriedade Intelectual</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-bold text-blue-900 mb-2">🔒 Aviso de Copyright</h3>
              <ul className="text-slate-700 space-y-2">
                <li>
                  <strong>Imagens Originais:</strong> Você mantém todos os direitos autorais sobre as fotos que você faz upload. Você é o único proprietário de suas imagens originais.
                </li>
                <li>
                  <strong>Imagens Geradas:</strong> As imagens transformadas geradas pelo Aplicativo são criadas especificamente para você. Você tem o direito de usar, compartilhar e distribuir as imagens geradas para fins pessoais e comerciais.
                </li>
                <li>
                  <strong>Propriedade Intelectual do Aplicativo:</strong> Todo o código, design, algoritmos e marca registrada do Descubra seu Verdadeiro Eu são propriedade exclusiva dos desenvolvedores. Você não pode reproduzir, modificar ou distribuir o Aplicativo sem permissão.
                </li>
                <li>
                  <strong>Conteúdo Gerado:</strong> Você concorda em não usar as imagens geradas para fins ilegais, difamatórios, obscenos ou prejudiciais.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Segurança e Privacidade de Dados</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <h3 className="font-bold text-green-900 mb-2">🔐 Aviso de Segurança</h3>
              <ul className="text-slate-700 space-y-2">
                <li>
                  <strong>Proteção de Dados:</strong> Suas informações pessoais são protegidas com criptografia de ponta a ponta (SSL/TLS). Não compartilhamos seus dados com terceiros sem consentimento.
                </li>
                <li>
                  <strong>Armazenamento de Fotos:</strong> As fotos que você faz upload NÃO são armazenadas permanentemente em nossos servidores. Elas são processadas e deletadas automaticamente após a geração das imagens transformadas.
                </li>
                <li>
                  <strong>Dados de Conta:</strong> Seu nome, email e histórico de créditos são armazenados com segurança para gerenciar sua conta.
                </li>
                <li>
                  <strong>Cookies e Rastreamento:</strong> Usamos cookies apenas para autenticação e melhorar sua experiência. Não rastreamos seu comportamento para publicidade.
                </li>
                <li>
                  <strong>Conformidade:</strong> O Aplicativo está em conformidade com a Lei Geral de Proteção de Dados (LGPD) e regulamentações internacionais de privacidade.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Responsabilidades do Usuário</h2>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Você é responsável por manter a confidencialidade de sua senha e conta.</li>
              <li>Você concorda em usar o Aplicativo apenas para fins legais e apropriados.</li>
              <li>Você não pode fazer upload de imagens de outras pessoas sem consentimento.</li>
              <li>Você não pode usar o Aplicativo para criar conteúdo ofensivo, ilegal ou prejudicial.</li>
              <li>Você concorda em não tentar acessar ou modificar o Aplicativo de forma não autorizada.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-slate-700 mb-4">
              O Aplicativo é fornecido "como está" sem garantias de qualquer tipo. Não somos responsáveis por:
            </p>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Qualidade ou precisão das imagens geradas</li>
              <li>Perda de dados ou acesso não autorizado à sua conta</li>
              <li>Interrupções ou indisponibilidade do serviço</li>
              <li>Danos indiretos ou consequentes resultantes do uso do Aplicativo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Créditos e Pagamentos</h2>
            <ul className="text-slate-700 space-y-2 list-disc list-inside">
              <li>Créditos são não-reembolsáveis e não têm valor monetário fora do Aplicativo.</li>
              <li>Créditos não expiram e podem ser usados a qualquer momento.</li>
              <li>Você pode cancelar sua assinatura a qualquer momento sem penalidades.</li>
              <li>Reembolsos são processados de acordo com a política de reembolso do seu método de pagamento.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Modificações dos Termos</h2>
            <p className="text-slate-700 mb-4">
              Reservamos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após a publicação. Seu uso contínuo do Aplicativo após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Contato</h2>
            <p className="text-slate-700 mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de Suporte no Aplicativo.
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
