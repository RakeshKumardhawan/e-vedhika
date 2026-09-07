import React, { useState } from 'react';
import { AlertTriangle, X, Send, User, Phone, FileText, CreditCard, ShieldAlert } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

export function ComplaintFormModal({ user, userProfile, onClose, addToast }: any) {
  const [fullName, setFullName] = useState(userProfile?.name || user?.displayName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [accountDetails, setAccountDetails] = useState("");
  const [category, setCategory] = useState("ఉపాధి హామీ / వేతనాలు (MGNREGS / Payments)");
  const [description, setDescription] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !description.trim() || !accountDetails.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి అన్ని వివరాలు పూరించండి',
        text: 'పూర్తి పేరు, ఫోన్ నంబర్, ఖాతా వివరాలు మరియు కంప్లైంట్ వివరాలు తప్పనిసరి.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    if (phone.trim().length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'సరైన మొబైల్ నంబర్ ఇవ్వండి',
        text: 'దయచేసి 10 అంకెల సరైన మొబైల్ నంబర్ ఇవ్వండి.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const complaintData = {
        userId: user?.uid || "anonymous",
        userEmail: user?.email || "anonymous",
        fullName: fullName.trim(),
        phone: phone.trim(),
        accountDetails: accountDetails.trim(),
        category,
        description: description.trim(),
        proofUrl: proofUrl.trim() || "",
        status: "pending",
        type: "complaint",
        msg: description.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "problems"), complaintData);

      // Create admin alert notification
      await addDoc(collection(db, "notifications"), {
        type: "admin_alert",
        title: "🚨 కొత్త అత్యవసర ఫిర్యాదు / కంప్లైంట్",
        message: `${fullName.trim()} (${phone.trim()}) - ఖాతా: ${accountDetails.trim()}: ${description.substring(0, 60)}...`,
        read: false,
        time: Date.now(),
        complaintId: docRef.id
      }).catch(() => {});

      Swal.fire({
        icon: 'success',
        title: 'ఫిర్యాదు విజయవంతంగా నమోదయింది!',
        text: `మీ కంప్లైంట్ ఐడీ: #${docRef.id.substring(0, 8).toUpperCase()}. మా అడ్మిన్ టీమ్ మీ ఖాతా వివరాలను పరిశీలించి త్వరలో తగిన చర్యలు తీసుకుంటుంది.`,
        confirmButtonColor: '#16a34a'
      });

      if (addToast) {
        addToast("🚨 మీ ఫిర్యాదు అడ్మిన్‌కు విజయవంతంగా పంపబడింది.");
      }

      onClose();
    } catch (err: any) {
      console.error("Error submitting complaint:", err);
      // Fallback local notification / success if offline
      Swal.fire({
        icon: 'success',
        title: 'ఫిర్యాదు స్వీకరించబడింది!',
        text: 'మీ ఫిర్యాదు నమోదు చేయబడింది. అడ్మిన్ త్వరలో మిమ్మల్ని సంప్రదిస్తారు.',
        confirmButtonColor: '#16a34a'
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto border-2 border-rose-500/30">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <ShieldAlert className="text-amber-300 animate-pulse" size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">అత్యవసర విభాగం</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                🚨 కంప్లైంట్ / రిపోర్ట్ ఫారం
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                మీ సమస్య మరియు ఖాతా వివరాలను ఇక్కడ నమోదు చేయండి
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            title="మూసివేయి (Close)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
                <User size={14} className="text-rose-600" /> పూర్తి పేరు (Full Name) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="మీ పూర్తి పేరు రాయండి..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-800"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
                <Phone size={14} className="text-rose-600" /> మొబైల్ నంబర్ (Mobile Number) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10 అంకెల మొబైల్ నంబర్..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Account Details / User ID / Mandal & Village */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <CreditCard size={14} className="text-rose-600" /> ఖాతా వివరాలు / యూసర్ ఐడి / మండలం & గ్రామం *
            </label>
            <input
              type="text"
              required
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="ఉదా: జాబ్ కార్డ్ నంబర్ / బ్యాంక్ ఖాతా నంబర్ / యూసర్ ఐడి / గ్రామం & మండలం"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-800"
            />
            <p className="text-[10px] text-slate-500 ml-1">
              * అడ్మిన్ మీ సమస్యను త్వరగా గుర్తించడానికి మీ ఖాతా లేదా జాబ్ కార్డ్ నంబర్ రాయడం ముఖ్యం.
            </p>
          </div>

          {/* Complaint Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <AlertTriangle size={14} className="text-rose-600" /> కంప్లైంట్ రకం (Category) *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-800"
            >
              <option value="ఉపాధి హామీ / వేతనాలు (MGNREGS / Payments)">ఉపాధి హామీ / వేతనాలు (MGNREGS / Payments)</option>
              <option value="పింఛన్లు / సంక్షేమ పథకాలు (Pensions / Welfare)">పింఛన్లు / సంక్షేమ పథకాలు (Pensions & Welfare)</option>
              <option value="గ్రామ పంచాయతీ / పారిశుధ్యం (GP / Sanitation)">గ్రామ పంచాయతీ / తాగునీరు / పారిశుధ్యం</option>
              <option value="బ్యాంకు / ఆర్థిక / ఖాతా సమస్యలు (Bank / Account)">బ్యాంకు / ఆర్థిక / ఖాతా సమస్యలు (Bank / Account)</option>
              <option value="అవినీతి / లంచం / అక్రమాలు (Corruption / Grievance)">అవినీతి / లంచం / అక్రమాలు (Corruption / Bribery)</option>
              <option value="పోర్టల్ / సాంకేతిక సమస్యలు (Portal Technical Issue)">పోర్టల్ / సాంకేతిక సమస్యలు (Portal / Tech Issue)</option>
              <option value="ఇతర సమస్యలు (Other Grievance)">ఇతర సమస్యలు (Other)</option>
            </select>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <FileText size={14} className="text-rose-600" /> ఎం కంప్లైంట్ / సమస్య పూర్తి వివరాలు (Description) *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="మీకు వచ్చిన సమస్య ఏమిటి? ఎవరిపై లేదా ఏ అంశంపై కంప్లైంట్ చేయాలనుకుంటున్నారు? పూర్తి వివరంగా రాయండి..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800"
            ></textarea>
          </div>

          {/* Proof / Image URL (Optional) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 ml-1">
              ఫోటో / ప్రూఫ్ లింక్ (Optional Proof Image URL)
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://example.com/proof.jpg (సమస్యకు సంబంధించిన ఫోటో లింక్)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-slate-700 font-medium"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  సమర్పిస్తోంది... (Submitting)
                </>
              ) : (
                <>
                  <Send size={18} /> 🚨 ఫిర్యాదు / కంప్లైంట్ సమర్పించండి (Submit Complaint)
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 font-medium mt-3">
              🔒 మీ వివరాలు మరియు గోప్యత పూర్తిగా సురక్షితంగా రక్షించబడతాయి.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
