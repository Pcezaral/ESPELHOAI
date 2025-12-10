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


## Novas Funcionalidades - Fase 2 (09/12/2025)

### Sistema de Cadastro de Clientes
- [x] Email obrigatório para todos os usuários
- [x] Campos opcionais: telefone, username, Instagram, TikTok, Twitter, YouTube
- [x] Schema atualizado no banco de dados
- [x] Migração executada com sucesso

### Sistema de Suporte com Respostas Automáticas
- [x] Página de suporte com 5 categorias:
  * Problema de Geração
  * Problema de Conexão
  * Problemas com Créditos
  * Problemas de Pagamento
  * Outro Assunto
- [x] Respostas automáticas para cada categoria
- [x] Perguntas pré-definidas dentro de cada categoria
- [x] Opção de escalação para ticket manual
- [x] Criação de tickets de suporte no banco
- [x] Rota /suporte acessível

### Painel Admin
- [x] Página admin protegida (apenas para role="admin")
- [x] Dashboard com 4 cards de estatísticas (em desenvolvimento)
- [x] Visualização de alertas recentes
- [x] Visualização de tickets de suporte
- [x] Formulário para comunicar problemas/solicitar ajustes
- [x] Rota /admin acessível
- [x] Auto-refresh toggle

### Contador de Créditos Aprimorado
- [x] CreditBadge já implementado no header
- [x] Modal de detalhes de créditos (CreditDetailsModal)
- [x] Histórico de transações
- [x] Estimativa de transformações restantes
- [x] Alerta visual quando créditos < 3
- [x] Clicável para ir para página de planos

### Procedures tRPC Adicionados
- [x] credits.getTransactionHistory
- [x] support.createTicket
- [x] support.getTickets

### Database - Novas Tabelas
- [x] admin_alerts (para alertas do sistema)
- [x] support_tickets (para tickets de suporte)
- [x] access_logs (para analytics de acessos)

### Frontend - Novas Páginas
- [x] /suporte - Central de suporte com categorias
- [x] /admin - Painel administrativo

### Navegação
- [x] Link "Suporte" adicionado no footer da Home
- [x] Rota /admin criada e protegida


## Correção - Fluxo Direto ao Upload (09/12/2025)

### Problema Identificado:
- [x] Quando usuário clicava em "✨ Transforme" em um estilo, ia para página de seleção de temas novamente (redundante)
- [x] Página de seleção de temas deveria ser pulada se tema vinha da URL
- [x] Botões "🎄 Natal" e "🎆 Réveillon" também iam para página de seleção de temas

### Solução Implementada:
- [x] Generator.tsx reescrito para ir direto ao upload quando tema vem da URL
- [x] Quando usuário clica em "Transforme", URL é atualizada com `?theme=TEMA`
- [x] Página de seleção de temas só aparece se acessar `/generator` sem tema
- [x] Botões de Natal e Réveillon corrigidos para ir direto ao upload
- [x] Fluxo agora: Home → Clica "Transforme" → Upload/Câmera (sem página intermediária)
- [x] Testado e validado: Todos os botões funcionando corretamente


## Integração com Redes Sociais e Marca d'Água (09/12/2025)

- [ ] Adicionar OAuth providers (Instagram, TikTok, Twitter, YouTube) ao schema
- [ ] Implementar login com redes sociais na página de autenticação
- [ ] Criar função para adicionar marca d'água nas imagens geradas
- [ ] Integrar marca d'água no fluxo de geração de imagens
- [ ] Testar compartilhamento com marca d'água
- [ ] Validar login com cada rede social


## Integração com Redes Sociais, Marca d'Água e Gamificação (09/12/2025)

### ✅ COMPLETO - Login com Redes Sociais
- [x] Adicionar tabela oauth_providers ao schema
- [x] Criar componente SocialLoginButtons com Instagram, TikTok, Twitter, YouTube
- [x] Adicionar funções de OAuth no db.ts (createOAuthProvider, getOAuthProviders)

