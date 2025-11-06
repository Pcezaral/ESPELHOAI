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
      prompt: "Transform ALL people in this image into cute, colorful monster characters while STRICTLY preserving each person's unique facial features, expressions, hair characteristics, and distinctive traits. Each monster must be clearly identifiable as the original person. Create vibrant, playful creatures with creative details like horns, tails, or unusual textures, but keep facial recognition intact. If multiple people: transform ALL of them equally. Style: colorful, whimsical, highly detailed cartoon monsters.",
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    animals: {
      prompt: "Transform ALL people in this image into adorable animals while STRICTLY preserving each person's unique facial features, expressions, and distinctive characteristics. Each animal must clearly reflect the original person's identity and personality. Choose diverse animals that match each person's vibe. If multiple people: transform ALL of them into different animals. Style: cute, expressive, realistic-cartoon hybrid with rich details.",
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    hero: {
      prompt: "Transform ALL people in this image into powerful superheroes while STRICTLY preserving each person's facial features, expressions and distinctive traits. Create dynamic superhero costumes with capes, masks, or armor. Each hero should maintain perfect facial recognition of the original person. If multiple people: create a superhero team with ALL members transformed. Style: epic comic book art, dramatic lighting, heroic poses.",
      text: "Você é um super-herói incrível! Com seus traços marcantes, você protege o mundo com coragem e determinação! 🦸"
    },
    art: {
      prompt: "Transform ALL people in this image into a DRAMATIC artistic masterpiece while STRICTLY preserving each person's facial features and expressions. Create an IMPACTFUL transformation with: elaborate period costumes (Renaissance, Baroque, Victorian), rich ornate backgrounds with architectural elements, dramatic lighting and colors, golden frames effect, classical painting techniques. Make it look like a museum-worthy portrait with significant visual changes in clothing, setting, and atmosphere, but keep faces perfectly recognizable. If multiple people: transform ALL into a grand classical group portrait. Style: oil painting, chiaroscuro lighting, highly detailed Renaissance or Baroque art.",
      text: "Você é uma obra de arte! Seus traços se transformaram em uma pintura magnífica que captura sua essência! 🎨"
    },
    movies: {
      prompt: "Transform ALL people in this image into cinematic characters inspired by iconic films and series (Lord of the Rings, Harry Potter, Star Wars, Tarantino films, Friends, Game of Thrones style) while STRICTLY preserving each person's facial features and expressions. Create DIVERSE character types: wizards, warriors, space heroes, quirky sitcom characters, western outlaws. Add dramatic costumes, props, and atmospheric backgrounds that match the cinematic universe. Avoid creating specific copyrighted characters - instead create original characters IN THE STYLE of these universes. Each person must remain clearly recognizable. If multiple people: transform ALL into a cinematic ensemble cast. Style: high-quality film production, dramatic lighting, rich costumes and sets, cinematic composition.",
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
