# Project TODO

## Funcionalidades Principais
- [x] Página Home com apresentação do app e 5 temas
- [x] Página Generator com fluxo de transformação de fotos
- [x] Sistema de autenticação com Manus OAuth
- [x] Upload de imagens para S3
- [x] Geração de imagens com IA (5 temas: Monstrinho, Bichos, Heróis, Pinturas, Séries e Filmes)
- [x] Download de imagens transformadas
- [x] Compartilhamento via WhatsApp
- [x] Página Gallery para ver exemplos
- [x] Página About com informações do app
- [x] Backend tRPC para upload e geração de imagens
- [ ] Schema do banco de dados para armazenar transformações (opcional para futuro)

## Temas Disponíveis
- Monstrinho (👾) - Criatura fofa mantendo traços faciais
- Bichos (🐾) - Animal adorável mantendo características
- Heróis (🦸) - Super-herói mantendo identidade
- Pinturas (🎨) - Retrato artístico preservando traços
- Séries e Filmes (🎬) - Personagem icônico mantendo aparência

## Problemas Identificados nos Testes (06/11/2025)

### Resultados dos Testes por Tema:
- **Bichinho**: OK pessoa isolada, OK casal, alterou parte do grupo
- **Monstro**: OK pessoa isolada, OK casal, alterou parte do grupo  
- **Super Herói**: OK em todos os cenários
- **Pintura**: OK pessoa isolada, OK casal, OK grupo, mas igual ao original (pouco impactante)
- **Cinema**: OK pessoa isolada, timeout em casal, timeout em grupo

### Ajustes Necessários:
- [x] Cinema: Adicionar mais criatividade e referências (Senhor dos Anéis, Harry Potter, Friends, Tarantino)
- [x] Cinema: Evitar repetição de personagens específicos (Breaking Bad para carecas com barba)
- [x] Pintura: Tornar transformações mais impactantes (cenários diferentes, roupas de época, mudanças dramáticas)
- [x] Bichinho e Monstro: Corrigir problema ao processar grupos (altera apenas parte do grupo)
- [x] Todos os temas: Enfatizar preservação de características faciais únicas
- [ ] Cinema: Melhorar performance (timeout em casal e grupo) - aguardando testes
- [ ] Geral: Otimizar tempo de processamento para todos os temas - aguardando testes

## Segundo Teste - Problemas Críticos (06/11/2025 - 15:47)

### Resultados:
- **Pintura**: FALHA - Idêntica à foto original, zero transformação
- **Cinema**: FALHA - Timeout em loop OU perde identidade facial completamente
- **Super Herói**: OK
- **Bichinho**: OK
- **Monstro**: OK

### Problemas Fundamentais Identificados:
1. Prompts muito complexos causam timeout
2. Pintura não está transformando nada
3. Cinema perde identidade facial ou dá timeout
4. Falta: HUMOR, SURPRESA, VARIEDADE, RAPIDEZ

### Proposta de Reformulação:
- [ ] Simplificar drasticamente os prompts (menos instruções = mais rápido)
- [ ] Mudar categorias para focar em TRANSFORMAÇÕES CLARAS e DIVERTIDAS
- [ ] Remover "Pintura" (não funciona bem)
- [ ] Remover "Cinema" (muito problemático)
- [ ] Manter: Bichinho, Monstro, Super Herói (funcionam bem)
- [ ] Adicionar novas categorias mais simples e impactantes

### Novas Categorias Sugeridas:
1. **Bichinho** 🐾 (mantém - funciona)
2. **Monstro** 👾 (mantém - funciona)
3. **Super Herói** 🦸 (mantém - funciona)
4. **Desenho Animado** 🎨 (novo - simples e rápido)
5. **Bebê** 👶 (novo - humor garantido)

## Novas Solicitações do Usuário (06/11/2025 - 16:00)

### Nova Categoria:
- [x] **Se tivesse nascido...** ⚧️ - Mudança de gênero (homem→mulher, mulher→homem) - IMPLEMENTADO

