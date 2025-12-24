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

## Melhorias de Variedade e Humor (09/11/2025)

### 1. Categoria Pintura - Mais Variada
- [x] Problema: Sempre sai renascentista/nobreza francesa
- [x] Solução: Adicionar estilos artísticos (Van Gogh, Picasso, Warhol, Monet)
- [x] Adicionar temas diversos: gangster, rockstar, hippie, punk, etc.

### 2. Categoria Gênero - Mais Humorada
- [x] Problema: Mudança muito séria, falta humor
- [x] Homem→Mulher: Roupas extravagantes (baiana, havaiana, freira, drag queen)
- [x] Mulher→Homem: Bigode, profissões (bombeiro, policial, médico, rockstar)
- [x] Cenários bem humorados e coloridos

### 3. Cards de Categorias Clicáveis
- [x] Problema: Cards são apenas visuais
- [x] Solução: Transformar em botões que levam direto para /generator
- [x] Usuário clica no card e já pode enviar foto naquele tema

## PROBLEMA CRÍTICO - Falta de Preservação Facial (09/11/2025) 🚨🚨🚨

### Problema GRAVE:
- [ ] Foto de homem idoso careca com barba branca gerou mulher jovem com rosto completamente diferente
- [ ] API atual (Manus ImageService) NÃO respeita instruções de preservação facial
- [ ] Prompts em inglês sendo IGNORADOS pelo modelo
- [ ] Sem preservação facial, o app PERDE TOTALMENTE O SENTIDO

### Causa Raiz:
- [ ] API atual só aceita `prompt` e `originalImages`
- [ ] Sem parâmetros técnicos de controle de preservação facial
- [ ] Modelo de IA ignora instruções textuais

### Solução Necessária:
- [ ] Buscar APIs alternativas com melhor preservação facial
- [ ] Avaliar: Replicate, Stability AI, Midjourney API, Face Swap APIs
- [ ] Integrar nova API que realmente preserve rostos
- [ ] Testar com múltiplas fotos antes de entregar ao usuário


## Análise de Prompts - Melhorar Gênero (09/11/2025)

### Observação do Usuário:
- [x] Pintura e Épico (Gregos/Romanos/Vikings) preservam rostos razoavelmente bem
- [x] Mudança de Gênero ficou "sem graça" - não preserva bem
- [x] Comparar prompts para identificar o que fazer diferente

### Ação:
- [x] Ler prompts atuais de Pintura, Épico e Gênero
- [x] Identificar diferenças estruturais
- [x] Reescrever prompt de Gênero usando técnicas dos que funcionam


## Problema - Bichinho e Monstro (09/11/2025)

### Observação do Usuário:
- [x] Bichinho e Monstro estão ficando muito diferentes da foto carregada
- [x] Não vão funcionar assim - precisam manter semelhança reconhecível
- [x] Aplicar mesma estrutura de preservação facial dos outros prompts

### Ação:
- [x] Reescrever prompt de Bichinho com preservação facial
- [x] Reescrever prompt de Monstro com preservação facial
- [x] Manter criatividade mas com rosto reconhecível


## Layout - Seções Alternadas Branco/Preto (09/11/2025)

### Requisito do Usuário:
- [x] Layout do site deve ter seções alternando entre fundo branco e preto
- [x] Inspirado no site em construção do Hostinger mostrado anteriormente
- [x] Aplicar em Home.tsx (principal)

### Ação:
- [x] Ajustar Home.tsx com seções alternadas
- [x] Ajustar cores de texto para contraste adequado
- [ ] Verificar outras páginas (Generator, Planos, etc.) - SE NECESSÁRIO


## Problema - Pintura com Muita Discoteca (09/11/2025)

### Observação do Usuário:
- [x] Estilo Pintura tem tendência a gerar tema Discoteca com muita frequência
- [x] Precisa aproveitar mais: Picasso, Rembrandt, Van Gogh, anos 20, gangsters
- [x] Dar maior variabilidade aos estilos artísticos clássicos

