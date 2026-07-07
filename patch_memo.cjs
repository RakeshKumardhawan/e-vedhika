const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = \`  const filteredPosts = posts.filter((p) => {
    if (p.status === "Deleted") return false;
    const pStatus = (p.status || "").toLowerCase();
    if (
      !isAdmin &&
      !["approved", "active"].includes(pStatus) &&
      p.uid !== user?.uid
    )
      return false;
    const q = searchQuery.toLowerCase().trim();
    const tMatch = (p.title || "").toLowerCase().includes(q);
    const cMatch = (p.content || "").toLowerCase().includes(q);
    const searchOk = !q || tMatch || cMatch;

    if (currentFilter === "All") return searchOk;
    return (
      searchOk &&
      (p.category === currentFilter ||
        p.subCategory === currentFilter ||
        p.categories?.includes(currentFilter))
    );
  });\`;

const replacement = \`  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.status === "Deleted") return false;
      const pStatus = (p.status || "").toLowerCase();
      if (
        !isAdmin &&
        !["approved", "active"].includes(pStatus) &&
        p.uid !== user?.uid
      )
        return false;
      const q = searchQuery.toLowerCase().trim();
      const tMatch = (p.title || "").toLowerCase().includes(q);
      const cMatch = (p.content || "").toLowerCase().includes(q);
      const searchOk = !q || tMatch || cMatch;

      if (currentFilter === "All") return searchOk;
      return (
        searchOk &&
        (p.category === currentFilter ||
          p.subCategory === currentFilter ||
          p.categories?.includes(currentFilter))
      );
    });
  }, [posts, isAdmin, user?.uid, searchQuery, currentFilter]);\`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