### Correções Urgentes:
- [x] Bichinho e Monstro: Garantir que TODAS as pessoas em grupos sejam transformadas (prompts atualizados com "Transform ALL people")
- [x] Todos os temas: Prompts otimizados com ênfase MÁXIMA em preservar identidade facial

### Decisões Finais:
- [x] Pintura: MANTER com foco em personagens históricos/antigos (versão anterior funcionava melhor)
- [x] Remover categoria "Cinema" (substituído por "Se tivesse nascido...")
- [x] Remover categoria "Super Herói" (muito infantil)

### Categorias Finais do App (4 categorias):
1. Bichinho 🐾 - Animal adorável
2. Monstro 👾 - Criatura fofa
3. Pintura 🎨 - Personagem histórico/antigo (1600s-1800s)
4. Se tivesse nascido... ⚧️ - Mudança de gênero

Removido: Super Herói (muito infantil)

## Terceiro Teste - Problema de Inconsistência (06/11/2025 - 16:17)

### Problema Crítico Identificado:
**Monstro em grupos:** Resultados MUITO inconsistentes entre gerações
- Teste 1 (16:17:26): Transformação SUTIL - apenas chifrinhos/antenas, rostos reconhecíveis ✅
- Teste 2 (16:18:42): Transformação EXTREMA - pele azul/roxa, perda TOTAL de identidade ❌

### Análise:
- A IA está gerando resultados aleatórios demais
- Falta controle sobre o nível de transformação
- Usuário perde interesse quando não se reconhece
- Precisa: Equilíbrio consistente entre transformação visível E reconhecimento facial

### Solução Implementada:
- [x] Ajustar prompts para forçar CONSISTÊNCIA
- [x] Especificar claramente o NÍVEL de transformação desejado: VÍVIDO e IMPACTANTE
- [x] Garantir que transformação seja VISÍVEL e INTERESSANTE
- [x] Manter rostos SEMPRE reconhecíveis com instruções CRITICAL

### Estratégia dos Novos Prompts:
- Monstro: Pele colorida vibrante (rosa, turquesa, roxo) + chifres + olhos grandes MAS estrutura facial reconhecível
- Bichinho: Transformação completa em animal com pelo/penas MAS expressão e traços preservados
- Pintura: Roupas elaboradas de época + cenários ornamentados MAS rosto idêntico ao original
- Gênero: Mudança convincente de cabelo/maquiagem/roupa MAS estrutura facial mantida

## Ajuste de Pintura - Mais Épocas (06/11/2025 - 16:25)

### Solicitação:
- [x] Expandir categoria "Pintura" para incluir mais épocas além de Renascença/Barroco/Vitoriano
- [x] Adicionar: Anos 20/30 (Máfia, Gangster), Anos 40/50 (Hollywood clássico), Anos 60 (Hippies), Belle Époque
- [x] IA escolhe aleatoriamente entre as épocas para trazer variedade e surpresa

### Épocas Disponíveis em "Pintura":
1. Anos 20-30: Máfia/Gangster (ternos risca-de-giz, chapéus fedora, Art Deco)
2. Anos 40-50: Hollywood Golden Age (vestidos glamourosos, smoking)
3. Anos 60: Hippies (tie-dye, headbands, símbolos de paz, flores)
4. Renascença 1500s: (golas, gibões)
5. Barroco 1600s: (veludo, renda)
6. Vitoriano 1800s: (espartilhos, cartolas)
7. Belle Époque 1890-1910: (vestidos elegantes, sombrinhas)

## Nova Categoria: Romanos, Gregos e Vikings (06/11/2025 - 16:28)

### Conceito:
- [ ] Adicionar 5ª categoria focada em beleza épica e vaidade
- [ ] Nome: "Romanos, Gregos e Vikings" 🏛️⚔️
- [ ] Objetivo: Apelar para fantasia de poder e beleza dos usuários

### Características:
**Mulheres:**
- Deusas sensuais gregas/romanas
- Vestidos esvoaçantes elegantes
- Coroas de louros, joias douradas
- Armaduras femininas elegantes
- Valquírias vikings

**Homens:**
- Guerreiros musculosos e poderosos
- Armaduras épicas (romana, grega, viking)
- Capacetes com chifres (vikings)
- Capas heroicas
- Gladiadores, centuriões

