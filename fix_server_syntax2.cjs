const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const badBlock = `  // Check job status REST endpoint
  app.get("/api/farmer-registry/jobs/:id", verifyToken, (req, res) => {
    const job = farmerJobs[req.params.id];
    if (!job) {
      return res.status(404).json({ error: "Verification job not found." });
    }
    const userRole = (req as any).user?.email === "rakeshkumardhawan123@gmail.com" || (req as any).user?.email === "Rakeshkumardhawan123@gmail.com" ? "admin" : "user";
    if (userRole !== "admin" && job.uid !== (req as any).user?.uid) {
          return res.status(403).json({ error: "Forbidden: You can only delete your own jobs" });
      }

      console.log(\`[ADMIN] Deleting farmer job: \${id}\`);`;

const goodBlock = `  // Check job status REST endpoint
  app.get("/api/farmer-registry/jobs/:id", verifyToken, (req, res) => {
    const job = farmerJobs[req.params.id];
    if (!job) {
      return res.status(404).json({ error: "Verification job not found." });
    }
    const userRole = (req as any).user?.email === "rakeshkumardhawan123@gmail.com" || (req as any).user?.email === "Rakeshkumardhawan123@gmail.com" ? "admin" : "user";
    if (userRole !== "admin" && job.uid !== (req as any).user?.uid) {
        return res.status(403).json({ error: "Forbidden" });
    }
    res.json(job);
  });

  app.delete("/api/farmer-registry/jobs/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const job = farmerJobs[id];
    if (!job) {
      return res.status(404).json({ error: "Verification job not found." });
    }
    const userRole = (req as any).user?.email === "rakeshkumardhawan123@gmail.com" || (req as any).user?.email === "Rakeshkumardhawan123@gmail.com" ? "admin" : "user";
    if (userRole !== "admin" && job.uid !== (req as any).user?.uid) {
        return res.status(403).json({ error: "Forbidden" });
    }
    console.log(\`[ADMIN] Deleting farmer job: \${id}\`);`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync('server.ts', code);
