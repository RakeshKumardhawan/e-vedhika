import * as fs from "fs";

let c = fs.readFileSync("src/App.tsx.restored", "utf8");

c = c.replace(
  /\|\|\s*post\.attachments\[0\];/g,
  "const attToDownload = getLatestAttachment(post.attachments) || post.attachments[0];\nif (!attToDownload) return;"
);

// We should also check for `post.attachments[0].url` that was replaced.
// Wait, my replacement for `post.attachments[0].url` was `post.attachments[0]?.url`.
// Since there was no empty OR `||` in that regex: `/post\.attachments\[0\]\.url/g`,
// it just perfectly matched `post.attachments[0].url`. 
// BUT wait, does `post.attachments[0]?.url` remain? No, wait! That replacement happened BEFORE the big corrupt replacement, or AFTER?
// Wait, my previous shell command was:
// `c = c.replace(/post\.attachments\[0\]\.url/g, 'post.attachments[0]?.url'); c = c.replace(/....||.../g, '...');`
// So BOTH happened in the same string! 
// When `post.attachments[0]?.url` was in the string, the big corrupt replacement used `[\s\n]*post\.attachments\[0\];` 
// Which doesn't match `post.attachments[0]?.url`! So those parts are just `post.attachments[0]?.url` now!

fs.writeFileSync("src/App.tsx", c);
console.log("Fixed App.tsx successfully.");
