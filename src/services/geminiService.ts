import { fetchLiveDatabaseSnapshot, buildDatabaseContextPrompt, DatabaseSnapshot } from './dbAnalysisService';
import { EVEDHIKA_KNOWLEDGE_BASE } from '../data/evedhikaKnowledgeBase';

export interface ManaResponse {
  text: string;
  dbSnapshot?: DatabaseSnapshot;
}

export async function askMana(prompt: string, context: string = ""): Promise<ManaResponse> {
  try {
    // Fetch live database snapshot from Firestore for real analysis
    let dbContextPrompt = "";
    let dbSnapshot: DatabaseSnapshot | undefined;

    try {
      dbSnapshot = await fetchLiveDatabaseSnapshot();
      dbContextPrompt = buildDatabaseContextPrompt(dbSnapshot);
    } catch (dbErr) {
      console.warn("Could not fetch database snapshot for Gemini AI:", dbErr);
    }

    const systemInstruction = `You are "E-Vedhika AI Assistant" (ఈ-వేదిక AI అసిస్టెంట్), the official grounded conversational chatbot for the E-Vedhika Telangana Government Portal.

    STRICT BOUNDARY & GROUNDING INSTRUCTIONS:
    1. KNOWLEDGE BASE GROUNDING:
       You must ONLY respond using the E-Vedhika Knowledge Base and E-Vedhika portal domain provided below.
       ${EVEDHIKA_KNOWLEDGE_BASE}

    2. STRICT UNRELATED QUERY REJECTION:
       If the user asks any question NOT related to E-Vedhika, Panchayat Secretaries, Telangana Panchayat Raj Act 2018, GOs, UBD tracker, Farmer Registry, C# PC Diagnostics, or Gram Panchayat services (e.g., movies, general entertainment, unrelated coding, generic recipes, weather, general sports), you MUST IMMEDIATELY refuse politely in Telugu:
       "క్షమించాలి! నేను కేవలం E-Vedhika పోర్టల్, పంచాయతీ కార్యదర్శుల విధులు, జీవోలు, UBD ట్రాకర్, రైతు రిజిస్ట్రీ మరియు గ్రామ పంచాయతీ సేవలకు సంబంధించిన ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను. దయచేసి E-Vedhika కు సంబంధించిన ప్రశ్నను అడగండి."

    3. LANGUAGE & TONE:
       - Respond in clear, helpful Telugu (తెలుగు) by default. Code snippets or technical identifiers can remain in English.
       - Keep responses conversational, concise, well-structured, and helpful.

    4. LIVE DATABASE Snapshot Context:
       ${dbContextPrompt}

    Context of current user location: ${context}

    Always identify yourself as "E-Vedhika AI Assistant".`;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    if (!res.ok) {
      throw new Error("Failed to communicate with AI server route");
    }

    const data = await res.json();
    return {
      text: data.text || "క్షమించాలి, ప్రస్తుతం నేను స్పందించలేకపోతున్నాను. దయచేసి మళ్ళీ ప్రయత్నించండి.",
      dbSnapshot
    };
  } catch (error) {
    console.error("E-Vedhika AI Error:", error);
    return {
      text: "క్షమించాలి, ప్రస్తుతం నేను స్పందించలేకపోతున్నాను. దయచేసి మళ్ళీ ప్రయత్నించండి."
    };
  }
}
