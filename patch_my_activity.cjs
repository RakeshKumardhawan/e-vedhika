const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /function MyActivity\(\{ user, userProfile, problems, suggestions, posts, setShowProfileModal \}: any\) \{/g;
const replacement = `
function MyActivity({ user, userProfile, problems, suggestions, posts, setShowProfileModal }: any) {
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "support_tickets"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setSupportTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any, b:any) => b.updatedAt - a.updatedAt));
    });
    return () => unsub();
  }, [user]);

  const handleSubmitSupport = async () => {
    if(!supportSubject.trim() || !supportMessage.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "support_tickets"), {
        uid: user.uid,
        userName: userProfile?.username || user.displayName || "User",
        subject: supportSubject,
        status: "new",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      await addDoc(collection(db, "support_tickets", docRef.id, "messages"), {
        senderId: user.uid,
        senderName: userProfile?.username || user.displayName || "User",
        text: supportMessage,
        time: Date.now()
      });
      setShowSupportModal(false);
      setSupportSubject("");
      setSupportMessage("");
      Swal.fire("Success", "Your message has been sent to the Admin.", "success");
    } catch(e) {
      console.error(e);
      Swal.fire("Error", "Could not send message.", "error");
    }
  };
`;

content = content.replace(regex, replacement);

const buttonAddRegex = /<button\s+aria-label="My Problems"/g;
const buttonAddReplacement = `
        <button
          aria-label="Support Tickets"
          onClick={() => setActiveTab("support")}
          className={\`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap \${activeTab === "support" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}\`}
        >
          Message Admin (\${supportTickets.length})
        </button>
        <button aria-label="My Problems"`;
content = content.replace(buttonAddRegex, buttonAddReplacement);

const contentRenderRegex = /\{activeTab === "problems" &&/g;
const contentRenderReplacement = `
        {activeTab === "support" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowSupportModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-500 transition-colors flex items-center gap-2">
                <MessageSquare size={16} /> Contact Admin
              </button>
            </div>
            {supportTickets.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">You have no support tickets.</p>
              </div>
            ) : (
              supportTickets.map(t => (
                <div key={t.id} className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between items-start gap-4 hover:border-slate-300 transition-all">
                  <div className="w-full flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{t.subject}</h4>
                      <p className="text-xs text-slate-400 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={\`px-3 py-1 rounded-full text-[10px] font-black uppercase \${t.status === 'new' ? 'bg-blue-100 text-blue-800' : t.status === 'read' ? 'bg-slate-100 text-slate-800' : t.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}\`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showSupportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-lg text-slate-800">Message Admin</h3>
                <button onClick={() => setShowSupportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Subject</label>
                  <input type="text" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Brief subject" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Message</label>
                  <textarea value={supportMessage} onChange={e => setSupportMessage(e.target.value)} rows={5} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Describe your issue or request here..."></textarea>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowSupportModal(false)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSubmitSupport} className="px-4 py-2 bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 rounded-xl transition-colors">Send Message</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "problems" &&`;
content = content.replace(contentRenderRegex, contentRenderReplacement);

fs.writeFileSync('src/App.tsx', content, 'utf8');
