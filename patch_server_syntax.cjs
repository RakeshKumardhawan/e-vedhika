const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  'return res.status(400).json({ error: "దయ  app.post(\'/api/ubd/data\'',
  'return res.status(400).json({ error: "దయచేసి క్యాప్చా ఎంటర్ చేయండి" });\n    }\n    job.captchaCode = code;\n    job.status = "captcha_solved";\n    saveFarmerJobs();\n    res.json({ success: true, message: "Captcha submitted" });\n  });\n\n  app.post(\'/api/ubd/data\''
);
fs.writeFileSync('server.ts', code);
