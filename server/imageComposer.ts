import sharp from "sharp";
import { storagePut } from "./storage";
import path from "path";
import fs from "fs";

// Caminho do logo
const LOGO_PATH = path.join(process.cwd(), "client/public/espelho-ai-logo.png");

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
    const footerHeight = 70;  // Barra inferior com logo e link
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

    // Preparar logo redimensionado
    let logoBuffer: Buffer | null = null;
    const logoSize = 50;
    try {
      if (fs.existsSync(LOGO_PATH)) {
        logoBuffer = await sharp(LOGO_PATH)
          .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        console.log("[ImageComposer] Logo loaded and resized");
      } else {
        console.log("[ImageComposer] Logo not found at:", LOGO_PATH);
      }
    } catch (logoError) {
      console.log("[ImageComposer] Could not load logo:", logoError);
    }

    // Criar barra de header (ANTES / DEPOIS) como imagem
    const headerBuffer = await sharp({
      create: {
        width: totalWidth,
        height: headerHeight,
        channels: 4,
        background: { r: 26, g: 26, b: 46, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    // Criar barra de footer com gradiente laranja/vermelho
    const footerBuffer = await sharp({
      create: {
        width: totalWidth,
        height: footerHeight,
        channels: 4,
        background: { r: 249, g: 115, b: 22, alpha: 1 }, // Laranja
      },
    })
      .png()
      .toBuffer();

    // Criar textos como SVG simples (sem emoji)
    const headerTextSvg = Buffer.from(`
      <svg width="${totalWidth}" height="${headerHeight}">
        <style>
          .header-text { font: bold 28px sans-serif; fill: white; }
        </style>
        <text x="${targetWidth / 2}" y="35" text-anchor="middle" class="header-text">ANTES</text>
        <text x="${targetWidth + gap + targetWidth / 2}" y="35" text-anchor="middle" class="header-text">DEPOIS</text>
      </svg>
    `);

    // Texto do footer (sem emoji - logo será adicionado como imagem)
    const footerTextSvg = Buffer.from(`
      <svg width="${totalWidth}" height="${footerHeight}">
        <style>
          .brand-text { font: bold 24px sans-serif; fill: white; }
          .link-text { font: 18px sans-serif; fill: white; }
        </style>
        <text x="${logoBuffer ? 70 : 30}" y="45" class="brand-text">ESPELHO AI</text>
        <text x="${totalWidth - 30}" y="45" text-anchor="end" class="link-text">www.espelhoai.com.br</text>
      </svg>
    `);

    // Montar composição
    const compositeOperations: sharp.OverlayOptions[] = [
      // Header
      { input: headerBuffer, top: 0, left: 0 },
      { input: headerTextSvg, top: 0, left: 0 },
      // Imagem original (esquerda)
      { input: resizedOriginal, top: headerHeight, left: 0 },
      // Imagem transformada (direita)
      { input: resizedTransformed, top: headerHeight, left: targetWidth + gap },
      // Footer
      { input: footerBuffer, top: headerHeight + targetHeight, left: 0 },
      { input: footerTextSvg, top: headerHeight + targetHeight, left: 0 },
    ];

    // Adicionar logo se disponível
    if (logoBuffer) {
      compositeOperations.push({
        input: logoBuffer,
        top: headerHeight + targetHeight + 10,
        left: 15,
      });
    }

    // Compor imagem final
    const composedImage = await sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 3,
        background: { r: 26, g: 26, b: 46 },
      },
    })
      .composite(compositeOperations)
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

    const watermarkHeight = 60;

    // Preparar logo redimensionado
    let logoBuffer: Buffer | null = null;
    const logoSize = 45;
    try {
      if (fs.existsSync(LOGO_PATH)) {
        logoBuffer = await sharp(LOGO_PATH)
          .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        console.log("[Watermark] Logo loaded");
      }
    } catch (logoError) {
      console.log("[Watermark] Could not load logo:", logoError);
    }

    // Criar barra de footer com gradiente laranja
    const footerBuffer = await sharp({
      create: {
        width: width,
        height: watermarkHeight,
        channels: 4,
        background: { r: 249, g: 115, b: 22, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    // Texto do footer (sem emoji)
    const footerTextSvg = Buffer.from(`
      <svg width="${width}" height="${watermarkHeight}">
        <style>
          .brand-text { font: bold 22px sans-serif; fill: white; }
          .link-text { font: 16px sans-serif; fill: white; }
        </style>
        <text x="${logoBuffer ? 60 : 20}" y="38" class="brand-text">ESPELHO AI</text>
        <text x="${width - 20}" y="38" text-anchor="end" class="link-text">www.espelhoai.com.br</text>
      </svg>
    `);

    // Montar composição
    const compositeOperations: sharp.OverlayOptions[] = [
      { input: footerBuffer, top: height, left: 0 },
      { input: footerTextSvg, top: height, left: 0 },
    ];

    // Adicionar logo se disponível
    if (logoBuffer) {
      compositeOperations.push({
        input: logoBuffer,
        top: height + 8,
        left: 10,
      });
    }

    // Compor imagem com marca d'água
    const watermarkedImage = await image
      .extend({
        bottom: watermarkHeight,
        background: { r: 249, g: 115, b: 22, alpha: 1 },
      })
      .composite(compositeOperations)
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
