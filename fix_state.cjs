const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove from wrong place
const wrongTarget = `  const [loading, setLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"draft" | "published">(editingPost?.status || "published");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);`;

const wrongNew = `  const [loading, setLoading] = useState(false);
  const [deepThinking, setDeepThinking] = useState(false);`;

if (code.includes(wrongTarget)) {
  code = code.replace(wrongTarget, wrongNew);
  console.log("Fixed wrong state placement");
} else {
  console.log("Wrong state placement not found");
}

// 2. Add to correct place (PostForm)
const rightTarget = `  const [loading, setLoading] = useState(false);
  const [submissionType, setSubmissionType] = useState<"post" | "complaint">(editingPost?.submissionType || (isAdmin || isEditor ? "post" : "complaint"));`;

const rightNew = `  const [loading, setLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"draft" | "published">(editingPost?.status || "published");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submissionType, setSubmissionType] = useState<"post" | "complaint">(editingPost?.submissionType || (isAdmin || isEditor ? "post" : "complaint"));`;

if (code.includes(rightTarget)) {
  code = code.replace(rightTarget, rightNew);
  console.log("Added state to PostForm");
} else {
  console.log("PostForm target not found");
}

fs.writeFileSync(file, code);
