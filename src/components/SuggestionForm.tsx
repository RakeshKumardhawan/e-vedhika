import React, { useState } from "react";
import { Send, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { requireLoginAlert, handleFirestoreError } from "../lib/utils";
import { OperationType } from "../types";

export default function SuggestionForm({
  addToast,
  onCancel,
  logUserActivity,
}: {
  addToast: (s: string) => void;
  onCancel: () => void;
  logUserActivity: (s: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("General Suggestion");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (requireLoginAlert()) return;
    if (!name || !suggestion) {
      addToast("దయచేసి పేరు మరియు సూచన నింపండి");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "suggestions"), {
        name,
        userEmail: auth.currentUser?.email || "",
        userId: auth.currentUser?.uid || "",
        village: village || "Not specified",
        mobile: mobile || "Not specified",
        category,
        suggestion: suggestion,
        text: suggestion,
        status: "pending",
        time: Date.now(),
        createdAt: Date.now(),
      });
      await logUserActivity(`Submitted Suggestion: ${category}`);
      setSubmitted(true);
      addToast("మీ సూచన విజయవంతంగా పంపబడింది!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "suggestions");
      addToast("Error submitting suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-10 text-center space-y-6 bg-white rounded-[24px]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
          విజయవంతంగా పంపబడింది!
        </h2>
        <p className="text-slate-500 font-bold">
          మీ సూచన మా దృష్టికి వచ్చింది. ధన్యవాదాలు.
        </p>

        <div className="gap-3 flex flex-col pt-4">
          <button
            aria-label="Send another suggestion"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setVillage("");
              setMobile("");
              setCategory("General Suggestion");
              setSuggestion("");
            }}
            className="bg-[#a855f7] text-white py-4 rounded-2xl font-black shadow-lg hover:opacity-90"
          >
            మరో సూచన పంపండి
          </button>
          <button
            aria-label="Go back"
            onClick={onCancel}
            className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200"
          >
            తిరిగి వెళ్ళండి
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 overflow-hidden rounded-[24px] bg-white">
      <div className="bg-[#a855f7] p-8 text-white relative">
        <h2 className="text-2xl font-black tracking-tighter">
          Portal Feedback & Suggestions
        </h2>
        <p className="text-white/80 font-bold text-sm">
          మీ విలువైన సూచనలను ఇక్కడ తెలియజేయండి
        </p>
        <button
          aria-label="Close suggestion form"
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              మీ పేరు
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#a855f7]/50 font-bold text-slate-700"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              మొబైల్ నంబర్ (ఐచ్ఛికం)
            </label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              placeholder="Mobile Number"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#a855f7]/50 font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            విలేజ్ / మండలం
          </label>
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Village / Mandal"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#a855f7]/50 font-bold text-slate-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            విభాగం
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#a855f7]/50 font-bold text-slate-700 appearance-none"
          >
            <option value="General Suggestion">General Suggestion</option>
            <option value="App Improvement">App Improvement</option>
            <option value="Service Feedback">Service Feedback</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Request Feature">Request Feature</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            మీ సూచన
          </label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="మీ సూచనను ఇక్కడ వ్రాయండి..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#a855f7]/50 min-h-[120px] font-bold text-slate-700"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            aria-label="Submit Suggestion"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex-1 bg-[#a855f7] text-white py-4 rounded-2xl font-black shadow-lg hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? "పంపిస్తున్నాము..." : "Submit Suggestion"}
          </button>
        </div>
      </div>
    </div>
  );
}
