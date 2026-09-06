const fs = require('fs');

function patchPath(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import \{ db \} from '\.\.\/\.\.\/firebase';/g, "import { db } from '../../../firebase';");
  fs.writeFileSync(filePath, content, 'utf8');
}

patchPath('src/components/admin/AdminInbox.tsx');
patchPath('src/components/admin/UserChatManagement.tsx');
