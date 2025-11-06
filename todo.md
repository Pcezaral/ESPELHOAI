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
