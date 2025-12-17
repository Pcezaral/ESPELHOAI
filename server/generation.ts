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
  theme: "animals" | "monster" | "art" | "gender" | "epic" | "gangster" | "circus" | "natal" | "reveillon" | "beach",
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
      
      FACE PRESERVATION IS PARAMOUNT: The person's face must be COMPLETELY RECOGNIZABLE - same exact eyes (shape, color, size, spacing), same exact nose (shape, size, position), same exact mouth (shape, lips, smile/expression), same exact facial bone structure, same exact skin tone, same exact expression and emotion. The face should look like a PHOTO of the person with animal features ADDED AROUND IT, not a transformation OF the face.
      
      WHAT TO ADD (around the face, NOT replacing it): Fluffy fur around the face edges, cute animal ears on top of head, whiskers on cheeks (thin, not covering face), small animal nose tip overlay (transparent, showing original nose), tail behind body, paws instead of hands.
      
      Randomly choose ONE animal style: fluffy cat (soft fur frame, cat ears, thin whiskers), playful dog (floppy ears, friendly fur frame), wise owl (feathered frame, big expressive eyes keeping original eye color), gentle deer (soft fur, small antlers headband style), curious fox (orange fur frame, pointed ears), cuddly bear (round ears, soft brown fur frame), happy bunny (long floppy ears, fluffy white fur frame), colorful parrot (feather frame around face, keeping face visible), sleepy koala (gray fur frame, round ears), energetic squirrel (bushy tail, alert ears).
      
      CRITICAL: The ORIGINAL EXPRESSION must be visible - if person is smiling, animal version smiles the same way. If person has a specific look in their eyes, that look must be preserved. Face is the STAR, animal features are ACCESSORIES.
      
      Vary pose naturally (sitting / standing / playful / resting). Soft lighting, vibrant but natural colors. Cute style that highlights the person's real face with animal accessories. Random seed: ${randomSeed}`,
      text: "Você é um bichinho encantador! Suas características se transformaram em um animal adorável que mantém sua essência única! 🐾"
    },
    
    monster: {
      // Monstro: ROSTO RECONHECÍVEL mesmo como monstro
      prompt: `Cute monster portrait transformation. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces identical; if 3 people, output MUST have 3 people with ALL 3 faces identical. PRESERVE EACH INDIVIDUAL FACE: Maintain RECOGNIZABLE facial features for EVERY person - same eye shape, eye color, facial proportions, expression, smile/frown pattern must be identifiable. DO NOT create generic monster, DO NOT lose person's identity. ONLY change: add monster features (horns, colorful skin, playful details). Randomly vary monster style: skin color (pink / purple / turquoise / mint / coral / lavender / peach), horn style (small curved / tiny straight / mini spiral / cute nubs), accessory (bow / hat / glasses / flower / star), pattern (spots / stripes / sparkles / swirls). CRITICAL: Face structure must look like the person AS a monster, not a random creature. Keep same eye spacing, nose position, mouth shape, facial bone structure. Vary pose naturally (friendly wave / playful stance / cute sitting / happy jumping). Soft lighting, vibrant cheerful colors. Adorable cartoon style with facial recognition. Random seed: ${randomSeed}`,
      text: "Você é um monstrinho adorável! Mantendo seus traços únicos, você seria uma criatura fofa e divertida que conquista todos ao redor! 👾"
    },
    
    art: {
      // Pintura: ROSTO IDÊNTICO, estilos de ARTISTAS FAMOSOS com INTEGRAÇÃO PERFEITA de fundo
      prompt: `Famous artist painting style portrait. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same features, expression, age, skin tone.
      
      CRITICAL FOR QUALITY: The person must be SEAMLESSLY INTEGRATED into the painting style - same brushstroke technique on face AND background, same color palette throughout, same artistic texture everywhere. NO photorealistic face on painted background - the ENTIRE image must look like ONE cohesive painting by the artist.
      
      Randomly choose ONE famous artist style with FULL INTEGRATION:
      
      VAN GOGH (person painted with Van Gogh's signature swirling brushstrokes, thick impasto texture on face and clothes, vibrant blues and yellows, background options: Starry Night swirling sky / Sunflower field / Café terrace at night / Wheat field with cypresses / Bedroom in Arles - person is PART of the painting, same brushwork everywhere),
      
      PICASSO (person in Picasso's distinctive style, choose period: Blue Period with melancholic blues and greens / Rose Period with warm pinks and earth tones / Cubist with geometric fragmented perspective showing multiple angles / African Period with mask-like features - face stylized but RECOGNIZABLE, background matches period),
      
      MONET (person painted with soft Impressionist dappled brushstrokes, pastel colors, light filtering through, backgrounds: Water Lilies garden / Japanese bridge / Poppy field / Cathedral facade / Haystacks at sunset - dreamy atmospheric quality throughout),
      
      REMBRANDT (dramatic chiaroscuro lighting, rich browns and golds, Dutch Golden Age style, face emerging from dark background with spotlight effect, period costume, intimate portrait feeling),
      
      FRIDA KAHLO (bold vibrant Mexican colors, folk art elements, elaborate floral headpiece, tropical jungle background with monkeys and parrots, symbolic surreal elements, unibrow optional, intense gaze),
      
      GUSTAV KLIMT (gold leaf patterns, ornate geometric decorations, The Kiss style embrace, Byzantine mosaic influence, golden spirals and shapes, Art Nouveau elegance, decorative flat background),
      
      SALVADOR DALÍ (surrealist dreamscape, melting clocks, impossible architecture, desert landscape, hyper-realistic face with surreal elements around, elephants on stilts, floating objects),
      
      ANDY WARHOL (Pop Art style, bright neon colors - pink/yellow/blue/green, screen print effect, bold outlines, repeated portrait grid optional, celebrity glamour aesthetic, flat color blocks),
      
      BOTTICELLI (Renaissance beauty, flowing golden hair, Birth of Venus style, soft pastel colors, shell and flowers, ethereal feminine beauty, Italian Renaissance landscape background),
      
      VERMEER (Girl with Pearl Earring style, soft natural light from side window, Dutch interior, turban or headscarf, intimate domestic scene, photorealistic but painterly).
      
      CRITICAL: The painting must look like it was ENTIRELY created by the artist - unified style from edge to edge. Artistic texture visible throughout. Random seed: ${randomSeed}`,
      text: "Você é uma obra de arte! Seus traços se transformaram em um estilo artístico único! 🎨"
    },
    
    gender: {
      // Gênero: ROSTO 100% IDÊNTICO, cenários do DIA-A-DIA com HUMOR
      prompt: `Gender swap portrait transformation - EVERYDAY LIFE SCENARIOS WITH HUMOR. CRITICAL RULE: Keep EXACT same number of people - if 2 people in input, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Each person's face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face, DO NOT exaggerate features, DO NOT create caricature, NOT a drag queen or exaggerated character.
      
      ONLY change: hairstyle appropriate for opposite gender, everyday clothing, natural pose, realistic background.
      
      Randomly choose ONE EVERYDAY SCENARIO with HUMOR:
      
      OFFICE WORKER (business casual outfit, sitting at desk with computer, coffee mug, office background with coworkers, funny expression like "Monday morning" face, messy desk, post-it notes everywhere),
      
      SUPERMARKET SHOPPER (casual clothes, pushing shopping cart, comparing products with confused expression, supermarket aisle background, holding two similar products looking puzzled, overflowing cart),
      
      STUCK IN TRAFFIC (driving car, frustrated expression, honking, traffic jam visible through windshield, coffee in hand, late for work expression, messy hair),
      
      COOKING DISASTER (kitchen background, apron, smoke coming from pan, surprised/worried expression, fire extinguisher nearby, burnt food, recipe book open),
      
      GYM STRUGGLE (workout clothes, gym background, exhausted expression on treadmill, sweaty, looking at fit people exercising easily nearby, holding tiny weights),
      
      PARENT CHAOS (casual home clothes, living room with toys everywhere, baby/toddler chaos, tired but loving expression, juice spilled, cartoon on TV),
      
      COFFEE ADDICT (holding giant coffee cup, sleepy morning expression, pajamas or robe, messy hair, kitchen background, multiple empty coffee cups),
      
      ZOOM CALL (professional top but pajama bottom visible, laptop screen, home office background, trying to look professional while chaos happens behind),
      
      WAITING ROOM (sitting in doctor/dentist waiting room, nervous expression, reading old magazine, clock on wall, other patients),
      
      PUBLIC TRANSPORT (crowded bus/metro, standing holding rail, tired expression, headphones, surrounded by other commuters, rush hour).
      
      CRITICAL: Natural everyday appearance - NOT glamorous, NOT drag, NOT exaggerated. Regular person in regular situations with HUMOR. Realistic photo style with comedic timing. Random seed: ${randomSeed}`,
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
      // Réveillon: ROSTO 100% IDÊNTICO, celebração de ano novo - ACESSÍVEL E FAMILIAR
      // VARIEDADE de cenários: churrasco, família, ceia, praia, iate - SEMPRE com 2026 e fogos
      prompt: `New Year's Eve 2026 transformation - ACCESSIBLE AND FAMILY CELEBRATIONS. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, pose, props, background.
      
      MANDATORY ELEMENTS IN ALL SCENARIOS: "2026" visible prominently (in fireworks, decorations, balloons, or signs), spectacular colorful fireworks in background, white or light-colored clothing (Brazilian tradition).
      
      Randomly choose ONE New Year scenario with HIGH VARIETY:
      
      BACKYARD BBQ PARTY (white casual clothes, Brazilian churrasco/barbecue setting, friends and family around, meat on grill, cold beer and drinks, string lights, backyard decorations, "2026" balloons, fireworks visible in night sky, relaxed happy atmosphere, plastic chairs and tables),
      
      FAMILY DINNER TABLE (white elegant but casual outfit, large family dinner table with traditional Brazilian ceia, lentils for luck, grapes, champagne glasses raised for toast, dining room decorated with "2026" banner, fireworks visible through window, multi-generational family),
      
      COPACABANA BEACH (white flowing clothes, barefoot on sand, Rio de Janeiro beach at night, SPECTACULAR fireworks over ocean with "2026", Copacabana promenade, crowd celebrating, tropical festive atmosphere),
      
      ROOFTOP WITH FRIENDS (white party outfit, apartment rooftop, city skyline, fireworks spelling "2026" in background, string lights, friends toasting, DJ playing, dancing, urban celebration),
      
      YACHT PARTY (white nautical outfit, yacht deck, fireworks over water with "2026" visible, champagne, ocean reflecting colorful lights, glamorous but fun atmosphere),
      
      COUNTRYSIDE CELEBRATION (white linen clothes, farm or sítio setting, bonfire, friends and family, rustic tables with food, fireworks over hills with "2026", stars visible, peaceful celebration),
      
      POOL PARTY (white swimwear cover-up, pool with floating lights, tropical setting, palm trees, fireworks in sky with "2026", cocktails, friends in pool, summer night party),
      
      STREET PARTY (white casual outfit, neighborhood street party, tables on street, neighbors celebrating together, homemade decorations, "2026" banner across street, fireworks overhead, community celebration).
      
      CRITICAL: White/light clothing is MANDATORY (Brazilian tradition). MUST include "2026" prominently and fireworks. Mix of accessible everyday celebrations AND glamorous options. Vary pose (toasting / hugging / dancing / laughing / arms raised). Night lighting with fireworks glow. Photorealistic celebratory style with JOY and WARMTH. Random seed: ${randomSeed}`,
      text: "🎆 Você está pronto para o Réveillon 2026! Celebre com quem você ama! 🍾✨"
    },
    
    beach: {
      // Praia 2026: ROSTO 100% IDÊNTICO, cenas divertidas e bem-humoradas em praias brasileiras
      prompt: `Brazilian beach fun transformation 2026. CRITICAL RULE: Keep EXACT same number of people - if 1 person in input, output MUST have 1 person; if 2 people, output MUST have 2 people with BOTH faces pixel-perfect identical; if 3 people, output MUST have 3 people with ALL 3 faces pixel-perfect identical. PRESERVE EACH INDIVIDUAL FACE: Face must be PIXEL-PERFECT IDENTICAL - same eyes, nose, mouth, expression, age, skin tone, facial structure. DO NOT modify face. ONLY change: costume, pose, props, background.
      
      REALISTIC APPEARANCE: Generate REALISTIC, NATURAL-LOOKING people - NOT plastic, NOT perfect, NOT AI-generated looking. Include natural skin texture, pores, freckles, minor imperfections, realistic beach lighting with sun shadows. NATURAL EXPRESSIONS: Use genuine, natural expressions - joyful, playful, relaxed, funny.
      
      Randomly choose ONE hilarious beach scenario with BRAZILIAN VIBES:
      
      SURFING FUN (colorful board shorts or bikini, riding a wave with funny expression, Copacabana or Ipanema beach background, Christ the Redeemer visible in distance, dramatic surf moment, water splashing, sunset golden light),
      
      BURIED IN SAND (person buried in sand with only head visible, funny expression, friends building sand castle around them, Brazilian beach umbrellas, vendors passing by, hilarious helpless pose),
      
      EATING BEACH CHICKEN (holding roasted chicken leg with both hands, messy eating, beach chair, cooler with drinks, typical Brazilian beach setup, Biscoito Globo bag visible, satisfied expression),
      
      DRINKING MATE TEA (holding traditional mate tea cup with bombilla straw, beach towel, Santos or Porto Alegre beach style, relaxed pose, sun hat, reading magazine, chill vibes),
      
      FRESCOBOL PLAYERS (playing beach paddle ball, athletic pose mid-swing, colorful swimwear, Ipanema beach, fit beach body, action shot with ball in air),
      
      BEACH VENDOR STYLE (dressed as typical Brazilian beach vendor, carrying cooler or tray, "Mate! Água de coco!" pose, walking on sand, funny sales expression, beach crowd background),
      
      COCONUT WATER MOMENT (drinking from fresh coconut with straw, beach kiosk background, Porto de Galinhas or Jericoacoara style, tropical paradise, palm trees, crystal clear water),
      
      AÇAÍ BOWL FEAST (holding giant açaí bowl with toppings, beach bar setting, Bahia or Florianópolis beach, healthy beach lifestyle, colorful fruit toppings, satisfied expression),
      
      BEACH SOCCER (playing futévol or beach soccer, action kick pose, Maracanã style goal posts on sand, Rio beach, athletic pose, sand flying, competitive fun),
      
      SUNBATHING FAIL (funny sunburn lines from weird tan, holding sunscreen too late, beach chair, umbrella shadow creating patterns, embarrassed funny expression),
      
      CAIPIRINHA TIME (holding caipirinha glass, beach bar counter, lime slices, ice, tropical cocktail vibes, Bahia beach bar, relaxed happy expression, sunset background),
      
      BEACH SELFIE (classic beach selfie pose, duck face or peace sign, colorful swimwear, crowded Brazilian beach background, summer 2026 vibes, fun group energy),
      
      WAVE CRASH (being hit by unexpected wave, surprised funny expression, water splashing everywhere, beach background, dramatic comedic moment, wet hair flying),
      
      HAMMOCK RELAX (lying in colorful hammock between palm trees, Nordeste beach style, Ceará or Alagoas, holding drink, ultimate relaxation pose, paradise setting),
      
      BEACH WORKOUT (doing funny beach exercise, running on sand, beach fitness class, Leblon beach, athletic pose, morning sun, healthy lifestyle).
      
      CRITICAL: Brazilian beach culture authenticity - include typical elements (Biscoito Globo, mate, canga towels, beach chairs, kiosks, vendors). Vary beaches (Rio: Copacabana, Ipanema, Leblon / Santos / Florianópolis / Porto de Galinhas / Jericoacoara / Morro de São Paulo / Arraial do Cabo). Summer 2026 atmosphere, vibrant colors, fun energy, Brazilian joy. Photorealistic style with humor. Random seed: ${randomSeed}`,
      text: "🏖️ Você e seus amigos na praia em 2026! Diversão, sol e muitas risadas no verão brasileiro! 🌴☀️"
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