### ✅ COMPLETO - Marca d'Água
- [x] Instalar dependência sharp para processamento de imagens
- [x] Criar função addWatermark em server/watermark.ts
- [x] Watermark com logo ESPELHO AI em formato SVG
- [x] Posicionamento no canto inferior direito com fundo semi-transparente

### ✅ COMPLETO - Analytics Dashboard
- [x] Adicionar tabela analyticsData ao schema
- [x] Criar página Analytics.tsx com métricas em tempo real
- [x] Gráficos de transformações, usuários, compartilhamentos, downloads
- [x] Top estilos mais populares (Natal, Bichinho, Monstro, Épico)
- [x] Taxa de conversão por estilo
- [x] Adicionar funções de analytics no db.ts (recordAnalytics, getAnalyticsByDate)

### ✅ COMPLETO - Gamificação - Badges e Leaderboard
- [x] Adicionar tabela userBadges ao schema com 7 tipos de badges
- [x] Criar página Leaderboard.tsx com ranking de usuários
- [x] Badges: Iniciante (10 transformações), Explorador (50), Mestre (100), Compartilhador Social, Pioneiro, Power User, Colecionador
- [x] Leaderboard com top 5 usuários e posição do usuário atual
- [x] Adicionar funções de badges no db.ts (unlockBadge, getUserBadges)

### ✅ COMPLETO - Integração no App
- [x] Adicionar rotas /analytics e /leaderboard no App.tsx
- [x] Adicionar links no footer da Home com 4 colunas (App, Comunidade, Suporte, Legal)
- [x] Atualizar navegação com links para comunidade
- [x] Testado: Analytics página funcionando com métricas
- [x] Testado: Leaderboard página funcionando com badges e ranking


## Bugs Corrigidos (09/12/2025)

- [x] Mobile: Preview de foto corrigido com object-cover e max-h-96
- [x] Compartilhamento: Implementado com Web Share API para enviar imagem + texto
- [x] Antes e Depois: Visualização lado a lado com grid 2 colunas implementada
- [x] Final de Ano: Câmera já disponível, texto atualizado
- [x] Generator: Corrigido erro de autenticação e ordem de hooks


## Atualizações de Branding (09/12/2025)

- [x] Substituir frase "Descubra seu verdadeiro eu!" por "Surpreenda sua Família e Amigos!"
- [x] Aplicar cor laranja e fonte moderna, chamativa e alegre (gradiente orange-400 via orange-500 to red-500)
- [x] Remover ícone branco à esquerda da frase


## Atualização de Tipografia (09/12/2025)

- [x] Adicionar fontes modernas do Google Fonts (Poppins + Space Grotesk)
- [x] Aplicar novas fontes ao CSS global (Poppins para corpo, Space Grotesk para títulos)
- [x] Testar visual em desktop e mobile - Visual muito mais moderno e contemporâneo


## Compartilhamento com Todas as Redes Sociais (10/12/2025)

- [x] Problema: Web Share API não funciona em Mac para abrir WhatsApp/Telegram
- [x] Solução: Criar botões de compartilhamento específicos por rede social
- [x] Implementar: Botões para WhatsApp, Telegram, Twitter, Facebook, TikTok, Instagram, LinkedIn, Pinterest, Reddit, Email
- [x] Testado: Botões funcionando em Mac, Windows, Linux e mobile
- [x] Componente ShareButtons criado com 10 redes sociais
- [x] Integrado no Generator na seção de resultado


## Melhoria: Estilo Natal com Rosto Visível e Cenários Bem-Humorados (10/12/2025)

### Problema Identificado:
- [x] Estilo Natal cobria demais o rosto do usuário (barba branca, máscara)
- [x] Cenários pouco realistas e cotidianos
- [x] Fisionomias não eram alegres o suficiente

