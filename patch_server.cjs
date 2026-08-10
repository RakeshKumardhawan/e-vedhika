const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// For home_page seo
const searchHome = `            if (keywords) {
              html = html.replace(/<meta\\s+name="keywords"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="keywords" content="\${keywords.replace(/"/g, '&quot;')}" />\`);
            }`;

const replaceHome = searchHome + `
            if (seo.metaRobots) {
              html = html.replace(/<meta\\s+name="robots"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="robots" content="\${seo.metaRobots}" />\`);
            }`;

if (content.includes(searchHome)) {
  content = content.replace(searchHome, replaceHome);
}

// For post seo
const searchPost = `            if (mediaUrl) {
              const absMediaUrl = mediaUrl.startsWith('http') ? mediaUrl : \`\${fullBaseUrl}\${mediaUrl.startsWith('/') ? '' : '/'}\${mediaUrl}\`;
              html = html.replace(/<meta\\s+property="og:image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta property="og:image" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+itemprop="image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta itemprop="image" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+property="og:image:secure_url"\\s+content=".*?"\\s*\\/?>/gi, \`<meta property="og:image:secure_url" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+name="twitter:image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="twitter:image" content="\${absMediaUrl}" />\`);
            }`;

const replacePost = searchPost + `
            const postKeywords = fields.seoKeywords?.stringValue || "";
            if (postKeywords) {
              html = html.replace(/<meta\\s+name="keywords"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="keywords" content="\${postKeywords.replace(/"/g, '&quot;')}" />\`);
            }
            const postRobots = fields.metaRobots?.stringValue || "";
            if (postRobots) {
              html = html.replace(/<meta\\s+name="robots"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="robots" content="\${postRobots}" />\`);
            }`;

if (content.includes(searchPost)) {
  content = content.replace(searchPost, replacePost);
}

fs.writeFileSync('server.ts', content);
console.log('Patched server.ts');
