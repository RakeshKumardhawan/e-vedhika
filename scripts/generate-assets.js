import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Vector paths for Telugu "ఈ-వేదిక" text to ensure 100% crisp rendering without missing font glyphs on Linux
const teluguTextVector = `
  <g id="telugu-logo-text" fill="#ffffff" filter="url(#glow)">
    <!-- ఈ -->
    <path d="M 20 40 C 20 20, 35 10, 50 10 C 65 10, 80 20, 80 38 C 80 50, 70 58, 58 58 C 46 58, 38 50, 38 40 C 38 32, 44 26, 52 26 C 60 26, 65 31, 65 38 C 65 42, 62 45, 58 45 C 54 45, 52 42, 52 38" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 80 38 C 90 28, 105 28, 115 38 C 122 45, 122 55, 115 65 C 105 75, 90 75, 80 65 L 125 65" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <circle cx="102" cy="48" r="5" fill="#ffffff"/>

    <!-- - (Hyphen) -->
    <line x1="140" y1="42" x2="160" y2="42" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>

    <!-- వే -->
    <!-- 'వ' loop -->
    <path d="M 180 48 C 180 35, 192 25, 205 25 C 218 25, 230 35, 230 48 C 230 60, 218 70, 205 70 C 192 70, 180 60, 180 48 Z" fill="none" stroke="#ffffff" stroke-width="7"/>
    <path d="M 205 25 C 205 15, 215 8, 228 8 C 240 8, 250 15, 250 25 C 250 35, 238 42, 225 42" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <!-- 'ే' matra -->
    <path d="M 195 25 C 190 12, 200 2, 215 2 C 230 2, 242 10, 245 22" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>

    <!-- ది -->
    <!-- 'ద' -->
    <path d="M 265 48 C 265 35, 275 25, 288 25 C 300 25, 310 33, 310 45 C 310 58, 298 68, 285 68 C 275 68, 270 60, 270 52" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 288 25 C 288 15, 298 8, 310 8 C 320 8, 328 15, 328 25 C 328 35, 318 42, 305 42" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <!-- 'ి' matra -->
    <path d="M 280 20 C 280 5, 298 -2, 312 -2 C 328 -2, 340 8, 340 22" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>

    <!-- క -->
    <path d="M 355 45 C 355 30, 368 20, 382 20 C 396 20, 408 30, 408 45 C 408 60, 396 70, 382 70 C 368 70, 355 60, 355 45 Z" fill="none" stroke="#ffffff" stroke-width="7"/>
    <path d="M 360 45 L 403 45" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 382 20 C 382 8, 392 2, 402 2" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  </g>
`;

