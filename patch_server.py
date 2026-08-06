with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target_start = '  // Gemini Proxy\n  app.post("/api/chat", async (req, res) => {'
target_end = '  const uploadsDir = path.join(\'/tmp\', \'uploads\');'

idx_start = content.find(target_start)
idx_end = content.find(target_end, idx_start)

if idx_start != -1 and idx_end != -1:
    replacement = '''  // Gemini Proxy for E-Vedhika AI Assistant (Free Tier Only)
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || 
                     process.env.VITE_GEMINI_API_KEY || 
                     process.env.GOOGLE_API_KEY || 
                     process.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API కీ లభించలేదు. దయచేసి AI Studio సెట్టింగ్స్ > Secrets లో GEMINI_API_KEY ని కాన్ఫిగర్ చేయండి." 
        });
      }

      const { GoogleGenAI } = await import("@google/genai");

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Strict Free Tier Model
      let modelId = "gemini-3.6-flash"; 
      let response;
      try {
        response = await ai.models.generateContent({
          model: modelId,
          contents: prompt,
          config: { systemInstruction }
        });
      } catch (err: any) {
        console.warn("gemini-3.6-flash failed, falling back to gemini-flash-latest:", err?.message);
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: { systemInstruction }
        });
      }

      const text = response.text || "No response generated.";
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      let errorMessage = "క్షమించాలి, ప్రస్తుతం నేను స్పందించలేకపోతున్నాను. దయచేసి మళ్ళీ ప్రయత్నించండి."
      const errorStr = error.message || String(error);
      if (errorStr.includes("503") || errorStr.includes("high demand") || errorStr.includes("UNAVAILABLE")) {
         errorMessage = "⚠️ **Gemini AI సర్వర్ బిజీగా ఉంది (High Demand):**\\n\\nప్రస్తుతం మోడల్ పై ఒత్తిడి ఎక్కువగా ఉండటం వల్ల ఈ తాత్కాలిక సమస్య ఏర్పడింది. దయచేసి కొద్ది సేపటి తర్వాత మళ్ళీ ప్రయత్నించండి.";
      } else if (errorStr.includes("dunning decision") || errorStr.includes("PERMISSION_DENIED") || errorStr.includes("billing") || errorStr.includes("403") || errorStr.includes("API key")) {
         errorMessage = "⚠️ **Gemini API కీ వివరాలు:**\\n\\nఉచితంగా Gemini API కీ ని క్రియేట్ చేసే విధానం:\\n\\n1. **https://aistudio.google.com/** కు వెళ్ళండి.\\n2. మీ Google ఖాతాతో లాగిన్ అయి **'Create API Key'** క్లిక్ చేయండి.\\n3. ఉచితంగా పొందిన కీ ని కాపీ చేసి **Settings > Secrets** లో **GEMINI_API_KEY** గా ఆ కీ ని సేవ్ చేయండి.";
      }
      res.status(200).json({ text: errorMessage, isError: true });
    }
  });\n\n'''
    new_content = content[:idx_start] + replacement + content[idx_end:]
    with open('server.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("FAILED TO FIND TARGET", idx_start, idx_end)
