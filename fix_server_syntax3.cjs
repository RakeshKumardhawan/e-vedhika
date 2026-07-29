const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const badBlock = `    } else {
      res.status(404).json({ success: false, message: "Job not found." });
    }
  });

  app.post("/api/farmer-jobs/:id/feedback"`;

const goodBlock = `  });

  app.post("/api/farmer-jobs/:id/feedback"`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync('server.ts', code);
