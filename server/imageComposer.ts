import sharp from "sharp";
import { storagePut } from "./storage";
import path from "path";
import fs from "fs";

// Caminhos dos assets
const ASSETS_DIR = path.join(process.cwd(), "server/assets");
const LOGO_PATH = path.join(process.cwd(), "client/public/espelho-ai-logo.png");
const TEXT_ESPELHO_PATH = path.join(ASSETS_DIR, "text-espelho-ai.png");
const TEXT_LINK_PATH = path.join(ASSETS_DIR, "text-link.png");
const TEXT_ANTES_PATH = path.join(ASSETS_DIR, "text-antes.png");
const TEXT_DEPOIS_PATH = path.join(ASSETS_DIR, "text-depois.png");

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
    const footerHeight = 80;  // Barra inferior com logo e link (aumentada)
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

    // Preparar logo redimensionado (DOBRADO - 100px)
    let logoBuffer: Buffer | null = null;
    const logoSize = 100; // Dobrado de 50 para 100
    try {
      if (fs.existsSync(LOGO_PATH)) {
        logoBuffer = await sharp(LOGO_PATH)
          .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        console.log("[ImageComposer] Logo loaded and resized to", logoSize);
      } else {
        console.log("[ImageComposer] Logo not found at:", LOGO_PATH);
      }
    } catch (logoError) {
      console.log("[ImageComposer] Could not load logo:", logoError);
    }

    // Carregar textos pré-renderizados
    let textAntesBuffer: Buffer | null = null;
    let textDepoisBuffer: Buffer | null = null;
    let textEspelhoBuffer: Buffer | null = null;
    let textLinkBuffer: Buffer | null = null;

    try {
      if (fs.existsSync(TEXT_ANTES_PATH)) {
        textAntesBuffer = await sharp(TEXT_ANTES_PATH).png().toBuffer();
      }
      if (fs.existsSync(TEXT_DEPOIS_PATH)) {
        textDepoisBuffer = await sharp(TEXT_DEPOIS_PATH).png().toBuffer();
      }
      if (fs.existsSync(TEXT_ESPELHO_PATH)) {
        textEspelhoBuffer = await sharp(TEXT_ESPELHO_PATH).png().toBuffer();
      }
      if (fs.existsSync(TEXT_LINK_PATH)) {
        textLinkBuffer = await sharp(TEXT_LINK_PATH).png().toBuffer();
      }
      console.log("[ImageComposer] Text images loaded");
    } catch (textError) {
      console.log("[ImageComposer] Could not load text images:", textError);
    }

    // Criar barra de header (fundo escuro)
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

    // Criar barra de footer com cor laranja
    const footerBuffer = await sharp({
      create: {
        width: totalWidth,
        height: footerHeight,
        channels: 4,
        background: { r: 249, g: 115, b: 22, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    // Montar composição
    const compositeOperations: sharp.OverlayOptions[] = [
      // Header (fundo)
      { input: headerBuffer, top: 0, left: 0 },
      // Imagem original (esquerda)
      { input: resizedOriginal, top: headerHeight, left: 0 },
      // Imagem transformada (direita)
      { input: resizedTransformed, top: headerHeight, left: targetWidth + gap },
      // Footer (fundo laranja)
      { input: footerBuffer, top: headerHeight + targetHeight, left: 0 },
    ];

    // Adicionar texto ANTES se disponível
    if (textAntesBuffer) {
      compositeOperations.push({
        input: textAntesBuffer,
        top: 0,
        left: Math.floor(targetWidth / 2 - 100), // Centralizado na metade esquerda
      });
    }

    // Adicionar texto DEPOIS se disponível
    if (textDepoisBuffer) {
      compositeOperations.push({
        input: textDepoisBuffer,
        top: 0,
        left: targetWidth + gap + Math.floor(targetWidth / 2 - 100), // Centralizado na metade direita
      });
    }

    // Adicionar logo se disponível (posição ajustada para logo maior)
    if (logoBuffer) {
      compositeOperations.push({
        input: logoBuffer,
        top: headerHeight + targetHeight - 10, // Posição vertical ajustada
        left: 10,
      });
    }

    // Adicionar texto ESPELHO AI se disponível
    if (textEspelhoBuffer) {
      compositeOperations.push({
        input: textEspelhoBuffer,
        top: headerHeight + targetHeight + 20,
        left: logoBuffer ? 120 : 20, // Ajustado para logo maior
      });
    }

    // Adicionar link se disponível
    if (textLinkBuffer) {
      compositeOperations.push({
        input: textLinkBuffer,
        top: headerHeight + targetHeight + 25,
        left: totalWidth - 370,
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

    const watermarkHeight = 80; // Aumentado para acomodar logo maior

    // Preparar logo redimensionado (DOBRADO - 90px)
    let logoBuffer: Buffer | null = null;
    const logoSize = 90; // Dobrado
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

    // Carregar textos pré-renderizados
    let textEspelhoBuffer: Buffer | null = null;
    let textLinkBuffer: Buffer | null = null;

    try {
      if (fs.existsSync(TEXT_ESPELHO_PATH)) {
        textEspelhoBuffer = await sharp(TEXT_ESPELHO_PATH).png().toBuffer();
      }
      if (fs.existsSync(TEXT_LINK_PATH)) {
        textLinkBuffer = await sharp(TEXT_LINK_PATH).png().toBuffer();
      }
    } catch (textError) {
      console.log("[Watermark] Could not load text images:", textError);
    }

    // Criar barra de footer com cor laranja
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

    // Montar composição
    const compositeOperations: sharp.OverlayOptions[] = [
      { input: footerBuffer, top: height, left: 0 },
    ];

    // Adicionar logo se disponível
    if (logoBuffer) {
      compositeOperations.push({
        input: logoBuffer,
        top: height - 5,
        left: 5,
      });
    }

    // Adicionar texto ESPELHO AI se disponível
    if (textEspelhoBuffer) {
      compositeOperations.push({
        input: textEspelhoBuffer,
        top: height + 15,
        left: logoBuffer ? 100 : 15,
      });
    }

    // Adicionar link se disponível
    if (textLinkBuffer) {
      compositeOperations.push({
        input: textLinkBuffer,
        top: height + 20,
        left: width - 360,
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
