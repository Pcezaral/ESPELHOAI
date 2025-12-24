import sharp from "sharp";
import { storagePut } from "./storage";

/**
 * Combina duas imagens lado a lado com etiquetas "ANTES" e "DEPOIS"
 * Adiciona logo do app e link do site na imagem
 * Usa sharp para processamento local - RÁPIDO e PRECISO (sem IA)
 */
export async function composeBeforeAfterImage(
  originalImageUrl: string,
  transformedImageUrl: string,
  userId: number
): Promise<{ url: string; key: string }> {
  console.log("[ImageComposer] Starting composition for user:", userId);
  console.log("[ImageComposer] Original URL:", originalImageUrl?.substring(0, 80));
  console.log("[ImageComposer] Transformed URL:", transformedImageUrl?.substring(0, 80));

  // Validar URLs
  if (!originalImageUrl || !transformedImageUrl) {
    throw new Error("URLs das imagens são obrigatórias");
  }

  try {
    // Baixar ambas as imagens em paralelo
    console.log("[ImageComposer] Downloading images...");
    const [originalResponse, transformedResponse] = await Promise.all([
      fetch(originalImageUrl),
      fetch(transformedImageUrl),
    ]);

    if (!originalResponse.ok) {
      throw new Error(`Falha ao baixar imagem original: ${originalResponse.status}`);
    }
    if (!transformedResponse.ok) {
      throw new Error(`Falha ao baixar imagem transformada: ${transformedResponse.status}`);
    }

    const [originalBuffer, transformedBuffer] = await Promise.all([
      originalResponse.arrayBuffer(),
      transformedResponse.arrayBuffer(),
    ]);

    console.log("[ImageComposer] Downloaded - Original:", originalBuffer.byteLength, "Transformed:", transformedBuffer.byteLength);

    // Processar imagens com sharp
    const originalImage = sharp(Buffer.from(originalBuffer));
    const transformedImage = sharp(Buffer.from(transformedBuffer));

    // Definir tamanho padrão para cada imagem (lado a lado)
    const targetWidth = 600;
    const targetHeight = 800;
    const headerHeight = 50;  // Barra superior com ANTES/DEPOIS
    const footerHeight = 60;  // Barra inferior com logo e link
    const gap = 10;
    const totalWidth = targetWidth * 2 + gap;
    const totalHeight = targetHeight + headerHeight + footerHeight;

    // Redimensionar imagens para tamanho uniforme
    const [resizedOriginal, resizedTransformed] = await Promise.all([
      originalImage
        .resize(targetWidth, targetHeight, { fit: "cover", position: "center" })
        .jpeg({ quality: 90 })
        .toBuffer(),
      transformedImage
        .resize(targetWidth, targetHeight, { fit: "cover", position: "center" })
        .jpeg({ quality: 90 })
        .toBuffer(),
    ]);

    console.log("[ImageComposer] Images resized");

    // Criar SVG para o header (ANTES / DEPOIS)
    const headerSvg = `
      <svg width="${totalWidth}" height="${headerHeight}">
        <rect width="${totalWidth}" height="${headerHeight}" fill="#1a1a2e"/>
        <text x="${targetWidth / 2}" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">ANTES</text>
        <text x="${targetWidth + gap + targetWidth / 2}" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">DEPOIS</text>
      </svg>
    `;

    // Criar SVG para o footer (Logo + Link)
    const footerSvg = `
      <svg width="${totalWidth}" height="${footerHeight}">
        <defs>
          <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${totalWidth}" height="${footerHeight}" fill="url(#footerGrad)"/>
        
        <!-- Logo emoji + texto -->
        <text x="30" y="40" font-family="Arial, sans-serif" font-size="32" fill="white">🦁</text>
        <text x="70" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white">ESPELHO AI</text>
        
        <!-- Link do site -->
        <text x="${totalWidth - 30}" y="38" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="end">www.espelhoai.com.br</text>
      </svg>
    `;

    // Compor imagem final
    const composedImage = await sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 3,
        background: { r: 26, g: 26, b: 46 }, // Fundo escuro (#1a1a2e)
      },
    })
      .composite([
        // Header no topo (ANTES / DEPOIS)
        {
          input: Buffer.from(headerSvg),
          top: 0,
          left: 0,
        },
        // Imagem original (esquerda)
        {
          input: resizedOriginal,
          top: headerHeight,
          left: 0,
        },
        // Imagem transformada (direita)
        {
          input: resizedTransformed,
          top: headerHeight,
          left: targetWidth + gap,
        },
        // Footer na parte inferior (Logo + Link)
        {
          input: Buffer.from(footerSvg),
          top: headerHeight + targetHeight,
          left: 0,
        },
      ])
      .jpeg({ quality: 92 })
      .toBuffer();

    console.log("[ImageComposer] Composition complete, size:", composedImage.byteLength);

    // Upload para S3
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `user-${userId}/before-after/${timestamp}-${randomSuffix}.jpg`;

    console.log("[ImageComposer] Uploading to S3:", fileKey);
    const { url: s3Url } = await storagePut(fileKey, composedImage, "image/jpeg");

    if (!s3Url) {
      throw new Error("Falha ao salvar imagem no servidor");
    }

    console.log("[ImageComposer] Success! URL:", s3Url?.substring(0, 80));
    return { url: s3Url, key: fileKey };

  } catch (error: any) {
    console.error("[ImageComposer] FAILED:", error?.message || error);
    throw new Error(error?.message || "Falha ao criar imagem Antes/Depois. Tente novamente.");
  }
}

