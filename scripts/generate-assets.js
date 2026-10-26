import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateAssets() {
  console.log("Generating public PWA icons and OG banner assets...");

  // 1. Generate banner.jpg (1200x630 for WhatsApp / OpenGraph)
  const bannerSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#0d3b66"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="1050" cy="120" r="180" fill="#3b82f6" opacity="0.15"/>
      <circle cx="150" cy="500" r="220" fill="#6366f1" opacity="0.15"/>
      
      <!-- Logo Icon Circle -->
      <circle cx="150" cy="315" r="70" fill="#2563eb" stroke="#ffffff" stroke-width="6"/>
      <text x="150" y="338" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#ffffff" text-anchor="middle">🏛️</text>
      
      <!-- Text -->
      <text x="260" y="240" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#ffffff">ఈ-వేదిక (E-Vedhika)</text>
      <text x="260" y="310" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#38bdf8">All Problems One Solution</text>
      <text x="260" y="385" font-family="Arial, sans-serif" font-size="22" font-weight="500" fill="#94a3b8">తెలంగాణ &amp; ఏపీ పంచాయతీ ఆపరేటర్ల డిజిటల్ పోర్టల్ | UBD, DSR &amp; Farmer Registry</text>
      
      <!-- Footer Badge -->
      <rect x="260" y="440" width="380" height="48" rx="24" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <text x="450" y="471" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">www.e-vedhika.in</text>
    </svg>
  `;

  await sharp(Buffer.from(bannerSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, "banner.jpg"));
  console.log("Generated public/banner.jpg");

  // 2. Generate PWA Icons (192x192, 512x512, ev-logo-v2.png, apple-touch-icon.png, favicon.png)
  const iconSvg = (size) => `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="iconbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d3b66"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#iconbg)"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.36}" fill="#2563eb" opacity="0.3"/>
      <text x="${size / 2}" y="${size * 0.62}" font-family="Arial, sans-serif" font-size="${size * 0.45}" font-weight="bold" fill="#ffffff" text-anchor="middle">🏛️</text>
    </svg>
  `;

  await sharp(Buffer.from(iconSvg(192)))
    .png()
    .toFile(path.join(publicDir, "pwa-192x192.png"));
  console.log("Generated public/pwa-192x192.png");

  await sharp(Buffer.from(iconSvg(512)))
    .png()
    .toFile(path.join(publicDir, "pwa-512x512.png"));
  console.log("Generated public/pwa-512x512.png");

  await sharp(Buffer.from(iconSvg(512)))
    .png()
    .toFile(path.join(publicDir, "ev-logo-v2.png"));
  console.log("Generated public/ev-logo-v2.png");

  await sharp(Buffer.from(iconSvg(180)))
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("Generated public/apple-touch-icon.png");

  await sharp(Buffer.from(iconSvg(64)))
    .png()
    .toFile(path.join(publicDir, "favicon.png"));
  console.log("Generated public/favicon.png");

  console.log("All asset files generated successfully!");
}

generateAssets().catch(err => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
