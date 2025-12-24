import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'server/assets');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar imagem do texto "ESPELHO AI"
async function generateBrandText() {
  const width = 300;
  const height = 60;
  
  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&amp;display=swap');
      </style>
      <text x="0" y="45" font-family="Roboto, Arial, Helvetica, sans-serif" font-size="36" font-weight="bold" fill="white">ESPELHO AI</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'text-espelho-ai.png'));
  
  console.log('Generated: text-espelho-ai.png');
}

// Gerar imagem do link
async function generateLinkText() {
  const width = 350;
  const height = 50;
  
  const svg = `
    <svg width="${width}" height="${height}">
      <text x="0" y="35" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="white">www.espelhoai.com.br</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outputDir, 'text-link.png'));
  
  console.log('Generated: text-link.png');
}

// Gerar textos ANTES e DEPOIS
async function generateHeaderTexts() {
  const width = 200;
  const height = 50;
  
  // ANTES
  const svgAntes = `
    <svg width="${width}" height="${height}">
      <text x="100" y="38" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="white">ANTES</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svgAntes))
    .png()
    .toFile(path.join(outputDir, 'text-antes.png'));
  
  console.log('Generated: text-antes.png');
  
  // DEPOIS
  const svgDepois = `
    <svg width="${width}" height="${height}">
      <text x="100" y="38" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="white">DEPOIS</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svgDepois))
    .png()
    .toFile(path.join(outputDir, 'text-depois.png'));
  
  console.log('Generated: text-depois.png');
}

async function main() {
  try {
    await generateBrandText();
    await generateLinkText();
    await generateHeaderTexts();
    console.log('All text images generated successfully!');
  } catch (error) {
    console.error('Error generating text images:', error);
  }
}

main();
