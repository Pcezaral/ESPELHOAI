import sharp from 'sharp';

/**
 * Add watermark to image with app branding
 * Watermark is placed at bottom-right corner with semi-transparent background
 */
export async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Create watermark SVG
    const watermarkSvg = `
      <svg width="300" height="80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="80" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="150" y="50" font-size="32" font-weight="bold" fill="url(#grad)" text-anchor="middle" font-family="Arial, sans-serif">
          ESPELHO AI
        </text>
        <text x="150" y="70" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial, sans-serif">
          Descubra seu verdadeiro eu!
        </text>
      </svg>
    `;

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // Create watermark with proper sizing
    const watermarkBuffer = Buffer.from(watermarkSvg);
    const watermarkImage = await sharp(watermarkBuffer)
      .resize(Math.floor(width * 0.3), Math.floor(height * 0.1), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Composite watermark at bottom-right
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkImage,
          gravity: 'southeast'
        }
      ])
      .toBuffer();

    return watermarkedImage;
  } catch (error) {
    console.error('Error adding watermark:', error);
    // Return original image if watermarking fails
    return imageBuffer;
  }
}