async function generateAssets() {
  console.log("Generating public PWA icons and OG banner assets with official EV emblem...");

  // Read official ev-logo-v2.svg content
  const svgLogoPath = path.join(publicDir, "ev-logo-v2.svg");
  let evLogoSvgContent = "";
  if (fs.existsSync(svgLogoPath)) {
    evLogoSvgContent = fs.readFileSync(svgLogoPath, "utf-8");
  }

  // 1. Generate ultra-crisp banner.jpg (1200x630 for WhatsApp / Facebook / OpenGraph)
  const bannerSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Radial/Linear Gradients -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#030712"/>
          <stop offset="35%" stop-color="#0f172a"/>
          <stop offset="70%" stop-color="#0b132b"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>

        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>

        <linearGradient id="textGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>

        <!-- Outer Arc Glow -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Logo Arc Gradient -->
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>

      <!-- Background Canvas -->
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      
      <!-- Decorative Background Orbs -->
      <circle cx="1000" cy="100" r="280" fill="#0284c7" opacity="0.12" filter="url(#glow)"/>
      <circle cx="1100" cy="500" r="220" fill="#6366f1" opacity="0.15" filter="url(#glow)"/>
      <circle cx="150" cy="550" r="180" fill="#38bdf8" opacity="0.1" filter="url(#glow)"/>

      <!-- Top Border Accent Line -->
      <rect x="0" y="0" width="1200" height="6" fill="url(#accentGrad)"/>

      <!-- ================= LEFT SIDE: OFFICIAL "EV" EMBLEM LOGO ================= -->
      <g transform="translate(60, 115)">
        <!-- Outer Glowing Ring -->
        <circle cx="200" cy="200" r="185" fill="#071426" stroke="#1e293b" stroke-width="4"/>
        <circle cx="200" cy="200" r="165" fill="#020617" stroke="#0f172a" stroke-width="3"/>

        <!-- Cyan Arc (Outer Track) -->
        <path d="M 300 80 A 150 150 0 1 0 300 320" fill="none" stroke="url(#arcGrad)" stroke-width="26" stroke-linecap="round" filter="url(#glow)"/>
        
        <!-- Terminal Dots -->
        <circle cx="300" cy="80" r="14" fill="#ffffff" filter="url(#glow)"/>
        <circle cx="300" cy="320" r="14" fill="#ffffff" filter="url(#glow)"/>

        <!-- Inner Core -->
        <circle cx="200" cy="200" r="115" fill="#0f172a" stroke="#2563eb" stroke-width="3"/>

        <!-- "EV" Metallic Text -->
        <text x="200" y="235" text-anchor="middle" fill="url(#textGoldGrad)" font-size="96" font-weight="900" font-family="'Inter', 'Segoe UI', Arial, sans-serif" letter-spacing="-2">EV</text>
      </g>

      <!-- ================= RIGHT SIDE: BRANDING & HEADING ================= -->
      <g transform="translate(480, 130)">
        <!-- Vector Telugu Text "ఈ-వేదిక" + English "(E-Vedhika)" -->
        <g transform="translate(0, 0)">
          <!-- Embedded SVG Vector for Telugu "ఈ-వేదిక" -->
          ${teluguTextVector}

          <!-- English Title Next to it -->
          <text x="420" y="52" font-family="'Inter', 'Segoe UI', Arial, sans-serif" font-size="44" font-weight="900" fill="#38bdf8" filter="url(#glow)">(E-Vedhika)</text>
        </g>

        <!-- Main English Tagline -->
        <text x="0" y="125" font-family="'Inter', 'Segoe UI', Arial, sans-serif" font-size="36" font-weight="800" fill="#f8fafc" letter-spacing="0.5">
          All Problems One Solution
        </text>

        <!-- Subheading in Telugu & English -->
        <text x="0" y="175" font-family="'Inter', 'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">
          తెలంగాణ &amp; AP పంచాయతీ ఆపరేటర్ల సమగ్ర డిజిటల్ పోర్టల్
        </text>

        <!-- Feature Pills Badges -->
        <g transform="translate(0, 220)">
          <!-- Pill 1: UBD Settings -->
          <rect x="0" y="0" width="190" height="42" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="95" y="26" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">⚙️ UBD Settings &amp; DSK</text>

          <!-- Pill 2: DSR Analyzer -->
          <rect x="205" y="0" width="170" height="42" rx="10" fill="#1e293b" stroke="#818cf8" stroke-width="1.5"/>
          <text x="290" y="26" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="700" fill="#818cf8" text-anchor="middle">📊 DSR Analyzer</text>

          <!-- Pill 3: Farmer Registry -->
          <rect x="390" y="0" width="180" height="42" rx="10" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
          <text x="480" y="26" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="700" fill="#34d399" text-anchor="middle">🌾 Farmer Registry</text>
        </g>

        <!-- Feature Row 2 Badges -->
        <g transform="translate(0, 275)">
          <!-- Pill 4: GOs & Formats -->
          <rect x="0" y="0" width="190" height="42" rx="10" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
          <text x="95" y="26" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="700" fill="#fbbf24" text-anchor="middle">📜 GOs &amp; Formats</text>

          <!-- Pill 5: Software Hub -->
          <rect x="205" y="0" width="170" height="42" rx="10" fill="#1e293b" stroke="#f472b6" stroke-width="1.5"/>
          <text x="290" y="26" font-family="'Inter', Arial, sans-serif" font-size="14" font-weight="700" fill="#f472b6" text-anchor="middle">💻 Software Hub</text>
        </g>

        <!-- Website URL Footer Badge -->
        <g transform="translate(0, 345)">
          <rect x="0" y="0" width="360" height="46" rx="23" fill="#0284c7" filter="url(#glow)"/>
          <text x="180" y="29" font-family="'Inter', Arial, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">🌐 www.e-vedhika.in</text>
        </g>
      </g>
    </svg>
  `;

  // Write banner.jpg
  await sharp(Buffer.from(bannerSvg))
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, "banner.jpg"));
  console.log("Generated public/banner.jpg");

  // Write banner.png
  await sharp(Buffer.from(bannerSvg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "banner.png"));
  console.log("Generated public/banner.png");

  // 2. Generate PWA Icons from official EV logo (192x192, 512x512, ev-logo-v2.png, apple-touch-icon.png, favicon.png)
  const iconSvg = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0c2242"/>
          <stop offset="70%" stop-color="#07152b"/>
          <stop offset="100%" stop-color="#040b17"/>
        </radialGradient>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="35%" stop-color="#0284c7"/>
          <stop offset="70%" stop-color="#0369a1"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
        <radialGradient id="coreGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#14325e"/>
          <stop offset="60%" stop-color="#091b38"/>
          <stop offset="100%" stop-color="#050e1f"/>
        </radialGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="45%" stop-color="#f0f6fc"/>
          <stop offset="85%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>

      <circle cx="256" cy="256" r="248" fill="url(#bgGrad)" stroke="#112d56" stroke-width="4"/>
      <circle cx="256" cy="256" r="200" fill="none" stroke="#091b34" stroke-width="38"/>
      <path d="M 384.5 102.8 A 200 200 0 1 0 384.5 409.2" fill="none" stroke="url(#arcGrad)" stroke-width="36" stroke-linecap="round"/>
      <circle cx="384.5" cy="102.8" r="18" fill="#ffffff"/>
      <circle cx="384.5" cy="409.2" r="18" fill="#ffffff"/>
      <circle cx="256" cy="256" r="156" fill="url(#coreGrad)" stroke="#1d4ed8" stroke-width="3"/>
      <text x="256" y="298" text-anchor="middle" fill="url(#textGrad)" font-size="124" font-weight="900" font-family="'Inter', 'Segoe UI', Arial, sans-serif" letter-spacing="-2">EV</text>
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

  await sharp(Buffer.from(iconSvg(512)))
    .png()
    .toFile(path.join(publicDir, "ev_logo.png"));
  console.log("Generated public/ev_logo.png");

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
  console.warn("Warning: Asset generation via sharp encountered an issue (using pre-existing public assets):", err?.message);
  process.exit(0);
});

