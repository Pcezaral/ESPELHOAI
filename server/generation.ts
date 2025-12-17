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
 * 2. PRESERVAR ROSTOS IDÊNTICOS - NUNCA cobrir com barbas grandes, capacetes, máscaras
 * 3. NUNCA adicionar ou remover pessoas
 * 4. ALTA ALEATORIEDADE - mesma foto deve gerar versões DIFERENTES
 * 5. EVITAR CAPACETES, BARBAS EXAGERADAS - preferir coroas, tiaras, cabelos soltos para mostrar rosto
 * 6. FUNDOS VARIADOS - cada geração deve ter cenário diferente
 */
export async function generateTransformation(
  theme: "animals" | "monster" | "art" | "gender" | "epic" | "gangster" | "circus" | "natal" | "reveillon",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // Gerar variações aleatórias FORTES para cada geração
  const timestamp = Date.now();
  const randomSeed = Math.random() * timestamp * (userId + 1);
  const randomVariation = Math.floor(Math.random() * 1000);
  
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
      // Pintura: ROSTO IDÊNTICO, ALTA VARIEDADE de estilos artísticos famosos
      prompt: `Artistic portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same features, expression, age, skin tone. ONLY change: artistic style, costume and background. Randomly choose ONE famous painting style: Van Gogh Impressionism (swirling brushstrokes, vibrant blues and yellows, Starry Night style / Sunflower field / Café terrace at night / Wheat field with cypresses), Picasso Cubism (geometric fragmented faces, multiple perspectives, bold primary colors, Blue Period melancholy / Rose Period warm tones / African art influence), Rembrandt Baroque (dramatic chiaroscuro lighting, rich browns and golds, Dutch Golden Age costume, dark background with spotlight face), Caravaggio Baroque (intense tenebrism, dramatic shadows and highlights, religious Renaissance clothing, dark dramatic background), Monet Impressionism (soft dappled brushstrokes, pastel colors, garden setting with water lilies, Japanese bridge, impressionist light), Leonardo da Vinci Renaissance (sfumato soft edges, Mona Lisa mysterious smile style, Italian Renaissance clothing, landscape background with mountains), Frida Kahlo Surrealism (bold vibrant colors, Mexican folk art, elaborate floral headpiece, tropical jungle background with monkeys and parrots), Gustav Klimt Art Nouveau (gold leaf patterns, ornate geometric decorations, The Kiss style, Byzantine mosaics influence, golden spirals), Edvard Munch Expressionism (wavy bold colors, emotional intensity, The Scream style, swirling sky, bridge or landscape), Salvador Dalí Surrealism (melting clocks style, dreamlike bizarre elements, desert landscape, hyper-realistic details with surreal twist), Henri Matisse Fauvism (bold flat colors, simplified forms, Dance style, vibrant reds blues greens, decorative patterns), Botticelli Renaissance (flowing hair, Birth of Venus style, soft pastel colors, shell and flowers, Italian Renaissance beauty), Toulouse-Lautrec Post-Impressionism (Moulin Rouge cabaret style, bold outlines, flat colors, Art Nouveau posters, Parisian nightlife), Vermeer Baroque (Girl with Pearl Earring style, soft natural light from window, Dutch interior, turban or headscarf, intimate domestic scene), Andy Warhol Pop Art (bright neon colors, repeated grid pattern, screen print effect, celebrity portrait style, bold contrasts). CRITICAL: ONLY famous painting styles, NO historical periods, NO 1920s/1940s/1950s themes. Vary background to match artist style (gardens, interiors, abstract, landscapes). Artistic painting texture visible. Random seed: ${randomSeed}`,
      text: "Você é uma obra de arte! Seus traços se transformaram em um estilo artístico único! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO 100% IDÊNTICO, looks divertidos mas preservação facial ABSOLUTA
      prompt: `Gender swap portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face, DO NOT exaggerate features, DO NOT create caricature. ONLY change: hairstyle, clothing, accessories, pose, background. Randomly choose ONE look with playful style: Male to Female options (Carnival Baiana with colorful Bahia costume + fruit headpiece + vibrant skirts + beach background, Hawaiian Hula Dancer with grass skirt + flower lei + tropical paradise, Glamorous Drag Queen with sequined gown + dramatic makeup + feather boa + stage lights, Flamenco Dancer with red ruffled dress + rose in hair + Spanish background, 1950s Housewife with apron + curlers + kitchen background, Bollywood Diva with sari + jewelry + colorful Indian background, Cabaret Performer with feathers + sparkles + theater stage). Female to Male options (Firefighter with uniform + mustache + fire truck background, Police Officer with uniform + aviator sunglasses + mustache + squad car, Doctor with white coat + stethoscope + beard + hospital, Rockstar Guitarist with leather jacket + electric guitar + stage with smoke, Construction Worker with hard hat + tool belt + building site, Cowboy with hat + boots + lasso + Wild West saloon, Biker with leather vest + bandana + motorcycle background, Chef with white uniform + hat + restaurant kitchen). CRITICAL: NO face distortion, NO cartoon features, keep facial proportions natural. Vary pose naturally (confident stance / relaxed pose / professional posture / casual lean). Vary background to match character (workplace / stage / outdoor scene / indoor setting). Vibrant colors, playful styling, clear lighting. Realistic photo style. Random seed: ${randomSeed}`,
      text: "Se tivesse nascido... Descubra sua versão hilariante do outro gênero! 😂⚧️"
    },
    
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, variar cultura e acessórios SEM CAPACETES
      prompt: `Ancient warrior/goddess transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, body, pose, background. Randomly choose ONE culture with varied style: Greek (laurel crown + flowing toga / golden headband + warrior dress / olive wreath + philosopher robe), Roman (golden tiara + senator robes / leaf crown + gladiator armor / jeweled circlet + empress gown), Viking (braided hair with beads + fur cloak / metal arm rings + leather armor / hair ornaments + shield maiden outfit). CRITICAL: NO helmets, NO face-covering headgear - use crowns, tiaras, headbands, hair ornaments, wreaths to keep face fully visible. Vary pose dramatically (heroic stance / battle ready / regal sitting / victorious). Vary background (temple / battlefield / throne room / forest / mountain). Epic lighting from different angles. Random seed: ${randomSeed}`,
      text: "Você é um guerreiro/deusa épico! Poderoso, belo e pronto para conquistar o mundo! 🏛️⚔️"
    },
    
    gangster: {
      // Gangster: ROSTO 100% IDÊNTICO, MÁXIMA VARIEDADE de estilos e eras cinematográficas
      // INCLUI: Anos 20 clássico, Tarantino, Blade Runner, Scarface, Goodfellas, Peaky Blinders, etc.
      prompt: `Gangster/Crime Boss transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face, DO NOT add heavy beards or mustaches that cover face. ONLY change: costume, pose, props, background, era. Randomly choose ONE scenario from DIVERSE eras and styles: 
      
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
      // Circo: ROSTO 100% IDÊNTICO, MÁXIMA DIVERSÃO e VARIEDADE de profissões circenses
      // Expressões ALEGRES e DIVERTIDAS, cenários COLORIDOS e VIBRANTES
      prompt: `Circus performer transformation - FUN AND JOYFUL! CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: circus costume, pose, props, background. 
      
      CRITICAL: Make it FUN, COLORFUL, HAPPY! Person should look JOYFUL and ENTERTAINED!
      
      Randomly choose ONE circus profession with MAXIMUM FUN and VARIETY:
      
      ACROBAT (sparkly sequined leotard in bright colors + mid-air flip or handstand pose + juggling colorful balls/clubs/rings + BIG HAPPY SMILE + circus tent with spotlights + confetti falling + dynamic joyful action),
      
      TRAPEZE ARTIST (glittery aerial costume with flowing ribbons + hanging gracefully from trapeze + dramatic mid-swing pose + EXCITED EXPRESSION + high above circus ring + colorful spotlights + wind in hair),
      
      HAPPY CLOWN (colorful oversized polka dot costume + rainbow wig + red nose + HUGE JOYFUL SMILE + oversized shoes + holding balloons and flowers + circus ring with laughing audience + confetti and streamers + silly playful pose),
      
      MAGICIAN (elegant purple/gold tuxedo with flowing cape + sparkly top hat + pulling rabbit from hat or doves flying + MYSTERIOUS SMILE + stage with magic props + sparkles and stars + dramatic reveal pose),
      
      RINGMASTER (bright red tailcoat with gold buttons + tall top hat + holding whip and megaphone + PROUD CONFIDENT SMILE + center of circus ring + colorful lights + commanding welcoming pose + audience cheering),
      
      TIGHTROPE WALKER (elegant sparkling costume + balance pole + walking on rope high above + FOCUSED BUT HAPPY expression + circus tent interior + dramatic spotlight + graceful balanced pose),
      
      FIRE PERFORMER (exotic costume with flame patterns + fire poi or fire fans + INTENSE EXCITED expression + flames illuminating face + dark background with fire glow + dramatic action pose),
      
      STRONGMAN/STRONGWOMAN (striped vintage tank top + lifting comically oversized barbell + PROUD FLEXING pose + vintage circus poster style + crowd cheering + muscular heroic stance),
      
      CONTORTIONIST (colorful flexible bodysuit + impossible bendy pose + PLAYFUL EXPRESSION + circus stage with dramatic lighting + amazed audience reaction),
      
      JUGGLER (bright multicolored costume + juggling flaming torches or colorful pins + CONCENTRATED BUT HAPPY + dynamic action mid-juggle + circus tent with spotlights),
      
      AERIAL SILK PERFORMER (flowing silk ribbons in rainbow colors + suspended mid-air in graceful pose + SERENE HAPPY expression + wrapped beautifully in silks + ethereal lighting),
      
      STILT WALKER (tall colorful costume on wooden stilts + towering above crowd + WAVING HAPPILY + circus parade background + festive atmosphere),
      
      CANNON PERFORMER (sparkly costume + being shot from cannon mid-air + THRILLED EXCITED expression + circus tent background + dramatic action moment).
      
      CRITICAL: VIBRANT CIRCUS COLORS (red, yellow, blue, gold, purple, green, orange), striped circus tent background, dramatic theatrical lighting with colorful spotlights, HAPPY JOYFUL EXPRESSIONS, festive atmosphere with confetti/streamers/balloons. Vary pose dramatically (action mid-performance / triumphant bow / dramatic entrance / playful interaction). Theatrical realistic photo style with authentic FUN circus atmosphere. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um artista de circo! Talentoso, colorido e pronto para encantar a plateia sob a lona do picadeiro! 🎪✨"
    },
    
    natal: {
      // Natal: ROSTO 100% IDÊNTICO, barba de Papai Noel CURTA que NÃO cobre o rosto
      // Variedade de personagens e cenários criativos urbanos
      prompt: `Christmas transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. 
      
      CRITICAL FOR SANTA: If Santa Claus, use SHORT TRIMMED white beard that does NOT cover the face - beard should be neat, well-groomed, and allow full face visibility. NO long bushy beards covering chin or cheeks!
      
      ONLY change: costume, pose, props, background. Randomly choose ONE Christmas character with CREATIVE urban scenarios:
      
      SANTA CLAUS (full red suit with white fur trim, black belt, Santa hat, SHORT TRIMMED white beard that shows full face, holding gift sack, CREATIVE SCENARIOS: riding sleigh through city street with traffic lights / standing in subway station with gifts / in office decorated with lights / pushing shopping cart full of gifts in supermarket / riding bicycle with gift sack / at bus stop with reindeer / in taxi decorated with lights / on rooftop overlooking city / in parking lot with sleigh / at coffee shop serving hot chocolate),
      
      MRS. CLAUS (red velvet dress with white fur trim, Santa hat, elegant grandmother look, holding gift boxes, CREATIVE SCENARIOS: baking cookies in modern kitchen / wrapping gifts in living room with city view / decorating Christmas tree in apartment / at shopping mall with bags / in bakery with Christmas treats / reading Christmas stories in library / at hair salon with festive decorations),
      
      REINDEER PERSON (brown reindeer costume with cute antlers headband, red Rudolph nose, festive Christmas sweater, CREATIVE SCENARIOS: waiting at crosswalk in city / riding scooter through decorated street / at gym with Christmas gear / in park with snow / jogging through city with lights / at outdoor market / sitting on park bench),
      
      ELF (green and red elf costume with pointed hat, striped tights, pointy elf ears, holding toys/gifts, CREATIVE SCENARIOS: wrapping gifts in toy store / delivering packages on city street / at post office with gifts / riding skateboard with presents / at bookstore organizing gifts / in workshop with tools and toys / helping at charity event),
      
      CHRISTMAS ANGEL (white flowing gown with golden wings, glowing halo, holding star wand, CREATIVE SCENARIOS: on church steps with lights / in city square with Christmas tree / at concert hall / in garden with snow / on bridge with city lights / at fountain with decorations).
      
      CRITICAL: Mix reality with fantasy - use REAL urban settings but add Christmas magic (lights, ornaments, snow, decorations). Vary pose (jolly laugh / gift giving / festive wave / cheerful stance / magical floating). Warm festive lighting with Christmas colors (red, green, gold, white). Photorealistic style with Christmas magic. Random seed: ${randomSeed}`,
      text: "🎄 Você é o espírito do Natal! Espalhe alegria e magia natalina por onde passar! 🎅✨"
    },
    
    reveillon: {
      // Réveillon: ROSTO 100% IDÊNTICO, celebração elegante de ano novo
      // VARIEDADE de cenários: praia, festa, rooftop, iate, etc.
      prompt: `New Year's Eve 2026 transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, pose, props, background. 
      
      Randomly choose ONE New Year scenario with HIGH VARIETY:
      
      COPACABANA BEACH CELEBRATION (elegant white flowing dress or white linen suit, barefoot on sand, holding champagne glass, Rio de Janeiro beach at night with SPECTACULAR colorful fireworks exploding over ocean, famous Copacabana promenade, crowd celebrating, "2026" visible in fireworks, tropical festive atmosphere),
      
      ELEGANT ROOFTOP PARTY (stylish all-white outfit, champagne flute, luxury rooftop with city skyline, fireworks spelling "2026" in background, string lights, DJ booth, dancing crowd silhouettes, glamorous night party),
      
      LUXURY YACHT CELEBRATION (white nautical elegant outfit, captain's hat optional, champagne, luxury yacht deck, fireworks over water with "2026" visible, ocean reflecting colorful lights, glamorous maritime setting),
      
      TIMES SQUARE STYLE (white winter coat with fur trim, holding champagne, massive crowd, giant "2026" ball drop, confetti explosion, neon lights, iconic celebration moment),
      
      TROPICAL RESORT PARTY (white resort wear, pool party setting, palm trees with lights, fireworks in tropical sky, tiki torches, exotic cocktails, "2026" ice sculpture),
      
      ELEGANT BALLROOM (formal white gown or white tuxedo, grand ballroom with chandeliers, orchestra, waltzing couples, golden "2026" decorations, champagne tower, black tie elegance),
      
      VINEYARD CELEBRATION (white linen outfit, wine country setting, vineyard rows with lights, rustic elegant party, fireworks over hills, wine glasses, "2026" in sparklers).
      
      CRITICAL: White clothing is MANDATORY (Brazilian New Year tradition for good luck). Add spectacular fireworks with "2026", champagne, golden decorations, confetti. Vary pose (toasting / celebrating / dancing / elegant stance / joyful expression / arms raised). Night lighting with fireworks glow and golden party lights. Photorealistic celebratory style. Random seed: ${randomSeed}`,
      text: "🎆 Você está pronto para o Réveillon! Celebre com estilo e brinde ao novo ano com champagne! 🍾✨"
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