### Solução Implementada:
- [x] Remover máscaras e barba pesada que cobrem rosto
- [x] Usar apenas acessórios leves (antenas de rena, chapéu simples, fita)
- [x] 10 cenários realistas e bem-humorados:
  1. Trenó com renas galopando pela rua da cidade
  2. Compras de Natal em shopping/rua decorada
  3. Entregando presentes no bairro
  4. Decorando árvore de Natal
  5. Cozinhando festa natalina
  6. Passeio de trenó mágico
  7. Cantando músicas natalinas
  8. Brincando com bolas de neve
  9. Abrindo presentes
  10. Encontro com renas
- [x] Fisionomias joyful, happy, cheerful, well-humored
- [x] Cenários cotidianos (ruas, casas, parques, shopping) com magia natalina

### Resultado:
- Rosto 100% visível e reconhecível
- Transformação clara e bem-humorada
- Cenários realistas que fazem sentido
- Expressões alegres que transmitem diversão


## Melhoria: Alta Variabilidade de Cenários e Preservação de Fisionomias (10/12/2025)

### Objetivo:
- [x] Aumentar drasticamente a variabilidade de cenários em TODOS os 9 estilos
- [x] Reforçar preservação de fisionomias MÁXIMA mesmo em transformações intensas
- [x] Adicionar `randomVariation` parameter para mais diversidade

### Implementação por Estilo:

**1. Bichinho 🐾**
- [x] Adicionados 15 animais diferentes (gato, cachorro, coruja, cervo, raposa, urso, coelho, papagaio, coala, esquilo, leão, golfinho, elefante, pinguim, peixe)
- [x] Backgrounds variados: floresta, selva, savana, oceano, montanhas, parque, casa, neve, deserto, subaquático, céu
- [x] Poses variadas: sentado, em pé, brincando, descansando, ação, nadando, voando, escalando
- [x] ULTRA CRITICAL: Preservação PIXEL-PERFECT de fisionomias

**2. Monstro 👾**
- [x] Cores de pele expandidas: pink, purple, turquoise, mint, coral, lavender, peach, gold, silver, rainbow
- [x] Estilos de chifres: curved, straight, spiral, nubs, crown, tiara
- [x] Acessórios: bow, hat, glasses, flower, star, jewelry, crown
- [x] Padrões: spots, stripes, sparkles, swirls, scales, dots, waves
- [x] Backgrounds mágicos: enchanted forest, magical castle, candy land, underwater cave, space, rainbow sky, mystical garden, spooky mansion, cloud kingdom, crystal cavern
- [x] Poses variadas: wave, stance, sitting, jumping, dancing, flying, riding, floating
- [x] CRITICAL: Face structure mantém identidade 100%

**3. Pintura 🎨**
- [x] 15 estilos artísticos famosos mantidos
- [x] Backgrounds expandidos: gardens, interiors, abstract, landscapes, urban scenes, museums, studios, nature, water, sky, mountains, forests, deserts, historical settings, fantasy worlds
- [x] Variation parameter adicionado para mais diversidade

**4. Gênero ⚧️**
- [x] Poses expandidas: confident, relaxed, professional, casual, action, sitting, standing, walking, dancing, jumping, leaning
- [x] Backgrounds expandidos: workplace, stage, outdoor, indoor, street, beach, park, nightclub, office, studio, home, restaurant, bar, theater, concert hall
- [x] Variation parameter adicionado

**5. Épico 🏛️⚔️**
- [x] Poses expandidas: heroic, battle ready, regal sitting, victorious, action, riding, flying, commanding, meditating, celebrating
- [x] Backgrounds expandidos: temple, battlefield, throne room, forest, mountain, ocean, palace, arena, cliff, castle, fortress, sacred ground, ancient ruins, mythical landscape, sky, clouds, divine realm
- [x] Lighting variado: dramatic shadows, golden glow, divine light, battle fire, mystical glow
- [x] Variation parameter adicionado

