const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const badBlock = `            }
            const postKeywords = fields.seoKeywords?.stringValue || "";
            if (postKeywords) {
              html = html.replace(/<meta\\s+name="keywords"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="keywords" content="\${postKeywords.replace(/"/g, '&quot;')}" />\`);
            }
            const postRobots = fields.metaRobots?.stringValue || "";
            if (postRobots) {
              html = html.replace(/<meta\\s+name="robots"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="robots" content="\${postRobots}" />\`);
            }`;

content = content.replace(badBlock, '            }');

const correctBlockSearch = `            if (mediaUrl) {
              const absMediaUrl = mediaUrl.startsWith('http') ? mediaUrl : \`\${fullBaseUrl}\${mediaUrl.startsWith('/') ? '' : '/'}\${mediaUrl}\`;
              html = html.replace(/<meta\\s+property="og:image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta property="og:image" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+itemprop="image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta itemprop="image" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+property="og:image:secure_url"\\s+content=".*?"\\s*\\/?>/gi, \`<meta property="og:image:secure_url" content="\${absMediaUrl}" />\`);
              html = html.replace(/<meta\\s+name="twitter:image"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="twitter:image" content="\${absMediaUrl}" />\`);
            }`;

// We want to replace the LAST occurrence of correctBlockSearch
const parts = content.split(correctBlockSearch);
if (parts.length > 1) {
  const lastPart = parts.pop();
  content = parts.join(correctBlockSearch) + correctBlockSearch + `
            const postKeywords = fields.seoKeywords?.stringValue || "";
            if (postKeywords) {
              html = html.replace(/<meta\\s+name="keywords"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="keywords" content="\${postKeywords.replace(/"/g, '&quot;')}" />\`);
            }
            const postRobots = fields.metaRobots?.stringValue || "";
            if (postRobots) {
              html = html.replace(/<meta\\s+name="robots"\\s+content=".*?"\\s*\\/?>/gi, \`<meta name="robots" content="\${postRobots}" />\`);
            }` + lastPart;
}

fs.writeFileSync('server.ts', content);
