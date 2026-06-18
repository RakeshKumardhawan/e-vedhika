import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const distPath = path.join(process.cwd(), 'dist');
let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');

html = html.replace(/https:\/\/e-vedhika\.(online|onrender\.com)\//g, `http://localhost:3000/`);
let postTitle = "Dynamic Test Title";
html = html.replace(/<title>.*?<\/title>/, `<title>${postTitle} - E-Vedhika</title>`);
html = html.replace(/<meta\s+(?:property|name)="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${postTitle}" />`);

console.log(html.split('\n').filter(l => l.includes('og:title') || l.includes('title>')).join('\n'));
