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
