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
 * 1. MANTER O NÚMERO EXATO DE PESSOAS (1 pessoa = 1 pessoa, 2 pessoas = 2 pessoas, 3 pessoas = 3 pessoas)
 * 2. PRESERVAR ROSTOS IDÊNTICOS - NUNCA cobrir com barbas grandes, capacetes, máscaras
 * 3. NUNCA adicionar ou remover pessoas
 * 4. ALTA ALEATORIEDADE - mesma foto deve gerar versões DIFERENTES
 * 5. EVITAR CAPACETES, BARBAS EXAGERADAS - preferir coroas, tiaras, cabelos soltos para mostrar rosto
 * 6. FUNDOS VARIADOS - cada geração deve ter cenário diferente
 * 
 * REGRA ESPECIAL PARA DUAS PESSOAS:
 * - AMBAS as faces devem ser preservadas com IGUAL qualidade e fidelidade
 * - Não priorizar uma pessoa sobre a outra
 * - Cada pessoa deve ter sua fisionomia INDIVIDUAL mantida
 * - Posição relativa das pessoas deve ser mantida (quem está à esquerda/direita)
 */
export async function generateTransformation(
  theme: "animals" | "monster" | "art" | "gender" | "epic" | "gangster" | "circus" | "carnival",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // Gerar variações aleatórias FORTES para cada geração
  const timestamp = Date.now();
  const randomSeed = Math.random() * timestamp * (userId + 1);
  const randomVariation = Math.floor(Math.random() * 1000);
  
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      // Bichinho: ROSTO E EXPRESSÃO 100% PRESERVADOS - apenas adicionar elementos de animal
      prompt: `Cute animal portrait transformation. ABSOLUTE CRITICAL RULE: The person's FACE, EXPRESSION, and PHYSIOGNOMY must be 100% PRESERVED and RECOGNIZABLE. Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces IDENTICAL to original; if 3 people, output MUST have 3 people with ALL 3 faces IDENTICAL to original.
      
      SPECIAL RULE FOR TWO PEOPLE: When there are 2 people in the photo, BOTH faces must be preserved with EQUAL quality and fidelity. Do NOT prioritize one person over the other. Each person must have their INDIVIDUAL physiognomy maintained - their unique eye shape, nose, mouth, expression. Keep the relative position of people (who is on left/right). BOTH people must be equally recognizable.
      
      FACE PRESERVATION IS PARAMOUNT: Each person's face must be COMPLETELY RECOGNIZABLE - same exact eyes (shape, color, size, spacing), same exact nose (shape, size, position), same exact mouth (shape, lips, smile/expression), same exact facial bone structure, same exact skin tone, same exact expression and emotion. The face should look like a PHOTO of the person with animal features ADDED AROUND IT, not a transformation OF the face.
      
      WHAT TO ADD (around the face, NOT replacing it): Fluffy fur around the face edges, cute animal ears on top of head, whiskers on cheeks (thin, not covering face), small animal nose tip overlay (transparent, showing original nose), tail behind body, paws instead of hands.
      
      Randomly choose ONE animal style: fluffy cat (soft fur frame, cat ears, thin whiskers), playful dog (floppy ears, friendly fur frame), wise owl (feathered frame, big expressive eyes keeping original eye color), gentle deer (soft fur, small antlers headband style), curious fox (orange fur frame, pointed ears), cuddly bear (round ears, soft brown fur frame), happy bunny (long floppy ears, fluffy white fur frame), colorful parrot (feather frame around face, keeping face visible), sleepy koala (gray fur frame, round ears), energetic squirrel (bushy tail, alert ears).
      
      CRITICAL: The ORIGINAL EXPRESSION must be visible - if person is smiling, animal version smiles the same way. If person has a specific look in their eyes, that look must be preserved. Face is the STAR, animal features are ACCESSORIES.
      
      Vary pose naturally (sitting / standing / playful / resting). Soft lighting, vibrant but natural colors. Cute style that highlights the person's real face with animal accessories. Random seed: ${randomSeed}`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: ROSTO RECONHECÍVEL mesmo como monstro
      prompt: `Cute monster portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical.
      
      SPECIAL RULE FOR TWO PEOPLE: When there are 2 people in the photo, BOTH faces must be preserved with EQUAL quality and fidelity. Do NOT prioritize one person over the other. Each person must have their INDIVIDUAL physiognomy maintained - their unique eye shape, nose, mouth, expression. Keep the relative position of people (who is on left/right). BOTH people must be equally recognizable as cute monsters.
      
      PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, facial proportions, expression, smile/frown pattern must be identifiable. DO NOT create generic monster, DO NOT lose person's identity. ONLY change: add monster features (horns, colorful skin, playful details). Randomly vary monster style: skin color (pink / purple / turquoise / mint / coral / lavender / peach), horn style (small curved / tiny straight / mini spiral / cute nubs), accessory (bow / hat / glasses / flower / star), pattern (spots / stripes / sparkles / swirls). CRITICAL: Face structure must look like the person AS a monster, not a random creature. Keep same eye spacing, nose position, mouth shape, facial bone structure. Vary pose naturally (friendly wave / playful stance / cute sitting / happy jumping). Soft lighting, vibrant cheerful colors. Adorable cartoon style with facial recognition. Random seed: ${randomSeed}`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÊNTICO, estilos de ARTISTAS FAMOSOS com INTEGRAÇÃO TOTAL
      prompt: `MASTERPIECE PAINTING TRANSFORMATION. CRITICAL FACE RULE: Person's face must be PIXEL-PERFECT IDENTICAL to input - same eyes, nose, mouth, expression, age, skin tone, facial structure. Face is recognizable but rendered in the artist's painting technique.
      
      CRITICAL ARTISTIC INTEGRATION: The ENTIRE image must look like an AUTHENTIC painting by the chosen artist. Apply the artist's SIGNATURE TECHNIQUE to EVERYTHING: face, clothes, background, lighting. NO photorealistic elements - everything must be painted in the same unified style. Visible brushstrokes, color palette, and texture consistent throughout.
      
      Randomly choose ONE master artist with FULL AUTHENTIC STYLE:
      
      VAN GOGH STARRY NIGHT (person painted with Van Gogh's ICONIC swirling brushstrokes, THICK impasto texture visible on face and clothes, vibrant cobalt blues and chrome yellows, DRAMATIC swirling sky background like Starry Night, cypress trees, village lights, person wearing 1880s French peasant clothing, entire image has that distinctive Van Gogh energy and movement),
      
      VAN GOGH SUNFLOWERS (person surrounded by giant sunflowers in Van Gogh's style, warm yellows and oranges, thick textured brushwork, rustic background, person holding sunflowers, same impasto technique on face),
      
      PICASSO CUBIST (person's face shown from MULTIPLE ANGLES simultaneously like Guernica or Les Demoiselles d'Avignon, geometric fragmentation, bold black outlines, earth tones with blue/pink accents, angular shapes, face recognizable but cubist-deconstructed, abstract background),
      
      PICASSO BLUE PERIOD (melancholic blue and green tones throughout, sad/contemplative expression, thin elongated figure, poverty/solitude theme, dark blue background, person in simple worn clothing, emotional depth),
      
      MONET WATER LILIES (person in Monet's garden at Giverny, soft dappled Impressionist brushstrokes, pastel pinks/purples/greens, water lilies floating, Japanese bridge visible, dreamy atmospheric light filtering through, person in elegant 1890s dress or suit),
      
      MONET IMPRESSION SUNRISE (person by the harbor at dawn, orange sun reflecting on water, loose brushwork, misty atmospheric quality, boats in background, soft focus impressionist style throughout),
      
      REMBRANDT CHIAROSCURO (DRAMATIC spotlight lighting from one side, face emerging from DEEP dark background, rich golden browns, Dutch Golden Age costume (ruff collar, velvet, lace), intimate portrait feeling, visible brushwork, museum-quality oil painting look),
      
      FRIDA KAHLO SELF-PORTRAIT (bold vibrant Mexican colors - hot pink, turquoise, yellow, elaborate floral crown/headpiece with tropical flowers, jungle background with monkeys and exotic birds, traditional Tehuana dress, intense direct gaze, folk art decorative elements, unibrow as artistic choice),
      
      GUSTAV KLIMT GOLDEN (LAVISH gold leaf patterns covering clothing and background, ornate geometric Art Nouveau decorations, Byzantine mosaic influence, The Kiss style romantic pose optional, golden spirals and shapes, decorative flat background, person in elaborate golden robes),
      
      SALVADOR DALÍ SURREALIST (hyper-detailed face in surreal dreamscape, MELTING CLOCKS draped around, impossible architecture, barren desert landscape, elephants on impossibly thin stilts in background, floating objects defying gravity, sharp realistic rendering with impossible elements),
      
      ANDY WARHOL POP ART (BOLD screen print effect, BRIGHT neon colors - hot pink/electric yellow/cyan/lime green, high contrast, celebrity glamour aesthetic, flat color blocks, repeated portrait grid (2x2 or 3x3) with different color variations, Factory style),
      
      BOTTICELLI RENAISSANCE (ethereal Renaissance beauty, flowing golden wavy hair, Birth of Venus style pose, soft pastel colors, shell and roses, Italian Renaissance landscape with rolling hills, person in flowing classical robes, idealized feminine beauty style),
      
      VERMEER DUTCH INTERIOR (Girl with Pearl Earring style, SOFT natural light from side window, Dutch 17th century interior, blue and yellow color palette, turban or headscarf, intimate domestic scene, photorealistic but with visible painterly quality, pearl earring optional).
      
      CRITICAL: The painting must be INDISTINGUISHABLE from an authentic work by the artist. Unified style from edge to edge. Museum-quality artistic execution. Random seed: ${randomSeed}`,
      text: "Você é uma obra-prima! Transformado no estilo de um grande mestre da pintura! 🎨🖼️"
    },
    
    gender: {
      // Gênero: ROSTO 100% IDÊNTICO - MÁXIMA PRESERVAÇÃO DE FISIONOMIA
      prompt: `Gender swap portrait transformation.
      
      ULTRA CRITICAL FACE PRESERVATION RULE - THIS IS THE MOST IMPORTANT RULE:
      The person's FACE and PHYSIOGNOMY must be ABSOLUTELY IDENTICAL to the input photo. This means:
      - EXACT same eye shape, eye color, eye size, eye spacing, eyelids, eyebrows shape and thickness
      - EXACT same nose shape, nose size, nose bridge, nostrils
      - EXACT same mouth shape, lip thickness, lip color, smile pattern
      - EXACT same facial bone structure: cheekbones, jawline, chin shape, forehead
      - EXACT same skin tone, skin texture, any moles or beauty marks
      - EXACT same facial proportions and distances between features
      - EXACT same expression and emotion from the original photo
      - EXACT same age appearance - do NOT make younger or older
      
      The ONLY things that should change:
      1. Hairstyle appropriate for opposite gender (but SAME hair color)
      2. Everyday clothing appropriate for opposite gender
      3. Background scenario
      4. Body posture/pose
      
      DO NOT: modify face shape, change facial features, exaggerate anything, create caricature, make drag queen style, change skin tone, change eye color, change nose shape, change mouth shape.
      
      CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical.
      
      Randomly choose ONE EVERYDAY SCENARIO:
      OFFICE (business casual, desk, computer), SUPERMARKET (casual clothes, shopping cart), TRAFFIC (driving car), KITCHEN (apron, cooking), GYM (workout clothes), HOME (casual, living room), COFFEE SHOP (holding coffee), ZOOM CALL (laptop), WAITING ROOM (sitting), PUBLIC TRANSPORT (bus/metro).
      
      Natural everyday appearance. Realistic photo style. Random seed: ${randomSeed}`,
      text: "Se tivesse nascido... Descubra sua versão hilariante do outro gênero no dia-a-dia! 😂⚧️"
    },
    
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, variar cultura e acessórios SEM CAPACETES
      prompt: `Ancient warrior/goddess transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, body, pose, background. Randomly choose ONE culture with varied style: Greek (laurel crown + flowing toga / golden headband + warrior dress / olive wreath + philosopher robe), Roman (golden tiara + senator robes / leaf crown + gladiator armor / jeweled circlet + empress gown), Viking (braided hair with beads + fur cloak / metal arm rings + leather armor / hair ornaments + shield maiden outfit). CRITICAL: NO helmets, NO face-covering headgear - use crowns, tiaras, headbands, hair ornaments, wreaths to keep face fully visible. Vary pose dramatically (heroic stance / battle ready / regal sitting / victorious). Vary background (temple / battlefield / throne room / forest / mountain). Epic lighting from different angles. Random seed: ${randomSeed}`,
      text: "Você é um guerreiro/deusa épico! Poderoso, belo e pronto para conquistar o mundo! 🏛️⚔️"
    },
    
    gangster: {
      // Gangster: ROSTO 100% IDÊNTICO, MÁXIMA VARIEDADE de estilos e eras cinematográficas
      // INCLUI: Anos 20 clássico, Tarantino, Blade Runner, Scarface, Goodfellas, Peaky Blinders, etc.
      prompt: `Gangster/Crime Boss transformation. 
      
      ULTRA CRITICAL FACE PRESERVATION RULE - READ THIS FIRST: The person's FACE and PHYSIOGNOMY must be ABSOLUTELY IDENTICAL to the input photo. This means:
      - EXACT same eye shape, eye color, eye size, eye spacing, eyelids, eyebrows shape and thickness
      - EXACT same nose shape, nose size, nose bridge, nostrils
      - EXACT same mouth shape, lip thickness, lip color, smile pattern
      - EXACT same facial bone structure: cheekbones, jawline, chin shape, forehead
      - EXACT same skin tone, skin texture, any moles or beauty marks
      - EXACT same facial proportions and distances between features
      - EXACT same expression and emotion from the original photo
      - The face must be INSTANTLY RECOGNIZABLE as the same person
      
      DO NOT: Modify face shape, change eye shape, alter nose, change lips, add facial hair that covers features, use heavy makeup that changes appearance, change skin tone, alter age appearance.
      
      FOR WOMEN: Keep feminine features exactly as in photo - same delicate features, same expression. Do NOT masculinize or change bone structure.
      
      Keep EXACT same number of people. ONLY change: costume, pose, props, background, era. Randomly choose ONE scenario from DIVERSE eras and styles: 
      
      CLASSIC 1920s PROHIBITION ERA (Speakeasy Boss in pinstripe suit + fedora + cigar + Art Deco bar interior + jazz age glamour, Flapper Queen in sequined dress + feather headband + cigarette holder + Charleston dance floor, Bootlegger in trench coat + newsboy cap + whiskey crates + dark warehouse + vintage car headlights),
      
      PEAKY BLINDERS STYLE (Flat cap + three-piece tweed suit + pocket watch + Birmingham industrial backdrop + razor blade in cap + smoky pub interior + 1920s British gangster aesthetic),
      
      TARANTINO CINEMA (Pulp Fiction style sharp black suit + skinny tie + diner booth + retro 90s aesthetic + cool attitude + briefcase, Reservoir Dogs warehouse scene + dark suit + sunglasses + dramatic shadows + Mexican standoff pose, Kill Bill assassin in sleek outfit + katana + neon Tokyo backdrop + action pose, Django style Western outfit + dramatic sunset + revenge aesthetic),
      
      BLADE RUNNER CYBERPUNK (Neon-lit rain-soaked streets + futuristic noir trench coat + holographic advertisements + flying cars in background + cyberpunk city + replicant hunter aesthetic + blue and pink neon lighting),
      
      SCARFACE 80s MIAMI (White suit + open collar + gold chains + Miami mansion + palm trees + cocaine cowboy aesthetic + sunset colors + luxury excess + Tony Montana power pose),
      
      GOODFELLAS/CASINO 70s-80s (Silk shirt + leather jacket + Brooklyn street corner + Italian restaurant + card game table + wise guy aesthetic + gold jewelry + slicked back hair),
      
      THE GODFATHER CLASSIC (Dark formal suit + rose in lapel + dimly lit office + Sicilian patriarch aesthetic + cat on lap + serious contemplative pose + family portrait background),
      
      MODERN CARTEL BOSS (Designer suit + aviator sunglasses + luxury penthouse + city skyline + contemporary power + sleek minimalist aesthetic),
      
      YAKUZA JAPANESE (Traditional irezumi tattoo visible + sharp suit + Tokyo neon backdrop + cherry blossoms + Japanese crime boss aesthetic + respectful bow or intimidating stance),
      
      RUSSIAN MAFIA (Fur coat + gold rings + Moscow winter + luxury car + oligarch aesthetic + cold calculating expression).
      
      CRITICAL: HIGH VARIETY in poses (sitting at desk / standing with arms crossed / leaning against car / walking down street / poker table / dramatic confrontation / relaxed confidence). Vary lighting dramatically (film noir shadows / neon glow / golden hour / harsh spotlight / moody atmospheric). Vary camera angle (low angle power shot / profile / action shot / cinematic wide). Cinematic quality with authentic era details. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um crime boss! Sofisticado, perigoso e comandando o submundo com estilo! 🎩🔫"
    },
    
    circus: {
      // Circo: ROSTO 100% IDÊNTICO, MÁXIMA VARIEDADE, INTEGRAÇÃO VISUAL PERFEITA
      // IMPORTANTE: NUNCA repetir fraque/cartola - variar MUITO as profissões
      prompt: `Circus performer transformation - MAXIMUM FUN AND VARIETY! CRITICAL FACE RULE: Person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. Keep EXACT same number of people.
      
      CRITICAL VISUAL INTEGRATION: Person must be SEAMLESSLY INTEGRATED into circus scene - NOT a collage. Match theatrical lighting, color temperature, and perspective naturally.
      
      EXPRESSIONS: ALWAYS joyful, happy, excited, proud, playful - NEVER serious!
      
      CRITICAL COSTUME RULE: DO NOT always use tailcoat/top hat (ringmaster). MUST vary costumes dramatically! Use random number ${Math.floor(Math.random() * 20) + 1} to select ONE profession:
      
      1-ACROBAT (sparkly sequined LEOTARD in bright pink/blue/gold, mid-air flip, arms extended, circus tent ceiling above, confetti falling),
      
      2-TRAPEZE ARTIST (glittery BODYSUIT with flowing ribbons, hanging from trapeze mid-swing, hair flowing, high above circus ring),
      
      3-HAPPY CLOWN (colorful POLKA DOT oversized costume, rainbow wig, red nose, holding balloons, silly pose, oversized shoes),
      
      4-CLOWN PIE (BAGGY colorful costume, cream pie in face or throwing pie, surprised funny expression, messy cream),
      
      5-MAGICIAN DOVES (elegant PURPLE VEST with silver stars, doves flying from hands, sparkles, mysterious smile, NO top hat),
      
      6-MAGICIAN CARDS (SLEEK black shirt with silver details, cards floating in air, intense focused expression, close-up magic),
      
      7-TIGHTROPE WALKER (elegant SPARKLING UNITARD, walking on high wire with balance pole, focused expression, dramatic height),
      
      8-FIRE BREATHER (EXOTIC tribal-style costume with flame patterns, breathing dramatic flame, fire illuminating face),
      
      9-FIRE DANCER (FLOWING costume with fire motifs, spinning fire poi, trails of flame around body, dynamic action),
      
      10-STRONGMAN (STRIPED vintage tank top, lifting oversized barbell, proud flexing pose, vintage poster style),
      
      11-CONTORTIONIST (COLORFUL flexible bodysuit, impossible bendy pose, playful expression, amazed audience),
      
      12-JUGGLER (BRIGHT multicolored costume, juggling 5+ colorful balls mid-air, concentrated happy expression),
      
      13-AERIAL SILK (wrapped in RAINBOW silk ribbons, suspended mid-air in graceful pose, serene expression, ethereal lighting),
      
      14-STILT WALKER (TALL colorful costume on wooden stilts, towering above crowd, waving happily, parade background),
      
      15-HUMAN CANNONBALL (SPARKLY bodysuit, being shot from cannon mid-air, thrilled expression, trajectory arc),
      
      16-UNICYCLIST (COLORFUL costume, balancing on tall unicycle while juggling, impressive balance pose),
      
      17-HULA HOOP (SPARKLY leotard, multiple colorful hula hoops spinning on body, dynamic motion, playful expression),
      
      18-CIRCUS BAND (COLORFUL marching band uniform, playing trumpet or drum, festive parade atmosphere),
      
      19-KNIFE THROWER (DRAMATIC black and red costume, throwing knives at target, intense focused expression, assistant nearby),
      
      20-ANIMAL TRAINER (SAFARI-style costume with sequins, performing with trained dogs or horses, circus ring).
      
      ABSOLUTE RULE: DO NOT default to ringmaster with tailcoat and top hat! The random number ${Math.floor(Math.random() * 20) + 1} MUST determine the profession. VIBRANT CIRCUS COLORS. PHOTOREALISTIC quality. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um artista de circo! Talentoso, colorido e pronto para encantar a plateia sob a lona do picadeiro! 🎪✨"
    },
    
    carnival: {
      // Carnaval: ROSTO E EXPRESSÃO 100% PRESERVADOS - fantasias elegantes e bem humoradas
      prompt: `Brazilian Carnival transformation. ABSOLUTE CRITICAL RULE: The person's FACE, EXPRESSION, and PHYSIOGNOMY must be 100% PRESERVED and INSTANTLY RECOGNIZABLE. 
      
      FACE PRESERVATION IS PARAMOUNT: Each person's face must be COMPLETELY IDENTICAL to the original - same exact eyes (shape, color, size, spacing), same exact nose (shape, size, position), same exact mouth (shape, lips, smile/expression), same exact facial bone structure, same exact skin tone, same exact expression and emotion. The face should look like a PHOTO of the person in carnival costume, NOT a transformation OF the face.
      
      Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces IDENTICAL to original.
      
      STYLE: Elegant but not exaggerated. Fun and beautiful. Brazilian carnival authenticity. NOT overly rich or flashy - tasteful and joyful.
      
      Randomly choose ONE of these 8 carnival costumes (use random number ${Math.floor(Math.random() * 8) + 1}):
      
      1-PASSISTA DE ESCOLA DE SAMBA (colorful feathered headdress NOT covering face, sequined bikini top and shorts or elegant bodysuit, feathered back piece, high heels, samba pose with arms raised, Rio sambadrome background, joyful dancing expression, glitter on body),
      
      2-REI MOMO (playful crown, colorful royal cape with sequins, scepter in hand, big smile, confetti around, street carnival background, fun regal pose, NOT fat suit - person's real body with royal costume),
      
      3-PIERRÔ/COLOMBINA (classic harlequin costume in bright colors - diamonds pattern, small elegant mask held to side NOT covering face, ruffled collar, pointed hat, romantic Venice-meets-Brazil style, elegant pose),
      
      4-BAIANA (traditional white lace dress with colorful ribbons, turban headdress with fruits and flowers, layered necklaces, Bahia carnival style, graceful pose, warm smile, Salvador street carnival background),
      
      5-ÍNDIO/ÍNDIA BRASILEIRO (elaborate feathered headdress in vibrant colors, body paint designs on arms/chest, indigenous-inspired costume with modern carnival twist, proud pose, tribal patterns, Amazon-inspired backdrop),
      
      6-MALANDRO CARIOCA (white linen suit, Panama hat tilted, red scarf, two-tone shoes, cane, charming smile, Lapa arches background, classic Rio bohemian style, suave confident pose),
      
      7-PORTA-BANDEIRA/MESTRE-SALA (elegant ball gown for women / formal tailcoat for men, school colors, graceful spinning pose, flag or partner nearby, sambadrome parade, sophisticated carnival royalty),
      
      8-BLOCO DE RUA (casual but festive - colorful abadá shirt, glitter on face, flower crown or fun headband, holding beer or water spray, street party background, friends around, spontaneous joy, daytime carnival).
      
      CRITICAL: Face must be PERFECTLY VISIBLE and IDENTICAL to original. Costumes should frame the face beautifully. Expression should be JOYFUL and CELEBRATORY. Elegant but accessible - like a real person at carnival, not a professional model. PHOTOREALISTIC quality. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "🎭 Você está pronto para o Carnaval! Elegância, alegria e muita festa brasileira! 🇧🇷✨"
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


/**
 * Gerar imagem em alta resolução para download premium
 * HD (300 DPI): 2400x2400px - ideal para camisetas e canecas
 * 4K (600 DPI): 4800x6000px - qualidade máxima para posters e fotos
 */
export async function generateHighResolutionImage(
  imageUrl: string,
  resolution: "hd" | "4k",
  userId: number
): Promise<{ url: string; key: string }> {
  try {
    // Determinar tamanho e DPI baseado na resolução
    const isHD = resolution === "hd";
    const dpi = isHD ? 300 : 600;
    const size = isHD ? "2400x2400" : "4800x6000";
    
    // Prompt para upscaling com IA
    const upscalePrompt = `
      Enhance and upscale this image to ${size}px at ${dpi} DPI quality.
      Preserve all facial features and details exactly as they are.
      Improve clarity, sharpness, and color vibrancy.
      Remove any compression artifacts.
      Maintain the original composition and framing.
      Output should be suitable for high-quality print on t-shirts, mugs, and posters.
    `;
    
    // Gerar imagem upscalada
    const result = await generateImage({
      prompt: upscalePrompt,
      originalImages: [{
        url: imageUrl,
        mimeType: "image/jpeg"
      }]
    });
    
    if (!result.url) {
      throw new Error("Failed to generate high-resolution image");
    }
    
    // Fazer download da imagem upscalada
    const response = await fetch(result.url);
    const buffer = await response.arrayBuffer();
    
    // Upload para S3 com nome descritivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `user-${userId}/downloads/${resolution}-${timestamp}-${randomSuffix}.jpg`;
    
    const { url: s3Url } = await storagePut(fileKey, Buffer.from(buffer), "image/jpeg");
    
    return { url: s3Url, key: fileKey };
  } catch (error) {
    console.error("[Generation] Failed to generate high-resolution image:", error);
    throw new Error("Falha ao gerar imagem em alta resolução");
  }
}


/**
 * Gerar imagem combinada Antes/Depois lado a lado
 * Com etiquetas "Antes" e "Depois" na imagem
 */
export async function generateBeforeAfterImage(
  originalImageUrl: string,
  transformedImageUrl: string,
  userId: number
): Promise<{ url: string; key: string }> {
  console.log("[BeforeAfter] Starting generation for user:", userId);
  console.log("[BeforeAfter] Original URL:", originalImageUrl?.substring(0, 100));
  console.log("[BeforeAfter] Transformed URL:", transformedImageUrl?.substring(0, 100));
  
  // Validar URLs de entrada
  if (!originalImageUrl || !transformedImageUrl) {
    throw new Error("URLs das imagens são obrigatórias");
  }
  
  try {
    // Prompt simplificado para criar imagem combinada
    const combinePrompt = `
      Create a simple side-by-side comparison image:
      LEFT: Original photo with "ANTES" label at top (white text, small, elegant)
      RIGHT: Transformed photo with "DEPOIS" label at top (white text, small, elegant)
      
      Requirements:
      - Same size for both images, perfectly aligned horizontally
      - Thin white line separator between images
      - Landscape aspect ratio (wider than tall)
      - DO NOT modify the photos - just place them side by side
      - Professional, clean presentation for social media
    `;
    
    console.log("[BeforeAfter] Calling generateImage API...");
    
    // Gerar imagem combinada com timeout de 90 segundos
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout: geração demorou mais de 90 segundos")), 90000);
    });
    
    const generatePromise = generateImage({
      prompt: combinePrompt,
      originalImages: [
        {
          url: originalImageUrl,
          mimeType: "image/jpeg"
        },
        {
          url: transformedImageUrl,
          mimeType: "image/jpeg"
        }
      ]
    });
    
    let result;
    try {
      result = await Promise.race([generatePromise, timeoutPromise]);
    } catch (raceError: any) {
      console.error("[BeforeAfter] Race error:", raceError?.message);
      throw new Error("Tempo limite excedido. Tente novamente.");
    }
    
    console.log("[BeforeAfter] API returned, URL:", result?.url?.substring(0, 100));
    
    if (!result || !result.url) {
      throw new Error("API não retornou URL da imagem. Tente novamente.");
    }
    
    // Fazer download da imagem combinada com retry
    console.log("[BeforeAfter] Downloading generated image...");
    let response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        response = await fetch(result.url);
        if (response.ok) break;
      } catch (fetchError) {
        console.log("[BeforeAfter] Fetch retry, remaining:", retries - 1);
      }
      retries--;
      if (retries > 0) await new Promise(r => setTimeout(r, 1000));
    }
    
    if (!response || !response.ok) {
      throw new Error(`Falha ao baixar imagem gerada. Status: ${response?.status || 'unknown'}`);
    }
    
    const buffer = await response.arrayBuffer();
    console.log("[BeforeAfter] Downloaded, size:", buffer.byteLength);
    
    if (buffer.byteLength < 1000) {
      throw new Error("Imagem gerada inválida (muito pequena)");
    }
    
    // Upload para S3 com nome descritivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `user-${userId}/before-after/${timestamp}-${randomSuffix}.jpg`;
    
    console.log("[BeforeAfter] Uploading to S3:", fileKey);
    const { url: s3Url } = await storagePut(fileKey, Buffer.from(buffer), "image/jpeg");
    
    if (!s3Url) {
      throw new Error("Falha ao salvar imagem no servidor");
    }
    
    console.log("[BeforeAfter] Success! S3 URL:", s3Url?.substring(0, 100));
    return { url: s3Url, key: fileKey };
  } catch (error: any) {
    console.error("[BeforeAfter] FAILED:", error?.message || error);
    // Mensagem amigável para o usuário
    const userMessage = error?.message?.includes("Timeout") 
      ? "A geração demorou muito. Por favor, tente novamente."
      : error?.message || "Falha ao gerar imagem Antes/Depois. Tente novamente.";
    throw new Error(userMessage);
  }
}
