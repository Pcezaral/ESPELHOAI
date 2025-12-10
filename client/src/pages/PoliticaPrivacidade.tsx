import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PoliticaPrivacidade() {
  useEffect(() => {
    document.title = "Política de Privacidade - ESPELHO AI";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground">
            ESPELHO AI - Transformações de Fotos com IA
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última atualização: 10 de dezembro de 2025
          </p>
        </div>

        {/* LGPD Notice */}
        <Card className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">
              Conformidade com LGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 dark:text-blue-300">
            Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Introdução</h2>
            <p className="text-foreground leading-relaxed">
              ESPELHO AI ("Empresa", "nós" ou "nosso") opera o aplicativo ESPELHO AI (o "Serviço"). Esta página informa 
              você sobre nossas políticas quanto à coleta, uso e divulgação de dados pessoais quando você usa nosso Serviço 
              e as escolhas que você tem associadas a esses dados.
            </p>
          </section>

          <Separator />

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Dados que Coletamos</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>2.1 Dados Fornecidos Diretamente:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Nome completo</li>
                <li>Endereço de email</li>
                <li>Data de nascimento</li>
                <li>Número de telefone (opcional)</li>
                <li>Foto de perfil (opcional)</li>
                <li>Redes sociais (Instagram, TikTok, Twitter, YouTube - opcional)</li>
              </ul>

              <p className="mt-3">
                <strong>2.2 Dados Coletados Automaticamente:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Endereço IP</li>
                <li>Tipo de navegador e versão</li>
                <li>Sistema operacional</li>
                <li>Páginas visitadas e tempo gasto</li>
                <li>Dados de cliques e interações</li>
                <li>Localização aproximada (país/cidade)</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <p className="mt-3">
                <strong>2.3 Dados de Transformação:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Fotos originais enviadas</li>
                <li>Imagens geradas</li>
                <li>Estilos utilizados</li>
                <li>Data e hora das transformações</li>
                <li>Downloads realizados</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Como Usamos Seus Dados</h2>
            <p className="text-foreground leading-relaxed mb-3">
              Usamos os dados coletados para os seguintes fins:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Fornecer e manter o Serviço</li>
              <li>Processar suas transformações de fotos</li>
              <li>Gerenciar sua conta e assinatura</li>
              <li>Enviar atualizações e notificações</li>
              <li>Responder a suas consultas e solicitações</li>
              <li>Melhorar e otimizar o Serviço</li>
              <li>Detectar e prevenir fraude e abuso</li>
              <li>Cumprir obrigações legais</li>
              <li>Análise e estatísticas de uso</li>
              <li>Marketing e comunicações (com consentimento)</li>
            </ul>
          </section>

          <Separator />

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Base Legal para Processamento</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>4.1 Consentimento:</strong> Você consentiu com o processamento de seus dados pessoais para um ou mais fins específicos.
              </p>
              <p>
                <strong>4.2 Contrato:</strong> O processamento é necessário para a execução de um contrato do qual você é parte.
              </p>
              <p>
                <strong>4.3 Obrigação Legal:</strong> O processamento é necessário para cumprir uma obrigação legal.
              </p>
              <p>
                <strong>4.4 Interesse Legítimo:</strong> O processamento é necessário para os fins dos interesses legítimos perseguidos pela Empresa.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Compartilhamento de Dados</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>5.1 Não Vendemos Dados:</strong> ESPELHO AI nunca vende seus dados pessoais a terceiros.
              </p>
              <p>
                <strong>5.2 Compartilhamento Limitado:</strong> Podemos compartilhar dados com:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Prestadores de serviço (hospedagem, pagamento, análise)</li>
                <li>Autoridades legais (quando obrigado por lei)</li>
                <li>Parceiros comerciais (com seu consentimento)</li>
              </ul>
              <p className="mt-3">
                <strong>5.3 Proteção:</strong> Todos os prestadores de serviço são obrigados a manter a confidencialidade de seus dados.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Segurança de Dados</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>6.1 Criptografia:</strong> Seus dados são transmitidos através de conexão SSL/TLS criptografada.
              </p>
              <p>
                <strong>6.2 Armazenamento:</strong> Dados sensíveis são armazenados em servidores seguros com acesso restrito.
              </p>
              <p>
                <strong>6.3 Backup:</strong> Realizamos backups regulares para proteger contra perda de dados.
              </p>
              <p>
                <strong>6.4 Monitoramento:</strong> Monitoramos continuamente ameaças de segurança.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Seus Direitos (LGPD)</h2>
            <p className="text-foreground leading-relaxed mb-3">
              Sob a LGPD, você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li><strong>Acesso:</strong> Direito de acessar seus dados pessoais</li>
              <li><strong>Correção:</strong> Direito de corrigir dados imprecisos</li>
              <li><strong>Exclusão:</strong> Direito de solicitar exclusão de dados (direito ao esquecimento)</li>
              <li><strong>Portabilidade:</strong> Direito de receber dados em formato estruturado</li>
              <li><strong>Consentimento:</strong> Direito de revogar consentimento</li>
              <li><strong>Oposição:</strong> Direito de se opor ao processamento</li>
              <li><strong>Informação:</strong> Direito de ser informado sobre violações de dados</li>
            </ul>
          </section>

          <Separator />

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Retenção de Dados</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>8.1 Período de Retenção:</strong> Retemos seus dados pessoais enquanto sua conta estiver ativa ou conforme necessário para fornecer o Serviço.
              </p>
              <p>
                <strong>8.2 Após Exclusão:</strong> Após a exclusão da conta, dados são mantidos por 30 dias antes de serem permanentemente deletados.
              </p>
              <p>
                <strong>8.3 Dados Legais:</strong> Alguns dados podem ser retidos conforme exigido por lei (ex: registros de transação).
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">9. Cookies e Rastreamento</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>9.1 Cookies Essenciais:</strong> Usamos cookies para autenticação e segurança.
              </p>
              <p>
                <strong>9.2 Cookies de Análise:</strong> Usamos Google Analytics para entender como você usa o Serviço.
              </p>
              <p>
                <strong>9.3 Controle:</strong> Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">10. Contato e Exercício de Direitos</h2>
            <p className="text-foreground leading-relaxed mb-3">
              Para exercer seus direitos ou fazer perguntas sobre privacidade, entre em contato:
            </p>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-foreground"><strong>Email:</strong> privacidade@espelhoai.com.br</p>
              <p className="text-foreground"><strong>Encomendado de Proteção de Dados (DPO):</strong> dpo@espelhoai.com.br</p>
              <p className="text-foreground"><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
            </div>
            <p className="text-foreground leading-relaxed mt-3">
              Responderemos sua solicitação em até 15 dias úteis.
            </p>
          </section>

          <Separator />

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">11. Alterações a Esta Política</h2>
            <p className="text-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas 
              por email ou através de destaque no Serviço. Seu uso continuado do Serviço após alterações constitui aceitação 
              da Política revisada.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 ESPELHO AI. Todos os direitos reservados. | Lei nº 13.709/2018 (LGPD)
          </p>
        </div>
      </div>
    </div>
  );
}
