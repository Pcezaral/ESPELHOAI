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
  theme: "monster" | "animals" | "hero" | "art" | "movies",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  // Mapear tema para prompt
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    monster: {
      prompt: "Transform this person into a cute monster character while preserving their facial features, expressions and distinctive traits. The monster should be adorable and fun, maintaining the person's identity clearly recognizable. Style: colorful, playful, cartoon-like.",
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    animals: {
      prompt: "Transform this person into an adorable animal while preserving their facial features, expressions and distinctive traits. The animal should clearly reflect the person's characteristics and personality. Style: cute, realistic-cartoon hybrid.",
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    hero: {
      prompt: "Transform this person into a superhero while preserving their facial features, expressions and distinctive traits. The hero should maintain the person's identity with a powerful and heroic appearance. Style: comic book, dynamic, heroic.",
      text: "Você é um super-herói incrível! Com seus traços marcantes, você protege o mundo com coragem e determinação! 🦸"
    },
    art: {
      prompt: "Transform this person into a classical or modern art portrait while preserving their facial features, expressions and distinctive traits. The artwork should maintain the person's identity in an artistic style. Style: oil painting, impressionist, or modern art.",
      text: "Você é uma obra de arte! Seus traços se transformaram em uma pintura magnífica que captura sua essência! 🎨"
    },
    movies: {
      prompt: "Transform this person into an iconic movie or TV series character while preserving their facial features, expressions and distinctive traits. The character should maintain the person's identity in a cinematic style. Style: cinematic, dramatic, character-focused.",
      text: "Você é um personagem icônico! Suas características brilham nas telas de cinema e TV! 🎬"
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