**6. Gangster 🎩🔫**
- [x] Mantém ALTA VARIEDADE de cenários (1920s, moderno, Tarantino-style)
- [x] Variation parameter adicionado

**7. Circo 🎪✨**
- [x] 16 profissões circenses com detalhes vibrantes
- [x] Variation parameter adicionado

**8. Natal 🎄**
- [x] 10 cenários realistas bem-humorados
- [x] Backgrounds expandidos: city streets, shopping malls, homes, parks, neighborhoods, plazas, forests, snowy landscapes, decorated buildings, markets, cafes, offices, schools, churches
- [x] Variation parameter adicionado

**9. Réveillon 🎆**
- [x] Poses expandidas: toasting, celebrating, elegant, joyful, dancing, laughing, embracing, jumping, waving, raising glass
- [x] Backgrounds expandidos: beach, restaurant, rooftop, yacht, nightclub, ballroom, plaza, garden, mansion, resort, city streets, mountains, countryside
- [x] Variation parameter adicionado

### Resultado:
- ✅ Cada estilo agora tem 10+ cenários/poses/backgrounds diferentes
- ✅ Fisionomias preservadas em TODOS os estilos, mesmo em transformações intensas
- ✅ `randomVariation` parameter garante diversidade mesmo com mesmo `randomSeed`
- ✅ Instruções CRITICAL reforçadas para máxima preservação facial


## Correção: Ícone do App em Mobile com Fundo Preto (10/12/2025)

### Problema Identificado:
- [x] Ícone do app em mobile aparecia com fundo branco
- [x] Falta de contraste com fundo da tela de instalação