### Ação:
- [x] Aumentar número de estilos artísticos clássicos no prompt
- [x] Adicionar mais pintores famosos (Rembrandt, Caravaggio, Leonardo, Frida, Klimt, Munch)
- [x] Reduzir peso de Disco/anos 70 (removido completamente)
- [x] Manter variedade mas com foco em arte clássica (16 estilos, 9 são arte clássica)


## Nova Categoria - Gangster Anos 1920 (09/11/2025)

### Requisito do Usuário:
- [x] Criar categoria dedicada ao tema Gangster Anos 1920
- [x] Diversos cenários: carros de época, boates, festas, conflitos
- [x] Situações com armas, roupas de época (ternos, vestidos)
- [x] Alta variedade de contextos

### Ação:
- [x] Criar prompt com 12 cenários diferentes (Speakeasy, Tommy Gun, Vintage Car, Jazz Club, Casino, Bootlegger, Mob Meeting, Flapper Partner, Bank Heist, Rooftop, Dockyard, Valentine Massacre)
- [x] Adicionar tema ao generation.ts
- [x] Adicionar card na Home.tsx
- [x] Adicionar opção no Generator.tsx
- [x] Atualizar schema do banco (theme enum)
- [x] Atualizar contadores (5 temas → 6 temas)


## PROBLEMA CRÍTICO - Múltiplas Pessoas Perdem Características (09/11/2025)

### Problema:
- [x] Quando envia foto com 2+ pessoas, as gerações perdem características faciais individuais
- [x] Expressões faciais não são preservadas em fotos de grupo
- [x] Grande diferencial do app é criar variações que PAREÇAM as fotos originais
- [x] Sem preservação facial em grupos, o app perde seu propósito

### Ação:
- [x] Reescrever TODOS os prompts com ênfase em "EACH person" / "EVERY face"
- [x] Adicionar instrução explícita: "If 2 people, output 2 people with BOTH faces IDENTICAL"
- [x] Adicionar instrução explícita: "If 3 people, output 3 people with ALL 3 faces IDENTICAL"
- [x] Usar linguagem mais forte: "PRESERVE EACH INDIVIDUAL FACE"
- [ ] Testar com foto de 2 pessoas (AGUARDANDO TESTE DO USUÁRIO)
- [ ] Testar com foto de 3 pessoas (AGUARDANDO TESTE DO USUÁRIO)


## DECISÃO - Integrar API Alternativa para Múltiplas Pessoas (09/11/2025)

### Problema Confirmado:
- [x] API atual gera número errado de pessoas (envia 2, gera 3 ou 1)
- [x] API atual clona pessoas (todas ficam iguais ao invés de manter identidades individuais)
- [x] Prompts não resolvem - é limitação fundamental da API

### Decisão:
- [x] Opção 2: Buscar API alternativa especializada em face swap para grupos
- [ ] Pesquisar APIs comercialmente viáveis
- [ ] Escolher melhor custo-benefício
- [ ] Integrar ao projeto
- [ ] Testar com fotos de 2 e 3 pessoas


## Solução Final - Limitar a 1-2 Pessoas (09/11/2025)

### Decisão:
- [x] Não adicionar custo de API externa
- [x] Limitar app a fotos com 1-2 pessoas para garantir qualidade
- [x] Adicionar mensagem clara: "ESPELHO AI oferece melhores resultados com fotos individuais ou até duas pessoas"
- [x] Colocar mensagem em local visível (Home, Generator)
- [x] Aumentar tamanho e destaque do logotipo na página inicial
- [x] Logotipo deve ser mais proeminente no header (h-10 → h-14, text-2xl → text-3xl)


## Problema - Logotipo Encoberto no Mobile (09/11/2025)

### Problema:
- [x] Badge de créditos cobre o logotipo no mobile
- [x] Logotipo não está totalmente visível
- [x] Layout do header precisa ser ajustado para mobile

### Solução:
- [x] Reorganizar layout do header
- [x] Colocar badge de créditos em posição que não cubra o logo
- [x] Garantir que logo fique visível em todas as resoluções (flex-shrink-0, responsive sizes)


