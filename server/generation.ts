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
 */
export async function generateTransformation(
  theme: "animals" | "monster" | "art" | "gender",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  // Mapear tema para prompt - PROMPTS SIMPLIFICADOS para evitar timeout
  // PROMPTS VÍVIDOS: Transformação IMPACTANTE preservando identidade facial
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      prompt: "Transform ALL people into adorable animals with full fur/feathers covering body. Add vibrant animal features: big expressive eyes, cute snout, fluffy ears, tail. CRITICAL: Preserve each person's unique facial expression, eye shape, and distinctive features within the animal face. Make it clearly an animal BUT recognizable as the original person. Colorful cartoon style.",
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    monster: {
      prompt: "Transform ALL people into vibrant cute monsters with colorful skin (pink, turquoise, purple), fun horns, big expressive eyes, playful details. CRITICAL: Keep each person's facial structure, expression, and distinctive features clearly recognizable within the monster design. Make it obviously a monster BUT you can still tell who the person is. Playful cartoon style.",
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    art: {
      prompt: "Transform ALL people into historical/period portraits. Choose ONE era randomly: 1920s-30s Mafia/Gangster (pinstripe suits, fedoras, Art Deco), 1940s-50s Hollywood Golden Age (glamorous gowns, tuxedos), 1960s Hippies (tie-dye, headbands, peace signs, flowers), Renaissance 1500s (ruffs, doublets), Baroque 1600s (velvet, lace), Victorian 1800s (corsets, top hats), Belle Époque 1890-1910 (elegant dresses, parasols). Add elaborate period-appropriate costumes, ornate backgrounds, dramatic lighting. CRITICAL: Keep faces PERFECTLY identical to original - same features, expressions, skin tone. Only costume and setting change. Artistic painting style.",
      text: "Você é uma figura histórica! Seus traços se transformaram em um personagem de época que captura sua essência! 🎨"
    },
    gender: {
      prompt: "Transform ALL people to opposite gender with convincing hairstyle, makeup, clothing, facial hair changes. CRITICAL: Maintain exact facial bone structure, eye shape, nose, mouth proportions. The face should look like a realistic gender-swapped version of the same person. Realistic photo style.",
      text: "Se tivesse nascido... Descubra como você seria do outro gênero! ⚧️"
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
