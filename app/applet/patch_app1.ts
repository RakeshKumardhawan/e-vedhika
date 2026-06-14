import * as fs from "fs";

let content = fs.readFileSync("src/App.tsx", "utf8");

content = content.replace(
  /post\.attachments\[0\]\.url/g,
  "post.attachments[0]?.url"
);

content = content.replace(
  /const attToDownload =[\s\n]*getLatestAttachment\(post\.attachments\) ||[\s\n]*post\.attachments\[0\];/g,
  `const attToDownload = getLatestAttachment(post.attachments) || post.attachments[0]; if (!attToDownload) return;`
);

fs.writeFileSync("src/App.tsx", content);
