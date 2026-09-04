import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase"; // App.tsx imports from "../firebase", this is inside components/
import { Edit3, Save, Info } from "lucide-react";

export function StaticPagesAdmin({ addToast }: any) {
  const [pages, setPages] = useState<Record<string, { title: string, content: string }>>({
    about: { title: "", content: "" },
    privacy: { title: "", content: "" },
    terms: { title: "", content: "" },
    contact: { title: "", content: "" },
  });
  const [activePage, setActivePage] = useState<"about" | "privacy" | "terms" | "contact">("about");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "static_pages"));
        if (snap.exists() && snap.data()) {
          setPages(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (err) {
        console.error("Error fetching static pages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "settings", "static_pages"), pages, { merge: true });
      addToast("పేజీ విజయవంతంగా సేవ్ చేయబడింది! (Saved successfully)");
    } catch (err) {
      console.error(err);
      addToast("పేజీని సేవ్ చేయడంలో లోపం. (Error saving)");
    }
  };

  const handleContentChange = (val: string) => {
    setPages(prev => ({
      ...prev,
      [activePage]: { ...prev[activePage], content: val }
    }));
  };

  const handleTitleChange = (val: string) => {
    setPages(prev => ({
      ...prev,
      [activePage]: { ...prev[activePage], title: val }
    }));
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading Editor...</div>;
  }

  const pageLabels: Record<string, string> = {
    about: "About Us (గురించి)",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    contact: "Contact Us (సంప్రదించండి)"
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center shadow-sm border border-indigo-100/50">
          <Edit3 size={28} />
        </div>
        <div>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
            Static Pages Editor
          </h4>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            ఎడిట్ చేయండి: About, Privacy, Terms, Contact
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(pageLabels) as Array<"about" | "privacy" | "terms" | "contact">).map(key => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
              activePage === key 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {pageLabels[key]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Page Title (శీర్షిక)
            </label>
            <input
              type="text"
              value={pages[activePage]?.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={`Enter title for ${pageLabels[activePage]}`}
              className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Content (విషయం - HTML/Markdown Supported)
            </label>
            <textarea
              rows={15}
              value={pages[activePage]?.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="HTML లేదా Markdown లో మీ కంటెంట్ ఇక్కడ రాయండి..."
              className="w-full bg-slate-50 border-slate-100 rounded-3xl p-6 font-medium text-sm outline-none focus:border-indigo-500 transition-all leading-relaxed custom-scrollbar font-mono"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save size={18} /> సేవ్ చేయండి (Save)
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 max-w-4xl">
        <div className="w-10 h-10 bg-amber-400 text-amber-900 rounded-xl flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900/60 uppercase tracking-widest mb-1">
            Admin Tip
          </p>
          <p className="text-sm font-bold text-amber-900 leading-relaxed">
            ఈ పేజీలో మీరు చేసే మార్పులు నేరుగా పబ్లిక్ సైట్‌లో (Contact Us, About Us మొ.) ప్రతిబింబిస్తాయి. HTML ట్యాగ్స్ లేదా మార్క్‌డౌన్ (Markdown) ను ఉపయోగించి టెక్స్ట్ స్టైలింగ్ చేసుకోవచ్చు.
          </p>
        </div>
      </div>
    </div>
  );
}
