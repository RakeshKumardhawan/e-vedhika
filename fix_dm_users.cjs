const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    const q = dmSearchQuery.toLowerCase();
    if (q) {
      return filteredUsers.filter(u => 
        (u.name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.district || "").toLowerCase().includes(q) ||
        (u.designation || "").toLowerCase().includes(q)
      ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    }
    
    return filteredUsers.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [allUsers, allDmMessages, user, dmSearchQuery]);`;

const replacement = `    const q = dmSearchQuery.toLowerCase();
    if (q) {
      return filteredUsers.filter(u => 
        (u.name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.district || "").toLowerCase().includes(q) ||
        (u.designation || "").toLowerCase().includes(q)
      ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    }
    
    // If no search query, only show "Friends" (Following) and active conversations
    return filteredUsers.filter(u => 
      u.lastMessageAt > 0 || (userProfile?.following || []).includes(u.id)
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [allUsers, allDmMessages, user, dmSearchQuery, userProfile]);`;

if(content.includes(targetStr)) {
  fs.writeFileSync('src/App.tsx', content.replace(targetStr, replacement));
  console.log("Replaced successfully!");
} else {
  console.log("Could not find target string.");
}
