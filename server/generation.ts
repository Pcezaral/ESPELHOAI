import { getRandomReveilonPrompt } from "./reveillon-prompts";
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
  theme: "animals" | "monster" | "art" | "gender" | "epic" | "gangster" | "circus" | "natal" | "reveillon",
  imageUrl: string,
  userId: number
): Promise<{ generatedImageUrl: string; generatedText: string }> {
  
  // Gerar variações aleatórias FORTES para cada geração
  // Combina: timestamp (muda a cada segundo) + Math.random() + userId
  // Isso garante que NUNCA duas gerações sejam iguais, mesmo no mesmo estilo
  const timestamp = Date.now();
  const randomSeed = Math.random() * timestamp * (userId + 1);
  const randomVariation = Math.floor(Math.random() * 1000);
  
  const themePrompts: Record<typeof theme, { prompt: string; text: string }> = {
    animals: {
      // Bichinho: ROSTO 100% RECONHECÍVEL mesmo em transformação intensa - ALTA VARIABILIDADE
      prompt: `Cute animal portrait transformation. ⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
1. PRESERVE FACIAL IDENTITY: Keep person's EXACT face - same eyes, nose, mouth, cheekbones, jaw, expression. Person must be 100% recognizable as themselves.
2. CLEAN FACE: NO masks, NO heavy beards, NO face-covering elements. Face must be fully visible and clear.
3. ANIMAL FEATURES ONLY: Add ONLY animal features (fur, ears, whiskers, tail, snout, paws). DO NOT change face structure.
4. EXACT PEOPLE COUNT: 1 person input = 1 person output; 2 people = 2 people with identical faces; 3 people = 3 people with identical faces.
5. VARY BACKGROUNDS: Use DIFFERENT backgrounds (forest, jungle, savanna, ocean, mountains, park, home, snow, desert, underwater, sky, clouds, nature scenes).
6. VARY POSES: Use DIFFERENT poses (sitting, standing, playful, resting, action, swimming, flying, climbing, running, jumping).

Cute animal portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical. PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, nose proportions, mouth expression, facial structure must be identifiable. DO NOT create generic animal, DO NOT lose person's identity. ONLY change: add fur/feathers, animal ears, whiskers, tail. Randomly choose ONE animal with EXTREME VARIETY: fluffy cat (soft fur, cat ears, whiskers, multiple poses), playful dog (floppy ears, friendly expression, varied backgrounds), wise owl (feathered face, big eyes but same eye color, forest setting), gentle deer (soft features, small antlers, nature background), curious fox (orange fur, pointed ears, woodland scene), cuddly bear (round ears, soft fur, varied poses), happy bunny (long ears, fluffy, garden setting), colorful parrot (feathers, beak but recognizable face, tropical background), sleepy koala (gray fur, round ears, tree background), energetic squirrel (bushy tail, alert expression, park setting), majestic lion (mane, fierce expression preserved, savanna), playful dolphin (marine setting, joyful expression), wise elephant (large ears, gentle eyes, savanna background), cute penguin (arctic setting, playful pose), colorful fish (underwater scene, vibrant colors). CRITICAL: Face must look like the person AS an animal, not a random animal. Keep facial proportions, eye spacing, expression identical. VARY BACKGROUNDS DRAMATICALLY (forest, jungle, savanna, ocean, mountains, park, home, snow, desert, underwater, sky). Vary pose naturally (sitting / standing / playful / resting / action pose / swimming / flying / climbing). Soft lighting, vibrant colors. Cute cartoon style with facial recognition. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: ROSTO 100% RECONHECÍVEL mesmo em transformação intensa - ALTA VARIABILIDADE
      prompt: `Cute monster portrait transformation. ⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
1. PRESERVE FACIAL IDENTITY: Keep person's EXACT face - same eyes, nose, mouth, cheekbones, jaw, expression. Person must be 100% recognizable as themselves.
2. CLEAN FACE: NO masks, NO heavy beards, NO face-covering elements. Face must be fully visible and clear.
3. MONSTER FEATURES ONLY: Add ONLY monster features (horns, colorful skin, playful details, scales, patterns). DO NOT change face structure.
4. EXACT PEOPLE COUNT: 1 person input = 1 person output; 2 people = 2 people with identical faces; 3 people = 3 people with identical faces.
5. VARY BACKGROUNDS: Use DIFFERENT backgrounds (enchanted forest, magical castle, candy land, underwater cave, space, rainbow sky, mystical garden, spooky mansion, cloud kingdom, crystal cavern).
6. VARY POSES: Use DIFFERENT poses (friendly wave, playful stance, cute sitting, happy jumping, dancing, flying, riding, floating).

Cute monster portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical. PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, facial proportions, expression, smile/frown pattern must be identifiable. DO NOT create generic monster, DO NOT lose person's identity. ONLY change: add monster features (horns, colorful skin, playful details). Randomly vary monster style with EXTREME VARIETY: skin color (pink / purple / turquoise / mint / coral / lavender / peach / gold / silver / rainbow), horn style (small curved / tiny straight / mini spiral / cute nubs / crown / tiara), accessory (bow / hat / glasses / flower / star / jewelry / crown), pattern (spots / stripes / sparkles / swirls / scales / dots / waves). VARY BACKGROUNDS DRAMATICALLY (enchanted forest, magical castle, candy land, underwater cave, space, rainbow sky, mystical garden, spooky mansion, cloud kingdom, crystal cavern). CRITICAL: Face structure must look like the person AS a monster, not a random creature. Keep same eye spacing, nose position, mouth shape, facial bone structure. Vary pose naturally (friendly wave / playful stance / cute sitting / happy jumping / dancing / flying / riding / floating). Soft lighting, vibrant cheerful colors. Adorable cartoon style with facial recognition. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÉNCO, ALTA VARIEDADE de estilos artísticos famosos - APENAS ARTE
      prompt: `Artistic portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same features, expression, age, skin tone. ONLY change: artistic style, costume and background. Randomly choose ONE famous painting style: Van Gogh Impressionism (swirling brushstrokes, vibrant blues and yellows, Starry Night style / Sunflower field / Café terrace at night / Wheat field with cypresses), Picasso Cubism (geometric fragmented faces, multiple perspectives, bold primary colors, Blue Period melancholy / Rose Period warm tones / African art influence), Rembrandt Baroque (dramatic chiaroscuro lighting, rich browns and golds, Dutch Golden Age costume, dark background with spotlight face), Caravaggio Baroque (intense tenebrism, dramatic shadows and highlights, religious Renaissance clothing, dark dramatic background), Monet Impressionism (soft dappled brushstrokes, pastel colors, garden setting with water lilies, Japanese bridge, impressionist light), Leonardo da Vinci Renaissance (sfumato soft edges, Mona Lisa mysterious smile style, Italian Renaissance clothing, landscape background with mountains), Frida Kahlo Surrealism (bold vibrant colors, Mexican folk art, elaborate floral headpiece, tropical jungle background with monkeys and parrots), Gustav Klimt Art Nouveau (gold leaf patterns, ornate geometric decorations, The Kiss style, Byzantine mosaics influence, golden spirals), Edvard Munch Expressionism (wavy bold colors, emotional intensity, The Scream style, swirling sky, bridge or landscape), Salvador Dalí Surrealism (melting clocks style, dreamlike bizarre elements, desert landscape, hyper-realistic details with surreal twist), Henri Matisse Fauvism (bold flat colors, simplified forms, Dance style, vibrant reds blues greens, decorative patterns), Botticelli Renaissance (flowing hair, Birth of Venus style, soft pastel colors, shell and flowers, Italian Renaissance beauty), Toulouse-Lautrec Post-Impressionism (Moulin Rouge cabaret style, bold outlines, flat colors, Art Nouveau posters, Parisian nightlife), Vermeer Baroque (Girl with Pearl Earring style, soft natural light from window, Dutch interior, turban or headscarf, intimate domestic scene), Andy Warhol Pop Art (bright neon colors, repeated grid pattern, screen print effect, celebrity portrait style, bold contrasts). CRITICAL: ONLY famous painting styles, NO historical periods, NO 1920s/1940s/1950s themes. VARY BACKGROUNDS DRAMATICALLY to match artist style (gardens, interiors, abstract, landscapes, urban scenes, museums, studios, nature, water, sky, mountains, forests, deserts, historical settings, fantasy worlds). Artistic painting texture visible. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é uma obra de arte! Seus traços se transformaram em um estilo artístico único! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO 100% IDÊNCO, looks divertidos mas preservação facial ABSOLUTA
      prompt: `Gender swap portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face, DO NOT exaggerate features, DO NOT create caricature. ONLY change: hairstyle, clothing, accessories, pose, background. Randomly choose ONE look with playful style: Male to Female options (Carnival Baiana with colorful Bahia costume + fruit headpiece + vibrant skirts + beach background, Hawaiian Hula Dancer with grass skirt + flower lei + tropical paradise, Glamorous Drag Queen with sequined gown + dramatic makeup + feather boa + stage lights, Flamenco Dancer with red ruffled dress + rose in hair + Spanish background, 1950s Housewife with apron + curlers + kitchen background, Bollywood Diva with sari + jewelry + colorful Indian background, Cabaret Performer with feathers + sparkles + theater stage). Female to Male options (Firefighter with uniform + mustache + fire truck background, Police Officer with uniform + aviator sunglasses + mustache + squad car, Doctor with white coat + stethoscope + beard + hospital, Rockstar Guitarist with leather jacket + electric guitar + stage with smoke, Construction Worker with hard hat + tool belt + building site, Cowboy with hat + boots + lasso + Wild West saloon, Biker with leather vest + bandana + motorcycle background, Chef with white uniform + hat + restaurant kitchen). CRITICAL: NO face distortion, NO cartoon features, keep facial proportions natural. VARY POSES DRAMATICALLY (confident stance / relaxed pose / professional posture / casual lean / action pose / sitting / standing / walking / dancing / jumping / leaning). VARY BACKGROUNDS DRAMATICALLY to match character (workplace / stage / outdoor scene / indoor setting / street / beach / park / nightclub / office / studio / home / restaurant / bar / theater / concert hall). Vibrant colors, playful styling, clear lighting. Realistic photo style. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Se tivesse nascido... Descubra sua versão hilariante do outro gênero! 😂⚧️"
    },
    epic: {
      // Épico: ROSTO 100% IDÊNTICO, variar cultura (Gregos, Romanos, Vikings) e acessórios SEM CAPACETES
      prompt: `Ancient warrior/goddess transformation. ⚠️ CRITICAL RULES - MUST FOLLOW EXACTLY:
1. PRESERVE FACIAL IDENTITY: Keep person's EXACT face - same eyes, nose, mouth, cheekbones, jaw, expression. Person must be 100% recognizable as themselves.
2. CLEAN FACE: NO helmets, NO face-covering headgear. Use ONLY crowns, tiaras, headbands, hair ornaments, wreaths, braids. Face must be fully visible.
3. COSTUME ONLY: Change costume, armor, pose, background. DO NOT change face structure or features.
4. EXACT PEOPLE COUNT: 1 person input = 1 person output; 2 people = 2 people with identical faces; 3 people = 3 people with identical faces.
5. VARY BACKGROUNDS: Use DIFFERENT backgrounds (temple, battlefield, throne room, forest, mountain, ocean, palace, arena, cliff, castle, fortress, sacred ground, ancient ruins, mythical landscape, sky, clouds, divine realm).
6. VARY POSES: Use DIFFERENT poses (heroic stance, battle ready, regal sitting, victorious, action pose, riding, flying, commanding, meditating, celebrating, thinking, praying, leading).

Ancient warrior/goddess transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, body, pose, background, cultural style. Randomly choose ONE culture with EXTREME VARIETY in scenarios:: GREEK WARRIOR/GODDESS (Spartan Warrior with bronze armor + spear + shield with Greek symbols + battle-ready stance + ancient Greek battlefield + dramatic lighting, Athenian Philosopher with flowing toga + laurel crown + scroll + contemplative pose + ancient temple columns + wisdom expression, Greek Goddess with flowing chiton dress + golden tiara + holding trident/lyre + divine pose + Mount Olympus background + ethereal glow, Hoplite Soldier with bronze helmet-like crown (NO face covering) + heavy armor + spear + shield + phalanx formation background + determined expression, Spartan Queen with elaborate headdress + flowing robes + commanding pose + palace interior + regal authority, Olympic Athlete with minimal armor + muscular build + laurel wreath + athletic pose + ancient stadium + victorious expression, Greek Priestess with white robes + golden headband + holding sacred objects + temple interior + mystical expression). ROMAN WARRIOR/EMPEROR (Roman Legionnaire with segmented armor + helmet-like crown (NO face covering) + gladius sword + shield with eagle + fortress background + military discipline, Roman Emperor with purple toga + golden crown + scepter + throne room + commanding presence + absolute authority, Gladiator with minimal armor + sword + shield + arena sand + crowd silhouettes + intense focus + battle-ready, Roman General with ornate armor + cape + laurel crown + military tent + strategic pose + leadership, Vestal Virgin with white robes + sacred flame + temple interior + serene expression + duty-bound, Roman Senator with toga + laurel wreath + forum columns + political power + dignified stance, Centurion with heavy armor + helmet-like crown + spear + legion formation + military precision). VIKING WARRIOR/SHIELDMAIDEN (Viking Warrior with leather armor + fur cloak + braided hair with beads + axe + shield + Norse symbols + snowy mountain background + fierce expression, Shield Maiden with armor + braided hair + spear + shield + Viking ship background + warrior spirit + determined look, Viking Raider with leather + fur + holding sword + ship deck + ocean background + adventurous pose + wind-swept hair, Norse Jarl with elaborate armor + fur cloak + braided beard (if applicable) + command presence + Viking hall interior + authority, Viking Berserker with minimal armor + massive axe + intense expression + battle fury + snowy battlefield + action pose, Norse Priestess with white robes + mystical symbols + holding runes + forest background + spiritual connection, Viking Explorer with practical armor + navigation tools + ship + ocean + discovery pose + adventurous spirit). CRITICAL: NO helmets, NO face-covering headgear - use crowns, tiaras, headbands, hair ornaments, wreaths, braids to keep face fully visible and recognizable. VARY POSES DRAMATICALLY (heroic stance / battle ready / regal sitting / victorious / action pose / riding / flying / commanding / meditating / celebrating / thinking / praying / leading). VARY BACKGROUNDS DRAMATICALLY (temple / battlefield / throne room / forest / mountain / ocean / palace / arena / cliff / castle / fortress / sacred ground / ancient ruins / mythical landscape / sky / clouds / divine realm / Viking hall / Norse forest / ship deck / ocean waves). Epic lighting from different angles (dramatic shadows / golden glow / divine light / battle fire / mystical glow / storm clouds / northern lights). Vary camera angle (low angle heroic / side profile / action shot / portrait / wide establishing shot / close-up / commanding perspective). Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um guerreiro/deusa épico! Poderoso, belo e pronto para conquistar o mundo! 🏛️⚔️"
    },
    
gangster: {
      // Gangster: ROSTO 100% IDÉNTICO, ALTA VARIEDADE de estilos (1920s, moderno, Tarantino-style, rua, carro, etc)
      prompt: `Gangster/Crime Boss transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, pose, props, background, era. Randomly choose ONE scenario from different eras and styles: CLASSIC 1920s ERA (Speakeasy Boss in pinstripe suit + fedora + cigar + behind bar with whiskey bottles + Art Deco interior + period lighting, Tommy Gun Shootout in suit + suspenders + fedora + holding tommy gun + brick alley + vintage car + action pose, Vintage Car Getaway driving 1920s Ford Model A + fedora + leather jacket + city street + motion blur + wind-swept hair, Jazz Club Owner in elegant suit + bow tie + jazz stage + musicians + smoky atmosphere + microphone, Casino High Roller in tuxedo + fedora + poker table + chips + chandelier + 1920s casino + confident smirk, Bootlegger Deal in trench coat + fedora + whiskey crates + dark warehouse + dramatic lighting + suspicious glance, Mob Meeting in three-piece suit + fedora + round table + maps + money + cigar smoke + commanding pose, Bank Heist in suit + fedora + money bags + vault door + dramatic shadows + intense focus, Rooftop Lookout in overcoat + fedora + binoculars + 1920s city skyline + neon signs + vigilant stance, Speakeasy Entrance in formal attire + fedora + standing at speakeasy door + password whisper + 1920s street + vintage cars + period lighting). STREET SCENES (Street Corner Hustler leaning against brick wall + leather jacket + sunglasses + urban alley + graffiti + cool attitude, Street Dealer in hoodie + snapback + standing on street corner + city blocks + street lights + night scene, Street Racing in driver seat of muscle car + leather jacket + intense focus + city streets + motion + adrenaline, Alley Confrontation in dark alley + dramatic shadows + tense posture + brick walls + street lights + suspenseful atmosphere, Street Fight in action pose + leather jacket + urban street background + motion + intensity + gritty realism). CAR SCENES (Luxury Car Owner in tailored suit + sitting in expensive car + leather interior + confident smirk + city background, Car Chase Driver intense focus + gripping steering wheel + high-speed motion + city streets + adrenaline + action, Getaway Driver in leather jacket + focused expression + driving fast car + blurred background + motion + escape, Parked Car Meeting in dark suit + leaning against car + nighttime + street lights + suspicious meeting + dramatic atmosphere, Car Trunk Deal in suit + opening trunk with money/goods + dark alley + night + dramatic lighting + tense negotiation). MODERN CRIME BOSS (Sharp tailored suit + sunglasses + modern penthouse office + city skyline windows + contemporary art + power stance, Nightclub Owner in designer suit + gold chains + VIP lounge + neon lights + modern luxury + welcoming gesture, Street Hustler in oversized hoodie + snapback + gold chains + urban street background + graffiti + cool lean, Cartel Leader in tactical vest + sunglasses + luxury villa + armed guards silhouettes + commanding presence, Corrupt Politician in expensive suit + tie + government building + power pose + mahogany office + authority). TARANTINO STYLE (Pulp Fiction style in sharp suit + sunglasses + diner booth + retro 90s background + cigarette smoke + cool attitude, Kill Bill Assassin in all black outfit + sword + dramatic action pose + Japanese temple background + focused intensity, Inglourious Bastards style in military-inspired outfit + dramatic lighting + war setting + menacing expression, Django Unchained style in period costume + dramatic pose + plantation background + western elements + defiant stance, Reservoir Dogs style in dark suit + sunglasses + warehouse + dramatic shadows + intense focus + tough demeanor, Once Upon a Time in Hollywood style in 1960s outfit + convertible + sunset background + relaxed cool, Hateful Eight style in winter coat + isolated cabin interior + tense atmosphere + suspicious look). VARIED POSES AND ACTIONS: sitting at desk with gun + standing with arms crossed + leaning against car + walking down street + sitting in nightclub booth + standing in warehouse + driving luxury car + sitting at poker table + standing in doorway + leaning on wall + hands in pockets + pointing gun + holding cigar + adjusting fedora + looking over shoulder + intense stare + slight smirk + confident smile + smoking cigarette + adjusting sunglasses + checking watch + counting money. ENVIRONMENTAL VARIETY: Incorporate background elements that match original photo context (if outdoor, add street/alley/car elements; if indoor, add room details; if with people, add crowd/group dynamics; if solo, emphasize power and presence). CRITICAL: High variety in poses, expressions, scenarios, and locations - NEVER repeat same scene twice. ALWAYS vary between 1920s era, modern times, street scenes, car scenes, and Tarantino-inspired moments. Cinematic film noir or modern crime drama style. Dramatic lighting from different angles (harsh shadows / neon glow / spotlight / natural window light / dramatic contrast / street lights / car headlights). Vary camera angle (low angle power shot / side profile / action shot / portrait / wide establishing shot / close-up / driver perspective). Realistic cinematic photo style with authentic period or modern details. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um crime boss! Sofisticado, perigoso e comandando o submundo com estilo! 🎩🔫"
    },
    
    circus: {
      // Circo: ROSTO 100% IDÉNTICO, 12+ PROFISSÕES circenses com ALTA VARIEDADE
      prompt: `Circus performer transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: circus costume, pose, props, background. Randomly choose ONE circus profession with vibrant details: Acrobat (colorful sequined leotard, mid-air flip or handstand pose, juggling colorful balls/clubs/rings, circus tent background with spotlights, dynamic action), Trapeze Artist (sparkly aerial costume with flowing fabric, hanging from trapeze bar, dramatic mid-swing pose, high above circus ring, safety net visible, graceful movement), Clown (colorful oversized costume with polka dots/stripes, red nose, oversized shoes, playful pose with balloons/flowers/props, circus ring with audience, joyful expression), Magician (elegant tuxedo with flowing cape and top hat, pulling rabbit from hat or performing card tricks, mysterious pose, stage with magic props/curtains/illusions), Ringmaster (red tailcoat with gold buttons, top hat, holding whip and megaphone, commanding authoritative pose, center of circus ring with audience silhouettes), Tightrope Walker (elegant costume with balance pole, walking on rope high above ground, focused concentrated expression, circus tent interior with dramatic lighting), Fire Breather (exotic costume with tribal patterns, breathing fire dramatically, intense action pose, dark background with flames illuminating face, dangerous performance), Strongman (striped tank top, handlebar mustache, lifting heavy barbell/dumbbells/weights, flexing muscles powerful pose, vintage circus poster style background), Contortionist (flexible impossible pose in colorful bodysuit, bending in extreme contortion, circus stage with dramatic lighting, amazement expression), Juggler (bright colorful costume, juggling multiple objects (pins/rings/balls/torches), dynamic action pose, circus tent with audience, focused concentration), Lion Tamer (safari-style costume with boots and whip, confident commanding pose, circus ring with vintage circus cage silhouette, no real animals, authoritative stance), Equilibrist (balancing on large ball or unicycle, colorful costume, arms spread for balance, circus ring with spotlights, focused expression), Sword Swallower (exotic costume, performing sword swallowing act, dramatic intense pose, circus stage with dramatic lighting, fearless expression), Cannon Performer (colorful costume, being shot from cannon mid-air, dynamic action pose, circus tent background, thrilling moment), Stilt Walker (tall colorful costume on wooden stilts, walking above crowd, waving to audience, circus parade background, towering presence), Aerial Silk Performer (flowing silk ribbons, suspended mid-air in graceful pose, wrapped in colorful silks, circus tent with dramatic lighting, ethereal movement). CRITICAL: Vibrant circus colors (red, yellow, blue, gold, purple, green), striped circus tent background or circus ring, dramatic theatrical lighting with spotlights and colored lights. Vary pose dramatically (action mid-performance / triumphant bow / dramatic entrance / focused concentration / playful expression). Vary camera angle (low angle heroic / side action shot / front spotlight portrait / wide establishing shot). Theatrical realistic photo style with authentic circus atmosphere. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "Você é um artista de circo! Talentoso, colorido e pronto para encantar a plateia sob a lona do picadeiro! 🎪✨"
    },
    
    natal: {
      // Natal: ROSTO 100% VISÍVEL, cenários cotidianos realistas e bem-humorados
      prompt: `Christmas transformation. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. FACE MUST BE FULLY VISIBLE - NO heavy beards covering face, NO masks. DO NOT modify face. ONLY change: light accessories, clothing, pose, background. Randomly choose ONE realistic Christmas scenario: Reindeer Sleigh Rider (simple reindeer antler headband ONLY - keeps face 100% visible, festive sweater or light scarf, riding sleigh with animated reindeer galloping through snowy city street with traffic lights and buildings, joyful amazed expression, realistic winter urban scene), Christmas Shopping (Santa hat or simple headband - face fully visible, winter coat with shopping bags, walking through busy decorated shopping street or mall, excited happy expression, realistic holiday shopping chaos), Delivering Gifts (simple helper outfit, no face-covering, carrying stack of gift boxes, walking through snowy neighborhood or apartment building, friendly smile, realistic delivery scenario), Christmas Tree Decorator (casual Christmas sweater, simple Santa hat - face visible, standing on ladder decorating huge Christmas tree, concentrated joyful expression, realistic living room or city plaza), Festive Cooking (Christmas apron over casual clothes, simple reindeer ears headband - face fully visible, in warm kitchen preparing Christmas feast with pots and pans, happy expression, realistic kitchen with food), Sleigh Ride Adventure (sitting in magical sleigh being pulled by galloping reindeer through snowy city streets, simple Christmas outfit, face fully visible and excited, realistic winter urban landscape with snow and lights), Christmas Caroling (winter clothes with light scarf, holding candles or songbooks, singing in front of decorated house, cheerful expression, realistic neighborhood setting), Snowball Fight (winter clothes with Christmas colors, mid-action throwing snowball, playful laughing expression, snowy park with people, realistic winter fun), Gift Opening Excitement (cozy Christmas sweater, simple Santa hat - face visible, surrounded by gift boxes and wrapping paper, excited joyful expression, realistic living room with tree), Reindeer Encounter (standing next to real-looking reindeer in snowy plaza, simple antler headband - face fully visible, amazed delighted expression, realistic winter setting with snow). CRITICAL: FACE ALWAYS FULLY VISIBLE AND RECOGNIZABLE. Use only light accessories (hats, headbands, scarves) that do not cover face. VARY BACKGROUNDS DRAMATICALLY (city streets, shopping malls, homes, parks, neighborhoods, plazas, forests, snowy landscapes, decorated buildings, markets, cafes, offices, schools, churches). Realistic everyday settings mixed with Christmas magic. Joyful, happy, cheerful, well-humored expressions. Warm festive lighting. Photorealistic style with Christmas joy and humor. Random seed: ${randomSeed}, variation: ${randomVariation}`,
      text: "🎄 Você é o espírito do Natal! Espalhe alegria e magia natalina por onde passar! 🎅✨"
    },
    
    reveillon: {
      prompt: "",
      text: ""
    }
  };

  // Para Réveillon, usar prompts aleatórios
  let promptData = themePrompts[theme];
  let { prompt, text } = promptData;
  if (theme === "reveillon") {
    const reveilonData = getRandomReveilonPrompt(randomSeed, randomVariation);
    prompt = reveilonData.prompt;
    text = reveilonData.text;
  }
  
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
 * Gerar imagem em alta resolução (HD 300 DPI ou 4K 600 DPI)
 * Usa upscaling com IA para melhorar qualidade da imagem original
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

    const { storagePut } = await import("./storage");
    const { url: s3Url } = await storagePut(fileKey, Buffer.from(buffer), "image/jpeg");

    return { url: s3Url, key: fileKey };
  } catch (error) {
    console.error("[Generation] Failed to generate high-resolution image:", error);
    throw new Error("Falha ao gerar imagem em alta resolução");
  }
}
