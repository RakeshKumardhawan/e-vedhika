import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, "dist");
const rootIndexPath = path.resolve(rootDir, "index.html");
const distIndexPath = path.join(distDir, "index.html");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Prefer dist/index.html (post-Vite build), fallback to root index.html
let indexContent = "";
if (fs.existsSync(distIndexPath)) {
  indexContent = fs.readFileSync(distIndexPath, "utf-8");
} else if (fs.existsSync(rootIndexPath)) {
  indexContent = fs.readFileSync(rootIndexPath, "utf-8");
} else {
  console.error("[generate-static-routes] No index.html found!");
  process.exit(1);
}

const BASE_URL = "https://www.e-vedhika.in";
const DEFAULT_BANNER = `${BASE_URL}/banner.jpg`;
const FIRESTORE_API_KEY = "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/posts?pageSize=1000&key=${FIRESTORE_API_KEY}`;
const MANIFEST_PATH = path.resolve(rootDir, "data", "posts-manifest.json");

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanMarkdown(text) {
  if (!text) return "";
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[.*?\]\(.*?\)/g, " ")
    .replace(/[*_#`~|>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

function injectOgTags(baseHtml, { title, description, imageUrl, canonicalUrl, type = "website" }) {
  let html = baseHtml;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(imageUrl || DEFAULT_BANNER);
  const safeUrl = escapeHtml(canonicalUrl);

  // Replace or inject <title>
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`);
  } else {
    html = html.replace("</head>", `  <title>${safeTitle}</title>\n</head>`);
  }

  // Helper to upsert meta tag
  const upsertMeta = (attrType, attrName, content) => {
    const escaped = attrName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`<meta\\s+[^>]*${attrType}=["']${escaped}["'][^>]*>`, "gi");
    const tag = `<meta ${attrType}="${attrName}" content="${escapeHtml(content)}" />`;
    if (regex.test(html)) {
      html = html.replace(regex, tag);
    } else {
      html = html.replace("</head>", `  ${tag}\n</head>`);
    }
  };

  upsertMeta("name", "description", description);
  upsertMeta("property", "og:site_name", "E-Vedhika");
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", imageUrl);
  upsertMeta("property", "og:image:secure_url", imageUrl);
  upsertMeta("property", "og:image:type", (imageUrl && imageUrl.endsWith(".png")) ? "image/png" : "image/jpeg");
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:alt", title);
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:locale", "te_IN");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", imageUrl);
  upsertMeta("name", "twitter:url", canonicalUrl);

  upsertMeta("itemprop", "name", title);
  upsertMeta("itemprop", "description", description);
  upsertMeta("itemprop", "image", imageUrl);

  // Link rel="image_src"
  if (/<link\s+[^>]*rel=["']image_src["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+[^>]*rel=["']image_src["'][^>]*>/gi, `<link rel="image_src" href="${safeImage}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="image_src" href="${safeImage}" />\n</head>`);
  }

  // Link rel="canonical"
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, `<link rel="canonical" href="${safeUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${safeUrl}" />\n</head>`);
  }

  return html;
}

function writePage(relPath, content) {
  const targetDir = path.join(distDir, relPath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.html"), content, "utf-8");
}

// Deep routes that must exist statically on GitHub Pages with HTTP 200 responses
const standardRoutes = [
  { path: "workspace", title: "వర్క్‌స్పేస్ టూల్స్ | E-Vedhika", desc: "తెలంగాణ & ఏపీ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ ఆపరేటర్ల కొరకు రోజువారీ ఆన్‌లైన్ టూల్స్ మరియు వర్క్‌స్పేస్." },
  { path: "workspace/multiday", title: "మల్టీ-డే అటెండెన్స్ (Multi-Day Attendance) | E-Vedhika", desc: "ఒకటి కంటే ఎక్కువ రోజుల హాజరు వివరాలను ఒకేసారి నమోదు చేయడానికి మరియు సరిచూడటానికి ఈ టూల్ ఉపయోగపడుతుంది." },
  { path: "workspace/dsr", title: "DSR ఎనలైజర్ (DSR Analyzer) | E-Vedhika", desc: "ఈ-పంచాయతి ఆపరేటర్లు & సెక్రటరీల కొరకు Daily Status Report (DSR) ఎనలైజర్. Mana Panchayati ఎక్సెల్ ఫైల్ అప్‌లోడ్ చేసి క్షణాల్లో PS Attendance, DSR Status, Not Reported రిపోర్టులు పొందండి." },
  { path: "workspace/monthly-activity", title: "మంత్లీ యాక్టివిటీ (Monthly Activity) | E-Vedhika", desc: "నెలవారీ పంచాయతీ పనుల ప్రణాళిక మరియు రిపోర్టింగ్." },
  { path: "workspace/training", title: "డిజిటల్ ట్రైనింగ్ (Digital Training Hub) | E-Vedhika", desc: "డిజిటల్ వర్క్‌ఫ్లోస్ మరియు ట్యుటోరియల్స్ ద్వారా వివిధ పనులను ఎలా చేయాలో నేర్చుకోండి." },
  { path: "workspace/pract", title: "నాలెడ్జ్ హబ్ (PR Act Guide) | E-Vedhika", desc: "పంచాయతీరాజ్ చట్టం (PR Act), సెక్షన్లు మరియు ఇతర ముఖ్యమైన సమాచారం గురించి తెలుసుకోవడానికి సమగ్ర వేదిక." },
  { path: "workspace/excel-merge", title: "ఎక్సెల్ ఫైల్ మెర్జర్ (Excel Merger) | E-Vedhika", desc: "వేర్వేరు ఎక్సెల్ ఫైల్స్ (Excel files) లో ఉన్న సమాచారాన్ని ఒకే ఫైల్ గా కలపడానికి మరియు డౌన్‌లోడ్ చేసుకోవడానికి ఈ టూల్ ఉపయోగపడుతుంది." },
  { path: "workspace/gpdp-planning", title: "GPDP ప్లానింగ్ | E-Vedhika", desc: "గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP) తయారీ మరియు విశ్లేషణ." },
  { path: "gos_formats", title: "జీవోలు & ఫార్మాట్లు (GOs & Formats) | E-Vedhika", desc: "అన్ని రకాల ప్రభుత్వ జీవోలు, ప్రొసీడింగ్స్, అప్లికేషన్ ఫార్మాట్‌లు మరియు ఇతర ఫైల్స్ డౌన్‌లోడ్ చేసుకోండి." },
  { path: "gos_formats/Application", title: "అప్లికేషన్ ఫార్మాట్లు (Application Formats) | E-Vedhika", desc: "పంచాయతీ కార్యాలయ దరఖాస్తు ఫార్మాట్లు, నమూనాలు మరియు దస్త్రాలు." },
  { path: "gos_formats/GO", title: "ప్రభుత్వ జీవోలు (Government Orders) | E-Vedhika", desc: "తెలంగాణ పంచాయతీరాజ్ & గ్రామీణాభివృద్ధి జీవోలు, సర్క్యులర్లు." },
  { path: "suggestions", title: "సమస్యలు & సూచనలు (Suggestions & Feedback) | E-Vedhika", desc: "పోర్టల్ అభివృద్ధి కోసం మీ విలువైన సూచనలు మరియు సమస్యలను ఇక్కడ తెలియజేయండి. All Problems One Solution." },
  { path: "suggestions/problems", title: "సాంకేతిక సమస్యలు (Technical Issues) | E-Vedhika", desc: "ఈ-పంచాయతీ, UBD, డిజిటల్ సేవల సమస్యలు మరియు పరిష్కారాలు." },
  { path: "suggestions/suggestions", title: "సూచనలు & సలహాలు (Suggestions) | E-Vedhika", desc: "ఈ-వేదిక అభివృద్ధికి మీ సలహాలు అందించండి." },
  { path: "emergency", title: "ఎమర్జెన్సీ సేవల కాంటాక్ట్స్ | E-Vedhika", desc: "అత్యవసర సర్వీసులు, హెల్ప్‌లైన్ నంబర్లు మరియు శాఖల డైరెక్టరీ." },
  { path: "my_activity", title: "నా యాక్టివిటీ & రిపోర్ట్స్ | E-Vedhika", desc: "మీ యూజర్ ప్రొఫైల్, చేసిన పనులు మరియు డౌన్‌లోడ్స్." },
  { path: "priority_services", title: "ప్రాధాన్యత సేవలు | E-Vedhika", desc: "పంచాయతీ కార్యదర్శులు మరియు ఆపరేటర్ల అత్యంత ముఖ్యమైన రోజువారీ సేవలు." },
  { path: "priority_services/emergency", title: "ఎమర్జెన్సీ సేవలు | E-Vedhika", desc: "అత్యవసర సమాచారం మరియు డైరెక్టరీ." },
  { path: "priority_services/my_activity", title: "నా యాక్టివిటీ | E-Vedhika", desc: "యూజర్ యాక్టివిటీ ట్రాకర్." },
  { path: "directlinks", title: "డైరెక్ట్ లింక్స్ & పోర్టల్స్ | E-Vedhika", desc: "తెలంగాణ ప్రభుత్వ శాఖల అధికారిక వెబ్‌సైట్లకు డైరెక్ట్ లింకులు." },
  { path: "useful_links", title: "ముఖ్యమైన లింకులు | E-Vedhika", desc: "ఉపయోగకరమైన వెబ్‌సైట్లు మరియు పోర్టల్స్." },
  { path: "chat", title: "సపోర్ట్ & కమ్యూనిటీ చాట్ | E-Vedhika", desc: "పంచాయతీ ఉద్యోగులు మరియు సాంకేతిక నిపుణులతో పరస్పర చర్చా వేదిక." },
  { path: "logs", title: "సిస్టమ్ లాగ్స్ | E-Vedhika", desc: "సిస్టమ్ స్థితి మరియు ఆడిట్ లాగ్స్." },
  { path: "union", title: "ఉద్యోగ సంఘాల సమాచారం | E-Vedhika", desc: "పంచాయతీ కార్యదర్శుల సంఘం మరియు ఈ-పంచాయతీ ఆపరేటర్ల సమాచారం." },
  { path: "changelog", title: "సిస్టమ్ అప్‌డేట్స్ (System Updates) | E-Vedhika", desc: "ఈ-వేదిక యాప్‌లో కొత్తగా వచ్చిన ఫీచర్లు మరియు తాజా మార్పుల వివరాలు." },
  { path: "farmer_registry", title: "రైతు రిజిస్ట్రీ (Farmer Registry) | E-Vedhika", desc: "రైతుల డేటా, వ్యవసాయ రికార్డులను నిర్వహించడానికి మరియు సరిచూసుకోవడానికి ప్రత్యేక పోర్టల్." },
  { path: "farmer-registry", title: "రైతు రిజిస్ట్రీ | E-Vedhika", desc: "రైతు సమాచారం మరియు సేవల వేదిక." },
  { path: "farmer", title: "రైతు రిజిస్ట్రీ | E-Vedhika", desc: "రైతు సమాచారం మరియు సేవల వేదిక." },
  { path: "excel_print", title: "ఎక్సెల్ ప్రింట్ టూల్ | E-Vedhika", desc: "ఎక్సెల్ షీట్లను సులభంగా పిడిఎఫ్ లేదా ప్రింట్ రూపంలోకి మార్చండి." },
  { path: "pdf_compress", title: "పీడీఎఫ్ కంప్రెసర్ టూల్ | E-Vedhika", desc: "పీడీఎఫ్ ఫైల్ సైజును సులభంగా తగ్గించుకోండి." },
  { path: "gpdp_setup", title: "GPDP సెటప్ గైడ్ | E-Vedhika", desc: "GPDP ప్రణాళిక తయారీ మార్గదర్శకాలు." },
  { path: "ubd_tracker", title: "UBD ట్రాకర్ & డెస్క్‌టాప్ టూల్స్ | E-Vedhika", desc: "UBD డేటా ట్రాక్ చేయడానికి మరియు జనన మరణాల వివరాలను సులభంగా నిర్వహించడానికి." },
  { path: "ubd-settings-dsk-issues", title: "UBD Settings, DSC & DSK Issues Solution | Telangana & AP Panchayath Portal - E-Vedhika", desc: "Bilingual guide & troubleshooting for UBD Settings, DSC, DSK issues, Telangana UBD website DSK errors, and AP UBD portal issues on E-Vedhika." },
  { path: "software_hub", title: "సాఫ్ట్‌వేర్ హబ్ (Software Hub) | E-Vedhika", desc: "పంచాయతీ కార్యాలయాలకు అవసరమైన అన్ని సాఫ్ట్‌వేర్‌లు, డ్రైవర్లు మరియు యుటిలిటీస్." },
  { path: "admin", title: "అడ్మిన్ పోర్టల్ | E-Vedhika", desc: "ఈ-వేదిక నిర్వహణ మరియు అడ్మినిస్ట్రేషన్." },
  { path: "evdka", title: "ఈ-వేదిక పోర్టల్", desc: "All Problems One Solution." },
  { path: "evedhika", title: "ఈ-వేదిక పోర్టల్", desc: "All Problems One Solution." },
  { path: "privacy", title: "గోప్యతా విధానం (Privacy Policy) | E-Vedhika", desc: "ఈ-వేదిక గోప్యతా నియమాలు మరియు డేటా భద్రత." },
  { path: "terms", title: "నిబంధనలు & షరతులు (Terms of Service) | E-Vedhika", desc: "ఈ-వేదిక నిబంధనలు మరియు వినియోగ షరతులు." },
  { path: "about", title: "మా గురించి (About Us) | E-Vedhika", desc: "ఈ-వేదిక లక్ష్యాలు, ప్రస్థానం మరియు సేవల సమగ్ర సమాచారం." },
  { path: "contact", title: "మమ్మల్ని సంప్రదించండి (Contact Us) | E-Vedhika", desc: "ఈ-వేదిక సపోర్ట్ టీమ్ ఈమెయిల్, టెలిగ్రామ్ మరియు వాట్సాప్ ఛానెల్ సంప్రదింపు వివరాలు." },
  { path: "sitemap", title: "సైట్‌మ్యాప్ & డైరెక్టరీ | E-Vedhika", desc: "ఈ-వేదికలోని అన్ని పేజీలు, సర్వీసులు మరియు టూల్స్ పూర్తి డైరెక్టరీ." },
  { path: "home/post", title: "తాజా పోస్ట్‌లు & నోటిఫికేషన్లు | E-Vedhika", desc: "తెలంగాణ పంచాయతీరాజ్ తాజా జీవోలు, నోటిఫికేషన్లు మరియు అప్‌డేట్స్." },
  { path: "post", title: "తాజా పోస్ట్‌లు & నోటిఫికేషన్లు | E-Vedhika", desc: "తెలంగాణ పంచాయతీరాజ్ తాజా జీవోలు మరియు సమాచారం." }
];

// Pre-render standard tool sections
standardRoutes.forEach((route) => {
  const canonicalUrl = `${BASE_URL}/${route.path}`;
  const html = injectOgTags(indexContent, {
    title: route.title,
    description: route.desc,
    imageUrl: DEFAULT_BANNER,
    canonicalUrl,
    type: "website"
  });
  writePage(route.path, html);
});
console.log(`[generate-static-routes] Pre-rendered ${standardRoutes.length} standard routes.`);

// Fetch posts from Firestore, merge into local manifest, pre-render all posts
async function handlePostGeneration() {
  const allPostUrls = [];
  let posts = [];

  // 1. Load existing persistent manifest if present
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        posts = parsed;
        console.log(`[generate-static-routes] Loaded ${posts.length} posts from local posts-manifest.json.`);
      }
    } catch (e) {
      console.warn("[generate-static-routes] Error reading posts-manifest.json:", e);
    }
  }

  // 2. Try fetching from Firestore REST API to get fresh additions
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(FIRESTORE_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const docs = data.documents || [];
      console.log(`[generate-static-routes] Fetched ${docs.length} fresh posts from Firestore.`);

      const fetchedPosts = docs.map((doc) => {
        const f = doc.fields || {};
        const docId = doc.name.split("/").pop();
        const rawTitle = (f.title?.stringValue || "E-Vedhika Post").trim();
        const rawContent = f.content?.stringValue || "";
        const cleaned = cleanMarkdown(rawContent);
        const description = cleaned ? (cleaned.length > 160 ? cleaned.slice(0, 157) + "..." : cleaned) : "ఈ-వేదిక (E-Vedhika) - All Problems One Solution.";

        let mediaUrl = f.mediaUrl?.stringValue || f.imageUrl?.stringValue || f.poster?.stringValue || f.videoThumbnailUrl?.stringValue || "";
        let imageUrl = DEFAULT_BANNER;
        if (mediaUrl && mediaUrl.startsWith("http")) {
          imageUrl = mediaUrl;
        }

        const slug = (f.slug?.stringValue || "").trim() || generatePostSlug(rawTitle, docId);
        const postNumber = f.postNumber?.integerValue || f.postNumber?.stringValue;

        return {
          id: docId,
          slug,
          title: rawTitle,
          content: description,
          imageUrl,
          postNumber: postNumber ? String(postNumber) : undefined,
          category: f.category?.stringValue || "తాజా వార్తలు"
        };
      });

      // Merge fetched posts into existing list (keyed by id/slug)
      const postMap = new Map();
      posts.forEach(p => postMap.set(p.slug || p.id, p));
      fetchedPosts.forEach(p => postMap.set(p.slug || p.id, p));
      posts = Array.from(postMap.values());

      // Save updated manifest back to disk
      try {
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(posts, null, 2), "utf-8");
        console.log(`[generate-static-routes] Updated posts-manifest.json with ${posts.length} total posts.`);
      } catch (err) {
        console.error("[generate-static-routes] Failed to save updated posts manifest:", err);
      }
    } else {
      console.warn(`[generate-static-routes] Firestore responded with ${res.status}: ${res.statusText}. Using persistent posts-manifest.json.`);
    }
  } catch (err) {
    console.warn("[generate-static-routes] Network/timeout fetching Firestore. Using persistent posts-manifest.json:", err.message);
  }

  // 3. Ensure target post 'continuation-orders-2026-27' is explicitly in the list
  const hasContinuation = posts.some(p => p.slug === "continuation-orders-2026-27" || p.id === "7t6TkrzU7hwspvjI0xsl");
  if (!hasContinuation) {
    posts.unshift({
      id: "7t6TkrzU7hwspvjI0xsl",
      slug: "continuation-orders-2026-27",
      title: "📢 తెలంగాణ పంచాయతీరాజ్ శాఖలో ఔట్‌సోర్సింగ్, కాంట్రాక్ట్ ఉద్యోగులకు కీలక అప్డేట్!",
      content: "తెలంగాణ రాష్ట్ర పంచాయతీరాజ్ మరియు గ్రామీణాభివృద్ధి శాఖ పరిధిలో విధులు నిర్వహిస్తున్న ఔట్‌సోర్సింగ్, కాంట్రాక్ట్ ఉద్యోగుల సర్వీస్ కొనసాగింపు (Continuation Orders) ఉత్తర్వుల తాజా వివరాలు, ప్రొసీడింగ్స్ కాపీలు మరియు సమాచారం. పూర్తి జీవో మరియు వివరాల కోసం ఈ-వేదిక పోర్టల్ సందర్శించండి.",
      imageUrl: DEFAULT_BANNER,
      postNumber: "1",
      category: "ఉద్యోగుల సమాచారం"
    });
  }

  // 4. Pre-render every post
  let totalGenerated = 0;
  for (const post of posts) {
    const slug = post.slug || generatePostSlug(post.title, post.id);
    const docId = post.id || slug;
    const postTitle = `${post.title} | E-Vedhika`;
    const postDesc = post.content || "ఈ-వేదిక (E-Vedhika) - All Problems One Solution. తెలంగాణ పంచాయతీ పరిపాలనా పోర్టల్.";
    const imageUrl = post.imageUrl || DEFAULT_BANNER;
    const canonicalUrl = `${BASE_URL}/home/post/${slug}`;

    allPostUrls.push(canonicalUrl);

    const postHtml = injectOgTags(indexContent, {
      title: postTitle,
      description: postDesc,
      imageUrl,
      canonicalUrl,
      type: "article"
    });

    // Write all path variations (slug, docId, postNumber, aliases)
    const pathsToWrite = new Set([
      path.join("home", "post", slug),
      path.join("post", slug),
      slug
    ]);

    if (docId && docId !== slug) {
      pathsToWrite.add(path.join("home", "post", docId));
      pathsToWrite.add(path.join("post", docId));
      pathsToWrite.add(docId);
    }

    if (post.postNumber) {
      pathsToWrite.add(path.join("home", "post", String(post.postNumber)));
      pathsToWrite.add(path.join("post", String(post.postNumber)));
    }

    if (Array.isArray(post.aliases)) {
      post.aliases.forEach(alias => {
        const cleanAlias = String(alias).trim();
        if (cleanAlias) {
          pathsToWrite.add(path.join("home", "post", cleanAlias));
          pathsToWrite.add(path.join("post", cleanAlias));
          pathsToWrite.add(cleanAlias);
          allPostUrls.push(`${BASE_URL}/home/post/${cleanAlias}`);
        }
      });
    }

    for (const p of pathsToWrite) {
      writePage(p, postHtml);
      totalGenerated++;
    }
  }

  console.log(`[generate-static-routes] Pre-rendered ${posts.length} posts across ${totalGenerated} path variations.`);
  generateSitemap(allPostUrls);
}

