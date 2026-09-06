const fs = require('fs');
let content = fs.readFileSync('src/components/admin/UserChatManagement.tsx', 'utf8');

content = content.replace("import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';", "import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';");
content = content.replace("const { updateDoc } = require('firebase/firestore');", "");

fs.writeFileSync('src/components/admin/UserChatManagement.tsx', content, 'utf8');
