const fs = require('fs');
let content = fs.readFileSync('src/components/admin/UserChatManagement.tsx', 'utf8');

const regex = /const handleDelete = async \(id: string\) => \{/g;
const replace = `
  const handleBlockUser = async (uid: string) => {
    if(window.confirm("Are you sure you want to block (suspend) this user?")) {
      const { updateDoc } = require('firebase/firestore');
      await updateDoc(doc(db, "users", uid), { role: "suspended" });
      alert("User suspended.");
    }
  };
  
  const handleDelete = async (id: string) => {`;
content = content.replace(regex, replace);

const actionRegex = /<td className="p-4 text-right">/g;
const actionReplace = `<td className="p-4 text-right space-x-2 flex justify-end">
                  <button onClick={() => handleBlockUser(c.uid || c.senderId)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Block User">
                    <Ban size={16} />
                  </button>`;
content = content.replace(actionRegex, actionReplace);

fs.writeFileSync('src/components/admin/UserChatManagement.tsx', content, 'utf8');
