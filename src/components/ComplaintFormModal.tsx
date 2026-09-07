import React, { useState } from 'react';
import { AlertTriangle, X, Send, User, Phone, FileText, Mail, HelpCircle, ShieldAlert } from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

export function ComplaintFormModal({ user, userProfile, onClose, addToast }: any) {
  const [fullName, setFullName] = useState(userProfile?.name || userProfile?.username || user?.displayName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [category, setCategory] = useState("Website");
  const [otherCategoryDetails, setOtherCategoryDetails] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'దయచేసి అన్ని వివరాలు పూరించండి',
        text: 'పూర్తి పేరు, ఫోన్ నంబర్ మరియు మీ సమస్య/సందేహం తప్పనిసరి.',
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

    if (category === "Other" && !otherCategoryDetails.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'వివరాలు తెలుపగలరు',
        text: 'దయచేసి "ఇతర (Other)" సమస్య ఏమిటో కింద బాక్స్‌లో రాయండి.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalName = fullName.trim();
      
      // Update user profile name if changed
      const currentProfileName = userProfile?.name || userProfile?.username || user?.displayName || "";
      if (finalName !== currentProfileName) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            name: finalName
          });
        } catch (err) {
          console.error("Failed to update profile name", err);
        }
      }

      // 1. Create main support ticket
      const finalCategory = category === "Other" ? `Other: ${otherCategoryDetails.trim()}` : category;
      
      const ticketRef = await addDoc(collection(db, "support_tickets"), {
        userId: user.uid,
        userEmail: user.email,
        userName: finalName,
        phone: phone.trim(),
        subject: finalCategory,
        category: category,
        status: "new",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // 2. Add the main message to the subcollection
      await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
        senderId: user.uid,
        senderName: finalName,
        text: message.trim(),
        time: Date.now()
      });

      // Create admin alert notification for faster response
      await addDoc(collection(db, "notifications"), {
        type: "admin_alert",
        title: "🚨 కొత్త సపోర్ట్ రిక్వెస్ట్ / కంప్లైంట్",
        message: `${finalName} (${phone.trim()}): ${message.substring(0, 60)}...`,
        read: false,
        time: Date.now(),
        complaintId: ticketRef.id
      }).catch(() => {});

      Swal.fire({
        icon: 'success',
        title: 'ఫిర్యాదు విజయవంతంగా నమోదయింది!',
        text: `మీ సపోర్ట్ టికెట్ ఐడీ: #${ticketRef.id.substring(0, 8).toUpperCase()}. అడ్మిన్ ప్యానెల్ ద్వారా మా టీమ్ దీనిని పరిశీలించి మీకు సమాధానం ఇస్తుంది.`,
        confirmButtonColor: '#16a34a'
      });

      if (addToast) {
        addToast("🚨 మీ సపోర్ట్ రిక్వెస్ట్ అడ్మిన్‌కు విజయవంతంగా పంపబడింది.");
      }

      onClose();
    } catch (err: any) {
      console.error("Error submitting support request:", err);
      Swal.fire({
        icon: 'error',
        title: 'లోపం ఏర్పడింది!',
        text: 'దయచేసి నెట్‌వర్క్ కనెక్షన్ సరిచూసుకుని మళ్లీ ప్రయత్నించండి.',
        confirmButtonColor: '#e11d48'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 sm:p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <HelpCircle className="text-white animate-pulse" size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-400/30 text-blue-50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-400/40">సపోర్ట్ & కంప్లైంట్</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                సపోర్ట్ రిక్వెస్ట్ ఫారం
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                మీ సందేహం లేదా సమస్యను అడ్మిన్‌కు పంపండి
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
            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
                <User size={14} className="text-blue-600" /> పూర్తి పేరు (Name) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="మీ పేరు రాయండి..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 transition-all"
              />
            </div>

            {/* 2. Email (Locked) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
                <Mail size={14} className="text-slate-400" /> ఈమెయిల్ (Email) 🔒
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || "No Email Found"}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed select-none opacity-80"
                title="ఈమెయిల్ మార్చడం కుదరదు"
              />
            </div>
          </div>

          {/* 3. Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <Phone size={14} className="text-blue-600" /> మొబైల్ నంబర్ (Phone Number) *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="10 అంకెల మొబైల్ నంబర్..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 transition-all"
            />
          </div>

          {/* 4. Support Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <AlertTriangle size={14} className="text-blue-600" /> సమస్య రకం (Category) *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 transition-all"
            >
              <option value="Website">వెబ్‌సైట్ సమస్య (Website Issue)</option>
              <option value="Application">అప్లికేషన్ / యాప్ సమస్య (Application Issue)</option>
              <option value="Other">ఇతర (Other)</option>
            </select>
          </div>

          {/* Conditionally render Other Category Details */}
          {category === "Other" && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
                ఇతర సమస్య వివరాలు (Specify Other) *
              </label>
              <input
                type="text"
                required
                value={otherCategoryDetails}
                onChange={(e) => setOtherCategoryDetails(e.target.value)}
                placeholder="ఏమి సమస్య? దయచేసి వివరంగా పేర్కొనండి..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-800 transition-all"
              />
            </div>
          )}

          {/* 5. Detailed Message / Comment */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 ml-1">
              <FileText size={14} className="text-blue-600" /> మీ సందేశం / సమస్య (Message / Comment) *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="మీ పూర్తి సమస్య లేదా సందేహాన్ని ఇక్కడ స్పష్టంగా రాయండి..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 transition-all resize-y min-h-[120px]"
            ></textarea>
          </div>

          {/* 6. Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  సమర్పిస్తోంది... (Submitting)
                </>
              ) : (
                <>
                  <Send size={18} /> రిక్వెస్ట్ పంపండి (Submit Request)
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 font-medium mt-3 flex items-center justify-center gap-1">
              <ShieldAlert size={12} className="text-slate-400" />
              ఈ సపోర్ట్ టికెట్ ప్రైవేట్, మీరు మరియు అడ్మిన్ మాత్రమే చూడగలరు.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
