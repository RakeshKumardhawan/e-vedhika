import fs from "fs";
import path from "path";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html not found! Run vite build first.");
  process.exit(0);
}

const indexContent = fs.readFileSync(indexPath, "utf-8");

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
  "directlinks",
  "chat",
  "logs",
  "union",
  "changelog",
  "farmer_registry",
  "excel_print",
  "admin",
  "privacy",
  "terms",
  "about",
  "contact"
];

routes.forEach((route) => {
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, indexContent, "utf-8");
});

console.log(`Generated static index.html for ${routes.length} deep routes in dist/ for GitHub Pages.`);

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