## Problema - Logotipo Muito Pequeno em Mobile (09/11/2025)

### Problema:
- [x] Logotipo está visível mas MUITO PEQUENO em mobile
- [x] Usuário não consegue notar o logo facilmente
- [x] Logo precisa ser MUITO MAIOR para ter destaque

### Solução:
- [x] Aumentar significativamente tamanho do logo em mobile (h-12 → h-16, desktop h-20)
- [x] Aumentar tamanho do texto também (text-xl → text-2xl, desktop text-4xl)
- [x] Garantir que logo seja visualmente proeminente


## Melhoria - Header com Fundo Preto (09/11/2025)

### Problema:
- [x] Logotipo laranja em fundo branco tem pouco contraste
- [x] Logo não se destaca visualmente o suficiente
- [x] Fundo preto faria o logo laranja "saltar" aos olhos

### Solução:
- [x] Mudar fundo do header de branco para preto (bg-white → bg-black)
- [x] Ajustar texto para branco/laranja para contraste (text-black → text-white)
- [x] Manter badge de créditos visível


## Melhoria - Faixa de Aviso com Fundo Escuro (09/11/2025)

### Problema:
- [x] Faixa de aviso laranja claro não combina com header preto
- [x] Falta consistência visual
- [x] Fundo escuro daria mais destaque e elegância

### Solução:
- [x] Mudar fundo da faixa de aviso para tom escuro (bg-orange-50 → bg-orange-900)
- [x] Manter texto legível com bom contraste (text-orange-800 → text-orange-100)
- [x] Manter ícone 💡 visível


## Tarefas Finais - Produção (27/11/2025)

### 1. GitHub
- [x] Configurar repositório GitHub
- [x] Fazer push do código completo
- [x] Verificar que todos os arquivos foram enviados

### 2. Integração Stripe
- [x] Conectar botões "Adquirir Agora" ao Stripe Checkout
- [x] Implementar fluxo de pagamento para Pacote Light (R$ 9,90 / 50 créditos)
- [x] Implementar fluxo de pagamento para Pacote Premium (R$ 19,90 / 200 créditos)
- [x] Implementar fluxo de pagamento para Ilimitado Mensal (R$ 29,90)
- [x] Implementar fluxo de pagamento para Ilimitado Anual (R$ 119,90)
- [x] Configurar webhook para adicionar créditos após pagamento confirmado
- [ ] Testar fluxo completo de compra (requer ativação do sandbox Stripe)

### 3. Conexão de Domínio Hostinger
- [x] Criar guia passo a passo para conectar www.espelhoai.com.br
- [x] Incluir instruções de configuração DNS na Hostinger
- [x] Incluir instruções de configuração no painel Manus
- [x] Documentar tempo de propagação DNS
- [x] Incluir instruções de atualização de URLs Stripe
- [x] Incluir seção de solução de problemas


## Melhorias - PWA e Ajustes de Conteúdo (27/11/2025)

### 1. PWA (Progressive Web App)
- [x] Criar manifest.json com ícones e configurações
- [x] Adicionar service worker para funcionalidade offline
- [x] Configurar meta tags para instalação
- [x] Usar logo existente como ícone
- [ ] Testar instalação em Android e iOS (requer teste manual)

### 2. Ajustes Visuais
- [x] Mudar cor do aviso "funciona melhor com 1-2 pessoas" para azul escuro (bg-blue-900)
- [x] Manter consistência com design preto/branco alternado

### 3. Atualização de Textos
- [x] Dar destaque aos estilos: Gregos/Romanos/Vikings, Gangster, Pintura (bordas mais grossas, shadow)
- [x] Reduzir destaque de Bichinho e Monstro (bordas finas, sem shadow)
- [x] Atualizar descrições para mencionar Van Gogh, Picasso, Monet
- [x] Garantir que Gangster apareça nas descrições
- [x] Texto principal menciona todos os estilos principais

