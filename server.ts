import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { Readable } from 'stream';
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Gemini Proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, uniqueSuffix + '-' + safeName)
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB limit
  });

  app.post("/api/upload", (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(500).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  }, (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({ url: `/uploads/${req.file.filename}` });
  });

  
  // Simple memory cache for post previews
  const previewCache = new Map<string, { data: any, timestamp: number }>();
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

  app.get('/api/download', async (req, res) => {
    try {
      const url = req.query.url as string;
      const filename = (typeof req.query.filename === "string" ? req.query.filename : null) || "download";

      if (!url || typeof url !== 'string') {
        return res.status(400).send("No URL provided");
      }

      // 1. Strict Local Check
      const isUploadPath = url.startsWith('/uploads/') || url.startsWith('uploads/');
      if (isUploadPath && !url.startsWith('http')) {
        const relativePath = url.replace(/^\//, '');
        const fullLocalPath = path.join(process.cwd(), relativePath);
        
        if (fs.existsSync(fullLocalPath)) {
          let downloadName = filename;
          const ext = path.extname(fullLocalPath);
          if (ext && !downloadName.includes('.')) downloadName += ext;
          return res.download(fullLocalPath, downloadName);
        }
      }

      // 2. High-Speed Remote Fallback
      const fetchUrl = url.startsWith('http') ? url : `https://${url}`;
      const fetchResp = await fetch(fetchUrl);
      
      if (!fetchResp.ok) {
        return res.status(fetchResp.status).send(`Failed to fetch file: ${fetchResp.statusText}`);
      }

      let extractedFilename = filename;
      const remoteDisposition = fetchResp.headers.get('content-disposition');
      if (remoteDisposition) {
        const filenameMatch = remoteDisposition.match(/filename="?([^";]+)"?/i);
        if (filenameMatch) extractedFilename = filenameMatch[1];
      }

      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(extractedFilename)}"`);
      res.setHeader('Content-Type', fetchResp.headers.get('content-type') || 'application/octet-stream');
      
      const arrayBuffer = await fetchResp.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error("Download Error:", error);
      res.status(500).send("Error: " + error.message);
    }
  });
  app.use('/uploads', express.static(uploadsDir));

  // Meta Tags Injection Helper
  async function getPostMetaData(postId: string) {
    const cached = previewCache.get(postId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const postResp = await fetch(`https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/posts/${postId}`);
      if (postResp.ok) {
        const postData = await postResp.json();
        const fields = postData.fields || {};
        const data = {
          title: fields.title?.stringValue || "E-Vedhika Post",
          description: fields.content?.stringValue?.substring(0, 160) || "Check out this update on E-Vedhika Portal",
          image: fields.mediaUrl?.stringValue || "/ev-logo-v2.svg"
        };
        previewCache.set(postId, { data, timestamp: Date.now() });
        return data;
      }
    } catch (e) {
      console.error("Firestore preview fetch error:", e);
    }
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Inject dynamic meta tags middleware
    app.use(async (req, res, next) => {
      const postId = req.query.postId as string;
      const isHtmlRequest = req.headers.accept?.includes('text/html');
      const isBot = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot/i.test(req.headers['user-agent'] || '');

      if (postId && (isHtmlRequest || isBot)) {
        const meta = await getPostMetaData(postId);
        if (meta) {
          const indexContent = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
          let modified = await vite.transformIndexHtml(req.url, indexContent);
          
          modified = modified.replace(/<title>.*?<\/title>/, `<title>${meta.title} | E-Vedhika</title>`);
          modified = modified.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
          modified = modified.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${meta.description}" />`);
          modified = modified.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${meta.image}" />`);
          
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(modified);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    app.get('*', async (req, res) => {
      const postId = req.query.postId as string;
      const indexPath = path.join(distPath, 'index.html');
      
      if (postId && fs.existsSync(indexPath)) {
        const meta = await getPostMetaData(postId);
        if (meta) {
          let indexContent = fs.readFileSync(indexPath, 'utf-8');
          indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${meta.title} | E-Vedhika</title>`);
          indexContent = indexContent.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
          indexContent = indexContent.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${meta.description}" />`);
          indexContent = indexContent.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${meta.image}" />`);
          
          return res.status(200).set({ 'Content-Type': 'text/html' }).send(indexContent);
        }
      }
      
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
