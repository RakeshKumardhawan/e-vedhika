const fs = require('fs');
let content = fs.readFileSync('src/components/admin/UserChatManagement.tsx', 'utf8');

// Add sweetalert import
content = content.replace("import { MessageSquare, Search, Trash2, Ban } from 'lucide-react';", "import { MessageSquare, Search, Trash2, Ban } from 'lucide-react';\nimport Swal from 'sweetalert2';");

// Fix sorting logic
content = content.replace(
  "setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any, b:any) => b.createdAt - a.createdAt));",
  "setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any, b:any) => (b.time || b.createdAt || 0) - (a.time || a.createdAt || 0)));"
);

// Fix block and delete functions
const replaceFns = `
  const handleBlockUser = async (uid: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to block (suspend) this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, block user"
    });
    
    if(res.isConfirmed) {
      try {
        await updateDoc(doc(db, "users", uid), { role: "suspended" });
        Swal.fire("Suspended", "User has been suspended.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Failed to block user.", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    
    if(res.isConfirmed) {
      try {
        await deleteDoc(doc(db, "chat", id));
        Swal.fire("Deleted!", "Message has been deleted.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Failed to delete message.", "error");
      }
    }
  };
`;

const regexFns = /const handleBlockUser = async \(uid: string\) => \{[\s\S]*?const handleDelete = async \(id: string\) => \{[\s\S]*?  \};/m;

content = content.replace(regexFns, replaceFns.trim());

fs.writeFileSync('src/components/admin/UserChatManagement.tsx', content, 'utf8');
