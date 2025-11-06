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
  // PROMPTS OTIMIZADOS: Simples, diretos, com Ênfase MÁXIMA em preservar identidade facial
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      prompt: "Transform ALL people into cute animals. CRITICAL: Keep each person's face HIGHLY recognizable - preserve facial features, expressions, eye shape, nose, mouth. Each person becomes a different adorable animal. Cartoon style.",
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    monster: {
      prompt: "Transform ALL people into cute colorful monsters. CRITICAL: Keep each person's face HIGHLY recognizable - preserve facial features, expressions, eye shape, nose, mouth. Add fun monster details like horns or tails. Cartoon style.",
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    art: {
      prompt: "Transform ALL people into historical figures from 1600-1800s. CRITICAL: Keep each person's face PERFECTLY recognizable - preserve all facial features, expressions, distinctive traits. Add period costumes and classical painting style.",
      text: "Você é uma figura histórica! Seus traços se transformaram em um personagem de época que captura sua essência! 🎨"
    },
    gender: {
      prompt: "Transform ALL people to opposite gender. CRITICAL: Keep each person's face PERFECTLY recognizable - preserve facial structure, features, expressions. Only change gender presentation (hair, makeup, clothing). Realistic style.",
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
