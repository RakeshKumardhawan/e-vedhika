const fs = require('fs');
let content = fs.readFileSync('src/components/admin/TechCommunityModeration.tsx', 'utf8');

const targetStr = `  const [comments, setComments] = useState([
    { id: 1, user: 'Pavan', content: 'This React tutorial is very helpful!', spamScore: 2, status: 'pending' },
    { id: 2, user: 'CryptoBot', content: 'Earn $1000 daily! Click here: http://spam.link', spamScore: 98, status: 'pending' },
    { id: 3, user: 'Anusha', content: 'Can you explain the useMemo hook?', spamScore: 5, status: 'pending' },
  ]);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
  };`;

const replacement = `  const [pendingPosts, setPendingPosts] = useState<any[]>([]);

  React.useEffect(() => {
    // Fetch posts that are pending
    const unsubscribe = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const posts: any[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.status === "Pending" || data.status === "pending") {
            posts.push({ id: d.id, ...data });
          }
        });
        setPendingPosts(posts);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'private_support') => {
    if (action === 'approve') {
      await updateDoc(doc(db, "posts", id), { status: "published" });
      
      // Audit log
      await addDoc(collection(db, "audit_logs"), {
        action: "Post Published",
        target: id,
        timestamp: Date.now(),
        actor: "Admin"
      });
    } else if (action === 'reject') {
      await updateDoc(doc(db, "posts", id), { status: "rejected" });
      
      // Audit log
      await addDoc(collection(db, "audit_logs"), {
        action: "Post Rejected",
        target: id,
        timestamp: Date.now(),
        actor: "Admin"
      });
    } else if (action === 'private_support') {
      await updateDoc(doc(db, "posts", id), { status: "private_support" });
      
      // Audit log
      await addDoc(collection(db, "audit_logs"), {
        action: "Post Moved to Private Support",
        target: id,
        timestamp: Date.now(),
        actor: "Admin"
      });
      alert("Post moved to private support. It will not be visible publicly.");
    }
  };`;

content = content.replace(targetStr, replacement);
content = content.replace("import { MessageSquare, Shield, CheckCircle, Trash2, Bot, AlertTriangle } from 'lucide-react';", "import { MessageSquare, Shield, CheckCircle, Trash2, Bot, AlertTriangle, MessageCircle } from 'lucide-react';\nimport { collection, onSnapshot, query, doc, updateDoc, addDoc } from 'firebase/firestore';\nimport { db } from '../../../firebase';");

// Replace mapping
const mapRegex = /\{comments\.filter\(c => c\.status === 'pending'\)\.map\(item => \([\s\S]*?<\/tr>\n\s*\)\)}/m;

const newMap = `{pendingPosts.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <td className="p-3 font-bold text-slate-800">{item.userName || "User"}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{item.title || item.content}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">
                      Pending
                    </span>
                  </td>
                  <td className="p-3 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleAction(item.id, 'approve')}
                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Publish as Post"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'private_support')}
                      className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip-trigger" title="Move to Private Support"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'reject')}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors tooltip-trigger" title="Reject"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}`;

content = content.replace(mapRegex, newMap);

fs.writeFileSync('src/components/admin/TechCommunityModeration.tsx', content, 'utf8');
