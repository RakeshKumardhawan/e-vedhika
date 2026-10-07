import fs from "fs";
import path from "path";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const hasIndex = fs.existsSync(indexPath);
const indexContent = hasIndex ? fs.readFileSync(indexPath, "utf-8") : "";
if (!hasIndex) {
  console.warn("dist/index.html not found yet. Skipping static deep HTML routes, but generating sitemap.xml and robots.txt.");
}

// All deep routes that should have pre-generated static index.html on GitHub Pages
const routes = [
  "workspace",
  "workspace/multiday",
  "workspace/dsr",
  "workspace/monthly-activity",
  "workspace/training",
  "workspace/pract",
  "workspace/excel-merge",
  "workspace/gpdp-planning",
  "gos_formats",
  "gos_formats/Application",
  "gos_formats/GO",
  "suggestions",
  "suggestions/problems",
  "suggestions/suggestions",
  "emergency",
  "my_activity",
  "priority_services",
  "priority_services/emergency",
  "priority_services/my_activity",
  "directlinks",
  "useful_links",
  "chat",
  "logs",
  "union",
  "changelog",
  "farmer_registry",
  "farmer-registry",
  "excel_print",
  "pdf_compress",
  "gpdp_setup",
  "ubd_tracker",
  "software_hub",
  "admin",
  "evdka",
  "evedhika",
  "privacy",
  "terms",
  "about",
  "contact",
  "sitemap",
  "home/post",
  "post"
];

if (hasIndex) {
  routes.forEach((route) => {
    const targetDir = path.join(distDir, route);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, "index.html");
    fs.writeFileSync(targetFile, indexContent, "utf-8");
  });
  console.log(`Generated static index.html for ${routes.length} deep routes in dist/ for GitHub Pages.`);
}

// Utility to generate clean slugs matching frontend
function generatePostSlug(title, fallbackId) {
  if (!title) return fallbackId || "post";
  let clean = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  if (!clean || clean.length < 2) return fallbackId || "post";
  if (clean.length > 75) {
    clean = clean.substring(0, 75).replace(/-[^-]*$/, "");
  }
  return clean;
}

