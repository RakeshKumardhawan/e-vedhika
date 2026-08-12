const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add state and effect in PostCard
const search = `function PostCard({
  post,
  isExpanded,
  toggleExpansion,
  addToast,
  isAdmin,
  onEdit,
  allUsers,
  userProfile,
  storageConfig,
}: {
  post: Post;
  isExpanded: boolean;
  toggleExpansion: () => void;
  addToast: (s: string) => void;
  isAdmin: boolean;
  onEdit: (p: Post) => void;
  allUsers: UserProfile[];
  userProfile?: UserProfile | null;
  storageConfig?: "cloudflare" | "firebase";
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localExpanded, setLocalExpanded] = useState(false);`;

const replace = `function PostCard({
  post,
  isExpanded,
  toggleExpansion,
  addToast,
  isAdmin,
  onEdit,
  allUsers,
  userProfile,
  storageConfig,
}: {
  post: Post;
  isExpanded: boolean;
  toggleExpansion: () => void;
  addToast: (s: string) => void;
  isAdmin: boolean;
  onEdit: (p: Post) => void;
  allUsers: UserProfile[];
  userProfile?: UserProfile | null;
  storageConfig?: "cloudflare" | "firebase";
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localExpanded, setLocalExpanded] = useState(false);
  
  const [commentPulse, setCommentPulse] = useState(false);
  const prevCommentCount = useRef(post?.commentCount || 0);
  
  useEffect(() => {
    if (post?.commentCount > (prevCommentCount.current || 0)) {
      setCommentPulse(true);
      const timer = setTimeout(() => setCommentPulse(false), 2000);
      prevCommentCount.current = post.commentCount;
      return () => clearTimeout(timer);
    }
    prevCommentCount.current = post?.commentCount || 0;
  }, [post?.commentCount]);`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched PostCard hooks");
} else {
  console.log("Could not find PostCard definition");
}