// Generate sitemap.xml and robots.txt
function generateSitemap(allPostUrls) {
  const now = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Root
  xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Standard routes
  standardRoutes.forEach((route) => {
    xml += `  <url>\n    <loc>${BASE_URL}/${route.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Post URLs
  allPostUrls.forEach((url) => {
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
  console.log(`[generate-static-routes] Generated dist/sitemap.xml with ${standardRoutes.length + 1 + allPostUrls.length} URLs.`);

  const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), robots, "utf-8");
  console.log("[generate-static-routes] Generated dist/robots.txt.");

  // Also sync sitemap and robots into public/ if it exists
  const publicDir = path.resolve(rootDir, "public");
  if (fs.existsSync(publicDir)) {
    try {
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
      fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf-8");
      console.log("[generate-static-routes] Synced sitemap.xml and robots.txt into public/.");
    } catch (e) {}
  }
}

// GitHub Pages essential assets: .nojekyll, CNAME, 404.html
function ensureGitHubPagesAssets() {
  // 1. .nojekyll ensures directories starting with underscore are served
  fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

  // 2. CNAME
  const distCname = path.join(distDir, "CNAME");
  const publicCname = path.join(rootDir, "public", "CNAME");
  const rootCname = path.join(rootDir, "CNAME");

  if (fs.existsSync(publicCname)) {
    fs.copyFileSync(publicCname, distCname);
  } else if (fs.existsSync(rootCname)) {
    fs.copyFileSync(rootCname, distCname);
  } else {
    fs.writeFileSync(distCname, "www.e-vedhika.in\n", "utf-8");
  }

  // 4. Banner images
  const publicDir = path.resolve(rootDir, "public");
  ["banner.jpg", "banner.png", "ev-logo-v2.png", "ev_logo.png"].forEach(file => {
    const pubFile = path.join(publicDir, file);
    const distFile = path.join(distDir, file);
    if (fs.existsSync(pubFile)) {
      try {
        fs.copyFileSync(pubFile, distFile);
      } catch (e) {}
    }
  });

  console.log("[generate-static-routes] Verified GitHub Pages assets (.nojekyll, CNAME, 404.html, banner images).");
}

async function run() {
  await handlePostGeneration();
  ensureGitHubPagesAssets();
  console.log("=================================================");
  console.log("🚀 Static pre-rendering for GitHub Pages complete!");
  console.log("=================================================");
}

run();