### 4. Correção de Prompts
- [x] Investigar repetição de estilo egípcio em Pintura (era confusão com temas de época)
- [x] Ajustar prompts para maior variedade (removidos temas 1920s/1940s/1950s, adicionados mais artistas)
- [x] Adicionar mais estilos artísticos famosos (Dalí, Matisse, Botticelli, Toulouse-Lautrec, Vermeer)
- [ ] Testar gerações para confirmar diversidade (requer teste manual)


## Melhorias - Aleatoriedade e Nova Categoria Circo (27/11/2025)

### 1. Sistema de Aleatoriedade Melhorado
- [x] Implementar timestamp + user ID no random seed para maior variação
- [x] Adicionar mais variações de poses, ângulos e composições em cada estilo
- [x] Garantir que gerações consecutivas sejam visivelmente diferentes (randomSeed + randomVariation)
- [ ] Testar múltiplas gerações do mesmo estilo (requer teste manual)

### 2. Nova Categoria: Circo 🎪
- [x] Criar prompts para profissões circenses (12 profissões: acrobata, trapezista, palhaço, mágico, mestre de cerimônias, equilibrista, cuspidor de fogo, homem forte, contorcionista, malabarista, domador, equilibrista)
- [x] Adicionar variações de roupas coloridas típicas de circo
- [x] Incluir cenários de picadeiro, lona, palco circense
- [x] Adicionar categoria "circus" ao tipo de transformação
- [ ] Criar ícone e descrição para categoria Circo

### 3. Integração UI
- [x] Adicionar card Circo na página Home (com destaque: borda grossa + shadow)
- [x] Adicionar opção Circo na página Generator
- [x] Atualizar contadores (7 Temas ao invés de 6)
- [x] Atualizar textos e descrições mencionando Circo
- [x] Posicionar Circo como categoria de destaque (4ª posição)
- [x] Atualizar schema do banco (adicionar circus ao enum theme)
- [x] Atualizar routers.ts (adicionar circus aos tipos e themeNames)
- [x] Aplicar migração do banco (pnpm db:push)


## Novas Funcionalidades - Final de Ano 2026 (09/12/2025)

### 1. Contador Regressivo para 2026 ✅ CONCLUÍDO
- [x] Criar componente CountdownTimer
- [x] Exibir dias/horas/minutos/segundos até 01/01/2026 00:00
- [x] Adicionar na seção Final de Ano (Home.tsx)
- [x] Animação e estilo festivo

### 2. Botão de Compartilhamento com Hashtag ✅ CONCLUÍDO
- [x] Atualizar função handleShare no Generator.tsx
- [x] Incluir hashtag #EspelhoAI2026 automaticamente para Natal/Réveillon
- [x] Adicionar temas natal e reveillon ao sistema completo
- [x] Atualizar schema do banco de dados
- [x] Aplicar migrações (pnpm db:push)

### 3. Otimização de Prompts ✅ CONCLUÍDO
- [x] Revisar prompts de todos os 9 temas
- [x] Garantir preservação impecável de fisionomias (PIXEL-PERFECT IDENTICAL)
- [x] Adicionar diversidade de roupas/acessórios para cada tema
- [x] Criar cenários variados e imersivos
- [x] Implementar aleatoriedade forte (random seeds)
- [x] Validar qualidade e consistência das gerações

## Download Antes/Depois Lado a Lado (16/12/2025)

### Funcionalidade:
- [x] Criar componente para gerar imagem combinada Antes/Depois
- [x] Etiquetas pequenas "Antes" e "Depois" na imagem
- [x] Cobrança de 1 crédito adicional para download
- [x] Botão de download no Generator
- [x] Backend para gerar imagem combinada

## Correções Urgentes (16/12/2025)

### 1. Download Alta Resolução Não Aparece
- [x] Verificar componente HighResolutionDownload
- [x] Verificar se está sendo importado no Generator
- [x] Corrigir exibição do botão

### 2. Praia Replica Usuário em Grupos
- [x] Corrigir prompt para usar pessoas aleatórias da IA
- [x] Manter apenas o rosto do usuário, amigos devem ser pessoas diferentes
- [x] Evitar aparência plástica/artificial