/**
 * Adiciona marca d'água (logo + link) em uma imagem
 * Para uso no compartilhamento
 */
export async function addWatermarkToImage(
  imageUrl: string,
  userId: number
): Promise<{ url: string; key: string }> {
  console.log("[Watermark] Adding watermark for user:", userId);

  try {
    // Baixar imagem
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Falha ao baixar imagem: ${response.status}`);
    }
    const imageBuffer = await response.arrayBuffer();

    // Obter metadados da imagem
    const image = sharp(Buffer.from(imageBuffer));
    const metadata = await image.metadata();
    const width = metadata.width || 1024;
    const height = metadata.height || 1024;

    // Criar SVG para a marca d'água (canto inferior)
    const watermarkHeight = 50;
    const watermarkSvg = `
      <svg width="${width}" height="${watermarkHeight}">
        <defs>
          <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgba(249,115,22,0.9);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(239,68,68,0.9);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${watermarkHeight}" fill="url(#wmGrad)"/>
        
        <!-- Logo -->
        <text x="20" y="35" font-family="Arial, sans-serif" font-size="28" fill="white">🦁</text>
        <text x="55" y="33" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">ESPELHO AI</text>
        
        <!-- Link -->
        <text x="${width - 20}" y="33" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="end">www.espelhoai.com.br</text>
      </svg>
    `;

    // Compor imagem com marca d'água
    const watermarkedImage = await image
      .extend({
        bottom: watermarkHeight,
        background: { r: 249, g: 115, b: 22, alpha: 1 },
      })
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: height,
          left: 0,
        },
      ])
      .jpeg({ quality: 92 })
      .toBuffer();

    // Upload para S3
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `user-${userId}/shared/${timestamp}-${randomSuffix}.jpg`;

    const { url: s3Url } = await storagePut(fileKey, watermarkedImage, "image/jpeg");

    if (!s3Url) {
      throw new Error("Falha ao salvar imagem no servidor");
    }

    console.log("[Watermark] Success! URL:", s3Url?.substring(0, 80));
    return { url: s3Url, key: fileKey };

  } catch (error: any) {
    console.error("[Watermark] FAILED:", error?.message || error);
    throw new Error(error?.message || "Falha ao adicionar marca d'água. Tente novamente.");
  }
}
