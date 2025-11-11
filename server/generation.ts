import { storagePut } from "./storage";
import { generateImage } from "./_core/imageGeneration";

/**
 * Upload de imagem em base64 para S3
 */
export async function uploadImageToS3(
  imageBase64: string,
  filename: string,
  userId: number
): Promise<{ url: string; key: string }> {
  // Converter base64 para buffer
  const buffer = Buffer.from(imageBase64, "base64");
  
  // Gerar chave única para o arquivo
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  const fileKey = `user-${userId}/uploads/${timestamp}-${randomSuffix}-${filename}`;
  
  // Upload para S3
  const { url } = await storagePut(fileKey, buffer, "image/jpeg");
  
  return { url, key: fileKey };
}

/**
 * Gerar transformação de imagem com IA
 * 
 * REGRAS ABSOLUTAS:
 * 1. MANTER O NÚMERO EXATO DE PESSOAS (1 pessoa = 1 pessoa, 3 pessoas = 3 pessoas)
 * 2. PRESERVAR ROSTOS IDÊNTICOS (exceto animals/monster que podem ser mais criativos)
 * 3. NUNCA adicionar ou remover pessoas
 */
export async function generateTransformation(
  theme: "animals" | "monster" | "art" | "gender" | "epic",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // NOVA ABORDAGEM: Prompts CURTOS, DIRETOS e IMPERATIVOS
  // Foco em COMANDOS CLAROS ao invés de explicações longas
  
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      // Bichinho: Pode ser criativo, mas mantém expressão
      prompt: `Transform into cute animal. Keep EXACT same number of people. Preserve facial expression and eye shape. Full fur/feathers, animal features (ears, snout, tail). Vibrant colors. Cartoon style.`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: Pode ser criativo, mas mantém estrutura facial
      prompt: `Transform into cute colorful monster. Keep EXACT same number of people. Preserve facial structure and expression. Colorful skin (pink/purple/turquoise), fun horns, big eyes. Playful cartoon style.`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÊNTICO, apenas roupa e cenário mudam
      prompt: `Historical portrait transformation. Keep EXACT same number of people. CRITICAL: Faces must be IDENTICAL to original photo - same features, same expression, same age, same skin tone. ONLY change: period costume and background. Choose ONE random era: 1920s Mafia (pinstripe suit, fedora), 1940s Hollywood (glamorous gown/tuxedo), 1960s Hippie (tie-dye, headband), Renaissance (ruff collar), Baroque (velvet, lace), Victorian (corset/top hat), Belle Époque (elegant dress/parasol). Elaborate costume, ornate background, dramatic lighting. Face = UNCHANGED. Artistic painting style.`,
      text: "Você é uma figura histórica! Seus traços se transformaram em um personagem de época que captura sua essência! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO IDÊNTICO, apenas cabelo/roupa/acessórios mudam
      prompt: `Gender swap transformation. Keep EXACT same number of people. CRITICAL: Maintain IDENTICAL facial bone structure, features, proportions. ONLY change: hair, clothing, accessories. Male to Female: long hair, makeup, dress, feminine accessories. Female to Male: short hair, beard if possible, suit, masculine accessories. Face structure = UNCHANGED. Realistic photo style.`,
      text: "Se tivesse nascido... Descubra como você seria do outro gênero! ⚧️"
    },
    
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, apenas corpo/roupa/cenário mudam
      prompt: `Ancient warrior/goddess transformation. Keep EXACT same number of people in photo - if 1 person in input, output must have 1 person. If 2 people, output 2 people. NEVER add extra people. ULTRA CRITICAL: Face must be PIXEL-PERFECT IDENTICAL to original - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT beautify or modify face. ONLY change: costume, body physique, pose, background. Choose ONE culture: Greek (toga/bronze armor), Roman (robes/centurion armor), Viking (fur/horned helmet). Epic lighting, heroic pose. Face = COMPLETELY UNCHANGED. Epic cinematic style.`,
      text: "Você é um guerreiro/deusa épico! Poderoso, belo e pronto para conquistar o mundo! 🏛️⚔️"
    }
  };

  const { prompt, text } = themePrompts[theme];
  
  // Gerar imagem com IA
  const result = await generateImage({
    prompt,
    originalImages: [{
      url: imageUrl,
      mimeType: "image/jpeg"
    }]
  });
  
  if (!result.url) {
    throw new Error("Failed to generate image");
  }
  
  return {
    generatedImageUrl: result.url,
    generatedText: text
  };
}
