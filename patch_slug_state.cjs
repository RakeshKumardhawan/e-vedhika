const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  '  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);\n  const [title, setTitle] = useState(editingPost?.title || "");\n  const [content, setContent] = useState(editingPost?.content || "");',
  `  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [title, setTitle] = useState(editingPost?.title || "");
  const [customSlug, setCustomSlug] = useState(editingPost?.slug || "");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const derivedSlug = title.trim().replace(/\\s+/g, '-').toLowerCase();
  const displaySlug = customSlug || derivedSlug;
  const [content, setContent] = useState(editingPost?.content || "");`
);
fs.writeFileSync(file, code);
