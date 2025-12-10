import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermosServico() {
  useEffect(() => {
    document.title = "Termos de Serviço - ESPELHO AI";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Termos de Serviço</h1>
          <p className="text-muted-foreground">
            ESPELHO AI - Transformações de Fotos com IA
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última atualização: 10 de dezembro de 2025
          </p>
        </div>

        {/* Copyright Notice */}
        <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-600 dark:text-orange-400">
              © 2025 ESPELHO AI. Todos os direitos reservados.
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-700 dark:text-orange-300">
            Este software é protegido por lei de direitos autorais (Lei nº 9.610/1998).
            Reprodução, distribuição ou modificação sem autorização é proibida.
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p className="text-foreground leading-relaxed">
              Ao acessar e usar ESPELHO AI (o "Serviço"), você aceita estar vinculado por estes Termos de Serviço 
              ("Termos") em sua totalidade. Se você não concordar com qualquer parte destes Termos, você não deve usar o Serviço.
            </p>
          </section>

          <Separator />

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Propriedade Intelectual</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>2.1 Propriedade do Serviço:</strong> O Serviço, incluindo mas não limitado a código-fonte, 
                design, layout, gráficos, imagens, textos, logotipos e marca registrada "ESPELHO AI", são propriedade 
                exclusiva de ESPELHO AI e protegidos por lei de direitos autorais internacional.
              </p>
              <p>
                <strong>2.2 Restrições:</strong> Você não pode copiar, modificar, distribuir, transmitir, exibir, 
                executar, reproduzir, publicar, licenciar, criar trabalhos derivados, transferir ou vender qualquer 
                informação ou serviço obtido do Serviço.
              </p>
              <p>
                <strong>2.3 Engenharia Reversa:</strong> É expressamente proibido fazer engenharia reversa, desmontar, 
                descompilar ou tentar descobrir qualquer código-fonte ou algoritmo do Serviço.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Licença de Uso</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>3.1 Concessão de Licença:</strong> ESPELHO AI concede a você uma licença pessoal, 
                não-exclusiva, não-transferível e revogável para usar o Serviço apenas para fins pessoais e não-comerciais.
              </p>
              <p>
                <strong>3.2 Limitações:</strong> Você não pode sublicenciar, vender, alugar, emprestar, ceder, 
                transferir ou de qualquer forma disponibilizar o Serviço a terceiros.
              </p>
              <p>
                <strong>3.3 Uso Pessoal:</strong> O Serviço é destinado apenas para seu uso pessoal. Qualquer uso 
                comercial, incluindo revenda de imagens geradas, requer autorização escrita prévia de ESPELHO AI.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Proibições Expressas</h2>
            <p className="text-foreground leading-relaxed mb-3">
              Você concorda em não fazer o seguinte ao usar o Serviço:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Copiar, clonar ou criar versão não autorizada do Serviço</li>
              <li>Usar bots, scripts automáticos ou ferramentas de scraping</li>
              <li>Revender, distribuir ou comercializar imagens geradas</li>
              <li>Usar o Serviço para fins comerciais sem autorização</li>
              <li>Contornar ou burlar limites de créditos ou transformações</li>
              <li>Compartilhar sua conta com outros usuários</li>
              <li>Usar dados ou informações de outros usuários</li>
              <li>Tentar acessar áreas restritas do Serviço</li>
              <li>Interferir com a operação normal do Serviço</li>
              <li>Usar o Serviço para atividades ilegais ou prejudiciais</li>
            </ul>
          </section>

          <Separator />

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Imagens Geradas</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>5.1 Propriedade:</strong> As imagens geradas pelo Serviço usando sua foto são consideradas 
                trabalhos derivados. Você retém direitos sobre sua foto original, mas ESPELHO AI retém direitos sobre 
                o algoritmo, modelo e processo de transformação.
              </p>
              <p>
                <strong>5.2 Uso Permitido:</strong> Você pode usar imagens geradas para fins pessoais, compartilhamento 
                em redes sociais e uso privado. Qualquer uso comercial requer autorização prévia.
              </p>
              <p>
                <strong>5.3 Proibição de Revenda:</strong> É expressamente proibido vender, alugar, emprestar ou 
                comercializar imagens geradas sem autorização escrita de ESPELHO AI.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Consequências de Violação</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>6.1 Aviso:</strong> Primeira violação resultará em aviso por email com oportunidade de correção.
              </p>
              <p>
                <strong>6.2 Suspensão:</strong> Segunda violação resultará em suspensão temporária da conta (7-30 dias).
              </p>
              <p>
                <strong>6.3 Banimento:</strong> Terceira violação resultará em banimento permanente da conta.
              </p>
              <p>
                <strong>6.4 Ação Legal:</strong> Violações graves (revenda comercial, cópia de código, roubo de dados) 
                resultarão em ação legal conforme permitido pela lei.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
            <div className="space-y-3 text-foreground leading-relaxed">
              <p>
                <strong>7.1 Sem Garantias:</strong> O Serviço é fornecido "como está" sem garantias de qualquer tipo, 
                expressas ou implícitas.
              </p>
              <p>
                <strong>7.2 Limitação:</strong> Em nenhuma circunstância ESPELHO AI será responsável por danos indiretos, 
                incidentais, especiais, consequentes ou punitivos.
              </p>
              <p>
                <strong>7.3 Exclusões:</strong> ESPELHO AI não é responsável por perda de dados, interrupção de serviço, 
                ou uso indevido de imagens geradas por terceiros.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Modificação dos Termos</h2>
            <p className="text-foreground leading-relaxed">
              ESPELHO AI se reserva o direito de modificar estes Termos a qualquer momento. Modificações entram em vigor 
              imediatamente após publicação. Seu uso continuado do Serviço após modificações constitui aceitação dos novos Termos.
            </p>
          </section>

          <Separator />

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">9. Lei Aplicável e Jurisdição</h2>
            <p className="text-foreground leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida 
              exclusivamente nos tribunais de São Paulo, SP, Brasil.
            </p>
          </section>

          <Separator />

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">10. Contato</h2>
            <p className="text-foreground leading-relaxed">
              Para dúvidas sobre estes Termos, entre em contato conosco através de:
            </p>
            <div className="mt-3 p-4 bg-muted rounded-lg">
              <p className="text-foreground"><strong>Email:</strong> contato@espelhoai.com.br</p>
              <p className="text-foreground"><strong>WhatsApp:</strong> (11) 9XXXX-XXXX</p>
              <p className="text-foreground"><strong>Website:</strong> www.espelhoai.com.br</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 ESPELHO AI. Todos os direitos reservados. | Lei nº 9.610/1998 (Direito Autoral) | Lei nº 13.709/2018 (LGPD)
          </p>
        </div>
      </div>
    </div>
  );
}
