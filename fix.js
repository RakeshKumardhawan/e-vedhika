const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/handleForceDownload\(\s*e,\s*att\.url,\s*att\.name \|\| "Attachment",?\s*\)/g, 'handleForceDownload(e, att.url, att.name || "Attachment", att.isDirect)');

content = content.replace(/handleForceDownload\(\s*e,\s*attToDownload\.url,\s*attToDownload\.name \|\| "Download\.zip",?\s*\)/g, 'handleForceDownload(e, attToDownload.url, attToDownload.name || "Download.zip", attToDownload.isDirect)');

fs.writeFileSync('src/App.tsx', content);
