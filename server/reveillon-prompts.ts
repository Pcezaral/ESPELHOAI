// Múltiplos prompts para Réveillon com máxima variação
export const reveillonPrompts = [
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 celebration at luxury beach resort. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person wearing elegant white flowing dress or white linen suit, holding champagne glass, standing on pristine beach at night with spectacular colorful fireworks exploding in sky, ocean reflecting golden lights, festive beach party with string lights, "2026" visible in fireworks. Pose: Toasting, celebrating, raising glass, dancing, laughing. Warm golden lighting, photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "🎆 Réveillon na praia! Brinde ao novo ano com estilo e elegância! 🍾✨"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 elegant dinner party. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person wearing formal white suit or white elegant gown with jewelry, holding champagne flute, in upscale restaurant with golden balloons spelling "2026", candles on table, champagne bottles, confetti falling, warm golden lighting. Pose: Toasting, celebrating, elegant stance, joyful expression. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "🥂 Jantar de gala no Réveillon! Elegância, champagne e celebração! ✨🎉"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 rooftop party celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in stylish white outfit with champagne glass, standing on city rooftop with spectacular fireworks in background spelling "2026", urban skyline, party lights, confetti, night sky. Pose: Celebrating, dancing, raising glass, laughing, embracing. Dynamic celebratory atmosphere. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "🌃 Réveillon no rooftop! Celebre o novo ano com vista para a cidade! 🎆🍾"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 yacht celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in white nautical elegant outfit with champagne, on luxury yacht deck with fireworks over water spelling "2026", festive maritime setting, glamorous night party, string lights, ocean view. Pose: Toasting, celebrating, dancing, waving, joyful expression. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "⛵ Réveillon de luxo! Celebre em alto mar com champagne e fogos de artifício! 🎆🥂"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 nightclub celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in stylish white party outfit with champagne, in vibrant nightclub with disco ball, neon lights, dancers, "2026" displayed, confetti cannons, dynamic party atmosphere. Pose: Dancing, celebrating, raising glass, laughing, jumping. High-energy festive mood. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "🎉 Festa de Réveillon! Dança, música e celebração até a madrugada! 🎆✨"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 garden celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in elegant white outfit with champagne in beautiful garden with twinkling lights, fireworks in background, "2026" decorations, flowers, elegant garden party, night setting. Pose: Toasting, celebrating, elegant stance, joyful expression. Romantic celebratory mood. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "🌹 Réveillon no jardim! Elegância, natureza e celebração do novo ano! 🎆🥂"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 mountain resort celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in white outfit with champagne on mountain peak or resort balcony, fireworks lighting up snowy mountains, "2026" visible, starry night sky, festive mountain setting. Pose: Celebrating, raising glass, dancing, laughing. Majestic celebratory mood. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "⛰️ Réveillon na montanha! Celebre o novo ano com vista para as estrelas! 🎆✨"
  },
  {
    prompt: (randomSeed: number, randomVariation: number) => `New Year's Eve 2026 mansion ballroom celebration. CRITICAL: Keep EXACT same number of people and faces pixel-perfect identical. ONLY change: costume, pose, background. Scenario: Person in formal white gown or suit with champagne in grand ballroom with crystal chandeliers, golden decorations, "2026" balloons, confetti, elegant crowd, warm lighting. Pose: Dancing, toasting, celebrating, elegant stance. Luxurious celebratory mood. Photorealistic. Random seed: ${randomSeed}, variation: ${randomVariation}`,
    text: "👑 Baile de Réveillon! Luxo, sofisticação e celebração real! 🎆🥂"
  }
];

export function getRandomReveilonPrompt(randomSeed: number, randomVariation: number) {
  const index = Math.floor(Math.random() * reveillonPrompts.length);
  const promptData = reveillonPrompts[index];
  return {
    prompt: promptData.prompt(randomSeed, randomVariation),
    text: promptData.text
  };
}
