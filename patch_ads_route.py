with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = "  app.get('/api/iframe-proxy', async (req, res) => {"

ads_route = """  // Google AdSense ads.txt explicit route
  app.get('/ads.txt', (req, res) => {
    res.type('text/plain');
    const adsTxtPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsTxtPath)) {
      return res.sendFile(adsTxtPath);
    }
    const distAdsTxtPath = path.join(process.cwd(), 'dist', 'ads.txt');
    if (fs.existsSync(distAdsTxtPath)) {
      return res.sendFile(distAdsTxtPath);
    }
    return res.send("google.com, pub-4602643637986053, DIRECT, f08c47fec0942fa0\\n");
  });

"""

if target in content:
    new_content = content.replace(target, ads_route + target, 1)
    with open('server.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully added /ads.txt route to server.ts")
else:
    print("Target not found")