**Cenários:**
- Templos gregos/romanos
- Campos de batalha épicos
- Palácios imperiais
- Fjords nórdicos

### Implementação:
- [x] Adicionar ao backend (generation.ts, routers.ts)
- [x] Atualizar frontend (Generator.tsx, Home.tsx)
- [x] Criar prompt que preserve identidade facial mas embeleze
- [x] REFORÇAR TODOS OS PROMPTS: Instruções triplas para garantir que TODAS as pessoas sejam transformadas

### Estratégia Anti-Grupo-Parcial:
Todos os prompts agora incluem:
1. "IMPORTANT: Transform EVERY SINGLE person in the photo"
2. "Count all people and make sure EACH ONE is transformed"
3. "Do not leave anyone unchanged"
4. "ALL people must be [transformado]"

Isso deve resolver o problema crítico de grupos onde apenas algumas pessoas eram transformadas.

## Problema: Categoria Epic Altera Demais os Rostos (06/11/2025 - 16:38)

### Problema Identificado:
- [ ] Categoria "Romanos, Gregos e Vikings" está alterando MUITO os rostos
- [ ] Instrução "enhance attractiveness" está fazendo IA MUDAR identidade facial
- [ ] Mulher nas imagens teste ficou com rosto completamente diferente
- [ ] Perde toda a graça quando não reconhece a pessoa

### Solução:
- [x] REMOVER "enhance attractiveness" do prompt
- [x] REFORÇAR instruções de preservação facial MÁXIMA
- [x] Apelo à vaidade deve vir de: roupas épicas + poses heroicas + cenários dramáticos
- [x] NÃO de alterar o rosto da pessoa

### Novo Prompt Epic:
- Removido: "Make ALL people look BEAUTIFUL and POWERFUL - enhance attractiveness"
- Adicionado: "ULTRA CRITICAL: Keep faces PERFECTLY IDENTICAL to original - exact same facial features, expressions, skin tone, age, bone structure"
- Adicionado: "DO NOT enhance or beautify faces, DO NOT change facial appearance AT ALL"
- Foco: Apenas costume, pose e background mudam. Rosto 100% preservado.

## Melhoria: Transformação de Gênero Mais Marcante (06/11/2025 - 16:44)

### Problema Atual:
- [x] Transformação de gênero pode ficar sutil/ambígua
- [x] Precisa ser CLARA e IMPACTANTE para ter efeito

### Solução Implementada:
- [x] Roupas CARACTERÍSTICAS e marcantes para deixar transformação ÓBVIA

**Homem → Mulher:**
- Vestidos femininos marcantes (não apenas calça)
- Cabelos longos e estilizados
- Maquiagem evidente
- Acessórios femininos (brincos, colares, bolsas)
- Poses femininas

**Mulher → Homem:**
- Ternos masculinos bem marcados
- Cabelo curto masculino
- Barba/cavanhaque quando possível
- Acessórios masculinos (gravata, relógio)
- Poses masculinas

## Ajuste Fino: Epic - Embelezar Corpo, Não Rosto (06/11/2025 - 16:47)

### Estratégia Refinada:
- [x] **Corpo**: PODE embelezar (músculos para homens, silhueta para mulheres)
- [x] **Rosto**: Manter IDÊNTICO, apenas leve maquiagem/iluminação favorável
- [x] **Resultado**: Pessoa reconhecível em versão "épica"

### Implementação:
- Adicionado: "You may enhance body physique (muscles for men, silhouette for women)"
- Adicionado: "You may add subtle makeup/flattering lighting to faces (like professional photography)"
- Mantido: "DO NOT change facial structure, features, or make person unrecognizable"

### Benefícios:
- Mantém apelo à vaidade (corpo poderoso/belo)
- NÃO perde identidade facial
- Maquiagem leve = como foto profissional (realça sem alterar)

## Nova Funcionalidade: Sistema de Avaliação com Estrelas (06/11/2025 - 16:50)

