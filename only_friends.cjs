const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    // If no search query, only show "Friends" (Following) and active conversations
    return filteredUsers.filter(u => 
      u.lastMessageAt > 0 || (userProfile?.following || []).includes(u.id)
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);`;

const replacement = `    // If no search query, only show "Friends" (Following)
    return filteredUsers.filter(u => 
      (userProfile?.following || []).includes(u.id)
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);`;

if(content.includes(targetStr)) {
  fs.writeFileSync('src/App.tsx', content.replace(targetStr, replacement));
  console.log("Replaced successfully!");
} else {
  console.log("Could not find target string.");
}
