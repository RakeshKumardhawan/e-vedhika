const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add draftStatus to PostForm states
const stateTarget = 'const [loading, setLoading] = useState(false);';
const stateNew = 'const [loading, setLoading] = useState(false);\n  const [draftStatus, setDraftStatus] = useState<"draft" | "published">(editingPost?.status || "published");\n  const [showAddCategory, setShowAddCategory] = useState(false);\n  const [newCategoryName, setNewCategoryName] = useState("");';

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateNew);
} else {
  console.log('State target not found');
}

// 2. Add insertText function inside PostForm
const insertTarget = 'const handleFileUpload = async';
const insertNew = `const insertFormatting = (prefix: string, suffix: string) => {
    const textarea = document.getElementById("post-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    let replacement = prefix + selectedText + suffix;
    if (!selectedText && prefix === "[") replacement = "[link text](url)";
    
    setContent(beforeText + replacement + afterText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleFileUpload = async`;

if (code.includes(insertTarget)) {
  code = code.replace(insertTarget, insertNew);
} else {
  console.log('Insert target not found');
}

fs.writeFileSync(file, code);
