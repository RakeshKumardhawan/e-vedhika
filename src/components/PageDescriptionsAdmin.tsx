import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { DEFAULT_PAGE_DESCRIPTIONS } from "../data/pageDescriptions";
import { Save, AlertCircle } from "lucide-react";

export function PageDescriptionsAdmin({ addToast }: { addToast: (msg: string) => void }) {
  const [descriptions, setDescriptions] = useState(DEFAULT_PAGE_DESCRIPTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "page_descriptions"));
        if (snap.exists()) {
          setDescriptions({ ...DEFAULT_PAGE_DESCRIPTIONS, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching page descriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDescriptions();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "page_descriptions"), descriptions);
      addToast("Page descriptions saved successfully!");
    } catch (err) {
      console.error("Error saving page descriptions:", err);
      addToast("Failed to save page descriptions");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = (key: string, field: 'title' | 'description', value: string) => {
    setDescriptions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading descriptions...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Page & Tool Descriptions</h2>
          <p className="text-sm text-slate-500 mt-1">Edit the descriptions shown at the top of each screen and tool.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
        {Object.entries(descriptions).map(([key, data]) => (
          <div key={key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">{key}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleUpdate(key, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => handleUpdate(key, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[80px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