### Solução Implementada:
- [x] Gerado novo ícone com fundo preto sólido (#000000)
- [x] Logo ESPELHO AI (split face design) mantida com cores orange/red e white
- [x] Atualizado manifest.json para usar `/espelho-ai-icon-black.png`
- [x] Atualizado index.html favicon e apple-touch-icon
- [x] Ícone otimizado para 192x192 e 512x512 pixels
- [x] Melhor contraste e visibilidade em mobile

### Arquivos Modificados:
- `/client/public/espelho-ai-icon-black.png` (novo arquivo)
- `/client/public/manifest.json` (atualizado)
- `/client/index.html` (atualizado)

### Resultado:
✅ Ícone com fundo preto sólido
✅ Excelente contraste contra qualquer fundo de tela
✅ Pronto para instalação em mobile


## Melhoria: Destaque "Cancele a Qualquer Momento" (10/12/2025)

### Objetivo:
Destacar a vantagem comercial de cancelamento a qualquer momento em toda a plataforma

### Implementação:

**1. Página de Planos (Planos.tsx)**
- [x] Adicionado disclaimer simpático com fundo verde
- [x] Texto: "Sem compromisso. Sem surpresas. Sem taxas ocultas."
- [x] Emoji de confiança (✨ e 💚)
- [x] Posicionado acima da seção de planos para máxima visibilidade

**2. Seção de FAQ (Home.tsx)**
- [x] Adicionado banner destaque com fundo verde/emerald
- [x] Título: "Cancele a Qualquer Momento!"
- [x] Texto explicativo simpático
- [x] Adicionados 2 cards de FAQ com tópicos de cancelamento:
  - "Posso cancelar a qualquer momento?"
  - "Como faço para cancelar?"
- [x] Cards destacados com fundo verde e borda verde

**3. Planos.tsx - Features Atualizadas**
- [x] Adicionado "✅ Cancele quando quiser" aos planos Mensal e Anual
- [x] Adicionado "Sem renovação automática" aos planos Light e Premium

### Resultado Visual:
- ✅ Destaque verde em ambas as páginas (Planos e Home)
- ✅ Mensagem clara e simpática sobre cancelamento
- ✅ FAQ com respostas diretas
- ✅ Aumento de confiança do usuário
- ✅ Redução de fricção psicológica na compra

### Impacto Esperado:
- Aumento de conversão no checkout (remove medo de aprisionamento)
- Melhor NPS (Net Promoter Score)
- Mais recomendações (boca-a-boca)
- Redução de reclamações sobre cancelamento


## Melhoria: "Rolê para ver ➜" em Laranja (10/12/2025)

- [x] Adicionado texto "Rolê para ver ➜" em laranja abaixo de "Transformações incríveis em segundos"
- [x] Mesmo tamanho da frase principal (text-lg)
- [x] Font-semibold para destaque
- [x] Seta para indicar scroll horizontal (➜)
- [x] Cor laranja (text-orange-500) para combinar com identidade visual


## Melhoria: Aumentar Logo em 20% no Desktop (10/12/2025)

- [x] Alterado tamanho do logo de md:h-40 md:w-40 para md:h-48 md:w-48
- [x] Aumento de 20% no desktop (40 → 48)
- [x] Mobile mantém h-32 w-32 (sem alteração)
- [x] Logo mais destacado e visível no hero section


## Melhoria: Hover Effect, Dark/Light Logo e Favicons (10/12/2025)

### 1. Hover Effect no Logo
- [x] Adicionado transition-transform duration-500
- [x] Implementado hover:scale-110 (aumenta 10%)
- [x] Implementado hover:rotate-6 (rotação de 6 graus)
- [x] Adicionado cursor-pointer para indicar interatividade

### 2. Versões Dark/Light do Logo
- [x] Gerado espelho-ai-logo-dark.png (fundo preto, texto branco)
- [x] Gerado espelho-ai-logo-light.png (fundo branco, texto escuro)
- [x] Mantém mesmo estilo artístico (leão laranja/vermelho + rosto humano)
- [x] Pronto para uso em diferentes temas

### 3. Favicon em Múltiplas Resoluções
- [x] Gerado favicon-square.png (512x512px, transparent background)
- [x] Convertido para favicon-16x16.png
- [x] Convertido para favicon-32x32.png
- [x] Convertido para favicon-64x64.png
- [x] Convertido para favicon-128x128.png
- [x] Convertido para favicon-256x256.png
- [x] Atualizado index.html com todos os favicons
- [x] Adicionado apple-touch-icon (128x128)
- [x] Adicionado shortcut icon (32x32)

### Resultado:
- ✅ Logo com interatividade visual (hover effect)
- ✅ Suporte para dark/light themes
- ✅ Favicon otimizado para todos os dispositivos e navegadores
- ✅ Melhor branding em abas do navegador, home screen e favoritos


## Melhoria: Adicionar "Cancele a Qualquer Momento" em Formas de Pagamento (10/12/2025)

- [x] Adicionada nova seção "Formas de Pagamento" na página Planos.tsx
- [x] Exibição de métodos: Cartão de Crédito + Stripe Seguro
- [x] Informação: "Pagamento processado instantaneamente | Receba comprovante por email"
- [x] Destaque verde: "✅ Cancele a Qualquer Momento - Sem Taxas de Cancelamento!"
- [x] Posicionada entre disclaimer de cancelamento e seção de informações finais
- [x] Reforça confiança e segurança do pagamento


## Melhoria: Modal de Formas de Pagamento ao Clicar em Plano (10/12/2025)

- [x] Criado modal que aparece ao clicar em "Assinar" em qualquer plano
- [x] Exibe formas de pagamento: Cartão de Crédito + Stripe Seguro
- [x] Inclui destaque verde: "✅ Cancele a Qualquer Momento - Sem Taxas de Cancelamento!"
- [x] Informações de processamento: "Pagamento processado instantaneamente | Receba comprovante por email"
- [x] Botões: "Cancelar" e "Continuar Pagamento"
- [x] Seção de formas de pagamento mantida no final da página também
- [x] Modal com fundo escuro (overlay) e design consistente com tema
- [x] Botão X para fechar modal
