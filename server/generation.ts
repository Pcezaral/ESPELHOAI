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
  theme: "animals" | "monster" | "art" | "gender" | "epic" | "gangster",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // Gerar variações aleatórias para cada geração
  const randomSeed = Math.random();
  
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      // Bichinho: ROSTO RECONHECÍVEL mesmo como animal
      prompt: `Cute animal portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical. PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, nose proportions, mouth expression, facial structure must be identifiable. DO NOT create generic animal, DO NOT lose person's identity. ONLY change: add fur/feathers, animal ears, whiskers, tail. Randomly choose ONE animal: fluffy cat (soft fur, cat ears, whiskers), playful dog (floppy ears, friendly expression), wise owl (feathered face, big eyes but same eye color), gentle deer (soft features, small antlers), curious fox (orange fur, pointed ears), cuddly bear (round ears, soft fur), happy bunny (long ears, fluffy), colorful parrot (feathers, beak but recognizable face), sleepy koala (gray fur, round ears), energetic squirrel (bushy tail, alert expression). CRITICAL: Face must look like the person AS an animal, not a random animal. Keep facial proportions, eye spacing, expression identical. Vary pose naturally (sitting / standing / playful / resting). Soft lighting, vibrant but natural colors. Cute cartoon style with facial recognition. Random seed: ${randomSeed}`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: ROSTO RECONHECÍVEL mesmo como monstro
      prompt: `Cute monster portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical. PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, facial proportions, expression, smile/frown pattern must be identifiable. DO NOT create generic monster, DO NOT lose person's identity. ONLY change: add monster features (horns, colorful skin, playful details). Randomly vary monster style: skin color (pink / purple / turquoise / mint / coral / lavender / peach), horn style (small curved / tiny straight / mini spiral / cute nubs), accessory (bow / hat / glasses / flower / star), pattern (spots / stripes / sparkles / swirls). CRITICAL: Face structure must look like the person AS a monster, not a random creature. Keep same eye spacing, nose position, mouth shape, facial bone structure. Vary pose naturally (friendly wave / playful stance / cute sitting / happy jumping). Soft lighting, vibrant cheerful colors. Adorable cartoon style with facial recognition. Random seed: ${randomSeed}`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÊNCO, ALTA VARIEDADE de estilos artísticos e temas
      prompt: `Artistic portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same features, expression, age, skin tone. ONLY change: artistic style, costume and background. Randomly choose ONE style: Van Gogh Impressionism (swirling brushstrokes, vibrant colors, Starry Night / Sunflower field / Café terrace / Bedroom in Arles), Picasso Cubism (geometric faces, multiple perspectives, bold colors, Blue Period / Rose Period), Rembrandt Baroque (dramatic lighting, chiaroscuro, rich browns and golds, Dutch Golden Age), Caravaggio Baroque (intense shadows, dramatic lighting, religious scene background), Monet Impressionism (soft brushstrokes, garden setting, water lilies, Japanese bridge), Leonardo da Vinci Renaissance (sfumato technique, Mona Lisa style, Italian landscape), Frida Kahlo (bold colors, Mexican folk art, floral headpiece, tropical background), Gustav Klimt (gold leaf, ornate patterns, Art Nouveau, The Kiss style), Edvard Munch Expressionism (bold colors, emotional, The Scream style), 1920s Gangster (pinstripe suit, fedora, speakeasy, tommy gun era, Art Deco), 1920s Flapper (beaded dress, feather headband, jazz club, Art Deco), Film Noir (black and white, dramatic shadows, detective/femme fatale, 1940s), 1950s Rockabilly (leather jacket, pompadour, vintage diner, rock'n'roll), 1960s Hippie (tie-dye, peace signs, Woodstock, flower power), 1980s Punk (mohawk, leather, graffiti wall, rebellious), Warhol Pop Art (bright neon, repeated patterns, celebrity style, screen print). Vary pose, lighting, background dramatically. Artistic painting style. Random seed: ${randomSeed}`,
      text: "Você é uma obra de arte! Seus traços se transformaram em um estilo artístico único! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO 100% IDÊNCO, looks divertidos mas preservação facial ABSOLUTA
      prompt: `Gender swap portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face, DO NOT exaggerate features, DO NOT create caricature. ONLY change: hairstyle, clothing, accessories, pose, background. Randomly choose ONE look with playful style: Male to Female options (Carnival Baiana with colorful Bahia costume + fruit headpiece + vibrant skirts + beach background, Hawaiian Hula Dancer with grass skirt + flower lei + tropical paradise, Glamorous Drag Queen with sequined gown + dramatic makeup + feather boa + stage lights, Flamenco Dancer with red ruffled dress + rose in hair + Spanish background, 1950s Housewife with apron + curlers + kitchen background, Bollywood Diva with sari + jewelry + colorful Indian background, Cabaret Performer with feathers + sparkles + theater stage). Female to Male options (Firefighter with uniform + mustache + fire truck background, Police Officer with uniform + aviator sunglasses + mustache + squad car, Doctor with white coat + stethoscope + beard + hospital, Rockstar Guitarist with leather jacket + electric guitar + stage with smoke, Construction Worker with hard hat + tool belt + building site, Cowboy with hat + boots + lasso + Wild West saloon, Biker with leather vest + bandana + motorcycle background, Chef with white uniform + hat + restaurant kitchen). CRITICAL: NO face distortion, NO cartoon features, keep facial proportions natural. Vary pose naturally (confident stance / relaxed pose / professional posture / casual lean). Vary background to match character (workplace / stage / outdoor scene / indoor setting). Vibrant colors, playful styling, clear lighting. Realistic photo style. Random seed: ${randomSeed}`,
      text: "Se tivesse nascido... Descubra sua versão hilariante do outro gênero! 😂⚧️"
    },
    
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, variar cultura e acessórios SEM CAPACETES
      prompt: `Ancient warrior/goddess transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, body, pose, background. Randomly choose ONE culture with varied style: Greek (laurel crown + flowing toga / golden headband + warrior dress / olive wreath + philosopher robe), Roman (golden tiara + senator robes / leaf crown + gladiator armor / jeweled circlet + empress gown), Viking (braided hair with beads + fur cloak / metal arm rings + leather armor / hair ornaments + shield maiden outfit). CRITICAL: NO helmets, NO face-covering headgear - use crowns, tiaras, headbands, hair ornaments, wreaths to keep face fully visible. Vary pose dramatically (heroic stance / battle ready / regal sitting / victorious). Vary background (temple / battlefield / throne room / forest / mountain). Epic lighting from different angles. Random seed: ${randomSeed}`,
      text: "Você é um guerreiro/deusa épico! Poderoso, belo e pronto para conquistar o mundo! 🏛️⚔️"
    },
    
    gangster: {
      // Gangster 1920s: ROSTO 100% IDÊNTICO, ALTA VARIEDADE de cenários de época
      prompt: `1920s Gangster Era transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: 1920s costume, pose, props, background. Randomly choose ONE scenario with period-accurate details: Speakeasy Boss (pinstripe suit, fedora, cigar, behind bar with whiskey bottles, Art Deco interior), Tommy Gun Shootout (suit with suspenders, fedora, holding tommy gun, dramatic action pose, brick alley with vintage car), Vintage Car Getaway (driving 1920s Ford Model A, fedora, leather jacket, city street background, motion blur), Jazz Club Owner (elegant suit, bow tie, jazz club stage background, musicians silhouettes, smoky atmosphere), Casino High Roller (tuxedo, fedora, poker table with chips and cards, chandelier background, 1920s casino), Bootlegger Deal (trench coat, fedora, wooden crates labeled whiskey, dark warehouse, dramatic lighting), Mob Meeting (three-piece suit, fedora, round table with maps and money, cigar smoke, office with vintage phone), Flapper's Partner (suit and tie, dancing pose with flapper girl silhouette, Art Deco ballroom, champagne), Bank Heist (suit, fedora, money bags, vault door background, dramatic shadows, 1920s bank interior), Rooftop Lookout (overcoat, fedora, binoculars, 1920s city skyline at night, vintage neon signs), Dockyard Smuggler (work suit, cap, wooden barrels, harbor with old ships, foggy night), Valentine's Day Massacre (dramatic suit, fedora, brick wall background, vintage car, film noir lighting). CRITICAL: Period-accurate 1920s clothing, props, cars, architecture. Vary lighting dramatically (film noir shadows / golden hour / neon signs / dramatic spotlights). Cinematic realistic photo style. Random seed: ${randomSeed}`,
      text: "Você é um gangster dos anos 1920! Elegante, perigoso e dono da noite na era da Lei Seca! 🎩🔫"
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