### Objetivo:
- [x] Coletar feedback dos usuários sobre qualidade das transformações
- [x] Sistema de 1 a 5 estrelas
- [x] Armazenar avaliações no banco de dados

### Implementação:
- [x] Criar tabela `ratings` no schema do banco
- [x] Criar tRPC mutation para salvar avaliação
- [x] Criar componente StarRating no frontend
- [x] Integrar na página Generator após geração da imagem
- [x] Toast de confirmação após avaliação

### Funcionalidades Implementadas:
- Card de avaliação aparece após geração da imagem
- Usuário pode avaliar de 1 a 5 estrelas
- Estrelas com hover effect e animação
- Feedback visual: "Obrigado pelo feedback!" após avaliar
- Avaliação salva no banco com userId, theme, rating e timestamp
- Não permite avaliar duas vezes a mesma geração

### Campos da Tabela `ratings`:
- id (auto increment)
- userId (referência ao usuário)
- theme (qual categoria foi usada)
- rating (1-5 estrelas)
- comment (opcional, texto)
- createdAt (timestamp)

## Sistema de Créditos - Implementação (06/11/2025 - 17:00)

### Especificações:
- [x] Novos usuários recebem 5 créditos gratuitos ao se cadastrar
- [x] 1 crédito = 1 transformação
- [x] Bloquear geração quando créditos acabarem
- [x] Exibir saldo de créditos no app

### Pacotes de Créditos:
1. **Pacote Light** - R$ 9,90
   - 50 Créditos
   
2. **Pacote Premium** (MAIS POPULAR) - R$ 19,90
   - 200 Créditos + Recursos/Cursos Extras
   
3. **Ilimitado Mensal** - R$ 29,90/mês
   - Créditos Ilimitados (renovação mensal)
   
4. **Ilimitado Anual** - R$ 119,90/ano
   - Créditos Ilimitados (renovação anual - economize!)

### Implementação Backend:
- [x] Adicionar campo `credits` na tabela `users`
- [x] Adicionar campo `subscription_type` (free, light, premium, monthly_unlimited, annual_unlimited)
- [x] Adicionar campo `subscription_expires_at` para planos ilimitados
- [x] Criar tabela `credit_transactions` para histórico
- [x] Criar função `consumeCredit()` que valida e decrementa
- [x] Criar função `addCredits()` para adicionar créditos
- [x] Criar função `hasUnlimitedCredits()` para verificar assinatura ativa
- [x] Modificar mutation `generation.generate` para consumir crédito antes de gerar

### Implementação Frontend:
- [x] Exibir saldo de créditos no header/navbar (componente CreditBadge)
- [x] Criar página `/planos` com os 4 pacotes
- [x] Mostrar aviso quando créditos acabarem (toast com botão para planos)
- [x] Badge clicável leva para página de planos
- [x] Indicador visual de "MAIS POPULAR" no Pacote Premium
- [x] Badge pisca em vermelho quando créditos < 3
- [x] Badge dourado para usuários com plano ilimitado

### Integração Pagamento:
- [ ] Configurar Stripe para processar pagamentos (TODO: próxima fase)
- [ ] Criar webhooks para confirmar pagamento (TODO: próxima fase)
- [x] Estrutura preparada para adicionar créditos automaticamente após pagamento
- [ ] Enviar email de confirmação (opcional)

### Regras de Negócio:
- Usuários com plano ilimitado ativo não consomem créditos
- Planos ilimitados expiram e voltam para modo gratuito (0 créditos)
- Créditos comprados nunca expiram
- Histórico de transações mantido para auditoria

## Rebranding para ESPELHO AI (06/11/2025 - 18:30) ✅ CONCLUÍDO

### Tarefas:
- [x] Copiar logo para pasta public do projeto (espelho-ai-logo.png e espelho-ai-logo-transp.png)
- [x] Atualizar todas as referências de "Descubra seu verdadeiro eu!" para "ESPELHO AI"
- [x] Adicionar logo em todas as páginas principais (Home, Generator, Planos)
- [x] Atualizar meta tags (title, description, og:title, og:description)
- [x] Atualizar favicon
- [x] Manter esquema de cores laranja/vermelho que combina com o logo

