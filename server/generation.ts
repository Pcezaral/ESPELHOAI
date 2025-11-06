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
  theme: "animals" | "monster" | "art" | "gender" | "epic",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  // Mapear tema para prompt - PROMPTS SIMPLIFICADOS para evitar timeout
  // PROMPTS VÍVIDOS: Transformação IMPACTANTE preservando identidade facial
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      prompt: "IMPORTANT: Transform EVERY SINGLE person in the photo into adorable animals. Count all people and make sure EACH ONE is transformed - do not leave anyone unchanged. Add full fur/feathers covering body, vibrant animal features: big expressive eyes, cute snout, fluffy ears, tail. CRITICAL: Preserve each person's unique facial expression, eye shape, and distinctive features within the animal face. Make it clearly an animal BUT recognizable as the original person. ALL people must become animals. Colorful cartoon style.",
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    monster: {
      prompt: "IMPORTANT: Transform EVERY SINGLE person in the photo into vibrant cute monsters. Count all people and make sure EACH ONE is transformed - do not leave anyone unchanged. Give colorful skin (pink, turquoise, purple), fun horns, big expressive eyes, playful details to ALL people. CRITICAL: Keep each person's facial structure, expression, and distinctive features clearly recognizable within the monster design. Make it obviously a monster BUT you can still tell who the person is. ALL people must become monsters. Playful cartoon style.",
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    art: {
      prompt: "IMPORTANT: Transform EVERY SINGLE person in the photo into historical/period portraits. Count all people and make sure EACH ONE gets period costume - do not leave anyone unchanged. Choose ONE era randomly: 1920s-30s Mafia/Gangster (pinstripe suits, fedoras, Art Deco), 1940s-50s Hollywood Golden Age (glamorous gowns, tuxedos), 1960s Hippies (tie-dye, headbands, peace signs, flowers), Renaissance 1500s (ruffs, doublets), Baroque 1600s (velvet, lace), Victorian 1800s (corsets, top hats), Belle Époque 1890-1910 (elegant dresses, parasols). Add elaborate period-appropriate costumes to ALL people, ornate backgrounds, dramatic lighting. CRITICAL: Keep faces PERFECTLY identical to original - same features, expressions, skin tone. Only costume and setting change. ALL people must be in period attire. Artistic painting style.",
      text: "Você é uma figura histórica! Seus traços se transformaram em um personagem de época que captura sua essência! 🎨"
    },
    gender: {
      prompt: "IMPORTANT: Transform EVERY SINGLE person in the photo to opposite gender. Count all people and make sure EACH ONE is gender-swapped - do not leave anyone unchanged. Make transformation CLEAR and OBVIOUS with characteristic gendered clothing. Men to Women: feminine dresses (not just pants), long styled hair, evident makeup, feminine accessories (earrings, necklaces, purses), feminine poses. Women to Men: masculine suits or very masculine clothing, short masculine haircut, beard/goatee when possible, masculine accessories (tie, watch), masculine poses. CRITICAL: Maintain exact facial bone structure, eye shape, nose, mouth proportions for each person. The face should look like a realistic gender-swapped version of the same person. ALL people must be transformed. Realistic photo style.",
      text: "Se tivesse nascido... Descubra como você seria do outro gênero! ⚧️"
    },
    epic: {
      prompt: "IMPORTANT: Transform EVERY SINGLE person in the photo into epic ancient warriors/goddesses. Count all people and make sure EACH ONE gets warrior/goddess transformation - do not leave anyone unchanged. Choose ONE culture randomly: Greek (toga, laurel crown, goddess gown OR warrior with bronze armor), Roman (senator robes, golden jewelry OR centurion armor with red cape), Viking (fur cloaks, horned helmets, braids OR valkyrie armor). Add dramatic lighting, heroic poses, epic backgrounds. Women: elegant goddess/warrior attire. Men: powerful warrior look. ULTRA CRITICAL: Keep faces PERFECTLY IDENTICAL to original - exact same facial features, expressions, skin tone, age, bone structure. DO NOT enhance or beautify faces, DO NOT change facial appearance AT ALL. Only costume, pose and background change. ALL people must be warriors/goddesses. Epic cinematic style.",
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
