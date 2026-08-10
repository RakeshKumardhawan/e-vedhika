const fs = require('fs');

async function test() {
  let html = fs.readFileSync('index.html', 'utf-8');
  let data = require('./test_data.json');
  const fields = data.fields || {};
  
  const postTitle = (fields.title?.stringValue || "E-Vedhika Post").replace(/"/g, '&quot;').replace(/\s+/g, ' ').trim();
  const rawContent = (fields.content?.stringValue || "").replace(/"/g, '&quot;');
  const cleanContent = rawContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/[*_#>~|`\r\n]/g, " ").replace(/\s+/g, ' ').trim();
  const postDesc = cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "");
  
  html = html.replace(/<title>.*?<\/title>/, `<title>${postTitle} - E-Vedhika</title>`);
  html = html.replace(/<meta\s+(?:property|name)="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${postTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${postDesc}" />`);
  
  const lines = html.split('\n');
  lines.forEach(l => {
    if (l.includes('og:description') || l.includes('og:title')) console.log("FOUND:", l);
  });
}

test();
