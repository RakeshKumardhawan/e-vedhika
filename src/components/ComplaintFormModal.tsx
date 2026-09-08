import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

export function ComplaintFormModal({ user, userProfile, onClose, addToast }: any) {
  const [ticketType, setTicketType] = useState("New Task");
  const [moduleName, setModuleName] = useState("");
  const [subModule, setSubModule] = useState("");
  const [contactNo, setContactNo] = useState(userProfile?.phone || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moduleName || !subModule || !contactNo || !subject || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'అన్ని వివరాలు తప్పనిసరి',
        text: 'దయచేసి గుర్తు (*) ఉన్న అన్ని ఫీల్డ్స్ పూరించండి.',
        confirmButtonColor: '#005bb5'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend mapping for user details despite not showing them in UI
      const userName = userProfile?.name || userProfile?.username || user?.displayName || "Unknown User";

      const ticketRef = await addDoc(collection(db, "support_tickets"), {
        userId: user.uid,
        userEmail: user.email,
        userName: userName,
        phone: contactNo.trim(),
        ticketType,
        moduleName,
        subModule,
        subject: subject.trim(),
        status: "new",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attachedFile: fileName || null
      });

      await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
        senderId: user.uid,
        senderName: userName,
        text: message.trim(),
        time: Date.now()
      });

      await addDoc(collection(db, "notifications"), {
        type: "admin_alert",
        title: "🚨 కొత్త సపోర్ట్ టికెట్",
        message: `${userName} - ${subject.substring(0, 40)}...`,
        read: false,
        time: Date.now(),
        complaintId: ticketRef.id
      }).catch(() => {});

      if (addToast) {
        addToast("టికెట్ విజయవంతంగా సమర్పించబడింది.");
      }

      setSuccessTicketId(ticketRef.id.substring(0, 8).toUpperCase());
    } catch (err) {
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
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-3 sm:p-4">
      {/* Main Container */}
      <div className="bg-[#f4f5f7] w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl relative font-sans animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
        
        {/* Header Banner */}
        <div className="bg-[#cbf5f3] py-2.5 text-center border-b border-slate-300 relative">
          <h2 className="text-[14px] font-bold text-slate-800">Ticket submission form</h2>
          <button
            onClick={onClose}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-800 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {successTicketId ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">విజయవంతంగా సమర్పించబడింది! (Submitted Successfully!)</h3>
            <p className="text-slate-600 text-[15px] max-w-md">
              మీ సమస్య/విజ్ఞప్తి మా బృందానికి చేరింది. దయచేసి భవిష్యత్తు సూచన కోసం మీ టికెట్ నంబరును సేవ్ చేసుకోండి.
            </p>
            <div className="bg-white border-2 border-dashed border-slate-300 px-6 py-4 rounded-lg">
              <p className="text-slate-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Ticket Reference Number</p>
              <p className="text-3xl font-black text-[#005bb5]">#{successTicketId}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-[#005bb5] hover:bg-[#004a94] text-white px-8 py-2.5 rounded text-[14px] font-bold shadow-md transition-all hover:shadow-lg"
            >
              Close Window
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Radios Card */}
          <div className="bg-white border border-slate-200 p-4 sm:px-6 rounded-[2px] flex flex-wrap items-center gap-8 sm:gap-16 shadow-sm">
            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="ticketType"
                value="New Task"
                checked={ticketType === "New Task"}
                onChange={(e) => setTicketType(e.target.value)}
                className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>New Task:<span className="text-red-500">*</span></span>
            </label>

            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="ticketType"
                value="Modification"
                checked={ticketType === "Modification"}
                onChange={(e) => setTicketType(e.target.value)}
                className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>Modification:<span className="text-red-500">*</span></span>
            </label>

            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="ticketType"
                value="Issues/Errors"
                checked={ticketType === "Issues/Errors"}
                onChange={(e) => setTicketType(e.target.value)}
                className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>Issues/Errors:<span className="text-red-500">*</span></span>
            </label>
          </div>

          {/* Main Form Card */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-[2px] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] text-slate-800 mb-1 font-medium">
                    Module Name:<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full border border-slate-300 p-2 text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white"
                  >
                    <option value="">--Select Module Name--</option>
                    <option value="Website">Website</option>
                    <option value="Application">Application</option>
                    <option value="Database">Database</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] text-slate-800 mb-1 font-medium">
                    Sub Module:<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subModule}
                    onChange={(e) => setSubModule(e.target.value)}
                    className="w-full border-[1.5px] border-slate-800 p-2 text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white font-medium"
                  >
                    <option value="">Select sub-module</option>
                    <option value="Authentication">Authentication / Login</option>
                    <option value="UI/UX">UI / Layout</option>
                    <option value="Functionality">Functionality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] text-slate-800 mb-1 font-medium">
                    Contact No:
                  </label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="Enter Mobile No here..."
                    className="w-full border border-slate-300 p-2 text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 flex flex-col">
                <div>
                  <label className="block text-[13px] text-slate-800 mb-1 font-medium">
                    Subject:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter Subject here..."
                    className="w-full border border-slate-300 p-2 text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-[13px] text-slate-800 mb-1 font-medium">
                    Message:<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Message *"
                    className="w-full border border-slate-300 p-2 text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white flex-1 min-h-[140px] resize-y"
                  />
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#005bb5] hover:bg-[#004a94] text-white px-3 py-1.5 text-[12px] font-bold rounded-[3px] flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus size={14} strokeWidth={3} /> Add Files
                </button>
                {fileName && <span className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">{fileName}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#005bb5] hover:bg-[#004a94] text-white px-6 py-1.5 text-[13px] font-bold rounded-[3px] transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

        </form>
        )}
      </div>
    </div>
  );
}
