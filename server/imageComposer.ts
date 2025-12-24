import sharp from "sharp";
import { storagePut } from "./storage";

/**
 * Combina duas imagens lado a lado com etiquetas "ANTES" e "DEPOIS"
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

    // Obter metadados das imagens
    const [originalMeta, transformedMeta] = await Promise.all([
      originalImage.metadata(),
      transformedImage.metadata(),
    ]);

    // Definir tamanho padrão para cada imagem (lado a lado)
    const targetWidth = 600;
    const targetHeight = 800;
    const labelHeight = 50;
    const gap = 10;
    const totalWidth = targetWidth * 2 + gap;
    const totalHeight = targetHeight + labelHeight;

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

    // Criar SVG para as etiquetas
    const labelSvg = `
      <svg width="${totalWidth}" height="${labelHeight}">
        <rect width="${totalWidth}" height="${labelHeight}" fill="#1a1a2e"/>
        <text x="${targetWidth / 2}" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">ANTES</text>
        <text x="${targetWidth + gap + targetWidth / 2}" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">DEPOIS</text>
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
        // Etiquetas no topo
        {
          input: Buffer.from(labelSvg),
          top: 0,
          left: 0,
        },
        // Imagem original (esquerda)
        {
          input: resizedOriginal,
          top: labelHeight,
          left: 0,
        },
        // Imagem transformada (direita)
        {
          input: resizedTransformed,
          top: labelHeight,
          left: targetWidth + gap,
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