### Arquivos modificados:
- [x] client/index.html (meta tags, title, favicon)
- [x] client/src/pages/Home.tsx (logo + título ESPELHO AI)
- [x] client/src/pages/Generator.tsx (logo + título ESPELHO AI)
- [x] client/src/pages/Planos.tsx (logo + título ESPELHO AI)
- [ ] client/src/pages/Gallery.tsx (não existe ainda)
- [ ] client/src/pages/About.tsx (não existe ainda)

### Resultado:
- Logo metade leão/metade rosto humano simbolizando transformação
- Branding consistente: "ESPELHO AI" com AI em laranja
- Favicon e meta tags atualizados para SEO
- Cores laranja/vermelho mantidas em harmonia com o logo

## Alinhamento Visual com Site Hostinger ✅ CONCLUÍDO

### Análise:
- Design do app já estava muito alinhado com o site
- Logo idêntico implementado
- Cores e layout consistentes
- Planos com mesmos valores e descrições

### Ajustes Finais:
- [x] Corrigir typo "Confixível" → "Confiável"
- [x] Remover botões duplicados na página de planos
- [x] Simplificar seção inferior da página de planos

### Resultado:
App totalmente alinhado com identidade visual do site Hostinger

## Análise do Site Hostinger - Seções e Estilo (09/11/2025)

### Seções do Site (em ordem):

**1. Hero Section (Topo - Fundo Preto)**
- Logo ESPELHO AI centralizado
- "Quero meus créditos!" (esquerda)
- "Como fazer?" (direita)
- Texto: "Carregue sua imagem... Gere a imagem, divirta-se e compartilhe!"
- Exemplos de antes/depois
- Botão: "Comece já!"
- "Gere três imagens bônus agora!!"

**2. Seção de Categorias (Fundo Branco/Claro)**
- Título: "No EspelhoAI, transforme suas fotos em personagens divertidos e criativos, misturando arte e humor e tecnologia!"
- 4 categorias com exemplos visuais:
  * Bichinho (verde)
  * Pintura (rosa/magenta)
  * Monstro (verde)
  * Histórico (laranja/vermelho)
- "Nossos criadores" - galeria de exemplos

**3. Plano Premium (Fundo Branco/Claro)**
- Título: "Plano Premium"
- Subtítulo laranja: "Com o EspelhoAI, suas fotos viram personagens divertidos e únicos a cada minuto!"
- 4 cards de categorias:
  * Históricas
  * Mostrinho (verde - typo: deveria ser "Monstrinho")
  * Bichinho (verde)
  * Pintura Clássica (rosa)

**4. Opiniões (Fundo Branco/Claro)**
- Título: "Opiniões"
- Subtítulo: "Veja o que nossos usuários divertem dizem"
- Cards de depoimentos com estrelas, texto e nome/localização

**5. Dúvidas Frequentes (Fundo Branco/Claro)**
- Título: "Dúvidas Frequentes"
- Perguntas e respostas:
  * Como funciona o app?
  * Posso usar as imagens geradas?
  * Quais estilos estão disponíveis?
  * O app é gratuito?
  * Minhas fotos ficam salvas?
  * Como posso enviar feedback ou sugestões?

**6. Contato (Fundo Roxo Escuro)**
- Título: "Contato"
- Texto: "Fale conosco para dúvidas ou sugestões"
- Ícones sociais: Facebook, Instagram, TikTok, YouTube
- Email: contato@espelhoai.com.br
- Formulário: "Seu nome, por favor" + "Enviar agora"
- Footer: "© 2025. All rights reserved."

### Cores Identificadas:
- **Preto**: #000000 ou similar (hero section, footer)
- **Branco/Claro**: #FFFFFF ou #F5F5F5 (seções intermediárias)
- **Laranja**: #FF6B35 ou similar (texto "AI", destaques)
- **Verde**: Para Bichinho e Monstro
- **Rosa/Magenta**: Para Pintura
- **Roxo Escuro**: #2D1B69 ou similar (seção contato)
- **Azul**: Botões de ação

