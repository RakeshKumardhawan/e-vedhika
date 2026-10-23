import fs from "fs";
import path from "path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.resolve(rootDir, "public");
const distDir = path.resolve(rootDir, "dist");

// Load the SVG logo
const logoSvgPath = path.resolve(publicDir, "ev-logo-v2.svg");
let logoSvgContent = "";
if (fs.existsSync(logoSvgPath)) {
  logoSvgContent = fs.readFileSync(logoSvgPath, "utf-8");
}

// 1200x630 OpenGraph Banner SVG Template
// Uses English/transliterated text for 100% font rendering guarantee across all image renderers
const bannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#061329" />
      <stop offset="45%" stop-color="#0a1e3f" />
      <stop offset="85%" stop-color="#0f2b54" />
      <stop offset="100%" stop-color="#050e1c" />
    </linearGradient>

    <!-- Glowing Accent Circles -->
    <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
    </radialGradient>

    <!-- Metallic Title Gradient -->
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#f0f7ff" />
      <stop offset="100%" stop-color="#ba e6fd" />
    </linearGradient>

    <!-- Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbe947" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <!-- Badge Gradient -->
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>

    <!-- Drop Shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />

  <!-- Background Decorative Tech Grid Lines -->
  <g stroke="#1e3a8a" stroke-width="1" opacity="0.15">
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Ambient Light Spotlights -->
  <circle cx="280" cy="315" r="350" fill="url(#glowCyan)" />
  <circle cx="950" cy="200" r="300" fill="url(#glowGold)" />

  <!-- Left Side: Large Embedded Circular EV Logo Structure -->
  <g transform="translate(75, 115)">
    <!-- Outer Ring Glow -->
    <circle cx="200" cy="200" r="195" fill="none" stroke="#0284c7" stroke-width="2" opacity="0.4" />
    <circle cx="200" cy="200" r="185" fill="#081b38" stroke="#1d4ed8" stroke-width="4" filter="url(#shadow)" />
    
    <!-- Outer Track Groove -->
    <circle cx="200" cy="200" r="150" fill="none" stroke="#051329" stroke-width="28" />

    <!-- Cyan Arc -->
    <path d="M 300 80 A 150 150 0 1 0 300 320" fill="none" stroke="#38bdf8" stroke-width="26" stroke-linecap="round" />

    <!-- Glowing White Terminal Dots -->
    <circle cx="300" cy="80" r="13" fill="#ffffff" filter="url(#shadow)" />
    <circle cx="300" cy="80" r="7" fill="#38bdf8" />
    <circle cx="300" cy="320" r="13" fill="#ffffff" filter="url(#shadow)" />
    <circle cx="300" cy="320" r="7" fill="#38bdf8" />

    <!-- Inner Core -->
    <circle cx="200" cy="200" r="115" fill="#0c254d" stroke="#2563eb" stroke-width="3" />

    <!-- EV Text -->
    <text x="200" y="235" text-anchor="middle" fill="url(#titleGrad)" font-size="92" font-weight="900" font-family="'Inter', 'Segoe UI', 'Arial Black', sans-serif" letter-spacing="-2" filter="url(#shadow)">EV</text>
  </g>

  <!-- Right Side: Content & Branding -->
  <g transform="translate(520, 110)">
    <!-- Top Pillar Badge -->
    <rect x="0" y="0" width="360" height="36" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="18" y="23" fill="#38bdf8" font-size="13" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif" letter-spacing="1.5">🏛️ GOVERNMENT SERVICES &amp; UBD SUITE</text>

    <!-- Main Title -->
    <text x="0" y="115" fill="url(#titleGrad)" font-size="64" font-weight="900" font-family="'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif" letter-spacing="-1" filter="url(#shadow)">E-VEDHIKA</text>

    <!-- Subtitle Tagline in Gold -->
    <text x="0" y="165" fill="url(#goldGrad)" font-size="30" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif" letter-spacing="0.5">All Problems One Solution</text>

    <!-- Descriptive Sub-header -->
    <text x="0" y="215" fill="#cbd5e1" font-size="20" font-weight="600" font-family="'Inter', 'Segoe UI', sans-serif" letter-spacing="0.2">Comprehensive Digital Portal for Panchayats</text>
    <text x="0" y="245" fill="#94a3b8" font-size="17" font-weight="500" font-family="'Inter', 'Segoe UI', sans-serif">Telangana &amp; Andhra Pradesh Digital Administration</text>

    <!-- Badges Row -->
    <g transform="translate(0, 280)">
      <!-- Badge 1 -->
      <rect x="0" y="0" width="135" height="38" rx="10" fill="#0284c7" />
      <text x="67" y="24" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif">UBD SETTINGS</text>

      <!-- Badge 2 -->
      <rect x="145" y="0" width="125" height="38" rx="10" fill="#0d9488" />
      <text x="207" y="24" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif">DSC &amp; DSK</text>

      <!-- Badge 3 -->
      <rect x="280" y="0" width="145" height="38" rx="10" fill="#4f46e5" />
      <text x="352" y="24" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif">DSR ANALYZER</text>

      <!-- Badge 4 -->
      <rect x="435" y="0" width="150" height="38" rx="10" fill="#059669" />
      <text x="510" y="24" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif">GOs &amp; FORMATS</text>
    </g>
  </g>

  <!-- Bottom Bar Divider -->
  <line x1="60" y1="550" x2="1140" y2="550" stroke="#1e3a8a" stroke-width="1.5" />

  <!-- Bottom Website URL & Official Tag -->
  <g transform="translate(60, 590)">
    <circle cx="12" cy="-6" r="6" fill="#10b981" />
    <text x="28" y="-1" fill="#38bdf8" font-size="18" font-weight="800" font-family="'Inter', 'Segoe UI', sans-serif">https://www.e-vedhika.in</text>
    <text x="1080" y="-1" text-anchor="end" fill="#64748b" font-size="15" font-weight="700" font-family="'Inter', 'Segoe UI', sans-serif">Official Panchayat Governance &amp; UBD Portal</text>
  </g>
</svg>
`;

async function main() {
  console.log("Generating clean, high-resolution OpenGraph banners (1200x630)...");

  // Render SVG buffer to JPG and PNG
  const svgBuffer = Buffer.from(bannerSvg);

  const jpgBuffer = await sharp(svgBuffer)
    .resize(1200, 630)
    .jpeg({ quality: 95 })
    .toBuffer();

  const pngBuffer = await sharp(svgBuffer)
    .resize(1200, 630)
    .png({ quality: 95 })
    .toBuffer();

  // Write to public/
  fs.writeFileSync(path.join(publicDir, "banner.jpg"), jpgBuffer);
  fs.writeFileSync(path.join(publicDir, "banner.png"), pngBuffer);
  console.log("Saved banner.jpg and banner.png in public/.");

  // Write to dist/ if dist/ exists
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "banner.jpg"), jpgBuffer);
    fs.writeFileSync(path.join(distDir, "banner.png"), pngBuffer);
    console.log("Saved banner.jpg and banner.png in dist/.");
  }

  // Also run static route generator to sync with new banner
  const genScript = path.resolve(rootDir, "scripts", "generate-static-routes.js");
  if (fs.existsSync(genScript)) {
    console.log("Re-running static route generator...");
    const { execSync } = await import("child_process");
    execSync(`node "${genScript}"`, { stdio: "inherit" });
  }

  console.log("Banner image regeneration complete!");
}

main().catch(err => {
  console.error("Error generating banner image:", err);
});
