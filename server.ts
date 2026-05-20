import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { Readable } from 'stream';
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Gemini Proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || 
                     process.env.VITE_GEMINI_API_KEY || 
                     process.env.GOOGLE_API_KEY || 
                     process.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API కీ కనిపించలేదు (Gemini API key is not configured). దయచేసి AI Studio సెట్టింగ్స్ > Secrets లో GEMINI_API_KEY ని కాన్ఫిగర్ చేయండి." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "No response generated.";
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  const uploadsDir = path.join('/tmp', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
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

  app.post("/api/upload", (req, res) => {
    console.log("POST /api/upload hit. Content-Type:", req.headers['content-type']);
    
    upload.single('file')(req, res, async (err) => {
      try {
        if (err) {
          console.error("Multer upload error:", err);
          return res.status(500).json({ error: err.message || "Upload failed during multer parsing" });
        }

        if (!req.file) {
          console.error("No file found in request payload");
          return res.status(400).json({ error: "No file uploaded in form data" });
        }

        console.log("File received successfully:", req.file.originalname, "saved to", req.file.path);

        const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
        const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
        let publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

        const hasR2 = !!(accountId && accessKeyId && secretAccessKey && bucketName && publicUrl);

        if (hasR2) {
          try {
            console.log("Uploading file to Cloudflare R2...");
            
            const r2Client = new S3Client({
              region: "auto",
              endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
              },
            });

            const contentType = req.file.mimetype || "application/octet-stream";
            const fileKey = `uploads/${Date.now()}-${req.file.filename}`;

            const uploadParams = {
              Bucket: bucketName,
              Key: fileKey,
              Body: fs.readFileSync(req.file.path),
              ContentType: contentType,
            };

            const command = new PutObjectCommand(uploadParams);
            await r2Client.send(command);

            if (publicUrl.endsWith('/')) {
              publicUrl = publicUrl.slice(0, -1);
            }
            
            const finalUrl = `${publicUrl}/${fileKey}`;
            console.log("Cloudflare R2 Upload Success. Public URL:", finalUrl);

            // Delete temporary local file on success
            try {
              fs.unlinkSync(req.file.path);
            } catch (e) {
              console.warn("Could not delete local tmp file:", e);
            }

            return res.json({ url: finalUrl, r2: true });
          } catch (r2Error: any) {
            console.error("Cloudflare R2 Upload Error, falling back to local:", r2Error);
            return res.json({ 
              url: `/uploads/${req.file.filename}`, 
              r2: false, 
              error: "Cloudflare R2 upload error: " + r2Error.message 
            });
          }
        } else {
          console.log("Cloudflare R2 parameters not configured or incomplete. Storing file locally.");
          return res.json({ 
            url: `/uploads/${req.file.filename}`, 
            r2: false,
            warning: "Cloudflare R2 config not fully complete. Stored locally." 
          });
        }
      } catch (innerError: any) {
        console.error("Unhandled error inside upload handler:", innerError);
        return res.status(500).json({ error: innerError.message || "Internal server error during upload" });
      }
    });
  });

  
  app.get('/api/download', async (req, res) => {
    try {
      const url = req.query.url as string;
      const filename = (typeof req.query.filename === "string" ? req.query.filename : null) || "download";

      if (!url || typeof url !== 'string') {
        return res.status(400).send("No URL provided");
      }

      if (url.startsWith('/uploads/')) {
        const localPath = path.join('/tmp', 'uploads', url.substring('/uploads/'.length));
        if (fs.existsSync(localPath)) {
          let downloadName = filename as string;
          const extMatch = localPath.match(/\.[a-zA-Z0-9]+$/);
          if (extMatch && !downloadName.includes('.')) {
            const lowerName = downloadName.toLowerCase();
            if (lowerName === "download" || lowerName === "document" || lowerName === "attachment" || lowerName === "download.zip" || lowerName.startsWith("download")) {
              downloadName += extMatch[0];
            } else {
              downloadName += extMatch[0];
            }
          }
          return res.download(localPath, downloadName);
        }
        return res.status(404).send("Local file not found");
      }

      const fetchUrl = url;

      const fetchResp = await fetch(fetchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!fetchResp.ok) throw new Error("Failed to fetch remote URL <" + fetchUrl + ">: " + fetchResp.statusText + " (" + fetchResp.status + ")");

      let extractedFilename = filename as string;
      const remoteDisposition = fetchResp.headers.get('content-disposition');
      if (remoteDisposition) {

        const filenameStarMatch = remoteDisposition.match(/filename\*=UTF-8''([^;]+)/i);
        const filenameMatch = remoteDisposition.match(/filename="?([^";]+)"?/i);
        if (filenameStarMatch && filenameStarMatch[1]) {
          extractedFilename = decodeURIComponent(filenameStarMatch[1]);
        } else if (filenameMatch && filenameMatch[1]) {
          extractedFilename = filenameMatch[1];
        }
      }

      if (!extractedFilename) extractedFilename = "download";
      
      const lowerName = extractedFilename.toLowerCase();
      if (lowerName === "download" || lowerName === "document" || lowerName === "attachment" || lowerName === "download.zip" || lowerName.startsWith("download") || !extractedFilename.includes('.')) {
        try {
          const urlObj = new URL(url);
          const decodedPath = decodeURIComponent(urlObj.pathname);
          const parts = decodedPath.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart.includes('.')) {
            extractedFilename = lastPart;
          }
        } catch (e) {}
      }

      let safeFilename = (extractedFilename || "download").replace(/["\\/]/g, "");
      
      // Strip multiple layers of timestamp prefixes (matches 10-15 digits followed by a dash)
      while (safeFilename.match(/^\d{10,15}-/)) {
          safeFilename = safeFilename.replace(/^\d{10,15}-/, '');
      }
      // Also strip shorter numeric prefixes that might be part of a double-timestamp
      while (safeFilename.match(/^\d{5,15}-/)) {
          safeFilename = safeFilename.replace(/^\d{5,15}-/, '');
      }

      const contentType = fetchResp.headers.get('content-type') || '';
      if (!safeFilename.includes('.') && contentType) {
        const mimeToExt: Record<string, string> = {
          'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp',
          'application/pdf': 'pdf', 'application/msword': 'doc', 'text/plain': 'txt',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/vnd.ms-excel': 'xls', 'application/csv': 'csv', 'text/csv': 'csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'video/mp4': 'mp4', 'audio/mpeg': 'mp3', 'application/zip': 'zip',
          'application/x-zip-compressed': 'zip', 'application/vnd.rar': 'rar',
          'application/x-rar-compressed': 'rar', 'application/octet-stream': 'bin',
          'application/vnd.android.package-archive': 'apk'
        };
        const ext = mimeToExt[contentType.split(';')[0].toLowerCase() as any];
        if (ext) {
          safeFilename += '.' + ext;
        }
      }

      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`);
      res.setHeader('Content-Type', fetchResp.headers.get('content-type') || 'application/octet-stream');
      
      const contentLength = fetchResp.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }
      
      if (fetchResp.body) {
        const readableNodeStream = Readable.fromWeb(fetchResp.body as any);
        readableNodeStream.pipe(res);
      } else {
        res.end();
      }

    } catch (e: any) {
      console.error("Proxy download error:", e);
      res.status(500).send("Download failed: " + (e.message || String(e)));
    }
  });

  app.use('/uploads', express.static(uploadsDir));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', async (req, res) => {
      const postId = req.query.postId as string;
      const indexPath = path.join(distPath, 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send("Page not found");
      }

      let html = fs.readFileSync(indexPath, 'utf-8');

      if (postId) {
        try {
          const fetchObj = typeof fetch !== 'undefined' ? fetch : (await import('node-fetch')).default as any;
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/posts/${postId}`;
          const firestoreResp = await fetchObj(firestoreUrl);
          
          if (firestoreResp.ok) {
            const data = await firestoreResp.json();
            const fields = data.fields || {};

            const postTitle = fields.title?.stringValue || "E-Vedhika Post";
            const rawContent = fields.content?.stringValue || "";
            const postDesc = rawContent.slice(0, 160) + (rawContent.length > 160 ? "..." : "");
            const mediaUrl = fields.mediaUrl?.stringValue || "";

            html = html.replace(/<title>.*?<\/title>/, `<title>${postTitle} - E-Vedhika</title>`);
            html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${postTitle}" />`);
            html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${postDesc}" />`);
            if (mediaUrl) {
              html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${mediaUrl}" />`);
            }
            html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />`);
          }
        } catch (err) {
          console.error("Failed to generate dynamic OG preview:", err);
        }
      }
      
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {

  });
}

startServer();