function injectPostOgTags(baseHtml, { title, description, imageUrl, canonicalUrl }) {
  let html = baseHtml;
  
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  } else {
    html = html.replace("</head>", `<title>${title}</title>\n</head>`);
  }

  const setMeta = (attrType, attrName, content) => {
    const escaped = attrName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`<meta\\s+[^>]*${attrType}=["']${escaped}["'][^>]*>`, "gi");
    const safe = (content || "").replace(/"/g, "&quot;");
    const tag = `<meta ${attrType}="${attrName}" content="${safe}" />`;
    if (regex.test(html)) {
      html = html.replace(regex, tag);
    } else {
      html = html.replace("</head>", `  ${tag}\n</head>`);
    }
  };

  setMeta("name", "description", description);
  setMeta("property", "og:site_name", "E-Vedhika");
  setMeta("property", "og:type", "article");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", imageUrl);
  setMetaTagSafe(html, imageUrl, canonicalUrl);
  setMeta("property", "og:image:secure_url", imageUrl);
  setMeta("property", "og:image:type", imageUrl.endsWith(".png") ? "image/png" : "image/jpeg");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:image:alt", title);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("property", "og:locale", "te_IN");

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", imageUrl);
  setMeta("name", "twitter:url", canonicalUrl);

  // Link image_src and canonical
  if (/<link\s+[^>]*rel=["']image_src["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+[^>]*rel=["']image_src["'][^>]*>/gi, `<link rel="image_src" href="${imageUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="image_src" href="${imageUrl}" />\n</head>`);
  }

  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  return html;
}

function setMetaTagSafe(html, imageUrl, canonicalUrl) {
  // Helper placeholder
}

// Fetch all posts from Firestore and generate static HTML with rich WhatsApp preview cards
async function generateStaticPostRoutes() {
  const allPostUrls = [];
  try {
    const apiKey = "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU";
    const url = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/posts?pageSize=100&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("Could not fetch posts for static pre-generation:", res.status);
      generateSitemap([]);
      return;
    }
    const data = await res.json();
    const docs = data.documents || [];
    let generatedCount = 0;

    for (let index = 0; index < docs.length; index++) {
      const doc = docs[index];
      const docId = doc.name.split("/").pop();
      const fields = doc.fields || {};
      const title = (fields.title?.stringValue || "E-Vedhika Post").trim();
      const rawContent = (fields.content?.stringValue || "").trim();
      const cleanContent = rawContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/[*_#>~|`\r\n]/g, " ").replace(/\s+/g, " ").trim();
      const description = cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "");
      
      let mediaUrl = fields.mediaUrl?.stringValue || fields.imageUrl?.stringValue || fields.poster?.stringValue || fields.videoThumbnailUrl?.stringValue || "";
      let imageUrl = "https://www.e-vedhika.in/banner.jpg";
      if (mediaUrl.startsWith("http")) {
        imageUrl = mediaUrl;
      }

      const explicitSlug = fields.slug?.stringValue ? fields.slug.stringValue.trim() : "";
      const generatedSlug = generatePostSlug(title, docId);
      const postSlug = explicitSlug || generatedSlug;
      const postNumber = fields.postNumber?.integerValue || fields.postNumber?.stringValue || (index + 1);

      const canonicalUrl = `https://www.e-vedhika.in/home/post/${postSlug}`;
      allPostUrls.push(canonicalUrl);

      if (hasIndex) {
        const postHtml = injectPostOgTags(indexContent, {
          title: `${title} - E-Vedhika`,
          description: description || "ఈ-వేదిక (E-Vedhika) - All Problems One Solution. తెలంగాణ పంచాయతీ పరిపాలనా పోర్టల్.",
          imageUrl,
          canonicalUrl,
        });

        // Target folders for slug, docId, and numeric permalink
        const targetPaths = [
          path.join(distDir, "home", "post", postSlug),
          path.join(distDir, "home", "post", docId),
          path.join(distDir, "post", postSlug),
          path.join(distDir, "post", docId),
        ];

        if (postNumber) {
          targetPaths.push(path.join(distDir, "home", "post", String(postNumber)));
          targetPaths.push(path.join(distDir, "post", String(postNumber)));
        }

        for (const targetDir of targetPaths) {
          fs.mkdirSync(targetDir, { recursive: true });
          fs.writeFileSync(path.join(targetDir, "index.html"), postHtml, "utf-8");
          generatedCount++;
        }
      }
    }

    console.log(`Pre-generated static WhatsApp preview pages for ${docs.length} posts (${generatedCount} path variants) in dist/.`);
    generateSitemap(allPostUrls);
  } catch (err) {
    console.error("Error pre-generating static post routes:", err);
    generateSitemap([]);
  }
}

await generateStaticPostRoutes();

// Generate sitemap.xml and robots.txt
function generateSitemap(allUrls) {
  const baseUrl = "https://www.e-vedhika.in";
  const now = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Static Routes
  routes.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${route}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Home route
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Dynamic Post Routes
  allUrls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
  console.log(`Generated sitemap.xml in dist/ with ${routes.length + 1 + allUrls.length} URLs.`);
  
  // Also write to public/ so dev server or server.ts serves the live dynamic sitemap
  try {
    const publicDir = path.resolve(process.cwd(), "public");
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
      console.log("Copied sitemap.xml to public/.");
    }
  } catch (err) {
    console.error("Error writing sitemap.xml to public/:", err);
  }

  const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), robots, "utf-8");
  console.log("Generated robots.txt in dist/.");

  try {
    const publicDir = path.resolve(process.cwd(), "public");
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf-8");
      console.log("Copied robots.txt to public/.");
    }
  } catch (err) {
    console.error("Error writing robots.txt to public/:", err);
  }
}

// Ensure CNAME and 404.html exist in dist
const publicCname = path.resolve(process.cwd(), "public", "CNAME");
const rootCname = path.resolve(process.cwd(), "CNAME");
const distCname = path.join(distDir, "CNAME");

if (!fs.existsSync(distCname)) {
  if (fs.existsSync(publicCname)) {
    fs.copyFileSync(publicCname, distCname);
  } else if (fs.existsSync(rootCname)) {
    fs.copyFileSync(rootCname, distCname);
  }
}

const public404 = path.resolve(process.cwd(), "public", "404.html");
const dist404 = path.join(distDir, "404.html");

if (fs.existsSync(public404) && !fs.existsSync(dist404)) {
  fs.copyFileSync(public404, dist404);
}

// .nojekyll prevents GitHub Pages from ignoring files that begin with an underscore
const noJekyll = path.join(distDir, ".nojekyll");
fs.writeFileSync(noJekyll, "", "utf-8");
console.log("GitHub Pages deployment assets (.nojekyll, CNAME, 404.html, static routes) verified.");
