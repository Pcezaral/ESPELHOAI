/**
 * Configuração centralizada de temas
 * 
 * REGRA: Toda referência a temas deve usar este arquivo como fonte de verdade.
 * Backend usa "themeId" (ex: "animals"), Frontend exibe "themeName" (ex: "Bichinho").
 * 
 * Para adicionar um novo tema:
 * 1. Adicione aqui em THEMES
 * 2. Adicione o prompt em server/generation.ts
 * 3. Adicione no enum do schema (drizzle/schema.ts) e rode pnpm db:push
 * 4. Adicione no frontend (Generator.tsx)
 */

export const THEMES = {
  animals: {
    id: "animals",
    name: "Bichinho",
    emoji: "🐾",
    description: "Transforme-se em um bichinho adorável",
    creditCost: 1,
  },
  monster: {
    id: "monster",
    name: "Monstro",
    emoji: "👾",
    description: "Vire um monstrinho fofo e divertido",
    creditCost: 1,
  },
  art: {
    id: "art",
    name: "Pintura",
    emoji: "🎨",
    description: "Torne-se uma obra-prima de artistas famosos",
    creditCost: 1,
  },
  gender: {
    id: "gender",
    name: "Se tivesse nascido...",
    emoji: "⚧️",
    description: "Descubra como seria do outro gênero",
    creditCost: 1,
  },
  epic: {
    id: "epic",
    name: "Épico",
    emoji: "⚔️",
    description: "Guerreiros, deuses e lendas antigas",
    creditCost: 1,
  },
  gangster: {
    id: "gangster",
    name: "Gangster",
    emoji: "🎩",
    description: "Crime boss de diversas eras do cinema",
    creditCost: 1,
  },
  circus: {
    id: "circus",
    name: "Circo",
    emoji: "🎪",
    description: "Artista de circo com fantasias incríveis",
    creditCost: 1,
  },
  pet: {
    id: "pet",
    name: "Você e Seu Pet",
    emoji: "🐶",
    description: "Fique parecido com seu pet! Sua fisionomia preservada, pet inalterado",
    creditCost: 1,
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const THEME_NAMES: Record<ThemeId, string> = Object.fromEntries(
  Object.entries(THEMES).map(([id, theme]) => [id, theme.name])
) as Record<ThemeId, string>;

/**
 * Helper para obter nome do tema pelo ID
 */
export function getThemeName(themeId: ThemeId): string {
  return THEMES[themeId]?.name || themeId;
}

/**
 * Helper para obter custo de créditos pelo ID do tema
 */
export function getThemeCreditCost(themeId: ThemeId): number {
  return THEMES[themeId]?.creditCost || 1;
}
