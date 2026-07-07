import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const approvedSuggestions = suggestions.filter((s) => {
    if (!s.status) return false;
    return s.status.toLowerCase() === "approved";
  });`;

const replacement = `  const approvedSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      if (!s.status) return false;
      return s.status.toLowerCase() === "approved";
    });
  }, [suggestions]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
