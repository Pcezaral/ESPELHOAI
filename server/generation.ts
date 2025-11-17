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
 * 4. ALTA ALEATORIEDADE - mesma foto deve gerar versões DIFERENTES
 * 5. EVITAR CAPACETES - preferir coroas, tiaras, cabelos soltos para mostrar rosto
 */
export async function generateTransformation(
  theme: "animals" | "monster" | "art" | "gender" | "epic",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // Gerar variações aleatórias para cada geração
  const randomSeed = Math.random();
  
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      // Bichinho: Alta variação de espécies
      prompt: `Transform into cute animal (randomly choose: fluffy cat, playful dog, wise owl, gentle deer, curious fox, cuddly bear, happy bunny, colorful parrot, sleepy koala, energetic squirrel). Keep EXACT same number of people. Preserve facial expression and eye personality. Full fur/feathers, expressive animal features. Vibrant colors. Vary pose and angle. Cartoon style. Random seed: ${randomSeed}`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: Alta variação de cores e detalhes
      prompt: `Transform into cute colorful monster (randomly vary: skin color from pink/purple/turquoise/mint/coral, horn style from curved/straight/spiral, eye size from big/huge/enormous, accessory from bow/hat/glasses). Keep EXACT same number of people. Preserve facial structure and expression. Playful details, unique patterns. Vary pose dramatically. Cartoon style. Random seed: ${randomSeed}`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÊNCO, ALTA VARIEDADE de estilos artísticos e temas
      prompt: `Artistic portrait transformation. Keep EXACT same number of people. CRITICAL: Faces must be PIXEL-PERFECT IDENTICAL - same features, expression, age, skin tone. ONLY change: artistic style, costume and background. Randomly choose ONE style: Van Gogh (swirling brushstrokes, vibrant colors, Starry Night style / Sunflower field / Café terrace), Picasso Cubism (geometric faces, multiple perspectives, bold colors), Warhol Pop Art (bright neon colors, repeated patterns, celebrity style), Monet Impressionism (soft brushstrokes, garden setting, water lilies), 1920s Gangster (pinstripe suit, fedora, speakeasy background, tommy gun era), 1950s Rockabilly (leather jacket, pompadour hair, vintage diner, rock'n'roll), 1960s Hippie (tie-dye, peace signs, Woodstock festival, flower power), 1970s Disco (glitter, platform shoes, disco ball, Saturday Night Fever), 1980s Punk (mohawk, leather, graffiti wall, rebellious), Renaissance Noble (velvet, lace, palace), Baroque Royalty (gold, jewels, throne room). Vary pose, lighting, background dramatically. Artistic painting/pop art style. Random seed: ${randomSeed}`,
      text: "Você é uma obra de arte! Seus traços se transformaram em um estilo artístico único! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO IDÊNCO, HUMOR e EXTRAVAGÂNCIA
      prompt: `HUMOROUS gender swap transformation. Keep EXACT same number of people. CRITICAL: Maintain PIXEL-PERFECT IDENTICAL facial bone structure and features. ONLY change: hair, clothing, and background for COMEDIC effect. Male to Female: EXTRAVAGANT and FUNNY outfits - randomly choose: Carnival Baiana (colorful Bahia costume, fruit headpiece, vibrant skirts, beach background), Hawaiian Hula Dancer (grass skirt, flower lei, coconut bra, tropical paradise), Glamorous Drag Queen (sequined gown, dramatic makeup, feather boa, stage lights), Nun with Attitude (habit, cross necklace, church background but sassy pose), Flamenco Dancer (red ruffled dress, rose in hair, Spanish background), 1950s Housewife (apron, curlers, kitchen background, exaggerated), Bollywood Diva (sari, jewelry, colorful Indian background). Female to Male: FUNNY and BOLD looks - randomly choose: Firefighter Hero (uniform, helmet, mustache, fire truck background), Macho Cop (police uniform, aviator sunglasses, thick mustache, squad car), Doctor with Swagger (white coat, stethoscope, beard, hospital but cool pose), Rockstar Guitarist (leather jacket, electric guitar, long hair, stage with smoke), Construction Worker (hard hat, tool belt, muscular, building site), Cowboy (hat, boots, lasso, Wild West saloon), Biker Dude (leather vest, bandana, motorcycle background). Exaggerated poses, vibrant colors, HUMOROUS scenarios. Realistic but FUN photo style. Random seed: ${randomSeed}`,
      text: "Se tivesse nascido... Descubra sua versão hilariante do outro gênero! 😂⚧️"
    },
    
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, variar cultura e acessórios SEM CAPACETES
      prompt: `Ancient warrior/goddess transformation. Keep EXACT same number of people - if 1 person in input, output must have 1 person. ULTRA CRITICAL: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, body, pose, background. Randomly choose ONE culture with varied style: Greek (laurel crown + flowing toga / golden headband + warrior dress / olive wreath + philosopher robe), Roman (golden tiara + senator robes / leaf crown + gladiator armor / jeweled circlet + empress gown), Viking (braided hair with beads + fur cloak / metal arm rings + leather armor / hair ornaments + shield maiden outfit). CRITICAL: NO helmets, NO face-covering headgear - use crowns, tiaras, headbands, hair ornaments, wreaths to keep face fully visible. Vary pose dramatically (heroic stance / battle ready / regal sitting / victorious). Vary background (temple / battlefield / throne room / forest / mountain). Epic lighting from different angles. Random seed: ${randomSeed}`,
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