### 3. Pinturas Mais Fiéis aos Estilos
- [x] Melhorar prompts de pintura para estilos artísticos específicos
- [x] Caprichar nas épocas e estilos (Renascença, Barroco, etc.)

## Acesso Direto aos Temas de Final de Ano (16/12/2025)

- [x] Natal: Clicar vai direto para upload com tema pré-selecionado
- [x] Réveillon: Clicar vai direto para upload com tema pré-selecionado
- [x] Praia 2026: Clicar vai direto para upload com tema pré-selecionado

## Melhorias UX - Todos os Temas (16/12/2025)

- [x] Clique direto para upload em todos os cards de temas (não só Final de Ano)
- [x] Adicionar ícone de câmera/upload nos cards
- [x] Garantir responsividade mobile nos cards clicáveis


## Bug Crítico: Navegação Direta para Upload (16/12/2025)

- [ ] BUG: Clique em tema (Natal, Réveillon, Praia, etc) deve ir DIRETO para upload/câmera, não para menu de seleção
- [ ] Generator.tsx deve detectar tema na URL e pular direto para step "upload" quando tema já está selecionado


## Atualização de Domínio (16/12/2025)

- [x] Atualizar domínio para www.espelhoai.com.br em Generator.tsx (compartilhamento WhatsApp)
- [x] Atualizar domínio para www.espelhoai.com.br em Home.tsx (Facebook, WhatsApp, Twitter)
- [ ] Configurar domínio customizado no painel Manus (Settings → Domains)


## Bugs de Download (16/12/2025)

- [x] BUG: Download em maior resolução corta a parte de dicas (adicionado scroll no dialog)
- [x] FEATURE: Permitir usuário escolher local de salvamento da foto (File System Access API)


## Reformulação de Planos (17/12/2025)

- [x] Remover planos ilimitados (mensal e anual) da página de planos
- [x] Manter apenas planos de créditos avulsos (Light 50 créditos e Premium 150 créditos)


## Bug Stripe 404 (17/12/2025)

- [x] BUG: Erro 404 ao tentar fazer checkout do Stripe (URL de retorno corrigida para www.espelhoai.com.br)


## Bug Download Imagem (17/12/2025)

- [x] BUG: "Erro ao baixar imagem" ao tentar fazer download (corrigido com fallbacks para CORS)


## Melhorias UX Home (17/12/2025)

- [x] Remover ícones de câmera sob as imagens dos estilos
- [x] Remover frases "Toque para transformar"
- [x] Deixar apenas nome do estilo com ícone de seta ao lado
- [x] Corrigir navegação para ir DIRETO para upload com tema selecionado (já estava funcionando)
- [x] Alterar "Já veja o verão!" para "Você no verão!"
- [x] Alterar frase "milhares já se transformaram" para "A transformação que você sempre quis, agora em suas mãos!"


## Melhorias Prompts Praia e Circo (17/12/2025)

- [x] Praia: Adicionar muito mais variedade de cenários (esportes, contemplação, caminhada, diferentes vistas)
- [x] Praia: Melhorar integração visual (luz, sombras, perspectiva) - não parecer colagem
- [x] Praia: Garantir expressões alegres e divertidas
- [x] Circo: Aumentar variedade de cenários e profissões
- [x] Circo: Melhorar integração visual


## Bug Download (17/12/2025)

- [x] Corrigir botão de download - atualmente só exibe imagem na tela em vez de baixar o arquivo

- [x] Download: Deve salvar na Galeria/Fotos do dispositivo (usa Web Share API em mobile)
- [x] Compartilhamento: Mensagem do WhatsApp inclui link da imagem (usa Web Share API com arquivo em mobile)


## Bugs Reportados (17/12/2025 - 16:35)

- [x] Erro React #321 ao tentar salvar imagem no celular (corrigido com proxy e Web Share API)
- [x] Download Antes/Depois não está gerando (corrigido com proxy e Web Share API)
- [x] Circo sempre gera fraque e cartola - adicionado sistema de número aleatório para forçar variedade entre 20 profissões