### Tipografia:
- Fonte moderna, sans-serif
- Títulos em negrito
- Texto corpo regular

### Diferenças com o App Atual:
- [ ] App tem 5 categorias, site tem 4 (falta "Se tivesse nascido..." e "Romanos, Gregos e Vikings")
- [x] App não tem seção "Opiniões"
- [x] App não tem seção "Dúvidas Frequentes"
- [x] App não tem seção "Contato" com formulário
- [ ] App não tem galeria "Nossos criadores"
- [ ] Cores podem precisar ajuste fino
- [ ] Typo no site: "Mostrinho" → "Monstrinho"
- [ ] Typo no site: "divertem dizem" → "divertidos dizem"

### Ações Necessárias:
- [ ] Corrigir typos identificados
- [x] Adicionar seções faltantes ao app
- [ ] Ajustar cores para combinar perfeitamente
- [ ] Decidir se mantém 5 categorias no app ou alinha com as 4 do site

## Ajuste de UX - Substituir Opiniões por Planos (09/11/2025)

### Problema Identificado:
- [x] Seção "Opiniões" com estrelas parece clicável mas não tem função
- [x] Usuários podem ficar confusos tentando clicar nos botões de estrelas
- [x] Espaço valioso na página Home não está sendo usado de forma útil

### Solução:
- [x] Substituir seção "Opiniões" por seção "Planos de Créditos"
- [x] Mostrar os 4 pacotes de créditos disponíveis (Light, Premium, Mensal, Anual)
- [x] Botões funcionais que levam para página /planos
- [x] Destacar pacote "MAIS POPULAR" (Premium)
- [x] Design consistente com o resto da página

## PROBLEMA CRÍTICO - Geração de Imagens (09/11/2025) 🚨

### Problema Reportado:
- [x] Categoria "Romanos, Gregos e Vikings": foto de 1 mulher gerou GRUPO de pessoas
- [x] NENHUMA pessoa no resultado correspondeu aos traços da mulher original
- [x] Problema já foi mencionado mais de 10 vezes mas não foi resolvido definitivamente

### Regras ABSOLUTAS que devem ser seguidas:
1. **NÚMERO DE PESSOAS**: Se foto tem 1 pessoa → gerar 1 pessoa. Se tem 3 → gerar 3. NUNCA mudar quantidade!
2. **PRESERVAÇÃO FACIAL TOTAL**: Exceto Bichinho/Monstro, TODOS os outros temas devem manter rostos 100% idênticos
3. **Traços e expressões**: Mesma estrutura facial, mesma expressão, mesma idade, mesmo tom de pele

### Ação Necessária:
- [x] Revisar TODOS os prompts de geração
- [x] Adicionar instruções EXPLÍCITAS sobre manter número de pessoas
- [x] Reforçar preservação facial com linguagem mais forte
- [ ] Testar com foto de 1 pessoa para garantir que gera 1 pessoa (AGUARDANDO TESTE DO USUÁRIO)

## Remover Seção Visual Confusa (09/11/2025)

### Problema:
- [x] Seção com card mostrando "Transformação Mágica" + caixas "Sua Foto" e "Sua Versão" parece clicável
- [x] Usuários tentam clicar mas não faz nada
- [x] Ocupa espaço sem agregar valor
- [x] Já foi pedido ontem para remover

### Solução:
- [x] Remover completamente essa seção visual da página Home
- [x] Manter apenas o texto explicativo e botões de ação

## Aumentar Aleatoriedade e Evitar Capacetes (09/11/2025)

### Problema Identificado:
- [x] Mesma imagem gera transformações muito parecidas
- [x] Usuário recarrega porque não gostou OU quer ver outra versão
- [x] Capacetes dificultam identificação da pessoa
- [x] Falta variação nos resultados

### Solução:
- [x] Adicionar mais opções aleatórias em cada categoria
- [x] Instruir explicitamente: EVITAR capacetes
- [x] Variar poses, ângulos, cenários
- [x] Adicionar seed aleatório ou variações no prompt
- [x] Categoria "Romanos, Gregos e Vikings": preferir coroas, tiaras, cabelos soltos ao invés de capacetes