## Bugs Reportados (17/12/2025 - 17:45)

- [x] Compartilhamento: Links do app e site adicionados + texto copiado para clipboard
- [x] Antes/Depois: Adicionado logs e timeout de 60s para debug

- [x] Resolução HD: Removido opções falsas HD/4K, simplificado para "Download para Impressão" com 5 créditos


## Bugs Reportados (24/12/2024)

- [x] Planos: Corrigido para 40 e 100 créditos (mantidos preços R$9,90 e R$19,90)
- [x] Gangster (mulheres): Reforçado preservação de fisionomia com regras ULTRA CRITICAL
- [x] Réveillon: Reforçado preservação de fisionomia com regras ULTRA CRITICAL
- [x] Duas pessoas: Adicionado regras especiais para preservar AMBAS as faces com igual qualidade
- [x] Compartilhamento: Melhorado com logo (🦁), links e hashtags
- [x] Antes/Depois: Melhorado com timeout 90s, retries e validações
- [x] Deploy: Manter no Manus Hosting (Vercel não suporta backend Node.js contínuo)


## Bug Crítico: Download Antes/Depois (24/12/2025)

- [x] BUG CRÍTICO: Download Antes/Depois gera imagem de pessoa errada (IA estava gerando imagem nova em vez de combinar as fotos reais)
- [x] Solução: Usar sharp para combinar imagens lado a lado em vez de usar IA - IMPLEMENTADO
- [x] Resultado: Download instantâneo (menos de 2 segundos) com imagens REAIS do usuário

## Bugs Reportados 24/12/2024 - Sessão 2
- [x] Compartilhamento sem logo/link em algumas imagens (logs adicionados para debug)
- [x] Botão Antes/Depois está direcionando para compartilhar em vez de baixar (removido Web Share API)
- [x] Prompt "Se Tivesse Nascido" não preserva fisionomia (prompt reforçado com ULTRA CRITICAL rules)

## Nova Feature: Repositório de Transformações (24/12/2024)
- [x] Criar tabela transformation_history no banco de dados
- [x] Implementar função para salvar transformação no histórico
- [x] Implementar função para buscar histórico do usuário (últimos 5 dias)
- [x] Criar componente TransformationHistory no frontend
- [x] Adicionar botão "Ver Minhas Transformações" na página de resultado
- [x] Permitir rever, baixar e compartilhar transformações do histórico
- [x] Implementar limpeza automática de transformações com mais de 5 dias



## Melhorias no Histórico de Transformações (24/12/2025)

### Sugestão 1: Filtro por Tema
- [x] Adicionar dropdown de filtro no modal de histórico
- [x] Opções: Todos, Favoritos, e cada tema individual
- [x] Backend: nova procedure `listByTheme` para buscar por tema específico

### Sugestão 2: Notificação de Expiração
- [x] Criar campo `notifiedExpiring` no banco para rastrear notificações
- [x] Backend: procedure `getExpiring` para buscar itens expirando em 24h
- [x] Frontend: toast de aviso ao abrir histórico
- [x] Componente `ExpirationNotification` como banner fixo no topo
- [x] Verificação automática a cada 5 minutos

### Sugestão 3: Sistema de Favoritos
- [x] Adicionar campo `isFavorite` na tabela `transformation_history`
- [x] Favoritos não expiram (expiresAt estendido para 10 anos)
- [x] Backend: procedures `toggleFavorite` e `listFavorites`
- [x] Frontend: botão de estrela em cada transformação
- [x] Badge visual diferenciado para favoritos
- [x] Contadores: total, favoritos, expirando

### Outras Correções
- [x] Atualizar nome do tema Gangster: remover "1920s" (agora aceita gangsters de várias épocas)

## Bug Report - 24/12/2024 (Segundo)
- [x] Corrigir header mostrando "Logo" como texto em vez do logo real no site espelhoai.com.br
- [ ] Investigar problema de "Não Seguro" (SSL/HTTPS) no navegador

